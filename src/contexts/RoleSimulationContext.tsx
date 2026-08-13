import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { SidebarSection } from "@/components/max"
import {
  filterSidebarSections,
  getPermissionsForMode,
  getRoleDefinition,
  getRoleLabel,
  type PermissionKey,
  type SimulationMode,
} from "@/data/rolePermissions"
import { sidebarSections } from "@/data/sidebarConfig"

const STORAGE_KEY = "maxone.simulationMode"

function readStoredMode(): SimulationMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "full-build" || stored === "global-fleet-manager") {
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
    return filterSidebarSections(sidebarSections, role.navItemIds)
  }, [mode])

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
    }),
    [mode, setMode, can, filterSections, roleSidebarSections]
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
