# Dashboard Onboarding Reference

Generated from the current frontend configuration on 2026-09-03.

This is a product/onboarding reference for dashboard customization. The source of truth is:

- `src/data/sidebarConfig.ts` for available apps and sidebar modules.
- `src/data/dashboardWidgets.ts` for Fleet Ops, Driver Growth, and Driver Experience dashboard widget mappings.
- `src/data/falconDashboardWidgets.ts` plus `src/pages/FalconDashboardPage.tsx` for Falcon dashboard widgets.
- `src/data/rolePermissions.ts` for current simulated roles, assigned modules, permissions, route allowlists, and data scope.

## Customization Model

Dashboard widgets are module-driven, not role-driven.

- Fleet Ops dashboard widgets are derived from role `navItemIds` through `MODULE_WIDGETS`.
- Driver Experience dashboard widgets are derived from `DRIVER_EXPERIENCE_MODULE_WIDGETS`, with extra page-level rules in `DriverExperienceDashboardPage`.
- Falcon has its own widget catalog, but the current page renders the full Falcon catalog.
- Portfolio has a dashboard route, but the current dashboard page does not publish implemented widgets.
- Full Build is not a restricted role. It shows the app switcher, all apps/modules, and all gated permissions.

## Available Modules

### Fleet Operations

| Section | Module ID | Label | Route | Status |
|---|---|---|---|---|
| Overview | `dashboard` | Dashboard | `/dashboard` | Available |
| Operations | `fleet-register` | Fleet Register | `/fleet-register` | Available |
| Operations | `asset-movement` | Asset Movement | `/asset-movement` | Available |
| Deployment | `inbound` | Inbound | Container | Available |
| Deployment | `inbound-batches` | Batches | `/inbound/batches` | Available |
| Deployment | `inbound-stock-setup` | Vehicle Master Data | `/inbound/stock-setup` | Available |
| Deployment | `activation-readiness` | Activation Readiness | `/activation/readiness` | Available |
| Deployment | `vehicle-document` | Vehicle Document | `/vehicle-document` | Available |
| Lifecycle | `refurbishment` | Refurbishment | `/refurbishment` | Available |
| Lifecycle | `maintenance` | Maintenance | Container | Available |
| Lifecycle | `service-schedule` | Service Schedule | `/service-schedule` | Available |
| Lifecycle | `predictive-lab` | Predictive Lab | None | Soon |
| Lifecycle | `disposal-auction` | Disposal & Auction | Container | Available |
| Lifecycle | `disposal-management` | Disposal Management | `/disposal-management` | Available |
| Lifecycle | `conversion-request` | Conversion Request | `/conversion-request` | Available |
| Lifecycle | `auction` | Auction | `/auction` | Available |
| Lifecycle | `scrap-management` | Scrap Management | `/scrap-management` | Available |
| Lifecycle | `closed-assets` | Closed Assets | `/closed-assets` | Available |
| Ownership Transfer | `all-transfer` | All Transfer | `/transfer/all` | Available |
| Activation & Assignment | `asset-reassignment` | Asset Reassignment | Container | Available |
| Activation & Assignment | `asset-reassignment-kit` | Kit | `/activation-assignment/asset-reassignment/kit` | Available |
| Control | `asset-assessment-engine` | Asset Assessment Engine | None | Soon |
| Control | `compliance` | Compliance | None | Soon |
| Control | `vendor-management` | Vendor Management | None | Soon |
| Control | `governance` | Governance | None | Soon |

### Driver Growth

| Section | Module ID | Label | Route | Status |
|---|---|---|---|---|
| Overview | `activation-dashboard` | Activation Dashboard | `/growth-activation` | Available |
| Management | `mcp-management` | MCP Management | `/mcp-management` | Available |
| Management | `chairman-dashboard` | Chairman Dashboard | None | Soon |

### Driver Experience

| Section | Module ID | Label | Route | Status |
|---|---|---|---|---|
| Overview | `overview-dashboard` | Dashboard | `/driver-experience/dashboard` | Available |
| Champions | `champion-360` | Champion Overview | `/champion-360` | Available |
| Driver Experience | `ticket-management` | Ticket Management | `/ticket-management` | Available |
| Driver Experience | `driver-safety-score` | Drivers Safety Performance | `/driver-safety-score` | Available |
| Driver Experience | `welfare` | Welfare | `/welfare` | Available |
| Driver Experience | `approvals` | Approvals | `/driver-experience/approvals` | Available |
| Agent Management | `agent-portfolio` | Agents Portfolio | `/driver-experience/agents/portfolio` | Available |
| Agent Management | `agent-assignment-history` | Assignment History | `/driver-experience/agents/assignment-history` | Available |

