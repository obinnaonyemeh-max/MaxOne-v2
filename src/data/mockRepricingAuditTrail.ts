// Mock data for Portfolio > Products & Pricing > Dynamic Repricing Engine > Audit Trail tab.
// An immutable log of every system reprice, manual override, rule activation, and
// calculation event across the repricing engine — for compliance and troubleshooting.

export type AuditTrailStatus = "Completed" | "Pending" | "Under Review" | "Rejected"

export interface AuditTrailDelta {
  field: string
  before: string
  after: string
}

export interface AuditTrailEntry {
  id: string
  /** ISO datetime */
  timestamp: string
  contractId: string | null
  sessionId: string | null
  ruleCode: string | null
  ruleVersion: string | null
  action: string
  user: string
  status: AuditTrailStatus
  deltas: AuditTrailDelta[]
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const auditTrailStatusVariantMap: Record<AuditTrailStatus, BadgeVariant> = {
  Completed: "success",
  Pending: "warning",
  "Under Review": "warning",
  Rejected: "danger",
}

export const mockRepricingAuditTrail: AuditTrailEntry[] = [
  {
    id: "1",
    timestamp: "2026-07-30T18:04:00",
    contractId: "CT-EV-4200",
    sessionId: "RPS-2026-0723-02",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    action: "Contract repriced",
    user: "System",
    status: "Completed",
    deltas: [{ field: "Daily Remittance", before: "₦3,780", after: "₦3,850" }],
  },
  {
    id: "2",
    timestamp: "2026-07-30T18:05:00",
    contractId: "CT-EV-4204",
    sessionId: "RPS-2026-0723-02",
    ruleCode: "RR-002",
    ruleVersion: "v2",
    action: "Override approved — target gross margin 24% → 21.5%",
    user: "N. Okafor",
    status: "Completed",
    deltas: [{ field: "Target Gross Margin", before: "24%", after: "21.5%" }],
  },
  {
    id: "3",
    timestamp: "2026-07-30T18:06:00",
    contractId: "CT-ICE-8103",
    sessionId: "RPS-2026-0723-02",
    ruleCode: null,
    ruleVersion: null,
    action: "Calculation aborted — refurbishment cost missing",
    user: "System",
    status: "Rejected",
    deltas: [],
  },
  {
    id: "4",
    timestamp: "2026-08-24T06:04:00",
    contractId: "CT-EV-4200",
    sessionId: "RPS-2026-0824-01",
    ruleCode: "RR-001",
    ruleVersion: "v2",
    action: "Calculation inputs manually overridden",
    user: "T. Adewale",
    status: "Pending",
    deltas: [
      { field: "Vehicle Cost", before: "₦680,000", after: "₦705,000" },
      { field: "Margin", before: "22%", after: "20%" },
    ],
  },
  {
    id: "5",
    timestamp: "2026-08-24T09:12:00",
    contractId: null,
    sessionId: null,
    ruleCode: "RR-003",
    ruleVersion: "v4",
    action: "Rule RR-003 activated (v4)",
    user: "F. Bello",
    status: "Completed",
    deltas: [{ field: "Rule Status", before: "Draft", after: "Active" }],
  },
  {
    id: "6",
    timestamp: "2026-08-25T06:05:00",
    contractId: "CT-EV-4205",
    sessionId: "RPS-2026-0825-01",
    ruleCode: null,
    ruleVersion: null,
    action: "Exception raised — no active rule for vehicle model",
    user: "System",
    status: "Under Review",
    deltas: [],
  },
  {
    id: "7",
    timestamp: "2026-08-26T18:07:00",
    contractId: "CT-EV-4210",
    sessionId: "RPS-2026-0826-02",
    ruleCode: "RR-001",
    ruleVersion: "v3",
    action: "Upload validation error — column mismatch on repricing sheet",
    user: "System",
    status: "Rejected",
    deltas: [],
  },
  {
    id: "8",
    timestamp: "2026-08-28T09:15:00",
    contractId: null,
    sessionId: null,
    ruleCode: null,
    ruleVersion: null,
    action: "42 ICE contracts uploaded via UP-ICE-20260828-01",
    user: "Desmond Nsogbuwa",
    status: "Completed",
    deltas: [],
  },
  {
    id: "9",
    timestamp: "2026-08-26T18:04:00",
    contractId: "CT-ICE-8100",
    sessionId: "RPS-2026-0826-02",
    ruleCode: "RR-003",
    ruleVersion: "v4",
    action: "Contract repriced",
    user: "System",
    status: "Completed",
    deltas: [{ field: "Daily Remittance", before: "₦4,150", after: "₦4,200" }],
  },
  {
    id: "10",
    timestamp: "2026-08-21T11:40:00",
    contractId: null,
    sessionId: null,
    ruleCode: null,
    ruleVersion: null,
    action: "ICE bulk upload failed — malformed CSV header row",
    user: "Tunde Balogun",
    status: "Rejected",
    deltas: [],
  },
]
