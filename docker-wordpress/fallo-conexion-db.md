# Fallo de conexión a la base de datos — WordPress + MariaDB con Docker Compose

> Documento de sesión. Recoge el problema, el diagnóstico real (con evidencia de logs),
> la causa raíz, la solución aplicada y los conceptos de Docker/Compose que aparecieron.
> Fecha de la sesión: 2026-10-29 · Directorio: `/Users/dthm/Code/wordpress/with-docker`

---

## 1. Punto de partida

`docker-compose.yml` inicial:

```yaml
version: "3"
services:
        mysql:
            image: mariadb
            ports:
                - "3260:3260"
            volumes:
                - mysql_data:/var/lib/mysql
            environment:
                MYSQL_ROOT_PASSWORD: example

        wordpress:
          image: wordpress
          ports:
              - "2000:80"
          volumes:
              - mywebsite_data:/var/www/html
              - ./wp-content/themes/:/var/www/html/wp-content/themes
              - ./wp-content/plugins/:/var/www/html/wp-content/plugins
          environment:
              WORDPRESS_DB_PASSWORD: example
          depends_on:
              - mysql
          links:
              - mysql
volumes:
        mysql_data:
        mywebsite_data:
```

**Síntoma reportado:** la web en `http://localhost:2000` devuelve HTTP 500 y WordPress
no conecta con la base de datos.

---

## 2. Diagnóstico (evidencia, no suposiciones)

Comandos usados:

```bash
docker compose ps -a
docker compose logs --tail=30
docker volume ls | grep -i with-docker
docker run --rm -v with-docker_mywebsite_data:/v alpine sh -c \
  'grep -E "DB_(NAME|USER|HOST|PASSWORD)" /v/wp-config.php'
docker run --rm -v with-docker_mysql_data:/v alpine sh -c 'ls /v'
```

### 2.1 Log de MariaDB (la prueba clave)

```
mysql-1 | [Warning] Access denied for user 'example username'@'172.19.0.3' (using password: YES)
wordpress-1 | "GET / HTTP/1.1" 500 2808
```

Dos datos importantes:

1. El usuario que intenta conectar es literalmente `example username`.
2. `(using password: YES)` → la contraseña **sí** se estaba enviando; el rechazo no era por
   contraseña incorrecta, sino por **usuario inexistente**.

### 2.2 El `wp-config.php` generado dentro del volumen

```
define( 'DB_NAME',     getenv_docker('WORDPRESS_DB_NAME',     'wordpress') );
define( 'DB_USER',     getenv_docker('WORDPRESS_DB_USER',     'example username') );
define( 'DB_PASSWORD', getenv_docker('WORDPRESS_DB_PASSWORD', 'example password') );
define( 'DB_HOST',     getenv_docker('WORDPRESS_DB_HOST',     'mysql') );
```

### 2.3 MariaDB escucha en 3306, no en 3260

```
mysql-1 | [Note] Server socket created on IP: '0.0.0.0', port: '3306'.
mysql-1 | Version: '13.0.2-MariaDB-ubu2604' ... port: 3306
```

### 2.4 La base `wordpress` no existía

```
$ docker run --rm -v with-docker_mysql_data:/v alpine sh -c 'ls /v'
mysql          # <-- solo el esquema interno; NO había directorio "wordpress"
```

---

## 3. Causa raíz

La imagen oficial de WordPress genera `wp-config.php` a partir de la plantilla
`wp-config-docker.php`, que usa `getenv_docker('VARIABLE', 'valor_por_defecto')`.
Los valores por defecto **no son neutros**: son de relleno.

| Variable | En el compose | Valor efectivo | Efecto |
|---|---|---|---|
| `WORDPRESS_DB_USER` | **(sin definir)** | `example username` | ❌ usuario no existe → Access denied |
| `WORDPRESS_DB_NAME` | (sin definir) | `wordpress` | ❌ base no existía → `Unknown database` |
| `WORDPRESS_DB_HOST` | (sin definir) | `mysql` | ✅ correcto (DNS interno + `links`) |
| `WORDPRESS_DB_PASSWORD` | `example` | `example` | ✅ coincidía con el root |

