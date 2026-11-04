# WordPress + Docker (entorno de desarrollo reutilizable)

> ## Aviso sobre `.env` y seguridad
>
> Este proyecto está pensado **exclusivamente para desarrollo local**.
> El archivo `.env` contiene la configuración de tu máquina (puertos,
> credenciales de ejemplo, etc.).
>
> Los valores incluidos aquí (`example`) son de ejemplo y **no deben usarse
> en producción**. En producción se deben usar secretos fuertes, gestionados
> fuera del repositorio, y una configuración distinta (base de datos no
> expuesta, HTTPS, SMTP real, debug desactivado, etc.).
>
> Aunque este repositorio versiona `.env` a propósito para facilitar el
> arranque rápido, **no lo subas a Git si contiene credenciales reales**.
> En ese caso, añade `.env` a `.gitignore` y rota las credenciales expuestas.
>
> **La seguridad del entorno y de sus credenciales es responsabilidad de
> quien use estos archivos.**

## Descargo de responsabilidad

Este repositorio se ofrece **tal cual** (*as is*), como base de ejemplo para
desarrollo local. Al usarlo aceptas que:

- **La responsabilidad es de quien lo usa**, no del repositorio ni de su autor.
- Debes **revisar el código antes de ejecutarlo**: `docker-compose.yml`,
  `scripts/wp.sh`, `.env`, `wp-content/mu-plugins/mailpit.php` y cualquier
  archivo que añadas o modifiques.
- Debes comprobar que los puertos, credenciales, rutas y versiones encajan con
  tu entorno antes de levantar los contenedores.
- Debes **hacer un respaldo** antes de ejecutar comandos destructivos como
  `restore`, `reset`, `docker compose down -v` o cualquier operación sobre la
  base de datos.
- No se garantiza que el proyecto esté libre de errores ni que sea apto para
  producción.
- **No se asume responsabilidad por pérdida de información**, daños,
  interrupciones del servicio o cualquier otra consecuencia derivada del uso
  de estos archivos.
- Si detectas un error, puedes revisarlo y corregirlo (o abrir un issue/PR).
  Se agradece la contribución, pero eso no implica obligación de soporte ni
  responsabilidad sobre el resultado.

Entorno local de WordPress listo para trabajar, pensado para **desarrollar temas y plugins** y para **levantar varios proyectos/clientes en la misma máquina** sin que se pisen entre sí.

Incluye:

- **WordPress 7.1.4** sobre Apache y PHP 8.3.
- **MariaDB 13.0.2** como base de datos.
- **Mailpit** para capturar todo el correo que envía WordPress (sin enviar nada a Internet).
- **Scripts** de respaldo, restauración, reset y clonado de proyectos.
- Configuración por proyecto mediante un archivo `.env`.

---

## ¿Para qué se creó?

Este repositorio nace de un entorno de WordPress con Docker que fallaba al conectar con la base de datos. Además de resolver ese problema, se dejó preparado como una **base reutilizable** para:

1. Tener un WordPress local reproducible en cualquier equipo con un solo comando.
2. Editar temas, plugins y `mu-plugins` desde el editor local y ver los cambios al instante.
3. Probar correos (registro, recuperación de contraseña, formularios) sin enviar emails reales.
4. Crear copias independientes del entorno para otros clientes/proyectos.
5. Hacer respaldos y restaurar el estado completo del sitio.

Los detalles técnicos de las decisiones y de los errores encontrados están documentados en:

- [`fallo-conexion-db.md`](fallo-conexion-db.md): diagnóstico del fallo de conexión a la base de datos.
- [`generar-correo-env-scripts.md`](generar-correo-env-scripts.md): correo con Mailpit, configuración `.env` y scripts.

---

## Arquitectura

