# Night X V2 — Design System Specification

## 1. Palette & Surface Tokens

### Core Colors
- **Page Background**: `#080A0E` (Deep charcoal obsidian)
- **Primary Color**: `#F59E0B` (`amber-500`)
- **Primary Hover**: `#D97706` (`amber-600`)
- **Primary Active**: `#B45309` (`amber-700`)
- **Primary Soft Tint**: `rgba(245, 158, 11, 0.12)`
- **Accent Orange**: `#F97316` (`orange-500`)
- **Accent Cyan**: `#06B6D4` (`cyan-500`)
- **Accent Emerald**: `#10B981` (`emerald-500`)
- **Accent Purple**: `#8B5CF6` (`purple-500`)
- **Accent Red**: `#EF4444` (`red-500`)

### Surface Hierarchy
| Level | Token | Hex Code | Border | Purpose |
|---|---|---|---|---|
| Inset | `surface-inset` | `#0A0D13` | `rgba(255,255,255,0.04)` | Text areas, input fields, code containers |
| Base | `surface-base` | `#0E1118` | `rgba(255,255,255,0.08)` | Modal bodies, dropdown panels, sidebars |
| Card | `surface-card` | `#111520` | `rgba(255,255,255,0.08)` | Interactive tool cards, section boxes |
| Elevated | `surface-elevated` | `#141824` | `rgba(255,255,255,0.10)` | Feature callouts, high-emphasis modals |
| Hover | `surface-hover` | `#1A2030` | `rgba(255,255,255,0.18)` | Interactive card/item hover state |

---

## 2. Typography
- **Primary Font**: `Inter` (variable font loaded via `next/font/google`).
- **Monospace Font**: `JetBrains Mono`, `ui-monospace`, `Consolas`.
- **Scale**:
  - H1: `text-3xl sm:text-5xl font-black tracking-tight`
  - H2: `text-2xl sm:text-3xl font-bold tracking-tight`
  - H3: `text-lg sm:text-xl font-bold`
  - Body: `text-sm leading-relaxed text-text-secondary`
  - Caption / Tag: `text-xs text-text-tertiary`
  - Monospace code/stat: `font-mono text-xs`

---

## 3. Button System
- `.btn-primary`: High-visibility Amber gradient with dark text (`#080A0E`), font-bold, rounded-12px, soft shadow.
- `.btn-secondary`: Dark surface (`#0E1118`) with white text, subtle border, rounded-12px.
- `.btn-ghost`: Transparent button with subtle hover background and focus visible.

---

## 4. Accessibility Rules
- Native semantic HTML elements (`<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<dialog>`).
- All interactive controls have visible focus rings with `var(--ring)`.
- Respects `prefers-reduced-motion`.
- Touch target sizes minimum 40px+ on primary interactions with adequate spacing.
