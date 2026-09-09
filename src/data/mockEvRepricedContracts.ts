// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine > EV Repricing tab.
// A read-only audit register of every EV vehicle asset the scheduled repricing engine has
// touched, along with the rule that was applied and the resulting daily remittance. These
// vehicles are mid-refurbishment, so they carry no active champion or contract yet.

export type RefurbishmentStatus = "Completed" | "Pending" | "Draft"
export type EvRepricingStatus = "Repriced" | "Pending" | "Exception" | "Failed"

export interface EvRepricedContract {
  id: string
  /** Format: VEH-EV-XXXX */
  vehicleId: string
  plateNumber: string
  vehicleModel: string
  country: string
  city: string
  refurbishmentStatus: RefurbishmentStatus
  /** Null when the contract hasn't been evaluated against a rule yet. */
  ruleCode: string | null
  ruleVersion: string | null
  repricingStatus: EvRepricingStatus
  dailyRemittance: number
  /** ISO date the engine last touched this contract — backs the date range filter. */
  lastRepricedAt: string
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const refurbishmentStatusVariantMap: Record<RefurbishmentStatus, BadgeVariant> = {
  Completed: "success",
  Pending: "warning",
  Draft: "info",
}

export const evRepricingStatusVariantMap: Record<EvRepricingStatus, BadgeVariant> = {
  Repriced: "success",
  Pending: "info",
  Exception: "warning",
  Failed: "danger",
}

export const mockEvRepricedContracts: EvRepricedContract[] = [
  {
    id: "1",
    vehicleId: "VEH-EV-4200",
    plateNumber: "LAG-310-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    repricingStatus: "Repriced",
    dailyRemittance: 3850,
    lastRepricedAt: "2026-07-26",
  },
  {
    id: "2",
    vehicleId: "VEH-EV-4201",
    plateNumber: "LAG-455-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    repricingStatus: "Repriced",
    dailyRemittance: 3920,
    lastRepricedAt: "2026-07-25",
  },
  {
    id: "3",
    vehicleId: "VEH-EV-4202",
    plateNumber: "ABJ-118-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Abuja",
    refurbishmentStatus: "Pending",
    ruleCode: null,
    ruleVersion: null,
    repricingStatus: "Pending",
    dailyRemittance: 0,
    lastRepricedAt: "2026-07-24",
  },
  {
    id: "4",
    vehicleId: "VEH-EV-4203",
    plateNumber: "KDA 210X",
    vehicleModel: "MAX Tri EV",
    country: "Kenya",
    city: "Nairobi",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-002",
    ruleVersion: "v2",
    repricingStatus: "Repriced",
    dailyRemittance: 4210,
    lastRepricedAt: "2026-07-23",
  },
  {
    id: "5",
    vehicleId: "VEH-EV-4204",
    plateNumber: "KDB 774X",
    vehicleModel: "MAX Tri EV",
    country: "Kenya",
    city: "Nairobi",
    refurbishmentStatus: "Draft",
    ruleCode: "RR-002",
    ruleVersion: "v2",
    repricingStatus: "Exception",
    dailyRemittance: 3990,
    lastRepricedAt: "2026-07-22",
  },
  {
    id: "6",
    vehicleId: "VEH-EV-4205",
    plateNumber: "IBD-092-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Ibadan",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    repricingStatus: "Failed",
    dailyRemittance: 3780,
    lastRepricedAt: "2026-07-20",
  },
  {
    id: "7",
    vehicleId: "VEH-EV-4206",
    plateNumber: "LAG-620-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    repricingStatus: "Repriced",
    dailyRemittance: 3865,
    lastRepricedAt: "2026-07-18",
  },
  {
    id: "8",
    vehicleId: "VEH-EV-4207",
    plateNumber: "KDC 331X",
    vehicleModel: "MAX Tri EV",
    country: "Kenya",
    city: "Mombasa",
    refurbishmentStatus: "Pending",
    ruleCode: null,
    ruleVersion: null,
    repricingStatus: "Pending",
    dailyRemittance: 0,
    lastRepricedAt: "2026-07-15",
  },
  {
    id: "9",
    vehicleId: "VEH-EV-4208",
    plateNumber: "ABJ-247-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Abuja",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-001",
    ruleVersion: "v2",
    repricingStatus: "Repriced",
    dailyRemittance: 3705,
    lastRepricedAt: "2026-07-10",
  },
  {
    id: "10",
    vehicleId: "VEH-EV-4209",
    plateNumber: "KDA 558X",
    vehicleModel: "MAX Tri EV",
    country: "Kenya",
    city: "Nairobi",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-002",
    ruleVersion: "v1",
    repricingStatus: "Repriced",
    dailyRemittance: 4155,
    lastRepricedAt: "2026-07-05",
  },
  {
    id: "11",
    vehicleId: "VEH-EV-4210",
    plateNumber: "LAG-803-MX",
    vehicleModel: "MAX Bolt 2W",
    country: "Nigeria",
    city: "Lagos",
    refurbishmentStatus: "Draft",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    repricingStatus: "Exception",
    dailyRemittance: 3840,
    lastRepricedAt: "2026-06-28",
  },
  {
    id: "12",
    vehicleId: "VEH-EV-4211",
    plateNumber: "KDB 902X",
    vehicleModel: "MAX Tri EV",
    country: "Kenya",
    city: "Mombasa",
    refurbishmentStatus: "Completed",
    ruleCode: "RR-002",
    ruleVersion: "v2",
    repricingStatus: "Repriced",
    dailyRemittance: 4080,
    lastRepricedAt: "2026-06-20",
  },
]
