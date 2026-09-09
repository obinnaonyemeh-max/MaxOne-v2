// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine (Dashboard tab).
// Finance/Product define repricing rules once; scheduled jobs reprice every contract that
// enters the Repricing stage. This file backs the dashboard's KPI row, active rule
// register preview, automation config, and recent session log.

import type { PreviousContractBaseline } from "@/pages/create-repricing-rule/referenceData"

export type RepricingVehicleType = "EV" | "ICE"
export type RepricingRuleStatus = "Active" | "Draft" | "Inactive"

// Mirrors the Create Repricing Rule wizard's steps 2–6 field-for-field, so a rule's detail
// view can show every parameter set when it was created (or last edited).
export interface RepricingRuleParameters {
  description: string
  /** References `PricingBatchRecord.id` in mockPricingBatchRecords.ts — empty when none was attached. */
  pricingBatchId: string

  // Contract Eligibility
  processStages: string[]
  refurbishmentStatuses: string[]
  vehicleTypeEligibility: string[]

  // Recovery Rules — keyed by RecoveryComponentKey (create-repricing-rule/referenceData.ts)
  recoveryRules: Record<string, { method: string; percent: number | null }>

  // New Investment Rules — Capital Investments
  refurbishmentCost: number
  batteryCost: number
  chargerCost: number
  trackerCost: number
  // New Investment Rules — Redeployment Costs
  licensingRegistrationCost: number
  paintingBrandingCost: number
  helmetCost: number
  vestCost: number
  recoveryFeeCost: number

  // Commercial Assumptions — Contract Structure
  collectionDaysPerMonth: number
  // Commercial Assumptions — Funding
  debtFundingPercent: number
  debtInterestRatePercent: number
  equityCostPercent: number
  lenderProcessingFeePercent: number
  // Commercial Assumptions — Commercial
  vatPercent: number
  dailyBatterySwapSubsidy: number

  // Pricing Constraints
  maxDailyRemittancePercent: number
  minDailyRemittance: number
  maxTenorMonths: number
  minGrossMarginPercent: number
  minNetMarginPercent: number
}

export interface RepricingRule {
  id: string
  /** Short reference code, e.g. "RR-001" — used wherever a rule is cited from another register (contracts, sessions). */
  code: string
  vehicleType: RepricingVehicleType
  vehicleModel: string
  name: string
  country: string
  version: string
  effectiveDate: string
  status: RepricingRuleStatus
  /** Full wizard parameter set — undefined only for legacy rules created before this field existed. */
  parameters?: RepricingRuleParameters
}

const baseRecoveryRules: RepricingRuleParameters["recoveryRules"] = {
  outstandingVehiclePrincipal: { method: "Full Recovery", percent: 100 },
  interestIncome: { method: "Partial Recovery", percent: 60 },
  batterySwapSubsidyFee: { method: "Full Recovery", percent: 100 },
  onboardingCosts: { method: "Partial Recovery", percent: 50 },
  operationalCosts: { method: "Partial Recovery", percent: 40 },
  maxAdvantageCosts: { method: "No Recovery", percent: 0 },
  salesMarketingCosts: { method: "No Recovery", percent: 0 },
  riskContingencyCosts: { method: "Partial Recovery", percent: 30 },
  grossProfit: { method: "Carry Forward to New Contract", percent: 20 },
}

function buildRuleParameters(overrides: Partial<RepricingRuleParameters>): RepricingRuleParameters {
  return {
    description: "",
    pricingBatchId: "",
    processStages: ["Repricing"],
    refurbishmentStatuses: ["Completed"],
    vehicleTypeEligibility: ["EV 2-Wheeler"],
    recoveryRules: baseRecoveryRules,
    refurbishmentCost: 85000,
    batteryCost: 420000,
    chargerCost: 65000,
    trackerCost: 38000,
    licensingRegistrationCost: 45000,
    paintingBrandingCost: 30000,
    helmetCost: 12000,
    vestCost: 6000,
    recoveryFeeCost: 25000,
    collectionDaysPerMonth: 26,
    debtFundingPercent: 80,
    debtInterestRatePercent: 22,
    equityCostPercent: 28,
    lenderProcessingFeePercent: 1.5,
    vatPercent: 7.5,
    dailyBatterySwapSubsidy: 200,
    maxDailyRemittancePercent: 115,
    minDailyRemittance: 1800,
    maxTenorMonths: 18,
    minGrossMarginPercent: 18,
    minNetMarginPercent: 8,
    ...overrides,
  }
}