```
┌──────────────────────┐        ┌──────────────────────┐
│  Navegador (host)    │        │  Mailpit UI (host)   │
│  localhost:2000      │        │  localhost:8025      │
└──────────┬───────────┘        └──────────▲───────────┘
           │                               │
┌──────────▼───────────┐        ┌──────────┴───────────┐
│  wordpress           │  SMTP  │  mailpit             │
│  Apache + PHP 8.3    │───────▶│  captura de correo   │
└──────────┬───────────┘        └──────────────────────┘
           │ red interna de Compose (mysql:3306)
┌──────────▼───────────┐
│  mysql               │
│  MariaDB 13.0.2      │
└──────────────────────┘
```

| Servicio    | Imagen                            | Puerto host (por defecto) | Para qué sirve                         |
| ----------- | --------------------------------- | ------------------------- | -------------------------------------- |
| `wordpress` | `wordpress:7.1.4-php8.3-apache`   | `2000`                    | La web y el panel de administración    |
| `mysql`     | `mariadb:13.0.2`                  | `3306`                    | Base de datos                          |
| `mailpit`   | `axllent/mailpit:v1.32.0`         | `8025` (UI), `1025` (SMTP) | Captura y visualización de correos     |

> Las versiones están fijadas a propósito para que un `docker compose pull` no cambie el core, PHP o la base de datos sin querer.

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) o Docker Engine + plugin Compose (Linux).
- Docker Compose **v2** (`docker compose`, no el antiguo `docker-compose`).
- `git` (opcional, para clonar el repositorio).
- Para los scripts: `gzip` y `tar` (vienen de serie). `rsync` solo es necesario para `new-client`.
- Puertos libres: `2000`, `3306`, `8025` y `1025` (o los que elijas en `.env`).

Comprobar la instalación:

```bash
docker --version
docker compose version
```

---

## Inicio rápido

```bash
# 1. Clona el repositorio (o descarga la carpeta)
git clone <URL-DEL-REPOSITORIO>
cd with-docker

# 2. Revisa el .env incluido (ya trae valores de ejemplo para local).
#    Si empiezas un proyecto nuevo desde cero, puedes usar la plantilla:
#    cp .env.example .env
#    (recuerda cambiar COMPOSE_PROJECT_NAME y los puertos)

# 3. Edita .env y ajusta al menos el nombre del proyecto y los puertos
#    COMPOSE_PROJECT_NAME=with-docker
#    WP_PORT=2000
#    DB_PORT=3306
#    MAILPIT_UI_PORT=8025
#    MAILPIT_SMTP_PORT=1025

# 4. Levanta el entorno
docker compose up -d

# 5. Sigue los logs hasta que todo esté listo (opcional)
docker compose logs -f wordpress
```

Después abre:

| Recurso              | URL                             |
| -------------------- | ------------------------------- |
| Web                  | http://localhost:2000           |
| Administración       | http://localhost:2000/wp-admin  |
| Correo (Mailpit)     | http://localhost:8025           |
| Base de datos (host) | `localhost:3306`                |

La primera vez que abras la web, WordPress mostrará el instalador. Crea el usuario administrador que quieras: esos datos se guardan en el volumen de MariaDB.

Para parar el entorno:

```bash
docker compose stop      # para los contenedores, conserva datos
docker compose down      # elimina contenedores y red, conserva volúmenes
docker compose down -v   # ¡elimina también los volúmenes y la base de datos!
```

---

## Estructura del proyecto

```
.
├── docker-compose.yml          # Definición de los 3 servicios
├── .env                        # Configuración local (NO subir con secretos reales)
├── .env.example                # Plantilla para crear un proyecto nuevo
├── .gitignore                  # Ignora backups, uploads y .DS_Store
├── .github/
│   └── workflows/
│       └── validate.yml        # CI: valida compose y scripts (no despliega)
├── LICENSE                     # Licencia MIT
├── SECURITY.md                 # Política de reporte de vulnerabilidades
├── scripts/
│   ├── validate-docker-compose.sh  # Validaciones locales y de CI
│   └── wp.sh                       # Backup, restore, reset, new-client, fix-urls
├── wp-content/
│   ├── themes/                 # Temas (bind mount: editable desde el host)
│   ├── plugins/                # Plugins (bind mount)
│   ├── uploads/                # Medios subidos desde WordPress
│   └── mu-plugins/
│       └── mailpit.php         # Redirige todo el correo a Mailpit
├── fallo-conexion-db.md        # Documentación del incidente de la BD
└── generar-correo-env-scripts.md
```

