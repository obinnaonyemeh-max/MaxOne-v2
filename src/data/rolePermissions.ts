import type { SidebarItem, SidebarSection } from "@/components/max"
import type { CityId, LagosSubCity } from "@/data/cityScope"

export type SimulationMode =
  | "full-build"
  | "global-fleet-manager"
  | "city-fleet-officer"
  | "fleet-officer"
  | "refurbishment-manager"
  | "refurbishment-officer"
  | "call-centre-agent"
  | "welfare-agent"
  | "field-ops-manager"
  | "welfare-manager"
  | "executive"
  | "dxp-product-manager"
  | "operations-manager"

export type PermissionKey =
  | "fleetRegister.addVehicles"
  | "fleetRegister.bulkUpdate"
  | "fleetRegister.editVehicle"
  | "fleetRegister.column.contractRisk"
  | "fleetRegister.column.collectionPercent"
  | "inbound.batches.create"
  | "inbound.batches.addIdentifier"
  | "inbound.batches.editIdentifier"
  | "inbound.batches.uploadCsv"
  | "inbound.batches.uploadDocuments"
  | "inbound.batches.moveSubBatchStage"
  | "inbound.stockSetup.add"
  | "inbound.stockSetup.edit"
  | "activationReadiness.update"
  | "activationReadiness.bulkUpload"
  | "vehicleDocument.upload"
  | "vehicleDocument.replace"
  | "kit.reassignment"
  | "refurbishment.column.partCost"
  | "vehicleDetails.tab.telematics"
  | "championProfile.reassign"
  | "agentManagement.reassign"
  | "ticketManagement.create"
  | "ticketManagement.reassign"
  | "ticketManagement.changeStatus"
  | "ticketManagement.escalate"
  | "ticketManagement.close"
  | "ticketManagement.addComment"

export type RoleDataScope =
  | { type: "city"; city: CityId }
  | { type: "subCity"; city: CityId; subCity: LagosSubCity }

export interface RoleDefinition {
  id: Exclude<SimulationMode, "full-build">
  label: string
  /** Sidebar item ids this role may see (includes parents needed for nesting). */
  navItemIds: string[]
  /** Permissions granted to this role. Full Build grants all. */
  permissions: PermissionKey[]
  /** Optional geographic / org scope for list and dashboard data. */
  dataScope?: RoleDataScope
}

/** All permission keys — used by Full Build. */
export const ALL_PERMISSIONS: PermissionKey[] = [
  "fleetRegister.addVehicles",
  "fleetRegister.bulkUpdate",
  "fleetRegister.editVehicle",
  "fleetRegister.column.contractRisk",
  "fleetRegister.column.collectionPercent",
  "inbound.batches.create",
  "inbound.batches.addIdentifier",
  "inbound.batches.editIdentifier",
  "inbound.batches.uploadCsv",
  "inbound.batches.uploadDocuments",
  "inbound.batches.moveSubBatchStage",
  "inbound.stockSetup.add",
  "inbound.stockSetup.edit",
  "activationReadiness.update",
  "activationReadiness.bulkUpload",
  "vehicleDocument.upload",
  "vehicleDocument.replace",
  "kit.reassignment",
  "refurbishment.column.partCost",
  "vehicleDetails.tab.telematics",
  "championProfile.reassign",
  "agentManagement.reassign",
  "ticketManagement.create",
  "ticketManagement.reassign",
  "ticketManagement.changeStatus",
  "ticketManagement.escalate",
  "ticketManagement.close",
  "ticketManagement.addComment",
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
    "vehicleDetails.tab.telematics",
    // Fleet Register: view columns except contract risk / collection %; no add/bulk/edit
    // Vehicle details: telematics tab; no edit vehicle info
    // Asset Movement: everything
    // Inbound batches: view only for create/identifier add/edit/csv/docs/stage move
    // Stock setup: view tabs, no add/edit
    // Activation readiness: no update / bulk upload
    // Vehicle document: no upload / replace
    // Service schedule / disposal modules: everything (no denied keys)
    // Refurbishment: hide part cost column
    // Kit: no reassignment action
  ],
}

const FLEET_OPS_NAV_ITEM_IDS = GLOBAL_FLEET_MANAGER.navItemIds

export const CITY_FLEET_OFFICER: RoleDefinition = {
  id: "city-fleet-officer",
  label: "City Fleet Officer",
  navItemIds: FLEET_OPS_NAV_ITEM_IDS,
  dataScope: { type: "city", city: "Lagos" },
  permissions: [
    "activationReadiness.update",
    "activationReadiness.bulkUpload",
    "vehicleDocument.upload",
    "vehicleDocument.replace",
    "kit.reassignment",
    "vehicleDetails.tab.telematics",
  ],
}

