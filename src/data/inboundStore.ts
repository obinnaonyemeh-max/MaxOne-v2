import { useSyncExternalStore } from "react"

import {
  mockIdentifiers,
  type IdentifierInput,
  type VehicleIdentifier,
} from "./mockBatchDetailRows"
import {
  createSubBatchFromUpload,
  mockSubBatches,
  type SubBatch,
} from "./mockSubBatches"

let identifiers: VehicleIdentifier[] = mockIdentifiers
let subBatches: SubBatch[] = mockSubBatches
let version = 0

const listeners = new Set<() => void>()

function emit() {
  version += 1
  listeners.forEach((listener) => listener())
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getVersion() {
  return version
}

export function useInboundStore() {
  const currentVersion = useSyncExternalStore(subscribe, getVersion, getVersion)
  return {
    version: currentVersion,
    identifiers,
    subBatches,
  }
}

export function getIdentifiersByBatchId(batchId: string): VehicleIdentifier[] {
  return identifiers.filter((row) => row.batchId === batchId)
}

export function getIdentifiersBySubBatchId(subBatchId: string): VehicleIdentifier[] {
  return identifiers.filter((row) => row.subBatchId === subBatchId)
}

export function getSubBatchesByBatchId(batchId: string): SubBatch[] {
  return subBatches.filter((sb) => sb.batchId === batchId)
}

export function getSubBatchByIds(batchId: string, subBatchId: string): SubBatch | undefined {
  return subBatches.find((sb) => sb.batchId === batchId && sb.subBatchId === subBatchId)
}

function toIdentifier(batchId: string, subBatchId: string, input: IdentifierInput): VehicleIdentifier {
  return {
    id: `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    batchId,
    subBatchId,
    chassisVin: input.chassisVin.trim(),
    engineNo: input.engineNo.trim(),
    ignitionNo: input.ignitionNo.trim(),
    batterySn: input.batterySn.trim(),
    color: input.color.trim(),
    receiver: input.receiver.trim() || "FLEETOPS",
  }
}

export function createSubBatchFromIdentifiers(batchId: string, rows: IdentifierInput[]) {
  const validRows = rows.filter((row) => row.chassisVin.trim())
  if (validRows.length === 0) {
    return null
  }

  const subBatch = createSubBatchFromUpload(batchId, validRows.length, subBatches)
  const created = validRows.map((row) => toIdentifier(batchId, subBatch.subBatchId, row))

  subBatches = [subBatch, ...subBatches]
  identifiers = [...created, ...identifiers]
  emit()

  return { subBatch, identifiers: created }
}

export function deleteIdentifier(id: string): { removedSubBatchId: string | null } {
  const row = identifiers.find((item) => item.id === id)
  if (!row) return { removedSubBatchId: null }

  identifiers = identifiers.filter((item) => item.id !== id)
  const remaining = identifiers.filter((item) => item.subBatchId === row.subBatchId)

  if (remaining.length === 0) {
    subBatches = subBatches.filter((sb) => sb.subBatchId !== row.subBatchId)
    emit()
    return { removedSubBatchId: row.subBatchId }
  }

  subBatches = subBatches.map((sb) =>
    sb.subBatchId === row.subBatchId ? { ...sb, qty: remaining.length } : sb,
  )
  emit()
  return { removedSubBatchId: null }
}

export function updateIdentifier(id: string, input: IdentifierInput): VehicleIdentifier | null {
  const existing = identifiers.find((item) => item.id === id)
  if (!existing) return null

  const updated: VehicleIdentifier = {
    ...existing,
    chassisVin: input.chassisVin.trim(),
    engineNo: input.engineNo.trim(),
    ignitionNo: input.ignitionNo.trim(),
    batterySn: input.batterySn.trim(),
    color: input.color.trim(),
    receiver: input.receiver.trim() || existing.receiver,
  }

  identifiers = identifiers.map((item) => (item.id === id ? updated : item))
  emit()
  return updated
}

export function parseIdentifierCsv(text: string): IdentifierInput[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const header = lines[0].toLowerCase()
  const hasHeader = /chassis|vin|engine/.test(header)
  const dataLines = hasHeader ? lines.slice(1) : lines

  return dataLines
    .map((line) => {
      const cols = line.split(",").map((col) => col.trim().replace(/^"|"$/g, ""))
      return {
        chassisVin: cols[0] ?? "",
        engineNo: cols[1] ?? "",
        ignitionNo: cols[2] ?? "",
        batterySn: cols[3] ?? "",
        color: cols[4] ?? "",
        receiver: cols[5] ?? "",
      }
    })
    .filter((row) => row.chassisVin)
}