Note: role and widget configuration also use the synthetic ID `agents-management` for Agent Management dashboard widgets. The sidebar section ID is `agent-management`; the visible leaf modules are `agent-portfolio` and `agent-assignment-history`.

### Falcon

| Section | Module ID | Label | Route | Status |
|---|---|---|---|---|
| Overview | `falcon-dashboard` | Dashboard | `/falcon/dashboard` | Available |
| Monitoring | `vehicle-register` | Vehicle Register | `/falcon/vehicle-register` | Available |
| Monitoring | `enforcement` | Enforcement | `/falcon/enforcement` | Available |
| Monitoring | `alerts` | Alerts | Container | Available |
| Monitoring | `tamper-alerts` | Tamper Alerts | `/falcon/alerts/tamper` | Available |
| Monitoring | `battery-alerts` | Battery Alerts | `/falcon/alerts/battery` | Route not currently registered |
| Monitoring | `geofencing` | Geofencing | `/falcon/geofences` | Available |
| Energy | `stations-hubs` | Stations & Hubs | `/falcon/swap-stations` | Available |
| Energy | `batteries` | Batteries | `/falcon/batteries/register` | Available |
| Energy | `ev-chargers` | EV Chargers | `/falcon/ev-chargers` | Available |

Note: Falcon dashboard widget configuration uses `battery-register` as the battery module ID, while the sidebar uses `batteries`.

### Portfolio

| Section | Module ID | Label | Route | Status |
|---|---|---|---|---|
| Home | `portfolio-dashboard` | Dashboard | `/portfolio/dashboard` | Available |
| Champions | `portfolio-champion-overview` | Champion Overview | `/portfolio/champions/overview` | Available |
| Champions | `portfolio-referral-management` | Referral Management | `/portfolio/champions/referrals` | Available |
| Champions | `portfolio-blacklist` | Blacklist | `/portfolio/champions/blacklist` | Available |
| Contracts | `portfolio-all-contracts` | All Contracts | `/portfolio/contracts/all` | Available |
| Contracts | `portfolio-initiated-contracts` | Initiated Contracts | `/portfolio/contracts/initiated` | Available |
| Contracts | `portfolio-restructured-contracts` | Restructured Contracts | `/portfolio/contracts/restructured` | Available |
| Contracts | `portfolio-pending-approval` | Pending Approval | `/portfolio/contracts/pending-approval` | Available |
| Contracts | `portfolio-disputed-contracts` | Disputed Contracts | `/portfolio/contracts/disputed` | Available |
| Products & Pricing | `portfolio-pricing-configuration` | Pricing Configuration | Container | Available |
| Products & Pricing | `portfolio-pricing-config-batch-pricing` | Pricing Batches | `/portfolio/pricing-configuration/pricing-batches` | Available |
| Products & Pricing | `portfolio-pricing-config-subscription-plans` | Subscription Plans | `/portfolio/pricing-configuration/subscription-plans` | Available |
| Products & Pricing | `portfolio-pricing-config-remittance-plan` | Remittance Plan | `/portfolio/pricing-configuration/remittance-plan` | Available |
| Products & Pricing | `portfolio-pricing-templates` | Pricing Templates | `/portfolio/pricing-configuration/templates` | Available |
| Products & Pricing | `portfolio-dynamic-repricing-engine` | Dynamic Repricing Engine | `/portfolio/products-pricing/repricing-engine` | Available |
| Products & Pricing | `portfolio-early-termination-engine` | Early Termination Engine | `/portfolio/products-pricing/early-termination-engine` | Available |
| Products & Pricing | `portfolio-revenue-recognition` | Revenue Recognition | `/portfolio/products-pricing/revenue-recognition` | Available |
| Collections | `portfolio-all-collections` | All Collections | `/portfolio/collections/all` | Available |
| Recovery | `portfolio-recovery-command-center` | Recovery Command Center | `/portfolio/recovery/command-center` | Available |
| Recovery | `portfolio-recovery-officers` | Recovery Officers | `/portfolio/recovery/officers` | Available |
| Recovery | `portfolio-pending-recoveries` | Pending Recoveries | `/portfolio/recovery/pending` | Available |
| Recovery | `portfolio-recoveries-in-session` | Recoveries in Session | Container | Available |
| Recovery | `portfolio-active-recoveries` | In Session | `/portfolio/recovery/sessions/in-session` | Available |
| Recovery | `portfolio-successful-recoveries` | Successful Recoveries | `/portfolio/recovery/sessions/successful` | Available |
| Recovery | `portfolio-failed-recoveries` | Failed Recoveries | `/portfolio/recovery/sessions/failed` | Available |
| Recovery | `portfolio-pending-check-ins` | Pending Check-Ins | `/portfolio/recovery/check-ins` | Available |
| Funding | `portfolio-financiers` | Financier | `/portfolio/funding/financiers` | Available |
| Portfolio Ops | `portfolio-write-offs` | WO Recovery | `/portfolio/ops/write-offs` | Available |
| Credit & Underwriting | `portfolio-retail-scorecard-config` | Retail Scorecard Configuration | `/portfolio/credit-underwriting/retail-scorecard` | Available |
| Credit & Underwriting | `portfolio-enterprise-scorecard-config` | Enterprise Scorecard Configuration | None | Soon |
| Insurance Management | `portfolio-insurance-overview` | Insurance Overview | None | Soon |

