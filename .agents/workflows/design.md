---
description: > A reusable design system for modern web applications using a soft white neumorphic surface language, green accents, subtle depth, accessible motion, and consistent component behavior. 
---

# Neumorphic Green Design Framework



## 1. Design Identity

### 1.1 Theme Name

**Soft Green Neumorphism**

### 1.2 Design Direction

This design system uses:

- Soft white and cool-white backgrounds
- Light green accent colors
- Raised and inset neumorphic surfaces
- Rounded corners
- Low-contrast shadows
- Clean typography
- Smooth hover and press interactions
- Minimal gradients
- Soft glow instead of harsh borders
- Comfortable spacing
- Clear visual hierarchy

### 1.3 Visual Personality

The interface should feel:

- Clean
- Calm
- Premium
- Modern
- Friendly
- Soft
- Focused
- Trustworthy
- Lightweight
- Accessible

### 1.4 Core Principle

Every component should appear to be softly molded from the same background surface.

Depth must be created using balanced light and dark shadows rather than heavy borders.

---

## 2. Color System

## 2.1 Primary Background Colors

```css
--color-bg-page: #F4F7F5;
--color-bg-surface: #F7FAF8;
--color-bg-elevated: #FFFFFF;
--color-bg-soft-green: #F0FDF4;
--color-bg-disabled: #EEF2EF;
```

### Usage

| Token | Usage |
|---|---|
| `--color-bg-page` | Main page background |
| `--color-bg-surface` | Cards, panels and sections |
| `--color-bg-elevated` | Modals, menus and highlighted surfaces |
| `--color-bg-soft-green` | Selected states and subtle emphasis |
| `--color-bg-disabled` | Disabled inputs and buttons |

---

## 2.2 Primary Green Palette

```css
--green-50: #F0FDF4;
--green-100: #DCFCE7;
--green-200: #BBF7D0;
--green-300: #86EFAC;
--green-400: #4ADE80;
--green-500: #22C55E;
--green-600: #16A34A;
--green-700: #15803D;
--green-800: #166534;
--green-900: #14532D;
```

### Recommended Roles

```css
--color-primary: var(--green-500);
--color-primary-hover: var(--green-600);
--color-primary-active: var(--green-700);
--color-primary-soft: var(--green-100);
--color-primary-subtle: var(--green-50);
```

---

## 2.3 Neutral Colors

```css
--neutral-0: #FFFFFF;
--neutral-50: #F8FAF9;
--neutral-100: #F1F5F3;
--neutral-200: #E4EAE6;
--neutral-300: #CBD5CE;
--neutral-400: #9CAAA0;
--neutral-500: #6B7A70;
--neutral-600: #4B5A50;
--neutral-700: #35433A;
--neutral-800: #223028;
--neutral-900: #142019;
```

---

## 2.4 Text Colors

```css
--color-text-primary: #142019;
--color-text-secondary: #4B5A50;
--color-text-muted: #6B7A70;
--color-text-disabled: #9CAAA0;
--color-text-on-primary: #FFFFFF;
--color-text-link: #15803D;
--color-text-link-hover: #166534;
```

### Text Contrast Rules

- Primary text must use `--color-text-primary`.
- Secondary descriptions must use `--color-text-secondary`.
- Do not use very light gray for important information.
- Green text should only be used for links, positive states, active labels and small highlights.
- Large paragraphs should not use bright green.

---

## 2.5 Semantic Colors

```css
--color-success: #16A34A;
--color-success-bg: #DCFCE7;

--color-warning: #CA8A04;
--color-warning-bg: #FEF9C3;

--color-error: #DC2626;
--color-error-bg: #FEE2E2;

--color-info: #0284C7;
--color-info-bg: #E0F2FE;
```

---

## 3. Typography System

## 3.1 Font Families

### Primary Font

**Inter**

Use for:

- Body text
- Buttons
- Inputs
- Navigation
- Labels
- Tables
- Dashboard content

