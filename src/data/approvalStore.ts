import { useSyncExternalStore } from "react"

import {
  mockMarkedTransfers,
  type MarkedTransferRecord,
} from "./mockMarkedTransfers"
import {
  mockTimeOffApprovals,
  type TimeOffApprovalRecord,
} from "./mockTimeOffApprovals"

let transfers: MarkedTransferRecord[] = mockMarkedTransfers
let timeOffs: TimeOffApprovalRecord[] = mockTimeOffApprovals
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

export function getTransferApprovalsSnapshot(): MarkedTransferRecord[] {
  return transfers
}

export function getTimeOffApprovalsSnapshot(): TimeOffApprovalRecord[] {
  return timeOffs
}

export function useTransferApprovals(): MarkedTransferRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return transfers
}

export function useTimeOffApprovals(): TimeOffApprovalRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return timeOffs
}

export function updateTransferStatus(
  id: string,
  status: MarkedTransferRecord["status"],
  rejectionReason?: string
): MarkedTransferRecord | null {
  let updated: MarkedTransferRecord | null = null
  transfers = transfers.map((record) => {
    if (record.id !== id) return record
    updated = {
      ...record,
      status,
      ...(rejectionReason ? { rejectionReason } : {}),
      ...(status === "Approved" ? { approvedBy: "Desmond Nsogbuwa" } : {}),
    }
    return updated
  })
  if (updated) emit()
  return updated
}

export function addTimeOffApproval(record: TimeOffApprovalRecord): TimeOffApprovalRecord {
  timeOffs = [record, ...timeOffs]
  emit()
  return record
}
