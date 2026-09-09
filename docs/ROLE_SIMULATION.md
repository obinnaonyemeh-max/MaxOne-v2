# Role Simulation

This document is the playbook for simulating roles in MaxOne FleetOps. Follow it when adding or changing a role so nav, actions, list data, and the dashboard stay consistent.

This is **frontend simulation**, not backend RBAC. There is no server-side authorization. Switching the sidebar name card changes what the UI shows. The choice is stored in `localStorage` under `maxone.simulationMode`.

## Table of contents

- [Mental model](#mental-model)
- [Key files](#key-files)
- [Conventions](#conventions)
- [Current roles](#current-roles)
- [Permission catalog](#permission-catalog)
- [Nav item ids](#nav-item-ids)
- [Data scope](#data-scope)
- [Dashboard widgets](#dashboard-widgets)
- [Add a new role](#add-a-new-role)
- [Add a permission key](#add-a-permission-key)
- [Add a city scope](#add-a-city-scope)
- [Add a dashboard widget](#add-a-dashboard-widget)
- [Verify](#verify)
- [Known limitations](#known-limitations)

## Mental model

**Full Build** is the default. App Switcher is on. Every module is visible. Every permission is granted. Data is unscoped (all cities).

A **role** is four things, all defined on `RoleDefinition` in [`src/data/rolePermissions.ts`](../src/data/rolePermissions.ts):

1. **Nav** — `navItemIds`: sidebar item `id`s this role may see (include parent folders).
2. **Actions** — `permissions`: allow-list of `PermissionKey`s. Omit a key to hide the control.
3. **Data scope** — optional `dataScope` (`{ type: "city", city: "Lagos" }`, `{ type: "subCity", ... }`, `{ type: "station", stationIds }`, or `{ type: "country", country: "Nigeria" }`). Omit for unscoped data.
4. **Dashboard** — **not** configured on the role. Fleet Ops widgets are derived from `navItemIds` via `MODULE_WIDGETS` in [`src/data/dashboardWidgets.ts`](../src/data/dashboardWidgets.ts). Falcon widgets for GFM are derived the same way from [`src/data/falconDashboardWidgets.ts`](../src/data/falconDashboardWidgets.ts) via `falconWidgetModuleIdsFromNav`.

```mermaid
flowchart TD
  picker[Sidebar name card picker]
  ctx[RoleSimulationContext]
  nav[Filtered sidebar plus path allowlist]
  actions[useCan omit controls]
  data[useCityScopedRecords / filterByCity / filterByStation]
  dash[widgetsForModules]
  picker --> ctx
  ctx --> nav
  ctx --> actions
  ctx --> data
  ctx --> dash
```

In role mode the App Switcher is hidden. The user stays in whatever `navItemIds` allow. GFM is the exception that merges Fleet Ops and a Falcon subset into one sidebar. Hub Manager is Falcon-only (Energy plus Falcon Dashboard). Swap Operator is Falcon-only Stations & Hubs (no dashboard). Telematics Officer is Falcon-only Monitoring plus Energy (Dashboard home). Deep links to hidden modules redirect to a fallback path (`/dashboard` for most roles; `/refurbishment` for Refurbishment Manager and Refurbishment Officer; `/inventory/list` for Inventory Manager and Inventory Officer; `/falcon/dashboard` for Hub Manager and Telematics Officer; `/falcon/swap-stations` for Swap Operator).

## Key files

| File | Role |
|---|---|
| [`src/data/rolePermissions.ts`](../src/data/rolePermissions.ts) | `SimulationMode`, `RoleDefinition`, permission keys, nav allowlist, path allow/deny |
| [`src/contexts/RoleSimulationContext.tsx`](../src/contexts/RoleSimulationContext.tsx) | Mode persistence, `can()`, `dataScope`, `filterByCity`, `filterByStation`, `useCityScopedRecords`, `useStationScopedRecords` |
| [`src/data/sidebarConfig.ts`](../src/data/sidebarConfig.ts) | Sidebar item `id`s and hrefs |
| [`src/data/cityScope.ts`](../src/data/cityScope.ts) | City matcher, Nigeria country matcher, and Lagos sub-cities |
| [`src/data/dashboardWidgets.ts`](../src/data/dashboardWidgets.ts) | Widget catalog, module mapping, city-scoped numbers and titles |
| [`src/components/max/Sidebar.tsx`](../src/components/max/Sidebar.tsx) | Name-card picker (`SIMULATION_OPTIONS`) |
| [`src/components/max/AppLayout.tsx`](../src/components/max/AppLayout.tsx) | Nav filter, App Switcher visibility, deep-link guard |
| [`src/main.tsx`](../src/main.tsx) | `RoleSimulationProvider` wraps the app |

## Conventions

Follow these on every new role and every new gated action.

- **Hide, do not disable.** Restricted buttons, columns, and routes are omitted. Do not render a greyed-out control.
- **Permissions are allow-list.** `useCan("x")` is true only if `x` is in the role’s `permissions`. Full Build grants `ALL_PERMISSIONS`. A role with an empty `permissions` array is view-only on every gated control.
- **Ungated pages stay fully usable.** If a page has no `useCan` check, any role that can open the module can perform every action on that page. Only add a permission key when you need to restrict someone.
- **Unmentioned modules stay hidden.** If a leaf is not in `navItemIds`, it is not in the sidebar. Include parent ids when children should show (`inbound` for batches, `asset-reassignment` for kit, `maintenance` for service schedule, `disposal-auction` for disposal children).
- **Widgets belong to leaf modules, not roles.** Do not attach widgets to a `RoleDefinition`. If the role has `fleet-register` in `navItemIds`, it gets the Fleet Register widgets. City-scoped roles keep the same catalog; only numbers, subtitles, and “by City” vs “by Sub-City” titles change.
- **City matching is centralized.** Use `isInCityScope` / `isInCountryScope` / `useCityScopedRecords` / `filterByCity`. Do not write `includes("Lagos")` on pages.
- **Country scope is not Lagos city scope.** Do not reuse `filterByCity("Lagos")` for a country role; that hides Ibadan stations and `ogun` chargers. `filterByCity` already branches on `dataScope.type === "country"` via `isInCountryScope`.
- **Station assignment is not city scope.** Do not reuse `filterByCity` for a station-assigned role. Use `filterByStation` / `useStationScopedRecords`. `filterByCity("Lagos")` would show every Lagos station.
- **Ikeja, Lekki, Victoria Island, and Surulere are Lagos sub-cities**, not cities. Dashboard charts for a city-scoped role say “by Sub-City”.
- **Vehicle Master Data (`inbound-stock-setup`) is reference data.** Do not city-filter it.
- **Stat tabs and pagination** must count the filtered set, not the global mocks.
- **Out-of-scope detail URLs** redirect to the module list. Check `filterByCity` on the record’s location or destination.

## Current roles

These are the templates to copy.

| | Full Build | Global Fleet Manager | City Fleet Officer | Fleet Officer | Refurbishment Manager | Refurbishment Officer | Inventory Manager | Inventory Officer |
|---|---|---|---|---|---|---|---|---|
| Picker label | Full Build | Global Fleet Manager | City Fleet Officer | Fleet Officer | Refurbishment Manager | Refurbishment Officer | Inventory Manager | Inventory Officer |
| App Switcher | Yes | No | No | No | No | No | No | No |
| Nav | All apps / modules | Fleet Ops allowlist plus Falcon: Vehicle Tracking, Geofencing, Stations & Hubs, Batteries, EV Chargers (merged sidebar; App Switcher still hidden) | Fleet Ops allowlist only (no Falcon) | Dashboard, Fleet Register, Activation Readiness, Vehicle Document, Kit | Refurbishment, Deactivated Vehicles, Assessment List, Service Schedule, all Disposal & Auction children except Predictive Lab | Same as RM | Inventory List, Movement History, Approvals | Same as IM |
| Data | All cities | All cities | Lagos only | Ikeja only | All cities | Lagos only | All cities | Lagos only |
| Dashboard | All catalog widgets | `fleet-register` + `asset-movement`, plus Falcon widgets from Tracking, Geofencing, Stations, and Batteries | `fleet-register` + `asset-movement`, Lagos numbers (no Falcon widgets) | `fleet-register` only, Ikeja numbers | **Hidden** (fallback `/refurbishment`) | **Hidden** (fallback `/refurbishment`) | **Hidden** (fallback `/inventory/list`) | **Hidden** (fallback `/inventory/list`) |
| Gated Fleet Register | All actions and columns | No Add / Bulk / Edit; hide Contract Risk and Collection % | Same as GFM | Same as GFM | Module hidden | Module hidden | Module hidden | Module hidden |
| Vehicle details Telematics | Yes | Yes | Yes | Hidden | Module hidden | Module hidden | Module hidden | Module hidden |
| Inbound | All mutations | View only | View only | Hidden | Hidden | Hidden | Hidden | Hidden |
| Refurbishment part cost | Yes | Hidden | Hidden | Hidden | **Yes** | Hidden | Module hidden | Module hidden |
| Auction / Closed Assets | Yes | Hidden | Hidden | Hidden | **Yes** | **Yes** (Lagos) | Hidden | Hidden |
| Predictive Lab | Soon item | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden |
| Activation / Documents / Kit | All | View only (kit assign blocked for GFM) | Act on update/upload/kit | Same as CFO | Hidden | Hidden | Hidden | Hidden |
| Falcon | All modules and mutations | View-only Tracking, Geofencing, Stations, Batteries, Chargers. No Dashboard, Enforcement page, or Alerts. Mutations and extra tabs/routes hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden |

Hidden for GFM and City Fleet Officer (not in `navItemIds`): Ownership Transfer, Auction, Closed Assets, Predictive Lab, Control, Inventory, Driver Growth, Driver Experience, and Portfolio. GFM also sees the Falcon subset above in the same sidebar. Deactivated Vehicles and Assessment List are visible to GFM and City Fleet Officer. City Fleet Officer does **not** inherit GFM’s Falcon nav.

Fleet Officer also hides Asset Movement, Inbound, Refurbishment, Maintenance / Service Schedule, and all Disposal & Auction.

Refurbishment Manager and Refurbishment Officer hide Dashboard, Fleet Register, Asset Movement, Inbound, Activation, Vehicle Document, Kit, Ownership Transfer, Inventory, Predictive Lab, Control, and non–Fleet Ops apps.

Inventory Manager sees only Inventory (List, Movement History, Approvals) across all cities. Edit cost price and Accept/Reject are granted. Denied paths fall back to `/inventory/list`.

Inventory Officer has the same nav, Lagos-only lists, Cost Price visible but not editable, and Approvals view-only (no Accept/Reject). Add Parts, Bulk Add Quantities, and adjust +/− stay available. Denied paths fall back to `/inventory/list`.

Hub Manager is a Lagos-scoped Falcon Energy role. Sidebar: Falcon Dashboard, Stations & Hubs, Batteries, EV Chargers. They see all Lagos stations and hubs, transfer batteries from any Lagos station to another Lagos station, and accept/reject incoming transfers to Lagos stations. Create/edit station, set hours, add batteries, and Operators are hidden. Batteries is full access (Telemetry, Movement, Command Center) for Lagos batteries. EV Chargers is view-only (register + info/sessions); Add Chargers and Charge Spots are hidden. Denied paths fall back to `/falcon/dashboard`; charge-spots falls back to the charger detail. GFM and City Fleet Officer are unchanged.

Swap Operator is a **station-assigned** Falcon Energy role (not city-scoped). Assigned station is Lekki Phase 1, resolved by `name` from `mockSwapStations` (not a hardcoded id). Sidebar: Stations & Hubs only (no Falcon Dashboard — a single station-count card is not useful). They see that station only; other station ids redirect to `/falcon/swap-stations`. They can set operating hours and transfer batteries from the assigned station to **any** other station in the catalog, and accept/reject incoming transfers to the assigned station. Battery list is view-only (cards are not clickable). Create, edit pencil, add batteries, Operators, Batteries, EV Chargers, and Dashboard are hidden. Denied paths fall back to `/falcon/swap-stations`. Hub Manager stays Lagos-city and does **not** get `setHours`.

Telematics Officer is a **Nigeria country-scoped** Falcon role (not Hub Manager’s Lagos city scope and not Swap Operator station assignment). Sidebar: Falcon Dashboard, Vehicle Tracking, Enforcement, Alerts (Tamper + Battery Alerts nav), Geofencing, Stations & Hubs, Batteries, EV Chargers. Home and denied fallback: `/falcon/dashboard`. Slideshow stays Full Build only. Tracking, Enforcement, Alerts, Geofencing, Batteries, and EV Chargers (including Add Chargers and Charge Spots) use Full Build actions. Stations & Hubs is view-only: info, battery list (cards stay clickable), and swap history. Hidden on stations: Create, Edit pencil, Set hours, Transfer, Add batteries, Operators, Transfer log. GFM still sees a view-only Transfer log. Hub Manager / Swap Operator / GFM / CFO are unchanged.

Kit assign path `/activation-assignment/asset-reassignment/kit/assign` is denied for **Global Fleet Manager only**. GFM charge-spots and vehicle-stops deep links fall back to the charger detail and vehicle activity pages. Telematics Officer is **not** on those deny lists (Charge Spots and vehicle stops stay available). Denied paths for Refurbishment Manager and Refurbishment Officer fall back to `/refurbishment`.

GFM Falcon is view-only: enforcement history, visit history, Show vehicles, and station/battery/charger info stay. Create/edit/immobilize/transfer/command/add-charger are hidden. Extra surfaces (Falcon Dashboard, Enforcement module, Alerts, charge spots, vehicle stops, station Operators, battery Telemetry / Movement / Command Center) are omitted from nav and denied as routes.

## Permission catalog

Full Build has every key. GFM has telematics only (Falcon mutation keys stay Full Build except Hub Manager’s transfer and battery keys, Swap Operator’s `setHours` + transfer, and Telematics Officer’s tracking / battery / add-charger keys). City Fleet Officer has the six marked below. Fleet Officer has the same five action grants as CFO, without telematics. Refurbishment Manager has part cost only. Refurbishment Officer has no gated keys (part cost hidden). Inventory Manager has `inventory.editCostPrice` and `inventory.approvals.decide`. Inventory Officer has no gated keys (edit price and Accept/Reject hidden). Hub Manager has `falcon.stations.transfer`, `falcon.batteries.tab.telemetry`, `falcon.batteries.tab.movement`, and `falcon.batteries.command`. Swap Operator has `falcon.stations.setHours` and `falcon.stations.transfer`. Telematics Officer has `falcon.enforcement.apply`, `falcon.vehicle.immobilize`, `falcon.vehicle.shareLiveLocation`, `falcon.batteries.tab.telemetry`, `falcon.batteries.tab.movement`, `falcon.batteries.command`, and `falcon.chargers.add` — no `falcon.stations.*`. Charge Spots is a path allow, not a permission key.

| Key | Where it is used | Full Build | GFM | CFO | FO | RM | RO | IM | IO |
|---|---|---|---|---|---|---|---|---|---|
| `fleetRegister.addVehicles` | [`VehiclesPage.tsx`](../src/pages/VehiclesPage.tsx) — Add Vehicles | Yes | — | — | — | — | — | — | — |
| `fleetRegister.bulkUpdate` | [`VehiclesPage.tsx`](../src/pages/VehiclesPage.tsx) — Bulk Update | Yes | — | — | — | — | — | — | — |
| `fleetRegister.editVehicle` | [`VehicleDetailsPage.tsx`](../src/pages/VehicleDetailsPage.tsx) — Edit Vehicle Info | Yes | — | — | — | — | — | — | — |
| `fleetRegister.column.contractRisk` | [`VehiclesPage.tsx`](../src/pages/VehiclesPage.tsx) — column | Yes | — | — | — | — | — | — | — |
| `fleetRegister.column.collectionPercent` | [`VehiclesPage.tsx`](../src/pages/VehiclesPage.tsx) — column | Yes | — | — | — | — | — | — | — |
| `inbound.batches.create` | [`BatchesPage.tsx`](../src/pages/BatchesPage.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.batches.addIdentifier` | [`VehicleIdsTab.tsx`](../src/pages/batch-details/VehicleIdsTab.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.batches.editIdentifier` | [`VehicleIdsTab.tsx`](../src/pages/batch-details/VehicleIdsTab.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.batches.uploadCsv` | [`VehicleIdsTab.tsx`](../src/pages/batch-details/VehicleIdsTab.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.batches.uploadDocuments` | [`DocumentsTab.tsx`](../src/pages/batch-details/DocumentsTab.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.batches.moveSubBatchStage` | [`SubBatchDetailsPage.tsx`](../src/pages/SubBatchDetailsPage.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.stockSetup.add` | [`StockSetupPage.tsx`](../src/pages/StockSetupPage.tsx) | Yes | — | — | — | — | — | — | — |
| `inbound.stockSetup.edit` | [`StockSetupPage.tsx`](../src/pages/StockSetupPage.tsx) | Yes | — | — | — | — | — | — | — |
| `activationReadiness.update` | [`ActivationReadinessPage.tsx`](../src/pages/ActivationReadinessPage.tsx) | Yes | — | Yes | Yes | — | — | — | — |
| `activationReadiness.bulkUpload` | [`ActivationReadinessPage.tsx`](../src/pages/ActivationReadinessPage.tsx) | Yes | — | Yes | Yes | — | — | — | — |
| `vehicleDocument.upload` | [`VehicleDocumentsPage.tsx`](../src/pages/VehicleDocumentsPage.tsx) | Yes | — | Yes | Yes | — | — | — | — |
| `vehicleDocument.replace` | [`VehicleDocumentsPage.tsx`](../src/pages/VehicleDocumentsPage.tsx) | Yes | — | Yes | Yes | — | — | — | — |
| `kit.reassignment` | [`KitReportsPage.tsx`](../src/pages/KitReportsPage.tsx) | Yes | — | Yes | Yes | — | — | — | — |
| `refurbishment.column.partCost` | [`RefurbishmentPage.tsx`](../src/pages/RefurbishmentPage.tsx) — work order parts Cost column | Yes | — | — | — | Yes | — | — | — |
| `vehicleDetails.tab.telematics` | [`VehicleDetailsPage.tsx`](../src/pages/VehicleDetailsPage.tsx) — Telematics tab | Yes | Yes | Yes | — | — | — | — | — |
| `championProfile.reassign` | [`ChampionDetailPage.tsx`](../src/pages/ChampionDetailPage.tsx) — Reassign Champion | Yes | — | — | — | — | — | — | — |
| `ticketManagement.create` | [`TicketManagementPage.tsx`](../src/pages/TicketManagementPage.tsx) — Create Ticket | Yes | — | — | — | — | — | — | — |
| `ticketManagement.reassign` | [`TicketDetailSheet.tsx`](../src/components/max/TicketDetailSheet.tsx) — Reassign Ticket | Yes | — | — | — | — | — | — | — |
| `ticketManagement.changeStatus` | [`TicketDetailSheet.tsx`](../src/components/max/TicketDetailSheet.tsx) — Change Status | Yes | — | — | — | — | — | — | — |
| `ticketManagement.escalate` | [`TicketDetailSheet.tsx`](../src/components/max/TicketDetailSheet.tsx) — Escalate | Yes | — | — | — | — | — | — | — |
| `ticketManagement.close` | [`TicketDetailSheet.tsx`](../src/components/max/TicketDetailSheet.tsx) — Close Ticket | Yes | — | — | — | — | — | — | — |
| `ticketManagement.addComment` | [`TicketDetailSheet.tsx`](../src/components/max/TicketDetailSheet.tsx) — Add Comment | Yes | — | — | — | — | — | — | — |
| `inventory.editCostPrice` | [`InventoryListPage.tsx`](../src/pages/InventoryListPage.tsx) — Edit cost price pencil | Yes | — | — | — | — | — | Yes | — |
| `inventory.approvals.decide` | [`InventoryApprovalsPage.tsx`](../src/pages/InventoryApprovalsPage.tsx) — Accept / Reject | Yes | — | — | — | — | — | Yes | — |
| `falcon.enforcement.apply` | [`VehicleListCard.tsx`](../src/pages/vehicle-register/VehicleListCard.tsx) — Enforcement actions | Yes | — | — | — | — | — | — | — |
| `falcon.vehicle.immobilize` | [`ImmobilizationCard.tsx`](../src/pages/vehicle-activity/ImmobilizationCard.tsx) — Immobilise / diagnostics | Yes | — | — | — | — | — | — | — |
| `falcon.vehicle.shareLiveLocation` | [`LiveTrackingMap.tsx`](../src/pages/vehicle-activity/LiveTrackingMap.tsx) — Share live location | Yes | — | — | — | — | — | — | — |
| `falcon.stations.create` | [`StationsHubsPage.tsx`](../src/pages/stations-hubs/StationsHubsPage.tsx) — Create station | Yes | — | — | — | — | — | — | — |
| `falcon.stations.edit` | [`StationDetailsPage.tsx`](../src/pages/stations-hubs/StationDetailsPage.tsx) — Edit pencil | Yes | — | — | — | — | — | — | — |
| `falcon.stations.setHours` | [`StationDetailsPage.tsx`](../src/pages/stations-hubs/StationDetailsPage.tsx) — Set operating hours | Yes | — | — | — | — | — | — | — |
| `falcon.stations.addBatteries` | [`StationBatteryListTab.tsx`](../src/pages/stations-hubs/StationBatteryListTab.tsx) — Add batteries | Yes | — | — | — | — | — | — | — |
| `falcon.stations.transfer` | [`TransferLogTab.tsx`](../src/pages/stations-hubs/TransferLogTab.tsx) — Transfer / Accept / Reject | Yes | — | — | — | — | — | — | — |
| `falcon.stations.manageOperators` | [`StationDetailsPage.tsx`](../src/pages/stations-hubs/StationDetailsPage.tsx) — Operators tab | Yes | — | — | — | — | — | — | — |
| `falcon.batteries.tab.telemetry` | [`BatteryDetailsPage.tsx`](../src/pages/battery-register/BatteryDetailsPage.tsx) — Telemetry tab | Yes | — | — | — | — | — | — | — |
| `falcon.batteries.tab.movement` | [`BatteryDetailsPage.tsx`](../src/pages/battery-register/BatteryDetailsPage.tsx) — Movement History tab | Yes | — | — | — | — | — | — | — |
| `falcon.batteries.command` | [`BatteryDetailsPage.tsx`](../src/pages/battery-register/BatteryDetailsPage.tsx) — Command Center tab | Yes | — | — | — | — | — | — | — |
| `falcon.chargers.add` | [`ChargerRegisterPage.tsx`](../src/pages/charger-register/ChargerRegisterPage.tsx) — Add Chargers | Yes | — | — | — | — | — | — | — |

Call Centre Agent receives `ticketManagement.create`, `ticketManagement.changeStatus`, `ticketManagement.close`, and `ticketManagement.addComment`. Reassign and Escalate remain hidden.

When you add a key, add it to the `PermissionKey` union **and** `ALL_PERMISSIONS`. Then grant it only on the roles that should have it.

## Nav item ids

Filter the sidebar by item **`id`**, not by label. Source of truth: [`src/data/sidebarConfig.ts`](../src/data/sidebarConfig.ts).

Fleet Ops ids used by City Fleet Officer (and as the Fleet Ops half of GFM):

```
dashboard
fleet-register
asset-movement
inbound
inbound-batches
inbound-stock-setup
activation-readiness
vehicle-document
deactivated-vehicles
assessment-list
refurbishment
maintenance
service-schedule
disposal-auction
disposal-management
conversion-request
scrap-management
asset-reassignment
asset-reassignment-kit
```

Falcon ids used by GFM only (`FALCON_GFM_NAV_ITEM_IDS`). GFM concatenates filtered Fleet Ops sections with filtered Falcon sections (Monitoring + Energy). App Switcher stays hidden.

```
vehicle-register
geofencing
stations-hubs
batteries
ev-chargers
```

Not granted to GFM: `falcon-dashboard`, `enforcement`, `alerts`, `tamper-alerts`, `battery-alerts`.

Hub Manager Falcon ids (`FALCON_HUB_MANAGER_NAV_ITEM_IDS`). Sidebar source is `falconSidebarSections` only:

```
falcon-dashboard
stations-hubs
batteries
ev-chargers
```

Swap Operator Falcon ids (`FALCON_SWAP_OPERATOR_NAV_ITEM_IDS`). Same Falcon-only sidebar source:

```
stations-hubs
```

Telematics Officer Falcon ids (`FALCON_TELEMATICS_OFFICER_NAV_ITEM_IDS`). Same Falcon-only sidebar source:

```
falcon-dashboard
vehicle-register
enforcement
alerts
tamper-alerts
battery-alerts
geofencing
stations-hubs
batteries
ev-chargers
```

Path prefixes: `/falcon/dashboard`, `/falcon/vehicle-register`, `/falcon/enforcement`, `/falcon/alerts`, `/falcon/geofences`, `/falcon/swap-stations`, `/falcon/batteries`, `/falcon/ev-chargers`. Battery Alerts has no page today (same as Full Build); do not build a new module.

Fleet Officer ids:

```
dashboard
fleet-register
activation-readiness
vehicle-document
asset-reassignment
asset-reassignment-kit
```

Refurbishment Manager / Refurbishment Officer ids:

```
refurbishment
deactivated-vehicles
assessment-list
maintenance
service-schedule
disposal-auction
disposal-management
conversion-request
auction
scrap-management
closed-assets
```

Inventory Manager / Inventory Officer ids:

```
inventory
inventory-list
inventory-movement-history
inventory-approvals
```

Parents with no href (`inbound`, `inventory`, `maintenance`, `disposal-auction`, `asset-reassignment`) are containers. Include them if any child is allowed. If every child is dropped, the parent is dropped too.

Driver Growth dashboard widgets use leaf id `activation-dashboard` (not in the Fleet Ops list above).

## Data scope

Optional on the role:

```ts
dataScope: { type: "city", city: "Lagos" }
// or
dataScope: { type: "subCity", city: "Lagos", subCity: "Ikeja" }
// or
dataScope: { type: "station", stationIds: getStationIdsByName("Lekki Phase 1") }
// or
dataScope: { type: "country", country: "Nigeria" }
```

`dataScope` is `null` for Full Build, GFM, Refurbishment Manager, and Inventory Manager. City Fleet Officer, Refurbishment Officer, Inventory Officer, and Hub Manager use Lagos. Fleet Officer uses Ikeja. Swap Operator uses station assignment (Lekki Phase 1). Telematics Officer uses country Nigeria. When set:

- `useCityScopedRecords(records, "location")` (or `"destination"` for batches) filters lists for city / sub-city / country scope.
- `filterByCity(value)` returns `true` when unscoped or station-scoped; city scope uses `isInCityScope`; sub-city scope uses `resolveLagosSubCity(value) === subCity`; country scope uses `isInCountryScope`.
- `filterByStation(id)` returns `true` when unscoped or not station-scoped; station scope requires the id in `dataScope.stationIds`.
- `useStationScopedRecords(records, "id")` filters station lists for station-assigned roles.
- Dashboard stats, distribution, and bar charts are derived from the scoped `mockVehicles` for city / sub-city roles.
- Dashboard subtitle names the city or sub-city.

Lagos matcher tokens live in [`src/data/cityScope.ts`](../src/data/cityScope.ts). Treat a string as Lagos if it matches any of: `Lagos`, `Lagos Hub`, `Lagos, Nigeria`, `Nigeria / Lagos`, `Ikeja`, `Ikeja Yard`, `Lekki`, `Victoria Island`, `Surulere`, `Surulere Yard`, `Yaba`, `Gbagada`.

Nigeria country tokens include Lagos tokens, all Falcon `CITIES` (Lagos, Sagamu, Ibadan, Abeokuta, Sango Ota, Osogbo, Akure), plus `ogun`, `osun`, `ondo`, `nigeria`, `abuja`, `fct`, `port harcourt`, `kano`, `enugu`, `aba`, `abia`, and `rivers`. That keeps Ibadan stations and the `ogun` charger visible for Telematics Officer while Hub Manager stays Lagos-only.

Exclude Accra, Abuja, Kano, Port Harcourt, Ibadan yards (Eleyele, Bodija, Gbagba), Kenya cities, and similar **from Lagos city scope**. Those Nigeria cities stay in country scope.

`resolveLagosSubCity` maps a location onto the four dashboard sub-cities: Ikeja, Lekki, Victoria Island, Surulere. Generic `"Lagos"` does **not** match a sub-city officer — mock rows for those lists must use a neighborhood name.

### Modules that filter by city

| Module | Field | Notes |
|---|---|---|
| Fleet Register / Vehicle Details | `location` | Out-of-city `/fleet-register/:id` redirects to the list |
| Asset Movement tabs | `location` | Stats recomputed from scoped rows |
| Batches | `destination` | Sub-batches inherit the parent batch |
| Activation Readiness | `location` | |
| Vehicle Documents | `location` | Stats use the scoped set when `dataScope` is set |
| Refurbishment / Service Schedule | `location` | |
| Deactivated Vehicles | `location` | Visible to Full Build, GFM, City Fleet Officer, Refurbishment Manager, and Refurbishment Officer. Assign QA is ungated. Osogbo Hub rows have no QA staff so the empty-assignment path is visible in Full Build / GFM / Refurbishment Manager |
| Assessment List | `location` | Visible to Full Build, GFM, City Fleet Officer, Refurbishment Manager, and Refurbishment Officer. Work order is view-only. Assigned vehicles move here from Deactivated Vehicles |
| Inventory List / Movement History / Approvals | `location` | Visible to Full Build and Inventory Manager (unscoped) and Inventory Officer (Lagos). Available quantity = on-hand minus awaiting pickup. Awaiting pickup is display-only. Add Parts, Bulk Add Quantities, and adjust +/− stay ungated. Edit cost price and Accept/Reject require `inventory.editCostPrice` / `inventory.approvals.decide` (Full Build and Inventory Manager). Add Part location dropdown is limited to in-scope hubs when `dataScope` is set |
| Kit | `location` | |
| Disposal / Conversion / Scrap | `location` | Keep a majority of mock rows in-scope so the module is not empty |
| Auction | `location` | Events, create-auction vehicles, and detail redirects. Location dropdown limited to in-scope depots when `dataScope` is set |
| Closed Assets | `location` | Out-of-city `/closed-assets/:id` redirects to the list |
| Vehicle Master Data | — | **Do not filter** |
| Stations & Hubs | `city` or station `id` | Hub Manager sees Lagos stations and hubs; transfer destinations stay Lagos-only. Swap Operator sees Lekki Phase 1 only (`filterByStation`); other `/falcon/swap-stations/:id` redirect to the list. Swap Operator transfer destinations are **any** other station. Accept/Reject only when the destination is in-scope (assigned station for Swap Operator). Battery list cards are not clickable for roles without `/falcon/batteries`. Telematics Officer sees all Nigeria stations and hubs; Create/Edit/Hours/Transfer/Add batteries/Operators/Transfer log are hidden. Transfer log stays visible for Full Build (`canTransfer`) and GFM (view-only) |
| Batteries | `currentStation` via `getBatteryCityScopeValue` | Hub Manager sees Lagos batteries (station name → `SwapStation.city`, else Lagos tokens). Telematics Officer sees Nigeria-scoped batteries with Telemetry, Movement, and Command Center. Out-of-scope `/falcon/batteries/:id` redirects to the register |
| EV Chargers | `stateDeployed` | Hub Manager sees Lagos chargers (`lagos` token); Add Chargers and Charge Spots stay hidden. Telematics Officer sees Nigeria chargers including `ogun`, plus Add Chargers and Charge Spots (`isPathAllowedForMode` on that charger’s charge-spots path — not `isFullBuild`). GFM stays denied Charge Spots. Out-of-scope `/falcon/ev-chargers/:id` redirects to the register |
| Vehicle Tracking | `city` | Telematics Officer lists and tab counts use the scoped set. Out-of-country activity / trips / stops ids redirect to `/falcon/vehicle-register`. Vehicle stops stay allowed (do not add this mode to GFM’s stops deny) |
| Geofencing | `area` | Country/city filter on the geofence `area` field. Visit history has no area field and is not filtered |
| Tamper Alerts | `parameters.city` | Filter only the city token, not free-text `location` / lat-long. Out-of-scope detail ids redirect to `/falcon/alerts/tamper` |

Give new mock rows a location/destination the matcher understands. If a city-scoped role would otherwise see zero rows, relabel a majority of the mocks into that city. For a sub-city role, relabel **all** in-scope city-level rows to that sub-city (Fleet Officer: all former Lagos activation / document / kit rows are Ikeja).

## Dashboard widgets

Widgets are published by **leaf module id** in `MODULE_WIDGETS`:

| Module id | Widgets |
|---|---|
| `fleet-register` | Total Fleet, Exit, Active, Inbound, Operational Fleet, Fleet Distribution, Active Fleet by City |
| `asset-movement` | 3PL Check-in, Yard Check-in, Check-in Fleet by City |
| `activation-dashboard` | Activation Queue |
| `champion-360` | Total Champions, Active Champions, Inactive Champions, Champions by City |
| `ticket-management` | Open Tickets, SLA Breached, Resolved Tickets, Ticket Status Breakdown, Tickets by Category |
| `vehicle-register` | Falcon: Total Fleet, CO₂, Distance, ICE & EV Activity, Trips, Geographical Distribution, Vehicle Tracking, Total Swaps |
| `geofencing` | Falcon: Total Geofence Locations |
| `stations-hubs` | Falcon: Total Swap Stations |
| `batteries` | Falcon: Battery Overview, Average SOC, Battery Alert Summary (catalog module id `battery-register`) |

Falcon widgets live in [`src/data/falconDashboardWidgets.ts`](../src/data/falconDashboardWidgets.ts). GFM’s Fleet Ops `/dashboard` appends them from `navItemIds` via `falconWidgetModuleIdsFromNav`. Hub Manager’s home is `/falcon/dashboard` with Stations + Batteries widgets (`allowedModuleIds` from nav). Telematics Officer’s home is `/falcon/dashboard` with Tracking + Geofencing + Stations + Batteries widgets from nav (EV Chargers still publish none). Swap Operator has no dashboard module; home and denied paths are `/falcon/swap-stations`. Total Swap Stations uses `filterByCity` for non-station scope (Nigeria count for Telematics Officer; Lagos for Hub Manager) and assigned ids when `dataScope.type === "station"`. Battery widget numbers stay catalog mocks. Slideshow is Full Build only. Full Build still sees the full Falcon catalog on `/falcon/dashboard`. EV Chargers publish no widgets. CFO has no Falcon nav, so no Falcon widgets.

Driver Experience widgets use `DRIVER_EXPERIENCE_MODULE_WIDGETS` in the same file. Call Centre Agent receives the combined widget sets for `champion-360` and `ticket-management`; unrelated Driver Experience widgets stay hidden.

Driver Experience role data is scoped in [`src/data/driverExperienceAssignmentScope.ts`](../src/data/driverExperienceAssignmentScope.ts). Call Centre Agent Fatima Bello is globally assigned and sees every Champion and ticket in the system. Welfare Agent Chidi Okafor sees only Champions and tickets both assigned to her and located in Lagos. Field Ops Manager and Welfare Manager see every Champion and ticket in Lagos regardless of assignment. Champion lists, Champion details, ticket lists, ticket creation, welfare records, Approvals (ownership transfers and time-off), and dashboard metrics must use the centralized scope helpers and live store snapshots rather than reading the global seed arrays directly. Ticket-performance widgets (totals, false-resolution rate, resolver and category charts) are computed from the scoped ticket snapshot. The Champion Overview pending-approvals banner counts scoped pending transfers and time-off, not the unfiltered seed.

Driver Experience tables expose one geographic level at a time. In Champion Overview, Ticket Management, the Welfare Champions Directory, Agents Portfolio, and Agent Assignment History, global roles and Full Build show a City column and City filter; city-scoped roles show a Subcity column and Subcity filter populated only from their scoped records. Do not show both geographic filters or use the generic “Location” label on these tables. On an Agent Portfolio detail, the Champion Status field is a lifecycle status and must not be labeled as a geographic State.

Across every Driver Experience dashboard mode, Ticket Status Breakdown and Tickets by Category must render side by side in the same two-column row. Do not separate or stack these two charts.

Champions by City and Ticket Aging (SLA) by Agent must render side by side whenever the role can see Ticket Aging. For roles where Ticket Aging is hidden, Champions by City remains full-width. Call Centre Agent is globally scoped and uses Champions by City. Welfare Agent uses Champions by Subcity for its assigned Lagos portfolio.

Reopen Rate by Ticket Category is Full Build-only and must not appear in any simulated role. Full Build renders every available Driver Experience dashboard widget, including both Champions by City and Champions by Subcity; Champions by City remains paired with Ticket Aging.

Welfare Agent dashboard shows exactly: Total Champions, Active Champions, Inactive Champions, Open Tickets, SLA Breached, Resolved Tickets, Ticket Status Breakdown, Tickets by Category, Welfare Follow-Ups Overdue, Welfare Cases, and Champions by Subcity. No other dashboard widgets are visible in this mode.

Welfare Agent uses the Driver Experience sidebar source with `overview-dashboard`, `champion-360`, `ticket-management`, and `welfare`. Its fallback route is `/driver-experience/dashboard`.

Field Ops Manager uses the Driver Experience sidebar source with only `overview-dashboard`, `champion-360`, and `ticket-management`. Its fallback route is `/driver-experience/dashboard`.

In Ticket Management, Field Ops Manager can Reassign Ticket, Change Status, Escalate, Close Ticket, and Add Comment. Create Ticket is hidden, and direct access to `/ticket-management/create` redirects to `/ticket-management`.

Field Ops Manager dashboard shows exactly: Total Champions, Active Champions, Inactive Champions, Open Tickets, SLA Breached, Resolved Tickets, Ticket Status Breakdown, Tickets by Category, Ticket Aging (SLA) by Agent, and Champions by Subcity. Champions by Subcity and Ticket Aging remain on the same row. These reuse existing widgets; no new dashboard widget is created.

Welfare Manager mirrors Full Build across Driver Experience: Dashboard, Champion Overview, Ticket Management, Welfare, Approvals, Agent Portfolio, and Assignment History, with every action permission granted. Drivers Safety Performance and `/driver-safety-score` are excluded. Its data is scoped to Lagos, and the dashboard uses Champions by Subcity. The Welfare Manager dashboard otherwise mirrors Full Build while omitting Avg Safety Score, High Risk Drivers, Driver Risk Distribution, and the Full Build-only Reopen Rate by Ticket Category.

Executive uses the Driver Experience dashboard and can view Champion Overview, Ticket Management, Welfare, and Approvals. All operational actions are unavailable. Agent Management and Drivers Safety Performance are hidden, their routes are denied, and the Executive fallback route is `/driver-experience/dashboard`.

Executive dashboard includes the False Resolution Rate summary card and False Resolution Rate by Resolver. The resolution widgets reuse the Full Build data and presentation. Agent Distribution and Agent Workload are excluded with Agent Management.

On Champion Overview, Executive can view every Champion profile tab except role-restricted information such as Other Info. The profile is read-only: Reassign Champion and Create Time Off are unavailable.

The Champion Biodata Other Info section—Blood Group, Genotype, Champion Date of Birth, Next of Kin, and Next of Kin Phone—is visible only to Welfare Agent, Welfare Manager, and DXP Product Manager. It is hidden for every other simulation mode, including Full Build.

DXP Product Manager has the complete Driver Experience surface except Drivers Safety Performance. Dashboard, Champion Overview, Ticket Management, Welfare, Approvals, and Agent Management are visible, including Agents Portfolio and Assignment History. Safety-related dashboard cards and charts are excluded. Ticket Management retains all actions, while Approvals is view-only with Approve and Reject unavailable. The pending-approvals banner is hidden from Champion Overview. Every Champion profile tab is visible, but Reassign Champion and Create Time Off are unavailable. Agents Portfolio is view-only for reassignment: selection checkboxes and the Reassign action are hidden. On Welfare, the summary cards and Follow-up Queue are hidden; the Champions Directory remains viewable, while Call Champion, Schedule, and Log Note are unavailable.

Operations Manager can access Dashboard, Champion Overview, Ticket Management, and Agent Management, including Agents Portfolio and Assignment History. Approvals, Welfare, and Drivers Safety Performance are hidden and their routes are denied. On a Champion profile, Wallet, Guarantors, and the entire Time-Off section are hidden; Leave History, Create Time Off, and Reassign Champion are unavailable. The role retains full Ticket Management and Agent Management actions.

Operations Manager dashboard includes the existing Ticket Aging (SLA) by Agent widget paired with Champions by City, plus the False Resolution Rate summary card and False Resolution Rate by Resolver widget.

Agent Management publishes exactly two dashboard widgets for roles with Agent Management access and Full Build: Agent Distribution, a donut chart counting agents by operational city; and Agent Workload, a stacked horizontal bar chart showing the top eight agents by assigned Champions with Active, At Risk, Delinquent, and Inactive segments. Agent Distribution must always use each agent's explicit city value rather than state. Agent Workload has one View All action in its top-right corner linking to `/driver-experience/agents/portfolio`.

On Champion details, Field Ops Manager has read-only access to Biodata, Contracts, Asset (including Assignment History and Movement Log), FieldOps History, Guarantors, Tickets, and HMO Details. Wallet, Welfare Notes, and Time-Off are hidden. The role cannot reassign a Champion or perform other Champion actions.

FieldOps History reuses the Fleet Registry status-timeline presentation and provides a maintenance-event dropdown so only one Maintenance record is visible at a time. August event `FO-0841` displays its complete finished breakdown from Awaiting Supply through Completed, with a time range and `5 hrs` for every stage. September event `FO-0972` advances every five seconds through the same stages. Its current stage shows `Current (Ongoing)`; its completed stages show their time range and `5 hrs`.

In Ticket Management, Welfare Agent can Create Ticket, Change Status, Escalate, Close Ticket, and Add Comment. Reassign Ticket remains hidden because `ticketManagement.reassign` is not granted.

On Champion details, Welfare Agent can view Biodata, Contracts, Asset (including Assignment History and Movement Log), Wallet, FieldOps History, Guarantors, Tickets, Welfare Notes, HMO Details, and Time-Off (including Leave History and Create Time Off). Reassign Champion remains hidden because `championProfile.reassign` is not granted.

Champion Profile reassignment uses `ReassignChampionsModal` in single-selection mode: exactly one target agent may be selected and bulk controls such as Select All are hidden. Agent Management keeps the modal's multiple-selection mode for bulk Champion reassignment. This applies anywhere Champion Profile reassignment is permitted, including Full Build and Welfare Manager.

Within the Welfare section, Welfare Agent sees and can use everything available to Full Build. The records remain scoped to Champions assigned to that Welfare Agent.

The Schedule action in the Welfare Champion detail sheet opens the shared `Modal` with the shared `DatePickerField`. Confirming a date updates that Champion's `nextFollowUp` in page state and immediately moves the Champion into the matching Overdue, Due Today, or Upcoming follow-up queue.

A role that has `fleet-register` and `asset-movement` (and not `activation-dashboard`) gets the GFM dashboard: no Activation Queue; the two city charts sit in a two-column grid. GFM also appends Falcon widgets from Tracking, Geofencing, Stations, and Batteries. CFO has the same Fleet Ops widgets without Falcon.

Fleet Officer has only `fleet-register`, so 3PL/Yard stats and Check-in by City are omitted.

Refurbishment Manager and Refurbishment Officer have no dashboard module, so the Overview Dashboard is hidden and denied paths fall back to `/refurbishment`. Inventory Manager and Inventory Officer have no dashboard module; denied paths fall back to `/inventory/list`.

City-scoped data (`getDashboardWidgetData`):

- Stat cards: counts and % of the scoped fleet, not the hardcoded global 32,400.
- Fleet Distribution: sub-cities, not Global / Nigeria / Ghana / Cameroon. A sub-city role gets a single chart for that sub-city.
- Active / Check-in charts: sub-cities, not other countries. Titles become **Active Fleet by Sub-City** and **Check-in Fleet by Sub-City** via `widgetDisplayTitle`.

Full Build and GFM keep the global widget numbers. Hub Manager’s Total Swap Stations card counts Lagos stations. Telematics Officer’s Total Swap Stations card counts Nigeria (all mock Falcon cities). Swap Operator does not have a Falcon dashboard.

## Add a new role

Do this in order. Skipping the path allowlist is the usual miss.

### 1. Spec the role

Write down, before code:

- Picker label
- Sidebar leaf ids (and required parents)
- Granted `PermissionKey`s (everything else gated stays hidden)
- `dataScope` or none
- Extra denied routes (action pages under an allowed prefix)

Unmentioned modules stay hidden. Ungated pages in allowed modules stay fully usable.

### 2. Register the role

In [`src/data/rolePermissions.ts`](../src/data/rolePermissions.ts):

- Add the id to `SimulationMode`.
- Add a `RoleDefinition` constant (`navItemIds`, `permissions`, optional `dataScope`).
- Return it from `getRoleDefinition`.
- Append it to `SIMULATION_OPTIONS` (picker order).

In [`src/contexts/RoleSimulationContext.tsx`](../src/contexts/RoleSimulationContext.tsx):

- Accept the new id in `readStoredMode()`.
- Falcon-only roles (Hub Manager, Swap Operator, Telematics Officer) use `falconSidebarSections`.

Reuse another role’s `navItemIds` when the spec says “same nav as X”.

### 3. Path allowlist

`getAllowedPathPrefixes` is **hardcoded** and **branches by mode**. It is not derived from `navItemIds`. City Fleet Officer uses `FLEET_OPS_PATH_PREFIXES` (includes `/deactivated-vehicles` and `/assessment-list`). GFM uses that list plus `/falcon/vehicle-register`, `/falcon/geofences`, `/falcon/swap-stations`, `/falcon/batteries`, `/falcon/ev-chargers` — not a blanket `/falcon`. Hub Manager: `/falcon/dashboard`, `/falcon/swap-stations`, `/falcon/batteries`, `/falcon/ev-chargers`. Swap Operator: `/falcon/swap-stations`. Telematics Officer: `/falcon/dashboard`, `/falcon/vehicle-register`, `/falcon/enforcement`, `/falcon/alerts`, `/falcon/geofences`, `/falcon/swap-stations`, `/falcon/batteries`, `/falcon/ev-chargers`. Fleet Officer has a shorter list (`/dashboard`, `/fleet-register`, `/activation/readiness`, `/vehicle-document`, kit). Refurbishment Manager and Refurbishment Officer share: `/refurbishment`, `/deactivated-vehicles`, `/assessment-list`, `/service-schedule`, `/disposal-management`, `/conversion-request`, `/auction`, `/scrap-management`, `/closed-assets`. Inventory Manager and Inventory Officer: `/inventory`. Add every list href **and** every detail route under those modules.

If an action lives under an allowed prefix but the role must not open it, add it to `getDeniedPathPrefixes` for that mode (or a suffix check in `isPathAllowedForMode` when the id is dynamic) and map a sensible fallback in `getFallbackPathForDenied` (GFM kit assign → kit list; GFM/Hub Manager charge-spots → charger detail; GFM stops → vehicle activity; Refurbishment Manager / Officer denied paths → `/refurbishment`; Inventory Manager / Officer → `/inventory/list`; Hub Manager and Telematics Officer → `/falcon/dashboard`; Swap Operator → `/falcon/swap-stations`).

[`AppLayout.tsx`](../src/components/max/AppLayout.tsx) redirects any disallowed pathname.

### 4. Gate new actions (only if needed)

See [Add a permission key](#add-a-permission-key). Do not grant new keys to existing roles unless the spec says so.

### 5. Scope data (only if the role is city-bound)

See [Add a city scope](#add-a-city-scope).

### 6. Dashboard

Usually nothing: widgets follow `navItemIds`. Only add catalog entries if a **new module** should publish widgets. City-scoped numbers and “Sub-City” titles already follow `dataScope`.

## Add a permission key

1. Add the key to the `PermissionKey` union and to `ALL_PERMISSIONS`.
2. Grant it on the roles that may perform the action. Leave it off GFM / CFO unless the spec grants it.
3. On the page, `useCan("the.key")` and **omit** the button, column, or flow. Example:

```tsx
const canEditVehicle = useCan("fleetRegister.editVehicle")

{canEditVehicle && (
  <Button>Edit Vehicle Info</Button>
)}
```

4. If the action is a dedicated route, also deny it in `getDeniedPathPrefixes` for roles that must not deep-link there.

## Add a city scope

Today only `CityId = "Lagos"` and `CountryId = "Nigeria"` exist. Station assignment (`{ type: "station", stationIds }`) is a separate scope — do not implement it with `filterByCity`. Country scope uses `isInCountryScope` / the `country` branch of `filterByCity`. Do not reuse Lagos city tokens for a country role.

1. Extend `CityId` and `CITY_TOKENS` in [`src/data/cityScope.ts`](../src/data/cityScope.ts). List every mock spelling (hub, yard, `Country / City`, neighborhood).
2. If the dashboard should break that city into neighborhoods, add a resolver like `resolveLagosSubCity` and wire `getDashboardWidgetData` / `widgetDisplayTitle`. For a single-neighborhood role, use `{ type: "subCity", city, subCity }`.
3. Relabel mock data so a majority of rows in each filtered module match the tokens. Empty modules are a spec bug.
4. Filter list pages with `useCityScopedRecords`. Redirect out-of-city details with `filterByCity`. Recompute tab counts and pagination from the scoped set.
5. Do not filter Vehicle Master Data.

## Add a dashboard widget

1. Add the widget to `WIDGET_CATALOG` in [`src/data/dashboardWidgets.ts`](../src/data/dashboardWidgets.ts).
2. Append its id to `MODULE_WIDGETS` under the **leaf module** that owns it (`fleet-register`, `asset-movement`, `activation-dashboard`, or a new leaf id that also appears in some role’s `navItemIds`).
3. Provide global numbers in `STAT_WIDGET_DATA` / `BAR_CHART_WIDGET_DATA` (or equivalent).
4. If city-scoped roles should show different numbers or titles, handle that in `getDashboardWidgetData` and `widgetDisplayTitle`.

Do not add the widget to `RoleDefinition`.

Falcon widgets belong in [`src/data/falconDashboardWidgets.ts`](../src/data/falconDashboardWidgets.ts). If the sidebar leaf id differs from the catalog `moduleId` (example: `batteries` → `battery-register`), add the alias in `FALCON_NAV_TO_WIDGET_MODULE`. GFM picks them up automatically from `navItemIds`.

## Verify

Switch the name card to the new role and check:

- [ ] Picker shows the new label; it persists after reload
- [ ] App Switcher is hidden (role mode) or visible (Full Build)
- [ ] Sidebar matches `navItemIds` only
- [ ] Deep links to hidden modules redirect
- [ ] Denied action routes redirect to the fallback
- [ ] Gated controls are omitted, not disabled
- [ ] Ungated modules in the allowlist still have their actions
- [ ] City-scoped lists, tabs, and pagination use the filtered set
- [ ] Out-of-city detail URLs redirect to the module list
- [ ] Dashboard widgets match the role’s modules; city roles use scoped numbers and Sub-City titles
- [ ] Full Build and other roles are unchanged

## Known limitations

- **Path prefixes are not derived from nav.** Updating `navItemIds` without `getAllowedPathPrefixes` leaves deep links open or blocks valid detail pages. Always edit both.
- **No city switcher in the UI.** A City Fleet Officer is Lagos-only. Another city is a new role or a new `dataScope.city`, not a dropdown.
- **Simulation is client-only.** Anyone can switch roles from the name card. Do not treat this as security.
- **Ungated equals allowed.** Service Schedule, Disposal, Deactivated Vehicles, and Assessment List have no permission keys. Any role that can open those modules can use every control on them until you add keys. Inventory is visible to Full Build, Inventory Manager, and Inventory Officer. Inventory gates edit cost price via `inventory.editCostPrice` and Accept/Reject via `inventory.approvals.decide`. Refurbishment gates the work-order parts Cost column via `refurbishment.column.partCost`. Falcon is visible to Full Build (App Switcher), GFM (merged sidebar, view-only), Hub Manager, Swap Operator, and Telematics Officer. Falcon mutations and extra tabs require the `falcon.*` keys.