**Conclusiones:**

- El fallo **no era de red** (los contenedores se veían perfectamente).
- El fallo **no era de contraseña**.
- Era un fallo de **usuario inexistente**, provocado por *omitir* `WORDPRESS_DB_USER`
  y quedarse con el default de relleno de la imagen.
- Y detrás había un **segundo bloqueo en cola**: `MYSQL_ROOT_PASSWORD` por sí solo
  **no crea ninguna base de datos**, así que `wordpress` no existía.

> ⚠️ Lección transversal: cuando una variable de entorno falta, el fallo puede aparecer
> como un error críptico en el **otro** contenedor. Siempre mirar los logs de ambos.

---

## 4. Problemas secundarios detectados

| # | Problema | Consecuencia |
|---|---|---|
| 1 | `ports: "3260:3260"` | MariaDB escucha en 3306; el mapeo no publicaba nada útil |
| 2 | Solo `MYSQL_ROOT_PASSWORD` | No se creaba la base `wordpress` ni un usuario de app |
| 3 | WordPress conectaba como `root` | Mala práctica: máximo privilegio expuesto a la web |
| 4 | `depends_on` en forma corta | Solo ordena el arranque, **no espera** a que la BD esté lista → carrera en el primer `up` |
| 5 | `links:` | Obsoleto; Compose ya resuelve por nombre de servicio |
| 6 | `version: "3"` | Obsoleto en Compose v2 → warning `the attribute 'version' is obsolete` |
| 7 | Bind mount `./wp-content/themes/` | Montado *encima* del volumen: si la carpeta local está vacía, oculta los temas por defecto |

---

## 5. Solución aplicada (Opción A: recrear volúmenes)

Se eligió **Opción A** porque el sitio aún no estaba instalado: no había datos que perder.
La Opción B (alternativa) habría sido crear la base y el usuario a mano sobre el volumen
ya inicializado, porque las variables `MYSQL_DATABASE` / `MYSQL_USER` del entrypoint
**solo se aplican cuando el datadir está vacío**.

```bash
docker compose config --quiet   # validación de sintaxis YAML -> "YAML OK"
docker compose down -v          # borra contenedores + red + VOLÚMENES
docker compose up -d
```

Salida que confirma el orden correcto de arranque:

```
Container with-docker-mysql-1 Started
Container with-docker-mysql-1 Waiting
Container with-docker-mysql-1 Healthy      <-- WordPress arranca solo aquí
Container with-docker-wordpress-1 Started
```

> `down -v` **no** borra los bind mounts: `./wp-content/themes` y `./wp-content/plugins`
> siguen intactos en el host. Solo se eliminan los volúmenes Docker gestionados.

### 5.1 `docker-compose.yml` final

