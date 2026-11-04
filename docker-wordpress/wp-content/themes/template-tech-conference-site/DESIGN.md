# Design System: Cyber-Industrial Terminal (DevHorizon)

Complete design system specification extracted from `tech-conference-site.fig` and the **DevHorizon** components. This document serves as a token archive, design guidelines, and implementation guide for frontend web development and Figma design.

---

## 1. Philosophy & Visual Identity

- **Archetype**: Cyber-Industrial / Terminal Hacker / High-Density Technical Conference.
- **Atmosphere**: Ultra-deep dark terminal backgrounds, high contrast through saturated blocks (Soft Cyan, Warm Biscuit, High-Voltage Lime), monospaced typography for metadata and geometric angular typography for headlines, console-style accents (`//`, `[+]`, barcodes, telemetry).
- **Information Density**: Compact, modular, structured in terminal grids with clear divisions (`#33444A`).

---

## 2. Design Tokens

### 2.1 Color Palette

#### Surfaces and Base Backgrounds (Dark Terminal Surfaces)
| Token | Hex | Tailwind / CSS Var | Primary Use |
| :--- | :--- | :--- | :--- |
| `color-surface-terminal` | `#00151D` | `--surface-terminal` | Primary page, modal, and bar background |
| `color-surface-rail` | `#001A24` | `--surface-rail` | Track side rail, technical stripes |
| `color-surface-dim` | `#01161E` | `--surface-dim` | Alternative deep background |
| `color-surface-container` | `#071E26` | `--surface-container` | Code boxes, inputs, dropdowns |
| `color-border-dark` | `#33444A` | `--border-dark` | Structural borders, dividers, terminal lines |

#### Accents & States (Accent & Energy Colors)
| Token | Hex | Tailwind / CSS Var | Primary Use |
| :--- | :--- | :--- | :--- |
| `color-accent-lime` | `#D1FF66` | `--accent-lime` | Primary accent, active tags, selected tabs, `//` prefixes |
| `color-accent-cyan` | `#B5E9FC` | `--accent-cyan` | Keynote/Frontend theme block, inverted primary buttons |
| `color-accent-biscuit` | `#FFE6BA` | `--accent-biscuit` | Deep Dive/Workshops theme block, warm badges |
| `color-accent-danger` | `#FF8080` | `--accent-danger` | Delete actions, cancellations, error states |

#### Text and Typography (Text Hierarchy)
| Token | Hex | Tailwind / CSS Var | Primary Use |
| :--- | :--- | :--- | :--- |
| `color-text-primary` | `#FCEFE8` | `--text-primary` | Headlines and high-contrast text on dark backgrounds |
| `color-text-secondary` | `#C2C5C2` | `--text-secondary` | Descriptions, subtitles, secondary navigation |
| `color-text-muted` | `#6A7B82` | `--text-muted` | Secondary metadata, placeholders, watermarks |
| `color-text-inverse` | `#00151D` | `--text-inverse` | Dark text on color blocks (`#D1FF66`, `#B5E9FC`, `#FFE6BA`) |

---

### 2.2 Typography Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `Chakra Petch` | Bold (700) | `80px` / `5rem` | `100%` | `-2px` |
| **Headline Large** | `Chakra Petch` | Bold (700) | `32px` / `2rem` | `115%` | `-0.5px` |
| **Headline Medium** | `Chakra Petch` | SemiBold (600) | `24px` / `1.5rem` | `120%` | `0px` |
| **Monospace Headline** | `JetBrains Mono` | Bold (700) | `20px` / `1.25rem` | `130%` | `0px` |
| **Code / Metadata** | `JetBrains Mono` | Medium (500) | `16px` / `1rem` | `140%` | `0px` |
| **Body Mono** | `JetBrains Mono` | Regular (400) | `14px` / `0.875rem` | `150%` | `0.2px` |
| **Caption Mono** | `JetBrains Mono` | Regular (400) | `12px` / `0.75rem` | `140%` | `0.5px` |
| **Micro Telemetry** | `JetBrains Mono` | Medium (500) | `11px` / `0.6875rem` | `130%` | `1px` |

---

### 2.3 Spacing & Layout

