#!/usr/bin/env bash
# ============================================================================
#  wp.sh - Respaldos, restauración y clonado del stack WordPress + Docker
# ============================================================================
#  Uso:
#    ./scripts/wp.sh backup
#    ./scripts/wp.sh restore [carpeta-de-respaldo]
#    ./scripts/wp.sh reset
#    ./scripts/wp.sh new-client <nombre> [WP_PORT] [DB_PORT] [UI_PORT] [SMTP_PORT]
#    ./scripts/wp.sh fix-urls <url-antigua> <url-nueva>
#    ./scripts/wp.sh help
#
#  Ejemplos:
#    ./scripts/wp.sh backup
#    ./scripts/wp.sh restore backups/with-docker-20261030-120000
#    ./scripts/wp.sh new-client cliente-b 2001 3307 8026 1026
#
#  Requisitos: docker compose v2, gzip y tar.
#  `new-client` necesita además rsync (viene de serie en macOS y Linux).
#  Funciona en macOS y Linux. En Windows, ejecútalo desde WSL o Git Bash.
#
#  Qué respalda `backup`:
#    - db.sql.gz        -> volcado lógico de MariaDB (mariadb-dump)
#    - wp-content.tar.gz -> uploads, themes, plugins y mu-plugins
#    - docker-compose.yml, env.backup y meta.txt
#
#  Qué NO hace:
#    - No copia el volumen mysql_data "en caliente" (sería un respaldo
#      inconsistente). Usa siempre el volcado SQL.
#    - No borra nada sin pedir confirmación explícita.
# ============================================================================

set -euo pipefail

# ----------------------------------------------------------------------------
#  Rutas y valores por defecto
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

BACKUP_ROOT="${BACKUP_DIR:-$PROJECT_DIR/backups}"
KEEP_BACKUPS="${KEEP_BACKUPS:-5}"

# Colores solo si la salida es una terminal (así los logs redirigidos quedan
# limpios).
if [ -t 1 ]; then
	BOLD=$'\033[1m'
	RED=$'\033[31m'
	GREEN=$'\033[32m'
	YELLOW=$'\033[33m'
	NC=$'\033[0m'
else
	BOLD='' RED='' GREEN='' YELLOW='' NC=''
fi

info()  { printf '%s==>%s %s\n' "$GREEN" "$NC" "$*"; }
warn()  { printf '%sAVISO:%s %s\n' "$YELLOW" "$NC" "$*" >&2; }
die()   { printf '%sERROR:%s %s\n' "$RED" "$NC" "$*" >&2; exit 1; }

# ----------------------------------------------------------------------------
#  Cargar configuración del .env
# ----------------------------------------------------------------------------
#  IMPORTANTE: las variables se cargan SIN exportarlas. Si se exportaran,
#  `docker compose` las heredaría y tendrían prioridad sobre el .env de otra
#  carpeta. Eso rompía `new-client`: el proyecto nuevo arrancaba con el nombre
#  y los puertos del proyecto original.
#
#  Para leerlas usamos un subshell con `set -a` y volcamos los valores con
#  `printf %q`, que los deja listos para un `eval` seguro.
load_env() {
	local file="$PROJECT_DIR/.env"
	if [ -f "$file" ]; then
		eval "$(
			set -a
			# shellcheck disable=SC1090
			. "$file" >/dev/null 2>&1
			for v in COMPOSE_PROJECT_NAME DB_NAME DB_USER DB_PASSWORD DB_ROOT_PASSWORD \
				WP_PORT DB_PORT MAILPIT_UI_PORT MAILPIT_SMTP_PORT; do
				printf '%s=%q\n' "$v" "${!v:-}"
			done
		)"
		# Si el usuario tenía alguna de estas variables exportadas en su shell,
		# le quitamos el flag de exportación para que no se filtren a Compose.
		export -n COMPOSE_PROJECT_NAME DB_NAME DB_USER DB_PASSWORD DB_ROOT_PASSWORD \
			WP_PORT DB_PORT MAILPIT_UI_PORT MAILPIT_SMTP_PORT 2>/dev/null || true
	fi

	STACK_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$PROJECT_DIR")}"
	DB_NAME="${DB_NAME:-wordpress}"
	DB_USER="${DB_USER:-wordpress}"
	DB_PASSWORD="${DB_PASSWORD:-example}"
	DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-example}"
	WP_PORT="${WP_PORT:-2000}"
	DB_PORT="${DB_PORT:-3306}"
	MAILPIT_UI_PORT="${MAILPIT_UI_PORT:-8025}"
	MAILPIT_SMTP_PORT="${MAILPIT_SMTP_PORT:-1025}"
}

