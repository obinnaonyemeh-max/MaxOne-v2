export type ChargerStatus = "online" | "charging" | "pending" | "offline"
export type CheckStatus = "checked-out" | "checked-in"
export type LifecycleStatus = "active" | "inactive" | "maintenance"

export interface ChargeStop {
  id: string
  address: string
  coordinates: { lat: number; lng: number }
  timestamp: string
}

export interface ChargerRegisterItem {
  id: string
  status: ChargerStatus
  checkStatus: CheckStatus
  lastUpdate: string
  location: { lat: number; lng: number }
  lastSeen: string
  lastPinged: string
  chargeStops: ChargeStop[]
  imei: string
  assignedTo: string | null
  assignedToAvatar: string | null
  assignedDate: string | null
  currentBatteryAssigned: string | null
  chargerType: string
  lifecycleStatus: LifecycleStatus
  manufacturer: string
  chargerModel: string
  currentLocation: string
  stateDeployed: string
  lastReportedTime: string
  lastTransmission: string
  firmware: string
  hardwareVersion: string
  totalSessions: number
  totalChargingTime: string
  daysOnline: number
  averageSessionDuration: string
}

export interface ChargerStatusCount {
  status: ChargerStatus
  label: string
  count: number
  color: string
}

export const chargerStatusCounts: ChargerStatusCount[] = [
  { status: "online", label: "Online", count: 1976, color: "#22C55E" },
  { status: "charging", label: "Charging", count: 1549, color: "#3B82F6" },
  { status: "pending", label: "Pending", count: 692, color: "#F59E0B" },
  { status: "offline", label: "Offline", count: 333, color: "#6B7280" },
]

export const checkedOutCount = 2450
export const checkedInCount = 1750
export const totalChargers = 4550

