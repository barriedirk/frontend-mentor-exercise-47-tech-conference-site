#!/usr/bin/env bash
# ============================================================================
#  validate-docker-compose.sh - Comprobaciones rápidas del repositorio
# ============================================================================
#
#  Este script NO levanta WordPress, NO descarga imágenes y NO toca la base
#  de datos. Solo valida que el repositorio esté bien formado.
#
#  Comprueba:
#    1. Que existan los archivos base y que wp.sh sea ejecutable.
#    2. Que docker-compose.yml sea válido y tenga los servicios esperados.
#    3. Que los scripts Bash no tengan errores de sintaxis.
#    4. ShellCheck, si está instalado (opcional).
#    5. Sintaxis PHP de los mu-plugins, si PHP está instalado (opcional).
#
#  Uso:
#    ./scripts/validate-docker-compose.sh
#
#  Código de salida:
#    0 = todo correcto (puede haber avisos)
#    1 = alguna comprobación falló
# ============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

CHECKS_FAILED=0
CHECKS_WARNED=0

if [ -t 1 ]; then
	BOLD=$'\033[1m'
	RED=$'\033[31m'
	GREEN=$'\033[32m'
	YELLOW=$'\033[33m'
	NC=$'\033[0m'
else
	BOLD='' RED='' GREEN='' YELLOW='' NC=''
fi

section() {
	printf '\n%s==> %s%s\n' "$BOLD" "$*" "$NC"
}

ok() {
	printf '    %sOK%s      %s\n' "$GREEN" "$NC" "$*"
}

fail() {
	printf '    %sFALLO%s   %s\n' "$RED" "$NC" "$*"
	CHECKS_FAILED=$((CHECKS_FAILED + 1))
}

warn() {
	printf '    %sAVISO%s   %s\n' "$YELLOW" "$NC" "$*"
	CHECKS_WARNED=$((CHECKS_WARNED + 1))
}

skip() {
	printf '    %sOMITIDO%s %s\n' "$YELLOW" "$NC" "$*"
}

# ----------------------------------------------------------------------------
#  1. Archivos base y permisos
# ----------------------------------------------------------------------------
check_required_files() {
	section "1/6 Archivos base y permisos"

	local required_files=(
		"docker-compose.yml"
		"scripts/wp.sh"
		".env.example"
		".gitignore"
		"README.md"
		"LICENSE"
		"SECURITY.md"
	)
	local file

	for file in "${required_files[@]}"; do
		if [ -f "$file" ]; then
			ok "$file"
		else
			fail "falta $file"
		fi
	done

	if [ -f ".env" ]; then
		ok ".env"
	else
		warn ".env no existe; la validación de Compose usará .env.example"
	fi

	if [ -x "scripts/wp.sh" ]; then
		ok "scripts/wp.sh es ejecutable"
	else
		fail "scripts/wp.sh no es ejecutable; ejecuta: chmod +x scripts/wp.sh"
	fi
}

# ----------------------------------------------------------------------------
#  2. Docker Compose: sintaxis, variables y servicios esperados
# ----------------------------------------------------------------------------
check_compose() {
	section "2/6 Configuración de Docker Compose"

	if ! command -v docker >/dev/null 2>&1; then
		skip "docker no está instalado"
		return 0
	fi

	if ! docker compose version >/dev/null 2>&1; then
		skip "Docker Compose v2 no está disponible"
		return 0
	fi

	local env_file=".env"
	if [ ! -f "$env_file" ]; then
		env_file=".env.example"
	fi

	if ! docker compose --env-file "$env_file" config --quiet; then
		fail "docker-compose.yml no es válido (revisa el error mostrado arriba)"
		return 0
	fi
	ok "docker-compose.yml es válido usando $env_file"

	local services
	services="$(docker compose --env-file "$env_file" config --services 2>/dev/null || true)"

	local required_service
	for required_service in mysql wordpress mailpit; do
		if printf '%s\n' "$services" | grep -qx "$required_service"; then
			ok "servicio '$required_service' definido"
		else
			fail "falta el servicio '$required_service' en docker-compose.yml"
		fi
	done
}

# ----------------------------------------------------------------------------
#  3. Sintaxis Bash de todos los scripts
# ----------------------------------------------------------------------------
check_bash_syntax() {
	section "3/6 Sintaxis de los scripts Bash"

	local script
	local found=0

	for script in scripts/*.sh; do
		[ -e "$script" ] || continue
		found=1

		if bash -n "$script"; then
			ok "$script"
		else
			fail "$script tiene errores de sintaxis"
		fi
	done

	if [ "$found" -eq 0 ]; then
		fail "no se encontraron scripts .sh en scripts/"
	fi
}

# ----------------------------------------------------------------------------
#  4. ShellCheck (opcional, no bloquea si no está instalado)
# ----------------------------------------------------------------------------
check_shellcheck() {
	section "4/6 ShellCheck (opcional)"

	if ! command -v shellcheck >/dev/null 2>&1; then
		skip "shellcheck no está instalado"
		return 0
	fi

	local script
	local found=0

	for script in scripts/*.sh; do
		[ -e "$script" ] || continue
		found=1

		if shellcheck -S warning "$script"; then
			ok "$script"
		else
			fail "shellcheck encontró problemas en $script"
		fi
	done

	if [ "$found" -eq 0 ]; then
		warn "no hay scripts .sh que analizar con shellcheck"
	fi
}

# ----------------------------------------------------------------------------
#  5. Sintaxis PHP de los mu-plugins (opcional, no bloquea si no hay PHP)
# ----------------------------------------------------------------------------
check_php_syntax() {
	section "5/6 Sintaxis PHP de los mu-plugins (opcional)"

	if ! command -v php >/dev/null 2>&1; then
		skip "php no está instalado"
		return 0
	fi

	local file
	local found=0

	for file in wp-content/mu-plugins/*.php; do
		[ -e "$file" ] || continue
		found=1

		if php -l "$file" >/dev/null 2>&1; then
			ok "$file"
		else
			php -l "$file"
			fail "$file tiene errores de sintaxis PHP"
		fi
	done

	if [ "$found" -eq 0 ]; then
		warn "no hay mu-plugins PHP que validar"
	fi
}

# ----------------------------------------------------------------------------
#  6. Resumen final
# ----------------------------------------------------------------------------
print_summary() {
	section "6/6 Resumen"

	if [ "$CHECKS_FAILED" -eq 0 ]; then
		ok "todas las comprobaciones pasaron"

		if [ "$CHECKS_WARNED" -gt 0 ]; then
			warn "$CHECKS_WARNED aviso(s); revisa la salida anterior"
		fi

		printf '\n%sRepositorio listo.%s\n' "$GREEN" "$NC"
		return 0
	fi

	printf '\n%s%d comprobación(es) fallaron.%s\n' "$RED" "$CHECKS_FAILED" "$NC"
	return 1
}

check_required_files
check_compose
check_bash_syntax
check_shellcheck
check_php_syntax
print_summary
