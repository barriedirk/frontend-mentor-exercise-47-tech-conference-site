# Política de seguridad

## Alcance

Este repositorio es un **entorno de WordPress para desarrollo local**. No está
diseñado ni configurado para producción. Por eso algunas decisiones son
intencionadamente inseguras en un contexto real, por ejemplo:

- Credenciales de ejemplo (`example`) en `.env`.
- MariaDB publicada en todas las interfaces para poder revisarla desde la red local.
- Mailpit capturando todo el correo sin autenticación.
- `WP_DEBUG` activable y ausencia de HTTPS.

Esos puntos **no se consideran vulnerabilidades** del proyecto. Si necesitas un
entorno seguro, revisa y adapta la configuración, y no uses estos archivos tal
cual en producción.

Sí son bienvenidos los reportes sobre:

- Exposición accidental de credenciales o secretos en el repositorio.
- Fallos en `scripts/wp.sh` que puedan provocar pérdida de datos, ejecución de
  comandos no deseados o borrados fuera del proyecto.
- Configuraciones del compose que permitan acceso no previsto más allá de lo
  documentado.
- Problemas en `wp-content/mu-plugins/mailpit.php` o en los archivos incluidos.

## Cómo reportar una vulnerabilidad

**No abras un issue público** para problemas de seguridad.

Usa el canal privado del repositorio:

1. Ve a la pestaña **Security** del repositorio en GitHub.
2. Entra en **Advisories** y crea un **privately reported vulnerability**
   (GitHub Security Advisories).
3. Si ese canal no está disponible, contacta al mantenedor por el medio
   indicado en su perfil de GitHub.

Incluye, si es posible:

- Descripción del problema y su impacto.
- Pasos para reproducirlo.
- Versión, commit o fecha del código afectado.
- Entorno (macOS/Linux/Windows, versión de Docker).
- Propuesta de solución, si la tienes.

Evita incluir datos reales, contraseñas o información de terceros en el reporte.

## Qué puedes esperar

- Se intentará confirmar y evaluar el reporte en un plazo orientativo de
  **7 días hábiles**.
- Si se confirma, se corregirá en la medida de lo posible y se documentará el
  cambio.
- No hay garantía de tiempos de respuesta, soporte continuo ni recompensas
  económicas (no existe un programa de bug bounty).
- La divulgación se coordinará contigo antes de hacerla pública.

## Buenas prácticas para quien use el repositorio

- Revisa `docker-compose.yml`, `scripts/wp.sh` y `.env` antes de ejecutarlos.
- No uses este entorno en producción.
- No subas credenciales reales al repositorio.
- Haz respaldos antes de `restore`, `reset` o `docker compose down -v`.
- Mantén Docker, las imágenes y tu sistema actualizados.
- Si no necesitas acceso remoto a la base de datos, limita el puerto a
  `127.0.0.1` (hay un comentario en `docker-compose.yml` que indica cómo).

## Responsabilidad

Este proyecto se distribuye **tal cual** (*as is*), sin garantías. La seguridad
del entorno, de las credenciales y de los datos es responsabilidad de quien lo
usa. Consulta el [descargo de responsabilidad](README.md#descargo-de-responsabilidad)
y la [licencia MIT](LICENSE).
