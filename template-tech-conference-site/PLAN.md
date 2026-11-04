# Plan de implementación — Tema WordPress DevHorizon 2026

## Decisiones aprobadas

- **CSS:** un único `style.css` con tokens del design system y scoping por página:
  - `body.page-home`
  - `body.page-speakers`
  - `body.page-schedule`
  - `.modal-backdrop`
- **Tipografía:** Chakra Petch + JetBrains Mono autoalojadas, alineadas con `design.md`.
- **Contenido:** Custom Post Types internos, metaboxes nativos y taxonomía propia. Sin ACF ni plugins.
- **Importación:** botón manual en Herramientas → Importar DevHorizon.
- **CPT:** sin URLs públicas individuales; el detalle se muestra en el modal.
- **JavaScript:** menú móvil, modal, filtros de día/track, toggles de detalles y bookmarks persistentes.

## Modelo de contenido

### CPT `devhorizon_speaker`

| Campo | Almacenamiento |
| --- | --- |
| Nombre | `post_title` |
| Biografía | `post_content` |
| Foto | Featured image |
| Rol | `_devhorizon_role` |
| Empresa | `_devhorizon_company` |
| Destacado en home | `_devhorizon_featured` |
| Orden | `menu_order` |

### CPT `devhorizon_session`

| Campo | Almacenamiento |
| --- | --- |
| Título de la charla | `post_title` |
| Descripción | `post_content` |
| Speaker | `_devhorizon_speaker_id` |
| Día | `_devhorizon_day` |
| Hora inicial / final | `_devhorizon_start_time`, `_devhorizon_end_time` |
| Minutos de inicio | `_devhorizon_start_minutes` |
| Localización | `_devhorizon_location` |
| Destacada en home | `_devhorizon_highlighted` |
| Track | Taxonomía `devhorizon_track` |

### Taxonomía `devhorizon_track`

Slugs: `keynote`, `frontend`, `performance`, `accessibility`, `tooling`.

Term meta:

- `_devhorizon_order`
- `_devhorizon_color`

## Estructura de archivos

```text
template-tech-conference-site/
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
├── README.md
├── PLAN.md
└── home/, speakers/, schedule/, modal-component/   # referencia estática
```

## Fases

1. Copiar imágenes, fuentes y `data.json` al tema.
2. Crear `style.css` con cabecera WordPress, fuentes, tokens, header/footer canónicos y secciones con scoping.
3. Crear `functions.php` y los archivos de `inc/`.
4. Crear `header.php`, `footer.php`, `index.php` y el partial del modal.
5. Crear las tres plantillas y los partials de tarjetas.
6. Crear `js/main.js` con toda la interacción.
7. Crear `README.md` con instalación y uso.
8. Validar sintaxis PHP, rutas de imágenes y CSS.

## Reglas de implementación

- Todo el PHP lleva guardia `ABSPATH`.
- Todas las salidas se escapan con `esc_html`, `esc_attr`, `esc_url` o `wp_kses_post`.
- Todos los formularios del admin usan nonce y comprobación de capacidades.
- El importador es idempotente y no duplica posts, términos ni adjuntos.
- Las imágenes de las tarjetas usan Featured Image con fallback a `images/pattern-avatar-bg.svg`.
- El modal se rellena desde atributos `data-*` de cada tarjeta, sin AJAX.
- Los bookmarks se guardan en `localStorage` con la clave `devhorizon:bookmarks`.
- Los filtros aceptan `?day=` y `?track=` para enlaces directos desde el footer.
- No se modifican los archivos estáticos de referencia.

## Validación

- `php -l` a todos los archivos PHP.
- Comprobar que todas las rutas de `images/` existen.
- Revisar que no queden selectores de tickets sin scoping.
- Verificar que las tres plantillas incluyen `get_header()` y `get_footer()`.
- Verificar que el modal está antes de `wp_footer()`.
