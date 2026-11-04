# Correo de prueba, configuración con `.env` y scripts — WordPress + Docker

> Documento de sesión. Recoge el análisis del stack, la integración de Mailpit,
> la parametrización con `.env`, los scripts de respaldo/clonado, los errores
> encontrados y los conceptos que hay detrás.
>
> **Fecha:** 2026-10-29 · **Directorio:** `/Users/dthm/Code/wordpress/with-docker`

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Punto de partida y análisis del compose](#2-punto-de-partida-y-análisis-del-compose)
3. [Correo de prueba con Mailpit](#3-correo-de-prueba-con-mailpit)
4. [Versiones fijadas](#4-versiones-fijadas)
5. [Configuración por proyecto con `.env`](#5-configuración-por-proyecto-con-env)
6. [Scripts: respaldo, restauración y clonado](#6-scripts-respaldo-restauración-y-clonado)
7. [Dónde viven los datos y qué borra cada comando](#7-dónde-viven-los-datos-y-qué-borra-cada-comando)
8. [Windows y Linux](#8-windows-y-linux)
9. [Errores encontrados y su solución](#9-errores-encontrados-y-su-solución)
10. [Chuleta de comandos](#10-chuleta-de-comandos)
11. [Estado actual](#11-estado-actual)
12. [Conceptos aprendidos](#12-conceptos-aprendidos)

---

## 1. Resumen ejecutivo

| Tema | Resultado |
|---|---|
| Correo de prueba | Mailpit (`axllent/mailpit:v1.32.0`), UI en `:8025`, SMTP en `:1025` |
| Envío desde WordPress | mu-plugin `wp-content/mu-plugins/mailpit.php` vía `phpmailer_init` |
| Bug del remitente | `wordpress@localhost` es rechazado por PHPMailer; se corrige con `wp_mail_from` |
| Versiones | `mariadb:13.0.2`, `wordpress:7.1.4-php8.3-apache`, `mailpit:v1.32.0` |
| Configuración | Puertos, credenciales y nombre de proyecto en `.env` |
| Scripts | `scripts/wp.sh` con `backup`, `restore`, `reset`, `new-client`, `fix-urls` |
| Pruebas | Backup, restauración real, reset y clonado verificados en un proyecto desechable |

---

## 2. Punto de partida y análisis del compose

El stack original tenía tres servicios implícitos en dos: `mysql` (MariaDB) y
`wordpress` (Apache + PHP), con volúmenes nombrados y bind mounts para temas y
plugins.

### Lo que ya estaba bien

- `WORDPRESS_DB_HOST: mysql:3306` usa el **puerto interno**, no el publicado.
- `depends_on` con `condition: service_healthy` evita que WordPress arranque
  antes de que MariaDB termine de inicializar InnoDB.
- `healthcheck.sh --connect --innodb_initialized` es la comprobación oficial.
- Usuario de aplicación `wordpress` en lugar de `root`.
- Bind mounts solo para lo que se edita en el host (temas/plugins).

### Lo que se mejoró

| Problema | Solución |
|---|---|
| `image: mariadb` y `image: wordpress` sin versión | Tags fijos |
| `mysql` sin `restart` | `restart: unless-stopped` |
| WordPress podía quedarse sin `sendmail` | SMTP explícito a Mailpit |
| `uploads` y `mu-plugins` dentro del volumen | Bind mounts a la carpeta del proyecto |
| Credenciales y puertos repetidos en varios sitios | Variables de entorno en `.env` |
| Sin capturador de correo | Servicio Mailpit |
| Sin notas de portabilidad | Bloque Windows/Linux al final del compose |

### Detalle importante: la imagen de WordPress no trae `sendmail`

Comprobado dentro de la propia imagen:

```bash
$ docker run --rm --entrypoint sh wordpress:latest -c \
    'command -v sendmail || echo "NO sendmail"; command -v msmtp || echo "NO msmtp"'
NO sendmail
NO msmtp

$ docker run --rm --entrypoint sh wordpress:latest -c \
    'php -r "echo ini_get(\"sendmail_path\"), PHP_EOL;"'
/usr/sbin/sendmail -t -i
```

`sendmail_path` apunta a `/usr/sbin/sendmail`, que **no existe**. Por eso
`wp_mail()` falla en silencio si no se configura SMTP. Añadir solo la imagen de
Mailpit no arregla nada: hay que decirle a WordPress cómo entregar el correo.

---

## 3. Correo de prueba con Mailpit

### 3.1 Por qué Mailpit y no MailHog

| Opción | Estado |
|---|---|
| **Mailpit** | Mantenida, build arm64 nativo, UI moderna |
| MailHog | Sin mantenimiento desde 2020, solo amd64 (emulación en Apple Silicon) |
| Maildev | Correcta, pero menos pulida |
| Mailtrap | Servicio en la nube, no es una imagen Docker |
| Brevo/Mailgun/Resend | SMTP real para entregar a buzones reales |

Mailpit **no envía correos a Internet**: los captura y los muestra en su web.
Para que lleguen a un Gmail real hace falta un proveedor SMTP real.

### 3.2 Servicio en `docker-compose.yml`

```yaml
  mailpit:
    image: axllent/mailpit:v1.32.0

    ports:
      - "${MAILPIT_UI_PORT:-8025}:8025"   # interfaz web
      - "${MAILPIT_SMTP_PORT:-1025}:1025" # SMTP desde el host

    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1

    restart: unless-stopped
```

- `mailpit:1025` es el nombre y puerto **interno** que usa WordPress.
- Publicar `1025` solo hace falta para enviar desde el Mac (curl, Thunderbird).
- Los mensajes viven en memoria: se pierden al recrear el contenedor. Para
  persistirlos, añadir un volumen en `/data` y `MP_DATABASE=/data/mailpit.db`.
- Tiene build arm64, así que no pasa por emulación en Apple Silicon.

### 3.3 El mu-plugin

Archivo: `wp-content/mu-plugins/mailpit.php`

```php
<?php
/**
 * Plugin Name: Mailpit (solo desarrollo)
 * Description: Envía todo el correo de WordPress al SMTP de Mailpit.
 * Version:     1.1
 *
 * No envía nada a Internet: Mailpit captura el mensaje y lo muestra en
 * http://localhost:8025. Para desactivarlo, renombra este archivo.
 */

/**
 * WordPress genera "wordpress@localhost" cuando la web se abre como
 * localhost. PHPMailer considera "localhost" un dominio inválido y lanza
 * "Invalid address: (From)" ANTES de ejecutar phpmailer_init, así que
 * wp_mail() devuelve false sin llegar a conectar con Mailpit.
 * Corregimos el remitente aquí, antes de esa validación.
 */
add_filter( 'wp_mail_from', function ( $from ) {
	if ( ! $from || 'wordpress@localhost' === $from || ! is_email( $from ) ) {
		return 'wordpress@example.test';
	}

	return $from;
} );

add_filter( 'wp_mail_from_name', function ( $name ) {
	return $name ? $name : 'WordPress (local)';
} );

add_action( 'phpmailer_init', function ( $phpmailer ) {
	$phpmailer->isSMTP();
	$phpmailer->Host        = 'mailpit'; // nombre del servicio en Compose
	$phpmailer->Port        = 1025;      // puerto SMTP interno de Mailpit
	$phpmailer->SMTPAuth    = false;
	$phpmailer->SMTPSecure  = '';
	$phpmailer->SMTPAutoTLS = false;
	$phpmailer->Timeout     = 10;
} );
```

Y el bind mount correspondiente:

```yaml
      - ./wp-content/mu-plugins:/var/www/html/wp-content/mu-plugins
```

Un **mu-plugin** (must-use) se carga siempre, no se puede desactivar desde el
admin y no requiere instalación. Es ideal para configuración de entorno.

### 3.4 El bug del remitente (`wordpress@localhost`)

El primer intento devolvía:

```text
ERROR: Invalid address:  (From): wordpress@localhost
bool(false)
```

La causa está en el orden interno de `wp_mail()`:

1. Calcula el remitente: `wordpress@` + host de la web → `wordpress@localhost`.
2. Ejecuta el filtro `wp_mail_from`.
3. Llama a `$phpmailer->setFrom(...)`, que **valida** la dirección.
4. Lanza excepción si no es válida.
5. Solo después ejecuta `phpmailer_init`.

Como `localhost` no es un dominio válido para PHPMailer, el paso 4 lanzaba la
excepción y el hook `phpmailer_init` **nunca llegaba a ejecutarse**. Por eso
configurar SMTP solo en `phpmailer_init` no bastaba.

Solución: corregir el remitente en `wp_mail_from`, que se ejecuta antes de la
validación. Se mantiene el `setFrom` condicional para no pisar el remitente que
configure un plugin.

Resultado tras el arreglo:

```text
bool(true)
{"total":1,...,"From":{"Name":"WordPress","Address":"wordpress@example.test"},
 "To":[{"Address":"destino@example.test"}],
 "Subject":"Prueba Mailpit"}
```

### 3.5 Verificación

```bash
# ¿El contenedor resuelve el SMTP?
docker compose exec -T wordpress php -r 'var_dump((bool) fsockopen("mailpit", 1025));'
# bool(true)

# ¿wp_mail() devuelve true?
docker compose exec -T wordpress php -r '
require "/var/www/html/wp-load.php";
var_dump( wp_mail("destino@example.test", "Prueba", "Hola") );
'
# bool(true)
```

Prueba manual desde el host:

```bash
curl --url smtp://localhost:1025 \
  --mail-from test@local \
  --mail-rcpt tu@correo.com \
  --upload-file mensaje.txt
```

Prueba real de WordPress: `http://localhost:2000/wp-login.php` →
“¿Olvidaste tu contraseña?”. El correo aparece en `http://localhost:8025`.

---

## 4. Versiones fijadas

Consultadas en Docker Hub el **2026-10-29**:

| Imagen | Tag fijado | Motivo |
|---|---|---|
| MariaDB | `mariadb:13.0.2` | Era el `latest` de ese día |
| WordPress | `wordpress:7.1.4-php8.3-apache` | `latest` = WP 7.1.4 con PHP 8.3 |
| Mailpit | `axllent/mailpit:v1.32.0` | Última estable |

Fijar versiones evita que un `docker compose pull` cambie el motor de la base o
el core sin querer. Para actualizar, se cambia el número y se prueba en local.

> Si el volumen de MariaDB ya existe, **no bajes** de versión mayor: el datadir
> puede quedar incompatible. Actualizar hacia arriba sí suele estar soportado.

---

## 5. Configuración por proyecto con `.env`

Objetivo: el mismo `docker-compose.yml` sirve para varios clientes cambiando
solo el `.env`.

### 5.1 Variables

| Variable | Defecto | Uso |
|---|---|---|
| `COMPOSE_PROJECT_NAME` | nombre de la carpeta | Prefijo de volúmenes y red |
| `WP_PORT` | 2000 | Puerto de la web en el host |
| `DB_PORT` | 3306 | Puerto de MySQL en el host |
| `MAILPIT_UI_PORT` | 8025 | Interfaz web de Mailpit |
| `MAILPIT_SMTP_PORT` | 1025 | SMTP publicado en el host |
| `DB_NAME` | wordpress | Nombre de la base |
| `DB_USER` | wordpress | Usuario de la aplicación |
| `DB_PASSWORD` | example | Contraseña de ese usuario |
| `DB_ROOT_PASSWORD` | example | Contraseña de root |

Sintaxis usada en el compose: `${WP_PORT:-2000}` = “usa `WP_PORT`, y si no
existe, 2000”.

### 5.2 Puertos parametrizados

```yaml
    ports:
      - "${DB_PORT:-3306}:3306"
```

```yaml
      - "${WP_PORT:-2000}:80"
```

```yaml
      - "${MAILPIT_UI_PORT:-8025}:8025"
      - "${MAILPIT_SMTP_PORT:-1025}:1025"
```

Solo cambia el lado **izquierdo** (host). Los puertos internos (80, 3306, 8025,
1025) son fijos, y por eso `WORDPRESS_DB_HOST: mysql:3306` y
`$phpmailer->Port = 1025` no cambian nunca.

### 5.3 Credenciales compartidas entre servicios

```yaml
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-example}
      MYSQL_DATABASE: ${DB_NAME:-wordpress}
      MYSQL_USER: ${DB_USER:-wordpress}
      MYSQL_PASSWORD: ${DB_PASSWORD:-example}
```

```yaml
      WORDPRESS_DB_NAME: ${DB_NAME:-wordpress}
      WORDPRESS_DB_USER: ${DB_USER:-wordpress}
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD:-example}
```

Usar las mismas variables en ambos servicios hace imposible que se
desincronicen.

> **Ojo:** las variables `MYSQL_*` solo se aplican al **inicializar** el volumen.
> Si se cambian con datos ya existentes, MariaDB conserva las credenciales
> viejas y WordPress deja de conectar (“Access denied”). Cambiarlas solo en
> instalaciones nuevas.

### 5.4 `.env` del proyecto actual

```env
COMPOSE_PROJECT_NAME=with-docker

WP_PORT=2000
DB_PORT=3306
MAILPIT_UI_PORT=8025
MAILPIT_SMTP_PORT=1025

DB_NAME=wordpress
DB_USER=wordpress
DB_PASSWORD=example
DB_ROOT_PASSWORD=example
```

Compose lo lee automáticamente si está junto al `docker-compose.yml`; no hace
falta `--env-file`.

### 5.5 Clonar para otro cliente

```bash
cp -R with-docker cliente-b
cd cliente-b
# editar .env:
#   COMPOSE_PROJECT_NAME=cliente-b
#   WP_PORT=2001
#   DB_PORT=3307
#   MAILPIT_UI_PORT=8026
#   MAILPIT_SMTP_PORT=1026
docker compose up -d
```

Cada proyecto tiene sus propios volúmenes:

```
with-docker_mysql_data      cliente-b_mysql_data
with-docker_mywebsite_data  cliente-b_mywebsite_data
```

**Trampa:** si se copia a una carpeta con el **mismo nombre** y no se cambia
`COMPOSE_PROJECT_NAME`, se reutilizan los volúmenes del proyecto anterior.

### 5.6 El bug de precedencia del entorno

La primera versión de `wp.sh` cargaba el `.env` así:

```bash
set -a
. ./.env
set +a
```

Eso **exporta** las variables al entorno del proceso. Al ejecutar
`docker compose up` en la carpeta nueva, Compose encuentra `COMPOSE_PROJECT_NAME`
y los puertos ya exportados y **les da prioridad sobre el `.env` de esa
carpeta**. Resultado: el “cliente nuevo” arrancó con el nombre y los puertos del
proyecto original.

Precedencia real de Compose (de mayor a menor):

1. `docker compose -p` / variables del shell.
2. `COMPOSE_PROJECT_NAME` del entorno.
3. `name:` del compose.
4. `COMPOSE_PROJECT_NAME` del `.env`.
5. Nombre de la carpeta.

Solución en el script: leer el `.env` en un subshell y asignar sin exportar
(`printf %q` + `eval`), más un `unset` defensivo antes de levantar el cliente
nuevo.

---

## 6. Scripts: respaldo, restauración y clonado

Archivo: `scripts/wp.sh` (ejecutable).

Requisitos: `docker compose` v2, `gzip`, `tar`; `rsync` solo para `new-client`.
Funciona en macOS/Linux; en Windows, desde WSL o Git Bash.

### 6.1 Subcomandos

| Comando | Qué hace |
|---|---|
| `backup` | Dump SQL + tar de `wp-content` + copia del compose y `.env` + metadatos |
| `restore [carpeta]` | Importa el SQL y restaura `wp-content`; pide confirmación |
| `reset` | Respaldo opcional y `docker compose down -v`; exige escribir el nombre |
| `new-client <nombre> [puertos]` | Copia el proyecto, crea `.env` nuevo y lo levanta |
| `fix-urls <vieja> <nueva>` | `wp search-replace` con WP-CLI |

### 6.2 Qué contiene un respaldo

```text
backups/with-docker-20261030-120000/
├── db.sql.gz           # mariadb-dump --single-transaction --databases
├── wp-content.tar.gz   # uploads, themes, plugins, mu-plugins
├── docker-compose.yml  # configuración del entorno
├── env.backup          # copia del .env (¡contiene contraseñas!)
└── meta.txt            # fecha, host, proyecto, puertos, versiones
```

- El dump se escribe primero como `.part` y solo se renombra si el comando
  termina bien. Así un fallo a mitad no deja un respaldo “válido” a medias.
- Se verifica con `gzip -t` y se comprueba que el SQL no esté vacío.
- Se conservan los últimos 5 respaldos (`KEEP_BACKUPS`).
- La ruta del último respaldo se guarda en `backups/.ultimo`.

### 6.3 Cómo restaura

1. Pide confirmación explícita.
2. Levanta MariaDB y espera a `healthy`.
3. **Para WordPress** para que nadie escriba durante la importación.
4. Importa el SQL: `gzip -dc db.sql.gz | mariadb -u root`.
5. Descomprime `wp-content.tar.gz` sobre el proyecto.
6. Vuelve a levantar el stack.
7. Avisa si el respaldo venía de otro puerto (URLs desactualizadas).

```bash
./scripts/wp.sh restore
./scripts/wp.sh restore backups/with-docker-20261030-120000
```

### 6.4 Cómo resetea

```bash
./scripts/wp.sh reset
```

- Exige escribir el nombre exacto del proyecto.
- Ofrece hacer respaldo antes.
- Ejecuta `docker compose down -v`.
- **No borra** los bind mounts (`uploads`, `themes`, `plugins`, `mu-plugins`).

### 6.5 Cómo clona

```bash
./scripts/wp.sh new-client cliente-b 2001 3307 8026 1026
```

- Copia la carpeta a `../cliente-b`.
- Excluye `backups/`, `.git/` y los uploads del cliente anterior.
- Genera un `.env` con el nombre y puertos nuevos.
- Levanta el stack. WordPress arranca vacío (instalador).

### 6.6 Cómo corrige URLs

Tras restaurar un respaldo hecho en el puerto 2000 dentro de un proyecto que
usa 2001, WordPress sigue guardando `http://localhost:2000` en la tabla
`wp_options`. Los enlaces apuntan mal.

```bash
./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001
```

Usa un contenedor temporal `wordpress:cli-2.12.0-php8.3` conectado a la red del
proyecto, con el volumen del core en solo lectura y los bind mounts de
`wp-content`.

### 6.7 Pruebas realizadas

| Prueba | Resultado |
|---|---|
| `new-client cliente-prueba 2010 3310 8030 1030` | Proyecto independiente, puertos correctos |
| `backup` | Dump de 865 B + `wp-content.tar.gz` de 13 MB |
| Crear tabla `marker`, respaldar, borrarla, restaurar | La fila volvió intacta |
| `reset` | Respaldo + `down -v` correctos |
| Limpieza | Sin contenedores, volúmenes ni carpetas de prueba |

---

## 7. Dónde viven los datos y qué borra cada comando

| Dato | Ubicación | ¿Sobrevive a borrar la carpeta? |
|---|---|---|
| Base de datos (InnoDB) | Volumen `<proyecto>_mysql_data` | **Sí** |
| Core + `wp-config.php` | Volumen `<proyecto>_mywebsite_data` | **Sí** |
| `uploads`, `themes`, `plugins`, `mu-plugins` | Carpetas del proyecto (bind mounts) | **No** |
| Contenedores, red, imágenes | Docker | No (quedan huérfanos) |

### `down` vs `down -v`

| Comando | Contenedores | Red | Volúmenes | Bind mounts |
|---|---|---|---|---|
| `docker compose down` | Borra | Borra | **Conserva** | Conserva |
| `docker compose down -v` | Borra | Borra | **Borra** | Conserva |

`down -v` no pide confirmación y no se puede deshacer. Solo afecta al proyecto
del directorio actual. No borra imágenes: para eso, `--rmi all`.

Los volúmenes están dentro de la VM de Docker Desktop. Se pueden inspeccionar:

```bash
docker volume inspect with-docker_mysql_data --format '{{.Mountpoint}}'
```

> Copiar los archivos de `mysql_data` en caliente (por ejemplo con `tar`) puede
> producir un respaldo inconsistente. Para la BD, usar `mariadb-dump` o parar el
> contenedor.

---

## 8. Windows y Linux

### Linux (Docker Engine nativo)

- WordPress corre como `www-data` (UID 33). Si hay “Permission denied” al subir
  medios o instalar plugins:

  ```bash
  sudo chown -R 33:33 wp-content/uploads wp-content/mu-plugins
  ```

- Fedora/RHEL con SELinux: añadir `:z` a los bind mounts:

  ```yaml
  - ./wp-content/uploads:/var/www/html/wp-content/uploads:z
  ```

- Comprobar puertos: `ss -ltnp | grep -E '3306|2000|8025|1025'`.
- Para arrancar Docker al inicio: `sudo systemctl enable --now docker`.
- `host.docker.internal` no existe por defecto; añadir
  `extra_hosts: ["host.docker.internal:host-gateway"]` si hace falta.

### Windows

- Docker Desktop con backend WSL2.
- Guardar el proyecto **dentro** del sistema de archivos de WSL
  (`~/code/...`), no en `/mnt/c/...`: los bind mounts sobre NTFS son lentos.
- `git config core.autocrlf input` para no guardar `.php`/`.sh` con CRLF.
- Permitir los puertos en el Firewall si se accede desde otro equipo.
- `restart: unless-stopped` solo actúa si Docker Desktop arranca con Windows.

---

## 9. Errores encontrados y su solución

| Síntoma | Causa | Solución |
|---|---|---|
| `wp_mail()` devuelve `false` sin error visible | La imagen no tiene `sendmail` | Configurar SMTP explícito |
| `Invalid address: (From): wordpress@localhost` | PHPMailer valida antes de `phpmailer_init` | Filtro `wp_mail_from` |
| El cliente nuevo arranca como `with-docker` | Variables del `.env` exportadas al shell | No exportar; `unset` defensivo |
| `Access denied` tras cambiar `DB_*` | MariaDB solo aplica credenciales al inicializar | No cambiar con volumen existente |
| `port is already allocated` | Dos proyectos con el mismo puerto de host | Puertos distintos por `.env` |
| WordPress sin temas | Bind mount sobre carpeta vacía | Copiar temas o la carpeta completa |
| Volumen “desaparece” al cambiar nombre | `COMPOSE_PROJECT_NAME` distinto | Volver al nombre anterior o migrar datos |

### El detalle de `WORDPRESS_DEBUG`

El `wp-config.php` generado por la imagen contiene:

```php
define( 'WP_DEBUG', !!getenv_docker( 'WORDPRESS_DEBUG', '' ) );
```

El `!!` convierte **cualquier texto no vacío** en `true`, incluido `"0"`. Por
eso, para apagarlo hay que **comentar** la variable, no poner `0`.

Está desactivado por defecto porque genera ruido de plugins y muestra rutas
internas. Se activa solo para diagnosticar pantallas blancas, errores 500 o
plugins que no cargan:

```yaml
    # WORDPRESS_DEBUG: "1"
```

Los errores de Apache/PHP también están en `docker compose logs -f wordpress`.

---

## 10. Chuleta de comandos

```bash
# Levantar / estado
docker compose up -d
docker compose ps
docker compose logs -f wordpress

# Correo
open http://localhost:8025
curl --url smtp://localhost:1025 --mail-from a@b --mail-rcpt c@d --upload-file msg.txt

# Respaldo y restauración
./scripts/wp.sh backup
./scripts/wp.sh restore
./scripts/wp.sh reset

# Cliente nuevo
./scripts/wp.sh new-client cliente-b 2001 3307 8026 1026

# URLs tras restaurar en otro puerto
./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001

# Volúmenes
docker volume ls | grep with-docker
docker volume inspect with-docker_mysql_data --format '{{.Mountpoint}}'
```

---

## 11. Estado actual

Al cierre de esta sesión:

- El stack **no está corriendo** y los volúmenes `with-docker_*` no existían
  cuando se fueron a probar los scripts (parece que se ejecutó `down -v` antes).
- La carpeta del proyecto, el `docker-compose.yml`, el `.env` y `scripts/wp.sh`
  están intactos.
- Los scripts se probaron en un proyecto desechable (`cliente-prueba`), que se
  eliminó al terminar.
- Para volver a levantar el sitio (vacío):

  ```bash
  docker compose up -d
  ```

  WordPress mostrará el instalador en `http://localhost:2000`.

---

## 12. Conceptos aprendidos

1. **Una imagen de correo no basta.** El contenedor de WordPress necesita un
   transporte SMTP configurado; `mail()` sin `sendmail` falla en silencio.

2. **El orden de los hooks importa.** `phpmailer_init` se ejecuta después de la
   validación del remitente. Para arreglar el `From`, hay que usar
   `wp_mail_from`.

3. **Los mu-plugins son configuración de entorno.** Se cargan siempre y no se
   pueden desactivar desde el admin.

4. **Precedencia en Compose.** Las variables del shell ganan al `.env`. Un
   script que exporta el `.env` contamina los proyectos que lance después.

5. **Volúmenes vs bind mounts.** Los volúmenes sobreviven a borrar la carpeta;
   los bind mounts no. `down -v` borra volúmenes, nunca bind mounts.

6. **Las credenciales de MariaDB se congelan al crear el volumen.** Cambiar
   `MYSQL_*` después no actualiza nada.

7. **Un respaldo no está probado hasta que se restaura.** Por eso el script
   verifica el gzip y la prueba se hizo restaurando una tabla borrada.

8. **Fijar versiones** convierte el entorno en algo reproducible; `latest` es
   cómodo hasta que deja de serlo.