### Qué se guarda y dónde

| Dato                                   | Ubicación                          | ¿Sobrevive a `down`? | ¿Sobrevive a `down -v`? |
| -------------------------------------- | ---------------------------------- | -------------------- | ----------------------- |
| Base de datos                          | Volumen `*_mysql_data`             | Sí                   | No                      |
| Core de WordPress y `wp-config.php`    | Volumen `*_mywebsite_data`         | Sí                   | No                      |
| Temas, plugins, uploads y mu-plugins   | Carpetas locales `./wp-content/...`| Sí                   | Sí                      |
| Correos capturados por Mailpit         | Memoria del contenedor             | No                   | No                      |

> **Importante:** `down -v` borra la base de datos y el core, pero **no** borra las carpetas de `wp-content/` del host.

---

## Configuración (`.env`)

Docker Compose lee automáticamente el archivo `.env` que está junto a `docker-compose.yml`. Todas las variables son opcionales y tienen un valor por defecto.

| Variable              | Defecto      | Descripción                                                        |
| --------------------- | ------------ | ------------------------------------------------------------------ |
| `COMPOSE_PROJECT_NAME`| nombre de la carpeta | Prefijo de contenedores, red y volúmenes                  |
| `WP_PORT`             | `2000`       | Puerto de la web en el host                                        |
| `DB_PORT`             | `3306`       | Puerto de MariaDB en el host                                       |
| `MAILPIT_UI_PORT`     | `8025`       | Interfaz web de Mailpit                                            |
| `MAILPIT_SMTP_PORT`   | `1025`       | SMTP de Mailpit publicado en el host                               |
| `DB_NAME`             | `wordpress`  | Nombre de la base de datos                                         |
| `DB_USER`             | `wordpress`  | Usuario de la aplicación                                           |
| `DB_PASSWORD`         | `example`    | Contraseña del usuario anterior                                    |
| `DB_ROOT_PASSWORD`    | `example`    | Contraseña de `root` de MariaDB                                    |

### Reglas importantes

- **`COMPOSE_PROJECT_NAME` debe ser único** si vas a tener varios entornos levantados a la vez. Cambiarlo en un proyecto con datos hace que Compose busque volúmenes nuevos y arranque vacío.
- **Los puertos del host deben ser distintos** en cada proyecto (por ejemplo, el segundo proyecto usa `2001/3307/8026/1026`).
- **Las credenciales `DB_*` solo se aplican la primera vez** que se crea el volumen. Si cambias `DB_PASSWORD` con la base ya inicializada, MariaDB no la actualiza y WordPress dejará de conectar (`Access denied`).
- Los puertos **internos** de los contenedores (`80`, `3306`, `8025`, `1025`) no cambian nunca; WordPress siempre habla con `mysql:3306` y `mailpit:1025`.

### Seguridad

Este repositorio versiona `.env` **a propósito** para que el entorno se pueda
levantar rápidamente con los valores de ejemplo (`DB_PASSWORD=example`, etc.).
Esos valores no son secretos reales y solo sirven para desarrollo local.

Reglas:

- **Si añades credenciales reales, no las subas a Git.** Descomenta `.env` en
  `.gitignore` y rota las credenciales que ya se hayan publicado: borrar el
  archivo no elimina las versiones anteriores del historial.
- Versiona `.env.example` como plantilla para proyectos nuevos.
- No uses este `.env` en producción.
- La seguridad del entorno y de las credenciales es responsabilidad de quien
  use estos archivos.

Contenido actual de `.gitignore`:

```gitignore
# .env

backups/
wp-content/uploads/
.DS_Store
```