# ----------------------------------------------------------------------------
#  Utilidades
# ----------------------------------------------------------------------------
confirm() {
	local answer
	read -r -p "$1 [s/N] " answer || return 1
	case "$answer" in
		s|S|si|sí|Si|Sí|y|Y|yes) return 0 ;;
		*) return 1 ;;
	esac
}

require_cmd() {
	command -v "$1" >/dev/null 2>&1 || die "Falta el comando '$1'."
}

volume_exists() {
	docker volume inspect "${STACK_NAME}_mysql_data" >/dev/null 2>&1
}

# Comprueba si un puerto del host está libre. En macOS/Linux usamos lsof; si
# no está instalado, no bloqueamos al usuario.
port_free() {
	if command -v lsof >/dev/null 2>&1; then
		! lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
	else
		return 0
	fi
}

wait_mysql() {
	printf '    Esperando a MariaDB'
	local i
	for i in $(seq 1 60); do
		if docker compose exec -T mysql \
			healthcheck.sh --connect --innodb_initialized >/dev/null 2>&1; then
			printf ' lista.\n'
			return 0
		fi
		printf '.'
		sleep 2
	done
	printf '\n'
	die "MariaDB no respondió en 120 segundos."
}

ensure_mysql() {
	if ! docker compose ps --status running --services 2>/dev/null | grep -qx mysql; then
		info "Levantando MariaDB..."
		docker compose up -d mysql >/dev/null
	fi
	wait_mysql
}

# Devuelve la ruta del respaldo más reciente. Se apoya en el archivo .ultimo
# que escribe `backup`, y si no existe, ordena por fecha de modificación.
latest_backup() {
	if [ -f "$BACKUP_ROOT/.ultimo" ]; then
		local last
		last="$(cat "$BACKUP_ROOT/.ultimo")"
		if [ -d "$last" ]; then
			printf '%s\n' "$last"
			return 0
		fi
	fi
	local dir
	dir="$(ls -1dt "$BACKUP_ROOT"/*/ 2>/dev/null | head -n 1 || true)"
	[ -n "$dir" ] || return 1
	printf '%s\n' "${dir%/}"
}

# Borra los respaldos más antiguos, conservando KEEP_BACKUPS.
prune_backups() {
	[ -d "$BACKUP_ROOT" ] || return 0
	local i=0 dir
	while IFS= read -r dir; do
		i=$((i + 1))
		if [ "$i" -gt "$KEEP_BACKUPS" ]; then
			# Seguridad: solo borrar rutas que estén dentro de BACKUP_ROOT.
			case "$dir" in
				"$BACKUP_ROOT"/*)
					printf '    Borrando respaldo antiguo: %s\n' "$(basename "$dir")"
					rm -rf -- "$dir"
					;;
			esac
		fi
	done < <(ls -1dt "$BACKUP_ROOT"/*/ 2>/dev/null || true)
}

