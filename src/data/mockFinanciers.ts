// Mock data for Portfolio > Funding > Financiers.
// A financier funds a batch of vehicles for MAX under a hire-purchase-style loan:
// the financier covers a percentage of the total vehicle cost (financierContributionPercent),
// the remainder is MAX's equity contribution, and the loan is repaid over `tenorInMonths`
// (after an optional `moratoriumInMonths` grace period) via periodic remittances.

export type FinancierStatus = "Active" | "Inactive"
export type RemittanceStatus = "Up to Date" | "Overdue" | "Pending First Remittance"
export type CollectionDenomination = "NGN" | "USD" | "GBP" | "EUR"

export interface Financier {
  id: string
  financierName: string
  financingPartner: string
  numberOfVehicles: number
  vehicleCost: number
  /** Derived: numberOfVehicles * vehicleCost */
  totalVehicleCost: number
  /** dd/mm/yyyy, per the create-form's date picker format */
  dateOfPurchase: string
  collectionDenomination: CollectionDenomination
  tenorInMonths: number
  moratoriumInMonths: number
  /** Percentage, e.g. 14.5 */
  interestRate: number
  transactionFees: number
  loanAmount: number
  financierContributionPercent: number
  equityContributionPercent: number
  /** Derived: loanAmount * (equityContributionPercent / 100) */
  equity: number
  status: FinancierStatus
  /** When the financier record was created, e.g. "14 Jul 2026" */
  dateCreated: string
  remittanceStatus: RemittanceStatus
  totalAmountRemitted: number
  outstandingBalance: number
}

export const FINANCING_PARTNERS: string[] = [
  "Yamaha",
  "Moniepoint",
  "VFD",
  "MAX",
  "The Christobel team",
  "Taiwo 3PL",
  "Nigeria Legion Corp",
]

export const COLLECTION_DENOMINATIONS: CollectionDenomination[] = ["NGN", "USD", "GBP", "EUR"]

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const financierStatusVariantMap: Record<FinancierStatus, BadgeVariant> = {
  Active: "success",
  Inactive: "default",
}

export const remittanceStatusVariantMap: Record<RemittanceStatus, BadgeVariant> = {
  "Up to Date": "success",
  Overdue: "danger",
  "Pending First Remittance": "warning",
}

interface FinancierSeed {
  id: string
  financierName: string
  financingPartner: string
  numberOfVehicles: number
  vehicleCost: number
  dateOfPurchase: string
  collectionDenomination: CollectionDenomination
  tenorInMonths: number
  moratoriumInMonths: number
  interestRate: number
  transactionFees: number
  financierContributionPercent: number
  status: FinancierStatus
  dateCreated: string
  remittanceProgress: number
}

const seeds: FinancierSeed[] = [
  { id: "1", financierName: "Lagos Fleet Expansion I", financingPartner: "Yamaha", numberOfVehicles: 40, vehicleCost: 2800000, dateOfPurchase: "12/01/2024", collectionDenomination: "NGN", tenorInMonths: 24, moratoriumInMonths: 2, interestRate: 14.5, transactionFees: 350000, financierContributionPercent: 70, status: "Active", dateCreated: "12 Jan 2024", remittanceProgress: 0.62 },
  { id: "2", financierName: "Abuja Two-Wheeler Batch", financingPartner: "Moniepoint", numberOfVehicles: 65, vehicleCost: 950000, dateOfPurchase: "03/02/2024", collectionDenomination: "NGN", tenorInMonths: 18, moratoriumInMonths: 1, interestRate: 16.0, transactionFees: 180000, financierContributionPercent: 60, status: "Active", dateCreated: "03 Feb 2024", remittanceProgress: 0.81 },
  { id: "3", financierName: "Port Harcourt Tricycle Fund", financingPartner: "VFD", numberOfVehicles: 28, vehicleCost: 1600000, dateOfPurchase: "19/02/2024", collectionDenomination: "NGN", tenorInMonths: 30, moratoriumInMonths: 3, interestRate: 18.5, transactionFees: 220000, financierContributionPercent: 55, status: "Active", dateCreated: "19 Feb 2024", remittanceProgress: 0.34 },
  { id: "4", financierName: "Kano Four-Wheeler Rollout", financingPartner: "MAX", numberOfVehicles: 22, vehicleCost: 4200000, dateOfPurchase: "27/02/2024", collectionDenomination: "NGN", tenorInMonths: 36, moratoriumInMonths: 3, interestRate: 15.75, transactionFees: 500000, financierContributionPercent: 65, status: "Active", dateCreated: "27 Feb 2024", remittanceProgress: 0.19 },
  { id: "5", financierName: "Ibadan Champion Onboarding", financingPartner: "The Christobel team", numberOfVehicles: 50, vehicleCost: 2600000, dateOfPurchase: "05/03/2024", collectionDenomination: "NGN", tenorInMonths: 24, moratoriumInMonths: 2, interestRate: 14.0, transactionFees: 320000, financierContributionPercent: 70, status: "Active", dateCreated: "05 Mar 2024", remittanceProgress: 0.97 },
  { id: "6", financierName: "Benin City Pilot Batch", financingPartner: "Taiwo 3PL", numberOfVehicles: 15, vehicleCost: 2750000, dateOfPurchase: "14/03/2024", collectionDenomination: "NGN", tenorInMonths: 18, moratoriumInMonths: 0, interestRate: 17.25, transactionFees: 150000, financierContributionPercent: 50, status: "Inactive", dateCreated: "14 Mar 2024", remittanceProgress: 1 },
  { id: "7", financierName: "Kaduna Delivery Fleet", financingPartner: "Nigeria Legion Corp", numberOfVehicles: 33, vehicleCost: 970000, dateOfPurchase: "22/03/2024", collectionDenomination: "NGN", tenorInMonths: 20, moratoriumInMonths: 1, interestRate: 19.0, transactionFees: 140000, financierContributionPercent: 60, status: "Active", dateCreated: "22 Mar 2024", remittanceProgress: 0.02 },
  { id: "8", financierName: "Enugu Champion Expansion", financingPartner: "Yamaha", numberOfVehicles: 45, vehicleCost: 2900000, dateOfPurchase: "01/04/2024", collectionDenomination: "NGN", tenorInMonths: 28, moratoriumInMonths: 2, interestRate: 15.0, transactionFees: 400000, financierContributionPercent: 68, status: "Active", dateCreated: "01 Apr 2024", remittanceProgress: 0.55 },
]

