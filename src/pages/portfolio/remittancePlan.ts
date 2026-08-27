import { type PricingTemplate } from "@/data/mockPricingTemplates"
import {
  type PricingBatchRecord,
  categoryTotal,
  vehiclePurchaseCostTotal,
} from "@/data/mockPricingBatchRecords"

export interface RemittanceSchedule {
  tenorMonths: number
  daysPerMonth: number
  totalDays: number
  repaymentAmountDaily: number
  maxAdvantageDaily: number
  batteryAccessFeesDaily: number
  batterySwapFeeSubsidyDaily: number
  dailyRemittance: number
  equityContributionPercent: number
  equityContribution: number
}

// The schedule is always re-derived from the batch's linked template + its current cost
// categories — nothing here is stored on the batch, so it stays in sync automatically.
export function buildRemittanceSchedule(batch: PricingBatchRecord, template: PricingTemplate): RemittanceSchedule {
  const s = template.remittanceSchedule
  const totalDays = s.tenorMonths * s.daysPerMonth
  const dailyRemittance = s.repaymentAmountDaily + s.maxAdvantageDaily + s.batteryAccessFeesDaily + s.batterySwapFeeSubsidyDaily
  const assetCost = vehiclePurchaseCostTotal(batch.costCategories)
  const equityContribution = (s.equityContributionPercent / 100) * assetCost

  return {
    tenorMonths: s.tenorMonths,
    daysPerMonth: s.daysPerMonth,
    totalDays,
    repaymentAmountDaily: s.repaymentAmountDaily,
    maxAdvantageDaily: s.maxAdvantageDaily,
    batteryAccessFeesDaily: s.batteryAccessFeesDaily,
    batterySwapFeeSubsidyDaily: s.batterySwapFeeSubsidyDaily,
    dailyRemittance,
    equityContributionPercent: s.equityContributionPercent,
    equityContribution,
  }
}

const COST_OF_SALES_KEYS = ["vehiclePurchaseCost", "costOfFunds"] as const
const OPEX_KEYS = ["onboardingCost", "operationalCost", "maxAdvantage", "salesAndMarketing", "risksAndContingency"] as const

export interface RemittancePlanSummary {
  totalRevenue: number
  totalCostOfSales: number
  totalOpex: number
  grossProfit: number
  grossMargin: number
  netIncome: number
  netIncomeMargin: number
}

// A simple, self-consistent P&L bridging the revenue side (remittance schedule) with the
// cost side (the batch's cost categories): Vehicle Purchase Cost + Cost of Funds are
// treated as Cost of Sales, everything else as Opex.
export function buildRemittancePlanSummary(batch: PricingBatchRecord, schedule: RemittanceSchedule): RemittancePlanSummary {
  const assetCost = vehiclePurchaseCostTotal(batch.costCategories)
  const totalRevenue = schedule.dailyRemittance * schedule.totalDays

  const totalCostOfSales = batch.costCategories
    .filter((c) => (COST_OF_SALES_KEYS as readonly string[]).includes(c.key))
    .reduce((sum, c) => sum + categoryTotal(c, assetCost), 0)

  const totalOpex = batch.costCategories
    .filter((c) => (OPEX_KEYS as readonly string[]).includes(c.key))
    .reduce((sum, c) => sum + categoryTotal(c, assetCost), 0)

  const grossProfit = totalRevenue - totalCostOfSales
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
  const netIncome = grossProfit - totalOpex
  const netIncomeMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0

  return { totalRevenue, totalCostOfSales, totalOpex, grossProfit, grossMargin, netIncome, netIncomeMargin }
}
