// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine > Exception Queue tab.
// A contract lands here when the scheduled/manual repricing engine can't cleanly reprice it —
// a rule breach, a data gap, or a calculation constraint — and needs human triage.

export type ExceptionReason =
  | "Margin Constraint Failed"
  | "Daily Remittance Exceeded"
  | "Upload Validation Error"
  | "Missing Refurbishment Data"
  | "No Active Rule"
  | "Missing Pricing Data"
  | "Invalid Funding Assumption"
  | "Calculation Error"

export type ExceptionSeverity = "High" | "Medium" | "Low"

export interface RepricingException {
  id: string
  /** Format: EX-XXXX */
  exceptionId: string
  contractId: string
  vehicleType: "EV" | "ICE"
  championName: string
  reason: ExceptionReason
  severity: ExceptionSeverity
  sessionId: string
  /** ISO datetime the engine flagged this exception */
  detectedAt: string
  assignee: string | null
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const EXCEPTION_REASONS: ExceptionReason[] = [
  "Margin Constraint Failed",
  "Daily Remittance Exceeded",
  "Upload Validation Error",
  "Missing Refurbishment Data",
  "No Active Rule",
  "Missing Pricing Data",
  "Invalid Funding Assumption",
  "Calculation Error",
]

export const exceptionReasonVariantMap: Record<ExceptionReason, BadgeVariant> = {
  "Margin Constraint Failed": "danger",
  "Daily Remittance Exceeded": "danger",
  "Upload Validation Error": "warning",
  "Missing Refurbishment Data": "warning",
  "No Active Rule": "danger",
  "Missing Pricing Data": "info",
  "Invalid Funding Assumption": "warning",
  "Calculation Error": "danger",
}

export const mockRepricingExceptions: RepricingException[] = [
  {
    id: "1",
    exceptionId: "EX-1201",
    contractId: "CT-EV-4204",
    vehicleType: "EV",
    championName: "Otieno Odhiambo",
    reason: "Margin Constraint Failed",
    severity: "High",
    sessionId: "RPS-2026-0723-02",
    detectedAt: "2026-07-30T18:02:00",
    assignee: "Amara Nwachukwu",
  },
  {
    id: "2",
    exceptionId: "EX-1202",
    contractId: "CT-ICE-8103",
    vehicleType: "ICE",
    championName: "Chinedu Okafor",
    reason: "Daily Remittance Exceeded",
    severity: "High",
    sessionId: "RPS-2026-0723-02",
    detectedAt: "2026-07-30T18:03:00",
    assignee: null,
  },
  {
    id: "3",
    exceptionId: "EX-1203",
    contractId: "CT-EV-4210",
    vehicleType: "EV",
    championName: "Bola Adeyemi",
    reason: "Upload Validation Error",
    severity: "Medium",
    sessionId: "RPS-2026-0826-02",
    detectedAt: "2026-08-26T18:07:00",
    assignee: "Tunde Balogun",
  },
  {
    id: "4",
    exceptionId: "EX-1204",
    contractId: "CT-ICE-8107",
    vehicleType: "ICE",
    championName: "Ibrahim Sule",
    reason: "Missing Refurbishment Data",
    severity: "Medium",
    sessionId: "RPS-2026-0826-02",
    detectedAt: "2026-08-26T18:08:00",
    assignee: null,
  },
  {
    id: "5",
    exceptionId: "EX-1205",
    contractId: "CT-EV-4205",
    vehicleType: "EV",
    championName: "Ifeoma Eze",
    reason: "No Active Rule",
    severity: "High",
    sessionId: "RPS-2026-0825-01",
    detectedAt: "2026-08-25T06:05:00",
    assignee: "Grace Adeboye",
  },
  {
    id: "6",
    exceptionId: "EX-1206",
    contractId: "CT-ICE-8100",
    vehicleType: "ICE",
    championName: "Yusuf Abdullahi",
    reason: "Missing Pricing Data",
    severity: "Low",
    sessionId: "RPS-2026-0825-01",
    detectedAt: "2026-08-25T06:06:00",
    assignee: null,
  },
  {
    id: "7",
    exceptionId: "EX-1207",
    contractId: "CT-EV-4200",
    vehicleType: "EV",
    championName: "Chidi Okonkwo",
    reason: "Invalid Funding Assumption",
    severity: "Medium",
    sessionId: "RPS-2026-0824-01",
    detectedAt: "2026-08-24T06:04:00",
    assignee: "Musa Garba",
  },
  {
    id: "8",
    exceptionId: "EX-1208",
    contractId: "CT-ICE-8104",
    vehicleType: "ICE",
    championName: "Wafula Simiyu",
    reason: "Calculation Error",
    severity: "High",
    sessionId: "RPS-2026-0824-01",
    detectedAt: "2026-08-24T06:05:00",
    assignee: null,
  },
]

/**
 * Exceptions that were triaged and resolved this week already leave the queue above,
 * so this is tracked as a standalone counter rather than a full record list.
 */
export const mockResolvedExceptionsThisWeek = 23
