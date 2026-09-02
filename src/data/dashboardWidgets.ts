import type { ActivationQueueItem } from "@/components/max/ActivationQueueCard"
import type { RegionDistribution } from "@/components/max/FleetDistributionCard"
import type { BarChartSeries } from "@/components/max/HorizontalBarChart"
import { isInCityScope, LAGOS_SUBCITIES, resolveLagosSubCity, type CityId } from "./cityScope"
import { CITIES } from "./cities"
import { mockVehicles, type Vehicle, type VehicleStatus } from "./mockVehicles"
import type { RoleDataScope } from "./rolePermissions"

export type WidgetSize = "stat" | "full" | "chart"

export interface DashboardWidget {
  id: string
  moduleId: string
  title: string
  size: WidgetSize
  order: number
  href?: string
  tab?: string
}

export interface StatWidgetData {
  value: string
  subtitle: string
  trend: { value: number; direction: "up" | "down" }
  indicatorColor: string
}

export interface BarChartWidgetData {
  categories: string[]
  series: BarChartSeries[]
  showLegend?: boolean
  stacked?: boolean
}

const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_CLOSED = "var(--color-status-closed)"
const COLOR_STATUS_OUTRIGHT_SALES = "var(--color-status-outright-sales)"

export const WIDGET_CATALOG: DashboardWidget[] = [
  {
    id: "stat-total-fleet",
    moduleId: "fleet-register",
    title: "Total Fleet",
    size: "stat",
    order: 10,
    href: "/fleet-register",
    tab: "all",
  },
  {
    id: "stat-exit",
    moduleId: "fleet-register",
    title: "Exit",
    size: "stat",
    order: 20,
    href: "/fleet-register",
    tab: "exit",
  },
  {
    id: "stat-active",
    moduleId: "fleet-register",
    title: "Active",
    size: "stat",
    order: 30,
    href: "/fleet-register",
    tab: "active",
  },
  {
    id: "stat-inbound",
    moduleId: "fleet-register",
    title: "Inbound",
    size: "stat",
    order: 40,
    href: "/fleet-register",
    tab: "inbound",
  },
  {
    id: "stat-operational",
    moduleId: "fleet-register",
    title: "Operational Fleet",
    size: "stat",
    order: 50,
    href: "/fleet-register",
    tab: "operational",
  },
  {
    id: "stat-3pl-checkin",
    moduleId: "asset-movement",
    title: "3PL Check-in Fleet",
    size: "stat",
    order: 60,
    href: "/asset-movement",
  },
  {
    id: "stat-yard-checkin",
    moduleId: "asset-movement",
    title: "Yard Check-in Fleet",
    size: "stat",
    order: 70,
    href: "/asset-movement",
  },
  {
    id: "fleet-distribution",
    moduleId: "fleet-register",
    title: "Fleet Distribution",
    size: "full",
    order: 80,
  },
  {
    id: "chart-activation-queue",
    moduleId: "activation-dashboard",
    title: "Activation Queue",
    size: "chart",
    order: 90,
    href: "/growth-activation",
  },
  {
    id: "chart-active-fleet-by-city",
    moduleId: "fleet-register",
    title: "Active Fleet by City",
    size: "chart",
    order: 100,
    href: "/fleet-register",
    tab: "active",
  },
  {
    id: "chart-checkin-fleet-by-city",
    moduleId: "asset-movement",
    title: "Check-in Fleet by City",
    size: "chart",
    order: 110,
    href: "/asset-movement",
  },
]

const WIDGET_BY_ID = new Map(WIDGET_CATALOG.map((widget) => [widget.id, widget]))

/** Leaf module id → widget ids. Empty / omitted modules have no dashboard surface. */
export const MODULE_WIDGETS: Record<string, string[]> = {
  "fleet-register": [
    "stat-total-fleet",
    "stat-exit",
    "stat-active",
    "stat-inbound",
    "stat-operational",
    "fleet-distribution",
    "chart-active-fleet-by-city",
  ],
  "asset-movement": [
    "stat-3pl-checkin",
    "stat-yard-checkin",
    "chart-checkin-fleet-by-city",
  ],
  "activation-dashboard": ["chart-activation-queue"],
}

