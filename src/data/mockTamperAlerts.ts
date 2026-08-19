// Mirror of the StatusBadge variant union (not exported from the component).
type StatusBadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "neutral"

export type TamperAlertType =
  | "Missed heartbeat"
  | "External voltage loss"
  | "Locked & moving"
  | "Internal voltage loss"

export type TamperAlertStatus = "Unresolved" | "In Progress" | "Resolved"

export type TamperCheckStatus = "Checked In" | "Checked Out"

// Snapshot of the last values the tracker reported before / at the tamper event.
export interface TamperParameters {
  championId: string
  championName: string
  speed: string
  odometer: string
  vehicleStatus: "Moving" | "Parked" | "Idle"
  ignition: "On" | "Off"
  imei: string
  location: string
  lat: number
  lng: number
  externalVoltage: string
  internalVoltage: string
  lastRecordedTime: string
  shutoff: "Immobilized" | "Mobilized"
  city: string
}

export type TamperRecoveryStatus =
  | "Recovery Not Started"
  | "Recovery In Progress"
  | "Recovery Completed"

export const tamperRecoveryStatusVariantMap: Record<TamperRecoveryStatus, StatusBadgeVariant> = {
  "Recovery Not Started": "neutral",
  "Recovery In Progress": "warning",
  "Recovery Completed": "success",
}

// Recovery-pair dispatch details shown on the location map.
export interface TamperRecovery {
  pairNames: string
  emails: string
  location: string
  lat: number
  lng: number
  estimatedTime: string
  estimatedDistance: string
  lastUpdate: string
  status: TamperRecoveryStatus
}

export interface TamperAlert {
  id: string
  type: TamperAlertType
  status: TamperAlertStatus
  checkStatus: TamperCheckStatus
  dateTime: string
  assignedTechnician: string
  assignedRecoveryPair: string
  location: string
  plateNumber: string
  parameters: TamperParameters
  recovery: TamperRecovery
}

// Type badge colour — voltage loss / locked & moving are the most severe,
// missed heartbeat is a softer warning signal.
export const tamperTypeVariantMap: Record<TamperAlertType, StatusBadgeVariant> = {
  "Missed heartbeat": "warning",
  "External voltage loss": "danger",
  "Internal voltage loss": "danger",
  "Locked & moving": "danger",
}

export const tamperStatusVariantMap: Record<TamperAlertStatus, StatusBadgeVariant> = {
  Unresolved: "danger",
  "In Progress": "warning",
  Resolved: "success",
}

export const tamperVehicleStatusVariantMap: Record<TamperParameters["vehicleStatus"], StatusBadgeVariant> = {
  Moving: "info",
  Parked: "neutral",
  Idle: "warning",
}

type BaseTamperAlert = Omit<TamperAlert, "parameters" | "recovery"> & {
  championId: string
  championName: string
  city: string
  lat: number
  lng: number
}

