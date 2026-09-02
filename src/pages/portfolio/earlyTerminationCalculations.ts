import { addMonths, differenceInCalendarMonths, parse } from "date-fns"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"

export function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

// For values that are conceptually a deduction (e.g. applicable credits) — puts the minus
// sign before the currency symbol ("- ₦54,699") instead of after it ("₦-54,699").
export function formatSignedCurrency(amount: number): string {
  return amount < 0 ? `- ${formatCurrency(-amount)}` : formatCurrency(amount)
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

// Recovery Analysis: breaks a contract's aggregate totals into pricing-template-style
// components (Cost of Sales, Operating Expense, Revenue, Margin) so recovery at early
// termination can be audited per line item rather than in aggregate.
//
// The mock contract model carries no per-component cost/revenue split, and several
// contracts' `pricingTemplateName` values (e.g. "ICE Tricycle · Keke Fleet") don't match
// any entry in `mockPricingTemplates`, so a join to that file isn't reliable here. Fixed
// percent-of-revenue allocations are used instead — the same "component share of total
// contract revenue" approach `buildRevenueRecognition` uses, just self-contained.
const COST_OF_SALES_ALLOCATION = {
  vehiclePurchaseCost: 0.55,
  costOfFunds: 0.08,
  onboardingCosts: 0.02,
}
const OPERATING_EXPENSE_ALLOCATION = {
  operationalCosts: 0.08,
  maxAdvantageCosts: 0.04,
  salesAndMarketingCosts: 0.03,
  riskAndContingencyCosts: 0.03,
}
const REVENUE_ALLOCATION = {
  vehicleSaleRevenue: 0.7,
  interestIncome: 0.15,
  maxAdvantage: 0.08,
  batteryAccessFees: 0.05,
  processingFees: 0.02,
}
const GROSS_PROFIT_ALLOCATION =
  1 -
  Object.values(COST_OF_SALES_ALLOCATION).reduce((a, b) => a + b, 0) -
  Object.values(OPERATING_EXPENSE_ALLOCATION).reduce((a, b) => a + b, 0)

// The 60/40 buffer rule: up to 40% of lifetime margin is always recoverable at ET (topped
// up from un-billed margin if needed); the remaining 60% is only recovered if already billed.
const GROSS_PROFIT_BUFFER_RATE = 0.4

export interface RecoveryRow {
  key: string
  label: string
  note?: string
  isTotal?: boolean
  values: number[]
}

export interface RecoverySection {
  key: string
  title: string
  rows: RecoveryRow[]
}

export interface RecoveryAnalysisBreakdown {
  componentColumns: string[]
  componentSections: RecoverySection[]
  marginColumns: string[]
  marginSection: RecoverySection
}

type RecoveryType = "capitalised" | "recurring"

function buildComponentRow(
  key: string,
  label: string,
  note: string,
  percentOfRevenue: number,
  contract: EarlyTerminationContract,
  quote: SettlementQuote,
  recoveryType: RecoveryType
): RecoveryRow {
  const lifetimeAmount = contract.totalContractRevenue * percentOfRevenue
  const billedToDate =
    contract.tenorMonths > 0 ? lifetimeAmount * (quote.monthsElapsed / contract.tenorMonths) : 0
  const recovered = contract.actualCollections * percentOfRevenue
  const overdue = Math.max(0, billedToDate - recovered)
  const unbilledForward = Math.max(0, lifetimeAmount - billedToDate)
  // Capitalised/sunk costs recover their full remaining balance at ET; recurring costs and
  // revenue only ever recover what's already overdue — un-billed forward amounts are dropped.
  const recoverableAtEt = recoveryType === "capitalised" ? overdue + unbilledForward : overdue

  return { key, label, note, values: [lifetimeAmount, billedToDate, recovered, overdue, unbilledForward, recoverableAtEt] }
}

function totalRow(label: string, rows: RecoveryRow[]): RecoveryRow {
  const values = rows[0].values.map((_, i) => rows.reduce((sum, r) => sum + r.values[i], 0))
  return { key: `${label.toLowerCase().replace(/\s+/g, "-")}`, label, isTotal: true, values }
}

export function buildRecoveryAnalysis(
  contract: EarlyTerminationContract,
  quote: SettlementQuote
): RecoveryAnalysisBreakdown {
  const costOfSalesRows = [
    buildComponentRow(
      "vehicle-purchase-cost",
      "Vehicle Purchase Cost",
      "Capitalised cost — overdue plus full un-billed forward balance recovered.",
      COST_OF_SALES_ALLOCATION.vehiclePurchaseCost,
      contract,
      quote,
      "capitalised"
    ),
    buildComponentRow(
      "cost-of-funds",
      "Cost of Funds",
      "Capitalised cost — overdue plus full un-billed forward balance recovered.",
      COST_OF_SALES_ALLOCATION.costOfFunds,
      contract,
      quote,
      "capitalised"
    ),
    buildComponentRow(
      "onboarding-costs",
      "Onboarding Costs",
      "Capitalised cost — overdue plus full un-billed forward balance recovered.",
      COST_OF_SALES_ALLOCATION.onboardingCosts,
      contract,
      quote,
      "capitalised"
    ),
  ]

  const operatingExpenseRows = [
    buildComponentRow(
      "operational-costs",
      "Operational Costs",
      "Recurring — only the amount billed to date is recoverable.",
      OPERATING_EXPENSE_ALLOCATION.operationalCosts,
      contract,
      quote,
      "recurring"
    ),
    buildComponentRow(
      "max-advantage-costs",
      "MAX Advantage Costs",
      "Recurring — only the amount billed to date is recoverable.",
      OPERATING_EXPENSE_ALLOCATION.maxAdvantageCosts,
      contract,
      quote,
      "recurring"
    ),
    buildComponentRow(
      "sales-marketing-costs",
      "Sales & Marketing Costs",
      "Sunk acquisition cost — forward balance recovered as an accrual.",
      OPERATING_EXPENSE_ALLOCATION.salesAndMarketingCosts,
      contract,
      quote,
      "capitalised"
    ),
    buildComponentRow(
      "risk-contingency-costs",
      "Risk & Contingency Costs",
      "Recurring — only the amount billed to date is recoverable.",
      OPERATING_EXPENSE_ALLOCATION.riskAndContingencyCosts,
      contract,
      quote,
      "recurring"
    ),
  ]

  const revenueRows = [
    buildComponentRow("vehicle-sale-revenue", "Vehicle Sale Revenue", "", REVENUE_ALLOCATION.vehicleSaleRevenue, contract, quote, "recurring"),
    buildComponentRow("interest-income", "Interest Income", "", REVENUE_ALLOCATION.interestIncome, contract, quote, "recurring"),
    buildComponentRow("max-advantage", "MAX Advantage", "", REVENUE_ALLOCATION.maxAdvantage, contract, quote, "recurring"),
    buildComponentRow("battery-access-fees", "Battery Access Fees", "", REVENUE_ALLOCATION.batteryAccessFees, contract, quote, "recurring"),
    buildComponentRow("processing-fees", "Processing Fees", "", REVENUE_ALLOCATION.processingFees, contract, quote, "recurring"),
  ]

  const componentSections: RecoverySection[] = [
    { key: "cost-of-sales", title: "Cost of Sales Recovery", rows: [...costOfSalesRows, totalRow("Total Cost of Sales", costOfSalesRows)] },
    { key: "operating-expense", title: "Operating Expense Recovery", rows: [...operatingExpenseRows, totalRow("Total Operating Costs", operatingExpenseRows)] },
    { key: "revenue", title: "Revenue Recovery", rows: [...revenueRows, totalRow("Total Revenue", revenueRows)] },
  ]

  const lifetimeMargin = contract.totalContractRevenue * GROSS_PROFIT_ALLOCATION
  const marginBilledToDate = contract.tenorMonths > 0 ? lifetimeMargin * (quote.monthsElapsed / contract.tenorMonths) : 0
  const marginRecovered = contract.actualCollections * GROSS_PROFIT_ALLOCATION
  const marginOverdue = Math.max(0, marginBilledToDate - marginRecovered)
  const bufferShortfall = Math.max(0, GROSS_PROFIT_BUFFER_RATE * lifetimeMargin - marginBilledToDate)
  const marginRecoverableAtEt = marginOverdue + bufferShortfall

  const marginSection: RecoverySection = {
    key: "margin",
    title: "Margin Recovery",
    rows: [
      {
        key: "gross-profit",
        label: "Gross Profit",
        note: "Margin buffer applies — 40% of lifetime margin less margin billed to date.",
        values: [lifetimeMargin, marginBilledToDate, marginRecovered, marginOverdue, bufferShortfall, marginRecoverableAtEt],
      },
    ],
  }

  return {
    componentColumns: ["Lifetime Amount / Total Revenue", "Billed to Date", "Recovered", "Overdue", "Un-billed Forward", "Recoverable at ET"],
    componentSections,
    marginColumns: ["Lifetime Margin", "Billed to Date", "Recovered", "Overdue", "Buffer Shortfall", "Recoverable at ET"],
    marginSection,
  }
}

// Settlement: aggregates the same Recovery Analysis component breakdown into a single
// payout figure. "Accruals (S&M + Margin)" groups the components that are recovered as an
// accrual rather than a straightforward overdue collection: Sales & Marketing's un-billed
// balance (its overdue slice is already counted in Operating Expense Overdue) plus the
// margin row's overdue and buffer-shortfall pieces. Verified against the reference spec's
// own worked example, whose 4-term subtotal (opex overdue + principal overdue + un-billed
// principal + accruals) only reconciles to its stated total if margin buffer shortfall is
// counted once, inside accruals — the spec's separate "+ Margin Buffer Shortfall" formula
// term is therefore redundant with Accruals and is not double-counted here.
const EARLY_TERMINATION_FEE_RATE = 0.01 // no fee schedule exists in the mock data model; placeholder policy rate

export interface SettlementBreakdownLine {
  key: string
  label: string
  amount: number
}

export type SettlementValidationLevel = "success" | "warning" | "info"

export interface SettlementValidationItem {
  key: string
  level: SettlementValidationLevel
  message: string
}

export interface SettlementComputation {
  operatingExpenseOverdue: number
  principalOverdue: number
  outstandingPrincipalUnbilled: number
  accruals: number
  marginBufferShortfall: number
  applicableCredits: number
  earlyTerminationFee: number
  subtotal: number
  settlementAmount: number
  breakdownLines: SettlementBreakdownLine[]
  validation: SettlementValidationItem[]
}

export function buildSettlementComputation(
  contract: EarlyTerminationContract,
  quote: SettlementQuote,
  earlyTerminationFeeEnabled: boolean
): SettlementComputation {
  const analysis = buildRecoveryAnalysis(contract, quote)
  const costOfSales = analysis.componentSections.find((s) => s.key === "cost-of-sales")!
  const operatingExpense = analysis.componentSections.find((s) => s.key === "operating-expense")!
  const margin = analysis.marginSection.rows[0]

  const costOfSalesTotal = costOfSales.rows.find((r) => r.isTotal)!
  const operatingExpenseTotal = operatingExpense.rows.find((r) => r.isTotal)!

  const vehiclePurchase = costOfSales.rows.find((r) => r.key === "vehicle-purchase-cost")!
  const costOfFunds = costOfSales.rows.find((r) => r.key === "cost-of-funds")!
  const onboarding = costOfSales.rows.find((r) => r.key === "onboarding-costs")!
  const operational = operatingExpense.rows.find((r) => r.key === "operational-costs")!
  const maxAdvantageCosts = operatingExpense.rows.find((r) => r.key === "max-advantage-costs")!
  const salesMarketing = operatingExpense.rows.find((r) => r.key === "sales-marketing-costs")!
  const riskContingency = operatingExpense.rows.find((r) => r.key === "risk-contingency-costs")!

  const operatingExpenseOverdue = operatingExpenseTotal.values[3]
  const principalOverdue = costOfSalesTotal.values[3]
  const outstandingPrincipalUnbilled = costOfSalesTotal.values[4]
  const marginOverdue = margin.values[3]
  const marginBufferShortfall = margin.values[4]
  const accruals = salesMarketing.values[4] + marginOverdue + marginBufferShortfall
  const earlyTerminationFee = earlyTerminationFeeEnabled ? contract.totalContractRevenue * EARLY_TERMINATION_FEE_RATE : 0

  const subtotal = operatingExpenseOverdue + principalOverdue + outstandingPrincipalUnbilled + accruals + earlyTerminationFee
  const settlementAmount = Math.max(0, subtotal - contract.applicableCredits)

  const breakdownLines: SettlementBreakdownLine[] = [
    { key: "operational-overdue", label: "Operational Costs — overdue", amount: operational.values[3] },
    { key: "max-advantage-overdue", label: "MAX Advantage Costs — overdue", amount: maxAdvantageCosts.values[3] },
    { key: "sales-marketing-overdue", label: "Sales & Marketing Costs — overdue", amount: salesMarketing.values[3] },
    { key: "risk-contingency-overdue", label: "Risk & Contingency Costs — overdue", amount: riskContingency.values[3] },
    { key: "vehicle-purchase-overdue", label: "Vehicle Purchase Cost — overdue", amount: vehiclePurchase.values[3] },
    { key: "cost-of-funds-overdue", label: "Cost of Funds — overdue", amount: costOfFunds.values[3] },
    { key: "onboarding-overdue", label: "Onboarding Costs — overdue", amount: onboarding.values[3] },
    { key: "vehicle-purchase-unbilled", label: "Vehicle Purchase Cost — un-billed balance", amount: vehiclePurchase.values[4] },
    { key: "cost-of-funds-unbilled", label: "Cost of Funds — un-billed balance", amount: costOfFunds.values[4] },
    { key: "onboarding-unbilled", label: "Onboarding Costs — un-billed balance", amount: onboarding.values[4] },
    { key: "sales-marketing-unbilled", label: "Sales & Marketing — un-billed balance", amount: salesMarketing.values[4] },
    { key: "margin-overdue", label: "Margin — overdue", amount: marginOverdue },
    { key: "margin-buffer-shortfall", label: "Margin buffer shortfall", amount: marginBufferShortfall },
    ...(earlyTerminationFee > 0 ? [{ key: "early-termination-fee", label: "Early Termination Fee", amount: earlyTerminationFee }] : []),
    { key: "applicable-credits", label: "Applicable Credits", amount: -contract.applicableCredits },
  ]

  const validation: SettlementValidationItem[] = [
    { key: "contract-loaded", level: "success", message: "Contract successfully loaded" },
    { key: "settlement-calculated", level: "success", message: "Settlement successfully calculated" },
    contract.outstandingDPD === 0
      ? { key: "no-overdue", level: "success", message: "No overdue payments" }
      : { key: "overdue-payments", level: "warning", message: `Overdue payments detected (${contract.outstandingDPD} days past due)` },
    ...(quote.outstandingBalance > 0
      ? [{ key: "outstanding-balance", level: "warning" as const, message: `Outstanding balance of ${formatCurrency(quote.outstandingBalance)} exists` }]
      : []),
    ...(operatingExpenseOverdue > 0
      ? [
          {
            key: "opex-overdue-recovered",
            level: "warning" as const,
            message: `Operating expense overdue of ${formatCurrency(operatingExpenseOverdue)} recovered at settlement`,
          },
        ]
      : []),
    ...(marginBufferShortfall > 0
      ? [{ key: "margin-buffer-applied", level: "warning" as const, message: `Margin buffer shortfall of ${formatCurrency(marginBufferShortfall)} applied` }]
      : []),
    earlyTerminationFee > 0
      ? { key: "et-fee-applied", level: "info" as const, message: `Early termination fee of ${formatCurrency(earlyTerminationFee)} applied` }
      : { key: "no-et-fee", level: "success" as const, message: "No early termination fee applied" },
  ]

  return {
    operatingExpenseOverdue,
    principalOverdue,
    outstandingPrincipalUnbilled,
    accruals,
    marginBufferShortfall,
    applicableCredits: contract.applicableCredits,
    earlyTerminationFee,
    subtotal,
    settlementAmount,
    breakdownLines,
    validation,
  }
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export type AmortisationStatus = "Paid" | "Current" | "Outstanding" | "Overdue"

export interface AmortisationPeriod {
  period: number
  dueDate: string
  dailyRemittance: number
  principal: number
  interest: number
  vehicleSaleRevenue: number
  maxAdvantage: number
  batteryAccess: number
  processingFee: number
  balance: number
  status: AmortisationStatus
}

// Forward-looking schedule assuming full expected billing each period (Vehicle Sale
// Revenue/Interest/MAX Advantage/Battery Access/Processing Fee split via the same
// REVENUE_ALLOCATION used by Recovery Analysis, so both tabs agree on how a naira of
// remittance breaks down). "Principal" duplicates Vehicle Sale Revenue — the asset-cost
// recovery component — as its own column per the reference spec.
//
// Payment status (Paid/Current/Outstanding/Overdue) is a separate, actuals-driven layer on
// top of that schedule: the current period is `monthsElapsed + 1`; a contract's
// `outstandingDPD` is converted to whole ~30-day overdue periods immediately preceding it;
// everything earlier is Paid and everything later is Outstanding.
export function buildAmortisationSchedule(contract: EarlyTerminationContract, quote: SettlementQuote): AmortisationPeriod[] {
  const start = parse(contract.startDate, "dd MMM yyyy", new Date())
  const monthlyRemittance = contract.dailyRemittance * contract.collectionDaysPerMonth
  const currentPeriod = quote.monthsElapsed + 1
  const overduePeriods = Math.min(quote.monthsElapsed, Math.ceil(contract.outstandingDPD / 30))

  const periods: AmortisationPeriod[] = []
  for (let period = 1; period <= contract.tenorMonths; period++) {
    const vehicleSaleRevenue = monthlyRemittance * REVENUE_ALLOCATION.vehicleSaleRevenue
    const interest = monthlyRemittance * REVENUE_ALLOCATION.interestIncome
    const maxAdvantage = monthlyRemittance * REVENUE_ALLOCATION.maxAdvantage
    const batteryAccess = monthlyRemittance * REVENUE_ALLOCATION.batteryAccessFees
    const processingFee = monthlyRemittance * REVENUE_ALLOCATION.processingFees
    const balance = Math.max(0, contract.totalContractRevenue - monthlyRemittance * period)

    let status: AmortisationStatus
    if (period === currentPeriod) status = "Current"
    else if (period > currentPeriod) status = "Outstanding"
    else if (period > quote.monthsElapsed - overduePeriods) status = "Overdue"
    else status = "Paid"

    periods.push({
      period,
      dueDate: formatShortDate(addMonths(start, period)),
      dailyRemittance: contract.dailyRemittance,
      principal: vehicleSaleRevenue,
      interest,
      vehicleSaleRevenue,
      maxAdvantage,
      batteryAccess,
      processingFee,
      balance,
      status,
    })
  }

  return periods
}