export type DriverExperienceWidgetId =
  | "stat-total-champions"
  | "stat-active-champions"
  | "stat-inactive-champions"
  | "stat-open-tickets"
  | "stat-sla-breached"
  | "stat-resolved-tickets"
  | "stat-welfare-follow-ups-overdue"
  | "stat-welfare-cases"
  | "stat-false-resolution-rate"
  | "chart-ticket-status-breakdown"
  | "chart-tickets-by-category"
  | "chart-ticket-aging-sla"
  | "chart-champions-by-location"
  | "chart-champions-by-subcity"
  | "chart-agent-distribution"
  | "chart-agent-workload"
  | "chart-false-resolution-rate-by-resolver"

/** Driver Experience leaf module id → dashboard widgets owned by that module. */
export const DRIVER_EXPERIENCE_MODULE_WIDGETS: Record<
  string,
  DriverExperienceWidgetId[]
> = {
  "champion-360": [
    "stat-total-champions",
    "stat-active-champions",
    "stat-inactive-champions",
    "chart-champions-by-location",
  ],
  "ticket-management": [
    "stat-open-tickets",
    "stat-sla-breached",
    "stat-resolved-tickets",
    "chart-ticket-status-breakdown",
    "chart-tickets-by-category",
  ],
  welfare: [
    "stat-welfare-follow-ups-overdue",
    "stat-welfare-cases",
  ],
  "agents-management": [
    "chart-agent-distribution",
    "chart-agent-workload",
  ],
}

export function driverExperienceWidgetIdsForModules(
  navItemIds: string[]
): Set<DriverExperienceWidgetId> {
  return new Set(
    navItemIds.flatMap(
      (moduleId) => DRIVER_EXPERIENCE_MODULE_WIDGETS[moduleId] ?? []
    )
  )
}

export function widgetsForModules(navItemIds: string[]): DashboardWidget[] {
  const ids = new Set(
    navItemIds.flatMap((moduleId) => MODULE_WIDGETS[moduleId] ?? [])
  )
  return [...ids]
    .map((id) => WIDGET_BY_ID.get(id))
    .filter((widget): widget is DashboardWidget => widget !== undefined)
    .sort((a, b) => a.order - b.order)
}

export function widgetsForFullBuild(): DashboardWidget[] {
  return widgetsForModules(Object.keys(MODULE_WIDGETS))
}

export const STAT_WIDGET_DATA: Record<string, StatWidgetData> = {
  "stat-total-fleet": {
    value: "32,400",
    subtitle: "100% of fleet",
    trend: { value: 2.5, direction: "up" },
    indicatorColor: COLOR_BRAND_PRIMARY,
  },
  "stat-exit": {
    value: "4,200",
    subtitle: "13% of fleet",
    trend: { value: 1.5, direction: "up" },
    indicatorColor: COLOR_STATUS_CLOSED,
  },
  "stat-active": {
    value: "12,800",
    subtitle: "39.5% of fleet",
    trend: { value: 2.1, direction: "up" },
    indicatorColor: COLOR_BADGE_ACTIVE,
  },
  "stat-inbound": {
    value: "3,200",
    subtitle: "9.9% of fleet",
    trend: { value: 1.1, direction: "up" },
    indicatorColor: COLOR_STATUS_INFO,
  },
  "stat-operational": {
    value: "5,600",
    subtitle: "17.3% of fleet",
    trend: { value: 0.8, direction: "up" },
    indicatorColor: COLOR_STATUS_SUCCESS,
  },
  "stat-3pl-checkin": {
    value: "2,400",
    subtitle: "7.4% of fleet",
    trend: { value: 1.2, direction: "down" },
    indicatorColor: COLOR_STATUS_WARNING,
  },
  "stat-yard-checkin": {
    value: "4,200",
    subtitle: "13% of fleet",
    trend: { value: 0.5, direction: "down" },
    indicatorColor: COLOR_STATUS_OUTRIGHT_SALES,
  },
}