export const mockChargerRegisterItems: ChargerRegisterItem[] = [
  {
    id: "MXC-9747593",
    status: "online",
    checkStatus: "checked-out",
    lastUpdate: "22 Feb 2026, 13:25:43 WAT",
    location: { lat: 6.452223, lng: 3.391860 },
    lastSeen: "Lat 6.452223, Long 3.391860",
    lastPinged: "22 Feb 2026, 13:25:43 WAT",
    chargeStops: [
      {
        id: "cs-001",
        address: "12 Bello Osagie St, Ijegun, Lagos 102273, Lagos, Nigeria",
        coordinates: { lat: 6.526914, lng: 3.222369 },
        timestamp: "22 Feb 2026, 10:15:00 WAT",
      },
      {
        id: "cs-002",
        address: "45 Admiralty Way, Lekki Phase 1, Lagos",
        coordinates: { lat: 6.431234, lng: 3.456789 },
        timestamp: "21 Feb 2026, 14:30:00 WAT",
      },
      {
        id: "cs-003",
        address: "Victoria Island, Lagos",
        coordinates: { lat: 6.428055, lng: 3.422780 },
        timestamp: "21 Feb 2026, 09:45:00 WAT",
      },
      {
        id: "cs-004",
        address: "Ikeja GRA, Lagos",
        coordinates: { lat: 6.582055, lng: 3.342780 },
        timestamp: "20 Feb 2026, 16:20:00 WAT",
      },
      {
        id: "cs-005",
        address: "Surulere, Lagos",
        coordinates: { lat: 6.502055, lng: 3.352780 },
        timestamp: "20 Feb 2026, 11:00:00 WAT",
      },
    ],
    imei: "66377399200384",
    assignedTo: "Temilade Osuji",
    assignedToAvatar: "/images/champvatar.png",
    assignedDate: "22 Feb, 2026, 13:25:43",
    currentBatteryAssigned: "BAT-9883774",
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "active",
    manufacturer: "Spiro",
    chargerModel: "UFC 200",
    currentLocation: "Lat 6.452223, Long 3.391860",
    stateDeployed: "lagos",
    lastReportedTime: "22 Feb, 2026, 13:25:43",
    lastTransmission: "22 Feb, 2026, 13:25:43",
    firmware: "v3.4.12",
    hardwareVersion: "Rev C",
    totalSessions: 1284,
    totalChargingTime: "2,418 hrs",
    daysOnline: 318,
    averageSessionDuration: "1 hr 53 min",
  },
  {
    id: "MXC-9747594",
    status: "charging",
    checkStatus: "checked-out",
    lastUpdate: "22 Feb 2026, 13:25:43 WAT",
    location: { lat: 6.465123, lng: 3.405678 },
    lastSeen: "Lat 6.465123, Long 3.405678",
    lastPinged: "22 Feb 2026, 13:25:43 WAT",
    chargeStops: [
      {
        id: "cs-006",
        address: "Maryland Mall, Lagos",
        coordinates: { lat: 6.565123, lng: 3.365678 },
        timestamp: "22 Feb 2026, 12:00:00 WAT",
      },
      {
        id: "cs-007",
        address: "Yaba Tech, Lagos",
        coordinates: { lat: 6.515123, lng: 3.375678 },
        timestamp: "22 Feb 2026, 08:30:00 WAT",
      },
    ],
    imei: "66377399200385",
    assignedTo: "Temilade Osuji",
    assignedToAvatar: "/images/champvatar.png",
    assignedDate: "20 Feb, 2026, 09:15:00",
    currentBatteryAssigned: "BAT-9883775",
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "active",
    manufacturer: "Spiro",
    chargerModel: "UFC 200",
    currentLocation: "Lat 6.465123, Long 3.405678",
    stateDeployed: "lagos",
    lastReportedTime: "22 Feb, 2026, 13:25:43",
    lastTransmission: "22 Feb, 2026, 13:25:43",
    firmware: "v3.4.12",
    hardwareVersion: "Rev C",
    totalSessions: 980,
    totalChargingTime: "1,850 hrs",
    daysOnline: 245,
    averageSessionDuration: "1 hr 45 min",
  },
  {
    id: "MXC-9747595",
    status: "offline",
    checkStatus: "checked-in",
    lastUpdate: "22 Feb 2026, 13:25:43 WAT",
    location: { lat: 6.478901, lng: 3.418234 },
    lastSeen: "Lat 6.478901, Long 3.418234",
    lastPinged: "22 Feb 2026, 13:25:43 WAT",
    chargeStops: [],
    imei: "66377399200386",
    assignedTo: null,
    assignedToAvatar: null,
    assignedDate: null,
    currentBatteryAssigned: null,
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "inactive",
    manufacturer: "Spiro",
    chargerModel: "UFC 100",
    currentLocation: "Lat 6.478901, Long 3.418234",
    stateDeployed: "lagos",
    lastReportedTime: "22 Feb, 2026, 13:25:43",
    lastTransmission: "20 Feb, 2026, 08:10:00",
    firmware: "v3.2.1",
    hardwareVersion: "Rev B",
    totalSessions: 412,
    totalChargingTime: "620 hrs",
    daysOnline: 98,
    averageSessionDuration: "1 hr 30 min",
  },
  {
    id: "MXC-9747596",
    status: "pending",
    checkStatus: "checked-out",
    lastUpdate: "22 Feb 2026, 13:25:43 WAT",
    location: { lat: 6.491234, lng: 3.431567 },
    lastSeen: "Lat 6.491234, Long 3.431567",
    lastPinged: "22 Feb 2026, 13:25:43 WAT",
    chargeStops: [
      {
        id: "cs-008",
        address: "Oshodi Terminal, Lagos",
        coordinates: { lat: 6.551234, lng: 3.341567 },
        timestamp: "21 Feb 2026, 17:45:00 WAT",
      },
    ],
    imei: "66377399200387",
    assignedTo: "Temilade Osuji",
    assignedToAvatar: "/images/champvatar.png",
    assignedDate: "15 Feb, 2026, 11:00:00",
    currentBatteryAssigned: "BAT-9883776",
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "maintenance",
    manufacturer: "Spiro",
    chargerModel: "UFC 200",
    currentLocation: "Lat 6.491234, Long 3.431567",
    stateDeployed: "ogun",
    lastReportedTime: "22 Feb, 2026, 13:25:43",
    lastTransmission: "21 Feb, 2026, 17:45:00",
    firmware: "v3.4.10",
    hardwareVersion: "Rev C",
    totalSessions: 756,
    totalChargingTime: "1,120 hrs",
    daysOnline: 180,
    averageSessionDuration: "1 hr 28 min",
  },
  {
    id: "MXC-9747597",
    status: "offline",
    checkStatus: "checked-in",
    lastUpdate: "22 Feb 2026, 13:25:43 WAT",
    location: { lat: 6.504567, lng: 3.444890 },
    lastSeen: "Lat 6.504567, Long 3.444890",
    lastPinged: "22 Feb 2026, 13:25:43 WAT",
    chargeStops: [],
    imei: "66377399200388",
    assignedTo: null,
    assignedToAvatar: null,
    assignedDate: null,
    currentBatteryAssigned: null,
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "inactive",
    manufacturer: "Spiro",
    chargerModel: "UFC 100",
    currentLocation: "Lat 6.504567, Long 3.444890",
    stateDeployed: "lagos",
    lastReportedTime: "22 Feb, 2026, 13:25:43",
    lastTransmission: "18 Feb, 2026, 14:00:00",
    firmware: "v3.1.0",
    hardwareVersion: "Rev B",
    totalSessions: 210,
    totalChargingTime: "340 hrs",
    daysOnline: 52,
    averageSessionDuration: "1 hr 37 min",
  },
  {
    id: "MXC-9747598",
    status: "online",
    checkStatus: "checked-out",
    lastUpdate: "22 Feb 2026, 13:20:15 WAT",
    location: { lat: 6.517890, lng: 3.458123 },
    lastSeen: "Lat 6.517890, Long 3.458123",
    lastPinged: "22 Feb 2026, 13:20:15 WAT",
    chargeStops: [
      {
        id: "cs-009",
        address: "Festac Town, Lagos",
        coordinates: { lat: 6.467890, lng: 3.278123 },
        timestamp: "22 Feb 2026, 11:30:00 WAT",
      },
      {
        id: "cs-010",
        address: "Apapa Port, Lagos",
        coordinates: { lat: 6.447890, lng: 3.358123 },
        timestamp: "22 Feb 2026, 07:15:00 WAT",
      },
      {
        id: "cs-011",
        address: "Mile 2, Lagos",
        coordinates: { lat: 6.457890, lng: 3.318123 },
        timestamp: "21 Feb 2026, 18:00:00 WAT",
      },
    ],
    imei: "66377399200389",
    assignedTo: "Temilade Osuji",
    assignedToAvatar: "/images/champvatar.png",
    assignedDate: "10 Feb, 2026, 08:00:00",
    currentBatteryAssigned: "BAT-9883777",
    chargerType: "Panasonic 18650 Charger",
    lifecycleStatus: "active",
    manufacturer: "Spiro",
    chargerModel: "UFC 200",
    currentLocation: "Lat 6.517890, Long 3.458123",
    stateDeployed: "lagos",
    lastReportedTime: "22 Feb, 2026, 13:20:15",
    lastTransmission: "22 Feb, 2026, 13:20:15",
    firmware: "v3.4.12",
    hardwareVersion: "Rev C",
    totalSessions: 1520,
    totalChargingTime: "2,900 hrs",
    daysOnline: 360,
    averageSessionDuration: "1 hr 54 min",
  },
]

