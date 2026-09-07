import { useSyncExternalStore } from "react"

import {
  mockIssuedPartMovements,
  mockStockAdjustments,
  type IssuedPartMovement,
  type StockAdjustmentMovement,
  type StockAdjustmentType,
} from "./mockInventoryMovements"
import type { InventoryPart } from "./mockInventoryParts"

const DEFAULT_RECORDED_BY = "Fleet Ops"

let issuedRecords: IssuedPartMovement[] = mockIssuedPartMovements
let adjustmentRecords: StockAdjustmentMovement[] = mockStockAdjustments
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

function formatMovementDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function useIssuedPartMovements(): IssuedPartMovement[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return issuedRecords
}

export function useStockAdjustments(): StockAdjustmentMovement[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return adjustmentRecords
}

export function recordStockAdjustment(
  part: Pick<InventoryPart, "skuId" | "partName" | "location">,
  type: StockAdjustmentType,
  qty: number,
  recordedBy = DEFAULT_RECORDED_BY
): StockAdjustmentMovement {
  const movement: StockAdjustmentMovement = {
    id: `adj-${Date.now()}-${part.skuId}`,
    date: formatMovementDate(new Date()),
    skuId: part.skuId,
    partName: part.partName,
    type,
    qty,
    location: part.location,
    recordedBy,
  }
  adjustmentRecords = [movement, ...adjustmentRecords]
  emit()
  return movement
}

export function recordStockAddition(
  part: Pick<InventoryPart, "skuId" | "partName" | "location">,
  qty: number,
  recordedBy = DEFAULT_RECORDED_BY
): StockAdjustmentMovement {
  return recordStockAdjustment(part, "Addition", qty, recordedBy)
}

export function recordStockAdditions(
  parts: Array<Pick<InventoryPart, "skuId" | "partName" | "location"> & { qty: number }>,
  recordedBy = DEFAULT_RECORDED_BY
): StockAdjustmentMovement[] {
  const date = formatMovementDate(new Date())
  const added = parts.map((part, index) => ({
    id: `adj-${Date.now()}-${index}-${part.skuId}`,
    date,
    skuId: part.skuId,
    partName: part.partName,
    type: "Addition" as const,
    qty: part.qty,
    location: part.location,
    recordedBy,
  }))
  adjustmentRecords = [...added, ...adjustmentRecords]
  emit()
  return added
}
