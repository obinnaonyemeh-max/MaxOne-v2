import { format } from "date-fns"
import {
  clearBatteriesPending,
  getStationById,
  getTransferableBatteries,
  markBatteriesPending,
  mockSwapStations,
  moveBatteriesToStation,
  syncStationBatteryCount,
  type StationBattery,
  type StationProvider,
} from "./mockStationsData"

export type TransferStatus = "pending" | "accepted" | "rejected"
export type TransferDirection = "incoming" | "outgoing"

export interface TransferBatterySnapshot {
  id: string
  provider: StationProvider
  stateOfCharge: number
  isCharging: boolean
  isPluggedIn: boolean
}

export interface BatteryTransfer {
  id: string
  sourceStationId: string
  sourceStationName: string
  destinationStationId: string
  destinationStationName: string
  destinationAdminName: string
  batteries: TransferBatterySnapshot[]
  status: TransferStatus
  initiatedAt: string
  resolvedAt?: string | null
}

export const transferStatusLabels: Record<TransferStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
}

export const transferStatusVariantMap: Record<
  TransferStatus,
  "warning" | "success" | "danger"
> = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
}

function formatTimestamp(date = new Date()): string {
  return `${format(date, "d MMM yyyy, HH:mm")} WAT`
}

function snapshotBatteries(batteries: StationBattery[]): TransferBatterySnapshot[] {
  return batteries.map((battery) => ({
    id: battery.id,
    provider: battery.provider,
    stateOfCharge: battery.stateOfCharge,
    isCharging: battery.isCharging,
    isPluggedIn: battery.isPluggedIn,
  }))
}

function nextTransferId(): string {
  return `TRF-${100000 + mockTransfers.length + 1}`
}

export const mockTransfers: BatteryTransfer[] = []

function seedTransfers() {
  const sources = mockSwapStations.filter(
    (station) => getTransferableBatteries(station.id).length >= 2
  )
  if (sources.length === 0) return

  const destA = mockSwapStations[0]
  const sourceA = sources.find((station) => station.id !== destA.id) ?? sources[0]
  if (sourceA && destA && sourceA.id !== destA.id) {
    const batteries = getTransferableBatteries(sourceA.id).slice(0, 2)
    const transfer: BatteryTransfer = {
      id: "TRF-100001",
      sourceStationId: sourceA.id,
      sourceStationName: sourceA.name,
      destinationStationId: destA.id,
      destinationStationName: destA.name,
      destinationAdminName: destA.adminName || "Station Admin",
      batteries: snapshotBatteries(batteries),
      status: "pending",
      initiatedAt: "21 Aug 2026, 09:14 WAT",
    }
    mockTransfers.push(transfer)
    markBatteriesPending(
      batteries.map((battery) => battery.id),
      transfer.id
    )
  }

  const destB = mockSwapStations[2]
  const sourceB = sources.find(
    (station) =>
      station.id !== destB?.id &&
      station.id !== destA.id &&
      station.id !== sourceA.id
  )
  if (sourceB && destB && sourceB.id !== destB.id) {
    const batteries = getTransferableBatteries(sourceB.id).slice(0, 1)
    if (batteries.length > 0) {
      const transfer: BatteryTransfer = {
        id: "TRF-100002",
        sourceStationId: sourceB.id,
        sourceStationName: sourceB.name,
        destinationStationId: destB.id,
        destinationStationName: destB.name,
        destinationAdminName: destB.adminName || "Station Admin",
        batteries: snapshotBatteries(batteries),
        status: "pending",
        initiatedAt: "20 Aug 2026, 16:42 WAT",
      }
      mockTransfers.push(transfer)
      markBatteriesPending(
        batteries.map((battery) => battery.id),
        transfer.id
      )
    }
  }

  const historySource = mockSwapStations[4]
  const historyDest = mockSwapStations[5]
  if (historySource && historyDest) {
    mockTransfers.push({
      id: "TRF-100003",
      sourceStationId: historySource.id,
      sourceStationName: historySource.name,
      destinationStationId: historyDest.id,
      destinationStationName: historyDest.name,
      destinationAdminName: historyDest.adminName || "Station Admin",
      batteries: [
        {
          id: "BAT-HIST-001",
          provider: "MAX",
          stateOfCharge: 82,
          isCharging: false,
          isPluggedIn: false,
        },
        {
          id: "BAT-HIST-002",
          provider: "Spiro",
          stateOfCharge: 64,
          isCharging: true,
          isPluggedIn: true,
        },
      ],
      status: "accepted",
      initiatedAt: "18 Aug 2026, 11:05 WAT",
      resolvedAt: "18 Aug 2026, 14:20 WAT",
    })
    mockTransfers.push({
      id: "TRF-100004",
      sourceStationId: historyDest.id,
      sourceStationName: historyDest.name,
      destinationStationId: historySource.id,
      destinationStationName: historySource.name,
      destinationAdminName: historySource.adminName || "Station Admin",
      batteries: [
        {
          id: "BAT-HIST-003",
          provider: "Siltech",
          stateOfCharge: 31,
          isCharging: false,
          isPluggedIn: true,
        },
      ],
      status: "rejected",
      initiatedAt: "17 Aug 2026, 08:33 WAT",
      resolvedAt: "17 Aug 2026, 10:02 WAT",
    })
  }
}