```yaml
# ============================================================================
#  WordPress + MariaDB en Docker Compose
# ============================================================================
#  Ya NO se usa la línea `version: "3"`: en Compose v2 está obsoleta, Docker
#  la ignora y avisa con un warning. El formato actual se detecta solo.
#
#  Conceptos clave:
#   - Cada entrada de `services:` es un CONTENEDOR (una "máquina" aislada).
#   - Los contenedores de este mismo archivo se ven entre sí por su NOMBRE
#     de servicio (`mysql`), gracias a la red interna que Compose crea.
#     Por eso ya no hace falta la vieja clave `links:` (obsoleta).
#   - `ports:` publica un puerto hacia TU Mac. NO es necesario para que
#     WordPress hable con la base de datos (eso pasa por la red interna).
#   - `volumes:` guarda datos fuera del contenedor para que no se pierdan
#     al recrearlo.
# ============================================================================

services:

  # --------------------------------------------------------------------------
  #  BASE DE DATOS
  # --------------------------------------------------------------------------
  mysql:
    image: mariadb
    # "mariadb" sin tag = última versión estable (aquí 13.x).
    # Nota: MariaDB escucha SIEMPRE en el puerto 3306 DENTRO del contenedor.

    ports:
      # Sintaxis "HOST:CONTENEDOR".
      #   izquierda  = puerto en tu Mac (para conectarte con un cliente SQL)
      #   derecha    = puerto dentro del contenedor (3306, el de MariaDB)
      # Antes estaba "3260:3260", que no servía: MariaDB nunca escucha en 3260.
      - "3306:3306"
      # Si el 3306 de tu Mac ya está ocupado por otra cosa (por ejemplo un
      # MySQL local), cambia solo la izquierda:  "3307:3306"  y conéctate
      # desde el host a localhost:3307. WordPress no se ve afectado.

    volumes:
      # Persiste /var/lib/mysql (los archivos reales de la base) en el volumen
      # Docker llamado "mysql_data". Sin esto, cada `down` borraría la BD.
      - mysql_data:/var/lib/mysql

    environment:
      # Estas variables NO son de Docker: las lee el "entrypoint" (script de
      # arranque) que trae la imagen de MariaDB. Solo tienen efecto la PRIMERA
      # vez que se inicializa el volumen (datadir vacío). Si el volumen ya
      # existe, se ignoran por completo.

      # Obligatoria: contraseña del usuario administrador 'root'.
      MYSQL_ROOT_PASSWORD: example

      # Crea automáticamente esta base de datos al inicializar.
      # Sin esto, WordPress pediría la base "wordpress" y no existiría
      # ("Unknown database 'wordpress'").
      MYSQL_DATABASE: wordpress

      # Crea un usuario de aplicación (además de root) y le da todos los
      # permisos sobre MYSQL_DATABASE. Se crea como 'wordpress'@'%', es decir
      # acepta conexiones desde cualquier contenedor de la red.
      # Es mejor que usar root: si la web se compromete, no expones el admin.
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: example
      # MYSQL_USER y MYSQL_PASSWORD deben coincidir EXACTAMENTE con las
      # variables WORDPRESS_DB_USER / WORDPRESS_DB_PASSWORD de abajo.

    healthcheck:
      # OJO: "healthcheck" NO es una palabra reservada de Docker, es una
      # CLAVE del esquema de Compose (como `ports` o `volumes`). Lo que sí es
      # parte del motor Docker es el estado de salud del contenedor:
      #   starting -> healthy | unhealthy
      #
      # ¿Por qué se implementa? Un contenedor "arrancado" no es lo mismo que
      # "listo para aceptar conexiones". MariaDB tarda varios segundos en
      # inicializar InnoDB la primera vez. `depends_on` normal solo espera a
      # que el contenedor EXISTA, así que WordPress arrancaba antes de tiempo
      # y devolvía error 500 ("Error establishing a database connection").
      # Con healthcheck, Compose ejecuta este comando cada 5s hasta que
      # responde bien, y WordPress solo arranca cuando está `healthy`.
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      # healthcheck.sh viene incluido en la imagen oficial de MariaDB:
      #   --connect            -> ¿acepta conexiones ya el servidor?
      #   --innodb_initialized -> ¿terminó de inicializar el motor InnoDB?
      interval: 5s      # cada cuánto se ejecuta la prueba
      timeout: 5s       # cuánto puede tardar como máximo cada prueba
      retries: 10       # fallos consecutivos antes de marcarlo "unhealthy"
      start_period: 30s # margen de gracia inicial: los fallos aquí no cuentan
                        # (útil en el primer arranque, que es el más lento)

  # --------------------------------------------------------------------------
  #  WORDPRESS (Apache + PHP)
  # --------------------------------------------------------------------------
  wordpress:
    image: wordpress

    ports:
      # "2000:80" -> http://localhost:2000 apunta al Apache (puerto 80)
      # dentro del contenedor. Solo la izquierda (2000) es tuya; puedes
      # cambiarla por 8080, etc., sin tocar nada más.
      - "2000:80"

    volumes:
      # 1) Volumen con TODO WordPress (core + wp-config.php + wp-content).
      #    Persiste entre reinicios y permite que el entrypoint copie el core
      #    la primera vez.
      - mywebsite_data:/var/www/html

      # 2) y 3) Bind mounts: carpetas de TU Mac montadas encima de las del
      #    contenedor. Sirven para editar temas/plugins en tu editor y ver los
      #    cambios al instante, sin reconstruir la imagen.
      #    Al montarse "encima", ocultan el contenido original del volumen:
      #    por eso ./wp-content/themes debe tener al menos un tema dentro, o
      #    WordPress se quedará sin temas disponibles.
      - ./wp-content/themes/:/var/www/html/wp-content/themes
      - ./wp-content/plugins/:/var/www/html/wp-content/plugins

    environment:
      # Estas variables las lee el entrypoint de la imagen oficial de
      # WordPress. Si no existe wp-config.php en el volumen, lo genera con
      # la plantilla wp-config-docker.php, que hace:
      #     define( 'DB_USER', getenv_docker('WORDPRESS_DB_USER', 'example username') );
      # Es decir: lee la variable de entorno y, si no está definida, usa ese
      # texto literal ("example username") como valor por defecto.
      # Ese era el bug: al no definir WORDPRESS_DB_USER, WordPress intentaba
      # entrar como el usuario "example username" y MariaDB respondía
      # "Access denied for user 'example username'@'172.x.x.x'".
      #
      # Como wp-config.php usa getenv_docker() en tiempo de ejecución, no hay
      # que borrarlo: basta con definir bien las variables aquí.

      # Host = nombre del servicio + puerto interno de MariaDB (3306).
      # "mysql" funciona porque Compose crea un DNS interno con ese nombre.
      # El puerto es el INTERNO, nunca el de `ports:` del host.
      WORDPRESS_DB_HOST: mysql:3306

      # Nombre de la base. Debe existir -> la crea MYSQL_DATABASE de arriba.
      # Su valor por defecto es "wordpress", pero lo dejamos explícito para
      # que se vea que ambos servicios hablan de lo mismo.
      WORDPRESS_DB_NAME: wordpress

      # Usuario y contraseña deben coincidir con MYSQL_USER/MYSQL_PASSWORD.
      # (Aquí sí se puede usar root/example, pero es mala práctica.)
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: example

    depends_on:
      # Forma larga: no solo "arráncalo antes", sino "espera a que su
      # healthcheck diga healthy". Esto elimina la carrera del primer arranque.
      # (La forma corta `- mysql` solo ordena el arranque, no espera a que
      # la base esté lista.)
      mysql:
        condition: service_healthy

    # Opcional: para desarrollo se suele añadir
    #   WORDPRESS_DEBUG: "1"   -> muestra errores PHP en pantalla.
    #   WORDPRESS_CONFIG_EXTRA: |
    #     define( 'WP_HOME', 'http://localhost:2000' );
    #     define( 'WP_SITEURL', 'http://localhost:2000' );
    # Solo si necesitas forzar la URL (por ejemplo, al usar otro dominio o
    # proxy). Normalmente WordPress la detecta sola desde la petición.
    restart: unless-stopped
    # `restart` sí es una clave de Compose que habla con el motor Docker:
    # "unless-stopped" = reinicia si el contenedor se cae o si reinicias
    # Docker, salvo que tú lo hayas parado a propósito (`docker compose stop`).

# ============================================================================
#  VOLÚMENES NOMBRADOS
# ============================================================================
# Se declaran aquí para que Docker los gestione (con prefijo del proyecto,
# p. ej. "with-docker_mysql_data"). Se crean automáticamente al hacer `up`.
# `docker compose down` los conserva; `docker compose down -v` los borra.
volumes:
  mysql_data:      # archivos de la base de datos
  mywebsite_data:  # archivos de WordPress dentro del contenedor
```