# ----------------------------------------------------------------------------
#  backup
# ----------------------------------------------------------------------------
make_backup() {
	require_cmd gzip
	require_cmd tar

	volume_exists || die "No existe el volumen ${STACK_NAME}_mysql_data. ¿Proyecto sin inicializar?"

	ensure_mysql

	local stamp dest partial
	stamp="$(date +%Y%m%d-%H%M%S)"
	dest="$BACKUP_ROOT/${STACK_NAME}-${stamp}"
	mkdir -p "$dest"

	info "Respaldando base de datos ($DB_NAME)..."
	# Escribimos a un .part y solo lo renombramos si todo va bien: así un
	# fallo a mitad no deja un respaldo "válido" a medias.
	partial="$dest/db.sql.gz.part"
	if ! docker compose exec -T -e MYSQL_PWD="$DB_ROOT_PASSWORD" mysql \
		mariadb-dump -u root \
		--single-transaction \
		--default-character-set=utf8mb4 \
		--databases "$DB_NAME" \
		| gzip >"$partial"; then
		rm -f "$partial"
		die "Falló mariadb-dump. ¿Está bien DB_ROOT_PASSWORD en el .env?"
	fi
	mv "$partial" "$dest/db.sql.gz"

	# Verificación básica: el gzip se abre y el SQL tiene contenido.
	gzip -t "$dest/db.sql.gz" || die "El volcado está corrupto."
	if [ "$(gzip -dc "$dest/db.sql.gz" | wc -c | tr -d ' ')" -lt 100 ]; then
		die "El volcado está vacío."
	fi

	info "Respaldando wp-content (uploads, themes, plugins, mu-plugins)..."
	tar czf "$dest/wp-content.tar.gz" -C "$PROJECT_DIR" wp-content

	# Copiamos la configuración para poder reconstruir el entorno.
	cp -f docker-compose.yml "$dest/" 2>/dev/null || true
	cp -f .env "$dest/env.backup" 2>/dev/null || true

	{
		printf 'Proyecto: %s\n' "$STACK_NAME"
		printf 'Fecha: %s\n' "$(date)"
		printf 'Host: %s\n' "$(hostname)"
		printf 'Directorio original: %s\n' "$PROJECT_DIR"
		printf 'Base de datos: %s\n' "$DB_NAME"
		printf 'Usuario BD: %s\n' "$DB_USER"
		printf 'WP_PORT=%s\n' "$WP_PORT"
		printf 'DB_PORT=%s\n' "$DB_PORT"
		printf 'MAILPIT_UI_PORT=%s\n' "$MAILPIT_UI_PORT"
		printf 'MAILPIT_SMTP_PORT=%s\n' "$MAILPIT_SMTP_PORT"
		printf '\nVersiones:\n'
		docker --version 2>/dev/null || true
		docker compose version 2>/dev/null || true
		printf '\nImágenes:\n'
		docker compose config --images 2>/dev/null || true
	} >"$dest/meta.txt"

	printf '%s\n' "$dest" >"$BACKUP_ROOT/.ultimo"
	prune_backups

	info "Respaldo creado:"
	printf '    %s\n' "$dest"
	printf '    Tamaño: %s\n' "$(du -sh "$dest" | cut -f1)"
	printf '    Restaurar con: ./scripts/wp.sh restore "%s"\n' "$dest"
}

# ----------------------------------------------------------------------------
#  restore
# ----------------------------------------------------------------------------
restore_backup() {
	local dir="${1:-}"

	if [ -z "$dir" ]; then
		dir="$(latest_backup || true)"
		[ -n "$dir" ] || die "No hay respaldos en $BACKUP_ROOT. Indica una carpeta."
	fi

	# Aceptar tanto una ruta como un nombre dentro de backups/.
	if [ ! -d "$dir" ] && [ -d "$BACKUP_ROOT/$dir" ]; then
		dir="$BACKUP_ROOT/$dir"
	fi
	[ -d "$dir" ] || die "No existe la carpeta de respaldo: $dir"
	[ -f "$dir/db.sql.gz" ] || die "Falta $dir/db.sql.gz"

	warn "Esto SOBRESCRIBE la base de datos y wp-content del proyecto '$STACK_NAME'."
	warn "Los datos actuales se perderán (haz antes un backup si te importan)."
	printf '    Respaldo: %s\n' "$dir"

	confirm "¿Continuar con la restauración?" || die "Cancelado."

	ensure_mysql

	# Paramos WordPress para que nadie escriba en la BD durante la importación.
	docker compose stop wordpress >/dev/null 2>&1 || true

	info "Importando base de datos..."
	gzip -dc "$dir/db.sql.gz" | docker compose exec -T \
		-e MYSQL_PWD="$DB_ROOT_PASSWORD" mysql mariadb -u root

	if [ -f "$dir/wp-content.tar.gz" ]; then
		info "Restaurando wp-content (sobrescribe archivos)..."
		tar xzf "$dir/wp-content.tar.gz" -C "$PROJECT_DIR"
	else
		warn "El respaldo no incluye wp-content.tar.gz; se conservan los archivos actuales."
	fi

	info "Levantando el stack..."
	docker compose up -d >/dev/null

	info "Restauración completada."
	warn_urls "$dir"

	printf '    Web:     http://localhost:%s\n' "$WP_PORT"
	printf '    Mailpit: http://localhost:%s\n' "$MAILPIT_UI_PORT"
}