export const mockRepricingRules: RepricingRule[] = [
  {
    id: "1",
    code: "RR-001",
    vehicleType: "EV",
    vehicleModel: "MAX Bolt 2W",
    name: "EV Two-Wheeler Standard Reprice",
    country: "Nigeria",
    version: "v3",
    effectiveDate: "01 Aug 2026",
    status: "Active",
    parameters: buildRuleParameters({
      description: "Standard repricing for EV two-wheeler contracts entering the Repricing stage after refurbishment.",
      pricingBatchId: "1",
      vehicleTypeEligibility: ["EV 2-Wheeler"],
    }),
  },
  {
    id: "2",
    code: "RR-002",
    vehicleType: "EV",
    vehicleModel: "MAX Tri EV",
    name: "EV Battery Swap Subsidy Adjustment",
    country: "Kenya",
    version: "v2",
    effectiveDate: "15 Jul 2026",
    status: "Active",
    parameters: buildRuleParameters({
      description: "Adjusts the daily battery swap subsidy for EV three-wheelers redeployed under the Kenya battery-as-a-service program.",
      pricingBatchId: "2",
      vehicleTypeEligibility: ["EV 3-Wheeler"],
      dailyBatterySwapSubsidy: 260,
      collectionDaysPerMonth: 25,
    }),
  },
  {
    id: "3",
    code: "RR-003",
    vehicleType: "ICE",
    vehicleModel: "Keke Bajaj RE",
    name: "ICE Three-Wheeler Fuel Index Reprice",
    country: "Nigeria",
    version: "v4",
    effectiveDate: "01 Aug 2026",
    status: "Active",
    parameters: buildRuleParameters({
      description: "Tracks the national fuel price index and reprices ICE three-wheeler contracts accordingly.",
      pricingBatchId: "1",
      refurbishmentStatuses: ["Completed", "In Progress"],
      vehicleTypeEligibility: ["ICE 3-Wheeler"],
      recoveryRules: { ...baseRecoveryRules, operationalCosts: { method: "Full Recovery", percent: 100 } },
      minDailyRemittance: 2200,
    }),
  },
  {
    id: "4",
    code: "RR-004",
    vehicleType: "ICE",
    vehicleModel: "Boxer 150",
    name: "ICE Four-Wheeler Cost of Funds Reprice",
    country: "Ghana",
    version: "v1",
    effectiveDate: "20 Jul 2026",
    status: "Active",
    parameters: buildRuleParameters({
      description: "Repricing for ICE contracts following the Q3 cost-of-funds revision in Ghana.",
      vehicleTypeEligibility: ["ICE 2-Wheeler"],
      debtInterestRatePercent: 26,
      equityCostPercent: 24,
      maxTenorMonths: 15,
    }),
  },
  {
    id: "5",
    code: "RR-005",
    vehicleType: "EV",
    vehicleModel: "MAX Bolt 2W",
    name: "EV Two-Wheeler Uganda Pilot Reprice",
    country: "Uganda",
    version: "v1",
    effectiveDate: "01 Sep 2026",
    status: "Draft",
    parameters: buildRuleParameters({
      description: "Draft pilot rule for the Uganda EV two-wheeler launch — pending finance sign-off before activation.",
      pricingBatchId: "3",
      refurbishmentStatuses: ["Pricing"],
      vehicleTypeEligibility: ["EV 2-Wheeler"],
      minGrossMarginPercent: 20,
      minNetMarginPercent: 10,
    }),
  },
]

