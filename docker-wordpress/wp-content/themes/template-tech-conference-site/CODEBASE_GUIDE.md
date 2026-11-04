# Codebase Guide — DevHorizon 2026 WordPress Theme

This document explains how the theme is organized, what each file does, which functions it defines, how those functions are connected, and why the current implementation was chosen. It is intended for maintainers who need to understand or extend the project without reverse-engineering every file first.

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [File Tree](#file-tree)
4. [File-by-File Reference](#file-by-file-reference)
5. [Data Model](#data-model)
6. [End-to-End Flows](#end-to-end-flows)
7. [Design and Implementation Rationale](#design-and-implementation-rationale)
8. [Maintenance Notes](#maintenance-notes)

---

## Overview

The project is a custom classic WordPress theme for **DevHorizon 2026**, a fictional three-day conference. It renders three public pages:

- **Home**: hero, featured keynote, tracks, featured speakers, and schedule highlights.
- **Speakers**: a grid of every published speaker.
- **Schedule**: every session with day and track filters, expandable details, and persistent bookmarks.

The theme has no required plugins. Content is stored in two internal Custom Post Types and one custom taxonomy, and it is seeded from a JSON file through a manual importer under **Tools → Import DevHorizon**.

### Main conventions

| Convention | Meaning |
| --- | --- |
| `devhorizon_` prefix | All PHP functions, hooks, and meta keys use this prefix to avoid collisions. |
| `tech-conference-site` | WordPress text domain used by every translatable string. |
| `ABSPATH` guard | Every PHP file exits if WordPress is not loaded directly. |
| Escaping | Output is escaped with `esc_html()`, `esc_attr()`, `esc_url()`, or `wp_kses_post()`. |
| Nonces and capabilities | Admin forms verify nonces and check `manage_options` or `edit_post`. |
| No build step | CSS and JavaScript are loaded directly; there is no bundler or package manager requirement. |

### Directory summary

| Path | Role |
| --- | --- |
| Theme root | WordPress templates, `functions.php`, and `style.css`. |
| `inc/` | Domain logic: post types, metadata, queries, template helpers, and the importer. |
| `template-parts/` | Reusable presentation fragments for cards and the speaker modal. |
| `js/` | Frontend behavior. |
| `data/` | JSON source used by the importer. |
| `images/` | Theme images, avatars, icons, and SVG patterns. |
| `fonts/` | Self-hosted font files and their licenses. |
| `raw-html/` | Original static prototypes kept for visual reference only. |

---

## High-Level Architecture

```text
WordPress request
      |
      v
functions.php
  ├── loads inc/*.php
  ├── registers theme supports, menus, image sizes, and assets
  └── provides menu and page helpers
      |
      v
Template hierarchy
  ├── header.php
  ├── page-home.php / page-speakers.php / page-schedule.php / index.php
  ├── template-parts/*.php
  └── footer.php
      |
      v
Presentation + behavior
  ├── style.css
  └── js/main.js
      |
      v
Data access
  ├── inc/queries.php       (WP_Query wrappers)
  ├── inc/template-tags.php (formatting and derived values)
  └── WordPress data        (CPTs, taxonomy, post meta)
```

The theme separates concerns as follows:

- **Configuration and wiring:** `functions.php` and `inc/post-types.php`.
- **Content administration:** `inc/meta-fields.php` and `inc/importer.php`.
- **Data retrieval:** `inc/queries.php`.
- **Presentation helpers:** `inc/template-tags.php`.
- **Templates:** root PHP files and `template-parts/`.
- **Interaction:** `js/main.js`.
- **Visual system:** `style.css`.

There is no custom REST API, no AJAX layer, and no JavaScript framework. The speaker modal is populated from `data-*` attributes already present in the HTML, and bookmarks are stored in `localStorage`.

---

## File Tree

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
└── raw-html/                # static prototypes, not loaded by WordPress
```

---

## File-by-File Reference

### `functions.php`

**Purpose:** Bootstrap the theme. It defines global constants, loads the `inc/` modules, registers theme features, enqueues assets, and provides navigation and page URL helpers.

**Loaded by:** WordPress automatically.

**Constants:**

| Constant | Purpose |
| --- | --- |
| `DEVHORIZON_VERSION` | Fallback asset version. |
| `DEVHORIZON_DIR` | Absolute theme directory path. |
| `DEVHORIZON_URI` | Theme directory URL. |

**Functions:**

| Function | Purpose | Parameters / Return | Hook |
| --- | --- | --- | --- |
| `devhorizon_setup()` | Loads the text domain, registers theme supports, image sizes, and the primary menu location. | None / `void` | `after_setup_theme` |
| `devhorizon_enqueue_assets()` | Enqueues `style.css` and `js/main.js`. Uses file modification times for cache busting and defers the script. | None / `void` | `wp_enqueue_scripts` |
| `devhorizon_page_url( $slug )` | Returns the permalink of a page by slug. If the page is missing, it searches for a page using the expected template, then falls back to a URL built from the slug. | `string $slug` / `string` | None |
| `devhorizon_nav_menu( $menu_class )` | Renders the `menu-principal` location with a unique ID and a fallback callback. | `string $menu_class` / `void` | None |
| `devhorizon_nav_fallback( $args )` | Prints a three-link fallback menu when no WordPress menu is assigned. | `array $args` / `void` | `wp_nav_menu` fallback |
| `devhorizon_menu_link_attributes( $atts, $item, $args )` | Adds the `nav-link` class to links in the primary navigation. | `array $atts`, `WP_Post $item`, `object $args` / `array` | `nav_menu_link_attributes` |
| `devhorizon_nav_menu_item_id( $menu_id, $item, $args )` | Returns an empty ID for the primary menu so the same menu can be printed on desktop, mobile, and footer without duplicate IDs. | `string $menu_id`, `WP_Post $item`, `object $args` / `string` | `nav_menu_item_id` |
| `devhorizon_body_classes( $classes )` | Adds `page-home`, `page-speakers`, or `page-schedule` to the body for CSS scoping. | `string[] $classes` / `string[]` | `body_class` |

**Why it exists:** It is the single entry point for theme configuration. Keeping bootstrap logic here avoids scattering `add_action()` and `add_filter()` calls across templates.

---

### `header.php`

**Purpose:** Opens the document and renders the site header.

**Responsibilities:**

- Outputs the doctype, `<html>`, `<head>`, `wp_head()`, and `body_class()`.
- Adds a favicon fallback when no site icon is configured.
- Renders a skip link for keyboard users.
- Renders the logo, desktop navigation, mobile menu button, and mobile drawer.
- Uses translatable `aria-label` values.

**Why it exists:** It centralizes the document head and global navigation so every template behaves consistently.

---

### `footer.php`

**Purpose:** Closes the page and renders the global footer.

**Responsibilities:**

- Loads non-keynote tracks for the footer track list.
- Renders the footer description, navigation, tracks, venue information, and copyright.
- Includes the speaker modal before `wp_footer()`.
- Calls `wp_footer()`.

**Why it exists:** It keeps the footer and the globally available modal in one place, ensuring the modal is present on every page.

---

### `index.php`

**Purpose:** Generic fallback template required by WordPress.

**Responsibilities:**

- Renders the normal post loop.
- Shows a title and content for each post.
- Displays an empty state when no content exists.

**Why it exists:** WordPress requires an `index.php` in every theme. It also covers pages that do not use one of the custom page templates.

---

### `page-home.php`

**Purpose:** Template for the Home page.

**Template name:** `Home - DevHorizon`

**Data loaded at the top:**

| Variable | Source |
| --- | --- |
| `$devhorizon_keynote` | `devhorizon_get_keynote_session()` |
| `$devhorizon_keynote_speaker` | Speaker ID from the keynote session |
| `$devhorizon_keynote_name` | Speaker title |
| `$devhorizon_keynote_role` | `devhorizon_speaker_affiliation()` |
| `$devhorizon_keynote_photo` | `devhorizon_speaker_photo_url()` |
| `$devhorizon_keynote_day` | `_devhorizon_day` meta |
| `$devhorizon_keynote_start` | `_devhorizon_start_time` meta |
| `$devhorizon_keynote_room` | `_devhorizon_location` meta |
| `$devhorizon_keynote_attrs` | `devhorizon_speaker_modal_attrs()` |
| `$devhorizon_featured` | `devhorizon_get_featured_speakers( 8 )` |
| `$devhorizon_highlights` | `devhorizon_get_highlighted_sessions( 4 )` |
| `$devhorizon_tracks` | `devhorizon_get_tracks( array( 'keynote' ) )` |

**Sections:**

1. **Hero / keynote:** headline, event metadata, featured keynote speaker, and a link to the session.
2. **Tracks:** track cards or an empty state.
3. **Featured speakers:** speaker cards using the `home` variant.
4. **Schedule highlights:** session cards using the `highlight` variant, with the first one expanded by default.

**Why it exists:** It composes the landing page from reusable queries and template parts instead of hard-coding content.

---

### `page-speakers.php`

**Purpose:** Template for the Speakers page.

**Template name:** `Speakers - DevHorizon`

**Responsibilities:**

- Loads every published speaker with `devhorizon_get_all_speakers()`.
- Renders a grid of speaker cards using the `full` variant.
- Shows an empty state when there are no speakers.

**Why it exists:** It provides a dedicated, crawlable listing page while keeping card markup in a shared partial.

---

### `page-schedule.php`

**Purpose:** Template for the Schedule page.

**Template name:** `Schedule - DevHorizon`

**Responsibilities:**

- Loads all sessions with `devhorizon_get_sessions()`.
- Loads all tracks except `keynote`.
- Renders the day filter buttons, track filter pills, "MY SCHEDULE" toggle, and "CLEAR" button.
- Renders session cards using the `schedule` variant.
- Includes a hidden empty state used by JavaScript when filters match no sessions.

**Why it exists:** It owns the schedule structure while the filtering behavior lives in `js/main.js`.

---

### `inc/post-types.php`

**Purpose:** Register the internal content model.

**Functions:**

| Function | Purpose | Hook |
| --- | --- | --- |
| `devhorizon_register_post_types()` | Registers `devhorizon_speaker` and `devhorizon_session`. Both are private, admin-only content types with custom labels. | `init` |
| `devhorizon_register_taxonomies()` | Registers `devhorizon_track` and attaches it to sessions. | `init` |
| `devhorizon_register_term_meta()` | Registers `_devhorizon_order` and `_devhorizon_color` for track terms. | `init` |
| `devhorizon_speaker_columns( $columns )` | Adds photo, role, and featured columns to the speaker list. | `manage_devhorizon_speaker_posts_columns` |
| `devhorizon_speaker_column_content( $column, $post_id )` | Renders the custom speaker columns. | `manage_devhorizon_speaker_posts_custom_column` |
| `devhorizon_session_columns( $columns )` | Adds speaker, day, time, track, and featured columns to the session list. | `manage_devhorizon_session_posts_columns` |
| `devhorizon_session_column_content( $column, $post_id )` | Renders the custom session columns. | `manage_devhorizon_session_posts_custom_column` |

**Content types:**

| Type | Public URL | Admin UI | Supports |
| --- | --- | --- | --- |
| `devhorizon_speaker` | No | Yes | Title, editor, thumbnail, excerpt, page attributes |
| `devhorizon_session` | No | Yes | Title, editor, page attributes |
| `devhorizon_track` | No | Yes | Terms attached to sessions |

**Why it exists:** The event content is structured and internal. It does not need public single pages because speaker details are shown in a modal and sessions are shown on the schedule. Using native WordPress APIs avoids dependency on ACF or another plugin.

---

### `inc/meta-fields.php`

**Purpose:** Define and persist the metadata used by speakers and sessions.

**Functions:**

| Function | Purpose | Hook |
| --- | --- | --- |
| `devhorizon_register_post_meta()` | Registers all custom post meta with types and sanitization callbacks. | `init` |
| `devhorizon_add_meta_boxes()` | Adds the speaker and session details metaboxes. | `add_meta_boxes` |
| `devhorizon_render_speaker_metabox( $post )` | Renders role, company, and featured fields. | Metabox callback |
| `devhorizon_render_session_metabox( $post )` | Renders speaker selector, day, start/end time, location, and highlighted fields. | Metabox callback |
| `devhorizon_save_speaker_meta( $post_id )` | Validates and saves speaker metadata. | `save_post` |
| `devhorizon_save_session_meta( $post_id )` | Validates and saves session metadata, including computed start minutes. | `save_post` |

**Registered speaker meta:**

| Meta key | Type | Meaning |
| --- | --- | --- |
| `_devhorizon_role` | `string` | Job title. |
| `_devhorizon_company` | `string` | Company name. |
| `_devhorizon_featured` | `boolean` | Whether the speaker appears on the home page. |

**Registered session meta:**

| Meta key | Type | Meaning |
| --- | --- | --- |
| `_devhorizon_speaker_id` | `integer` | Related speaker post ID. |
| `_devhorizon_day` | `integer` | Event day, constrained to 1–3. |
| `_devhorizon_start_time` | `string` | Display start time. |
| `_devhorizon_end_time` | `string` | Display end time. |
| `_devhorizon_start_minutes` | `integer` | Start time converted to minutes since midnight, used for sorting. |
| `_devhorizon_location` | `string` | Room or venue location. |
| `_devhorizon_highlighted` | `boolean` | Whether the session appears in home highlights. |

**Safety checks used when saving:** nonce verification, autosave guard, revision guard, post type check, and `edit_post` capability check.

**Why it exists:** It keeps structured event data editable in the WordPress admin without exposing it through the REST API or requiring custom database tables.

---

### `inc/queries.php`

**Purpose:** Centralize reusable queries so templates do not build `WP_Query` arguments inline.

**Functions:**

| Function | Purpose | Parameters / Return |
| --- | --- | --- |
| `devhorizon_get_all_speakers()` | Returns all published speakers ordered by menu order and title. | None / `WP_Query` |
| `devhorizon_get_featured_speakers( $limit )` | Returns speakers with `_devhorizon_featured = 1`. | `int $limit` / `WP_Query` |
| `devhorizon_get_sessions( $args )` | Returns sessions ordered by day and start minutes. Accepts overrides merged with defaults. | `array $args` / `WP_Query` |
| `devhorizon_get_highlighted_sessions( $limit )` | Returns sessions with `_devhorizon_highlighted = 1`. | `int $limit` / `WP_Query` |
| `devhorizon_get_keynote_session()` | Returns the earliest session in the `keynote` track. | None / `WP_Post|null` |
| `devhorizon_get_speaker_session( $speaker_id )` | Returns the first session for a speaker, ordered by day and start time. Uses a static cache. | `int $speaker_id` / `WP_Post|null` |
| `devhorizon_get_tracks( $exclude )` | Returns track terms sorted by `_devhorizon_order`, optionally excluding slugs. | `string[] $exclude` / `WP_Term[]` |

**Why it exists:** Queries are part of the domain, not the presentation. Centralizing them makes templates smaller and ensures ordering rules are consistent.

---

### `inc/template-tags.php`

**Purpose:** Provide presentation helpers that derive or format values from WordPress data.

**Functions:**

| Function | Purpose | Parameters / Return |
| --- | --- | --- |
| `devhorizon_time_to_minutes( $time )` | Converts `H:MM` to minutes since midnight. Returns `0` for invalid input. | `string $time` / `int` |
| `devhorizon_image_url( $file )` | Builds a URL for an image inside `images/`. | `string $file` / `string` |
| `devhorizon_speaker_affiliation( $speaker_id, $spaced )` | Combines role and company as `Role @ Company`. The `$spaced` flag controls spacing around `@`. | `int $speaker_id`, `bool $spaced` / `string` |
| `devhorizon_speaker_company( $speaker_id )` | Returns the speaker company. | `int $speaker_id` / `string` |
| `devhorizon_speaker_photo_url( $speaker_id, $size )` | Returns the featured image URL or the avatar pattern fallback. | `int $speaker_id`, `string $size` / `string` |
| `devhorizon_speaker_photo_html( $speaker_id, $size, $class )` | Returns an `<img>` for the speaker photo with lazy loading and alt text. | `int`, `string`, `string` / `string` |
| `devhorizon_session_track( $session_id )` | Returns the first track term of a session. | `int $session_id` / `WP_Term|null` |
| `devhorizon_session_speaker_id( $session_id )` | Returns the related speaker ID. | `int $session_id` / `int` |
| `devhorizon_session_speaker_name( $session_id )` | Returns the related speaker title. | `int $session_id` / `string` |
| `devhorizon_session_company( $session_id )` | Returns the related speaker company. | `int $session_id` / `string` |
| `devhorizon_session_track_name( $session_id )` | Returns the track name or `TALK`. | `int $session_id` / `string` |
| `devhorizon_session_track_slug( $session_id )` | Returns the track slug or `frontend`. | `int $session_id` / `string` |
| `devhorizon_session_has_details( $session_id )` | Returns whether the session has a description or location. | `int $session_id` / `bool` |
| `devhorizon_session_details_id( $session_id )` | Returns the DOM ID for the session details block. | `int $session_id` / `string` |
| `devhorizon_event_date_label( $day )` | Maps day 1–3 to `NOV 15`, `NOV 16`, or `NOV 17`. | `int $day` / `string` |
| `devhorizon_highlight_class( $track_slug )` | Maps a track slug to a home ticket color class. | `string $track_slug` / `string` |
| `devhorizon_track_filter_label( $slug )` | Returns the short filter label, using `A11Y` for accessibility. | `string $slug` / `string` |
| `devhorizon_barcode_svg()` | Returns the decorative ticket barcode SVG. | None / `string` |
| `devhorizon_speaker_modal_attrs( $speaker_id )` | Builds the `data-*` attribute string used by the speaker modal. | `int $speaker_id` / `string` |

**Why it exists:** These helpers keep templates readable and ensure fallback and formatting rules are implemented once.

---

### `inc/importer.php`

**Purpose:** Seed the theme with structured event content from `data/devhorizon-data.json`.

**Functions:**

| Function | Purpose | Hook |
| --- | --- | --- |
| `devhorizon_register_import_page()` | Adds the importer under Tools. | `admin_menu` |
| `devhorizon_maybe_run_import()` | Validates the form, runs the import, stores a transient notice, and redirects. | `admin_init` |
| `devhorizon_import_admin_notice()` | Shows a warning when content has not been imported yet. | `admin_notices` |
| `devhorizon_render_import_page()` | Renders the importer screen, current counts, and post-import instructions. | Admin page callback |
| `devhorizon_run_import()` | Creates or updates tracks, speakers, and sessions from JSON. Returns counts or `WP_Error`. | Called by the form handler |
| `devhorizon_find_imported_post( $post_type, $source_id )` | Finds an existing imported post by `_devhorizon_source_id`. | None |
| `devhorizon_import_attachment( $filename, $title )` | Imports a local theme image into the Media Library and avoids duplicates by source filename. | None |

**Import process:**

1. Read and decode the JSON file.
2. Validate that `speakers` and `talks` exist.
3. For each track: create or update the term and its term meta.
4. For each speaker: create or update the post, save metadata, and import the avatar.
5. For each talk: create or update the session, save metadata, and assign the track term.
6. Store the import timestamp and counts.
7. Store or clear the last errors.

**Why it exists:** The theme needs a repeatable way to load demo content. Keeping it as a manual admin tool avoids running destructive operations on every page load and makes the import explicit. The `_devhorizon_source_id` meta is what makes the operation idempotent.

---

### `template-parts/speaker-card.php`

**Purpose:** Reusable speaker card.

**Arguments:**

| Argument | Meaning |
| --- | --- |
| `speaker_id` | Speaker post ID. |
| `variant` | `home` or `full`. |

**Behavior:**

- Loads the speaker name, affiliation, related session, talk title, and modal attributes.
- Builds an accessible label using `View details for %s`.
- The `home` variant shows the photo, name, affiliation, and talk badge.
- The `full` variant shows the photo, name, affiliation, and talk title.
- The card is keyboard-focusable and behaves as a modal trigger through `data-modal-open`.

**Why it exists:** The same visual component is used on the home page and the speakers page with only small differences.

---

### `template-parts/session-card.php`

**Purpose:** Reusable session card with two layouts.

**Arguments:**

| Argument | Meaning |
| --- | --- |
| `session_id` | Session post ID. |
| `variant` | `highlight` or `schedule`. |
| `expanded` | Whether the details block starts open. |

**Behavior:**

- Loads title, description, speaker, company, track, times, day, location, and details state.
- The `highlight` variant renders a ticket-style card for the home page.
- The `schedule` variant renders a schedule card with `data-day` and `data-track` attributes for filtering.
- The `highlight` variant supports expandable details.
- The `schedule` variant supports expandable details and includes a bookmark button with an accessible label and `aria-pressed`.

**Why it exists:** It keeps the ticket/card markup consistent across the home and schedule pages while allowing each page to use the appropriate layout.

---

### `template-parts/modal-speaker.php`

**Purpose:** Shared speaker modal markup.

**Behavior:**

- Renders the dialog shell, close button, speaker photo, name, role, bio, talk section, ticket details, and bookmark button.
- Elements use `data-modal-*` attributes as hooks for `js/main.js`.
- The modal starts hidden with `aria-hidden="true"`.
- The close button and bookmark button have translatable labels.

**Why it exists:** The modal is global. Keeping it in a partial lets `footer.php` include it once and lets JavaScript populate it from any speaker card.

---

### `js/main.js`

**Purpose:** All frontend interaction.

The file is an IIFE with `'use strict'` and no dependencies.

**Main areas:**

| Area | Responsibility |
| --- | --- |
| Bookmark storage | Read, write, normalize, and check bookmarks in `localStorage` under `devhorizon:bookmarks`. |
| Bookmark UI | Synchronize pressed state, CSS classes, star glyph, and accessible labels. |
| Mobile menu | Open and close the drawer, manage `aria-expanded`, move focus, close on link click or `Escape`, and close on resize. |
| Details toggles | Toggle session details, `aria-expanded`, the `hidden` attribute, and the button label. |
| Schedule filters | Filter by day, track, and bookmarked sessions; support URL parameters and empty states. |
| Speaker modal | Populate content from `data-*`, open and close the dialog, trap focus, support `Escape`, backdrop clicks, and keyboard activation. |

**Key functions and helpers:**

| Name | Purpose |
| --- | --- |
| `getBookmarks()` | Safely parse the stored bookmark array. |
| `saveBookmarks( bookmarks )` | Persist bookmarks and ignore storage errors. |
| `isBookmarked( sessionId )` | Check whether a session ID is saved. |
| `syncBookmarkUI()` | Update every bookmark button to match storage. |
| `toggleBookmark( sessionId )` | Add or remove a bookmark and notify listeners. |
| `setMenuOpen( open, restoreFocus )` | Update mobile drawer state and focus. |
| `renderFilterState()` | Reflect active day, track, and "my schedule" state in the buttons. |
| `applyFilters()` | Show or hide session cards and toggle the empty message. |
| `refresh()` | Re-render filter state and apply filters. |
| `setText( selector, value )` | Set text content inside the modal. |
| `setModalContent( trigger )` | Copy `data-*` values from a card into the modal. |
| `openModal( trigger )` | Save focus, show the modal, and move focus inside. |
| `closeModal()` | Hide the modal and restore focus. |
| `trapFocus( event )` | Keep keyboard focus inside the open modal. |

**Custom event:** `devhorizon:bookmarks-changed` is dispatched after a bookmark changes so the schedule filter can refresh when "MY SCHEDULE" is active.

**Why it exists:** Keeping all behavior in one small vanilla JavaScript file avoids a build step and keeps the theme easy to deploy.

---

### `style.css`

**Purpose:** The complete visual system and layout.

**Structure:**

| Section | Contents |
| --- | --- |
| Theme header | WordPress metadata and theme description. |
| Self-hosted fonts | `@font-face` declarations for Chakra Petch and JetBrains Mono. |
| Design tokens | CSS custom properties for colors, typography, spacing, borders, and track/ticket colors. |
| Reset and base | Global element normalization and accessibility utilities. |
| Header and navigation | Desktop navigation, mobile drawer, and menu button. |
| Footer | Footer layout and link styles. |
| Shared utilities | Container, section tags, buttons, and empty states. |
| Home | Hero, keynote, tracks, featured speakers, and highlight tickets. |
| Speakers | Speaker grid and card variants. |
| Schedule | Filter bar, schedule cards, and schedule-specific layout. |
| Speaker modal | Dialog, profile, talk ticket, and close/bookmark controls. |
| Generic / fallback pages | Default page layout. |
| Responsive | Breakpoint adjustments. |
| Reduced motion | Respects `prefers-reduced-motion`. |

**Page scoping:** Body classes added by `devhorizon_body_classes()` allow page-specific rules such as `.page-home`, `.page-speakers`, and `.page-schedule`, reducing the chance of style collisions.

**Why it exists:** A single stylesheet with tokens and page scoping keeps the design system visible in one place and avoids a CSS build pipeline.

---

### `data/devhorizon-data.json`

**Purpose:** Source data for the importer.

**Expected structure:**

```json
{
  "tracks": [
    {
      "id": "frontend",
      "name": "Frontend",
      "description": "Track description",
      "color": "#FFE6BA"
    }
  ],
  "speakers": [
    {
      "id": "speaker-id",
      "name": "Speaker Name",
      "role": "Job Title",
      "company": "Company",
      "bio": "Biography",
      "avatar": "avatar-speaker-name.webp",
      "featured": true
    }
  ],
  "talks": [
    {
      "id": "talk-id",
      "title": "Talk Title",
      "description": "Talk description",
      "speakerId": "speaker-id",
      "trackId": "frontend",
      "day": 1,
      "startTime": "9:00",
      "endTime": "10:00",
      "location": "Room A",
      "highlighted": true
    }
  ]
}
```

**Why it exists:** It separates seed content from PHP and makes the demo data easy to replace.

---

### `images/`

**Purpose:** Static visual assets.

**Contents:**

- Speaker avatars in WebP format.
- `pattern-avatar-bg.svg` as the fallback avatar.
- Icons such as star, cross, arrow, plus, minus, and menu.
- Decorative SVGs such as barcode and horizon background.
- `favicon-32x32.png`.

**Why it exists:** Keeping assets inside the theme makes the project self-contained and avoids external image dependencies.

---

### `fonts/`

**Purpose:** Self-hosted typography.

**Contents:**

- Chakra Petch SemiBold and Bold.
- JetBrains Mono Variable.
- OFL license files.

**Why it exists:** Self-hosting avoids third-party font requests and keeps the visual system consistent offline.

---

### `raw-html/`

**Purpose:** Original static prototypes.

**Contents:**

- `home/`
- `schedule/`
- `speakers/`
- `modal-component/`

**Why it exists:** These files document the original visual implementation and are useful as a reference. They are not enqueued or rendered by WordPress.

### Documentation files

**Purpose:** Project documentation kept alongside the theme.

- `README*`: requirements, installation, content model, customization, and validation commands.
- `PLAN*`: implementation decisions, content model, phases, and validation rules.
- `DESIGN*`: design system specification, tokens, typography, component patterns, and Tailwind/CSS references.
- `CODEBASE_GUIDE.md`: this document.

**Why they exist:** They document the project for maintainers and preserve the reasoning behind the implementation. They are not loaded by WordPress.

---

## Data Model

```text
devhorizon_speaker (CPT)
  ├── post_title        -> speaker name
  ├── post_content      -> bio
  ├── featured image    -> photo
  ├── _devhorizon_role
  ├── _devhorizon_company
  └── _devhorizon_featured

devhorizon_session (CPT)
  ├── post_title                 -> talk title
  ├── post_content               -> description
  ├── _devhorizon_speaker_id     -> devhorizon_speaker post ID
  ├── _devhorizon_day            -> 1, 2, or 3
  ├── _devhorizon_start_time
  ├── _devhorizon_end_time
  ├── _devhorizon_start_minutes  -> derived sorting value
  ├── _devhorizon_location
  ├── _devhorizon_highlighted
  └── devhorizon_track term      -> track taxonomy

devhorizon_track (taxonomy)
  ├── name
  ├── slug
  ├── description
  ├── _devhorizon_order
  └── _devhorizon_color
```

**Relationships:**

- A session belongs to one speaker through `_devhorizon_speaker_id`.
- A session belongs to one or more tracks through the `devhorizon_track` taxonomy.
- A speaker can have multiple sessions, although the UI currently displays the first one.

---

## End-to-End Flows

### 1. Theme setup

1. WordPress loads `functions.php`.
2. Constants are defined and `inc/*.php` files are required.
3. `devhorizon_setup()` registers theme supports, image sizes, and the `menu-principal` location.
4. `devhorizon_enqueue_assets()` loads the stylesheet and deferred JavaScript.

### 2. Content import

1. An administrator opens **Tools → Import DevHorizon**.
2. The form submits with a nonce.
3. `devhorizon_maybe_run_import()` checks permissions and calls `devhorizon_run_import()`.
4. Tracks, speakers, and sessions are created or updated.
5. Avatars are imported into the Media Library.
6. A transient notice is stored and the page redirects back to the importer.

### 3. Home page render

1. `page-home.php` loads the keynote, featured speakers, highlighted sessions, and tracks.
2. `header.php` renders the global header and navigation.
3. The hero and sections render using queries and template parts.
4. `footer.php` renders the footer and the shared speaker modal.

### 4. Schedule filtering

1. `page-schedule.php` renders all sessions with `data-day` and `data-track`.
2. `js/main.js` reads initial URL parameters such as `?day=2` or `?track=frontend`.
3. Clicking a day or track toggles the active filter.
4. "MY SCHEDULE" shows only bookmarked sessions across all days.
5. "CLEAR" resets the day to 1 and clears track and bookmark filters.
6. If no cards match, the hidden empty message is shown.

### 5. Speaker modal

1. Each speaker card includes `data-modal-open` and speaker/session data attributes.
2. Clicking or pressing Enter/Space on a card calls `openModal()`.
3. `setModalContent()` copies the card data into the modal.
4. Focus moves to the close button or dialog.
5. `Escape`, the close button, or a backdrop click closes the modal and restores focus.
6. `Tab` is trapped inside the dialog while it is open.

### 6. Bookmarks

1. The bookmark button reads and writes the `devhorizon:bookmarks` key.
2. `syncBookmarkUI()` updates all matching buttons.
3. A custom event notifies the schedule filter.
4. Bookmarks survive page reloads through `localStorage`.

---

## Design and Implementation Rationale

### Why internal CPTs instead of ACF

The content model is small and stable. Native `register_post_type()`, `register_post_meta()`, and metaboxes cover it without adding a plugin dependency or an external configuration layer.

### Why sessions and speakers have no public single pages

Speakers are displayed in a modal and sessions are displayed in the schedule. Public single URLs would add routing and template maintenance without a product requirement.

### Why the importer is idempotent

Demo content may need to be reloaded during development. Each imported object stores a `_devhorizon_source_id` or `_devhorizon_source_file`, so rerunning the importer updates existing records instead of duplicating them.

### Why the modal uses `data-*` attributes

The data is already rendered in the page. Copying it into the modal with JavaScript avoids an AJAX endpoint, extra requests, and server-side state.

### Why bookmarks use `localStorage`

Bookmarks are a personal, client-side preference. They do not need an account, database table, or server round trip.

### Why CSS is scoped by page

The theme has distinct layouts for home, speakers, and schedule. Body classes isolate those layouts while keeping one stylesheet and one token source.

### Why there are fallbacks

The theme may be activated before content is imported or before a menu is created. Fallbacks for the menu, avatar, empty states, and missing details keep the site usable during setup.

### Why `raw-html/` is kept

It preserves the original static implementation as a visual reference. It is intentionally excluded from WordPress loading.

---

## Maintenance Notes

### Changing text

- Public strings use `__( 'Text', 'tech-conference-site' )` or the escaping variants.
- Admin labels and notices are also translatable.
- If a string changes, keep the text domain unchanged.

### Changing colors or typography

Edit the custom properties inside `:root` in `style.css`. Component rules should continue to consume tokens rather than hard-coded values.

### Changing event dates

Update `devhorizon_event_date_label()` in `inc/template-tags.php`. The current labels are `NOV 15`, `NOV 16`, and `NOV 17`.

### Changing image sizes

Update the `add_image_size()` calls in `devhorizon_setup()` inside `functions.php`. Existing uploads may need regeneration.

### Changing the menu location

The slug `menu-principal` is defined in `functions.php`. The header and footer render that location through `devhorizon_nav_menu()`. Renaming it requires updating the registration and the helper logic, then reassigning the menu in the WordPress admin.

### Changing seed content

Edit `data/devhorizon-data.json`, then run the importer again. Existing records are matched by source ID.

### Adding a new track

Add the track to the JSON file and import it, or create it manually under the Tracks taxonomy. A color can be stored in `_devhorizon_color`.

### Adding a new page template

Create a `page-{slug}.php` file with a `Template Name` header, add a body class in `devhorizon_body_classes()` if page-scoped CSS is needed, and use the existing query and template-tag helpers where possible.

### Validation commands

```bash
# PHP syntax
find . -name '*.php' -not -path './raw-html/*' -exec php -l {} \;

# JavaScript syntax
node --check js/main.js

# Check referenced avatar files
grep -Rho "avatar-[a-z-]*\.webp" --include='*.php' . | sort -u
```

### Files that should not be renamed casually

- `style.css`: WordPress requires this filename for the theme stylesheet.
- `index.php`: WordPress requires a fallback template.
- `functions.php`: WordPress loads it automatically.
- `page-home.php`, `page-speakers.php`, `page-schedule.php`: their filenames are used by `devhorizon_page_url()` and `devhorizon_body_classes()`.
- `menu-principal`: the menu location slug is referenced in multiple files.
