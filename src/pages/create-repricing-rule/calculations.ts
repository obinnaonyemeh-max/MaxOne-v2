import { RECOVERY_COMPONENTS, type PreviousContractBaseline } from "./referenceData"
import { SAMPLE_PREVIOUS_CONTRACT } from "@/data/mockRepricingEngine"
import { type WizardFields } from "./types"

export function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function totalCapitalInvestment(s: WizardFields): number {
  return s.refurbishmentCost + s.batteryCost + s.chargerCost + s.trackerCost
}

export function redeploymentTaxableBase(s: WizardFields): number {
  return s.licensingRegistrationCost + s.paintingBrandingCost + s.helmetCost + s.vestCost + s.recoveryFeeCost
}

export function vatRecomputed(s: WizardFields): number {
  return (s.vatPercent / 100) * redeploymentTaxableBase(s)
}

export function totalRedeploymentCost(s: WizardFields): number {
  return redeploymentTaxableBase(s) + vatRecomputed(s)
}

export function totalNewInvestment(s: WizardFields): number {
  return totalCapitalInvestment(s) + totalRedeploymentCost(s)
}

// Retrieved units are redeployed for a shorter horizon than a fresh unit — EV packs currently
// carry a slightly longer remaining useful life than ICE units in the fleet mix.
export function defaultTenorMonths(s: WizardFields): number {
  return s.vehicleType === "ICE" ? 12 : 14
}

export function equityFundingPercent(s: WizardFields): number {
  return Math.max(0, 100 - s.debtFundingPercent)
}

export function newCostOfFunds(s: WizardFields): number {
  const capital = totalCapitalInvestment(s)
  const debtPortion = capital * (s.debtFundingPercent / 100)
  const tenorYears = defaultTenorMonths(s) / 12
  const interest = debtPortion * (s.debtInterestRatePercent / 100) * tenorYears
  const processingFee = debtPortion * (s.lenderProcessingFeePercent / 100)
  return interest + processingFee
}

export function totalCostOfSales(s: WizardFields): number {
  return totalCapitalInvestment(s) + newCostOfFunds(s)
}

export function previousContractBaseline(s: WizardFields): PreviousContractBaseline {
  return SAMPLE_PREVIOUS_CONTRACT[s.vehicleType || "EV"]
}

export function carriedForwardRecoveries(s: WizardFields): number {
  const baseline = previousContractBaseline(s)
  return RECOVERY_COMPONENTS.reduce((sum, component) => {
    const rule = s.recoveryRules[component.key]
    const percent = rule.percent ?? 0
    return sum + baseline[component.key] * (percent / 100)
  }, 0)
}

export function recoveryRulesAreComplete(s: WizardFields): boolean {
  return RECOVERY_COMPONENTS.every((component) => s.recoveryRules[component.key].percent !== null)
}

export interface RepricedIncomeStatement {
  totalCustomerContractValue: number
  newFinancedCapital: number
  newCostOfFunds: number
  totalCostOfSales: number
  grossProfit: number
  grossMarginPercent: number
  operatingExpenses: number
  netProfit: number
  netMarginPercent: number
  carriedForwardRecoveries: number
  feasibleTenorMonths: number
  dailyRemittance: number
  maxAllowedDailyRemittance: number
  bindingConstraint: string
}