const DISTRIBUTION_COLORS = {
  exit: COLOR_STATUS_CLOSED,
  active: COLOR_BADGE_ACTIVE,
  inbound: COLOR_STATUS_INFO,
  operational: COLOR_STATUS_SUCCESS,
  threePlCheckin: COLOR_STATUS_WARNING,
  yardCheckin: COLOR_STATUS_OUTRIGHT_SALES,
}

const randomValue = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const createDistributionData = () => [
  { label: "Exit", value: randomValue(300, 1500), color: DISTRIBUTION_COLORS.exit },
  { label: "Active", value: randomValue(1000, 5000), color: DISTRIBUTION_COLORS.active },
  { label: "Inbound", value: randomValue(200, 1500), color: DISTRIBUTION_COLORS.inbound },
  { label: "Operational Fleet", value: randomValue(500, 3000), color: DISTRIBUTION_COLORS.operational },
  { label: "3PL Check-in Fleet", value: randomValue(200, 1200), color: DISTRIBUTION_COLORS.threePlCheckin },
  { label: "Yard Check-in Fleet", value: randomValue(300, 2000), color: DISTRIBUTION_COLORS.yardCheckin },
]

export const FLEET_DISTRIBUTION_DATA: RegionDistribution[] = [
  { region: "Global", data: createDistributionData() },
  { region: "Nigeria", data: createDistributionData() },
  { region: "Ghana", data: createDistributionData() },
  { region: "Cameroon", data: createDistributionData() },
]

export const ACTIVATION_QUEUE_DATA: ActivationQueueItem[] = [
  { activationType: "Easy Retail", count: 245, overdue: 12 },
  { activationType: "Easy MCP", count: 245, overdue: 12 },
  { activationType: "Easy Enterprise", count: 245, overdue: 12 },
  { activationType: "Easy Enterprise", count: 245, overdue: 12 },
]

const FLEET_BY_CITY_CITIES = [...CITIES]

export const BAR_CHART_WIDGET_DATA: Record<string, BarChartWidgetData> = {
  "chart-active-fleet-by-city": {
    categories: FLEET_BY_CITY_CITIES,
    series: [
      {
        name: "Active",
        data: [180, 95, 165, 210, 120, 240, 45],
        color: COLOR_BADGE_ACTIVE,
      },
    ],
  },
  "chart-checkin-fleet-by-city": {
    categories: FLEET_BY_CITY_CITIES,
    series: [
      {
        name: "3PL Check-in Fleet",
        data: [160, 80, 175, 195, 140, 185, 55],
        color: COLOR_STATUS_WARNING,
      },
      {
        name: "Yard Check-in Fleet",
        data: [40, 25, 35, 30, 45, 25, 20],
        color: COLOR_STATUS_OUTRIGHT_SALES,
      },
    ],
    showLegend: true,
    stacked: true,
  },
}

export function widgetHref(widget: DashboardWidget): string | undefined {
  if (!widget.href) return undefined
  if (widget.tab) return `${widget.href}?tab=${widget.tab}`
  return widget.href
}

/** Chart titles that change when the role is city-scoped (sub-cities vs cities). */
export function widgetDisplayTitle(
  widget: DashboardWidget,
  scope: RoleDataScope | null
): string {
  if (scope?.type === "city") {
    if (widget.id === "chart-active-fleet-by-city") return "Active Fleet by Sub-City"
    if (widget.id === "chart-checkin-fleet-by-city") return "Check-in Fleet by Sub-City"
  }
  return widget.title
}

function percentOf(count: number, total: number): string {
  if (total === 0) return "0% of fleet"
  return `${((count / total) * 100).toFixed(1)}% of fleet`
}

function countByStatus(vehicles: Vehicle[], status: VehicleStatus): number {
  return vehicles.filter((vehicle) => vehicle.vehicleStatus === status).length
}

function areaForVehicle(vehicle: Vehicle) {
  return resolveLagosSubCity(vehicle.location)
}