export const FLEET_OFFICER: RoleDefinition = {
  id: "fleet-officer",
  label: "Fleet Officer",
  navItemIds: [
    "dashboard",
    "fleet-register",
    "activation-readiness",
    "vehicle-document",
    "asset-reassignment",
    "asset-reassignment-kit",
  ],
  dataScope: { type: "subCity", city: "Lagos", subCity: "Ikeja" },
  permissions: [
    "activationReadiness.update",
    "activationReadiness.bulkUpload",
    "vehicleDocument.upload",
    "vehicleDocument.replace",
    "kit.reassignment",
  ],
}

const REFURBISHMENT_NAV_ITEM_IDS = [
  "refurbishment",
  "maintenance",
  "service-schedule",
  "disposal-auction",
  "disposal-management",
  "conversion-request",
  "auction",
  "scrap-management",
  "closed-assets",
]

export const REFURBISHMENT_MANAGER: RoleDefinition = {
  id: "refurbishment-manager",
  label: "Refurbishment Manager",
  navItemIds: REFURBISHMENT_NAV_ITEM_IDS,
  permissions: ["refurbishment.column.partCost"],
}

export const REFURBISHMENT_OFFICER: RoleDefinition = {
  id: "refurbishment-officer",
  label: "Refurbishment Officer",
  navItemIds: REFURBISHMENT_NAV_ITEM_IDS,
  dataScope: { type: "city", city: "Lagos" },
  permissions: [],
}

export const CALL_CENTRE_AGENT: RoleDefinition = {
  id: "call-centre-agent",
  label: "Call Centre Agent",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
  ],
  permissions: [
    "ticketManagement.create",
    "ticketManagement.changeStatus",
    "ticketManagement.close",
    "ticketManagement.addComment",
  ],
}

export const WELFARE_AGENT: RoleDefinition = {
  id: "welfare-agent",
  label: "Welfare Agent",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
    "welfare",
  ],
  permissions: [
    "ticketManagement.create",
    "ticketManagement.changeStatus",
    "ticketManagement.escalate",
    "ticketManagement.close",
    "ticketManagement.addComment",
  ],
  dataScope: { type: "city", city: "Lagos" },
}

export const FIELD_OPS_MANAGER: RoleDefinition = {
  id: "field-ops-manager",
  label: "Field Ops Manager",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
  ],
  permissions: [
    "ticketManagement.reassign",
    "ticketManagement.changeStatus",
    "ticketManagement.escalate",
    "ticketManagement.close",
    "ticketManagement.addComment",
  ],
  dataScope: { type: "city", city: "Lagos" },
}

export const WELFARE_MANAGER: RoleDefinition = {
  id: "welfare-manager",
  label: "Welfare Manager",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
    "welfare",
    "approvals",
    "agents-management",
    "agent-portfolio",
    "agent-assignment-history",
  ],
  permissions: ALL_PERMISSIONS,
  dataScope: { type: "city", city: "Lagos" },
}

export const EXECUTIVE: RoleDefinition = {
  id: "executive",
  label: "Executive",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
    "welfare",
    "approvals",
  ],
  permissions: [],
}

export const DXP_PRODUCT_MANAGER: RoleDefinition = {
  id: "dxp-product-manager",
  label: "DXP Product Manager",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
    "welfare",
    "approvals",
    "agents-management",
    "agent-portfolio",
    "agent-assignment-history",
  ],
  permissions: ALL_PERMISSIONS.filter(
    (permission) =>
      permission !== "championProfile.reassign" &&
      permission !== "agentManagement.reassign"
  ),
}

export const OPERATIONS_MANAGER: RoleDefinition = {
  id: "operations-manager",
  label: "Operations Manager",
  navItemIds: [
    "overview-dashboard",
    "champion-360",
    "ticket-management",
    "agents-management",
    "agent-portfolio",
    "agent-assignment-history",
  ],
  permissions: ALL_PERMISSIONS.filter(
    (permission) => permission !== "championProfile.reassign"
  ),
}


