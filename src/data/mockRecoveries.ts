// Mock data for Portfolio > Recovery > Pending Recoveries / Recoveries in Session / Pending Check-Ins.
// Recovery cases start unassigned or assigned to a pair (Pending Recoveries), move into an
// active field session once a pair starts working the case (Recoveries in Session — In
// Session / Successful / Failed), and successful sessions leave behind a post-recovery
// check-in task (Pending Check-Ins). Pairs/officers are cross-referenced from
// mockRecoveryOfficers.ts so the two modules stay consistent.

import { mockRecoveryAgents, mockRecoveryPairs } from "./mockRecoveryOfficers"

export type AssignmentStatus = "Unassigned" | "Assigned"
export type SessionStatus = "In Session" | "Successful" | "Failed"
export type RecoveryVehicleType = "Two-Wheeler" | "Three-Wheeler" | "Four-Wheeler"

export interface PendingRecovery {
  id: string
  caseId: string
  championName: string
  maxId: string
  vehiclePlate: string
  vehicleType: RecoveryVehicleType
  zone: string
  outstandingBalance: number
  daysOverdue: number
  assignmentStatus: AssignmentStatus
  pairCode: string | null
  dateFlagged: string
}

export interface RecoverySession {
  id: string
  caseId: string
  championName: string
  maxId: string
  vehiclePlate: string
  vehicleType: RecoveryVehicleType
  zone: string
  pairCode: string
  officers: string
  status: SessionStatus
  startedAt: string
  elapsedMinutes: number
  completedAt: string | null
  outcomeNotes: string | null
  outstandingBalance: number
  coordinates: { lat: number; lng: number }
}

