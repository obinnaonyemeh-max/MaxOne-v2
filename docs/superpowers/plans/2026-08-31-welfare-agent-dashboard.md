# Welfare Agent Dashboard Implementation Plan

> **For agentic workers:** Implement this contained plan inline; no sub-agent is required.

**Goal:** Show exactly the eleven requested existing dashboard metrics for Welfare Agent, using assignment-scoped data and no unrequested widgets.

**Architecture:** Extend the existing Driver Experience module-to-widget mapping with the two Welfare metric IDs. Reuse the Welfare page's mock records and the dashboard's existing `StatCard`, `DistributionChart`, and `HorizontalBarChart` components; do not create a widget component.

**Tech Stack:** React, TypeScript, Vite, existing MAX dashboard components

## Global Constraints

- Welfare Agent sees only: Total Champions, Active Champions, Inactive Champions, Open Tickets, SLA Breached, Resolved Tickets, Ticket Status Breakdown, Tickets by Category, Welfare Follow-Ups Overdue, Welfare Cases, and Champions by Location.
- All values must be scoped to Champions or tickets assigned to the simulated Welfare Agent.
- Do not create or display any unrequested widget.

---

### Task 1: Configure and render the Welfare Agent dashboard

**Files:**
- Modify: `src/data/dashboardWidgets.ts`
- Modify: `src/pages/WelfarePage.tsx`
- Modify: `src/pages/DriverExperienceDashboardPage.tsx`
- Modify: `docs/ROLE_SIMULATION.md`

**Interfaces:**
- Consumes: `driverExperienceWidgetIdsForModules`, `championsForSimulationMode`, `ticketsForSimulationMode`, existing dashboard chart/card components
- Produces: Welfare widget IDs and assignment-scoped Welfare values

- [x] Add `stat-welfare-follow-ups-overdue` and `stat-welfare-cases` to the existing Driver Experience widget ID union and map them to the `welfare` module.
- [x] Export the existing Welfare mock records and reference date so dashboard values use the same source as the Welfare page.
- [x] Filter Welfare records with `championsForSimulationMode`, then calculate overdue follow-ups and records with logged issues.
- [x] Render the two requested values with the existing `StatCard` component and keep all non-requested Full Build-only widgets hidden for Welfare Agent.
- [x] Update the role-simulation documentation with the exact Welfare dashboard list.
- [x] Run `git diff --check`, targeted ESLint, and the Node 22 production build.