`backups/` y `wp-content/uploads/` se ignoran porque son datos locales
(respaldos y medios subidos), no código del proyecto.

---

## Uso diario

### Comandos básicos

```bash
# Levantar / recrear
docker compose up -d

# Ver estado
docker compose ps

# Logs de WordPress (Apache/PHP)
docker compose logs -f wordpress

# Logs de la base de datos
docker compose logs -f mysql

# Reiniciar un servicio
docker compose restart wordpress

# Parar sin borrar nada
docker compose stop
```

### Abrir una shell en los contenedores

```bash
# Shell del contenedor de WordPress
docker compose exec wordpress bash

# Consola de MariaDB con el usuario de la aplicación
docker compose exec mysql mariadb -u wordpress -p wordpress
```

### Editar temas y plugins

Las carpetas `wp-content/themes`, `wp-content/plugins`, `wp-content/uploads` y `wp-content/mu-plugins` están montadas desde tu máquina. Puedes editarlas con VS Code, PhpStorm, etc. y los cambios se ven al recargar la web, sin reconstruir la imagen.

> `wp-content/themes` debe contener al menos un tema; si lo vacías, WordPress se quedará sin temas disponibles.

### Depurar errores PHP

Por defecto `WP_DEBUG` está desactivado. Para activarlo, descomenta en `docker-compose.yml`:

```yaml
WORDPRESS_DEBUG: "1"
```

y ejecuta `docker compose up -d`. Para apagarlo, vuelve a comentar la línea (no pongas `"0"`: PHP interpreta cualquier texto no vacío como `true`).

Los errores también aparecen en:

```bash
docker compose logs -f wordpress
```

---

## Correo de prueba con Mailpit

WordPress no envía correos a Internet: el `mu-plugin` [`wp-content/mu-plugins/mailpit.php`](wp-content/mu-plugins/mailpit.php) redirige todo el correo al contenedor `mailpit`.

- Bandeja de entrada: **http://localhost:8025**
- SMTP desde el host: `localhost:1025`
- SMTP entre contenedores: `mailpit:1025` (sin autenticación)

Así puedes probar el registro de usuarios, la recuperación de contraseña o cualquier formulario sin riesgo de enviar emails reales.

El plugin también corrige el remitente `wordpress@localhost`, que PHPMailer considera inválido, por `wordpress@example.test`.

Los mensajes viven en memoria: se pierden al recrear el contenedor. Si quieres conservarlos, descomenta en `docker-compose.yml` el volumen `mailpit_data` y añade `MP_DATABASE: /data/mailpit.db`.

---

## Scripts (`scripts/wp.sh`)

El script centraliza las tareas habituales. Se puede ejecutar desde la raíz del proyecto:

```bash
./scripts/wp.sh help
```

### Respaldar

```bash
./scripts/wp.sh backup
```

Crea `backups/<proyecto>-<fecha>/` con:

- `db.sql.gz`: volcado lógico de MariaDB.
- `wp-content.tar.gz`: temas, plugins, uploads y mu-plugins.
- Copia de `docker-compose.yml` y del `.env` (`env.backup`).
- `meta.txt`: fecha, host, puertos y versiones.

Conserva los últimos 5 respaldos (configurable con `KEEP_BACKUPS`). No copia el volumen `mysql_data` en caliente: usa el volcado SQL para garantizar consistencia.

### Restaurar

```bash
./scripts/wp.sh restore
./scripts/wp.sh restore backups/with-docker-20261030-120000
```

Sin argumento usa el respaldo más reciente. Pide confirmación, detiene WordPress durante la importación y sobrescribe la base de datos y `wp-content`. Si el respaldo se hizo con otro puerto, avisa de que hay que corregir las URLs.

### Corregir URLs tras restaurar en otro puerto

```bash
./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001
```

WordPress guarda la URL del sitio en la base de datos. Si restauras un respaldo en un entorno con otro puerto, los enlaces seguirán apuntando al antiguo hasta que ejecutes este comando (usa WP-CLI en un contenedor temporal).

