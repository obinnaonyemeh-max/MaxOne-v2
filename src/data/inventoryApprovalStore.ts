import { useSyncExternalStore } from "react"

import {
  adjustOnHand,
  createApprovedPart,
  getInventoryPartsSnapshot,
  peekMaxSkuNumber,
  type AddPartInput,
} from "./inventoryStore"
import { recordStockAdjustment } from "./inventoryMovementStore"
import {
  mockInventoryApprovalHistory,
  mockPendingInventoryApprovals,
  type InventoryApprovalHistoryRow,
  type InventoryApprovalRequest,
  type InventoryApprovalType,
} from "./mockInventoryApprovals"
import { availableQuantity, type InventoryPart } from "./mockInventoryParts"

const DEFAULT_REQUESTED_BY = "Fleet Ops"
const DEFAULT_REVIEWER = "Desmond N."
const BULK_QTY_INCREMENT = 10
const BULK_QTY_ROW_COUNT = 4

const BULK_IMPORT_PARTS: AddPartInput[] = [
  {
    partName: "Side Stand",
    manufacturer: "Honda",
    model: "Model A",
    trim: "Standard",
    location: "Lagos Hub",
    costPrice: 6500,
    onHandQuantity: 18,
  },
  {
    partName: "Indicator Lamp",
    manufacturer: "Yamaha",
    model: "Model B",
    trim: "Premium",
    location: "Ibadan Hub",
    costPrice: 2200,
    onHandQuantity: 24,
  },
]

let pendingRecords: InventoryApprovalRequest[] = mockPendingInventoryApprovals
let historyRecords: InventoryApprovalHistoryRow[] = mockInventoryApprovalHistory
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

function formatApprovalDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function skuNumber(skuId: string): number {
  const match = skuId.match(/^PRT-(\d+)$/)
  return match ? Number.parseInt(match[1], 10) : 0
}

function nextSkuId(): string {
  let max = peekMaxSkuNumber()
  for (const row of pendingRecords) max = Math.max(max, skuNumber(row.skuId))
  for (const row of historyRecords) max = Math.max(max, skuNumber(row.skuId))
  return `PRT-${String(max + 1).padStart(3, "0")}`
}

function toPendingRequest(
  input: {
    skuId: string
    partName: string
    type: InventoryApprovalType
    qty: number
    location: string
    requestedBy?: string
    newPart?: InventoryApprovalRequest["newPart"]
  }
): InventoryApprovalRequest {
  return {
    id: `apr-${Date.now()}-${input.skuId}`,
    date: formatApprovalDate(new Date()),
    skuId: input.skuId,
    partName: input.partName,
    type: input.type,
    qty: input.qty,
    location: input.location,
    requestedBy: input.requestedBy ?? DEFAULT_REQUESTED_BY,
    newPart: input.newPart,
  }
}

export function usePendingInventoryApprovals(): InventoryApprovalRequest[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return pendingRecords
}

export function useInventoryApprovalHistory(): InventoryApprovalHistoryRow[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return historyRecords
}

export function submitNewPartRequest(input: AddPartInput): InventoryApprovalRequest {
  const skuId = nextSkuId()
  const request = toPendingRequest({
    skuId,
    partName: input.partName,
    type: "Addition",
    qty: input.onHandQuantity ?? 0,
    location: input.location,
    newPart: {
      manufacturer: input.manufacturer,
      model: input.model,
      trim: input.trim,
      costPrice: input.costPrice,
    },
  })
  pendingRecords = [request, ...pendingRecords]
  emit()
  return request
}

export function submitBulkNewPartRequests(): InventoryApprovalRequest[] {
  const added: InventoryApprovalRequest[] = []
  for (const input of BULK_IMPORT_PARTS) {
    added.push(submitNewPartRequest(input))
  }
  return added
}

export function submitBulkQtyAdditions(): InventoryApprovalRequest[] {
  const targets = getInventoryPartsSnapshot().slice(0, BULK_QTY_ROW_COUNT)
  const added = targets.map((part) =>
    toPendingRequest({
      skuId: part.skuId,
      partName: part.partName,
      type: "Addition",
      qty: BULK_QTY_INCREMENT,
      location: part.location,
    })
  )
  pendingRecords = [...added, ...pendingRecords]
  emit()
  return added
}

export function submitExistingAdjustment(
  part: InventoryPart,
  type: InventoryApprovalType,
  qty: number
): InventoryApprovalRequest {
  if (qty <= 0) {
    throw new Error("Quantity must be greater than 0")
  }
  if (type === "Depletion" && qty > availableQuantity(part)) {
    throw new Error("Depletion cannot exceed available quantity")
  }
  const request = toPendingRequest({
    skuId: part.skuId,
    partName: part.partName,
    type,
    qty,
    location: part.location,
  })
  pendingRecords = [request, ...pendingRecords]
  emit()
  return request
}

function applyAcceptedRequest(request: InventoryApprovalRequest) {
  if (request.newPart) {
    createApprovedPart(
      {
        partName: request.partName,
        manufacturer: request.newPart.manufacturer,
        model: request.newPart.model,
        trim: request.newPart.trim,
        location: request.location,
        costPrice: request.newPart.costPrice,
        onHandQuantity: request.qty,
      },
      request.skuId
    )
  } else {
    const delta = request.type === "Addition" ? request.qty : -request.qty
    adjustOnHand(request.skuId, request.location, delta)
  }

  if (request.qty > 0) {
    recordStockAdjustment(
      {
        skuId: request.skuId,
        partName: request.partName,
        location: request.location,
      },
      request.type,
      request.qty,
      DEFAULT_REVIEWER
    )
  }
}

function moveToHistory(
  request: InventoryApprovalRequest,
  status: InventoryApprovalHistoryRow["status"],
  reason?: string
) {
  const reviewedDate = formatApprovalDate(new Date())
  const historyRow: InventoryApprovalHistoryRow = {
    ...request,
    status,
    reviewedBy: DEFAULT_REVIEWER,
    reviewedDate,
    reason: status === "Rejected" ? reason : undefined,
  }
  pendingRecords = pendingRecords.filter((row) => row.id !== request.id)
  historyRecords = [historyRow, ...historyRecords]
  emit()
}

export function acceptInventoryApproval(id: string): InventoryApprovalHistoryRow | null {
  const request = pendingRecords.find((row) => row.id === id)
  if (!request) return null
  applyAcceptedRequest(request)
  moveToHistory(request, "Approved")
  return historyRecords[0] ?? null
}

export function rejectInventoryApproval(
  id: string,
  reason: string
): InventoryApprovalHistoryRow | null {
  const trimmed = reason.trim()
  if (!trimmed) return null
  const request = pendingRecords.find((row) => row.id === id)
  if (!request) return null
  moveToHistory(request, "Rejected", trimmed)
  return historyRecords[0] ?? null
}