const baseTamperAlerts: BaseTamperAlert[] = [
  { id: "TMP-2026-0412", type: "Locked & moving",       status: "Unresolved", checkStatus: "Checked In",  dateTime: "18 Aug 2026, 14:32", assignedTechnician: "Daniel Amokachi", assignedRecoveryPair: "Musa Ibrahim & Kunle Adeyemi", location: "Ikeja, Lagos",    plateNumber: "LND-482-KJ", championId: "MX-CHP-0341", championName: "Adaeze Okonkwo",  city: "Lagos",         lat: 6.6018, lng: 3.3515 },
  { id: "TMP-2026-0411", type: "External voltage loss", status: "In Progress", checkStatus: "Checked Out", dateTime: "18 Aug 2026, 13:58", assignedTechnician: "Sarah Johnson",   assignedRecoveryPair: "Ahmed Sani & Femi Oladele",    location: "Yaba, Lagos",     plateNumber: "LSR-119-AA", championId: "MX-CHP-0298", championName: "Emeka Nwosu",     city: "Lagos",         lat: 6.5095, lng: 3.3711 },
  { id: "TMP-2026-0410", type: "Missed heartbeat",      status: "Unresolved", checkStatus: "Checked In",  dateTime: "18 Aug 2026, 13:20", assignedTechnician: "Michael Chen",    assignedRecoveryPair: "Emeka Obi & Tunde Bakare",     location: "Wuse, Abuja",     plateNumber: "ABC-771-GG", championId: "MX-CHP-0317", championName: "Oluwaseun Bello",  city: "Abuja",         lat: 9.0765, lng: 7.4890 },
  { id: "TMP-2026-0409", type: "Internal voltage loss", status: "In Progress", checkStatus: "Checked Out", dateTime: "18 Aug 2026, 12:47", assignedTechnician: "Fatima Bello",    assignedRecoveryPair: "John Eze & Segun Alabi",       location: "Port Harcourt",   plateNumber: "RSH-233-PQ", championId: "MX-CHP-0389", championName: "Ibrahim Yusuf",    city: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { id: "TMP-2026-0408", type: "Missed heartbeat",      status: "Unresolved", checkStatus: "Checked In",  dateTime: "18 Aug 2026, 11:15", assignedTechnician: "Chidi Okafor",    assignedRecoveryPair: "Musa Ibrahim & Kunle Adeyemi", location: "Surulere, Lagos", plateNumber: "LSD-902-KL", championId: "MX-CHP-0251", championName: "Funmilayo Ade",    city: "Lagos",         lat: 6.5004, lng: 3.3480 },
  { id: "TMP-2026-0407", type: "Locked & moving",       status: "Unresolved", checkStatus: "Checked Out", dateTime: "18 Aug 2026, 10:03", assignedTechnician: "Daniel Amokachi", assignedRecoveryPair: "Ahmed Sani & Femi Oladele",    location: "Ikorodu, Lagos",  plateNumber: "LKD-556-MN", championId: "MX-CHP-0372", championName: "Tunde Bakare",     city: "Lagos",         lat: 6.6194, lng: 3.5105 },
  { id: "TMP-2026-0406", type: "External voltage loss", status: "Unresolved", checkStatus: "Checked In",  dateTime: "18 Aug 2026, 09:41", assignedTechnician: "Sarah Johnson",   assignedRecoveryPair: "Emeka Obi & Tunde Bakare",     location: "Garki, Abuja",    plateNumber: "ABJ-318-RT", championId: "MX-CHP-0284", championName: "Chioma Obi",       city: "Abuja",         lat: 9.0333, lng: 7.4833 },
  { id: "TMP-2026-0405", type: "Missed heartbeat",      status: "In Progress", checkStatus: "Checked Out", dateTime: "17 Aug 2026, 22:19", assignedTechnician: "Michael Chen",    assignedRecoveryPair: "John Eze & Segun Alabi",       location: "Lekki, Lagos",    plateNumber: "LEK-640-VB", championId: "MX-CHP-0356", championName: "Yemi Adesanya",    city: "Lagos",         lat: 6.4698, lng: 3.5852 },
  { id: "TMP-2026-0404", type: "Internal voltage loss", status: "Unresolved", checkStatus: "Checked In",  dateTime: "17 Aug 2026, 20:55", assignedTechnician: "Fatima Bello",    assignedRecoveryPair: "Musa Ibrahim & Kunle Adeyemi", location: "Aba, Abia",       plateNumber: "ABI-207-XY", championId: "MX-CHP-0207", championName: "Amaka Eze",        city: "Aba",           lat: 5.1066, lng: 7.3667 },
  { id: "TMP-2026-0403", type: "Locked & moving",       status: "Unresolved", checkStatus: "Checked Out", dateTime: "17 Aug 2026, 18:32", assignedTechnician: "Chidi Okafor",    assignedRecoveryPair: "Ahmed Sani & Femi Oladele",    location: "Kano Municipal",  plateNumber: "KNO-884-DF", championId: "MX-CHP-0401", championName: "Ngozi Eze",        city: "Kano",          lat: 12.0022, lng: 8.5920 },
  { id: "TMP-2026-0402", type: "Missed heartbeat",      status: "Unresolved", checkStatus: "Checked In",  dateTime: "17 Aug 2026, 16:47", assignedTechnician: "Daniel Amokachi", assignedRecoveryPair: "Emeka Obi & Tunde Bakare",     location: "Oshodi, Lagos",   plateNumber: "LSO-471-GH", championId: "MX-CHP-0415", championName: "Chukwuemeka Ibe",  city: "Lagos",         lat: 6.5546, lng: 3.3486 },
  { id: "TMP-2026-0401", type: "External voltage loss", status: "Unresolved", checkStatus: "Checked Out", dateTime: "17 Aug 2026, 15:09", assignedTechnician: "Sarah Johnson",   assignedRecoveryPair: "John Eze & Segun Alabi",       location: "Enugu",           plateNumber: "ENU-125-JK", championId: "MX-CHP-0423", championName: "Adaora Nwosu",     city: "Enugu",         lat: 6.4413, lng: 7.4988 },

  { id: "TMP-2026-0388", type: "Missed heartbeat",      status: "Resolved", checkStatus: "Checked In",  dateTime: "16 Aug 2026, 14:22", assignedTechnician: "Michael Chen",    assignedRecoveryPair: "Musa Ibrahim & Kunle Adeyemi", location: "Ikeja, Lagos",    plateNumber: "LND-330-PL", championId: "MX-CHP-0192", championName: "Patience Ogbu",   city: "Lagos",         lat: 6.6018, lng: 3.3515 },
  { id: "TMP-2026-0387", type: "Locked & moving",       status: "Resolved", checkStatus: "Checked Out", dateTime: "16 Aug 2026, 11:48", assignedTechnician: "Fatima Bello",    assignedRecoveryPair: "Ahmed Sani & Femi Oladele",    location: "Wuse, Abuja",     plateNumber: "ABC-902-QW", championId: "MX-CHP-0178", championName: "Tobi Adewale",    city: "Abuja",         lat: 9.0765, lng: 7.4890 },
  { id: "TMP-2026-0386", type: "External voltage loss", status: "Resolved", checkStatus: "Checked In",  dateTime: "16 Aug 2026, 09:31", assignedTechnician: "Chidi Okafor",    assignedRecoveryPair: "Emeka Obi & Tunde Bakare",     location: "Yaba, Lagos",     plateNumber: "LSR-604-ZX", championId: "MX-CHP-0165", championName: "Nkem Obi",        city: "Lagos",         lat: 6.5095, lng: 3.3711 },
  { id: "TMP-2026-0385", type: "Internal voltage loss", status: "Resolved", checkStatus: "Checked Out", dateTime: "15 Aug 2026, 19:05", assignedTechnician: "Daniel Amokachi", assignedRecoveryPair: "John Eze & Segun Alabi",       location: "Port Harcourt",   plateNumber: "RSH-778-CV", championId: "MX-CHP-0153", championName: "Adaeze Eze",      city: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { id: "TMP-2026-0384", type: "Missed heartbeat",      status: "Resolved", checkStatus: "Checked In",  dateTime: "15 Aug 2026, 16:40", assignedTechnician: "Sarah Johnson",   assignedRecoveryPair: "Musa Ibrahim & Kunle Adeyemi", location: "Surulere, Lagos", plateNumber: "LSD-215-BN", championId: "MX-CHP-0142", championName: "Ibrahim Ali",     city: "Lagos",         lat: 6.5004, lng: 3.3480 },
  { id: "TMP-2026-0383", type: "Locked & moving",       status: "Resolved", checkStatus: "Checked Out", dateTime: "15 Aug 2026, 13:12", assignedTechnician: "Michael Chen",    assignedRecoveryPair: "Ahmed Sani & Femi Oladele",    location: "Ikorodu, Lagos",  plateNumber: "LKD-091-MT", championId: "MX-CHP-0130", championName: "Segun Falowo",    city: "Lagos",         lat: 6.6194, lng: 3.5105 },
  { id: "TMP-2026-0382", type: "External voltage loss", status: "Resolved", checkStatus: "Checked In",  dateTime: "14 Aug 2026, 21:58", assignedTechnician: "Fatima Bello",    assignedRecoveryPair: "Emeka Obi & Tunde Bakare",     location: "Garki, Abuja",    plateNumber: "ABJ-556-LK", championId: "MX-CHP-0118", championName: "Kemi Adeyemi",    city: "Abuja",         lat: 9.0333, lng: 7.4833 },
  { id: "TMP-2026-0381", type: "Missed heartbeat",      status: "Resolved", checkStatus: "Checked Out", dateTime: "14 Aug 2026, 18:33", assignedTechnician: "Chidi Okafor",    assignedRecoveryPair: "John Eze & Segun Alabi",       location: "Lekki, Lagos",    plateNumber: "LEK-142-RD", championId: "MX-CHP-0106", championName: "Bola Okafor",     city: "Lagos",         lat: 6.4698, lng: 3.5852 },
]

// Derive the "last reported parameters" snapshot from each alert's context so the
// values stay internally consistent with the tamper type (e.g. a voltage-loss
// event reports a collapsed rail, a locked-&-moving event reports motion).
function deriveParameters(base: BaseTamperAlert, index: number): TamperParameters {
  const isMoving = base.type === "Locked & moving"
  const externalLoss = base.type === "External voltage loss"
  const internalLoss = base.type === "Internal voltage loss"

  return {
    championId: base.championId,
    championName: base.championName,
    speed: isMoving ? `${22 + (index % 5) * 6} km/h` : "0 km/h",
    odometer: `${(11_500 + index * 337).toLocaleString()} km`,
    vehicleStatus: isMoving ? "Moving" : index % 3 === 0 ? "Idle" : "Parked",
    ignition: isMoving ? "On" : "Off",
    imei: `3566${(770000000000 + index * 137).toString().slice(0, 11)}`,
    location: `${base.lat.toFixed(4)}, ${base.lng.toFixed(4)}`,
    lat: base.lat,
    lng: base.lng,
    externalVoltage: externalLoss ? "0.0 V" : `${(12.2 + (index % 4) * 0.15).toFixed(1)} V`,
    internalVoltage: internalLoss ? "3.1 V" : `${(3.8 + (index % 3) * 0.05).toFixed(2)} V`,
    lastRecordedTime: base.dateTime,
    shutoff: isMoving ? "Immobilized" : "Mobilized",
    city: base.city,
  }
}

// Derive the recovery-pair dispatch details from the assigned pair — email
// handles from the names, a staging location offset from the vehicle, and an
// ETA/distance for the dispatch.
function deriveRecovery(base: BaseTamperAlert, index: number): TamperRecovery {
  const names = base.assignedRecoveryPair.split(" & ")
  const emails = names
    .map((n) => `${n.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".")}@maxdrive.ai`)
    .join(", ")

  // TMP-2026-0410 is a completed recovery: the pair has reached the vehicle,
  // so the officer sits on the exact same spot and the trip is done.
  const isCompleted = base.id === "TMP-2026-0410" || base.status === "Resolved"

  const recoveryLat = isCompleted ? base.lat : base.lat + 0.016
  const recoveryLng = isCompleted ? base.lng : base.lng + 0.021

  return {
    pairNames: names.join(", "),
    emails,
    location: `Long ${recoveryLng.toFixed(6)}, Lat ${recoveryLat.toFixed(6)}`,
    lat: recoveryLat,
    lng: recoveryLng,
    estimatedTime: isCompleted ? "0 hr" : `${1 + (index % 3)} hr`,
    estimatedDistance: isCompleted ? "0.000km" : `${(8.4 + (index % 6) * 1.31).toFixed(3)}km`,
    lastUpdate: `${2 + (index % 8)} mins ago`,
    status: isCompleted ? "Recovery Completed" : index % 2 === 0 ? "Recovery Not Started" : "Recovery In Progress",
  }
}

export const mockTamperAlerts: TamperAlert[] = baseTamperAlerts.map((base, index) => {
  const { championId, championName, city, lat, lng, ...alert } = base
  void championId; void championName; void city; void lat; void lng
  return {
    ...alert,
    parameters: deriveParameters(base, index),
    recovery: deriveRecovery(base, index),
  }
})

// Movement / recovery history shown in the "View Movement History" timeline modal.
export interface TamperMovementEvent {
  id: string
  timestamp: string
  title: string
  statusVariant: "success" | "warning" | "info" | "danger" | "default"
  descriptionTemplate?: string
  name?: string
}

export const mockTamperMovementHistory: TamperMovementEvent[] = [
  { id: "mv-1", timestamp: "3rd Jan 2023 10:45 PM", title: "Tamper Confirmed", statusVariant: "success" },
  { id: "mv-2", timestamp: "3rd Aug 2023 10:45 PM", title: "Assigned to Recovery Officer", statusVariant: "info", descriptionTemplate: "Assigned to {name}", name: "James Harry" },
  { id: "mv-3", timestamp: "3rd Aug 2023 10:45 PM", title: "Recovery Started", statusVariant: "info", descriptionTemplate: "Recovery in progress by {name}", name: "James Harry" },
  { id: "mv-4", timestamp: "3rd Aug 2023 10:45 PM", title: "Recovery Failed", statusVariant: "danger", descriptionTemplate: "Failed recovery by {name}", name: "James Harry" },
  { id: "mv-5", timestamp: "3rd Aug 2023 10:45 PM", title: "Reassigned to Recovery Officer", statusVariant: "info", descriptionTemplate: "Assigned to {name}", name: "James Sunday" },
  { id: "mv-6", timestamp: "3rd Aug 2023 10:45 PM", title: "Recovery Started", statusVariant: "info", descriptionTemplate: "Recovery in progress by {name}", name: "James Harry" },
]

export const tamperUnresolvedCount = mockTamperAlerts.filter((a) => a.status !== "Resolved").length
export const tamperResolvedCount = mockTamperAlerts.filter((a) => a.status === "Resolved").length
