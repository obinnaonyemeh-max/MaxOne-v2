# MaxOne Color System

This document describes the standardized color token system used in the MaxOne FleetOps application, following the shadcn/ui approach.

## Architecture Overview

The color system uses a **three-layer architecture**:

```
Layer 1: Primitives     →  Raw color values (gray-50, gray-100, etc.)
Layer 2: Semantic       →  Purpose-driven tokens (background, foreground, muted)
Layer 3: Component      →  UI-specific tokens (sidebar-hover, table-header)
```

All colors are defined as CSS custom properties in `src/index.css`.

## Layer 1: Primitive Colors

### Gray Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gray-50` | #FAFAFA | Very light backgrounds, hover states |
| `--color-gray-100` | #F3F3F3 | Table headers, content backgrounds |
| `--color-gray-200` | #EAEAEA | Borders, dividers, sidebar hover |
| `--color-gray-300` | #D4D4D4 | Stronger borders |
| `--color-gray-400` | #A3A3A3 | Labels, pagination text |
| `--color-gray-500` | #737373 | Placeholder text, muted foreground |
| `--color-gray-600` | #555556 | Body text, table text |
| `--color-gray-700` | #404040 | Darker text |
| `--color-gray-800` | #262626 | Very dark UI elements |
| `--color-gray-900` | #171717 | Near-black |
| `--color-gray-950` | #121314 | Primary text, brand dark |

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-primary` | #FCDD00 | MaxOne yellow |
| `--color-brand-dark` | #121314 | Dark brand color |

### Semantic Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | #16B04F | Success states |
| `--color-warning` | #E88E15 | Warning states |
| `--color-danger` | #DC2626 | Error/danger states |
| `--color-info` | #1855FC | Informational states |

## Layer 2: Semantic Tokens

These tokens provide meaning and enable theming (e.g., dark mode).

### Base

```css
--color-background: #FFFFFF;
--color-foreground: var(--color-gray-950);
```

### Card & Popover

```css
--color-card: #FFFFFF;
--color-card-foreground: var(--color-gray-950);
--color-popover: #FFFFFF;
--color-popover-foreground: var(--color-gray-950);
```

### Interactive States

```css
--color-primary: var(--color-gray-950);
--color-primary-foreground: var(--color-gray-50);
--color-secondary: var(--color-gray-100);
--color-secondary-foreground: var(--color-gray-950);
--color-muted: var(--color-gray-100);
--color-muted-foreground: var(--color-gray-500);
--color-accent: var(--color-gray-100);
--color-accent-foreground: var(--color-gray-950);
```

### Destructive

```css
--color-destructive: var(--color-danger);
--color-destructive-foreground: var(--color-gray-50);
```

### Borders & Inputs

```css
--color-border: var(--color-gray-200);
--color-input: var(--color-gray-50);
--color-ring: var(--color-gray-950);
```

## Layer 3: Component Tokens

### Sidebar

| Token | Value |
|-------|-------|
| `--color-sidebar` | #FFFFFF |
| `--color-sidebar-hover` | var(--color-gray-200) |
| `--color-sidebar-active` | var(--color-gray-200) |
| `--color-sidebar-border` | var(--color-gray-200) |
| `--color-sidebar-label` | var(--color-gray-400) |
| `--color-sidebar-item` | var(--color-gray-600) |
| `--color-sidebar-item-active` | var(--color-gray-950) |
| `--color-sidebar-user-role` | var(--color-gray-500) |

### Status Badge

| Token | Value |
|-------|-------|
| `--color-badge-active-text` | #008356 |
| `--color-badge-active-bg` | #EEFDF3 |
| `--color-badge-inactive-text` | var(--color-danger) |
| `--color-badge-inactive-bg` | #FFF2F1 |

### Table

| Token | Value |
|-------|-------|
| `--color-table-border` | var(--color-gray-100) |
| `--color-table-header-bg` | var(--color-gray-100) |
| `--color-table-header-text` | var(--color-gray-600) |
| `--color-table-text` | var(--color-gray-600) |
| `--color-table-text-primary` | var(--color-gray-950) |

### Breadcrumb

| Token | Value |
|-------|-------|
| `--color-breadcrumb-root` | var(--color-gray-500) |
| `--color-breadcrumb-separator` | var(--color-gray-500) |
| `--color-breadcrumb-parent` | var(--color-gray-950) |
| `--color-breadcrumb-current` | var(--color-info) |

## Usage Guidelines

### DO: Use Tailwind Classes with Token Names

```tsx
// Backgrounds
<div className="bg-background" />        // Page background
<div className="bg-card" />              // Card background
<div className="bg-muted" />             // Muted/subtle background
<div className="bg-gray-50" />           // Specific gray shade

