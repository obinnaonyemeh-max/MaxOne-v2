# Responsive layout

This app is a desktop-first fleet ops console. The goal is **tablet / laptop-narrow first** (usable from ~768px; tolerable on phone), not a phone-native redesign. Technician field work stays on the separate mobile app.

Desktop at `≥1280px` should look unchanged.

Fix shared layout and primitives in `src/components/max/` before page-level Tailwind. Do not invent per-page breakpoints.

## Breakpoint contract

Use Tailwind defaults only:

- `lg` (1024) — chrome: sidebar vs drawer
- `md` (768) — content: stack columns, wrap toolbars, full-width sheets
- `sm` (640) — last-resort overflow fixes only

## Rules

- Never use `w-[NNpx]` without `max-w-full min-w-0`, or a breakpoint that stacks the layout.
- Never use `grid-cols-3` / `grid-cols-4` without a 1-col (or 2-col) mobile default.
- Flex children that can overflow need `min-w-0`.
- Hover-only controls (sidebar expand-on-hover) cannot be the only path on touch.
- Do not shrink table type below the existing 13–14px scale. Wrap and scroll instead.
- Tables scroll horizontally inside the table wrapper; the page itself must not.
- Sheets and dialogs are `max-w-full` below `md`. Do not override with `max-w-[40vw]` (or similar) on callers.

## Shell

Below `lg`, `PageLayout` takes the sidebar out of the flex row and renders it in a left `Sheet`. `TopBar` shows a hamburger that opens the drawer. The drawer closes on navigate, overlay click, and when the viewport crosses `lg`.

On small screens the outer content-card padding and rounded chrome are dropped so the page uses the full viewport. `overflow-hidden` stays on the shell; inner regions handle `overflow-x-auto` (tables) and `overflow-y-auto` (page body).

Breadcrumbs collapse to the last crumb below `md`.

## Page recipes

### List / register

Sticky header + toolbar. Toolbar wraps. Table scrolls X only (`DataTable` overflow). Pagination stacks below `md`.

### Detail + side column

Below `lg`, `flex-col`: side column (`w-[340px]` / `w-[440px]`) goes full width first, tabs or main column below.

### Map + list

Below `lg`, stack: map full width on top, list below (scrollable). Row layout from `lg` up.

### Wizard / stepper

Upload columns (`w-[280px]`) stack above the form below `md`. Stepper sidebars (`w-[300px]`) hide below `lg`; keep `StepIndicator` / wizard header next/back as the mobile path.

### Dashboard grids

Stat / card grids default to `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`. Chart pairs use `grid-cols-1 lg:grid-cols-2`.

## Exceptions

Maps, heatmaps, and dense tables with an explicit `min-w-[1200px]` need a dedicated design — do not guess with utility classes. Hover-to-expand sidebar remains desktop-only; the drawer is the touch path.

## Verification

Viewports: phone 390, tablet 768, laptop 1280.

- Nav opens, route changes, drawer closes
- Table: no page-level horizontal scroll; only the table scrolls
- Filters and primary actions remain reachable
- Sheet/modal is full-width on small screens
- No hover-only control is required
- Desktop `≥1280` matches the previous layout
