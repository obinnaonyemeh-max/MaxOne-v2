# Falcon Battery Widgets Design

## Goal

Move the existing Batteries dashboard content into the main Falcon dashboard shown at `/falcon/dashboard`. Battery metrics remain owned by the Batteries module, while Falcon Dashboard becomes their presentation surface.

## Navigation and routing

- The Falcon Overview → Dashboard item continues to open `/falcon/dashboard`.
- The nested Batteries → Dashboard sidebar item is removed.
- Batteries remains in the Energy section and links directly to `/falcon/batteries/register`.
- `/falcon/batteries/dashboard` redirects to `/falcon/dashboard` so saved links do not break.
- Battery Register and battery detail routes remain unchanged.

## Dashboard architecture

- Add a `FalconDashboardPage` responsible for the Falcon page header and for composing Falcon module widget groups.
- Extract the reusable content from `BatteriesDashboardPage` into a focused `BatteryDashboardWidgets` component.
- Register that component as the widget group owned by the `battery-register` module. This follows the existing rule that widgets belong to leaf modules rather than to roles or dashboard routes.
- Remove the obsolete standalone `BatteriesDashboardPage` after its presentation logic has moved.

## Visual behavior

The blank content area in the supplied Falcon Dashboard screenshot will contain the existing battery dashboard UI without visual redesign:

1. Six battery statistic cards.
2. Average State of Health Distribution and Battery State Distribution charts.
3. The battery locations and alerts map.

The page-level heading becomes `Dashboard` with Falcon-oriented copy. Battery widget titles, data, hover behavior, period selector, colors, and map interactions remain unchanged.

## Data and failure behavior

- Existing mock battery data remains the source for all battery widgets.
- Missing widget registrations should render no widget group rather than failing the page.
- The legacy battery-dashboard URL uses a React Router redirect with history replacement.

## Verification

- `/falcon/dashboard` renders the full battery widget set.
- The Falcon sidebar highlights Overview → Dashboard on that route.
- Energy → Batteries opens Battery Register and no longer contains a Dashboard child.
- `/falcon/batteries/dashboard` redirects to `/falcon/dashboard`.
- `/falcon/batteries/register` and battery detail pages still render.
- Type checking, linting, and production build pass.

