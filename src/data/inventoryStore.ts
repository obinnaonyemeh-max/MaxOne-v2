import { useSyncExternalStore } from "react"

import {
  mockInventoryParts,
  type InventoryPart,
} from "./mockInventoryParts"

export interface AddPartInput {
  partName: string
  manufacturer: string
  model: string
  trim: string
  location: string
  costPrice?: number
  onHandQuantity?: number
}

let records: InventoryPart[] = mockInventoryParts
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

export function peekMaxSkuNumber(): number {
  let max = 0
  for (const part of records) {
    const match = part.skuId.match(/^PRT-(\d+)$/)
    if (match) max = Math.max(max, Number.parseInt(match[1], 10))
  }
  return max
}

function createPart(input: AddPartInput, skuId: string): InventoryPart {
  return {
    id: `inv-${Date.now()}-${skuId}`,
    skuId,
    partName: input.partName,
    manufacturer: input.manufacturer,
    model: input.model,
    trim: input.trim,
    location: input.location,
    costPrice: input.costPrice,
    onHandQuantity: input.onHandQuantity ?? 0,
    awaitingPickup: 0,
  }
}

export function getInventoryPartsSnapshot(): InventoryPart[] {
  return records
}

export function useInventoryParts(): InventoryPart[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return records
}

export function createApprovedPart(input: AddPartInput, skuId: string): InventoryPart {
  const part = createPart(input, skuId)
  records = [part, ...records]
  emit()
  return part
}

export function adjustOnHand(
  skuId: string,
  location: string,
  delta: number
): InventoryPart | null {
  let updated: InventoryPart | null = null
  records = records.map((part) => {
    if (part.skuId !== skuId || part.location !== location) return part
    updated = { ...part, onHandQuantity: Math.max(0, part.onHandQuantity + delta) }
    return updated
  })
  if (updated) emit()
  return updated
}

export function updatePartCost(id: string, costPrice: number | undefined): InventoryPart | null {
  let updated: InventoryPart | null = null
  records = records.map((part) => {
    if (part.id !== id) return part
    updated = { ...part, costPrice }
    return updated
  })
  if (updated) emit()
  return updated
}
