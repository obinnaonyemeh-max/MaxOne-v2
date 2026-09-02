// Mock data for Portfolio > Recovery > Recovery Officers.
// Recovery agents work in the field in two-person "pairs"; a pair is issued
// one operational vehicle and picks up recovery cases assigned to it.

export type OfficerStatus = "Active" | "On Leave" | "Inactive"
export type PairStatus = "Active" | "Inactive"
export type VehicleStatus = "In Use" | "Available" | "Maintenance"

export interface RecoveryAgent {
  id: string
  name: string
  staffId: string
  phone: string
  location: string
  status: OfficerStatus
  pairId: string | null
  casesHandled: number
  dateEnlisted: string
}

export interface RecoveryVehicle {
  id: string
  plateNumber: string
  type: "Two-Wheeler" | "Four-Wheeler"
  status: VehicleStatus
  pairId: string | null
}

export interface RecoveryPair {
  id: string
  pairCode: string
  officerAId: string
  officerBId: string
  zone: string
  status: PairStatus
  vehicleId: string | null
  activeCases: number
  successfulRecoveries: number
  failedRecoveries: number
  dateFormed: string
  // Assigned location/state — the pair's home base, distinct from `deployedZone` below.
  assignedLocation: string
  // The specific area the pair is actively operating in, within `assignedLocation`.
  deployedZone: string
  avgRecoveryMinutes: number
  paymentRecoveries: number
  checkInRecoveries: number
  bonusAccrued: number
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const officerStatusVariantMap: Record<OfficerStatus, BadgeVariant> = {
  Active: "success",
  "On Leave": "warning",
  Inactive: "default",
}

export const pairStatusVariantMap: Record<PairStatus, BadgeVariant> = {
  Active: "success",
  Inactive: "default",
}

export const vehicleStatusVariantMap: Record<VehicleStatus, BadgeVariant> = {
  "In Use": "info",
  Available: "success",
  Maintenance: "warning",
}

const zones = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"]

// Maps a pair's home zone to its assigned state (Pair Location widget) and the
// specific areas it can be actively deployed to within that state (Deployed Zone widget).
export const zoneLocationInfo: Record<string, { state: string; areas: string[] }> = {
  Lagos: { state: "Lagos State", areas: ["Ikeja", "Lekki–Ajah Corridor", "Apapa", "Ojo"] },
  Abuja: { state: "FCT Abuja", areas: ["Wuse", "Garki", "Gwarinpa"] },
  Kano: { state: "Kano State", areas: ["Sabon Gari", "Nassarawa", "Fagge"] },
  Ibadan: { state: "Oyo State", areas: ["Bodija", "Challenge", "Ring Road"] },
  "Port Harcourt": { state: "Rivers State", areas: ["GRA Phase 2", "Trans Amadi", "Rumuola"] },
}

const agentNames = [
  ["Kelechi", "Obi"], ["Ibrahim", "Suleiman"], ["Chiamaka", "Nnamdi"], ["Tobi", "Alade"],
  ["Grace", "Umeh"], ["Yakubu", "Danlami"], ["Peace", "Effiong"], ["Chuks", "Ibekwe"],
  ["Halima", "Garba"], ["Emeka", "Osaze"], ["Rasheed", "Alabi"], ["Blessing", "Etim"],
  ["Sani", "Musa"], ["Ijeoma", "Okoro"], ["Bashir", "Lawal"], ["Precious", "Ekong"],
  ["Damilare", "Fashola"], ["Uche", "Anyanwu"],
]

const agentsBase: Omit<RecoveryAgent, "pairId">[] = agentNames.map(([first, last], i) => ({
  id: String(i + 1),
  name: `${first} ${last}`,
  staffId: `MAX-RCV-${String(101 + i).padStart(4, "0")}`,
  phone: `+234${(8020000000 + i * 913171).toString().slice(0, 10)}`,
  location: zones[i % zones.length],
  status: i === 5 ? "On Leave" : i === 11 ? "Inactive" : "Active",
  casesHandled: 8 + ((i * 7) % 40),
  dateEnlisted: `${5 + (i % 20)} ${["Jan", "Feb", "Mar", "Apr", "May"][i % 5]} 2025`,
}))

const pairSeeds: { zone: string; vehicleIdx: number; successful: number; failed: number; active: number }[] = [
  { zone: "Lagos", vehicleIdx: 0, successful: 34, failed: 6, active: 3 },
  { zone: "Abuja", vehicleIdx: 1, successful: 21, failed: 9, active: 2 },
  { zone: "Kano", vehicleIdx: 2, successful: 18, failed: 4, active: 1 },
  { zone: "Ibadan", vehicleIdx: 3, successful: 27, failed: 11, active: 4 },
  { zone: "Port Harcourt", vehicleIdx: 4, successful: 15, failed: 3, active: 2 },
  { zone: "Lagos", vehicleIdx: 5, successful: 40, failed: 8, active: 5 },
  { zone: "Abuja", vehicleIdx: 6, successful: 12, failed: 7, active: 1 },
  { zone: "Ibadan", vehicleIdx: 7, successful: 9, failed: 2, active: 2 },
]

export const mockRecoveryPairs: RecoveryPair[] = pairSeeds.map((seed, i) => {
  const location = zoneLocationInfo[seed.zone] ?? zoneLocationInfo.Lagos
  const paymentRecoveries = Math.round(seed.successful * 0.4)
  return {
    id: String(i + 1),
    pairCode: `RP-${String(i + 1).padStart(3, "0")}`,
    officerAId: String(i * 2 + 1),
    officerBId: String(i * 2 + 2),
    zone: seed.zone,
    status: "Active",
    vehicleId: String(seed.vehicleIdx + 1),
    activeCases: seed.active,
    successfulRecoveries: seed.successful,
    failedRecoveries: seed.failed,
    dateFormed: `${3 + i} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2025`,
    assignedLocation: location.state,
    deployedZone: location.areas[i % location.areas.length],
    avgRecoveryMinutes: 95 + ((i * 17) % 120),
    paymentRecoveries,
    checkInRecoveries: seed.successful - paymentRecoveries,
    bonusAccrued: seed.successful * 5000 + i * 1250,
  }
})

const pairIdByAgentId = new Map<string, string>()
mockRecoveryPairs.forEach((pair) => {
  pairIdByAgentId.set(pair.officerAId, pair.id)
  pairIdByAgentId.set(pair.officerBId, pair.id)
})

export const mockRecoveryAgents: RecoveryAgent[] = agentsBase.map((agent) => ({
  ...agent,
  pairId: pairIdByAgentId.get(agent.id) ?? null,
}))

const vehicleTypeByIdx: RecoveryVehicle["type"][] = [
  "Two-Wheeler", "Four-Wheeler", "Two-Wheeler", "Four-Wheeler",
  "Two-Wheeler", "Four-Wheeler", "Two-Wheeler", "Four-Wheeler",
]

export const mockRecoveryVehicles: RecoveryVehicle[] = [
  ...vehicleTypeByIdx.map((type, i) => ({
    id: String(i + 1),
    plateNumber: `RCV-${String(200 + i * 11).padStart(3, "0")}-${String.fromCharCode(65 + i)}${String.fromCharCode(75 + i)}`,
    type,
    status: "In Use" as VehicleStatus,
    pairId: mockRecoveryPairs[i]?.id ?? null,
  })),
  { id: "9", plateNumber: "RCV-311-QX", type: "Four-Wheeler", status: "Available", pairId: null },
  { id: "10", plateNumber: "RCV-322-QY", type: "Two-Wheeler", status: "Available", pairId: null },
  { id: "11", plateNumber: "RCV-333-QZ", type: "Four-Wheeler", status: "Maintenance", pairId: null },
]

export const recoveryOfficerStats = {
  totalAgents: mockRecoveryAgents.length,
  activeAgents: mockRecoveryAgents.filter((a) => a.status === "Active").length,
  totalPairs: mockRecoveryPairs.length,
  unassignedAgents: mockRecoveryAgents.filter((a) => a.pairId === null && a.status === "Active").length,
}

// ---- Custom Assignment CSV-upload flow ----

export interface CustomAssignmentErrorRow {
  caseId: string
  pairCode: string
  reason: string
}

// Simulated CSV-upload validation result for the "Make Custom Assignment" bulk-assign flow
export const mockCustomAssignmentStats = {
  totalRows: 8,
  validEntries: 6,
  rowsWithErrors: 2,
}

export const mockCustomAssignmentErrorRows: CustomAssignmentErrorRow[] = [
  { caseId: "RC-3099", pairCode: "RP-010", reason: "Pair code not found" },
  { caseId: "RC-9001", pairCode: "RP-002", reason: "Case ID not found in Pending Recoveries" },
]
