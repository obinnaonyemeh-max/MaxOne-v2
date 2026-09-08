import { useSyncExternalStore } from "react"
import {
  createPendingVehicleDocument,
  mockVehicleDocuments,
  type VehicleDocumentRecord,
  type VehicleType,
} from "./mockVehicleDocuments"

let records: VehicleDocumentRecord[] = [...mockVehicleDocuments]
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

export function getVehicleDocuments(): VehicleDocumentRecord[] {
  return records
}

export function addPendingVehicleDocument(input: {
  vehicleId: string
  location: string
  champion?: string
  type?: VehicleType
}): VehicleDocumentRecord {
  const existing = records.find((row) => row.vehicleId === input.vehicleId)
  if (existing) return existing

  const next = createPendingVehicleDocument(input)
  records = [next, ...records]
  emit()
  return next
}

export function useVehicleDocuments() {
  useSyncExternalStore(subscribe, getVersion)
  return records
}
