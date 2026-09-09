import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { SidebarSection } from "@/components/max"
import { isInCityScope, isInCountryScope, resolveLagosSubCity } from "@/data/cityScope"
import {
  widgetsForFullBuild,
  widgetsForModules,
  type DashboardWidget,
} from "@/data/dashboardWidgets"
import {
  filterSidebarSections,
  getPermissionsForMode,
  getRoleDefinition,
  getRoleLabel,
  type PermissionKey,
  type RoleDataScope,
  type SimulationMode,
} from "@/data/rolePermissions"
import {
  driverExperienceSidebarSections,
  falconSidebarSections,
  sidebarSections,
} from "@/data/sidebarConfig"

const STORAGE_KEY = "maxone.simulationMode"

function readStoredMode(): SimulationMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (
      stored === "full-build" ||
      stored === "global-fleet-manager" ||
      stored === "city-fleet-officer" ||
      stored === "fleet-officer" ||
      stored === "refurbishment-manager" ||
      stored === "refurbishment-officer" ||
      stored === "inventory-manager" ||
      stored === "inventory-officer" ||
      stored === "call-centre-agent" ||
      stored === "welfare-agent" ||
      stored === "field-ops-manager" ||
      stored === "welfare-manager" ||
      stored === "executive" ||
      stored === "dxp-product-manager" ||
      stored === "operations-manager" ||
      stored === "hub-manager" ||
      stored === "swap-operator" ||
      stored === "telematics-officer"
    ) {
      return stored
    }
  } catch {
    // ignore
  }
  return "full-build"
}

interface RoleSimulationContextValue {
  mode: SimulationMode
  setMode: (mode: SimulationMode) => void
  isFullBuild: boolean
  isRoleMode: boolean
  roleLabel: string
  can: (permission: PermissionKey) => boolean
  filterSections: (sections: SidebarSection[]) => SidebarSection[]
  /** Fleet Ops sections filtered for the current role (role mode only). */
  roleSidebarSections: SidebarSection[]
  /** Dashboard widgets derived from the current role's modules. */
  dashboardWidgets: DashboardWidget[]
  /** Geographic scope for list/dashboard data; null when unscoped. */
  dataScope: RoleDataScope | null
  /** True when the value is in-scope, or when the role has no city scope. */
  filterByCity: (value: string | null | undefined) => boolean
  /** True when unscoped, not station-scoped, or the id is assigned. */
  filterByStation: (stationId: string | null | undefined) => boolean
}

const RoleSimulationContext = createContext<RoleSimulationContextValue | null>(null)

export function RoleSimulationProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SimulationMode>(() => readStoredMode())

  const setMode = useCallback((next: SimulationMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const permissions = useMemo(() => getPermissionsForMode(mode), [mode])

  const can = useCallback(
    (permission: PermissionKey) => permissions.has(permission),
    [permissions]
  )

  const filterSections = useCallback(
    (sections: SidebarSection[]) => {
      if (mode === "full-build") return sections
      const role = getRoleDefinition(mode)
      if (!role) return sections
      return filterSidebarSections(sections, role.navItemIds)
    },
    [mode]
  )

  const roleSidebarSections = useMemo(() => {
    if (mode === "full-build") return sidebarSections
    const role = getRoleDefinition(mode)
    if (!role) return sidebarSections
    if (mode === "global-fleet-manager") {
      return [
        ...filterSidebarSections(sidebarSections, role.navItemIds),
        ...filterSidebarSections(falconSidebarSections, role.navItemIds),
      ]
    }
    if (
      mode === "hub-manager" ||
      mode === "swap-operator" ||
      mode === "telematics-officer"
    ) {
      return filterSidebarSections(falconSidebarSections, role.navItemIds)
    }
    const sourceSections =
      mode === "call-centre-agent" ||
      mode === "welfare-agent" ||
      mode === "field-ops-manager" ||
      mode === "welfare-manager" ||
      mode === "executive" ||
      mode === "dxp-product-manager" ||
      mode === "operations-manager"
        ? driverExperienceSidebarSections
        : sidebarSections
    return filterSidebarSections(sourceSections, role.navItemIds)
  }, [mode])

  const dashboardWidgets = useMemo(() => {
    if (mode === "full-build") return widgetsForFullBuild()
    const role = getRoleDefinition(mode)
    if (!role) return widgetsForFullBuild()
    return widgetsForModules(role.navItemIds)
  }, [mode])

  const dataScope = useMemo(() => {
    if (mode === "full-build") return null
    return getRoleDefinition(mode)?.dataScope ?? null
  }, [mode])

  const filterByCity = useCallback(
    (value: string | null | undefined) => {
      if (!dataScope) return true
      if (dataScope.type === "subCity") {
        return resolveLagosSubCity(value) === dataScope.subCity
      }
      if (dataScope.type === "city") {
        return isInCityScope(value, dataScope.city)
      }
      if (dataScope.type === "country") {
        return isInCountryScope(value, dataScope.country)
      }
      return true
    },
    [dataScope]
  )

  const filterByStation = useCallback(
    (stationId: string | null | undefined) => {
      if (!dataScope || dataScope.type !== "station") return true
      if (!stationId) return false
      return dataScope.stationIds.includes(stationId)
    },
    [dataScope]
  )

  const value = useMemo<RoleSimulationContextValue>(
    () => ({
      mode,
      setMode,
      isFullBuild: mode === "full-build",
      isRoleMode: mode !== "full-build",
      roleLabel: getRoleLabel(mode),
      can,
      filterSections,
      roleSidebarSections,
      dashboardWidgets,
      dataScope,
      filterByCity,
      filterByStation,
    }),
    [
      mode,
      setMode,
      can,
      filterSections,
      roleSidebarSections,
      dashboardWidgets,
      dataScope,
      filterByCity,
      filterByStation,
    ]
  )

  return (
    <RoleSimulationContext.Provider value={value}>
      {children}
    </RoleSimulationContext.Provider>
  )
}

export function useRoleSimulation(): RoleSimulationContextValue {
  const ctx = useContext(RoleSimulationContext)
  if (!ctx) {
    throw new Error("useRoleSimulation must be used within RoleSimulationProvider")
  }
  return ctx
}

/** Convenience hook for a single permission check. */
export function useCan(permission: PermissionKey): boolean {
  return useRoleSimulation().can(permission)
}

/** Dashboard widgets composed from the current role's modules. */
export function useDashboardWidgets(): DashboardWidget[] {
  return useRoleSimulation().dashboardWidgets
}

/** Filter records by the current role's city scope. Unscoped roles return all records. */
export function useCityScopedRecords<T>(
  records: readonly T[],
  locationKey: keyof T
): T[] {
  const { filterByCity } = useRoleSimulation()
  return useMemo(
    () =>
      records.filter((item) =>
        filterByCity(item[locationKey] as string | null | undefined)
      ),
    [records, filterByCity, locationKey]
  )
}

/** Filter records by assigned station ids. Unscoped and city-scoped roles return all records. */
export function useStationScopedRecords<T>(
  records: readonly T[],
  idKey: keyof T
): T[] {
  const { filterByStation } = useRoleSimulation()
  return useMemo(
    () =>
      records.filter((item) =>
        filterByStation(item[idKey] as string | null | undefined)
      ),
    [records, filterByStation, idKey]
  )
}
