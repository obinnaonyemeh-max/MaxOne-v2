import type { SidebarItem, SidebarSection } from "@/components/max"

export type SimulationMode = "full-build" | "global-fleet-manager"

export type PermissionKey =
  | "fleetRegister.addVehicles"
  | "fleetRegister.bulkUpdate"
  | "fleetRegister.column.contractRisk"
  | "fleetRegister.column.collectionPercent"
  | "inbound.batches.create"
  | "inbound.batches.addIdentifier"
  | "inbound.batches.uploadCsv"
  | "inbound.batches.uploadDocuments"
  | "inbound.batches.moveSubBatchStage"
  | "inbound.stockSetup.add"
  | "inbound.stockSetup.edit"
  | "activationReadiness.update"
  | "activationReadiness.bulkUpload"
  | "vehicleDocument.upload"
  | "vehicleDocument.replace"
  | "refurbishment.adjustWorkOrder"
  | "kit.reassignment"

export interface RoleDefinition {
  id: Exclude<SimulationMode, "full-build">
  label: string
  /** Sidebar item ids this role may see (includes parents needed for nesting). */
  navItemIds: string[]
  /** Permissions granted to this role. Full Build grants all. */
  permissions: PermissionKey[]
}

/** All permission keys — used by Full Build. */
export const ALL_PERMISSIONS: PermissionKey[] = [
  "fleetRegister.addVehicles",
  "fleetRegister.bulkUpdate",
  "fleetRegister.column.contractRisk",
  "fleetRegister.column.collectionPercent",
  "inbound.batches.create",
  "inbound.batches.addIdentifier",
  "inbound.batches.uploadCsv",
  "inbound.batches.uploadDocuments",
  "inbound.batches.moveSubBatchStage",
  "inbound.stockSetup.add",
  "inbound.stockSetup.edit",
  "activationReadiness.update",
  "activationReadiness.bulkUpload",
  "vehicleDocument.upload",
  "vehicleDocument.replace",
  "refurbishment.adjustWorkOrder",
  "kit.reassignment",
]

export const GLOBAL_FLEET_MANAGER: RoleDefinition = {
  id: "global-fleet-manager",
  label: "Global Fleet Manager",
  navItemIds: [
    "dashboard",
    "fleet-register",
    "asset-movement",
    "inbound",
    "inbound-batches",
    "inbound-stock-setup",
    "activation-readiness",
    "vehicle-document",
    "refurbishment",
    "maintenance",
    "service-schedule",
    "disposal-auction",
    "disposal-management",
    "conversion-request",
    "scrap-management",
    "asset-reassignment",
    "asset-reassignment-kit",
  ],
  permissions: [
    // Fleet Register: view columns except contract risk / collection %; no add/bulk
    // Vehicle details: all actions allowed (no keys denied)
    // Asset Movement: everything
    // Inbound batches: view only for create/identifier/csv/docs/stage move
    // Stock setup: view tabs, no add/edit
    // Activation readiness: no update / bulk upload
    // Vehicle document: no upload / replace
    // Refurbishment: no work-order adjustments
    // Service schedule / disposal modules: everything (no denied keys)
    // Kit: no reassignment action
  ],
}

export const SIMULATION_OPTIONS: {
  mode: SimulationMode
  label: string
}[] = [
  { mode: "global-fleet-manager", label: "Global Fleet Manager" },
  { mode: "full-build", label: "Full Build" },
]

export function getRoleDefinition(mode: SimulationMode): RoleDefinition | null {
  if (mode === "global-fleet-manager") return GLOBAL_FLEET_MANAGER
  return null
}

export function getPermissionsForMode(mode: SimulationMode): Set<PermissionKey> {
  if (mode === "full-build") return new Set(ALL_PERMISSIONS)
  const role = getRoleDefinition(mode)
  return new Set(role?.permissions ?? [])
}

export function getRoleLabel(mode: SimulationMode): string {
  if (mode === "full-build") return "Full Build"
  return getRoleDefinition(mode)?.label ?? "Fleet Manager"
}

function filterSidebarItem(
  item: SidebarItem,
  allowedIds: Set<string>
): SidebarItem | null {
  if (!allowedIds.has(item.id)) return null

  if (item.children?.length) {
    const children = item.children
      .map((child) => filterSidebarItem(child, allowedIds))
      .filter((child): child is SidebarItem => child !== null)

    // Parent allowed only as a container — drop if no visible children remain
    if (children.length === 0 && !item.href) return null

    return { ...item, children: children.length > 0 ? children : undefined }
  }

  return { ...item }
}

/** Filter sidebar sections by allowed nav item ids; drop empty sections. */
export function filterSidebarSections(
  sections: SidebarSection[],
  allowedIds: string[]
): SidebarSection[] {
  const idSet = new Set(allowedIds)

  return sections
    .map((section) => {
      const items = section.items
        .map((item) => filterSidebarItem(item, idSet))
        .filter((item): item is SidebarItem => item !== null)
      return { ...section, items }
    })
    .filter((section) => section.items.length > 0)
}

/** Href prefixes this role may access (derived from filtered sidebar + known detail routes). */
export function getAllowedPathPrefixes(mode: SimulationMode): string[] | null {
  if (mode === "full-build") return null

  const role = getRoleDefinition(mode)
  if (!role) return null

  // Explicit allowlist of path prefixes for GFM (includes detail routes under allowed modules)
  return [
    "/dashboard",
    "/fleet-register",
    "/asset-movement",
    "/inbound/batches",
    "/inbound/stock-setup",
    "/inbound",
    "/activation/readiness",
    "/vehicle-document",
    "/refurbishment",
    "/service-schedule",
    "/disposal-management",
    "/conversion-request",
    "/scrap-management",
    "/activation-assignment/asset-reassignment/kit",
  ]
}

/** Paths that are denied even when under an allowed prefix (action-level route blocks). */
export function getDeniedPathPrefixes(mode: SimulationMode): string[] {
  if (mode === "full-build") return []
  if (mode === "global-fleet-manager") {
    return ["/activation-assignment/asset-reassignment/kit/assign"]
  }
  return []
}

export function isPathAllowedForMode(pathname: string, mode: SimulationMode): boolean {
  if (mode === "full-build") return true

  for (const denied of getDeniedPathPrefixes(mode)) {
    if (pathname === denied || pathname.startsWith(`${denied}/`)) {
      return false
    }
  }

  const allowed = getAllowedPathPrefixes(mode)
  if (!allowed) return true

  return allowed.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function getFallbackPathForDenied(pathname: string, mode: SimulationMode): string {
  if (
    mode === "global-fleet-manager" &&
    (pathname === "/activation-assignment/asset-reassignment/kit/assign" ||
      pathname.startsWith("/activation-assignment/asset-reassignment/kit/assign/"))
  ) {
    return "/activation-assignment/asset-reassignment/kit"
  }
  return "/dashboard"
}
