# Falcon Battery Widgets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the existing battery dashboard widgets on `/falcon/dashboard` and remove the separate Batteries dashboard navigation surface.

**Architecture:** Extract the battery widget UI into a module-owned component and render it from a new Falcon dashboard page through a small module-to-widget catalog. Preserve old links with a redirect and make Batteries link directly to Battery Register.

**Tech Stack:** React 19, TypeScript, React Router 7, Recharts, Tailwind CSS, Vite

## Global Constraints

- Preserve the existing battery widget visuals and interactions.
- Keep every battery widget owned by the `battery-register` module.
- Do not change Battery Register or battery detail behavior.
- The project has no unit-test runner; verification uses TypeScript, ESLint, the production build, and route inspection.

---

### Task 1: Extract battery widgets

**Files:**
- Create: `src/pages/falcon-dashboard/BatteryDashboardWidgets.tsx`
- Delete: `src/pages/BatteriesDashboardPage.tsx`

**Interfaces:**
- Produces: `BatteryDashboardWidgets(): JSX.Element`, containing the six stats, two charts, and battery map without page-level navigation or heading.

- [ ] Move the existing state, tooltip, stats, charts, and map into `BatteryDashboardWidgets`.
- [ ] Remove `TopBar`, `PageHeader`, and page scroll-container markup from the extracted component.
- [ ] Delete the obsolete standalone page after all imports are migrated.

### Task 2: Compose the Falcon dashboard by module

**Files:**
- Create: `src/data/falconDashboardWidgets.ts`
- Create: `src/pages/FalconDashboardPage.tsx`

**Interfaces:**
- Produces: `FalconDashboardWidget`, `FALCON_WIDGET_CATALOG`, and `widgetsForFalconModules(moduleIds: string[]): FalconDashboardWidget[]`.
- Consumes: `BatteryDashboardWidgets` for widget id `battery-overview` owned by module id `battery-register`.

- [ ] Add a typed widget catalog with `id`, `moduleId`, and `order` fields.
- [ ] Add deduplicated, ordered module filtering matching the existing dashboard catalog pattern.
- [ ] Build the Falcon page header and render registered widget components, returning no output for unknown widget ids.

### Task 3: Update navigation and routes

**Files:**
- Modify: `src/data/sidebarConfig.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `FalconDashboardPage` at `/falcon/dashboard`.

- [ ] Change the Batteries sidebar item to use `href: "/falcon/batteries/register"` and remove its children.
- [ ] Add the `/falcon/dashboard` route.
- [ ] Replace the old battery-dashboard page route with `<Navigate to="/falcon/dashboard" replace />`.
- [ ] Remove the obsolete `BatteriesDashboardPage` import.

### Task 4: Verify the integration

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/data/sidebarConfig.ts`
- Verify: `src/data/falconDashboardWidgets.ts`
- Verify: `src/pages/FalconDashboardPage.tsx`
- Verify: `src/pages/falcon-dashboard/BatteryDashboardWidgets.tsx`

**Interfaces:**
- Produces: a type-safe production bundle with valid Falcon routes and module-owned battery widgets.

- [ ] Run `pnpm build`; expect TypeScript and Vite to exit successfully.
- [ ] Run ESLint on the modified source files; expect no errors.
- [ ] Search for imports of `BatteriesDashboardPage`; expect none.
- [ ] Inspect the final diff against `origin/main` and confirm only the approved feature and its design/plan documents are present.

