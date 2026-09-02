# Falcon Total Fleet Widget Design

## Goal

Add a reusable Total Fleet widget to the Falcon Dashboard and attach it to the `vehicle-register` module.

## Design

- Match the supplied white rounded card and existing Falcon color tokens.
- Show `Total Fleet` and a formatted total of `400,000`.
- Add a divider followed by a proportional split bar: ICE `320,000` in blue and EVs `80,000` in green.
- Use diagonal highlights inside both bar segments and colored-dot labels underneath.
- Accept total, ICE, and EV quantities as component props so the widget can be reused with live data later.
- Guard percentage calculations when total is zero and format quantities with locale separators.

## Integration

- Register the widget as `total-fleet` with module id `vehicle-register`.
- Render it before the existing `battery-overview` group on `/falcon/dashboard`.
- Do not change the Vehicle Register page or the existing battery widgets.

## Verification

- The widget matches the supplied hierarchy and styling.
- The split bar renders at 80% ICE and 20% EV for the supplied data.
- TypeScript build and targeted ESLint pass.