export function getChargerById(id: string): ChargerRegisterItem | undefined {
  return mockChargerRegisterItems.find((charger) => charger.id === id)
}

export type ChargingSessionStatus = "COMPLETED" | "FAULTED" | "IN PROGRESS"

export interface ChargingSession {
  id: string
  chargerId: string
  sessionId: string
  battery: string
  started: string
  duration: string
  finalStatus: ChargingSessionStatus
  energy: string
  peakOutput: string
  socStart: number
  socEnd: number
  peakTemp: string
}

export const mockChargingSessions: ChargingSession[] = [
  {
    id: "csess-001",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103921",
    battery: "BAT-2048",
    started: "Today, 08:14 PM",
    duration: "1h 48m",
    finalStatus: "COMPLETED",
    energy: "9.2 kWh",
    peakOutput: "61V / 43A",
    socStart: 18,
    socEnd: 100,
    peakTemp: "42°C",
  },
  {
    id: "csess-002",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103918",
    battery: "BAT-1982",
    started: "Today, 04:02 PM",
    duration: "2h 05m",
    finalStatus: "COMPLETED",
    energy: "10.1 kWh",
    peakOutput: "60V / 44A",
    socStart: 12,
    socEnd: 100,
    peakTemp: "44°C",
  },
  {
    id: "csess-003",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103905",
    battery: "BAT-2110",
    started: "Yesterday, 05:33 PM",
    duration: "27m",
    finalStatus: "FAULTED",
    energy: "1.4 kWh",
    peakOutput: "58V / 39A",
    socStart: 22,
    socEnd: 35,
    peakTemp: "51°C",
  },
  {
    id: "csess-004",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103890",
    battery: "BAT-1876",
    started: "Yesterday, 11:20 AM",
    duration: "1h 22m",
    finalStatus: "COMPLETED",
    energy: "7.8 kWh",
    peakOutput: "61V / 42A",
    socStart: 25,
    socEnd: 98,
    peakTemp: "40°C",
  },
  {
    id: "csess-005",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103870",
    battery: "BAT-2048",
    started: "24 Jun, 15:26 PM",
    duration: "45m",
    finalStatus: "IN PROGRESS",
    energy: "3.6 kWh",
    peakOutput: "59V / 41A",
    socStart: 30,
    socEnd: 62,
    peakTemp: "39°C",
  },
  {
    id: "csess-006",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103851",
    battery: "BAT-2201",
    started: "24 Jun, 09:10 AM",
    duration: "1h 55m",
    finalStatus: "COMPLETED",
    energy: "9.8 kWh",
    peakOutput: "62V / 45A",
    socStart: 10,
    socEnd: 100,
    peakTemp: "43°C",
  },
  {
    id: "csess-007",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103830",
    battery: "BAT-1982",
    started: "23 Jun, 06:45 PM",
    duration: "12m",
    finalStatus: "FAULTED",
    energy: "0.6 kWh",
    peakOutput: "55V / 30A",
    socStart: 40,
    socEnd: 45,
    peakTemp: "48°C",
  },
  {
    id: "csess-008",
    chargerId: "MXC-9747593",
    sessionId: "TXN-103810",
    battery: "BAT-1755",
    started: "23 Jun, 01:15 PM",
    duration: "1h 33m",
    finalStatus: "COMPLETED",
    energy: "8.4 kWh",
    peakOutput: "60V / 42A",
    socStart: 20,
    socEnd: 95,
    peakTemp: "41°C",
  },
  {
    id: "csess-009",
    chargerId: "MXC-9747594",
    sessionId: "TXN-104001",
    battery: "BAT-2300",
    started: "Today, 07:00 PM",
    duration: "1h 10m",
    finalStatus: "IN PROGRESS",
    energy: "5.2 kWh",
    peakOutput: "60V / 40A",
    socStart: 28,
    socEnd: 70,
    peakTemp: "40°C",
  },
  {
    id: "csess-010",
    chargerId: "MXC-9747594",
    sessionId: "TXN-103990",
    battery: "BAT-2110",
    started: "Yesterday, 03:40 PM",
    duration: "2h 12m",
    finalStatus: "COMPLETED",
    energy: "11.0 kWh",
    peakOutput: "61V / 44A",
    socStart: 8,
    socEnd: 100,
    peakTemp: "45°C",
  },
]

