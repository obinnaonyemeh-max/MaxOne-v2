# Falcon Total Fleet Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the reference Total Fleet card to Falcon Dashboard as a reusable Vehicle Register widget.

**Architecture:** A focused presentational component accepts fleet counts and owns formatting and proportional bar layout. The Falcon widget catalog owns its `vehicle-register` association and the dashboard renderer supplies current mock totals.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vite

## Global Constraints

- Use existing design tokens for card, text, divider, blue, and green colors.
- Preserve all existing battery widget behavior.
- Represent ICE `320,000`, EV `80,000`, and total `400,000`.

---

### Task 1: Reusable Total Fleet card

**Files:**
- Create: `src/pages/falcon-dashboard/TotalFleetWidget.tsx`

**Interfaces:**
- Produces: `TotalFleetWidget({ total, ice, ev, className })`.

- [ ] Add count formatting and zero-safe proportional segment widths.
- [ ] Build the card, divider, striped split bar, and legend using semantic color tokens.

### Task 2: Vehicle Register attachment

**Files:**
- Modify: `src/data/falconDashboardWidgets.ts`
- Modify: `src/pages/FalconDashboardPage.tsx`

**Interfaces:**
- Consumes: widget id `total-fleet` owned by `vehicle-register`.

- [ ] Extend the typed catalog with `total-fleet` ordered before `battery-overview`.
- [ ] Render `TotalFleetWidget` in a four-column dashboard row with the supplied counts.

### Task 3: Verification

**Files:**
- Verify: all modified source files.

**Interfaces:**
- Produces: a clean TypeScript/Vite build and targeted lint result.

- [ ] Run `pnpm build` and expect success.
- [ ] Run targeted ESLint and expect no errors.
- [ ] Run `git diff --check` and inspect the final diff.

