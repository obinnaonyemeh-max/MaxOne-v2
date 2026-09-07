import { FALCON_WIDGET_CATALOG } from "@/data/falconDashboardWidgets"
import { falconSidebarSections } from "@/data/sidebarConfig"

export type FalconSlideshowScreenId = string

export interface FalconSlideshowScreen {
  id: FalconSlideshowScreenId
  label: string
}

const MODULE_LABELS: Record<string, string> = {
  "vehicle-register": "Vehicle Tracking",
  "battery-register": "Batteries",
}

const SIDEBAR_TO_MODULE: Record<string, string> = {
  "vehicle-register": "vehicle-register",
  batteries: "battery-register",
}

const SLIDESHOW_EXCLUDED_MODULES = new Set(["stations-hubs", "geofencing"])

function sidebarItemIds(): string[] {
  return falconSidebarSections.flatMap((section) =>
    section.items.flatMap((item) => [
      item.id,
      ...(item.children?.map((child) => child.id) ?? []),
    ])
  )
}

export function getFalconSlideshowScreens(): FalconSlideshowScreen[] {
  const modulesWithCards = new Set(FALCON_WIDGET_CATALOG.map((widget) => widget.moduleId))
  const screens: FalconSlideshowScreen[] = []
  const seen = new Set<string>()

  for (const sidebarId of sidebarItemIds()) {
    const moduleId = SIDEBAR_TO_MODULE[sidebarId] ?? sidebarId
    if (
      !modulesWithCards.has(moduleId) ||
      seen.has(moduleId) ||
      SLIDESHOW_EXCLUDED_MODULES.has(moduleId)
    ) {
      continue
    }
    seen.add(moduleId)
    screens.push({
      id: moduleId,
      label: MODULE_LABELS[moduleId] ?? sidebarId,
    })
  }

  return screens
}

export const FALCON_SLIDESHOW_SCREENS = getFalconSlideshowScreens()
