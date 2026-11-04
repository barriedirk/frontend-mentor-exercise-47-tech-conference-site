# Tech-conference-site

Tema WordPress personalizado para **DevHorizon 2026**, construido a partir del diseño estático de Frontend Mentor y del sistema de diseño `design.md_cyber_industrial_terminal.md`.

## Requisitos

- WordPress 6.5 o superior.
- PHP 7.4 o superior.
- Sin plugins obligatorios.

## Instalación

1. Copia esta carpeta en `wp-content/themes/tech-conference-site`.
2. Activa el tema en **Apariencia → Temas**.
3. Ve a **Herramientas → Importar DevHorizon** y pulsa **Importar contenido DevHorizon**.
4. Crea tres páginas:
   - `Home` con la plantilla **Home - DevHorizon**.
   - `Speakers` con la plantilla **Speakers - DevHorizon**.
   - `Schedule` con la plantilla **Schedule - DevHorizon**.
5. En **Ajustes → Lectura**, selecciona `Home` como página de portada estática.
6. En **Ajustes → Enlaces permanentes**, elige una estructura distinta de “Simple”, por ejemplo `/%postname%/`.
7. En **Apariencia → Menús**, crea un menú con Home, Schedule y Speakers y asígnalo a la ubicación **Menú Principal**.

Si el menú aún no existe, el tema muestra un fallback con esos tres enlaces.

## Contenido

El tema registra dos Custom Post Types internos:

### Speakers

- Nombre: título.
- Biografía: editor.
- Foto: imagen destacada.
- Rol y empresa: metabox **Datos del speaker**.
- Destacado en la home: checkbox del metabox.
- Orden: atributo **Orden** de la página.

### Sesiones

- Título de la charla: título.
- Descripción: editor.
- Speaker: selector del metabox.
- Día, horas y localización: metabox **Datos de la sesión**.
- Track: taxonomía **Tracks**.
- Destacada en la home: checkbox del metabox.
- Orden: atributo **Orden** de la página.

### Tracks

Taxonomía `devhorizon_track` con los términos:

- Keynote
- Frontend
- Performance
- Accessibility
- Tooling

## Importador

El importador lee `data/devhorizon-data.json` y:

- crea o actualiza los 5 tracks,
- crea o actualiza los 20 speakers,
- sube los 20 avatares a la Media Library y los asigna como imagen destacada,
- crea o actualiza las 20 sesiones,
- asigna speaker, track, día, horas, localización y flags de destacado.

Es idempotente: se puede ejecutar varias veces sin duplicar contenido.

## Estructura

```text
.
├── style.css
├── functions.php
├── header.php
├── footer.php
├── index.php
├── page-home.php
├── page-speakers.php
├── page-schedule.php
├── inc/
│   ├── post-types.php
│   ├── meta-fields.php
│   ├── queries.php
│   ├── template-tags.php
│   └── importer.php
├── template-parts/
│   ├── speaker-card.php
│   ├── session-card.php
│   └── modal-speaker.php
├── data/
│   └── devhorizon-data.json
├── js/
│   └── main.js
├── images/
├── fonts/
└── home/, speakers/, schedule/, modal-component/
```

Las carpetas `home/`, `speakers/`, `schedule/` y `modal-component/` son los archivos estáticos originales y se conservan como referencia. No se cargan en WordPress.

## Interacción

- Menú móvil accesible con `aria-expanded`.
- Modal de speaker relleno desde atributos `data-*`.
- Cierre con botón, backdrop y `Escape`; trampa de foco y retorno al elemento que abrió el modal.
- Toggles de detalles en la home y en el schedule.
- Filtros de día y track.
- Enlaces directos `?day=2` y `?track=frontend`.
- “MY SCHEDULE” muestra los bookmarks de todos los días; al elegir un día concreto se sale de ese modo.
- “CLEAR” limpia los filtros y vuelve al día 1 sin borrar los bookmarks.
- Bookmarks persistentes en `localStorage` con la clave `devhorizon:bookmarks`.

## Personalización rápida

### Colores y tipografía

Todos los tokens están en `style.css`, dentro de `:root`:

```css
--color-surface-terminal: #00151d;
--color-accent-lime: #d1ff66;
--color-accent-cyan: #b5e9fc;
--color-accent-biscuit: #ffe6ba;
--color-border-dark: #33444a;
--font-display: 'Chakra Petch', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

### Imágenes

Las imágenes del tema viven en `images/`. Las tarjetas usan la imagen destacada del speaker; si no existe, se usa `images/pattern-avatar-bg.svg` como fallback.

### Fuentes

Las fuentes están autoalojadas en `fonts/`:

- Chakra Petch (SemiBold y Bold).
- JetBrains Mono Variable.

Las licencias OFL están incluidas en cada carpeta.

## Validación

```bash
# Sintaxis PHP
find . -name '*.php' -not -path './home/*' -not -path './speakers/*' \
  -not -path './schedule/*' -not -path './modal-component/*' -exec php -l {} \;

# Comprobar que las imágenes referenciadas existen
grep -Rho "avatar-[a-z-]*\.webp" --include='*.php' . | sort -u
```
