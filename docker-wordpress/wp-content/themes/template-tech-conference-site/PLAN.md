# Implementation Plan — DevHorizon 2026 WordPress Theme

## Approved decisions

- **CSS:** a single `style.css` with design system tokens and per-page scoping:
  - `body.page-home`
  - `body.page-speakers`
  - `body.page-schedule`
  - `.modal-backdrop`
- **Typography:** self-hosted Chakra Petch + JetBrains Mono, aligned with `design.md`.
- **Content:** internal Custom Post Types, native metaboxes, and a custom taxonomy. No ACF or plugins.
- **Import:** manual button under Tools → Import DevHorizon.
- **CPT:** no individual public URLs; details are shown in the modal.
- **JavaScript:** mobile menu, modal, day/track filters, details toggles, and persistent bookmarks.

## Content model

### CPT `devhorizon_speaker`

| Field | Storage |
| --- | --- |
| Name | `post_title` |
| Bio | `post_content` |
| Photo | Featured image |
| Role | `_devhorizon_role` |
| Company | `_devhorizon_company` |
| Featured on home | `_devhorizon_featured` |
| Order | `menu_order` |

### CPT `devhorizon_session`

| Field | Storage |
| --- | --- |
| Talk title | `post_title` |
| Description | `post_content` |
| Speaker | `_devhorizon_speaker_id` |
| Day | `_devhorizon_day` |
| Start / end time | `_devhorizon_start_time`, `_devhorizon_end_time` |
| Start minutes | `_devhorizon_start_minutes` |
| Location | `_devhorizon_location` |
| Featured on home | `_devhorizon_highlighted` |
| Track | `devhorizon_track` taxonomy |

### Taxonomy `devhorizon_track`

Slugs: `keynote`, `frontend`, `performance`, `accessibility`, `tooling`.

Term meta:

- `_devhorizon_order`
- `_devhorizon_color`

## File structure

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
└── home/, speakers/, schedule/, modal-component/   # static reference
```

## Phases

1. Copy images, fonts, and `data.json` into the theme.
2. Create `style.css` with the WordPress header, fonts, tokens, canonical header/footer, and scoped sections.
3. Create `functions.php` and the files in `inc/`.
4. Create `header.php`, `footer.php`, `index.php`, and the modal partial.
5. Create the three templates and the card partials.
6. Create `js/main.js` with all the interactions.
7. Create `README.md` with installation and usage.
8. Validate PHP syntax, image paths, and CSS.

## Implementation rules

- Every PHP file includes the `ABSPATH` guard.
- All output is escaped with `esc_html`, `esc_attr`, `esc_url`, or `wp_kses_post`.
- All admin forms use nonces and capability checks.
- The importer is idempotent and does not duplicate posts, terms, or attachments.
- Card images use the Featured Image with a fallback to `images/pattern-avatar-bg.svg`.
- The modal is populated from each card's `data-*` attributes, without AJAX.
- Bookmarks are stored in `localStorage` under the `devhorizon:bookmarks` key.
- Filters accept `?day=` and `?track=` for direct links from the footer.
- The static reference files are not modified.

## Validation

- Run `php -l` on all PHP files.
- Check that all `images/` paths exist.
- Verify that no ticket selectors are left without scoping.
- Verify that the three templates include `get_header()` and `get_footer()`.
- Verify that the modal is placed before `wp_footer()`.
