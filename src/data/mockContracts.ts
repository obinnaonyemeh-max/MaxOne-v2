// Mock data for Portfolio > Contracts.
// Every contract carries an overall lifecycle `status` (drives the stat-card row)
// and a `category` describing which workflow queue it sits in (drives the table tabs).
// "Standard" contracts only ever surface on the "All Contracts" tab.

export type ContractStatus = "Active" | "Paused" | "Marked for Closure" | "Completed"

export type ContractCategory =
  | "Standard"
  | "Initiated"
  | "Restructured"
  | "Pending Approval"
  | "Disputed"

export type DisputeStatus = "Pending Resolve" | "Resolved"

export interface ContractMetrics {
  hpAmount: number
  totalDurationDays: number
  dailyRemittanceAmount: number
  excessPayments: number
  totalAmountRemitted: number
  amortisationStartDate: string
  amortisationEndDate: string
  tranches: number
}

export interface DisputeComment {
  rationale: string
  reporter: string
  timestamp: string
}

export interface Contract {
  id: string
  contractId: string
  championName: string
  maxId: string
  location: string
  vehiclePlate: string
  vehicleType: "Two-Wheeler" | "Three-Wheeler" | "Four-Wheeler"
  startDate: string
  endDate: string
  monthlyAmount: number
  outstandingBalance: number
  status: ContractStatus
  category: ContractCategory
  metrics: ContractMetrics
  disputeStatus?: DisputeStatus
  disputeComment?: DisputeComment
}

type ContractBase = Omit<Contract, "metrics" | "disputeStatus" | "disputeComment">

// Rows visible in the reference design
const seedContractsBase: ContractBase[] = [
  { id: "1", contractId: "CTR-2024-00341", championName: "Musa Yeboah", maxId: "MAX-CH-JJ-7391", location: "Jinja", vehiclePlate: "KJA-771-XY", vehicleType: "Two-Wheeler", startDate: "12 Jan 2024", endDate: "12 Jan 2026", monthlyAmount: 45000, outstandingBalance: 0, status: "Active", category: "Standard" },
  { id: "2", contractId: "CTR-2024-00358", championName: "Fatima Kanu", maxId: "MAX-CH-PH-4763", location: "Port Harcourt", vehiclePlate: "PHR-204-KJ", vehicleType: "Four-Wheeler", startDate: "03 Feb 2024", endDate: "03 Feb 2027", monthlyAmount: 128000, outstandingBalance: 256000, status: "Paused", category: "Disputed" },
  { id: "3", contractId: "CTR-2024-00362", championName: "Ada Uche", maxId: "MAX-CH-MB-7855", location: "Mombasa", vehiclePlate: "MBS-118-QT", vehicleType: "Three-Wheeler", startDate: "19 Feb 2024", endDate: "19 Feb 2026", monthlyAmount: 72000, outstandingBalance: 0, status: "Completed", category: "Standard" },
  { id: "4", contractId: "CTR-2024-00375", championName: "Chuka Njoku", maxId: "MAX-CH-BC-7949", location: "Benin City", vehiclePlate: "BEN-559-LM", vehicleType: "Two-Wheeler", startDate: "27 Feb 2024", endDate: "27 Feb 2026", monthlyAmount: 45000, outstandingBalance: 0, status: "Active", category: "Initiated" },
  { id: "5", contractId: "CTR-2024-00389", championName: "Ada Yeboah", maxId: "MAX-CH-TM-5042", location: "Tamale", vehiclePlate: "TML-092-RS", vehicleType: "Four-Wheeler", startDate: "05 Mar 2024", endDate: "05 Mar 2027", monthlyAmount: 128000, outstandingBalance: 64000, status: "Active", category: "Restructured" },
  { id: "6", contractId: "CTR-2024-00401", championName: "Ada Okonkwo", maxId: "MAX-CH-KU-1571", location: "Kumasi", vehiclePlate: "KUM-347-VD", vehicleType: "Two-Wheeler", startDate: "14 Mar 2024", endDate: "14 Mar 2026", monthlyAmount: 45000, outstandingBalance: 45000, status: "Marked for Closure", category: "Standard" },
  { id: "7", contractId: "CTR-2024-00417", championName: "Chinedu Eze", maxId: "MAX-CH-MB-1202", location: "Mombasa", vehiclePlate: "MBS-621-WA", vehicleType: "Three-Wheeler", startDate: "22 Mar 2024", endDate: "22 Mar 2026", monthlyAmount: 72000, outstandingBalance: 144000, status: "Paused", category: "Pending Approval" },
  { id: "8", contractId: "CTR-2024-00429", championName: "Chinedu Balogun", maxId: "MAX-CH-KP-7045", location: "Kampala", vehiclePlate: "KPL-880-EF", vehicleType: "Four-Wheeler", startDate: "01 Apr 2024", endDate: "01 Apr 2027", monthlyAmount: 128000, outstandingBalance: 0, status: "Active", category: "Standard" },
  { id: "9", contractId: "CTR-2024-00436", championName: "Nia Kamau", maxId: "MAX-CH-MB-6638", location: "Mbarara", vehiclePlate: "MBR-215-GH", vehicleType: "Two-Wheeler", startDate: "09 Apr 2024", endDate: "09 Apr 2026", monthlyAmount: 45000, outstandingBalance: 0, status: "Active", category: "Initiated" },
  { id: "10", contractId: "CTR-2024-00448", championName: "Kwame Diallo", maxId: "MAX-CH-MB-3231", location: "Mbarara", vehiclePlate: "MBR-663-IJ", vehicleType: "Three-Wheeler", startDate: "17 Apr 2024", endDate: "17 Apr 2026", monthlyAmount: 72000, outstandingBalance: 0, status: "Completed", category: "Standard" },
  { id: "11", contractId: "CTR-2024-00455", championName: "Adaeze Owusu", maxId: "MAX-CH-KU-7732", location: "Kumasi", vehiclePlate: "KUM-904-KL", vehicleType: "Four-Wheeler", startDate: "25 Apr 2024", endDate: "25 Apr 2027", monthlyAmount: 128000, outstandingBalance: 192000, status: "Paused", category: "Disputed" },
  { id: "12", contractId: "CTR-2024-00467", championName: "Fatima Adebayo", maxId: "MAX-CH-JJ-6158", location: "Jinja", vehiclePlate: "KJA-330-MN", vehicleType: "Two-Wheeler", startDate: "03 May 2024", endDate: "03 May 2026", monthlyAmount: 45000, outstandingBalance: 0, status: "Active", category: "Standard" },
]