---

## 6. Verificación posterior

| Prueba | Comando | Resultado |
|---|---|---|
| Estado | `docker compose ps` | mysql `Up (healthy)` · wordpress `Up` |
| Redirección WP | `curl -D - http://localhost:2000/` | `302` → `/wp-admin/install.php` |
| Instalador | `curl -o /dev/null -w "%{http_code}" .../install.php` | `200`, `<title>WordPress › Installation</title>` |
| Base creada | `docker compose exec mysql mariadb -uwordpress -pexample -e "SHOW DATABASES;"` | aparece `wordpress` |
| Logs | `docker compose logs wordpress \| grep -i error` | sin `Access denied` ni `Error establishing` |

Llegar a `/wp-admin/install.php` con 200 es la prueba de extremo a extremo: WordPress
ya consultó la BD y obtuvo respuesta válida (si no, mostraría
"Error establishing a database connection").

Puertos publicados finales:

```
mysql-1      0.0.0.0:3306->3306/tcp      (healthy)
wordpress-1  0.0.0.0:2000->80/tcp
```

---

## 7. Conceptos explicados en la sesión

### 7.1 ¿`healthcheck` es palabra reservada de Docker?

No. Es una **clave del esquema de Docker Compose**, al mismo nivel que `ports`,
`volumes` o `depends_on`. Lo que sí pertenece al motor Docker es el **estado de salud**
que esa clave provoca: `starting` → `healthy` / `unhealthy`, visible en `docker ps`.