## Available Dashboard Widgets

### Fleet Ops and Driver Growth Dashboard Widgets

These widgets are configured in `WIDGET_CATALOG` and assigned through `MODULE_WIDGETS`.

| Widget ID | Widget Title | Owning Module ID | Size | Destination |
|---|---|---|---|---|
| `stat-total-fleet` | Total Fleet | `fleet-register` | Stat | `/fleet-register?tab=all` |
| `stat-exit` | Exit | `fleet-register` | Stat | `/fleet-register?tab=exit` |
| `stat-active` | Active | `fleet-register` | Stat | `/fleet-register?tab=active` |
| `stat-inbound` | Inbound | `fleet-register` | Stat | `/fleet-register?tab=inbound` |
| `stat-operational` | Operational Fleet | `fleet-register` | Stat | `/fleet-register?tab=operational` |
| `stat-3pl-checkin` | 3PL Check-in Fleet | `asset-movement` | Stat | `/asset-movement` |
| `stat-yard-checkin` | Yard Check-in Fleet | `asset-movement` | Stat | `/asset-movement` |
| `fleet-distribution` | Fleet Distribution | `fleet-register` | Full | None |
| `chart-activation-queue` | Activation Queue | `activation-dashboard` | Chart | `/growth-activation` |
| `chart-active-fleet-by-city` | Active Fleet by City | `fleet-register` | Chart | `/fleet-register?tab=active` |
| `chart-checkin-fleet-by-city` | Check-in Fleet by City | `asset-movement` | Chart | `/asset-movement` |

Module-to-widget summary:

| Module ID | Widgets Published |
|---|---|
| `fleet-register` | Total Fleet, Exit, Active, Inbound, Operational Fleet, Fleet Distribution, Active Fleet by City |
| `asset-movement` | 3PL Check-in Fleet, Yard Check-in Fleet, Check-in Fleet by City |
| `activation-dashboard` | Activation Queue |

For city-scoped roles, the two city chart titles become Active Fleet by Sub-City and Check-in Fleet by Sub-City.

### Driver Experience Dashboard Widgets

These are the module-published Driver Experience widgets.

| Widget ID | Widget Title | Owning Module ID |
|---|---|---|
| `stat-total-champions` | Total Champions | `champion-360` |
| `stat-active-champions` | Active Champions | `champion-360` |
| `stat-inactive-champions` | Inactive Champions | `champion-360` |
| `chart-champions-by-location` | Champions by City | `champion-360` |
| `stat-open-tickets` | Open Tickets | `ticket-management` |
| `stat-sla-breached` | SLA Breached | `ticket-management` |
| `stat-resolved-tickets` | Resolved Tickets | `ticket-management` |
| `chart-ticket-status-breakdown` | Ticket Status Breakdown | `ticket-management` |
| `chart-tickets-by-category` | Tickets by Category | `ticket-management` |
| `stat-welfare-follow-ups-overdue` | Welfare Follow-Ups Overdue | `welfare` |
| `stat-welfare-cases` | Welfare Cases | `welfare` |
| `chart-agent-distribution` | Agent Distribution | `agents-management` |
| `chart-agent-workload` | Agent Workload | `agents-management` |

The Driver Experience dashboard page also has these page-level widgets and cards:

| Widget/Card | Current Availability |
|---|---|
| Champions by Subcity | Full Build plus Lagos-scoped Driver Experience roles that swap city view for subcity view |
| Ticket Aging (SLA) by Agent | Full Build, Field Ops Manager, Operations Manager, and full Driver Experience access modes |
| False Resolution Rate | Full Build, Executive, Operations Manager, and full Driver Experience access modes |
| False Resolution Rate by Resolver | Full Build, Executive, Operations Manager, and full Driver Experience access modes |
| Avg Safety Score | Full Build only |
| High Risk Drivers | Full Build only |
| Driver Risk Distribution | Full Build only |
| Pending Approvals | Full Build, Welfare Manager, and DXP Product Manager |
| Welfare Follow-ups | Full Build, Welfare Manager, and DXP Product Manager |
| Total Tickets | Full Build, Welfare Manager, and DXP Product Manager |
| Reopened | Full Build, Welfare Manager, and DXP Product Manager |
| Reopen Rate by Ticket Category | Full Build only |

### Falcon Dashboard Widgets

These widgets are configured in `FALCON_WIDGET_CATALOG`.

| Widget ID | Widget Title | Owning Module ID | Notes |
|---|---|---|---|
| `total-fleet` | Total Fleet | `vehicle-register` | Segmented ICE / EV stat |
| `total-co2-emitted` | Total CO2 Emitted | `vehicle-register` | Stat card |
| `total-swap-stations` | Total Swap Stations | `stations-hubs` | Segmented by provider |
| `total-geofence-locations` | Total Geofence Locations | `geofencing` | Segmented by geofence type |
| `distance-travelled` | Distance Travelled | `vehicle-register` | Time-series card |
| `ice-ev-activity` | ICE & EV Activity | `vehicle-register` | Stacked bar chart |
| `trips-distribution` | Trips Distribution | `vehicle-register` | Time-series card |
| `fleet-geographical-distribution` | Fleet Geographical Distribution | `vehicle-register` | Distribution widget |
| `vehicle-status` | Vehicle Status | `vehicle-register` | Fleet distribution card |
| `vehicle-tracking` | Vehicle Tracking | `vehicle-register` | Fleet distribution card |
| `total-swaps-done` | Total Swaps Done | `vehicle-register` | Time-series card |
| `battery-overview` | Battery Overview | `battery-register` | Expands into battery stats, SOH/state charts, SOC trend, and map |
| `average-battery-soc` | Average Battery SOC | `battery-register` | Catalog entry; SOC trend is rendered through Battery Overview |
| `battery-alert-summary` | Battery Alert Summary | `battery-register` | Donut distribution |

Battery Overview currently renders these stat cards: Active Batteries, Offline Batteries, Critical Alerts, Avg Battery SOH, At-Risk Batteries, and Pending Commands.

### Portfolio Dashboard Widgets

Portfolio has `/portfolio/dashboard`, but the current `PortfolioDashboardPage` only renders a page header and subtitle. No reusable Portfolio dashboard widget catalog is currently configured.

## Current Roles and Assigned Modules

### Role Summary

| Role | Mode ID | Data Scope | App Switcher | Assigned Module IDs |
|---|---|---|---|---|
| Full Build | `full-build` | All data | Visible | All apps and modules |
| Global Fleet Manager | `global-fleet-manager` | All data | Hidden | `dashboard`, `fleet-register`, `asset-movement`, `inbound`, `inbound-batches`, `inbound-stock-setup`, `activation-readiness`, `vehicle-document`, `refurbishment`, `maintenance`, `service-schedule`, `disposal-auction`, `disposal-management`, `conversion-request`, `scrap-management`, `asset-reassignment`, `asset-reassignment-kit` |
| City Fleet Officer | `city-fleet-officer` | Lagos | Hidden | Same as Global Fleet Manager |
| Fleet Officer | `fleet-officer` | Lagos / Ikeja | Hidden | `dashboard`, `fleet-register`, `activation-readiness`, `vehicle-document`, `asset-reassignment`, `asset-reassignment-kit` |
| Refurbishment Manager | `refurbishment-manager` | All data | Hidden | `refurbishment`, `maintenance`, `service-schedule`, `disposal-auction`, `disposal-management`, `conversion-request`, `auction`, `scrap-management`, `closed-assets` |
| Refurbishment Officer | `refurbishment-officer` | Lagos | Hidden | Same as Refurbishment Manager |
| Call Centre Agent | `call-centre-agent` | All assigned Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management` |
| Welfare Agent | `welfare-agent` | Assigned Lagos Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management`, `welfare` |
| Field Ops Manager | `field-ops-manager` | Lagos Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management` |
| Welfare Manager | `welfare-manager` | Lagos Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management`, `welfare`, `approvals`, `agents-management`, `agent-portfolio`, `agent-assignment-history` |
| Executive | `executive` | All Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management`, `welfare`, `approvals` |
| DXP Product Manager | `dxp-product-manager` | All Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management`, `welfare`, `approvals`, `agents-management`, `agent-portfolio`, `agent-assignment-history` |
| Operations Manager | `operations-manager` | All Driver Experience data | Hidden | `overview-dashboard`, `champion-360`, `ticket-management`, `agents-management`, `agent-portfolio`, `agent-assignment-history` |