```css
--font-primary: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Display Font

**Manrope**

Use for:

- Hero headings
- Section headings
- Large numbers
- Feature titles
- Marketing content

```css
--font-display: "Manrope", "Inter", system-ui, sans-serif;
```

### Monospace Font

**JetBrains Mono**

Use for:

- Code blocks
- Technical values
- Keyboard shortcuts
- IDs
- Developer tools

```css
--font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
```

---

## 3.2 Font Weights

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Rules

- Body text: `400`
- Labels and buttons: `500` or `600`
- Card titles: `600`
- Main headings: `700`
- Hero heading: `700` or `800`
- Avoid using more than three weights on one screen

---

## 3.3 Type Scale

```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
```

### Suggested Usage

| Element | Size | Weight | Line Height |
|---|---:|---:|---:|
| Hero title | 48–60px | 700–800 | 1.05–1.15 |
| Page title | 36–48px | 700 | 1.15 |
| Section title | 28–36px | 700 | 1.2 |
| Card title | 18–22px | 600 | 1.3 |
| Body large | 18px | 400 | 1.65 |
| Body | 16px | 400 | 1.6 |
| Supporting text | 14px | 400 | 1.5 |
| Label | 12–14px | 500–600 | 1.4 |

---

## 3.4 Letter Spacing

```css
--tracking-tight: -0.03em;
--tracking-heading: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.03em;
--tracking-label: 0.05em;
```

Rules:

- Large headings: `-0.03em` to `-0.02em`
- Body text: `0`
- Small uppercase labels: `0.05em`
- Buttons: `0` to `0.01em`

---

## 4. Spacing System

Use a consistent 4px base scale.

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Layout Rules

- Inline icon gap: `8px`
- Button icon gap: `8px`
- Form field gap: `16px`
- Card internal gap: `16px` to `24px`
- Grid gap: `20px` to `32px`
- Section vertical padding: `64px` to `96px`
- Hero vertical padding: `96px` to `128px`
- Mobile section padding: `48px` to `64px`

---

## 5. Container and Layout System

## 5.1 Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1440px;
```

### Main Container

```css
.design-container {
  width: min(100% - 32px, 1280px);
  margin-inline: auto;
}
```

### Responsive Horizontal Padding

```css
--page-padding-mobile: 16px;
--page-padding-tablet: 24px;
--page-padding-desktop: 32px;
--page-padding-wide: 48px;
```

---

## 5.2 Grid Rules

- Use 12-column grid on desktop.
- Use 8-column grid on tablet.
- Use 4-column grid on mobile.
- Avoid more than four equal cards per row.
- Recommended content width for long text: `640px` to `760px`.
- Keep important content aligned to a common vertical grid.

---

## 6. Border Radius System

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-2xl: 32px;
--radius-3xl: 40px;
--radius-pill: 999px;
```

### Component Radius Rules

| Component | Radius |
|---|---:|
| Small badge | 999px |
| Button | 12–16px |
| Input | 14–16px |
| Standard card | 20–24px |
| Large feature card | 28–32px |
| Modal | 24–32px |
| Avatar | 50% |
| Tooltip | 8–10px |

Do not use a different radius for every component. Use a small set consistently.

---

## 7. Neumorphic Shadow System

Neumorphism requires a light shadow and a dark shadow working together.

## 7.1 Base Shadow Colors

```css
--shadow-light: rgba(255, 255, 255, 0.95);
--shadow-dark: rgba(166, 180, 170, 0.36);
--shadow-dark-soft: rgba(166, 180, 170, 0.22);
--shadow-green: rgba(34, 197, 94, 0.20);
```

---

## 7.2 Raised Surface

```css
--shadow-raised-sm:
  -4px -4px 10px rgba(255, 255, 255, 0.92),
  4px 4px 10px rgba(166, 180, 170, 0.22);

--shadow-raised-md:
  -8px -8px 18px rgba(255, 255, 255, 0.96),
  8px 8px 18px rgba(166, 180, 170, 0.28);

--shadow-raised-lg:
  -14px -14px 30px rgba(255, 255, 255, 0.98),
  14px 14px 30px rgba(166, 180, 170, 0.32);