# Tras restaurar un respaldo de otro puerto/dominio, WordPress sigue teniendo
# la URL antigua guardada en la tabla wp_options. Avisamos para que no parezca
# que "la web está rota".
warn_urls() {
	local meta="$1/meta.txt" old=""
	[ -f "$meta" ] || return 0
	old="$(grep -E '^WP_PORT=' "$meta" | tail -n 1 | cut -d= -f2 || true)"
	if [ -n "$old" ] && [ "$old" != "$WP_PORT" ]; then
		warn "El respaldo se hizo con WP_PORT=$old y ahora usas WP_PORT=$WP_PORT."
		warn "WordPress guarda la URL en la BD; los enlaces pueden apuntar al puerto viejo."
		printf '    Corrige con:\n'
		printf '      ./scripts/wp.sh fix-urls "http://localhost:%s" "http://localhost:%s"\n' "$old" "$WP_PORT"
	fi
}

# ----------------------------------------------------------------------------
#  fix-urls (search-replace con WP-CLI)
# ----------------------------------------------------------------------------
fix_urls() {
	local old="${1:-}" new="${2:-}"
	[ -n "$old" ] && [ -n "$new" ] || die "Uso: ./scripts/wp.sh fix-urls <url-antigua> <url-nueva>"

	info "Sustituyendo '$old' por '$new' en la base de datos..."
	# Contenedor temporal con WP-CLI. Montamos el volumen del core y los bind
	# mounts de wp-content para que WP-CLI encuentre una instalación completa.
	docker run --rm \
		--network "${STACK_NAME}_default" \
		-v "${STACK_NAME}_mywebsite_data:/var/www/html:ro" \
		-v "$PROJECT_DIR/wp-content:/var/www/html/wp-content" \
		-e WORDPRESS_DB_HOST=mysql:3306 \
		-e WORDPRESS_DB_NAME="$DB_NAME" \
		-e WORDPRESS_DB_USER="$DB_USER" \
		-e WORDPRESS_DB_PASSWORD="$DB_PASSWORD" \
		wordpress:cli-2.12.0-php8.3 \
		wp search-replace "$old" "$new" --all-tables --allow-root

	info "URLs actualizadas."
}

# ----------------------------------------------------------------------------
#  reset
# ----------------------------------------------------------------------------
reset_stack() {
	warn "Esto detendrá y BORRARÁ los contenedores, la red y los VOLÚMENES"
	warn "del proyecto '$STACK_NAME'. La base de datos y el core se perderán."
	printf '    Los bind mounts NO se borran: wp-content/uploads, themes, plugins y mu-plugins siguen en disco.\n\n'

	local answer
	read -r -p "Escribe el nombre del proyecto ($STACK_NAME) para confirmar: " answer
	[ "$answer" = "$STACK_NAME" ] || die "Cancelado."

	if confirm "¿Hacer un respaldo antes de borrar?"; then
		make_backup
	fi

	info "Eliminando contenedores, red y volúmenes de '$STACK_NAME'..."
	docker compose down -v
	info "Proyecto eliminado. Los respaldos siguen en $BACKUP_ROOT."
}

# ----------------------------------------------------------------------------
#  new-client
# ----------------------------------------------------------------------------
new_client() {
	local name="${1:-}"
	[ -n "$name" ] || die "Uso: ./scripts/wp.sh new-client <nombre> [WP_PORT] [DB_PORT] [UI_PORT] [SMTP_PORT]"

	# Nombre válido para Docker (minúsculas, números, guion y guion bajo).
	case "$name" in
		*[!a-z0-9_-]*|'') die "Nombre inválido: usa minúsculas, números, '-' o '_'." ;;
	esac

	local wp="${2:-2001}"
	local db="${3:-3307}"
	local ui="${4:-8026}"
	local smtp="${5:-1026}"

	local dest="${NEW_CLIENT_DIR:-$(dirname "$PROJECT_DIR")}/$name"
	[ -e "$dest" ] && die "Ya existe la carpeta: $dest"

	require_cmd rsync

	local p
	for p in "$wp" "$db" "$ui" "$smtp"; do
		port_free "$p" || die "El puerto $p ya está ocupado. Elige otro."
	done

	info "Copiando proyecto a $dest ..."
	mkdir -p "$dest"
	# Copiamos temas/plugins/mu-plugins, pero NO los uploads del cliente
	# anterior ni los respaldos. Cada cliente empieza con su propio contenido.
	rsync -a \
		--exclude 'backups/' \
		--exclude '.git/' \
		--exclude 'wp-content/uploads/*' \
		--exclude 'wp-content/cache/' \
		"$PROJECT_DIR/" "$dest/"
	mkdir -p "$dest/wp-content/uploads"

	# .env propio. Se copian las credenciales actuales para que el proyecto
	# nuevo arranque igual, pero con nombre y puertos distintos.
	cat >"$dest/.env" <<EOF