export function buildRepricedIncomeStatement(s: WizardFields): RepricedIncomeStatement {
  const newFinancedCapital = totalCapitalInvestment(s)
  const cof = newCostOfFunds(s)
  const costOfSales = newFinancedCapital + cof
  const opex = totalRedeploymentCost(s)
  const recoveries = carriedForwardRecoveries(s)

  const costBase = costOfSales + opex + recoveries
  const gmFraction = Math.min(0.95, Math.max(0, s.minGrossMarginPercent / 100))
  const totalCustomerContractValue = gmFraction < 1 ? costBase / (1 - gmFraction) : costBase

  const grossProfit = totalCustomerContractValue - costOfSales
  const grossMarginPercent = totalCustomerContractValue > 0 ? (grossProfit / totalCustomerContractValue) * 100 : 0
  const netProfit = grossProfit - opex
  const netMarginPercent = totalCustomerContractValue > 0 ? (netProfit / totalCustomerContractValue) * 100 : 0

  const baseline = previousContractBaseline(s)
  const maxAllowedDailyRemittance = baseline.previousDailyRemittance * (s.maxDailyRemittancePercent / 100)
  const days = Math.max(1, s.collectionDaysPerMonth)
  const defaultTenor = defaultTenorMonths(s)
  const dailyAtDefaultTenor = totalCustomerContractValue / (defaultTenor * days)

  let feasibleTenorMonths = defaultTenor
  let bindingConstraint = "None"

  if (maxAllowedDailyRemittance > 0 && dailyAtDefaultTenor > maxAllowedDailyRemittance) {
    feasibleTenorMonths = Math.ceil(totalCustomerContractValue / (maxAllowedDailyRemittance * days))
    bindingConstraint = "Max Daily Remittance"
    if (feasibleTenorMonths > s.maxTenorMonths) {
      feasibleTenorMonths = s.maxTenorMonths
      bindingConstraint = "Max Tenor"
    }
  } else if (s.minDailyRemittance > 0 && dailyAtDefaultTenor < s.minDailyRemittance) {
    feasibleTenorMonths = Math.max(1, Math.floor(totalCustomerContractValue / (s.minDailyRemittance * days)))
    bindingConstraint = "Min Daily Remittance"
  } else if (defaultTenor > s.maxTenorMonths) {
    feasibleTenorMonths = s.maxTenorMonths
    bindingConstraint = "Max Tenor"
  }

  feasibleTenorMonths = Math.max(1, feasibleTenorMonths)
  const dailyRemittance = totalCustomerContractValue / (feasibleTenorMonths * days)

  return {
    totalCustomerContractValue,
    newFinancedCapital,
    newCostOfFunds: cof,
    totalCostOfSales: costOfSales,
    grossProfit,
    grossMarginPercent,
    operatingExpenses: opex,
    netProfit,
    netMarginPercent,
    carriedForwardRecoveries: recoveries,
    feasibleTenorMonths,
    dailyRemittance,
    maxAllowedDailyRemittance,
    bindingConstraint,
  }
}

export interface ConstraintBreach {
  key: string
  message: string
}

export function evaluateConstraintBreaches(s: WizardFields, statement: RepricedIncomeStatement): ConstraintBreach[] {
  const breaches: ConstraintBreach[] = []

  if (statement.grossMarginPercent < s.minGrossMarginPercent - 0.05) {
    breaches.push({
      key: "gross-margin",
      message: `Gross margin ${formatPercent(statement.grossMarginPercent)} is below the ${s.minGrossMarginPercent}% floor.`,
    })
  }
  if (statement.netMarginPercent < s.minNetMarginPercent - 0.05) {
    breaches.push({
      key: "net-margin",
      message: `Net margin ${formatPercent(statement.netMarginPercent)} is below the ${s.minNetMarginPercent}% floor.`,
    })
  }
  if (statement.dailyRemittance < s.minDailyRemittance) {
    breaches.push({
      key: "min-daily",
      message: `Daily remittance ${formatCurrency(statement.dailyRemittance)} is below the ${formatCurrency(s.minDailyRemittance)} minimum.`,
    })
  }
  if (statement.dailyRemittance > statement.maxAllowedDailyRemittance + 1) {
    breaches.push({
      key: "max-daily",
      message: `Daily remittance ${formatCurrency(statement.dailyRemittance)} exceeds the ${formatCurrency(statement.maxAllowedDailyRemittance)} cap (${s.maxDailyRemittancePercent}% of previous daily remittance) even at the ${s.maxTenorMonths}-month tenor ceiling.`,
    })
  }

  return breaches
}
