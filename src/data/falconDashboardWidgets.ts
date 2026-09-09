export interface FalconDashboardWidget {
  id: "total-fleet" | "total-co2-emitted" | "total-swap-stations" | "total-geofence-locations" | "distance-travelled" | "ice-ev-activity" | "trips-distribution" | "fleet-geographical-distribution" | "vehicle-tracking" | "total-swaps-done" | "battery-overview" | "average-battery-soc" | "battery-alert-summary"
  moduleId: string
  order: number
}

export const FALCON_WIDGET_CATALOG: FalconDashboardWidget[] = [
  {
    id: "total-fleet",
    moduleId: "vehicle-register",
    order: 10,
  },
  {
    id: "total-co2-emitted",
    moduleId: "vehicle-register",
    order: 15,
  },
  {
    id: "total-swap-stations",
    moduleId: "stations-hubs",
    order: 20,
  },
  {
    id: "total-geofence-locations",
    moduleId: "geofencing",
    order: 22,
  },
  {
    id: "distance-travelled",
    moduleId: "vehicle-register",
    order: 25,
  },
  {
    id: "ice-ev-activity",
    moduleId: "vehicle-register",
    order: 30,
  },
  {
    id: "trips-distribution",
    moduleId: "vehicle-register",
    order: 32,
  },
  {
    id: "fleet-geographical-distribution",
    moduleId: "vehicle-register",
    order: 35,
  },
  {
    id: "vehicle-tracking",
    moduleId: "vehicle-register",
    order: 37,
  },
  {
    id: "total-swaps-done",
    moduleId: "vehicle-register",
    order: 40,
  },
  {
    id: "battery-overview",
    moduleId: "battery-register",
    order: 100,
  },
  {
    id: "average-battery-soc",
    moduleId: "battery-register",
    order: 110,
  },
  {
    id: "battery-alert-summary",
    moduleId: "battery-register",
    order: 120,
  },
]

export function widgetsForFalconModules(
  moduleIds: readonly string[]
): FalconDashboardWidget[] {
  const allowedModules = new Set(moduleIds)

  return FALCON_WIDGET_CATALOG
    .filter((widget) => allowedModules.has(widget.moduleId))
    .sort((a, b) => a.order - b.order)
}

/** Sidebar nav ids that publish Falcon widgets. `batteries` maps to catalog id `battery-register`. */
const FALCON_NAV_TO_WIDGET_MODULE: Record<string, string> = {
  batteries: "battery-register",
}

export function falconWidgetModuleIdsFromNav(navItemIds: readonly string[]): string[] {
  const catalogModules = new Set(FALCON_WIDGET_CATALOG.map((widget) => widget.moduleId))
  return [
    ...new Set(
      navItemIds
        .map((id) => FALCON_NAV_TO_WIDGET_MODULE[id] ?? id)
        .filter((id) => catalogModules.has(id))
    ),
  ]
}

export function widgetsForFalconFullBuild(): FalconDashboardWidget[] {
  return widgetsForFalconModules(
    FALCON_WIDGET_CATALOG.map((widget) => widget.moduleId)
  )
}