```

---

## 7.3 Inset Surface

```css
--shadow-inset-sm:
  inset 2px 2px 6px rgba(166, 180, 170, 0.20),
  inset -2px -2px 6px rgba(255, 255, 255, 0.90);

--shadow-inset-md:
  inset 4px 4px 10px rgba(166, 180, 170, 0.25),
  inset -4px -4px 10px rgba(255, 255, 255, 0.94);
```

---

## 7.4 Hover Shadow

```css
--shadow-hover:
  -10px -10px 24px rgba(255, 255, 255, 0.98),
  12px 12px 26px rgba(166, 180, 170, 0.34),
  0 10px 30px rgba(34, 197, 94, 0.10);
```

---

## 7.5 Focus Glow

```css
--shadow-focus:
  0 0 0 3px rgba(34, 197, 94, 0.18),
  -6px -6px 14px rgba(255, 255, 255, 0.94),
  6px 6px 14px rgba(166, 180, 170, 0.26);
```

---

## 7.6 Shadow Usage Rules

- Small components use small shadows.
- Cards use medium shadows.
- Hero objects and modals may use large shadows.
- Pressed controls must switch from raised to inset.
- Avoid stacking more than three visible shadow layers.
- Do not use pure black shadows.
- Keep shadow opacity soft.
- Neumorphism must never reduce readability or focus visibility.

---

## 8. Surface Styles

## 8.1 Standard Raised Surface

```css
.neu-surface {
  background: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-raised-md);
}
```

## 8.2 Inset Surface

```css
.neu-inset {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-inset-md);
}
```

## 8.3 Elevated White Surface

```css
.neu-elevated {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-raised-lg);
}
```

---

## 9. Button System

## 9.1 Button Sizes

```css
--button-height-sm: 36px;
--button-height-md: 44px;
--button-height-lg: 52px;
--button-height-xl: 60px;
```

### Horizontal Padding

| Size | Padding |
|---|---:|
| Small | 12–16px |
| Medium | 18–22px |
| Large | 24–28px |
| Extra Large | 28–34px |

---

## 9.2 Primary Button

```css
.button-primary {
  min-height: var(--button-height-md);
  padding-inline: 22px;
  border: 0;
  border-radius: var(--radius-md);
  background: linear-gradient(145deg, #2ED66B, #18B653);
  color: var(--color-text-on-primary);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  box-shadow:
    -4px -4px 10px rgba(255, 255, 255, 0.80),
    6px 6px 14px rgba(22, 163, 74, 0.24),
    0 8px 20px rgba(34, 197, 94, 0.18);
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    background 220ms ease;
}
```

### Hover

```css
.button-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(145deg, #35DD73, #16A34A);
  box-shadow:
    -5px -5px 12px rgba(255, 255, 255, 0.88),
    8px 8px 18px rgba(22, 163, 74, 0.28),
    0 12px 28px rgba(34, 197, 94, 0.22);
}
```

### Active

```css
.button-primary:active {
  transform: translateY(0) scale(0.98);
  box-shadow:
    inset 3px 3px 8px rgba(20, 83, 45, 0.20),
    inset -3px -3px 8px rgba(134, 239, 172, 0.20);
}
```

---

## 9.3 Secondary Neumorphic Button

```css
.button-secondary {
  min-height: var(--button-height-md);
  padding-inline: 22px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  color: var(--green-700);
  box-shadow: var(--shadow-raised-sm);
  transition:
    transform 180ms ease,
    box-shadow 220ms ease,
    color 180ms ease;
}
```

### Hover

```css
.button-secondary:hover {
  transform: translateY(-2px);
  color: var(--green-800);
  box-shadow: var(--shadow-hover);
}
```

### Active

```css
.button-secondary:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-inset-sm);
}
```

---

## 9.4 Icon Button

```css
.icon-button {
  width: 44px;
  height: 44px;
  display: inline-grid;
  place-items: center;
  border: 0;
  border-radius: 14px;
  backgroun