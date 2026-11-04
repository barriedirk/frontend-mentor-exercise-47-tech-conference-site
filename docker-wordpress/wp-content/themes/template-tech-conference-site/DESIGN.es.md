# Design System: Cyber-Industrial Terminal (DevHorizon)

Especificación completa del sistema de diseño extraído de `tech-conference-site.fig` y de los componentes de **DevHorizon**. Este documento sirve como archivo de tokens, directrices de diseño y guía de implementación para desarrollo web frontend y diseño en Figma.

---

## 1. Filosofía & Identidad Visual

- **Arquetipo**: Cyber-Industrial / Terminal Hacker / High-Density Technical Conference.
- **Atmósfera**: Fondos oscuros de terminal ultra profundos, alto contraste mediante bloques saturados (Soft Cyan, Warm Biscuit, High-Voltage Lime), tipografía monoespaciada para metadatos y angular geométrica para titulares, acentos tipo consola (`//`, `[+]`, barcodes, telemetría).
- **Densidad de Información**: Compacta, modular, estructurada en rejillas de terminal con divisiones claras (`#33444A`).

---

## 2. Design Tokens

### 2.1 Paleta de Color (Color Palette)

#### Superficies y Fondos Base (Dark Terminal Surfaces)
| Token | Hex | Tailwind / CSS Var | Uso Principal |
| :--- | :--- | :--- | :--- |
| `color-surface-terminal` | `#00151D` | `--surface-terminal` | Fondo primario de página, modales y barras |
| `color-surface-rail` | `#001A24` | `--surface-rail` | Riel lateral de tracks, franjas técnicas |
| `color-surface-dim` | `#01161E` | `--surface-dim` | Fondo profundo alternativo |
| `color-surface-container` | `#071E26` | `--surface-container` | Cajas de código, inputs, dropdowns |
| `color-border-dark` | `#33444A` | `--border-dark` | Bordes estructurales, divisores, líneas de terminal |

#### Acentos & Estados (Accent & Energy Colors)
| Token | Hex | Tailwind / CSS Var | Uso Principal |
| :--- | :--- | :--- | :--- |
| `color-accent-lime` | `#D1FF66` | `--accent-lime` | Acento primario, tags activos, tabs seleccionadas, prefijos `//` |
| `color-accent-cyan` | `#B5E9FC` | `--accent-cyan` | Bloque temático Keynote/Frontend, botones primarios invertidos |
| `color-accent-biscuit` | `#FFE6BA` | `--accent-biscuit` | Bloque temático Deep Dive/Workshops, badges cálidos |
| `color-accent-danger` | `#FF8080` | `--accent-danger` | Acciones de borrado, cancelaciones, estados de error |

#### Textos y Tipografía (Text Hierarchy)
| Token | Hex | Tailwind / CSS Var | Uso Principal |
| :--- | :--- | :--- | :--- |
| `color-text-primary` | `#FCEFE8` | `--text-primary` | Titulares y texto de alto contraste sobre fondo oscuro |
| `color-text-secondary` | `#C2C5C2` | `--text-secondary` | Descripciones, subtítulos, navegación secundaria |
| `color-text-muted` | `#6A7B82` | `--text-muted` | Metadatos secundarios, placeholders, marcas de agua |
| `color-text-inverse` | `#00151D` | `--text-inverse` | Texto oscuro sobre bloques de color (`#D1FF66`, `#B5E9FC`, `#FFE6BA`) |

---

### 2.2 Tipografía (Typography Scale)

| Rol | Familia | Peso | Tamaño | Line Height | Letter Spacing |
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

### 2.3 Espaciado & Rejilla (Spacing & Layout)

- **Unidad base**: `4px`
- **Escala de espaciado**:
  - `space-xs`: `4px`
  - `space-sm`: `8px`
  - `space-md`: `16px`
  - `space-lg`: `24px`
  - `space-xl`: `32px`
  - `space-2xl`: `48px`
  - `space-3xl`: `64px`
- **Ancho máximo de contenedor**: `1360px` (desktop), `728px` (tablet), `343px` (mobile).
- **Márgenes de pantalla**:
  - Desktop: `40px`
  - Tablet: `24px`
  - Mobile: `16px`

---

### 2.4 Bordes, Sombras & Efectos

- **Border Radius**:
  - `rounded-none` (`0px`): Por defecto en todas las tarjetas industriales, rieles, tabs y botones.
  - `rounded-sm` (`2px` - `4px`): Solo para insignias técnicas puntuales o avatars cuando se especifique.
- **Bordes estándar**: `1px solid #33444A`
- **Elevación / Sombras**:
  - Sin sombras difuminadas tradicionales (flat / brutalist).
  - Enfoques con contornos de alto contraste y glows mínimos opcionales: `0 0 10px rgba(209, 255, 102, 0.25)`.

---

## 3. Patrones de Componentes

### 3.1 Session / Talk Card (Schedule Matrix)
- **Anatomía**:
  1. **Track Rail**: Franja vertical izquierda en `#001A24` con texto rotado `TRACK // [NOMBRE]` en tipografía monoespaciada color arena `#FFE6BA` o lima `#D1FF66`.
  2. **Bloque de Contenido**: Fondo de alto impacto en Cyan (`#B5E9FC`) o Warm Biscuit (`#FFE6BA`) con texto en `#00151D`.
     - Título en *Chakra Petch* 24px-32px.
     - Ponente en *JetBrains Mono* Bold con separador `//`.
     - Tags en formato hashtag (`#NEXTJS`, `#WASM_SIMD`).
     - Botón colapsable interactivo: `[+] SHOW DETAILS` / `[-] HIDE DETAILS`.
  3. **Columna de Telemetría**: Hora de inicio y fin, gráfico de código de barras industrial y botón de bookmark.

### 3.2 Botones & Acciones
- **Primary Cyber Button**:
  - Fondo: `#D1FF66` | Texto: `#00151D` | Font: `JetBrains Mono 700` | Shape: `rounded-none`.
  - Hover: Fondo `#FFFFFF`, borde dinámico.
- **Secondary Terminal Button**:
  - Fondo: `transparent` | Borde: `1px solid #33444A` | Texto: `#FCEFE8`.
  - Hover: Borde `#D1FF66`, texto `#D1FF66`.
- **Destructive / Clear Button**:
  - Texto: `#FF8080` con soporte para prefijo `[CLEAR]`.

### 3.3 Barra de Navegación & Footer
- **Navbar**:
  - Altura: `64px` - `80px`.
  - Fondo: `#00151D` con borde inferior `1px solid #33444A`.
  - Logo: Estilo prompt de terminal `>_DevHorizon`.
  - Enlaces: Separados con estado activo subrayado en `#D1FF66`.
- **Footer**:
  - Cuatro columnas: Información de evento con copyright `// DEVHORIZON_2026 //`, navegación de tracks, coordenadas del venue (`Pier 70, San Francisco`) y enlace a políticas técnicas.

---

## 4. Tokens CSS / Variables para Proyecto Web

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

## 5. Configuración Tailwind CSS (`tailwind.config.js`)

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
