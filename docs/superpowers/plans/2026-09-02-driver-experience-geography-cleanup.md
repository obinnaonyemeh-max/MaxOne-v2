# Driver Experience Geography Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Driver Experience table use explicit City or Subcity data according to the active role's geographic scope.

**Architecture:** Driver Experience mock records will expose separate `city` and `subcity` values wherever geographic data is displayed. Global roles and Full Build will render/filter by City; roles with a city `dataScope` will render/filter by Subcity, using a shared geography-level helper so pages cannot drift.

**Tech Stack:** React 19, TypeScript, TanStack Table, existing `GenericFilterPopover`, Vite.

## Global Constraints

- Preserve existing role record scoping and action permissions.
- Global roles and Full Build display City.
- City-scoped roles display Subcity.
- Each table exposes only the geographic filter relevant to the active scope.
- Do not create new dashboard widgets or unrelated UI.

---

### Task 1: Shared geography-level convention

**Files:**
- Create: `src/data/driverExperienceGeography.ts`

**Interfaces:**
- Consumes: `RoleDataScope` from `src/data/rolePermissions.ts`.
- Produces: `DriverExperienceGeographyLevel`, `geographyLevelForScope(scope)`, and `geographyLabel(level)`.

- [ ] **Step 1: Add explicit geography helpers**

```ts
export type DriverExperienceGeographyLevel = "city" | "subcity"
export function geographyLevelForScope(scope: RoleDataScope | null): DriverExperienceGeographyLevel
export function geographyLabel(level: DriverExperienceGeographyLevel): "City" | "Subcity"
```

- [ ] **Step 2: Run the TypeScript build**

Run: `npm run build`
Expected: PASS.

### Task 2: Normalize Agent Management geography

**Files:**
- Modify: `src/data/mockAgentPortfolio.ts`
- Modify: `src/data/mockAssignmentHistory.ts`
- Modify: `src/pages/AgentPortfolioPage.tsx`
- Modify: `src/pages/AssignmentHistoryPage.tsx`
- Modify: `src/pages/AgentDetailPage.tsx`

**Interfaces:**
- Consumes: the Task 1 geography helpers.
- Produces: explicit `city` and `subcity` values for agent and assignment records; role-aware columns and filters.

- [ ] **Step 1: Add `subcity` to every agent and derived assignment-history record**

Use real table values such as Ikeja, Lekki, Victoria Island, Wuse, Ring Road, and D-Line while retaining the explicit operational `city` used by Agent Distribution.

- [ ] **Step 2: Replace Agent Portfolio's generic Location/state mapping**

Global views must bind the table and filter to `record.city`; city-scoped views must bind them to `record.subcity`. Build filter options from the already scoped records.

- [ ] **Step 3: Add the same role-aware geography column and filter to Assignment History**

Keep Change Type, Reason, and Changed By filters unchanged.

- [ ] **Step 4: Clarify lifecycle state on Agent Detail**

Rename the visible `State` column/filter label to `Champion Status`; it is not geographic data.

- [ ] **Step 5: Run the TypeScript build**

Run: `npm run build`
Expected: PASS.

### Task 3: Normalize Ticket Management geography

**Files:**
- Modify: `src/data/mockTicketRecords.ts`
- Modify: `src/data/driverExperienceAssignmentScope.ts`
- Modify: `src/pages/TicketManagementPage.tsx`

**Interfaces:**
- Consumes: the Task 1 geography helpers.
- Produces: explicit ticket `city` and `subcity`, scope filtering based on City, and a role-aware table column/filter.

- [ ] **Step 1: Split combined ticket locations into explicit fields**

Keep the existing display `location` available for ticket details, but add `city` and `subcity` for table filtering and role scope.

- [ ] **Step 2: Scope city roles using the explicit ticket City field**

Update `ticketsForSimulationMode` to prefer `ticket.city` and retain `location` only as a backwards-compatible fallback.

- [ ] **Step 3: Add one role-aware geography filter and column**

Global views use City; city-scoped views use Subcity. Preserve role-specific Assignee-filter visibility.

- [ ] **Step 4: Run the TypeScript build**

Run: `npm run build`
Expected: PASS.

### Task 4: Adopt the shared convention on existing Champion and Welfare tables

**Files:**
- Modify: `src/pages/Champion360Page.tsx`
- Modify: `src/pages/WelfarePage.tsx`
- Modify: `docs/ROLE_SIMULATION.md`

**Interfaces:**
- Consumes: the Task 1 geography helpers.
- Produces: one documented, consistent geographic display rule across Driver Experience.

- [ ] **Step 1: Replace page-local scope-to-level logic with the shared helper**

Do not alter Champion or Welfare record visibility.

- [ ] **Step 2: Document all covered tables**

Document Champion Overview, Ticket Management, Welfare Champions Directory, Agents Portfolio, and Assignment History.

- [ ] **Step 3: Verify the complete change**

Run: `git diff --check && npm run build`
Expected: no whitespace errors and a successful production build. Existing repository-wide lint debt is outside this cleanup.

