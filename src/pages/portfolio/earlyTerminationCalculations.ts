import { differenceInCalendarMonths, parse } from "date-fns"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"

export function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export interface SettlementQuote {
  monthsElapsed: number
  remainingTenorMonths: number
  expectedCollections: number
  collectionRate: number
  outstandingBalance: number
  remainingContractValue: number
  settlementAmount: number
}

// "Component-level recovery": Outstanding Balance is what's currently in arrears against
// the expected remittance schedule; Settlement Amount is the full early-exit payoff — the
// remaining contract value (revenue not yet collected) net of any applicable credits.
export function buildSettlementQuote(contract: EarlyTerminationContract, settlementDate: Date): SettlementQuote {
  const start = parse(contract.startDate, "dd MMM yyyy", new Date())
  const monthsElapsed = Math.max(0, Math.min(contract.tenorMonths, differenceInCalendarMonths(settlementDate, start)))
  const remainingTenorMonths = Math.max(0, contract.tenorMonths - monthsElapsed)

  const expectedCollections = contract.dailyRemittance * contract.collectionDaysPerMonth * monthsElapsed
  const collectionRate = expectedCollections > 0 ? (contract.actualCollections / expectedCollections) * 100 : 0
  const outstandingBalance = Math.max(0, expectedCollections - contract.actualCollections)

  const remainingContractValue = Math.max(0, contract.totalContractRevenue - contract.actualCollections)
  const settlementAmount = Math.max(0, remainingContractValue - contract.applicableCredits)

  return {
    monthsElapsed,
    remainingTenorMonths,
    expectedCollections,
    collectionRate,
    outstandingBalance,
    remainingContractValue,
    settlementAmount,
  }
}