export function getChargingSessionsByChargerId(chargerId: string): ChargingSession[] {
  return mockChargingSessions.filter((session) => session.chargerId === chargerId)
}

export interface SessionChartPoint {
  label: string
  value: number
}

export interface ChargingSessionDetail {
  id: string
  sessionId: string
  status: ChargingSessionStatus
  timeRange: string
  energyDelivered: number
  peakVoltage: number
  peakCurrent: number
  peakTemperature: number
  socStart: number
  socEnd: number
  socChart: SessionChartPoint[]
  powerChart: SessionChartPoint[]
  temperatureChart: SessionChartPoint[]
  timeline: {
    id: string
    date: string
    status: string
    statusVariant: "success" | "warning" | "info" | "danger" | "default"
    description: {
      template: string
      highlights: Record<string, string>
    }
    actor: {
      action: string
      name: string
      avatar?: string
    }
    duration: {
      range: string
      total: string
    }
  }[]
}

function buildSessionCharts(socStart: number, socEnd: number) {
  const socChart: SessionChartPoint[] = [
    { label: "8:14", value: socStart },
    { label: "8:30", value: Math.round(socStart + (socEnd - socStart) * 0.2) },
    { label: "8:49", value: Math.round(socStart + (socEnd - socStart) * 0.45) },
    { label: "9:33", value: Math.round(socStart + (socEnd - socStart) * 0.75) },
    { label: "10:02", value: socEnd },
  ]
  const powerChart: SessionChartPoint[] = [
    { label: "8:14", value: 12 },
    { label: "8:30", value: 28 },
    { label: "8:49", value: 35 },
    { label: "9:33", value: 32 },
    { label: "10:02", value: 8 },
  ]
  const temperatureChart: SessionChartPoint[] = [
    { label: "8:14", value: 28 },
    { label: "8:30", value: 30 },
    { label: "8:49", value: 32 },
    { label: "9:33", value: 33 },
    { label: "10:02", value: 31 },
  ]
  return { socChart, powerChart, temperatureChart }
}