function distributionForVehicles(vehicles: Vehicle[]) {
  return [
    { label: "Exit", value: countByStatus(vehicles, "Exit"), color: DISTRIBUTION_COLORS.exit },
    { label: "Active", value: countByStatus(vehicles, "Active"), color: DISTRIBUTION_COLORS.active },
    { label: "Inbound", value: countByStatus(vehicles, "Inbound"), color: DISTRIBUTION_COLORS.inbound },
    { label: "Operational Fleet", value: countByStatus(vehicles, "Operational Fleet"), color: DISTRIBUTION_COLORS.operational },
    { label: "3PL Check-in Fleet", value: countByStatus(vehicles, "3PL Check-in Fleet"), color: DISTRIBUTION_COLORS.threePlCheckin },
    { label: "Yard Check-in Fleet", value: countByStatus(vehicles, "Yard check-in Fleet"), color: DISTRIBUTION_COLORS.yardCheckin },
  ]
}

export interface DashboardWidgetData {
  stats: Record<string, StatWidgetData>
  fleetDistribution: RegionDistribution[]
  barCharts: Record<string, BarChartWidgetData>
}

function buildCityDashboardData(city: CityId): DashboardWidgetData {
  const vehicles = mockVehicles.filter((vehicle) => isInCityScope(vehicle.location, city))
  const total = vehicles.length
  const counts: Record<string, number> = {
    "stat-total-fleet": total,
    "stat-exit": countByStatus(vehicles, "Exit"),
    "stat-active": countByStatus(vehicles, "Active"),
    "stat-inbound": countByStatus(vehicles, "Inbound"),
    "stat-operational": countByStatus(vehicles, "Operational Fleet"),
    "stat-3pl-checkin": countByStatus(vehicles, "3PL Check-in Fleet"),
    "stat-yard-checkin": countByStatus(vehicles, "Yard check-in Fleet"),
  }

  const stats: Record<string, StatWidgetData> = {}
  for (const [id, data] of Object.entries(STAT_WIDGET_DATA)) {
    const count = counts[id] ?? 0
    stats[id] = {
      ...data,
      value: count.toLocaleString(),
      subtitle: id === "stat-total-fleet" ? `100% of ${city} fleet` : percentOf(count, total),
    }
  }

  const fleetDistribution: RegionDistribution[] = LAGOS_SUBCITIES.map((area) => ({
    region: area,
    data: distributionForVehicles(
      vehicles.filter((vehicle) => areaForVehicle(vehicle) === area)
    ),
  }))

  const activeByArea = LAGOS_SUBCITIES.map(
    (area) =>
      vehicles.filter(
        (vehicle) => areaForVehicle(vehicle) === area && vehicle.vehicleStatus === "Active"
      ).length
  )
  const threePlByArea = LAGOS_SUBCITIES.map(
    (area) =>
      vehicles.filter(
        (vehicle) =>
          areaForVehicle(vehicle) === area && vehicle.vehicleStatus === "3PL Check-in Fleet"
      ).length
  )
  const yardByArea = LAGOS_SUBCITIES.map(
    (area) =>
      vehicles.filter(
        (vehicle) =>
          areaForVehicle(vehicle) === area && vehicle.vehicleStatus === "Yard check-in Fleet"
      ).length
  )

  const barCharts: Record<string, BarChartWidgetData> = {
    "chart-active-fleet-by-city": {
      categories: [...LAGOS_SUBCITIES],
      series: [{ name: "Active", data: activeByArea, color: COLOR_BADGE_ACTIVE }],
    },
    "chart-checkin-fleet-by-city": {
      categories: [...LAGOS_SUBCITIES],
      series: [
        { name: "3PL Check-in Fleet", data: threePlByArea, color: COLOR_STATUS_WARNING },
        { name: "Yard Check-in Fleet", data: yardByArea, color: COLOR_STATUS_OUTRIGHT_SALES },
      ],
      showLegend: true,
      stacked: true,
    },
  }

  return { stats, fleetDistribution, barCharts }
}

export function getDashboardWidgetData(scope: RoleDataScope | null): DashboardWidgetData {
  if (scope?.type === "city") {
    return buildCityDashboardData(scope.city)
  }
  return {
    stats: STAT_WIDGET_DATA,
    fleetDistribution: FLEET_DISTRIBUTION_DATA,
    barCharts: BAR_CHART_WIDGET_DATA,
  }
}