- **Base unit**: `4px`
- **Spacing scale**:
  - `space-xs`: `4px`
  - `space-sm`: `8px`
  - `space-md`: `16px`
  - `space-lg`: `24px`
  - `space-xl`: `32px`
  - `space-2xl`: `48px`
  - `space-3xl`: `64px`
- **Maximum container width**: `1360px` (desktop), `728px` (tablet), `343px` (mobile).
- **Screen margins**:
  - Desktop: `40px`
  - Tablet: `24px`
  - Mobile: `16px`

---

### 2.4 Borders, Shadows & Effects

- **Border Radius**:
  - `rounded-none` (`0px`): Default for all industrial cards, rails, tabs, and buttons.
  - `rounded-sm` (`2px` - `4px`): Only for specific technical badges or avatars when specified.
- **Standard borders**: `1px solid #33444A`
- **Elevation / Shadows**:
  - No traditional blurred shadows (flat / brutalist).
  - Focus states with high-contrast outlines and optional minimal glows: `0 0 10px rgba(209, 255, 102, 0.25)`.

---

## 3. Component Patterns

### 3.1 Session / Talk Card (Schedule Matrix)
- **Anatomy**:
  1. **Track Rail**: Left vertical strip in `#001A24` with rotated text `TRACK // [NAME]` in sand-colored `#FFE6BA` or lime `#D1FF66` monospaced typography.
  2. **Content Block**: High-impact Cyan (`#B5E9FC`) or Warm Biscuit (`#FFE6BA`) background with text in `#00151D`.
     - Title in *Chakra Petch* 24px-32px.
     - Speaker in *JetBrains Mono* Bold with a `//` separator.
     - Hashtag-style tags (`#NEXTJS`, `#WASM_SIMD`).
     - Interactive collapsible button: `[+] SHOW DETAILS` / `[-] HIDE DETAILS`.
  3. **Telemetry Column**: Start and end time, industrial barcode graphic, and bookmark button.

### 3.2 Buttons & Actions
- **Primary Cyber Button**:
  - Background: `#D1FF66` | Text: `#00151D` | Font: `JetBrains Mono 700` | Shape: `rounded-none`.
  - Hover: `#FFFFFF` background, dynamic border.
- **Secondary Terminal Button**:
  - Background: `transparent` | Border: `1px solid #33444A` | Text: `#FCEFE8`.
  - Hover: Border `#D1FF66`, text `#D1FF66`.
- **Destructive / Clear Button**:
  - Text: `#FF8080` with support for the `[CLEAR]` prefix.

### 3.3 Navigation Bar & Footer
- **Navbar**:
  - Height: `64px` - `80px`.
  - Background: `#00151D` with a bottom border `1px solid #33444A`.
  - Logo: Terminal prompt style `>_DevHorizon`.
  - Links: Separated with an active state underlined in `#D1FF66`.
- **Footer**:
  - Four columns: event information with copyright `// DEVHORIZON_2026 //`, track navigation, venue coordinates (`Pier 70, San Francisco`), and a link to technical policies.

---

## 4. CSS Tokens / Variables for the Web Project

```css
:root {
  /* Surfaces */
  --color-surface-terminal: #00151D;
  --color-surface-rail: #001A24;
  --color-surface-container: #071E26;
  --color-border-dark: #33444A;

  /* Accents */
  --color-accent-lime: #D1FF66;
  --color-accent-cyan: #B5E9FC;
  --color-accent-biscuit: #FFE6BA;
  --color-accent-danger: #FF8080;

  /* Typography Colors */
  --color-text-primary: #FCEFE8;
  --color-text-secondary: #C2C5C2;
  --color-text-muted: #6A7B82;
  --color-text-inverse: #00151D;

  /* Fonts */
  --font-display: 'Chakra Petch', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Inter', sans-serif;

  /* Container */
  --max-width-content: 1360px;
}
```

---

## 5. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          terminal: '#00151D',
          rail: '#001A24',
          container: '#071E26',
        },
        border: {
          terminal: '#33444A',
        },
        accent: {
          lime: '#D1FF66',
          cyan: '#B5E9FC',
          biscuit: '#FFE6BA',
          danger: '#FF8080',
        },
        sand: '#FCEFE8',
        slate: '#C2C5C2',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
      },
      maxWidth: {
        terminal: '1360px',
      }
    },
  },
  plugins: [],
}
```
