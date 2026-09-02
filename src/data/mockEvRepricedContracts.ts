// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine > EV Repricing tab.
// A read-only audit register of every EV contract the scheduled repricing engine has
// touched, along with the rule that was applied and the resulting daily remittance.

export type RefurbishmentStatus = "Completed" | "Pending" | "Draft"
export type EvRepricingStatus = "Repriced" | "Pending" | "Exception" | "Failed"

export interface EvRepricedContract {
  id: string
  /** Format: CT-EV-XXXX */
  contractId: string
  championName: string
  /** Format: CH-XXXX */
  championId: string
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
    contractId: "CT-EV-4200",
    championName: "Chidi Okonkwo",
    championId: "CH-9100",
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
    contractId: "CT-EV-4201",
    championName: "Amara Nwachukwu",
    championId: "CH-9101",
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
    contractId: "CT-EV-4202",
    championName: "Tunde Balogun",
    championId: "CH-9102",
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
    contractId: "CT-EV-4203",
    championName: "Wanjiru Kamau",
    championId: "CH-9103",
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
    contractId: "CT-EV-4204",
    championName: "Otieno Odhiambo",
    championId: "CH-9104",
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
    contractId: "CT-EV-4205",
    championName: "Ifeoma Eze",
    championId: "CH-9105",
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
    contractId: "CT-EV-4206",
    championName: "Segun Afolabi",
    championId: "CH-9106",
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
    contractId: "CT-EV-4207",
    championName: "Achieng Adhiambo",
    championId: "CH-9107",
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
    contractId: "CT-EV-4208",
    championName: "Emeka Obiora",
    championId: "CH-9108",
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
    contractId: "CT-EV-4209",
    championName: "Njeri Mwangi",
    championId: "CH-9109",
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
    contractId: "CT-EV-4210",
    championName: "Bola Adeyemi",
    championId: "CH-9110",
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
    contractId: "CT-EV-4211",
    championName: "Kiptoo Cherono",
    championId: "CH-9111",
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
