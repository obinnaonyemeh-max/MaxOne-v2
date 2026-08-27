import { type WizardFields } from "./types"

export function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function totalVehiclePurchaseCost(s: WizardFields): number {
  return s.basePurchasePriceChassis + s.basePurchasePriceBattery + s.basePurchasePriceCharger + s.shippingAndFreight + s.importDutiesAndTaxes
}

export function blendedCostOfFunds(s: WizardFields): number {
  return (s.debtCostOfFundsPercent * s.debtFundingMixPercent) / 100 + (s.equityCostOfFundsPercent * s.equityFundingMixPercent) / 100
}

export function fundingMixIsValid(s: WizardFields): boolean {
  return Math.abs(s.debtFundingMixPercent + s.equityFundingMixPercent - 100) < 0.01
}

export function totalCostOfFunds(s: WizardFields): number {
  return (blendedCostOfFunds(s) / 100) * totalVehiclePurchaseCost(s) + s.lenderProcessingFee
}

export function totalOnboardingCosts(s: WizardFields): number {
  return (
    s.tracker +
    s.loadingAndOffloading +
    s.paintingAndBranding +
    s.safetyTracking +
    s.fuelForTesting +
    s.licenceAndRegistration +
    s.weldingBrackets +
    s.vest +
    s.helmet
  )
}

// A working revenue estimate, available from the first stage onward: the vehicle cost
// grossed up by the target margin. Stage 11 recomputes a fuller version once every cost
// category is known, but this proxy is what the VAT badge (Stage 6) reacts to live.
export function proxyRevenue(s: WizardFields): number {
  const gmFraction = Math.min(0.99, Math.max(0, s.targetGrossMarginPercent / 100))
  return totalVehiclePurchaseCost(s) / (1 - gmFraction)
}

export function vatAutoComputed(s: WizardFields): number {
  return (s.vatRatePercent / 100) * Math.max(0, proxyRevenue(s) - totalVehiclePurchaseCost(s))
}

export function totalOperationalCosts(s: WizardFields): number {
  return s.recoveryCost + s.fieldOperations + s.techAndPlatform + vatAutoComputed(s)
}

export function hmoAutoComputed(s: WizardFields): number {
  return s.monthlyHmoValue * s.baseTenorMonths
}

export function totalMaxAdvantageCosts(s: WizardFields): number {
  return s.maintenanceAndServicing + s.lifeAssurance + s.emergencyResponse + hmoAutoComputed(s)
}

export function totalSalesMarketingCosts(s: WizardFields): number {
  return s.marketingAndCustomerAcquisition + s.referralProgramme + s.brandAndContent
}

export function comprehensiveInsuranceCost(s: WizardFields): number {
  return (s.comprehensiveInsuranceRatePercent / 100) * totalVehiclePurchaseCost(s) * (s.baseTenorMonths / 12)
}

export function refurbishmentProvisionCost(s: WizardFields): number {
  return (s.refurbishmentProvisionRatePercent / 100) * totalVehiclePurchaseCost(s)
}

export function defaultProvisionCost(s: WizardFields): number {
  return (s.defaultProvisionRatePercent / 100) * totalVehiclePurchaseCost(s)
}

export function totalRiskContingencyCosts(s: WizardFields): number {
  return comprehensiveInsuranceCost(s) + refurbishmentProvisionCost(s) + defaultProvisionCost(s)
}

export function totalCostBase(s: WizardFields): number {
  return (
    totalVehiclePurchaseCost(s) +
    totalCostOfFunds(s) +
    totalOnboardingCosts(s) +
    totalOperationalCosts(s) +
    totalMaxAdvantageCosts(s) +
    totalSalesMarketingCosts(s) +
    totalRiskContingencyCosts(s)
  )
}

export interface IncomeStatementSummary {
  requiredRevenue: number
  costOfSales: number
  grossProfit: number
  grossMargin: number
  opex: number
  netProfit: number
  netMargin: number
  totalDays: number
  dailyRemittanceTarget: number
  maxAdvantageDailyTarget: number
  batteryAccessDailyTarget: number
}

export function buildIncomeStatement(s: WizardFields): IncomeStatementSummary {
  const costBase = totalCostBase(s)
  const gmFraction = Math.min(0.99, Math.max(0, s.targetGrossMarginPercent / 100))
  const requiredRevenue = costBase / (1 - gmFraction)

  const costOfSales = totalVehiclePurchaseCost(s) + totalCostOfFunds(s)
  const grossProfit = requiredRevenue - costOfSales
  const grossMargin = requiredRevenue > 0 ? (grossProfit / requiredRevenue) * 100 : 0

  const opex = totalOnboardingCosts(s) + totalOperationalCosts(s) + totalMaxAdvantageCosts(s) + totalSalesMarketingCosts(s) + totalRiskContingencyCosts(s)
  const netProfit = requiredRevenue * (s.targetNetMarginPercent / 100)
  const netMargin = s.targetNetMarginPercent

  const totalDays = s.baseTenorMonths * s.collectionDaysPerMonth
  const dailyRemittanceTarget = totalDays > 0 ? requiredRevenue / totalDays : 0
  const maxAdvantageDailyTarget = totalDays > 0 ? (totalMaxAdvantageCosts(s) * (1 + s.targetMaxAdvantageMarginPercent / 100)) / totalDays : 0
  const batteryAccessDailyTarget = s.dailyBatterySwapSubsidy * (1 + s.targetBatteryAccessMarginPercent / 100)

  return {
    requiredRevenue,
    costOfSales,
    grossProfit,
    grossMargin,
    opex,
    netProfit,
    netMargin,
    totalDays,
    dailyRemittanceTarget,
    maxAdvantageDailyTarget,
    batteryAccessDailyTarget,
  }
}