export function addRepricingRule(rule: RepricingRule): void {
  mockRepricingRules.unshift(rule)
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const repricingRuleStatusVariantMap: Record<RepricingRuleStatus, BadgeVariant> = {
  Active: "success",
  Draft: "default",
  Inactive: "default",
}

export type RepricingSessionType = "Automated" | "Manual"
export type RepricingSessionStatus = "Completed" | "Completed with exceptions" | "Failed" | "Running"

export interface RepricingSession {
  id: string
  sessionType: RepricingSessionType
  /** Source label, e.g. "Cron 18:00" or "Manual run" */
  trigger: string
  startTime: string
  endTime: string
  /** e.g. "4m 12s" */
  duration: string
  found: number
  repriced: number
  exceptions: number
  failed: number
  status: RepricingSessionStatus
}

export const repricingSessionStatusVariantMap: Record<RepricingSessionStatus, BadgeVariant> = {
  Completed: "success",
  "Completed with exceptions": "warning",
  Failed: "danger",
  Running: "info",
}

export const mockRepricingSessions: RepricingSession[] = [
  { id: "RPS-2026-0826-02", sessionType: "Automated", trigger: "Cron 18:00", startTime: "26 Aug 2026, 18:04", endTime: "26 Aug 2026, 18:11", duration: "7m 00s", found: 40, repriced: 38, exceptions: 1, failed: 1, status: "Completed with exceptions" },
  { id: "RPS-2026-0826-01", sessionType: "Automated", trigger: "Cron 06:00", startTime: "26 Aug 2026, 06:00", endTime: "26 Aug 2026, 06:08", duration: "8m 00s", found: 35, repriced: 35, exceptions: 0, failed: 0, status: "Completed" },
  { id: "RPS-2026-0825-03", sessionType: "Manual", trigger: "Manual run", startTime: "25 Aug 2026, 14:22", endTime: "25 Aug 2026, 14:25", duration: "3m 00s", found: 12, repriced: 12, exceptions: 0, failed: 0, status: "Completed" },
  { id: "RPS-2026-0825-02", sessionType: "Automated", trigger: "Cron 18:00", startTime: "25 Aug 2026, 18:00", endTime: "25 Aug 2026, 18:09", duration: "9m 00s", found: 28, repriced: 0, exceptions: 0, failed: 28, status: "Failed" },
  { id: "RPS-2026-0825-01", sessionType: "Automated", trigger: "Cron 06:00", startTime: "25 Aug 2026, 06:00", endTime: "25 Aug 2026, 06:07", duration: "7m 00s", found: 18, repriced: 16, exceptions: 2, failed: 0, status: "Completed with exceptions" },
  { id: "RPS-2026-0824-02", sessionType: "Automated", trigger: "Cron 18:00", startTime: "24 Aug 2026, 18:00", endTime: "24 Aug 2026, 18:06", duration: "6m 00s", found: 22, repriced: 22, exceptions: 0, failed: 0, status: "Completed" },
  { id: "RPS-2026-0824-01", sessionType: "Automated", trigger: "Cron 06:00", startTime: "24 Aug 2026, 06:00", endTime: "24 Aug 2026, 06:09", duration: "9m 00s", found: 31, repriced: 29, exceptions: 2, failed: 0, status: "Completed with exceptions" },
  { id: "RPS-2026-0723-02", sessionType: "Manual", trigger: "Manual run", startTime: "30 Jul 2026, 18:00", endTime: "30 Jul 2026, 18:04", duration: "4m 12s", found: 48, repriced: 41, exceptions: 5, failed: 2, status: "Completed with exceptions" },
  { id: "RPS-2026-0723-01", sessionType: "Automated", trigger: "Cron 06:00", startTime: "23 Jul 2026, 06:00", endTime: "23 Jul 2026, 06:05", duration: "5m 00s", found: 19, repriced: 19, exceptions: 0, failed: 0, status: "Completed" },
]

export interface RepricingMetrics {
  awaitingRepricing: number
  repricedToday: number
  repricedTodaySessions: number
  failedRepricing: number
  exceptionQueue: number
  lastRunTime: string
  lastRunDate: string
  nextRunTime: string
  nextRunDate: string
}

export const mockRepricingMetrics: RepricingMetrics = {
  awaitingRepricing: 5,
  repricedToday: 75,
  repricedTodaySessions: 2,
  failedRepricing: 3,
  exceptionQueue: 8,
  lastRunTime: "18:04",
  lastRunDate: "26 Aug 2026",
  nextRunTime: "06:00",
  nextRunDate: "27 Aug 2026",
}

export interface AutomationConfig {
  frequency: string
  runWindows: string
  scope: string
  refurbishmentGate: string
  onConstraintBreach: string
}

export const mockAutomationConfig: AutomationConfig = {
  frequency: "Twice daily",
  runWindows: "06:00 & 18:00 WAT",
  scope: "Contracts in Repricing stage",
  refurbishmentGate: "Blocked until refurbishment sign-off",
  onConstraintBreach: "Route to Exception Queue",
}

// Representative retrieved-contract values per vehicle type, used by the Create Repricing
// Rule wizard's live P&L preview — stand in for the specific previous contract until this
// rule is matched against a real one by the repricing engine.
export const SAMPLE_PREVIOUS_CONTRACT: Record<RepricingVehicleType, PreviousContractBaseline> = {
  EV: {
    outstandingVehiclePrincipal: 180000,
    interestIncome: 45000,
    batterySwapSubsidyFee: 12000,
    onboardingCosts: 30000,
    operationalCosts: 20000,
    maxAdvantageCosts: 15000,
    salesMarketingCosts: 10000,
    riskContingencyCosts: 8000,
    grossProfit: 60000,
    previousDailyRemittance: 2200,
  },
  ICE: {
    outstandingVehiclePrincipal: 150000,
    interestIncome: 38000,
    batterySwapSubsidyFee: 0,
    onboardingCosts: 24000,
    operationalCosts: 18000,
    maxAdvantageCosts: 12000,
    salesMarketingCosts: 8000,
    riskContingencyCosts: 6000,
    grossProfit: 48000,
    previousDailyRemittance: 1900,
  },
}