function buildSessionTimeline(sessionId: string, status: ChargingSessionStatus) {
  const base = [
    {
      id: `${sessionId}-t1`,
      date: "08:14",
      status: "Started",
      statusVariant: "success" as const,
      description: {
        template: "Charging started successfully.",
        highlights: {},
      },
      actor: { action: "Initiated by", name: "Charger System" },
      duration: { range: "08:14", total: "" },
    },
    {
      id: `${sessionId}-t2`,
      date: "08:16",
      status: "Power Normal",
      statusVariant: "warning" as const,
      description: {
        template: "Power reached normal operating range.",
        highlights: {},
      },
      actor: { action: "Detected by", name: "BMS Monitor" },
      duration: { range: "08:16", total: "" },
    },
    {
      id: `${sessionId}-t3`,
      date: "08:49",
      status: "50% SOC",
      statusVariant: "warning" as const,
      description: {
        template: "Battery reached {soc}.",
        highlights: { soc: "50%" },
      },
      actor: { action: "Reported by", name: "BMS Monitor" },
      duration: { range: "08:49", total: "" },
    },
    {
      id: `${sessionId}-t4`,
      date: "09:33",
      status: "80% SOC",
      statusVariant: "warning" as const,
      description: {
        template: "Battery reached {soc}.",
        highlights: { soc: "80%" },
      },
      actor: { action: "Reported by", name: "BMS Monitor" },
      duration: { range: "09:33", total: "" },
    },
  ]

  if (status === "FAULTED") {
    return [
      ...base.slice(0, 2),
      {
        id: `${sessionId}-t5`,
        date: "08:41",
        status: "Faulted",
        statusVariant: "danger" as const,
        description: {
          template: "Charging stopped due to a fault condition.",
          highlights: {},
        },
        actor: { action: "Detected by", name: "Safety Monitor" },
        duration: { range: "08:41", total: "" },
      },
    ]
  }

  if (status === "IN PROGRESS") {
    return base
  }

  return [
    ...base,
    {
      id: `${sessionId}-t5`,
      date: "10:02",
      status: "Completed",
      statusVariant: "success" as const,
      description: {
        template: "Charging completed successfully.",
        highlights: {},
      },
      actor: { action: "Confirmed by", name: "Charger System" },
      duration: { range: "10:02", total: "" },
    },
  ]
}

export function getChargingSessionDetail(sessionId: string): ChargingSessionDetail | undefined {
  const session = mockChargingSessions.find((s) => s.id === sessionId || s.sessionId === sessionId)
  if (!session) return undefined

  const charts = buildSessionCharts(session.socStart, session.socEnd)
  const peakVoltage = parseFloat(session.peakOutput.split("V")[0]) || 61
  const peakCurrent = parseFloat(session.peakOutput.split("/")[1]) || 43
  const peakTemperature = parseFloat(session.peakTemp) || 33
  const energyDelivered = parseFloat(session.energy) || 9.2

  return {
    id: session.id,
    sessionId: session.sessionId,
    status: session.finalStatus,
    timeRange: "26 Jun 2026 • 08:14 -> 10:02",
    energyDelivered,
    peakVoltage: session.sessionId === "TXN-103921" ? 77 : peakVoltage,
    peakCurrent: session.sessionId === "TXN-103921" ? 35 : peakCurrent,
    peakTemperature: session.sessionId === "TXN-103921" ? 33 : peakTemperature,
    socStart: session.socStart,
    socEnd: session.socEnd,
    ...charts,
    timeline: buildSessionTimeline(session.id, session.finalStatus),
  }
}

export type ChargeSpotDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

export type ChargeSpotTimeOfDay = "day" | "night"

export interface ChargeSpotPoint {
  lat: number
  lng: number
}

