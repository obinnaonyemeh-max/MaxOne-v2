// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine > ICE Repricing tab.
// A read-only audit register of every ICE vehicle asset the scheduled repricing engine (or
// a bulk manual upload) has touched, along with the fuel-index rule applied and the
// resulting daily remittance. These vehicles are mid-refurbishment, so they carry no
// active champion or contract yet.

export type IceRefurbishmentStatus = "Completed" | "Pending" | "N/A"
export type IceRepricingStatus = "Repriced" | "Pending" | "Exception" | "Failed"

export interface IceRepricedContract {
  id: string
  /** Format: VEH-ICE-XXXX */
  vehicleId: string
  plateNumber: string
  vehicleModel: string
  country: string
  city: string
  refurbishmentStatus: IceRefurbishmentStatus
  /** Null when the contract hasn't been evaluated against a rule yet. */
  ruleCode: string | null
  ruleVersion: string | null
  repricingStatus: IceRepricingStatus
  dailyRemittance: number
  /** ISO date the engine last touched this contract — backs the date range filter. */
  lastRepricedAt: string
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const iceRefurbishmentStatusVariantMap: Record<IceRefurbishmentStatus, BadgeVariant> = {
  Completed: "success",
  Pending: "warning",
  "N/A": "default",
}

export const iceRepricingStatusVariantMap: Record<IceRepricingStatus, BadgeVariant> = {
  Repriced: "success",
  Pending: "info",
  Exception: "warning",
  Failed: "danger",
}

export const mockIceRepricedContracts: IceRepricedContract[] = [
  {
    id: "1",
    vehicleId: "VEH-ICE-8100",
    plateNumber: "LAG-902-ICE",
    vehicleModel: "TVS King Deluxe 3W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v4",
    repricingStatus: "Repriced",
    dailyRemittance: 4200,
    lastRepricedAt: "2026-07-26",
  },
  {
    id: "2",
    vehicleId: "VEH-ICE-8101",
    plateNumber: "LAG-347-ICE",
    vehicleModel: "TVS King Deluxe 3W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v4",
    repricingStatus: "Repriced",
    dailyRemittance: 4310,
    lastRepricedAt: "2026-07-25",
  },
  {
    id: "3",
    vehicleId: "VEH-ICE-8102",
    plateNumber: "ABJ-140-ICE",
    vehicleModel: "Keke Bajaj RE",
    country: "Nigeria",
    city: "Abuja",
    refurbishmentStatus: "N/A",
    ruleCode: null,
    ruleVersion: null,
    repricingStatus: "Pending",
    dailyRemittance: 0,
    lastRepricedAt: "2026-07-24",
  },
  {
    id: "4",
    vehicleId: "VEH-ICE-8103",
    plateNumber: "IBD-055-ICE",
    vehicleModel: "Boxer 150",
    country: "Nigeria",
    city: "Ibadan",
    refurbishmentStatus: "Pending",
    ruleCode: "RR-004",
    ruleVersion: "v1",
    repricingStatus: "Exception",
    dailyRemittance: 2980,
    lastRepricedAt: "2026-07-22",
  },
  {
    id: "5",
    vehicleId: "VEH-ICE-8104",
    plateNumber: "KDA 340X",
    vehicleModel: "Keke Bajaj RE",
    country: "Kenya",
    city: "Nairobi",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v3",
    repricingStatus: "Repriced",
    dailyRemittance: 4055,
    lastRepricedAt: "2026-07-19",
  },
  {
    id: "6",
    vehicleId: "VEH-ICE-8105",
    plateNumber: "LAG-561-ICE",
    vehicleModel: "TVS King Deluxe 3W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v4",
    repricingStatus: "Failed",
    dailyRemittance: 4180,
    lastRepricedAt: "2026-07-17",
  },
  {
    id: "7",
    vehicleId: "VEH-ICE-8106",
    plateNumber: "KDB 615X",
    vehicleModel: "Boxer 150",
    country: "Kenya",
    city: "Mombasa",
    refurbishmentStatus: "N/A",
    ruleCode: null,
    ruleVersion: null,
    repricingStatus: "Pending",
    dailyRemittance: 0,
    lastRepricedAt: "2026-07-14",
  },
  {
    id: "8",
    vehicleId: "VEH-ICE-8107",
    plateNumber: "ABJ-289-ICE",
    vehicleModel: "Keke Bajaj RE",
    country: "Nigeria",
    city: "Abuja",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v4",
    repricingStatus: "Repriced",
    dailyRemittance: 3990,
    lastRepricedAt: "2026-07-08",
  },
  {
    id: "9",
    vehicleId: "VEH-ICE-8108",
    plateNumber: "KDC 447X",
    vehicleModel: "Boxer 150",
    country: "Kenya",
    city: "Nairobi",
    refurbishmentStatus: "Pending",
    ruleCode: "RR-004",
    ruleVersion: "v1",
    repricingStatus: "Repriced",
    dailyRemittance: 3020,
    lastRepricedAt: "2026-06-30",
  },
  {
    id: "10",
    vehicleId: "VEH-ICE-8109",
    plateNumber: "LAG-710-ICE",
    vehicleModel: "TVS King Deluxe 3W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-003",
    ruleVersion: "v3",
    repricingStatus: "Repriced",
    dailyRemittance: 4260,
    lastRepricedAt: "2026-06-22",
  },
]