No restricted role currently assigns Falcon or Portfolio modules. Those apps are reachable through Full Build.

### Role Dashboard Surface

| Role | Dashboard Modules / Widgets |
|---|---|
| Full Build | Fleet Ops catalog widgets from `fleet-register`, `asset-movement`, and `activation-dashboard`; all Driver Experience page widgets when on Driver Experience dashboard; all Falcon widgets when on Falcon dashboard |
| Global Fleet Manager | Fleet Ops widgets from `fleet-register` and `asset-movement` |
| City Fleet Officer | Fleet Ops widgets from `fleet-register` and `asset-movement`, using Lagos-scoped data and Sub-City chart titles |
| Fleet Officer | Fleet Ops widgets from `fleet-register`, using Ikeja-scoped data |
| Refurbishment Manager | No Fleet Ops dashboard widgets; dashboard route is not assigned |
| Refurbishment Officer | No Fleet Ops dashboard widgets; dashboard route is not assigned |
| Call Centre Agent | Total Champions, Active Champions, Inactive Champions, Champions by City, Open Tickets, SLA Breached, Resolved Tickets, Ticket Status Breakdown, Tickets by Category |
| Welfare Agent | Champion and ticket widgets, Welfare Follow-Ups Overdue, Welfare Cases, and Champions by Subcity |
| Field Ops Manager | Champion and ticket widgets, Ticket Aging (SLA) by Agent, and Champions by Subcity |
| Welfare Manager | Full Driver Experience access minus Full Build-only safety/reopen-category widgets; uses Lagos scope and Champions by Subcity |
| Executive | Champion, ticket, and welfare widgets plus False Resolution Rate and False Resolution Rate by Resolver |
| DXP Product Manager | Full Driver Experience access minus Full Build-only safety/reopen-category widgets |
| Operations Manager | Champion, ticket, and agent widgets plus Ticket Aging (SLA) by Agent, False Resolution Rate, and False Resolution Rate by Resolver |

## Current Permission Groups

Permissions are action-level gates. If a page has no permission check, access to the module generally means the visible controls are usable.

| Role | Granted Permission Keys |
|---|---|
| Full Build | All permission keys |
| Global Fleet Manager | `vehicleDetails.tab.telematics` |
| City Fleet Officer | `activationReadiness.update`, `activationReadiness.bulkUpload`, `vehicleDocument.upload`, `vehicleDocument.replace`, `kit.reassignment`, `vehicleDetails.tab.telematics` |
| Fleet Officer | `activationReadiness.update`, `activationReadiness.bulkUpload`, `vehicleDocument.upload`, `vehicleDocument.replace`, `kit.reassignment` |
| Refurbishment Manager | `refurbishment.column.partCost` |
| Refurbishment Officer | None |
| Call Centre Agent | `ticketManagement.create`, `ticketManagement.changeStatus`, `ticketManagement.close`, `ticketManagement.addComment` |
| Welfare Agent | `ticketManagement.create`, `ticketManagement.changeStatus`, `ticketManagement.escalate`, `ticketManagement.close`, `ticketManagement.addComment` |
| Field Ops Manager | `ticketManagement.reassign`, `ticketManagement.changeStatus`, `ticketManagement.escalate`, `ticketManagement.close`, `ticketManagement.addComment` |
| Welfare Manager | All permission keys |
| Executive | None |
| DXP Product Manager | All permission keys except `championProfile.reassign` and `agentManagement.reassign` |
| Operations Manager | All permission keys except `championProfile.reassign` |

## Notes for Onboarding Builders

- Let users choose modules first, then derive dashboard widgets from those module choices.
- Parent/container modules such as `inbound`, `maintenance`, `disposal-auction`, `asset-reassignment`, and `alerts` should be selected automatically when a child module is selected.
- Treat `Soon` modules as visible roadmap items, not active dashboard/widget sources.
- Be careful with ID mismatches that exist today: Driver Experience uses `agents-management` for widget publishing but `agent-management` as the sidebar section ID; Falcon uses `battery-register` for widgets but `batteries` for the sidebar item.
- City-scoped onboarding should explain that Lagos roles may see Sub-City dashboard titles and scoped counts.
