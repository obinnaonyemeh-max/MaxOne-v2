// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine (Dashboard tab).
// Finance/Product define repricing rules once; scheduled jobs reprice every contract that
// enters the Repricing stage. This file backs the dashboard's KPI row, active rule
// register preview, automation config, and recent session log.

import type { PreviousContractBaseline } from "@/pages/create-repricing-rule/referenceData"

export type RepricingVehicleType = "EV" | "ICE"
export type RepricingRuleStatus = "Active" | "Draft" | "Inactive"

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
}

export const mockRepricingRules: RepricingRule[] = [
  { id: "1", code: "RR-001", vehicleType: "EV", vehicleModel: "MAX Bolt 2W", name: "EV Two-Wheeler Standard Reprice", country: "Nigeria", version: "v3", effectiveDate: "01 Aug 2026", status: "Active" },
  { id: "2", code: "RR-002", vehicleType: "EV", vehicleModel: "MAX Tri EV", name: "EV Battery Swap Subsidy Adjustment", country: "Kenya", version: "v2", effectiveDate: "15 Jul 2026", status: "Active" },
  { id: "3", code: "RR-003", vehicleType: "ICE", vehicleModel: "Keke Bajaj RE", name: "ICE Three-Wheeler Fuel Index Reprice", country: "Nigeria", version: "v4", effectiveDate: "01 Aug 2026", status: "Active" },
  { id: "4", code: "RR-004", vehicleType: "ICE", vehicleModel: "Boxer 150", name: "ICE Four-Wheeler Cost of Funds Reprice", country: "Ghana", version: "v1", effectiveDate: "20 Jul 2026", status: "Active" },
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
