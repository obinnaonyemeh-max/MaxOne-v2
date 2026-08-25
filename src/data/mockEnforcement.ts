import {
  mockVehicleRegisterItems,
  getVehicleById,
  type VehicleRegisterItem,
} from "@/data/mockVehicleRegister"
import {
  addEnforcementEvent,
  type EnforcementTrigger,
} from "@/data/mockVehicleActivity"

export type EnforcementActionType = "swap-block" | "vehicle-lock" | "battery-lock"

export interface EnforcementRecord {
  id: string
  vehicleId: string
  plateNumber: string
  championName: string
  championId: string
  avatarUrl: string
  currentDpd: number
  action: EnforcementActionType
  triggerType: EnforcementTrigger
  reason: string
  lastUpdated: string
}

export const ENFORCEMENT_ACTION_LABELS: Record<EnforcementActionType, string> = {
  "swap-block": "Swap Block",
  "vehicle-lock": "Vehicle Lock",
  "battery-lock": "Battery Lock",
}

export const ENFORCEMENT_HISTORY_LABELS: Record<EnforcementActionType, string> = {
  "swap-block": "Swap Block",
  "vehicle-lock": "Vehicle Lock",
  "battery-lock": "Battery Charge & Discharge Lock",
}

export const ENFORCEMENT_ACTION_VARIANTS: Record<
  EnforcementActionType,
  "default" | "warning" | "danger"