### 7.2 ¿Por qué se implementa el healthcheck?

Porque "contenedor arrancado" ≠ "servicio listo". MariaDB tarda en inicializar InnoDB.
`depends_on` en forma corta solo garantiza **orden de arranque**, no disponibilidad,
así que WordPress podía consultar una BD que aún no escuchaba → HTTP 500.
Con `condition: service_healthy`, WordPress espera de verdad.

### 7.3 ¿Qué hace `healthcheck.sh`?

Script incluido en la imagen oficial de MariaDB:

- `--connect` → ¿el servidor ya acepta conexiones?
- `--innodb_initialized` → ¿el motor InnoDB terminó de inicializarse?

Con `interval: 5s`, `timeout: 5s`, `retries: 10` y `start_period: 30s`
(los fallos dentro del `start_period` no cuentan, porque el primer arranque es el más lento).

### 7.4 Variables de entorno: ¿de quién son?

**No son de Docker.** Docker solo las inyecta. Las *lee* el **entrypoint** (script de
arranque) de cada imagen:

- `MYSQL_*` → entrypoint de `mariadb`. Solo se aplican **al inicializar un datadir vacío**.
- `WORDPRESS_DB_*` → entrypoint de `wordpress`, para generar `wp-config.php`.

Como el `wp-config.php` generado usa `getenv_docker(...)` en *runtime*, cambiar el
`environment` del servicio basta: **no hay que borrar** `wp-config.php`.

### 7.5 `ports` vs red interna

- `ports: "HOST:CONTENEDOR"` → publica un puerto hacia tu Mac. Solo para clientes externos.
- WordPress→MySQL viaja por la **red interna** de Compose, usando `nombre_servicio:puerto_interno`
  (`mysql:3306`). El mapeo de `ports` es irrelevante para eso.

### 7.6 Volumen nombrado vs bind mount

- **Volumen nombrado** (`mysql_data:/var/lib/mysql`) → gestionado por Docker, sobrevive a
  `down`, se borra con `down -v`.
- **Bind mount** (`./wp-content/themes:/var/www/html/wp-content/themes`) → carpeta real de tu
  Mac. `down -v` **no** la toca. Editas en tu IDE y el contenedor lo ve al instante.
  Cuidado: un bind mount **oculta** lo que hubiera debajo en la imagen/volumen.

### 7.7 `depends_on`: forma corta vs larga

```yaml
depends_on:            # corto: solo ordena el arranque
  - mysql

depends_on:            # largo: espera al healthcheck
  mysql:
    condition: service_healthy
```

### 7.8 `restart: unless-stopped`

Reinicia el contenedor si se cae o si reinicias Docker, **salvo** que lo hayas parado
tú explícitamente.