### Resetear el proyecto

```bash
./scripts/wp.sh reset
```

Pide escribir el nombre del proyecto para confirmar, ofrece hacer un respaldo y ejecuta `docker compose down -v`. **Borra contenedores, red, base de datos y core**, pero no las carpetas locales de `wp-content/`.

### Crear un proyecto/cliente nuevo

```bash
./scripts/wp.sh new-client cliente-b
./scripts/wp.sh new-client cliente-b 2001 3307 8026 1026
```

Copia el proyecto a una carpeta hermana, genera un `.env` con nombre y puertos nuevos, y lo levanta. El WordPress nuevo empieza **vacío** (no copia los uploads ni los respaldos del original). Los puertos por defecto son `2001`, `3307`, `8026` y `1026`.

Variables opcionales:

| Variable         | Defecto              | Descripción                          |
| ---------------- | -------------------- | ------------------------------------ |
| `BACKUP_DIR`     | `./backups`          | Carpeta donde se guardan los respaldos |
| `KEEP_BACKUPS`   | `5`                  | Número de respaldos a conservar      |
| `NEW_CLIENT_DIR` | carpeta padre        | Dónde crear los proyectos nuevos     |

---

## Comprobaciones (`scripts/validate-docker-compose.sh`)

Antes de subir cambios puedes validar el repositorio con:

```bash
./scripts/validate-docker-compose.sh
```

El script **no levanta contenedores, no descarga imágenes y no toca la base de
datos**. Solo comprueba:

1. Que existan los archivos base y que `scripts/wp.sh` sea ejecutable.
2. Que `docker-compose.yml` sea válido y defina `mysql`, `wordpress` y `mailpit`.
3. Que los scripts de `scripts/` no tengan errores de sintaxis Bash.
4. ShellCheck, si está instalado (opcional).
5. Sintaxis PHP de los mu-plugins, si PHP está instalado (opcional).

Devuelve `0` si todo está correcto y `1` si algo falla. Los avisos (por ejemplo,
que ShellCheck no esté instalado) no bloquean la validación.

### Integración continua (GitHub Actions)

El workflow [`.github/workflows/validate.yml`](.github/workflows/validate.yml)
ejecuta `scripts/validate-docker-compose.sh` en cada `push`, `pull_request` o ejecución manual.

**No construye imágenes, no despliega y no sube nada a AWS ni a ningún
registry.** Es únicamente una comprobación de que el compose y los scripts
siguen siendo válidos.

---

## Solución de problemas

### `Error establishing a database connection`

1. Comprueba que MariaDB está sana:

   ```bash
   docker compose ps
   docker compose logs mysql
   ```

2. Verifica que las credenciales de WordPress coinciden con las de MariaDB:

   ```bash
   docker compose exec wordpress env | grep WORDPRESS_DB
   ```

3. Si cambiaste `DB_*` después de crear el volumen, MariaDB conserva las credenciales antiguas. Recupera las originales o recrea el entorno con `./scripts/wp.sh reset`.

4. Confirma que la base existe:

   ```bash
   docker compose exec mysql mariadb -u root -p -e "SHOW DATABASES;"
   ```

### `Access denied for user 'example username'@...`

Ocurría cuando no se definían `WORDPRESS_DB_USER`/`WORDPRESS_DB_PASSWORD` y el `wp-config.php` generado usaba los valores de ejemplo de la plantilla. En este proyecto esas variables siempre se pasan desde `.env`. Si el error aparece tras cambiar el `.env`, revisa que `DB_USER`, `DB_PASSWORD`, `WORDPRESS_DB_USER` y `WORDPRESS_DB_PASSWORD` apunten a los mismos valores.

### El puerto ya está en uso

```bash
lsof -nP -iTCP:2000 -sTCP:LISTEN
```

