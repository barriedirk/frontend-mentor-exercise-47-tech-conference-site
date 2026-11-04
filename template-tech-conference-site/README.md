# Tech-conference-site

Custom WordPress theme for **DevHorizon 2026**, built from the Frontend Mentor static design and the `design.md_cyber_industrial_terminal.en.md` design system.

## Requirements

- WordPress 6.5 or higher.
- PHP 7.4 or higher.
- No required plugins.

## Installation

1. Copy this folder to `wp-content/themes/tech-conference-site`.
2. Activate the theme under **Appearance → Themes**.
3. Go to **Tools → Import DevHorizon** and click **Import DevHorizon content**.
4. Create three pages:
   - `Home` with the **Home - DevHorizon** template.
   - `Speakers` with the **Speakers - DevHorizon** template.
   - `Schedule` with the **Schedule - DevHorizon** template.
5. Under **Settings → Reading**, select `Home` as the static front page.
6. Under **Settings → Permalinks**, choose a structure other than "Plain", for example `/%postname%/`.
7. Under **Appearance → Menus**, create a menu with Home, Schedule, and Speakers, and assign it to the **Primary Menu** location.

If the menu does not exist yet, the theme displays a fallback with those three links.

## Content

The theme registers two internal Custom Post Types:

### Speakers

- Name: title.
- Bio: editor.
- Photo: featured image.
- Role and company: **Speaker details** metabox.
- Featured on the home page: metabox checkbox.
- Order: page **Order** attribute.

### Sessions

- Talk title: title.
- Description: editor.
- Speaker: metabox selector.
- Day, times, and location: **Session details** metabox.
- Track: **Tracks** taxonomy.
- Featured on the home page: metabox checkbox.
- Order: page **Order** attribute.

### Tracks

`devhorizon_track` taxonomy with the terms:

- Keynote
- Frontend
- Performance
- Accessibility
- Tooling

## Importer

The importer reads `data/devhorizon-data.json` and:

- creates or updates the 5 tracks,
- creates or updates the 20 speakers,
- uploads the 20 avatars to the Media Library and assigns them as featured images,
- creates or updates the 20 sessions,
- assigns speaker, track, day, times, location, and featured flags.

It is idempotent: it can be run multiple times without duplicating content.

## Structure

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

The `home/`, `speakers/`, `schedule/`, and `modal-component/` folders are the original static files and are kept as a reference. They are not loaded by WordPress.

## Interaction

- Accessible mobile menu with `aria-expanded`.
- Speaker modal populated from `data-*` attributes.
- Close with the button, backdrop, and `Escape`; focus trap and return to the element that opened the modal.
- Details toggles on the home page and schedule.
- Day and track filters.
- Direct links `?day=2` and `?track=frontend`.
- "MY SCHEDULE" shows bookmarks from all days; selecting a specific day exits that mode.
- "CLEAR" clears the filters and returns to day 1 without deleting bookmarks.
- Bookmarks persisted in `localStorage` under the `devhorizon:bookmarks` key.

## Quick customization

### Colors and typography

All tokens are in `style.css`, inside `:root`:

```css
--color-surface-terminal: #00151d;
--color-accent-lime: #d1ff66;
--color-accent-cyan: #b5e9fc;
--color-accent-biscuit: #ffe6ba;
--color-border-dark: #33444a;
--font-display: 'Chakra Petch', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

### Images

Theme images live in `images/`. Cards use the speaker's featured image; if none exists, `images/pattern-avatar-bg.svg` is used as a fallback.

### Fonts

Fonts are self-hosted in `fonts/`:

- Chakra Petch (SemiBold and Bold).
- JetBrains Mono Variable.

The OFL licenses are included in each folder.

## Validation

```bash
# PHP syntax
find . -name '*.php' -not -path './home/*' -not -path './speakers/*' \
  -not -path './schedule/*' -not -path './modal-component/*' -exec php -l {} \;

# Check that referenced images exist
grep -Rho "avatar-[a-z-]*\.webp" --include='*.php' . | sort -u
```