---

## 8. Checklist reutilizable para "falla la conexión a la BD"

1. **Leer logs de los dos contenedores**, no solo el de WordPress:
   `docker compose logs --tail=50 mysql wordpress`
2. Buscar `Access denied for user 'X'` → ese `X` es el usuario que realmente se está usando.
3. Comparar `WORDPRESS_DB_USER/PASSWORD/NAME/HOST` con `MYSQL_USER/PASSWORD/DATABASE`.
4. Revisar el `wp-config.php` generado:
   `docker compose exec wordpress grep -E "DB_" /var/www/html/wp-config.php`
5. Comprobar que la base existe:
   `docker compose exec mysql mariadb -uroot -p... -e "SHOW DATABASES;"`
6. Comprobar el puerto real de escucha en el log (`port: '3306'`) y que el host sea
   `servicio:3306` (puerto **interno**).
7. Verificar orden con `docker compose ps` → debe decir `(healthy)`.
8. Si el volumen ya existía, recordar que `MYSQL_DATABASE`/`MYSQL_USER` **no se re-aplican**:
   o `down -v`, o `CREATE DATABASE` / `CREATE USER` manual.

### Errores típicos y su lectura

| Mensaje | Significado real |
|---|---|
| `Access denied for user 'x'@'172.x.x.x'` | El usuario `x` no existe o no tiene permiso desde ese host. **No** es la contraseña. |
| `Access denied` con `(using password: NO)` | Falta la contraseña (variable no definida). |
| `Unknown database 'wordpress'` | Falta `MYSQL_DATABASE` o el volumen se inicializó antes de añadirla. |
| `Error establishing a database connection` | Síntoma genérico de WordPress; la causa está en el log de MySQL. |
| `Can't connect to MySQL server ... (111)` | Host/puerto mal, o MySQL aún no está listo (falta healthcheck). |
| `the attribute 'version' is obsolete` | `version: "3"` sobra en Compose v2. |

---

## 9. Comandos de referencia rápida

```bash
# Ciclo de vida
docker compose up -d                 # crear y arrancar en segundo plano
docker compose ps                    # estado + healthcheck
docker compose logs -f --tail=50     # logs en vivo
docker compose down                  # parar y borrar contenedores (conserva volúmenes)
docker compose down -v               # ... y borra VOLÚMENES (destructivo)
docker compose restart wordpress     # reiniciar un servicio
docker compose config                # ver el YAML resuelto (útil para depurar)

# Inspección
docker compose exec mysql mariadb -uwordpress -p -e "SHOW DATABASES;"
docker compose exec wordpress grep -E "DB_" /var/www/html/wp-config.php
docker volume ls
docker run --rm -v with-docker_mysql_data:/v alpine ls /v

# Cliente SQL desde el host (con ports 3306:3306)
mysql -h 127.0.0.1 -P 3306 -uwordpress -p wordpress
```

---

## 10. Lecciones aprendidas

1. **Los defaults de relleno son trampas.** `example username` / `example password` en la
   imagen de WordPress convierten "me faltó una variable" en un error de autenticación
   desconcertante.
2. **El error se ve en el servicio contrario.** WordPress falla, pero la explicación está
   en los logs de MariaDB.
3. **`(using password: YES/NO)`** distingue entre "contraseña mala" y "usuario inexistente".
4. **Arrancar ≠ estar listo.** `depends_on` corto no basta para bases de datos.
5. **`ports` no es la red interna.** Los contenedores hablan por `servicio:puerto_interno`.
6. **Las variables `MYSQL_*` son de un solo uso.** Se aplican al inicializar el datadir;
   después hay que actuar a mano o recrear el volumen.
7. **WordPress llega a `install.php` con 200 = conexión OK.** Es la prueba más rápida de
   extremo a extremo, mejor que adivinar por el 500.
8. **Diagnosticar con evidencia** (`ps`, `logs`, `grep` del wp-config, `ls` del volumen)
   evita "arreglar" cosas que no estaban rotas.