const namePool = [
  "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Benin City", "Kaduna", "Enugu",
  "Jos", "Ilorin", "Owerri", "Calabar", "Uyo", "Warri", "Onitsha", "Abeokuta",
]
const batchTypePool = ["Fleet Expansion", "Champion Onboarding", "Delivery Fleet", "Pilot Batch", "Rollout", "Renewal Batch"]
const monthPool = ["Apr", "May", "Jun", "Jul", "Aug"]

// Deterministically extend to 30 rows so pagination has real volume to page through.
const extraSeeds: FinancierSeed[] = Array.from({ length: 22 }, (_, i) => {
  const n = i + seeds.length + 1
  const partner = FINANCING_PARTNERS[i % FINANCING_PARTNERS.length]
  const status: FinancierStatus = i % 6 === 0 ? "Inactive" : "Active"
  const day = 2 + (i % 27)
  const month = monthPool[i % monthPool.length]
  const dateCreated = `${day} ${month} 2024`
  const dateOfPurchase = `${String(day).padStart(2, "0")}/${String(4 + (i % 5)).padStart(2, "0")}/2024`

  return {
    id: String(n),
    financierName: `${namePool[i % namePool.length]} ${batchTypePool[i % batchTypePool.length]}`,
    financingPartner: partner,
    numberOfVehicles: 10 + ((i * 7) % 55),
    vehicleCost: 900000 + ((i * 137000) % 3500000),
    dateOfPurchase,
    collectionDenomination: "NGN",
    tenorInMonths: 12 + ((i * 3) % 30),
    moratoriumInMonths: i % 4,
    interestRate: Math.round((13 + ((i * 1.7) % 8)) * 100) / 100,
    transactionFees: 100000 + ((i * 21000) % 350000),
    financierContributionPercent: 50 + ((i * 5) % 30),
    status,
    dateCreated,
    remittanceProgress: status === "Inactive" ? 1 : (i % 10) / 10,
  }
})

function buildFinancier(seed: FinancierSeed): Financier {
  const totalVehicleCost = seed.numberOfVehicles * seed.vehicleCost
  const loanAmount = Math.round(totalVehicleCost * (seed.financierContributionPercent / 100))
  const equityContributionPercent = 100 - seed.financierContributionPercent
  const equity = Math.round(loanAmount * (equityContributionPercent / 100))
  const totalAmountRemitted = Math.round(loanAmount * seed.remittanceProgress)
  const outstandingBalance = loanAmount - totalAmountRemitted

  const remittanceStatus: RemittanceStatus =
    seed.remittanceProgress <= 0
      ? "Pending First Remittance"
      : seed.status === "Active" && seed.remittanceProgress < 0.95 && seed.financierName.length % 5 === 0
        ? "Overdue"
        : "Up to Date"

  return {
    id: seed.id,
    financierName: seed.financierName,
    financingPartner: seed.financingPartner,
    numberOfVehicles: seed.numberOfVehicles,
    vehicleCost: seed.vehicleCost,
    totalVehicleCost,
    dateOfPurchase: seed.dateOfPurchase,
    collectionDenomination: seed.collectionDenomination,
    tenorInMonths: seed.tenorInMonths,
    moratoriumInMonths: seed.moratoriumInMonths,
    interestRate: seed.interestRate,
    transactionFees: seed.transactionFees,
    loanAmount,
    financierContributionPercent: seed.financierContributionPercent,
    equityContributionPercent,
    equity,
    status: seed.status,
    dateCreated: seed.dateCreated,
    remittanceStatus,
    totalAmountRemitted,
    outstandingBalance,
  }
}

export const mockFinanciers: Financier[] = [...seeds, ...extraSeeds].map(buildFinancier)

// Headline figures for the stat-card row — always computed off the full
// portfolio, independent of whichever page/filter is active.
export const financierStats = {
  total: mockFinanciers.length,
  active: mockFinanciers.filter((f) => f.status === "Active").length,
  totalLoanAmount: mockFinanciers.reduce((sum, f) => sum + f.loanAmount, 0),
  totalVehiclesFinanced: mockFinanciers.reduce((sum, f) => sum + f.numberOfVehicles, 0),
}