export const SIMULATION_OPTIONS: {
  mode: SimulationMode
  label: string
}[] = [
  { mode: "global-fleet-manager", label: "Global Fleet Manager" },
  { mode: "city-fleet-officer", label: "City Fleet Officer" },
  { mode: "fleet-officer", label: "Fleet Officer" },
  { mode: "refurbishment-manager", label: "Refurbishment Manager" },
  { mode: "refurbishment-officer", label: "Refurbishment Officer" },
  { mode: "call-centre-agent", label: "Call Centre Agent" },
  { mode: "welfare-agent", label: "Welfare Agent" },
  { mode: "field-ops-manager", label: "Field Ops Manager" },
  { mode: "welfare-manager", label: "Welfare Manager" },
  { mode: "executive", label: "Executive" },
  { mode: "dxp-product-manager", label: "DXP Product Manager" },
  { mode: "operations-manager", label: "Operations Manager" },
  { mode: "full-build", label: "Full Build" },
]

export function getRoleDefinition(mode: SimulationMode): RoleDefinition | null {
  if (mode === "global-fleet-manager") return GLOBAL_FLEET_MANAGER
  if (mode === "city-fleet-officer") return CITY_FLEET_OFFICER
  if (mode === "fleet-officer") return FLEET_OFFICER
  if (mode === "refurbishment-manager") return REFURBISHMENT_MANAGER
  if (mode === "refurbishment-officer") return REFURBISHMENT_OFFICER
  if (mode === "call-centre-agent") return CALL_CENTRE_AGENT
  if (mode === "welfare-agent") return WELFARE_AGENT
  if (mode === "field-ops-manager") return FIELD_OPS_MANAGER
  if (mode === "welfare-manager") return WELFARE_MANAGER
  if (mode === "executive") return EXECUTIVE
  if (mode === "dxp-product-manager") return DXP_PRODUCT_MANAGER
  if (mode === "operations-manager") return OPERATIONS_MANAGER
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

  if (mode === "call-centre-agent") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
    ]
  }

  if (mode === "welfare-agent") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
      "/welfare",
    ]
  }

  if (mode === "field-ops-manager") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
    ]
  }

  if (mode === "welfare-manager") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
      "/welfare",
      "/driver-experience/approvals",
      "/driver-experience/agents",
    ]
  }

  if (mode === "executive") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
      "/welfare",
      "/driver-experience/approvals",
    ]
  }

  if (mode === "dxp-product-manager") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
      "/welfare",
      "/driver-experience/approvals",
      "/driver-experience/agents",
    ]
  }

  if (mode === "operations-manager") {
    return [
      "/driver-experience/dashboard",
      "/champion-360",
      "/ticket-management",
      "/driver-experience/agents",
    ]
  }

  const role = getRoleDefinition(mode)
  if (!role) return null

  if (mode === "fleet-officer") {
    return [
      "/dashboard",
      "/fleet-register",
      "/activation/readiness",
      "/vehicle-document",
      "/activation-assignment/asset-reassignment/kit",
    ]
  }

  if (mode === "refurbishment-manager" || mode === "refurbishment-officer") {
    return [
      "/refurbishment",
      "/service-schedule",
      "/disposal-management",
      "/conversion-request",
      "/auction",
      "/scrap-management",
      "/closed-assets",
    ]
  }

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
  if (mode === "executive") {
    return ["/ticket-management/create"]
  }
  if (mode === "field-ops-manager") {
    return ["/ticket-management/create"]
  }
  if (mode === "welfare-manager") {
    return ["/driver-safety-score"]
  }
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
  if (mode === "welfare-agent") {
    return "/driver-experience/dashboard"
  }
  if (mode === "call-centre-agent") {
    return "/driver-experience/dashboard"
  }
  if (mode === "field-ops-manager") {
    if (
      pathname === "/ticket-management/create" ||
      pathname.startsWith("/ticket-management/create/")
    ) {
      return "/ticket-management"
    }
    return "/driver-experience/dashboard"
  }
  if (mode === "welfare-manager") {
    return "/driver-experience/dashboard"
  }
  if (mode === "executive") {
    return "/driver-experience/dashboard"
  }
  if (mode === "dxp-product-manager") {
    return "/driver-experience/dashboard"
  }
  if (mode === "operations-manager") {
    return "/driver-experience/dashboard"
  }
  if (
    mode === "global-fleet-manager" &&
    (pathname === "/activation-assignment/asset-reassignment/kit/assign" ||
      pathname.startsWith("/activation-assignment/asset-reassignment/kit/assign/"))
  ) {
    return "/activation-assignment/asset-reassignment/kit"
  }
  if (mode === "refurbishment-manager" || mode === "refurbishment-officer") {
    return "/refurbishment"
  }
  return "/dashboard"
}