export interface ChargeSpot {
  id: string
  chargerId: string
  title: string
  frequency: number
  averageStopDuration: string
  averageStopDurationMinutes: number
  location: { lat: number; lng: number }
  avgDistanceBetweenStop: string
  radiusMeters: number
  points: ChargeSpotPoint[]
  /** Peak activity hour (0–23). Day = 6–18, Night = 19–5 */
  peakHour: number
  timeOfDay: ChargeSpotTimeOfDay
  activeDays: ChargeSpotDay[]
  /** ISO date used for date-range filtering */
  activityDate: string
}

function clusterPoints(center: { lat: number; lng: number }, count: number): ChargeSpotPoint[] {
  const points: ChargeSpotPoint[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const distance = 0.0015 + (i % 3) * 0.0004
    points.push({
      lat: center.lat + Math.cos(angle) * distance,
      lng: center.lng + Math.sin(angle) * distance,
    })
  }
  return points
}

export const mockChargeSpots: ChargeSpot[] = [
  {
    id: "spot-001",
    chargerId: "MXC-9747593",
    title: "Opposite Akure Garage Along Ikere Road",
    frequency: 10,
    averageStopDuration: "8hrs 32 mins",
    averageStopDurationMinutes: 512,
    location: { lat: 6.452223, lng: 3.391860 },
    avgDistanceBetweenStop: "2 km",
    radiusMeters: 350,
    points: clusterPoints({ lat: 6.452223, lng: 3.391860 }, 8),
    peakHour: 10,
    timeOfDay: "day",
    activeDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    activityDate: "2026-06-20",
  },
  {
    id: "spot-002",
    chargerId: "MXC-9747593",
    title: "12 Bello Osagie St, Ijegun",
    frequency: 14,
    averageStopDuration: "6hrs 15 mins",
    averageStopDurationMinutes: 375,
    location: { lat: 6.526914, lng: 3.222369 },
    avgDistanceBetweenStop: "1.5 km",
    radiusMeters: 320,
    points: clusterPoints({ lat: 6.526914, lng: 3.222369 }, 10),
    peakHour: 21,
    timeOfDay: "night",
    activeDays: ["friday", "saturday", "sunday"],
    activityDate: "2026-06-21",
  },
  {
    id: "spot-003",
    chargerId: "MXC-9747593",
    title: "45 Admiralty Way, Lekki Phase 1",
    frequency: 8,
    averageStopDuration: "5hrs 48 mins",
    averageStopDurationMinutes: 348,
    location: { lat: 6.431234, lng: 3.456789 },
    avgDistanceBetweenStop: "2.4 km",
    radiusMeters: 300,
    points: clusterPoints({ lat: 6.431234, lng: 3.456789 }, 7),
    peakHour: 14,
    timeOfDay: "day",
    activeDays: ["saturday", "sunday"],
    activityDate: "2026-06-22",
  },
  {
    id: "spot-004",
    chargerId: "MXC-9747593",
    title: "Ikeja GRA Junction",
    frequency: 12,
    averageStopDuration: "7hrs 05 mins",
    averageStopDurationMinutes: 425,
    location: { lat: 6.582055, lng: 3.342780 },
    avgDistanceBetweenStop: "1.8 km",
    radiusMeters: 340,
    points: clusterPoints({ lat: 6.582055, lng: 3.342780 }, 9),
    peakHour: 8,
    timeOfDay: "day",
    activeDays: ["monday", "wednesday", "friday"],
    activityDate: "2026-06-23",
  },
  {
    id: "spot-005",
    chargerId: "MXC-9747593",
    title: "Surulere Stadium Road",
    frequency: 6,
    averageStopDuration: "4hrs 20 mins",
    averageStopDurationMinutes: 260,
    location: { lat: 6.502055, lng: 3.352780 },
    avgDistanceBetweenStop: "3.1 km",
    radiusMeters: 280,
    points: clusterPoints({ lat: 6.502055, lng: 3.352780 }, 6),
    peakHour: 23,
    timeOfDay: "night",
    activeDays: ["thursday", "friday", "saturday"],
    activityDate: "2026-06-24",
  },
]

export function getChargeSpotsByChargerId(chargerId: string): ChargeSpot[] {
  return mockChargeSpots.filter((spot) => spot.chargerId === chargerId)
}

export type HeatMapDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface HeatMapCell {
  day: HeatMapDayIndex
  hour: number
  count: number
}

