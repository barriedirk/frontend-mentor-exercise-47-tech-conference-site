# Security Audit — DevHorizon 2026 WordPress Theme

**Date:** 2026-11-03  
**Scope:** All theme PHP files and the front-end JavaScript file loaded by WordPress.  
**Status:** Findings only. No source files were modified during this audit.

---

## Table of Contents

1. [Scope and Methodology](#1-scope-and-methodology)
2. [Severity Definitions](#2-severity-definitions)
3. [Executive Summary](#3-executive-summary)
4. [Findings](#4-findings)
   - [L-01 — Event CPTs use the `post` capability type](#l-01--event-cpts-use-the-post-capability-type)
   - [L-02 — `devhorizon_image_url()` does not neutralize relative paths](#l-02--devhorizon_image_url-does-not-neutralize-relative-paths)
   - [L-03 — The importer copies files into `uploads/` without validating them as images](#l-03--the-importer-copies-files-into-uploads-without-validating-them-as-images)
   - [L-04 — Theme documentation and seed data are publicly reachable](#l-04--theme-documentation-and-seed-data-are-publicly-reachable)
   - [L-05 — `_devhorizon_speaker_id` is not validated as a speaker post](#l-05--_devhorizon_speaker_id-is-not-validated-as-a-speaker-post)
   - [L-06 — The importer assumes the JSON schema is always complete](#l-06--the-importer-assumes-the-json-schema-is-always-complete)
   - [I-01 — No security headers or clickjacking protection on the front end](#i-01--no-security-headers-or-clickjacking-protection-on-the-front-end)
   - [I-02 — The modal assigns `photo.src` from an attribute without validating the URL scheme](#i-02--the-modal-assigns-photosrc-from-an-attribute-without-validating-the-url-scheme)
   - [I-03 — `devhorizon_page_url()` builds a fallback URL from the slug](#i-03--devhorizon_page_url-builds-a-fallback-url-from-the-slug)
   - [I-04 — `devhorizon_run_import()` does not check capabilities itself](#i-04--devhorizon_run_import-does-not-check-capabilities-itself)
   - [I-05 — `raw-html/` is not loaded by WordPress](#i-05--raw-html-is-not-loaded-by-wordpress)
5. [Controls Verified as Correct](#5-controls-verified-as-correct)
6. [Conclusion](#6-conclusion)

---

## 1. Scope and Methodology

### In scope

- **15 PHP files:**
  - `functions.php`
  - `header.php`
  - `footer.php`
  - `index.php`
  - `page-home.php`
  - `page-speakers.php`
  - `page-schedule.php`
  - `inc/post-types.php`
  - `inc/meta-fields.php`
  - `inc/queries.php`
  - `inc/template-tags.php`
  - `inc/importer.php`
  - `template-parts/speaker-card.php`
  - `template-parts/session-card.php`
  - `template-parts/modal-speaker.php`
- **1 JavaScript file:**
  - `js/main.js`

### Out of scope

- `raw-html/` contains static HTML prototypes with inline scripts, but WordPress does not load them. They are not part of the production attack surface.
- WordPress core, the web server, PHP configuration, and third-party plugins.
- The WordPress admin area beyond the theme's own screens.

### Methodology

The review covered:

- Entry points: `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `$_SERVER`, `$_FILES`, and URL parameters read from JavaScript.
- Output sinks: `echo`, `printf`, `wp_die`, `the_content`, `the_title`, and DOM sinks in JavaScript.
- Authorization: capability checks, nonces, autosave and revision guards.
- Data handling: sanitization, validation, escaping, and type casting.
- Dangerous operations: dynamic includes, SQL queries, file reads/writes, uploads, redirects, and deserialization.
- Front-end behavior: DOM manipulation, `localStorage`, URL parsing, and focus management.

No automated scanner was used. The review was manual, file by file.

---

## 2. Severity Definitions

| Severity | Meaning |
| --- | --- |
| **Critical** | Remote code execution, authentication bypass, or full site compromise with no special conditions. |
| **High** | Stored/reflected XSS, SQL injection, arbitrary file upload, privilege escalation, or sensitive data exposure affecting many users. |
| **Medium** | Exploitable with a privileged account or a realistic precondition, with meaningful impact. |
| **Low** | Requires an uncommon precondition, has limited impact, or is a hardening gap rather than an exploitable flaw. |
| **Informational** | No direct security impact today, but worth addressing for defense in depth. |

---

## 3. Executive Summary

**No critical, high, or medium exploitable vulnerabilities were found in the current code.**

The theme follows WordPress security fundamentals: nonces and capability checks on state-changing actions, output escaping across templates, no raw SQL, no dynamic includes, and no custom REST or AJAX endpoints. The findings below are hardening items and information-disclosure issues.

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 0 |
| Medium | 0 (one Low finding can become Medium depending on the site's role model) |
| Low | 6 |
| Informational | 5 |

### Finding index

| ID | Title | Severity |
| --- | --- | --- |
| L-01 | Event CPTs use the `post` capability type | Low (Medium conditionally) |
| L-02 | `devhorizon_image_url()` does not neutralize relative paths | Low |
| L-03 | The importer copies files into `uploads/` without validating them as images | Low |
| L-04 | Theme documentation and seed data are publicly reachable | Low |
| L-05 | `_devhorizon_speaker_id` is not validated as a speaker post | Low |
| L-06 | The importer assumes the JSON schema is always complete | Low / Informational |
| I-01 | No security headers or clickjacking protection on the front end | Informational |
| I-02 | The modal assigns `photo.src` from an attribute without validating the URL scheme | Informational |
| I-03 | `devhorizon_page_url()` builds a fallback URL from the slug | Informational |
| I-04 | `devhorizon_run_import()` does not check capabilities itself | Informational |
| I-05 | `raw-html/` is not loaded by WordPress | Informational |

---

## 4. Findings

### L-01 — Event CPTs use the `post` capability type

**Severity:** Low (can be Medium if the site has untrusted Author-level users)  
**Location:** `inc/post-types.php:52`, `inc/post-types.php:91`  
**CWE:** CWE-269 — Improper Privilege Management

#### Description

Both custom post types are registered with the standard `post` capability set:

```php
'capability_type' => 'post',
'map_meta_cap'    => true,
```

As a result, any role that can edit posts can also manage speakers and sessions:

- **Author:** can publish speakers and sessions.
- **Contributor:** can create speaker and session drafts, but cannot publish them.

#### Why it is a problem

The event content is intended to be internal and admin-managed, but the capability mapping does not separate "manage event content" from "write regular posts." On a site with multiple authors, this grants broader access than the content model implies.

#### Attacker impact

An Author-level user can publish a fake speaker or a fake session that appears on the public home page and schedule. A Contributor can create drafts but cannot make them public. The attacker cannot execute code, read private data, or escalate privileges, because all output is escaped.

#### Recommendation

- Register a custom capability type, for example `devhorizon_speaker` and `devhorizon_session`, and map the capabilities explicitly.
- Grant those capabilities only to the roles that should manage event content.
- As a simpler alternative, require `manage_options` in the save handlers and admin UI.

---

### L-02 — `devhorizon_image_url()` does not neutralize relative paths

**Severity:** Low (latent; not exploitable with the current callers)  
**Location:** `inc/template-tags.php:32-34`  
**CWE:** CWE-22 — Improper Limitation of a Pathname to a Restricted Directory ("Path Traversal")

#### Description

```php
function devhorizon_image_url( $file ) {
	return DEVHORIZON_URI . '/images/' . ltrim( $file, '/' );
}
```

`ltrim()` removes leading slashes, but it does not remove `../` sequences.

#### Why it is a problem

If a future caller passes user-controlled input, the function can build URLs that escape the `images/` directory. Today every caller uses a hard-coded literal:

- `favicon-32x32.png`
- `pattern-avatar-bg.svg`

Therefore, the issue is not reachable in the current code.

#### Attacker impact

No impact today. If reused with external input, an attacker could reference static files from other directories inside the theme or `wp-content`. PHP files execute rather than disclose source, so the practical impact would be limited to static files.

#### Recommendation

- Apply `basename()` or `sanitize_file_name()`.
- Validate the extension against an allowlist.
- Escape with `esc_url()` at every output point.

---

### L-03 — The importer copies files into `uploads/` without validating them as images

**Severity:** Low  
**Location:** `inc/importer.php:381-415`  
**CWE:** CWE-434 — Unrestricted Upload of File with Dangerous Type

#### Description

`devhorizon_import_attachment()` takes a filename from the JSON file, normalizes it with `basename()` and `sanitize_file_name()`, checks that it exists under `images/`, and uploads it with `wp_upload_bits()`. It does not verify that the file is actually an image or restrict extensions to an explicit allowlist.

`wp_upload_bits()` rejects extensions that are not in the allowed MIME list unless the user has the `unfiltered_upload` capability, which significantly limits the issue.

#### Why it is a problem

There is no content validation (`getimagesize()`) and no explicit image allowlist (`webp`, `png`, `jpg`/`jpeg`). A non-image file that is allowed by WordPress's MIME list could be imported and served from the uploads directory.

#### Attacker impact

The attacker needs `manage_options` **and** the ability to write a file into `images/` or edit `data/devhorizon-data.json`. With those two conditions, they already have a highly privileged position. In that scenario they could import a non-image file and serve it from the same origin. Without those conditions, the issue is not exploitable.

#### Recommendation

- Validate with `wp_check_filetype_and_ext()` and `getimagesize()`.
- Accept only an explicit allowlist: `webp`, `png`, `jpg`, `jpeg`.
- Reject anything else before calling `wp_upload_bits()`.

---

### L-04 — Theme documentation and seed data are publicly reachable

**Severity:** Low (information disclosure)  
**Location:** `data/devhorizon-data.json`, `README.md`, `PLAN.md`, `CODEBASE_GUIDE.md`, `raw-html/`  
**CWE:** CWE-538 — Insertion of Sensitive Information into Externally-Accessible File or Directory

#### Description

WordPress serves static files from the theme directory directly. The following URLs are publicly reachable:

```text
/wp-content/themes/tech-conference-site/data/devhorizon-data.json
/wp-content/themes/tech-conference-site/README.md
/wp-content/themes/tech-conference-site/PLAN.md
/wp-content/themes/tech-conference-site/CODEBASE_GUIDE.md
/wp-content/themes/tech-conference-site/raw-html/
```

#### Why it is a problem

These files expose the data model, the file structure, the importer flow, the admin importer path, and the demo content. There are no credentials or API keys, but the information helps with reconnaissance before an attack.

#### Attacker impact

An attacker can download the JSON and the documentation to understand the architecture, enumerate features, and prepare more targeted attacks. This does not grant access on its own.

#### Recommendation

- Move `data/` outside the theme directory, or block access with server rules.
- Do not deploy documentation or `raw-html/` to production.
- Add empty `index.php` files in subdirectories to prevent directory listing. Note that this does not prevent direct download of the JSON.

---

### L-05 — `_devhorizon_speaker_id` is not validated as a speaker post

**Severity:** Low  
**Location:** `inc/meta-fields.php:262`, `inc/meta-fields.php:270`  
**CWE:** CWE-20 — Improper Input Validation

#### Description

When saving a session, the related speaker ID is cast with `absint()` but is not checked against the `devhorizon_speaker` post type or a valid post status. Later, `devhorizon_session_speaker_name()` calls `get_the_title()` with that ID.

#### Why it is a problem

A user with `edit_posts` could point a session at any post, including a private or draft post. The title of that post would then appear in the public session card.

#### Attacker impact

A minor information leak (the title of a private or draft post) or inconsistent data. There is no XSS because the output uses `esc_html()`.

#### Recommendation

Before saving and before using the ID, verify:

```php
get_post_type( $speaker_id ) === 'devhorizon_speaker'
```

Also check that the post status is valid for public display.

---

### L-06 — The importer assumes the JSON schema is always complete

**Severity:** Low / Informational  
**Location:** `inc/importer.php:207`, `216-218`, `253-262`, `297-306`, `321-331`  
**CWE:** CWE-20 — Improper Input Validation

#### Description

The importer accesses keys such as `$track['name']`, `$track['description']`, `$speaker['id']`, `$talk['title']`, and `$talk['speakerId']` without `isset()` or type checks. A malformed JSON file produces PHP warnings and notices.

#### Why it is a problem

If `display_errors` is enabled, warnings can reveal absolute server paths. The import can also be left partially applied.

#### Attacker impact

No direct impact. The issue requires an administrator to run the importer with a corrupted or manipulated JSON file. The maximum impact is path disclosure or a partial import.

#### Recommendation

- Validate the full schema before processing.
- Return a `WP_Error` with a generic message.
- Keep `WP_DEBUG_DISPLAY` disabled in production.

---

### I-01 — No security headers or clickjacking protection on the front end

**Severity:** Informational  
**Location:** Server configuration / `functions.php`  
**CWE:** CWE-1021 — Improper Restriction of Rendered UI Layers or Frames

#### Description

The theme does not send `Content-Security-Policy`, `X-Frame-Options`, or `Referrer-Policy` headers. WordPress protects `wp-admin` itself, but public pages can be embedded in an `iframe`.

#### Attacker impact

A third party could perform clickjacking against the public interface. The admin panel is not affected.

#### Recommendation

Add the headers at the server level or through a plugin. `frame-ancestors` in a CSP is the most flexible option.

---

### I-02 — The modal assigns `photo.src` from an attribute without validating the URL scheme

**Severity:** Informational  
**Location:** `js/main.js:339-341`  
**CWE:** CWE-20 — Improper Input Validation

#### Description

```js
if (photo && data.speakerPhoto) {
  photo.src = data.speakerPhoto;
  photo.alt = data.speakerName || '';
}
```

#### Attacker impact

If an attacker could inject HTML and add `data-speaker-photo="https://external.example/..."`, the browser would make an external request (leaking IP and referrer) or load a `data:` URI. This requires a prior injection, which does not exist in the current code.

#### Recommendation

Accept only relative paths or same-origin `https:` URLs.

---

### I-03 — `devhorizon_page_url()` builds a fallback URL from the slug

**Severity:** Informational  
**Location:** `functions.php:124`  
**CWE:** CWE-601 — URL Redirection to Untrusted Site ("Open Redirect") — not currently exploitable

#### Description

```php
return home_url( '/' . trim( $slug, '/' ) . '/' );
```

The function is currently called only with `'schedule'` and `'speakers'`. If it is reused with user input, it could generate misleading URLs. It is not an open redirect because `home_url()` fixes the host.

#### Recommendation

Restrict the accepted slugs to a known allowlist.

---

### I-04 — `devhorizon_run_import()` does not check capabilities itself

**Severity:** Informational  
**Location:** `inc/importer.php:166`  
**CWE:** CWE-862 — Missing Authorization

#### Description

The function is only called from `devhorizon_maybe_run_import()`, which already checks `manage_options` and the nonce. This is correct today, but if another code path calls it in the future, it would have no protection of its own.

#### Recommendation

Add `current_user_can( 'manage_options' )` at the beginning of `devhorizon_run_import()` as defense in depth.

---

### I-05 — `raw-html/` is not loaded by WordPress

**Severity:** Informational  
**Location:** `raw-html/home/index.html`, `raw-html/modal-component/index.html`

#### Description

The static prototypes contain inline scripts, but they do not process user input and WordPress does not load them. They have no impact on production. The Spanish comments are intentional reference material.

#### Recommendation

No action required for security. Consider excluding `raw-html/` from production deployments.

---

## 5. Controls Verified as Correct

| Control | Result |
| --- | --- |
| CSRF on the importer | `check_admin_referer()` plus `manage_options` |
| CSRF on metaboxes | `wp_verify_nonce()` plus `edit_post` |
| Input sanitization | `sanitize_text_field`, `absint`, `sanitize_hex_color`, `sanitize_html_class` |
| Output escaping | `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post` throughout the templates |
| XSS in cards and modal | Descriptions use `wp_kses_post`; bios use `wp_strip_all_tags` plus `textContent` |
| SQL injection | No `$wpdb` or manual SQL; only WordPress APIs |
| File inclusion | No dynamic `include` or `require` |
| REST/AJAX | No custom endpoints; CPTs use `show_in_rest => false` |
| File uploads | Only from the importer, with `basename` plus `sanitize_file_name` |
| Secrets in the repository | No keys, tokens, or passwords found |
| `ABSPATH` guard | Present in every PHP file |
| `localStorage` | Stores only session IDs |
| Autosave and revisions | Guarded in both save handlers |
| Capability checks on save | `edit_post` on both metabox handlers |

---

## 6. Conclusion

The theme is above average in security for a project of this size. The most relevant issues are **least privilege** (L-01) and **file exposure** (L-04). None of the findings allows remote code execution, XSS, or privilege escalation on its own.

### Suggested priority

1. **L-01:** restrict event content management to trusted roles.
2. **L-04:** remove documentation and seed data from the public theme directory.
3. **L-03 and L-05:** validate imported files and related speaker IDs.
4. **L-02 and L-06:** harden helper functions and importer input validation.
5. **I-01 to I-05:** apply as general hardening.

No source files were modified during this audit. This document records findings and recommendations only.