const firstNames = ["Emeka", "Amara", "Tunde", "Ngozi", "Yusuf", "Bola", "Kofi", "Zainab", "Femi", "Chidi", "Aisha", "Segun"]
const lastNames = ["Mensah", "Achebe", "Bello", "Okafor", "Adeyemi", "Nwosu", "Ofori", "Danjuma", "Ibrahim", "Eze", "Kamau", "Yeboah"]
const locationCodes: [string, string][] = [
  ["Jinja", "JJ"], ["Port Harcourt", "PH"], ["Mombasa", "MB"], ["Benin City", "BC"],
  ["Tamale", "TM"], ["Kumasi", "KU"], ["Kampala", "KP"], ["Mbarara", "MB"],
]
const vehicleTypePool: Contract["vehicleType"][] = ["Two-Wheeler", "Three-Wheeler", "Four-Wheeler"]
const monthlyAmountByType: Record<Contract["vehicleType"], number> = {
  "Two-Wheeler": 45000,
  "Three-Wheeler": 72000,
  "Four-Wheeler": 128000,
}

// Category pool weighted so ~5/9 of records are "Standard" (All Contracts only)
// and the remaining ~4/9 are split across the four workflow queues.
const categoryPool: ContractCategory[] = [
  "Standard",
  "Standard",
  "Standard",
  "Standard",
  "Standard",
  "Initiated",
  "Restructured",
  "Pending Approval",
  "Disputed",
]

// Status pool per category — keeps status/category pairings realistic
// (e.g. a "Disputed" contract is never shown as "Completed").
const statusPoolByCategory: Record<ContractCategory, ContractStatus[]> = {
  Standard: ["Active", "Active", "Paused", "Marked for Closure", "Completed"],
  Initiated: ["Active", "Active", "Paused"],
  Restructured: ["Active", "Paused"],
  "Pending Approval": ["Active", "Paused"],
  Disputed: ["Paused", "Active"],
}