> = {
  "swap-block": "default",
  "vehicle-lock": "warning",
  "battery-lock": "danger",
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const ISSUER = "Darius Dolapo"
const AVATAR_URL = "/images/champvatar.png"

const REASON_PRESETS: { reason: string; dpd: number; triggerType: EnforcementTrigger }[] = [
  { reason: "2 Days past due", dpd: 2, triggerType: "Automated" },
  { reason: "3 Days past due", dpd: 3, triggerType: "Automated" },
  { reason: "Tamper detected", dpd: 0, triggerType: "Manual" },
  { reason: "Overdue payment", dpd: 4, triggerType: "Automated" },
  { reason: "Geofence breach", dpd: 0, triggerType: "Manual" },
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function championIdForName(name: string): string {
  return `MAX-IB-CH-${200 + (hashString(name) % 300)}`
}

export function dpdFromReason(reason: string): number {
  const match = reason.match(/(\d+)\s*(DPD|Days?)/i)
  return match ? Number(match[1]) : 0
}

export function formatEnforcementTimestamp(date = new Date()): string {
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} WAT`
}

function actionsForVehicle(vehicle: VehicleRegisterItem): EnforcementActionType[] {
  return vehicle.category === "ev"
    ? ["swap-block", "vehicle-lock", "battery-lock"]
    : ["swap-block", "vehicle-lock"]
}

function logHistoryEvent(
  record: EnforcementRecord,
  type: string,
  statusVariant: "success" | "warning" | "danger" | "default",
  issuedBy?: string
) {
  addEnforcementEvent(record.vehicleId, {
    type,
    timestamp: record.lastUpdated,
    triggeredType: record.triggerType,
    reason: record.reason,
    issuedBy,
    statusVariant,
  })
}

function buildRecord(
  vehicle: VehicleRegisterItem,
  action: EnforcementActionType,
  preset: (typeof REASON_PRESETS)[number],
  lastUpdated: string,
  suffix: string
): EnforcementRecord {
  const championName = vehicle.assignedDriver ?? "Unassigned"
  return {
    id: `${vehicle.id}-${action}-${suffix}`,
    vehicleId: vehicle.id,
    plateNumber: vehicle.plateNumber,
    championName,
    championId: championIdForName(championName),
    avatarUrl: AVATAR_URL,
    currentDpd: preset.dpd,
    action,
    triggerType: preset.triggerType,
    reason: preset.reason,
    lastUpdated,
  }
}

function seedActiveEnforcements(): EnforcementRecord[] {
  const candidates = mockVehicleRegisterItems.filter(
    (vehicle) => vehicle.checkStatus === "checked-out" && vehicle.assignedDriver
  )
  const records: EnforcementRecord[] = []

  candidates.forEach((vehicle, index) => {
    const pool = actionsForVehicle(vehicle)
    const preset = REASON_PRESETS[index % REASON_PRESETS.length]
    const action = pool[index % pool.length]
    const day = 10 + (index % 14)
    const hour = 8 + (index % 12)
    const minute = (index * 7) % 60
    const seconds = (index * 13) % 60
    const lastUpdated = `${day} Aug 2026, ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} WAT`

    const primary = buildRecord(vehicle, action, preset, lastUpdated, "1")
    records.push(primary)
    logHistoryEvent(
      primary,
      ENFORCEMENT_HISTORY_LABELS[action],
      ENFORCEMENT_ACTION_VARIANTS[action],
      preset.triggerType === "Manual" ? ISSUER : undefined
    )

    if (index % 3 === 0 && pool.length > 1) {
      const secondAction = pool[(index + 1) % pool.length]
      const secondPreset = REASON_PRESETS[(index + 2) % REASON_PRESETS.length]
      const second = buildRecord(
        vehicle,
        secondAction,
        secondPreset,
        `${day} Aug 2026, ${((hour + 2) % 24).toString().padStart(2, "0")}:${((minute + 11) % 60)
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} WAT`,
        "2"
      )
      records.push(second)
      logHistoryEvent(
        second,
        ENFORCEMENT_HISTORY_LABELS[secondAction],
        ENFORCEMENT_ACTION_VARIANTS[secondAction],
        secondPreset.triggerType === "Manual" ? ISSUER : undefined
      )
    }
  })

  return records.sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
}

const activeEnforcements: EnforcementRecord[] = seedActiveEnforcements()

export function getActiveEnforcements(): EnforcementRecord[] {
  return [...activeEnforcements]
}

export function applyEnforcement(input: {
  vehicleId: string
  action: EnforcementActionType
  reason: string
  comment?: string
  triggerType?: EnforcementTrigger
}): EnforcementRecord | undefined {
  const vehicle = getVehicleById(input.vehicleId)
  if (!vehicle) return undefined

  const championName = vehicle.assignedDriver ?? "Unassigned"
  const reason = input.comment ? `${input.reason} — ${input.comment}` : input.reason
  const record: EnforcementRecord = {
    id: `${vehicle.id}-${input.action}-${Date.now()}`,
    vehicleId: vehicle.id,
    plateNumber: vehicle.plateNumber,
    championName,
    championId: championIdForName(championName),
    avatarUrl: AVATAR_URL,
    currentDpd: dpdFromReason(input.reason),
    action: input.action,
    triggerType: input.triggerType ?? "Manual",
    reason,
    lastUpdated: formatEnforcementTimestamp(),
  }

  const existingIndex = activeEnforcements.findIndex(
    (item) => item.vehicleId === record.vehicleId && item.action === record.action
  )
  if (existingIndex >= 0) {
    activeEnforcements.splice(existingIndex, 1)
  }
  activeEnforcements.unshift(record)

  addEnforcementEvent(record.vehicleId, {
    type: ENFORCEMENT_HISTORY_LABELS[record.action],
    timestamp: record.lastUpdated,
    triggeredType: record.triggerType,
    reason: record.reason,
    issuedBy: record.triggerType === "Manual" ? ISSUER : undefined,
    statusVariant: ENFORCEMENT_ACTION_VARIANTS[record.action],
  })

  return record
}

export function reverseEnforcement(
  id: string,
  reason: string
): EnforcementRecord | undefined {
  const index = activeEnforcements.findIndex((item) => item.id === id)
  if (index < 0) return undefined

  const [record] = activeEnforcements.splice(index, 1)
  const timestamp = formatEnforcementTimestamp()

  addEnforcementEvent(record.vehicleId, {
    type: `${ENFORCEMENT_HISTORY_LABELS[record.action]} Reversed`,
    timestamp,
    triggeredType: "Manual",
    reason,
    issuedBy: ISSUER,
    statusVariant: "default",
  })

  return record
}
