// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine (Dashboard tab).
// Finance/Product define repricing rules once; scheduled jobs reprice every contract that
// enters the Repricing stage. This file backs the dashboard's KPI row, active rule
// register preview, automation config, and recent session log.

export type RepricingVehicleType = "EV" | "ICE"
export type RepricingRuleStatus = "Active" | "Draft" | "Inactive"

export interface RepricingRule {
  id: string
  vehicleType: RepricingVehicleType
  name: string
  country: string
  version: string
  effectiveDate: string
  status: RepricingRuleStatus
}

export const mockRepricingRules: RepricingRule[] = [
  { id: "1", vehicleType: "EV", name: "EV Two-Wheeler Standard Reprice", country: "Nigeria", version: "v3", effectiveDate: "01 Aug 2026", status: "Active" },
  { id: "2", vehicleType: "EV", name: "EV Battery Swap Subsidy Adjustment", country: "Kenya", version: "v2", effectiveDate: "15 Jul 2026", status: "Active" },
  { id: "3", vehicleType: "ICE", name: "ICE Three-Wheeler Fuel Index Reprice", country: "Nigeria", version: "v4", effectiveDate: "01 Aug 2026", status: "Active" },
  { id: "4", vehicleType: "ICE", name: "ICE Four-Wheeler Cost of Funds Reprice", country: "Ghana", version: "v1", effectiveDate: "20 Jul 2026", status: "Active" },
]

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
  startTime: string
  endTime: string
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
  { id: "RPS-2026-0826-02", sessionType: "Automated", startTime: "26 Aug 2026, 18:04", endTime: "26 Aug 2026, 18:11", found: 40, repriced: 38, exceptions: 1, failed: 1, status: "Completed with exceptions" },
  { id: "RPS-2026-0826-01", sessionType: "Automated", startTime: "26 Aug 2026, 06:00", endTime: "26 Aug 2026, 06:08", found: 35, repriced: 35, exceptions: 0, failed: 0, status: "Completed" },
  { id: "RPS-2026-0825-03", sessionType: "Manual", startTime: "25 Aug 2026, 14:22", endTime: "25 Aug 2026, 14:25", found: 12, repriced: 12, exceptions: 0, failed: 0, status: "Completed" },
  { id: "RPS-2026-0825-02", sessionType: "Automated", startTime: "25 Aug 2026, 18:00", endTime: "25 Aug 2026, 18:09", found: 28, repriced: 0, exceptions: 0, failed: 28, status: "Failed" },
  { id: "RPS-2026-0825-01", sessionType: "Automated", startTime: "25 Aug 2026, 06:00", endTime: "25 Aug 2026, 06:07", found: 18, repriced: 16, exceptions: 2, failed: 0, status: "Completed with exceptions" },
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