# Generado por wp.sh new-client el $(date)
# Proyecto independiente: sus volúmenes y su red no se mezclan con otros.
COMPOSE_PROJECT_NAME=$name

WP_PORT=$wp
DB_PORT=$db
MAILPIT_UI_PORT=$ui
MAILPIT_SMTP_PORT=$smtp

DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD
EOF

	info "Levantando '$name'..."
	# El `unset` es defensivo: aunque load_env ya no exporta nada, evita que
	# cualquier variable heredada del shell pise el .env recién creado.
	(
		cd "$dest"
		unset COMPOSE_PROJECT_NAME DB_NAME DB_USER DB_PASSWORD DB_ROOT_PASSWORD \
			WP_PORT DB_PORT MAILPIT_UI_PORT MAILPIT_SMTP_PORT
		docker compose up -d
	)

	info "Cliente '$name' listo."
	printf '    Carpeta: %s\n' "$dest"
	printf '    Web:     http://localhost:%s\n' "$wp"
	printf '    Mailpit: http://localhost:%s\n' "$ui"
	printf '    MySQL:   localhost:%s\n' "$db"
	printf '    WordPress arranca vacío: abre la web para instalarlo.\n'
}

# ----------------------------------------------------------------------------
#  Ayuda
# ----------------------------------------------------------------------------
usage() {
	cat <<EOF
${BOLD}wp.sh${NC} - respaldos y clonado del stack WordPress + Docker

Uso:
  ./scripts/wp.sh backup
      Crea backups/<proyecto>-<fecha>/ con db.sql.gz, wp-content.tar.gz,
      copia del compose y metadatos. Conserva los últimos $KEEP_BACKUPS.

  ./scripts/wp.sh restore [carpeta]
      Restaura BD y wp-content desde un respaldo. Sin argumento usa el más
      reciente. Pide confirmación y para WordPress durante la importación.

  ./scripts/wp.sh reset
      Respaldo opcional + 'docker compose down -v'. Exige escribir el nombre
      del proyecto. No borra los bind mounts.

  ./scripts/wp.sh new-client <nombre> [WP_PORT] [DB_PORT] [UI_PORT] [SMTP_PORT]
      Copia el proyecto a una carpeta hermana con un .env nuevo y lo levanta.
      Por defecto: 2001 3307 8026 1026. El WordPress nuevo empieza vacío.

  ./scripts/wp.sh fix-urls <url-antigua> <url-nueva>
      Cambia la URL guardada en la BD con WP-CLI (tras restaurar en otro
      puerto). Ejemplo:
        ./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001

  ./scripts/wp.sh help
      Muestra esta ayuda.

Variables opcionales:
  BACKUP_DIR     carpeta de respaldos        (defecto: ./backups)
  KEEP_BACKUPS   respaldos a conservar       (defecto: 5)
  NEW_CLIENT_DIR carpeta donde crear clientes (defecto: carpeta padre)
EOF
}

# ----------------------------------------------------------------------------
#  Punto de entrada
# ----------------------------------------------------------------------------
load_env

case "${1:-help}" in
	backup)      make_backup ;;
	restore)     shift; restore_backup "${1:-}" ;;
	reset)       reset_stack ;;
	new-client)  shift; new_client "$@" ;;
	fix-urls)    shift; fix_urls "${1:-}" "${2:-}" ;;
	help|-h|--help) usage ;;
	*)           usage; exit 1 ;;
esac