Cambia el puerto correspondiente en `.env` (`WP_PORT`, `DB_PORT`, `MAILPIT_UI_PORT` o `MAILPIT_SMTP_PORT`) y ejecuta `docker compose up -d`.

### La web carga pero los enlaces apuntan a otro puerto/dominio

Es normal después de restaurar un respaldo o cambiar de puerto. Ejecuta:

```bash
./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001
```

### No llegan los correos

1. Abre http://localhost:8025 y comprueba si el mensaje está ahí.
2. Revisa que el mu-plugin existe:

   ```bash
   docker compose exec wordpress ls wp-content/mu-plugins
   ```

3. Prueba el envío:

   ```bash
   docker compose exec wordpress php -r \
     'require "/var/www/html/wp-load.php"; var_dump(wp_mail("tu@example.test", "Prueba", "Hola"));'
   ```

### Permisos en Linux

WordPress corre como `www-data` (UID 33). Si aparecen errores de permisos al subir medios o instalar plugins:

```bash
sudo chown -R 33:33 wp-content/uploads wp-content/mu-plugins
```

Con SELinux (Fedora/RHEL/CentOS), añade `:z` a los bind mounts del compose.

### Windows

Usa Docker Desktop con backend WSL2 y guarda el proyecto **dentro** del sistema de archivos de WSL (por ejemplo `~/code/...`), no en `/mnt/c/...`, por rendimiento y permisos. Configura Git con `core.autocrlf=input` para no guardar los `.sh` con CRLF.

---

## Chuleta de comandos

```bash
# Entorno
docker compose up -d
docker compose ps
docker compose logs -f wordpress
docker compose down

# Base de datos
docker compose exec mysql mariadb -u wordpress -p wordpress
docker compose exec mysql mariadb -u root -p -e "SHOW DATABASES;"

# Correo
open http://localhost:8025          # macOS
# xdg-open http://localhost:8025    # Linux

# Scripts
./scripts/validate-docker-compose.sh
./scripts/wp.sh backup
./scripts/wp.sh restore
./scripts/wp.sh reset
./scripts/wp.sh new-client cliente-b 2001 3307 8026 1026
./scripts/wp.sh fix-urls http://localhost:2000 http://localhost:2001

# Volúmenes (ver qué existe)
docker volume ls | grep "$(grep '^COMPOSE_PROJECT_NAME=' .env | cut -d= -f2)"
```

---

## Seguridad y reporte de vulnerabilidades

Este proyecto es para **desarrollo local** y algunas configuraciones son
intencionadamente inseguras en producción (credenciales de ejemplo, MariaDB
accesible en la red local, Mailpit sin autenticación, etc.). Eso no se considera
una vulnerabilidad.

Si encuentras un problema de seguridad real (exposición de secretos, un fallo en
los scripts que pueda borrar datos, acceso no previsto, etc.):

1. **No abras un issue público.**
2. Usa los **GitHub Security Advisories** del repositorio (*Security →
   Advisories → Report a vulnerability*).
3. Si ese canal no está disponible, contacta al mantenedor por el medio
   indicado en su perfil.

Incluye descripción, impacto, pasos para reproducir y versión/commit afectado.
Los detalles completos están en [`SECURITY.md`](SECURITY.md).

---

## Licencia

Este proyecto se distribuye bajo la **licencia MIT**. Consulta
[`LICENSE`](LICENSE).

Copyright (c) 2026 Barrie Freyre.

El software se ofrece **tal cual**, sin garantías de ningún tipo. Consulta
también el [descargo de responsabilidad](#descargo-de-responsabilidad).

---

## Notas para producción

Este entorno está pensado para **desarrollo local**. Antes de usarlo en producción:

- No publiques MariaDB en `0.0.0.0` ni uses contraseñas de ejemplo.
- Desactiva `WP_DEBUG` y cualquier plugin de desarrollo.
- No uses Mailpit como servidor de correo real.
- Sirve el sitio detrás de HTTPS.
- Revisa los permisos de archivos y la política de respaldos.
