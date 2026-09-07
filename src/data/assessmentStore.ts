import { useSyncExternalStore } from "react"

import type { DeactivatedVehicle } from "./mockDeactivatedVehicles"
import {
  assignedHistoryEntry,
  mockAssessmentRecords,
  type AssessmentRecord,
} from "./mockAssessmentList"
import { getQAStaffById } from "./mockQAStaff"

let records: AssessmentRecord[] = mockAssessmentRecords
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

export function useAssessmentRecords(): AssessmentRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return records
}

export function isVehicleInAssessment(vehicleId: string): boolean {
  return records.some((record) => record.vehicleId === vehicleId)
}

export function assignVehicleToAssessment(vehicle: DeactivatedVehicle, qaId: string): AssessmentRecord | null {
  if (isVehicleInAssessment(vehicle.id)) return null

  const qa = getQAStaffById(qaId)
  const date = formatAssignmentDate(new Date())
  const record: AssessmentRecord = {
    id: `asm-${Date.now()}`,
    vehicleId: vehicle.id,
    assetType: vehicle.assetType,
    assetId: vehicle.assetId,
    plateNumber: vehicle.plateNumber,
    location: vehicle.location,
    assignedQaId: qaId,
    daysInState: 0,
    status: "Awaiting Assessment",
    activityHistory: [assignedHistoryEntry(qa?.name ?? "QA", date, `asm-${vehicle.id}-assigned`)],
  }

  records = [record, ...records]
  emit()
  return record
}

function formatAssignmentDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}