// Deterministically extend to 56 rows so pagination and all 5 tabs have volume
const extraContractsBase: ContractBase[] = Array.from({ length: 44 }, (_, i) => {
  const n = i + 13
  const [location, code] = locationCodes[i % locationCodes.length]
  const vehicleType = vehicleTypePool[i % vehicleTypePool.length]
  const category = categoryPool[i % categoryPool.length]
  const statusPool = statusPoolByCategory[category]
  const status = statusPool[i % statusPool.length]
  const monthlyAmount = monthlyAmountByType[vehicleType]
  const isOutstanding = status === "Paused" || status === "Marked for Closure"

  return {
    id: String(n),
    contractId: `CTR-2024-${String(500 + n * 7).padStart(5, "0")}`,
    championName: `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`,
    maxId: `MAX-CH-${code}-${1000 + n * 7}`,
    location,
    vehiclePlate: `${code}-${100 + ((i * 37) % 900)}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 5) % 26))}`,
    vehicleType,
    startDate: `${10 + (i % 18)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2024`,
    endDate: `${10 + (i % 18)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} ${2026 + (i % 2)}`,
    monthlyAmount,
    outstandingBalance: isOutstanding ? monthlyAmount * (1 + (i % 3)) : 0,
    status,
    category,
  }
})

// Hire-purchase tenor by vehicle class, used to derive the metrics snapshot
// (HP amount, daily remittance, tranches, etc.) shown in the detail drawer.
const tenorDaysByType: Record<Contract["vehicleType"], number> = {
  "Two-Wheeler": 365,
  "Three-Wheeler": 545,
  "Four-Wheeler": 730,
}

const disputeRationalePool = [
  "Champion disputes the outstanding balance, citing two remittances made via bank transfer that were not reflected in the ledger.",
  "Vehicle was involved in an accident prior to handover; champion is contesting liability for the resulting repair deduction.",
  "Guarantor claims the hire-purchase terms were altered after signing without their consent.",
  "Champion reports being double-charged for the same remittance cycle by two different payment channels.",
]
const disputeReporterPool = ["Samson Oluwaseun", "Fatima Bello", "Tunde Bakare", "Ngozi Eze"]
const disputeTimestampPool = [
  "14 Jul 2026, 10:32 AM",
  "22 Jul 2026, 03:15 PM",
  "05 Aug 2026, 09:04 AM",
  "12 Aug 2026, 05:47 PM",
]

function withMetrics(base: ContractBase, index: number): Contract {
  const durationDays = tenorDaysByType[base.vehicleType]
  const dailyRemittanceAmount = Math.round(base.monthlyAmount / 30)
  const hpAmount = dailyRemittanceAmount * durationDays
  const tranches = Math.round(durationDays / 30)
  const excessPayments = index % 7 === 0 ? dailyRemittanceAmount * 2 : 0
  const progress = 0.3 + (index % 5) * 0.15
  const totalAmountRemitted = Math.round(hpAmount * Math.min(progress, 0.95))

  const metrics: ContractMetrics = {
    hpAmount,
    totalDurationDays: durationDays,
    dailyRemittanceAmount,
    excessPayments,
    totalAmountRemitted,
    amortisationStartDate: base.startDate,
    amortisationEndDate: base.endDate,
    tranches,
  }

  if (base.category !== "Disputed") {
    return { ...base, metrics }
  }

  const disputeStatus: DisputeStatus = index % 2 === 0 ? "Pending Resolve" : "Resolved"
  const disputeComment: DisputeComment = {
    rationale: disputeRationalePool[index % disputeRationalePool.length],
    reporter: disputeReporterPool[index % disputeReporterPool.length],
    timestamp: disputeTimestampPool[index % disputeTimestampPool.length],
  }

  return { ...base, metrics, disputeStatus, disputeComment }
}

export const mockContracts: Contract[] = [...seedContractsBase, ...extraContractsBase].map(withMetrics)

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const statusVariantMap: Record<ContractStatus, BadgeVariant> = {
  Active: "success",
  Paused: "yard",
  "Marked for Closure": "warning",
  Completed: "default",
}

export const categoryVariantMap: Record<ContractCategory, BadgeVariant> = {
  Standard: "default",
  Initiated: "info",
  Restructured: "yard",
  "Pending Approval": "warning",
  Disputed: "danger",
}

export const disputeStatusVariantMap: Record<DisputeStatus, BadgeVariant> = {
  "Pending Resolve": "danger",
  Resolved: "success",
}

// Headline figures for the stat-card row — always computed off the full
// portfolio, independent of whichever tab/table filter is active.
export const contractStats = {
  all: mockContracts.length,
  active: mockContracts.filter((c) => c.status === "Active").length,
  paused: mockContracts.filter((c) => c.status === "Paused").length,
  markedForClosure: mockContracts.filter((c) => c.status === "Marked for Closure").length,
  completed: mockContracts.filter((c) => c.status === "Completed").length,
}
