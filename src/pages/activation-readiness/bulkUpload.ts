import type { ActivationRecord } from "@/data/mockActivationRecords"
import { STAGE_KEYS, STAGES, type StageKey } from "./stages"

export type BulkAction = "start" | "complete"
export type BulkRowStatus = "matched" | "warning" | "error"

export interface CsvColumn {
  key: string
  label: string
}

export interface BulkPreviewRow {
  id: string
  recordId?: string
  chassis?: string
  status: BulkRowStatus
  issue?: string
  values: Record<string, string>
}

export const STAGE_CSV_COLUMNS: Record<StageKey, CsvColumn[]> = {
  bikeAssembly:     [{ key: "chassis", label: "Chassis" }],
  qualityControl:   [{ key: "chassis", label: "Chassis" }],
  paintingBranding: [{ key: "chassis", label: "Chassis" }],
  licensingReg: [
    { key: "chassis",      label: "Chassis" },
    { key: "plate_number", label: "Plate number" },
    { key: "location",     label: "Location" },
  ],
  tracker: [
    { key: "chassis",            label: "Chassis" },
    { key: "device_id_imei",     label: "Device ID / IMEI" },
    { key: "installation_date",  label: "Installation date" },
  ],
  insurance: [
    { key: "plate_number",        label: "Plate number" },
    { key: "policy_number",      label: "Policy number" },
    { key: "policy_expiry",      label: "Policy expiry" },
    { key: "insurance_provider", label: "Insurance provider" },
  ],
}

export function stageLabel(key: StageKey) {
  return STAGES.find((s) => s.key === key)?.label ?? key
}

export function csvHeaders(stage: StageKey) {
  return STAGE_CSV_COLUMNS[stage].map((col) => col.key)
}

function csvEscape(cell: string) {
  if (/[",\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`
  return cell
}

export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const content = [headers, ...rows].map((line) => line.map(csvEscape).join(",")).join("\n")
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function plateFor(record: ActivationRecord) {
  return `MAX-${record.chassis.slice(-4)}`
}

function valuesFor(stage: StageKey, record: ActivationRecord): Record<string, string> {
  switch (stage) {
    case "licensingReg":
      return {
        chassis: record.chassis,
        plate_number: plateFor(record),
        location: record.location,
      }
    case "tracker":
      return {
        chassis: record.chassis,
        device_id_imei: `8600${record.id.padStart(8, "0")}`,
        installation_date: "08/09/2026",
      }
    case "insurance":
      return {
        plate_number: plateFor(record),
        policy_number: `POL-${record.id.padStart(5, "0")}`,
        policy_expiry: "08/09/2027",
        insurance_provider: "AXA Mansard",
      }
    default:
      return { chassis: record.chassis }
  }
}

function emptyValues(stage: StageKey): Record<string, string> {
  return Object.fromEntries(STAGE_CSV_COLUMNS[stage].map((col) => [col.key, ""]))
}

function classify(record: ActivationRecord, stage: StageKey, action: BulkAction): Pick<BulkPreviewRow, "status" | "issue"> {
  const current = record[stage]
  if (action === "start") {
    if (current === "completed") return { status: "warning", issue: "Stage already completed" }
    if (current === "in-progress") return { status: "warning", issue: "Stage already in progress" }
    if (current === "blocked") return { status: "error", issue: "Previous stage is not complete" }
    return { status: "matched" }
  }
  if (current === "completed") return { status: "warning", issue: "Stage already completed" }
  if (current === "blocked") return { status: "error", issue: "Previous stage is not complete" }
  if (current === "pending") return { status: "warning", issue: "Stage has not been started" }
  return { status: "matched" }
}

export function buildPreviewRows(
  stage: StageKey,
  action: BulkAction,
  records: ActivationRecord[],
): BulkPreviewRow[] {
  const fromFile = records.slice(0, 3).map((record) => {
    const { status, issue } = classify(record, stage, action)
    return {
      id: `row-${record.id}`,
      recordId: record.id,
      chassis: record.chassis,
      status,
      issue,
      values: {
        ...valuesFor(stage, record),
        sub_batch: record.subBatch,
      },
    } satisfies BulkPreviewRow
  })

  const unknown: BulkPreviewRow = {
    id: "row-unknown",
    status: "error",
    issue: "Chassis not found",
    chassis: "UNKNOWNCHASSIS99",
    values: {
      ...emptyValues(stage),
      chassis: "UNKNOWNCHASSIS99",
      plate_number: "UNKNOWNCHASSIS99",
      sub_batch: "—",
    },
  }

  const missing: BulkPreviewRow = {
    id: "row-missing",
    status: "error",
    issue: "Missing required columns",
    values: {
      ...emptyValues(stage),
      sub_batch: "—",
    },
  }

  return [...fromFile, unknown, missing]
}

export function applyBulkUpdates(
  records: ActivationRecord[],
  stage: StageKey,
  action: BulkAction,
  rows: BulkPreviewRow[],
): ActivationRecord[] {
  const now = new Date().toISOString()
  const applyIds = new Set(
    rows.filter((row) => row.status !== "error" && row.recordId).map((row) => row.recordId),
  )
  const nextKey = STAGE_KEYS[STAGE_KEYS.indexOf(stage) + 1]

  return records.map((record) => {
    if (!applyIds.has(record.id)) return record

    const sla = { ...record.stageSla }
    const currentSla = sla[stage] ?? {}

    if (action === "start") {
      return {
        ...record,
        [stage]: "in-progress",
        stageSla: {
          ...sla,
          [stage]: { ...currentSla, startedAt: currentSla.startedAt ?? now },
        },
      }
    }

    const completed: ActivationRecord = {
      ...record,
      [stage]: "completed",
      stageSla: {
        ...sla,
        [stage]: { ...currentSla, completedAt: now },
      },
    }

    if (nextKey && completed[nextKey] === "blocked") {
      completed[nextKey] = "pending"
    }
    return completed
  })
}