export interface PendingCheckIn {
  id: string
  caseId: string
  championName: string
  maxId: string
  vehiclePlate: string
  vehicleType: RecoveryVehicleType
  zone: string
  pairCode: string
  officers: string
  recoveredAt: string
  checkInDueDate: string
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "checkin"

export const assignmentStatusVariantMap: Record<AssignmentStatus, BadgeVariant> = {
  Unassigned: "warning",
  Assigned: "info",
}

export const sessionStatusVariantMap: Record<SessionStatus, BadgeVariant> = {
  "In Session": "info",
  Successful: "success",
  Failed: "danger",
}

export function formatElapsed(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// ── Shared seed data ──

const zones = [
  { name: "Lagos", code: "LA" },
  { name: "Abuja", code: "AB" },
  { name: "Kano", code: "KN" },
  { name: "Ibadan", code: "IB" },
  { name: "Port Harcourt", code: "PH" },
]

const zoneCoordinates: Record<string, { lat: number; lng: number; variance: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792, variance: 0.15 },
  Abuja: { lat: 9.0765, lng: 7.3986, variance: 0.12 },
  Kano: { lat: 12.0022, lng: 8.592, variance: 0.12 },
  Ibadan: { lat: 7.3775, lng: 3.947, variance: 0.12 },
  "Port Harcourt": { lat: 4.8156, lng: 7.0498, variance: 0.1 },
}

function coordinatesFor(zone: string, seed: number): { lat: number; lng: number } {
  const center = zoneCoordinates[zone] ?? zoneCoordinates.Lagos
  const offsetLat = (((seed * 37) % 100) / 100 - 0.5) * 2 * center.variance
  const offsetLng = (((seed * 53) % 100) / 100 - 0.5) * 2 * center.variance
  return { lat: center.lat + offsetLat, lng: center.lng + offsetLng }
}

const firstNames = ["Chinyere", "Segun", "Amaka", "Tobiloba", "Musa", "Ifeoma", "Kunle", "Aisha", "Chibuzo", "Ronke", "Isah", "Ngozi", "Femi", "Halima", "Obinna", "Yewande"]
const lastNames = ["Adeyemi", "Chukwu", "Balogun", "Nwachukwu", "Suleiman", "Okoli", "Adesanya", "Bello", "Okafor", "Fashola", "Danjuma", "Umeh"]
const vehicleTypePool: RecoveryVehicleType[] = ["Two-Wheeler", "Three-Wheeler", "Four-Wheeler"]

const agentById = new Map(mockRecoveryAgents.map((a) => [a.id, a]))
const officerNamesForPair = (pairId: string): string => {
  const pair = mockRecoveryPairs.find((p) => p.id === pairId)
  if (!pair) return "Unassigned"
  const a = agentById.get(pair.officerAId)?.name
  const b = agentById.get(pair.officerBId)?.name
  return [a, b].filter(Boolean).join(" & ")
}

function championFor(i: number) {
  const zone = zones[i % zones.length]
  return {
    championName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    maxId: `MAX-CH-${zone.code}-${String(4210 + i * 37).padStart(4, "0")}`,
    vehiclePlate: `${zone.code}${zone.code}-${String(110 + i * 13).padStart(3, "0")}-${String.fromCharCode(65 + (i % 20))}${String.fromCharCode(75 + (i % 12))}`,
    vehicleType: vehicleTypePool[i % vehicleTypePool.length],
    zone: zone.name,
  }
}

// ── Pending Recoveries ──

const pendingSeeds: { daysOverdue: number; balance: number; assigned: boolean; pairIdx: number }[] = [
  { daysOverdue: 45, balance: 96000, assigned: true, pairIdx: 0 },
  { daysOverdue: 12, balance: 45000, assigned: false, pairIdx: -1 },
  { daysOverdue: 63, balance: 184000, assigned: true, pairIdx: 1 },
  { daysOverdue: 8, balance: 72000, assigned: false, pairIdx: -1 },
  { daysOverdue: 30, balance: 128000, assigned: true, pairIdx: 2 },
  { daysOverdue: 21, balance: 45000, assigned: false, pairIdx: -1 },
  { daysOverdue: 55, balance: 216000, assigned: true, pairIdx: 3 },
  { daysOverdue: 5, balance: 45000, assigned: false, pairIdx: -1 },
  { daysOverdue: 40, balance: 90000, assigned: true, pairIdx: 4 },
  { daysOverdue: 17, balance: 72000, assigned: false, pairIdx: -1 },
  { daysOverdue: 72, balance: 260000, assigned: true, pairIdx: 5 },
  { daysOverdue: 9, balance: 45000, assigned: false, pairIdx: -1 },
  { daysOverdue: 26, balance: 128000, assigned: true, pairIdx: 6 },
  { daysOverdue: 14, balance: 72000, assigned: false, pairIdx: -1 },
]

export const mockPendingRecoveries: PendingRecovery[] = pendingSeeds.map((seed, i) => {
  const base = championFor(i)
  const pair = seed.assigned ? mockRecoveryPairs[seed.pairIdx] : null
  return {
    id: String(i + 1),
    caseId: `RC-${String(3001 + i).padStart(4, "0")}`,
    ...base,
    outstandingBalance: seed.balance,
    daysOverdue: seed.daysOverdue,
    assignmentStatus: seed.assigned ? "Assigned" : "Unassigned",
    pairCode: pair?.pairCode ?? null,
    dateFlagged: `${2 + (i % 26)} ${["Apr", "May", "Jun", "Jul"][i % 4]} 2025`,
  }
})

export const pendingRecoveryStats = {
  total: mockPendingRecoveries.length,
  unassigned: mockPendingRecoveries.filter((r) => r.assignmentStatus === "Unassigned").length,
  assigned: mockPendingRecoveries.filter((r) => r.assignmentStatus === "Assigned").length,
}

// ── Recoveries in Session ──

const sessionSeeds: { status: SessionStatus; pairIdx: number; elapsed: number; outcomeNotes: string | null }[] = [
  { status: "In Session", pairIdx: 0, elapsed: 42, outcomeNotes: null },
  { status: "In Session", pairIdx: 2, elapsed: 118, outcomeNotes: null },
  { status: "In Session", pairIdx: 4, elapsed: 27, outcomeNotes: null },
  { status: "In Session", pairIdx: 6, elapsed: 205, outcomeNotes: null },
  { status: "In Session", pairIdx: 1, elapsed: 9, outcomeNotes: null },
  { status: "Successful", pairIdx: 0, elapsed: 96, outcomeNotes: null },
  { status: "Successful", pairIdx: 3, elapsed: 61, outcomeNotes: null },
  { status: "Successful", pairIdx: 5, elapsed: 140, outcomeNotes: null },
  { status: "Successful", pairIdx: 1, elapsed: 78, outcomeNotes: null },
  { status: "Successful", pairIdx: 7, elapsed: 52, outcomeNotes: null },
  { status: "Successful", pairIdx: 2, elapsed: 110, outcomeNotes: null },
  { status: "Failed", pairIdx: 4, elapsed: 183, outcomeNotes: "Champion unreachable at last known address." },
  { status: "Failed", pairIdx: 6, elapsed: 220, outcomeNotes: "Vehicle relocated before pair arrival." },
  { status: "Failed", pairIdx: 3, elapsed: 95, outcomeNotes: "Champion disputed outstanding balance on site." },
  { status: "Failed", pairIdx: 5, elapsed: 160, outcomeNotes: "Escalated to law enforcement, recovery suspended." },
]

export const mockRecoverySessions: RecoverySession[] = sessionSeeds.map((seed, i) => {
  const base = championFor(i + 14)
  const pair = mockRecoveryPairs[seed.pairIdx]
  return {
    id: String(i + 1),
    caseId: `RC-${String(2801 + i).padStart(4, "0")}`,
    ...base,
    pairCode: pair.pairCode,
    officers: officerNamesForPair(pair.id),
    status: seed.status,
    startedAt: `${1 + (i % 27)} ${["Apr", "May", "Jun", "Jul"][i % 4]} 2025, ${8 + (i % 10)}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
    elapsedMinutes: seed.elapsed,
    completedAt: seed.status === "In Session" ? null : `${2 + (i % 27)} ${["Apr", "May", "Jun", "Jul"][i % 4]} 2025`,
    outcomeNotes: seed.outcomeNotes,
    outstandingBalance: 45000 + ((i * 8300) % 220000),
    coordinates: coordinatesFor(base.zone, i),
  }
})

export const recoverySessionStats = {
  inSession: mockRecoverySessions.filter((s) => s.status === "In Session").length,
  successful: mockRecoverySessions.filter((s) => s.status === "Successful").length,
  failed: mockRecoverySessions.filter((s) => s.status === "Failed").length,
}

// ── Pending Check-Ins ──
// Every successful recovery session leaves behind a post-recovery check-in task.

export const mockPendingCheckIns: PendingCheckIn[] = mockRecoverySessions
  .filter((s) => s.status === "Successful")
  .map((session, i) => ({
    id: session.id,
    caseId: session.caseId,
    championName: session.championName,
    maxId: session.maxId,
    vehiclePlate: session.vehiclePlate,
    vehicleType: session.vehicleType,
    zone: session.zone,
    pairCode: session.pairCode,
    officers: session.officers,
    recoveredAt: session.completedAt ?? "",
    checkInDueDate: `${4 + (i % 25)} ${["Apr", "May", "Jun", "Jul"][i % 4]} 2025`,
  }))

export const pendingCheckInStats = {
  total: mockPendingCheckIns.length,
  pairsInvolved: new Set(mockPendingCheckIns.map((c) => c.pairCode)).size,
  zonesAffected: new Set(mockPendingCheckIns.map((c) => c.zone)).size,
}

// ── Recovery Command Center ──
// Rolls up the whole module: active field sessions, resolved outcomes, and follow-on check-ins.

export const recoveryCommandCenterStats = {
  activeRecoveries: recoverySessionStats.inSession,
  successful: recoverySessionStats.successful,
  failed: recoverySessionStats.failed,
  successRate: Math.round(
    (recoverySessionStats.successful /
      Math.max(1, recoverySessionStats.successful + recoverySessionStats.failed)) *
      100
  ),
  activePairs: new Set(
    mockRecoverySessions.filter((s) => s.status === "In Session").map((s) => s.pairCode)
  ).size,
  pendingCheckIns: pendingCheckInStats.total,
}