seedTransfers()

export function getTransfersForStation(stationId: string): BatteryTransfer[] {
  return mockTransfers
    .filter(
      (transfer) =>
        transfer.sourceStationId === stationId ||
        transfer.destinationStationId === stationId
    )
    .sort((a, b) => b.id.localeCompare(a.id))
}

export function getTransferDirection(
  transfer: BatteryTransfer,
  stationId: string
): TransferDirection {
  return transfer.destinationStationId === stationId ? "incoming" : "outgoing"
}

export function initiateTransfer(input: {
  sourceStationId: string
  destinationStationId: string
  batteryIds: string[]
}): BatteryTransfer | undefined {
  const source = getStationById(input.sourceStationId)
  const destination = getStationById(input.destinationStationId)
  if (!source || !destination) return undefined

  const batteries = getTransferableBatteries(source.id).filter((battery) =>
    input.batteryIds.includes(battery.id)
  )
  if (batteries.length === 0) return undefined

  const transfer: BatteryTransfer = {
    id: nextTransferId(),
    sourceStationId: source.id,
    sourceStationName: source.name,
    destinationStationId: destination.id,
    destinationStationName: destination.name,
    destinationAdminName: destination.adminName || "Station Admin",
    batteries: snapshotBatteries(batteries),
    status: "pending",
    initiatedAt: formatTimestamp(),
  }

  mockTransfers.unshift(transfer)
  markBatteriesPending(
    batteries.map((battery) => battery.id),
    transfer.id
  )
  return transfer
}

export function acceptTransfer(id: string): BatteryTransfer | undefined {
  const transfer = mockTransfers.find((item) => item.id === id)
  if (!transfer || transfer.status !== "pending") return undefined

  const batteryIds = transfer.batteries.map((battery) => battery.id)
  moveBatteriesToStation(batteryIds, transfer.destinationStationId)
  syncStationBatteryCount(transfer.sourceStationId)
  syncStationBatteryCount(transfer.destinationStationId)

  transfer.status = "accepted"
  transfer.resolvedAt = formatTimestamp()
  return transfer
}

export function rejectTransfer(id: string): BatteryTransfer | undefined {
  const transfer = mockTransfers.find((item) => item.id === id)
  if (!transfer || transfer.status !== "pending") return undefined

  clearBatteriesPending(transfer.batteries.map((battery) => battery.id))
  transfer.status = "rejected"
  transfer.resolvedAt = formatTimestamp()
  return transfer
}
