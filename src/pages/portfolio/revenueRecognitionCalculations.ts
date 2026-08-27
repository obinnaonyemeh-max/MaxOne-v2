import {
  templateCategoryTotal,
  templateVehiclePurchaseCostTotal,
  type PricingTemplate,
} from "@/data/mockPricingTemplates"

export interface RecognitionRow {
  key: string
  label: string
  totalRevenue: number
  percentAllocation: number
  dailyRemittance: number
}

export interface RecognitionSection {
  key: string
  title: string
  collapsible: boolean
  rows: RecognitionRow[]
}

export interface RevenueRecognitionBreakdown {
  tenorMonths: number
  collectionDaysPerMonth: number
  totalDays: number
  dailyRemittanceTotal: number
  totalContractRevenue: number
  sections: RecognitionSection[]
  grossProfit: number
  allocationStatusPercent: number
}

function findProcessingFeeValue(costOfFunds: PricingTemplate["costCategories"][number] | undefined): number {
  if (!costOfFunds) return 0
  const item = costOfFunds.lineItems.find((li) => li.id === "li-processing-fees" || li.id === "li-lender-processing-fee")
  return item?.defaultValue ?? 0
}

// Daily Remittance (this module) deliberately excludes the battery swap fee subsidy — it's
// a cost MAX pays out, not revenue collected, so it belongs in Cost Recovery, not here.
export function buildRevenueRecognition(template: PricingTemplate): RevenueRecognitionBreakdown {
  const s = template.remittanceSchedule
  const totalDays = s.tenorMonths * s.daysPerMonth
  const dailyRemittanceTotal = s.repaymentAmountDaily + s.maxAdvantageDaily + s.batteryAccessFeesDaily
  const totalContractRevenue = dailyRemittanceTotal * totalDays

  const assetCost = templateVehiclePurchaseCostTotal(template.costCategories)
  const categoryByKey = (key: string) => template.costCategories.find((c) => c.key === key)

  const costOfFundsCategory = categoryByKey("costOfFunds")
  const costOfFundsTotal = costOfFundsCategory ? templateCategoryTotal(costOfFundsCategory, assetCost) : 0
  const processingFeesRevenue = findProcessingFeeValue(costOfFundsCategory)
  const interestIncomeRevenue = Math.max(0, costOfFundsTotal - processingFeesRevenue)

  const maxAdvantageRevenue = s.maxAdvantageDaily * totalDays
  const batteryAccessRevenue = s.batteryAccessFeesDaily * totalDays
  const vehicleSaleRevenue = Math.max(0, s.repaymentAmountDaily * totalDays - interestIncomeRevenue - processingFeesRevenue)

  const row = (key: string, label: string, totalRevenue: number): RecognitionRow => ({
    key,
    label,
    totalRevenue,
    percentAllocation: totalContractRevenue > 0 ? (totalRevenue / totalContractRevenue) * 100 : 0,
    dailyRemittance: totalDays > 0 ? totalRevenue / totalDays : 0,
  })

  const revenueComponents: RecognitionRow[] = [
    row("vehicle-sale", "Vehicle Sale Revenue", vehicleSaleRevenue),
    row("interest-income", "Interest Income", interestIncomeRevenue),
    row("max-advantage-revenue", "MAX Advantage", maxAdvantageRevenue),
    row("battery-access-fees", "Battery Access Fees", batteryAccessRevenue),
    row("processing-fees", "Processing Fees", processingFeesRevenue),
  ]

  const onboardingCategory = categoryByKey("onboardingCost")
  const costRecoveryComponents: RecognitionRow[] = [
    row("vehicle-purchase-cost", "Vehicle Purchase Cost", assetCost),
    row("cost-of-funds", "Cost of Funds", costOfFundsTotal),
    row("onboarding-costs", "Onboarding Costs", onboardingCategory ? templateCategoryTotal(onboardingCategory, assetCost) : 0),
    row("battery-swap-subsidy", "Battery Swap Subsidy", s.batterySwapFeeSubsidyDaily * totalDays),
  ]

  const operationalCategory = categoryByKey("operationalCost")
  const maxAdvantageCostCategory = categoryByKey("maxAdvantage")
  const salesMarketingCategory = categoryByKey("salesAndMarketing")
  const riskCategory = categoryByKey("risksAndContingency")
  const operatingCostRecoveryComponents: RecognitionRow[] = [
    row("operational-costs", "Operational Costs", operationalCategory ? templateCategoryTotal(operationalCategory, assetCost) : 0),
    row("max-advantage-costs", "MAX Advantage Costs", maxAdvantageCostCategory ? templateCategoryTotal(maxAdvantageCostCategory, assetCost) : 0),
    row("sales-marketing-costs", "Sales & Marketing Costs", salesMarketingCategory ? templateCategoryTotal(salesMarketingCategory, assetCost) : 0),
    row("risk-contingency-costs", "Risk & Contingency Costs", riskCategory ? templateCategoryTotal(riskCategory, assetCost) : 0),
  ]

  const totalCostRecovery =
    costRecoveryComponents.reduce((sum, r) => sum + r.totalRevenue, 0) +
    operatingCostRecoveryComponents.reduce((sum, r) => sum + r.totalRevenue, 0)
  const grossProfit = totalContractRevenue - totalCostRecovery
  const profitRow = row("gross-profit", "Gross Profit", grossProfit)

  const allocationStatusPercent = revenueComponents.reduce((sum, r) => sum + r.percentAllocation, 0)

  return {
    tenorMonths: s.tenorMonths,
    collectionDaysPerMonth: s.daysPerMonth,
    totalDays,
    dailyRemittanceTotal,
    totalContractRevenue,
    sections: [
      { key: "revenue", title: "Revenue Components", collapsible: false, rows: revenueComponents },
      { key: "cost-recovery", title: "Cost Recovery Components", collapsible: true, rows: costRecoveryComponents },
      { key: "operating-cost-recovery", title: "Operating Cost Recovery", collapsible: true, rows: operatingCostRecoveryComponents },
      { key: "profit", title: "Profit Allocation", collapsible: false, rows: [profitRow] },
    ],
    grossProfit,
    allocationStatusPercent,
  }
}