// Text
<p className="text-foreground" />        // Primary text
<p className="text-muted-foreground" />  // Secondary/muted text
<p className="text-gray-600" />          // Specific gray shade

// Borders
<div className="border border-border" /> // Standard border
<div className="border-gray-100" />      // Lighter border

// Status colors
<span className="text-status-success" /> // Success text
<div className="bg-status-danger" />     // Danger background
```

### DO: Use Component Tokens for Specific UI

```tsx
// Sidebar
<div className="bg-sidebar" />
<span className="text-sidebar-item" />
<span className="text-sidebar-item-active" />

// Table
<th className="bg-table-header-bg text-table-header-text" />
<td className="text-table-text" />

// Breadcrumbs
<span className="text-breadcrumb-root" />
<span className="text-breadcrumb-current" />
```

### DON'T: Use Hardcoded Colors

```tsx
// BAD - hardcoded hex
<div className="bg-[#F3F3F3]" />
<div style={{ color: '#555556' }} />

// GOOD - use tokens
<div className="bg-muted" />
<div className="text-gray-600" />
```

### DON'T: Use Tailwind's Default Palette

```tsx
// BAD - default zinc palette
<div className="bg-zinc-100" />
<span className="text-zinc-500" />

// GOOD - use our gray scale
<div className="bg-gray-100" />
<span className="text-gray-500" />
```

## Adding New Colors

1. **Check if an existing token works** - Most UI needs are covered by semantic tokens
2. **Use primitives for one-off cases** - `bg-gray-300` is fine for specific needs
3. **Create component tokens for patterns** - If you repeat a color combination, add a component token

### Adding a New Component Token

```css
/* In src/index.css, under Layer 3 */
@theme {
  /* ... existing tokens ... */
  
  /* New Component */
  --color-my-component-bg: var(--color-gray-100);
  --color-my-component-text: var(--color-gray-600);
  --color-my-component-hover: var(--color-gray-200);
}
```

Then use in components:

```tsx
<div className="bg-my-component-bg text-my-component-text hover:bg-my-component-hover" />
```

## Dark Mode (Future)

The token system is designed to support dark mode. When implemented:

1. Keep Layer 1 primitives as-is (or add dark variants)
2. Override Layer 2 semantic tokens for `.dark` class
3. Component tokens automatically inherit from semantic tokens

Example future implementation:

```css
@layer base {
  .dark {
    --color-background: var(--color-gray-950);
    --color-foreground: var(--color-gray-50);
    --color-card: var(--color-gray-900);
    --color-border: var(--color-gray-800);
    /* etc. */
  }
}
```

## Quick Reference

| Need | Token |
|------|-------|
| Page background | `bg-background` |
| Card/panel background | `bg-card` |
| Subtle background | `bg-muted` |
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Standard border | `border-border` |
| Focus ring | `ring-ring` |
| Primary button | `bg-primary text-primary-foreground` |
| Success indicator | `bg-status-success` or `text-status-success` |
| Error indicator | `bg-status-danger` or `text-status-danger` |