export interface ChargeSpotHeatMapData {
  spotId: string
  cells: HeatMapCell[]
  peakDayLabel: string
  peakTimeLabel: string
  maxCount: number
}

export const HEAT_MAP_DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

export const HEAT_MAP_DAY_SHORT = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"] as const

export function formatHeatMapHour(hour: number): string {
  if (hour === 0) return "12:00AM"
  if (hour === 12) return "12:00PM"
  if (hour < 12) return `${hour}:00AM`
  return `${hour - 12}:00PM`
}

function buildHeatMapCells(
  entries: Array<[HeatMapDayIndex, number, number]>
): HeatMapCell[] {
  const map = new Map<string, number>()
  for (const [day, hour, count] of entries) {
    map.set(`${day}-${hour}`, count)
  }

  const cells: HeatMapCell[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let day = 0; day < 7; day++) {
      cells.push({
        day: day as HeatMapDayIndex,
        hour,
        count: map.get(`${day}-${hour}`) ?? 0,
      })
    }
  }
  return cells
}

function getHeatMapPeaks(cells: HeatMapCell[]) {
  const dayTotals = Array.from({ length: 7 }, () => 0)
  const hourTotals = Array.from({ length: 24 }, () => 0)
  let maxCount = 0

  for (const cell of cells) {
    dayTotals[cell.day] += cell.count
    hourTotals[cell.hour] += cell.count
    if (cell.count > maxCount) maxCount = cell.count
  }

  const peakDay = dayTotals.indexOf(Math.max(...dayTotals)) as HeatMapDayIndex
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals))

  return {
    peakDayLabel: HEAT_MAP_DAY_LABELS[peakDay],
    peakTimeLabel: formatHeatMapHour(peakHour),
    maxCount,
  }
}

const mockHeatMapBySpotId: Record<string, HeatMapCell[]> = {
  "spot-001": buildHeatMapCells([
    [0, 8, 2], [0, 9, 3], [0, 10, 5], [0, 11, 4], [0, 14, 2],
    [1, 9, 2], [1, 10, 4], [1, 11, 3], [1, 15, 1],
    [2, 8, 1], [2, 10, 3], [2, 12, 2], [2, 16, 2],
    [3, 9, 2], [3, 10, 4], [3, 11, 3], [3, 13, 1],
    [4, 8, 3], [4, 10, 5], [4, 11, 4], [4, 17, 2],
    [5, 10, 1], [5, 11, 2],
    [6, 12, 1],
  ]),
  "spot-002": buildHeatMapCells([
    [4, 19, 2], [4, 20, 3], [4, 21, 5], [4, 22, 4],
    [5, 18, 2], [5, 19, 3], [5, 20, 4], [5, 21, 5], [5, 22, 3], [5, 23, 2],
    [6, 19, 3], [6, 20, 4], [6, 21, 5], [6, 22, 3], [6, 0, 1],
    [0, 21, 1],
  ]),
  "spot-003": buildHeatMapCells([
    [5, 10, 2], [5, 11, 3], [5, 12, 4], [5, 13, 3], [5, 14, 5], [5, 15, 2],
    [6, 9, 1], [6, 11, 3], [6, 12, 4], [6, 13, 5], [6, 14, 3], [6, 16, 2],
  ]),
  "spot-004": buildHeatMapCells([
    [0, 7, 2], [0, 8, 5], [0, 9, 4], [0, 10, 3],
    [2, 7, 1], [2, 8, 4], [2, 9, 5], [2, 10, 3], [2, 11, 2],
    [4, 7, 2], [4, 8, 5], [4, 9, 4], [4, 12, 1],
  ]),
  "spot-005": buildHeatMapCells([
    [3, 21, 2], [3, 22, 3], [3, 23, 4],
    [4, 20, 1], [4, 21, 3], [4, 22, 5], [4, 23, 4], [4, 0, 2],
    [5, 21, 2], [5, 22, 4], [5, 23, 5], [5, 0, 3],
  ]),
}

export function getChargeSpotHeatMap(spotId: string): ChargeSpotHeatMapData | undefined {
  const cells = mockHeatMapBySpotId[spotId]
  if (!cells) return undefined
  const peaks = getHeatMapPeaks(cells)
  return {
    spotId,
    cells,
    ...peaks,
  }
}
