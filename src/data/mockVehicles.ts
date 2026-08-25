import type { LagosSubCity } from "./cityScope"

export type VehicleStatus =
  | "Exit"
  | "Active"
  | "Inbound"
  | "Operational Fleet"
  | "3PL Check-in Fleet"
  | "Yard check-in Fleet"

export type ExitSubStatus = "HP Complete" | "Outright Sale" | "Disposed" | "Scrapped" | "Write-off" | "OEM Outbound" | "Stolen/Missing"
export type ActiveSubStatus = "MCP" | "Retail" | "Enterprise"
export type InboundSubStatus = "Production" | "Documentation" | "Logistics" | "Pre-Deployment"
export type OperationalFleetSubStatus = "Operational Vehicle" | "Demo" | "System test"
export type ThreePLCheckinSubStatus = "Violation" | "Accident" | "Others" | "Asset Maintenance"
export type YardCheckinSubStatus = "Asset retrieved" | "Deactivated" | "Assessed - No repair required" | "Assessed - Refurbish" | "Assessed - Dispose" | "Assessed - Scrap"

export type SubStatus =
  | ExitSubStatus
  | ActiveSubStatus
  | InboundSubStatus
  | OperationalFleetSubStatus
  | ThreePLCheckinSubStatus
  | YardCheckinSubStatus

export interface Vehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string | null
  batchNumber: string
  location: string
  championStatus: "Active" | "Inactive" | null
  contractStatus: "Active" | "Inactive" | null
  vehicleStatus: VehicleStatus
  subStatus: SubStatus
  driverSafetyScore: number | null
  contractRisk: "Low" | "Medium" | "High" | null
  collectionPercent: number | null
  daysInState: number
  dateCreated: string
}

const ASSET_TYPES = ["2 Wheeler", "3 Wheeler", "4 Wheeler"] as const
const DATES = ["3 Dec 2023", "15 Jan 2024", "20 Feb 2024", "5 Mar 2024", "10 Apr 2024", "25 May 2024"] as const
const PLATE_PREFIX: Record<string, string> = {
  Ikeja: "IKJ",
  Lekki: "LKK",
  "Victoria Island": "VIC",
  Surulere: "SUR",
  Abeokuta: "ABK",
  Osogbo: "OSG",
  "Sango Ota": "SOT",
  Accra: "ACC",
  Ibadan: "IBD",
}

const SUB_STATUS_BY_STATUS: Record<VehicleStatus, SubStatus[]> = {
  Exit: ["HP Complete", "Outright Sale", "Disposed", "Scrapped"],
  Active: ["MCP", "Retail", "Enterprise"],
  Inbound: ["Production", "Documentation", "Logistics", "Pre-Deployment"],
  "Operational Fleet": ["Operational Vehicle", "Demo", "System test"],
  "3PL Check-in Fleet": ["Violation", "Accident", "Others", "Asset Maintenance"],
  "Yard check-in Fleet": ["Asset retrieved", "Deactivated", "Assessed - Refurbish", "Assessed - Dispose"],
}

/** Lagos sub-city × status counts — every slice is non-zero, counts vary by area. */
const LAGOS_FLEET_PLAN: { location: LagosSubCity; status: VehicleStatus; count: number }[] = [
  { location: "Ikeja", status: "Active", count: 4 },
  { location: "Ikeja", status: "Exit", count: 2 },
  { location: "Ikeja", status: "Inbound", count: 2 },
  { location: "Ikeja", status: "Operational Fleet", count: 2 },
  { location: "Ikeja", status: "3PL Check-in Fleet", count: 2 },
  { location: "Ikeja", status: "Yard check-in Fleet", count: 2 },

  { location: "Lekki", status: "Active", count: 3 },
  { location: "Lekki", status: "Exit", count: 1 },
  { location: "Lekki", status: "Inbound", count: 2 },
  { location: "Lekki", status: "Operational Fleet", count: 1 },
  { location: "Lekki", status: "3PL Check-in Fleet", count: 2 },
  { location: "Lekki", status: "Yard check-in Fleet", count: 2 },

  { location: "Victoria Island", status: "Active", count: 3 },
  { location: "Victoria Island", status: "Exit", count: 2 },
  { location: "Victoria Island", status: "Inbound", count: 1 },
  { location: "Victoria Island", status: "Operational Fleet", count: 2 },
  { location: "Victoria Island", status: "3PL Check-in Fleet", count: 1 },
  { location: "Victoria Island", status: "Yard check-in Fleet", count: 2 },

  { location: "Surulere", status: "Active", count: 2 },
  { location: "Surulere", status: "Exit", count: 1 },
  { location: "Surulere", status: "Inbound", count: 2 },
  { location: "Surulere", status: "Operational Fleet", count: 2 },
  { location: "Surulere", status: "3PL Check-in Fleet", count: 2 },
  { location: "Surulere", status: "Yard check-in Fleet", count: 1 },
]

const OUTSIDE_LAGOS: { location: string; status: VehicleStatus }[] = [
  { location: "Abeokuta", status: "Exit" },
  { location: "Osogbo", status: "Operational Fleet" },
  { location: "Sango Ota", status: "3PL Check-in Fleet" },
  { location: "Accra", status: "Active" },
  { location: "Ibadan", status: "Inbound" },
]

function pad(n: number, width = 3): string {
  return String(n).padStart(width, "0")
}

function buildVehicle(
  index: number,
  location: string,
  vehicleStatus: VehicleStatus
): Vehicle {
  const subStatuses = SUB_STATUS_BY_STATUS[vehicleStatus]
  const inbound = vehicleStatus === "Inbound"
  const prefix = PLATE_PREFIX[location] ?? "NGA"
  const subStatus = subStatuses[index % subStatuses.length]
  const risk: Vehicle["contractRisk"] = inbound
    ? null
    : index % 5 === 0
      ? "High"
      : index % 3 === 0
        ? "Medium"
        : "Low"

  return {
    id: String(index + 1),
    assetType: ASSET_TYPES[index % ASSET_TYPES.length],
    assetId: `MAX-${prefix}-CH-${pad(index + 1)}`,
    plateNumber: inbound && index % 2 === 0 ? null : `${prefix}-${pad(200 + index, 3)}-${"ABCDEFGHJK"[index % 10]}`,
    batchNumber: `MAX-3774B${pad(55 + (index % 12), 2)}`,
    location,
    championStatus: inbound ? null : index % 4 === 0 ? "Inactive" : "Active",
    contractStatus: inbound ? null : index % 5 === 0 ? "Inactive" : "Active",
    vehicleStatus,
    subStatus,
    driverSafetyScore: inbound ? null : 35 + ((index * 11) % 61),
    contractRisk: risk,
    collectionPercent: inbound ? null : 45 + ((index * 7) % 56),
    daysInState: 3 + ((index * 13) % 40),
    dateCreated: DATES[index % DATES.length],
  }
}

const lagosVehicles: Vehicle[] = []
for (const row of LAGOS_FLEET_PLAN) {
  for (let n = 0; n < row.count; n++) {
    lagosVehicles.push(buildVehicle(lagosVehicles.length, row.location, row.status))
  }
}

const outsideVehicles = OUTSIDE_LAGOS.map((row, i) =>
  buildVehicle(lagosVehicles.length + i, row.location, row.status)
)

export const mockVehicles: Vehicle[] = [...lagosVehicles, ...outsideVehicles]
