import { findStationBatteryById, getStationById, type StationBattery } from "./mockStationsData"

export type BatteryStatus = "riding" | "in-transit" | "idle" | "checked-in" | "retired" | "unknown"

export interface BatteryAlert {
  type: "over-temperature" | "low-soh" | "offline"
  message: string
  severity: "L1" | "L2" | "L3"
  value?: string
}

export interface SOHHistoryPoint {
  month: string
  value: number
  hasEvent?: boolean
}

export type AssignmentStatus = "assigned" | "unassigned" | "maintenance"

export interface BatteryRegisterItem {
  id: string
  status: BatteryStatus
  lastUpdate: string
  stateOfCharge: number
  stateOfHealth: number
  distanceLeft: number
  voltage: number
  current: number
  temperature: number
  location: { lat: number; lng: number }
  lastSeen: string
  lastPinged: string
  sohHistory: SOHHistoryPoint[]
  alerts: BatteryAlert[]
  cellVoltages: number[]
  cycleCount: number
  isCharging: boolean
  isPluggedIn: boolean
  simNumber: string
  assignmentStatus: AssignmentStatus
  assignedTo: string | null
  batteryModel: string
  lastReportedTime: string
  lastSwapTime: string
  // Additional fields for Battery Details page
  uniqueId: string
  imeiNumber: string
  capacity: number
  owner: string
  currentStation: string
  bmsNumber: string
  registrationDate: string
}

export interface BatteryStatusCount {
  status: BatteryStatus
  label: string
  count: number
  color: string
}

export const batteryStatusCounts: BatteryStatusCount[] = [
  { status: "riding", label: "Riding", count: 1976, color: "var(--color-success)" },
  { status: "in-transit", label: "In Transit", count: 1549, color: "var(--color-gray-600)" },
  { status: "idle", label: "Idle", count: 692, color: "var(--color-status-warning)" },
  { status: "checked-in", label: "Checked-In", count: 692, color: "var(--color-status-info)" },
  { status: "retired", label: "Retired", count: 692, color: "var(--color-status-danger)" },
  { status: "unknown", label: "Unknown", count: 333, color: "var(--color-gray-400)" },
]

export const mockBatteryRegisterItems: BatteryRegisterItem[] = [
  {
    id: "BAT-9883774",
    status: "riding",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 64,
    stateOfHealth: 80,
    distanceLeft: 534,
    voltage: 77,
    current: 35,
    temperature: 33,
    location: { lat: 6.452223, lng: 3.391860 },
    lastSeen: "Lat 6.452223, Long 3.391860",
    lastPinged: "22 Feb 2023, 13:25:43 WAT",
    sohHistory: [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 52 },
      { month: "Mar", value: 48 },
      { month: "Apr", value: 55, hasEvent: true },
      { month: "May", value: 62, hasEvent: true },
      { month: "Jun", value: 78 },
      { month: "Jul", value: 64 },
    ],
    alerts: [
      { type: "over-temperature", message: "Over Temperature Protection", severity: "L3" },
      { type: "low-soh", message: "SOH below configured threshold", severity: "L2", value: "64%" },
      { type: "offline", message: "Offline for 24 minutes", severity: "L1" },
    ],
    cellVoltages: [380, 350, 340, 360, 180, 350, 380, 20, 350, 380, 360, 380, 350, 360, 380, 350],
    cycleCount: 18,
    isCharging: false,
    isPluggedIn: false,
    simNumber: "07047775838",
    assignmentStatus: "assigned",
    assignedTo: "CZ326ABJ",
    batteryModel: "Panasonic 18650 Battery",
    lastReportedTime: "10 Jul, 2024, 13:25:43",
    lastSwapTime: "07:56 am, 10th Jul, 2024",
    uniqueId: "993777499948857777722",
    imeiNumber: "888493882777774787",
    capacity: 80,
    owner: "Spiro Tech",
    currentStation: "Lekki Phase 1 Swap Station",
    bmsNumber: "990049958885858",
    registrationDate: "10th Jul, 2024",
  },
  {
    id: "BAT-9883775",
    status: "in-transit",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 78,
    stateOfHealth: 92,
    distanceLeft: 420,
    voltage: 82,
    current: 28,
    temperature: 29,
    location: { lat: 6.458912, lng: 3.401250 },
    lastSeen: "Lat 6.458912, Long 3.401250",
    lastPinged: "22 Feb 2023, 13:20:15 WAT",
    sohHistory: [
      { month: "Jan", value: 88 },
      { month: "Feb", value: 90 },
      { month: "Mar", value: 89 },
      { month: "Apr", value: 91 },
      { month: "May", value: 92 },
      { month: "Jun", value: 91 },
      { month: "Jul", value: 92 },
    ],
    alerts: [],
    cellVoltages: [390, 385, 388, 392, 387, 390, 385, 388, 391, 386, 389, 390, 387, 388, 390, 385],
    cycleCount: 12,
    isCharging: false,
    isPluggedIn: false,
    simNumber: "07047774489",
    assignmentStatus: "assigned",
    assignedTo: "CZ327ABK",
    batteryModel: "Lithium-Ion",
    lastReportedTime: "10 Jul, 2024, 12:45:00",
    lastSwapTime: "08:30 am, 9th Jul, 2024",
    uniqueId: "993777499948857777723",
    imeiNumber: "888493882777774788",
    capacity: 72,
    owner: "Spiro Tech",
    currentStation: "Victoria Island Swap Station",
    bmsNumber: "990049958885859",
    registrationDate: "5th Jun, 2024",
  },
  {
    id: "BAT-9883776",
    status: "checked-in",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 95,
    stateOfHealth: 88,
    distanceLeft: 680,
    voltage: 84,
    current: 0,
    temperature: 25,
    location: { lat: 6.445678, lng: 3.385420 },
    lastSeen: "Lat 6.445678, Long 3.385420",
    lastPinged: "22 Feb 2023, 12:45:00 WAT",
    sohHistory: [
      { month: "Jan", value: 92 },
      { month: "Feb", value: 91 },
      { month: "Mar", value: 90 },
      { month: "Apr", value: 89 },
      { month: "May", value: 88 },
      { month: "Jun", value: 88 },
      { month: "Jul", value: 88 },
    ],
    alerts: [
      { type: "low-soh", message: "SOH declining trend detected", severity: "L2", value: "88%" },
    ],
    cellVoltages: [395, 392, 390, 388, 394, 391, 393, 390, 392, 395, 388, 391, 393, 390, 392, 394],
    cycleCount: 25,
    isCharging: true,
    isPluggedIn: true,
    simNumber: "07047774490",
    assignmentStatus: "maintenance",
    assignedTo: null,
    batteryModel: "Ultracapacitor",
    lastReportedTime: "10 Jul, 2024, 11:30:00",
    lastSwapTime: "06:00 am, 8th Jul, 2024",
    uniqueId: "993777499948857777724",
    imeiNumber: "888493882777774789",
    capacity: 80,
    owner: "Spiro Tech",
    currentStation: "Ikeja Swap Station",
    bmsNumber: "990049958885860",
    registrationDate: "20th Mar, 2024",
  },
  {
    id: "BAT-9883777",
    status: "idle",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 42,
    stateOfHealth: 71,
    distanceLeft: 285,
    voltage: 72,
    current: 0,
    temperature: 31,
    location: { lat: 6.462345, lng: 3.378900 },
    lastSeen: "Lat 6.462345, Long 3.378900",
    lastPinged: "22 Feb 2023, 11:30:22 WAT",
    sohHistory: [
      { month: "Jan", value: 82 },
      { month: "Feb", value: 80 },
      { month: "Mar", value: 78 },
      { month: "Apr", value: 76, hasEvent: true },
      { month: "May", value: 74 },
      { month: "Jun", value: 72 },
      { month: "Jul", value: 71 },
    ],
    alerts: [
      { type: "low-soh", message: "SOH below 75% threshold", severity: "L2", value: "71%" },
      { type: "offline", message: "Offline for 2 hours", severity: "L1" },
    ],
    cellVoltages: [360, 355, 350, 345, 340, 355, 360, 350, 345, 358, 352, 348, 355, 350, 360, 355],
    cycleCount: 45,
    isCharging: false,
    isPluggedIn: true,
    simNumber: "07047774491",
    assignmentStatus: "assigned",
    assignedTo: "CZ328ABL",
    batteryModel: "Lithium-Ion",
    lastReportedTime: "10 Jul, 2024, 09:15:22",
    lastSwapTime: "10:00 am, 5th Jul, 2024",
    uniqueId: "993777499948857777725",
    imeiNumber: "888493882777774790",
    capacity: 60,
    owner: "Metro Energy",
    currentStation: "Surulere Swap Station",
    bmsNumber: "990049958885861",
    registrationDate: "15th Jan, 2024",
  },
  {
    id: "BAT-9883778",
    status: "retired",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 15,
    stateOfHealth: 35,
    distanceLeft: 45,
    voltage: 65,
    current: 0,
    temperature: 28,
    location: { lat: 6.440123, lng: 3.395670 },
    lastSeen: "Lat 6.440123, Long 3.395670",
    lastPinged: "20 Feb 2023, 09:15:00 WAT",
    sohHistory: [
      { month: "Jan", value: 55 },
      { month: "Feb", value: 50 },
      { month: "Mar", value: 45, hasEvent: true },
      { month: "Apr", value: 42 },
      { month: "May", value: 38, hasEvent: true },
      { month: "Jun", value: 36 },
      { month: "Jul", value: 35 },
    ],
    alerts: [
      { type: "low-soh", message: "SOH critically low", severity: "L3", value: "35%" },
      { type: "over-temperature", message: "Historical thermal events", severity: "L2" },
    ],
    cellVoltages: [280, 250, 220, 260, 180, 240, 270, 200, 250, 280, 230, 260, 240, 250, 270, 255],
    cycleCount: 120,
    isCharging: false,
    isPluggedIn: false,
    simNumber: "07047774492",
    assignmentStatus: "unassigned",
    assignedTo: null,
    batteryModel: "Lithium-Ion",
    lastReportedTime: "20 Feb, 2023, 09:15:00",
    lastSwapTime: "15:30 pm, 1st Jan, 2023",
    uniqueId: "993777499948857777726",
    imeiNumber: "888493882777774791",
    capacity: 72,
    owner: "Spiro Tech",
    currentStation: "Yaba Swap Station",
    bmsNumber: "990049958885862",
    registrationDate: "10th Aug, 2022",
  },
  {
    id: "BAT-9883779",
    status: "unknown",
    lastUpdate: "22 Feb 2023, 13:25:43 WAT",
    stateOfCharge: 0,
    stateOfHealth: 0,
    distanceLeft: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    location: { lat: 6.455000, lng: 3.390000 },
    lastSeen: "Unknown",
    lastPinged: "Unknown",
    sohHistory: [
      { month: "Jan", value: 75 },
      { month: "Feb", value: 72 },
      { month: "Mar", value: 0 },
      { month: "Apr", value: 0 },
      { month: "May", value: 0 },
      { month: "Jun", value: 0 },
      { month: "Jul", value: 0 },
    ],
    alerts: [
      { type: "offline", message: "No communication for 5 months", severity: "L3" },
    ],
    cellVoltages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cycleCount: 0,
    isCharging: false,
    isPluggedIn: false,
    simNumber: "Unknown",
    assignmentStatus: "unassigned",
    assignedTo: null,
    batteryModel: "Unknown",
    lastReportedTime: "Unknown",
    lastSwapTime: "Unknown",
    uniqueId: "Unknown",
    imeiNumber: "Unknown",
    capacity: 0,
    owner: "Unknown",
    currentStation: "Unknown",
    bmsNumber: "Unknown",
    registrationDate: "Unknown",
  },
]

export const totalBatteries = batteryStatusCounts.reduce((sum, item) => sum + item.count, 0)

export function getBatteryById(id: string): BatteryRegisterItem | undefined {
  const fromRegister = mockBatteryRegisterItems.find((battery) => battery.id === id)
  if (fromRegister) return fromRegister

  const stationBattery = findStationBatteryById(id)
  if (!stationBattery) return undefined
  return mapStationBatteryToRegisterItem(stationBattery)
}

function mapStationBatteryToRegisterItem(battery: StationBattery): BatteryRegisterItem {
  const station = getStationById(battery.stationId)
  const location = station?.coordinates ?? { lat: 0, lng: 0 }

  return {
    id: battery.id,
    status: "checked-in",
    lastUpdate: "Checked in at station",
    stateOfCharge: battery.stateOfCharge,
    stateOfHealth: 80,
    distanceLeft: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    location,
    lastSeen: station
      ? `Lat ${location.lat.toFixed(6)}, Long ${location.lng.toFixed(6)}`
      : "Unknown",
    lastPinged: "Checked in at station",
    sohHistory: [],
    alerts: [],
    cellVoltages: [],
    cycleCount: 0,
    isCharging: battery.isCharging,
    isPluggedIn: battery.isPluggedIn,
    simNumber: "—",
    assignmentStatus: "unassigned",
    assignedTo: null,
    batteryModel: battery.provider,
    lastReportedTime: "—",
    lastSwapTime: "—",
    uniqueId: battery.id,
    imeiNumber: "—",
    capacity: 0,
    owner: battery.provider,
    currentStation: station?.name ?? "Unknown",
    bmsNumber: "—",
    registrationDate: "—",
  }
}

// Alert History types and mock data
export type AlertStatus = "triggered" | "acknowledged" | "in-progress" | "resolved"

export interface AlertHistoryItem {
  id: string
  alertType: string
  severity: string
  status: AlertStatus
  triggeredOn: string
  assignedTo: string
  resolutionStatus: string
}

// Using the StatusBadge variants defined in the project
export const alertStatusVariantMap: Record<AlertStatus, "danger" | "warning" | "info" | "success"> = {
  triggered: "danger",      // Red - badge-inactive colors
  acknowledged: "warning",  // Yellow/Orange - status-warning colors
  "in-progress": "info",    // Teal/Blue - status-info colors
  resolved: "success",      // Green - badge-active colors
}

export const alertStatusLabels: Record<AlertStatus, string> = {
  triggered: "Triggered",
  acknowledged: "Acknowledged",
  "in-progress": "In Progress",
  resolved: "Resolved",
}

export const mockAlertHistory: AlertHistoryItem[] = [
  {
    id: "ALT-10482",
    alertType: "Over Temperature Protection",
    severity: "Level 3",
    status: "triggered",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    assignedTo: "Daniel Amokachi",
    resolutionStatus: "Under Engineering Review",
  },
  {
    id: "ALT-10483",
    alertType: "Battery Degradation Threshold",
    severity: "Level 4",
    status: "acknowledged",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    assignedTo: "Daniel Amokachi",
    resolutionStatus: "Inspection Scheduled",
  },
  {
    id: "ALT-10484",
    alertType: "Offline Detection",
    severity: "Level 2",
    status: "in-progress",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    assignedTo: "Daniel Amokachi",
    resolutionStatus: "Awaiting Assignment",
  },
  {
    id: "ALT-10485",
    alertType: "Voltage Undervoltage Protection",
    severity: "Level 1",
    status: "resolved",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    assignedTo: "Daniel Amokachi",
    resolutionStatus: "Resolved - Battery Rebalanced",
  },
  {
    id: "ALT-10486",
    alertType: "Cell Imbalance Detected",
    severity: "Level 2",
    status: "triggered",
    triggeredOn: "21 Feb 2024, 10:15:22 WAT",
    assignedTo: "Sarah Johnson",
    resolutionStatus: "Pending Review",
  },
  {
    id: "ALT-10487",
    alertType: "SOH Below Threshold",
    severity: "Level 3",
    status: "acknowledged",
    triggeredOn: "20 Feb 2024, 09:45:11 WAT",
    assignedTo: "Michael Chen",
    resolutionStatus: "Diagnostic Running",
  },
  {
    id: "ALT-10488",
    alertType: "Communication Loss",
    severity: "Level 1",
    status: "resolved",
    triggeredOn: "19 Feb 2024, 16:30:00 WAT",
    assignedTo: "Daniel Amokachi",
    resolutionStatus: "Resolved - Connection Restored",
  },
  {
    id: "ALT-10489",
    alertType: "Overcurrent Protection",
    severity: "Level 4",
    status: "in-progress",
    triggeredOn: "18 Feb 2024, 14:20:33 WAT",
    assignedTo: "Sarah Johnson",
    resolutionStatus: "Replacement Scheduled",
  },
]

// Alert Detail interface for drawer
export interface AlertTimelineEntry {
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
}

export interface AlertDetail {
  id: string
  alertType: string
  status: AlertStatus
  severity: string
  triggeredOn: string
  description: string
  batteryId: string
  alarmCode: string
  age: string
  location: string
  assignee: string
  assignedTo: string | null
  timeline: AlertTimelineEntry[]
}

export const mockAlertDetails: Record<string, AlertDetail> = {
  "ALT-10482": {
    id: "ALT-10482",
    alertType: "Over Temperature Protection",
    status: "triggered",
    severity: "Level 3",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    description: "Battery temperature exceeded the configured threshold of 45°C. The battery management system triggered a protective shutdown to prevent thermal runaway. Immediate inspection and cooling measures are recommended.",
    batteryId: "BAT-9883774",
    alarmCode: "OTP-003",
    age: "2 hours 15 mins",
    location: "Lekki Phase 1 Swap Station",
    assignee: "Daniel Amokachi",
    assignedTo: null,
    timeline: [
      {
        id: "1",
        date: "22 Feb 2024",
        status: "Triggered",
        statusVariant: "danger",
        description: {
          template: "Alert triggered when battery temperature reached {temp}. Automatic protection activated.",
          highlights: { temp: "52°C" },
        },
        actor: {
          action: "System detected by",
          name: "BMS Auto-Monitor",
        },
        duration: {
          range: "13:25:43 WAT",
          total: "",
        },
      },
    ],
  },
  "ALT-10483": {
    id: "ALT-10483",
    alertType: "Battery Degradation Threshold",
    status: "acknowledged",
    severity: "Level 4",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    description: "State of Health (SOH) has dropped below the critical threshold of 70%. Battery performance is significantly degraded and replacement should be scheduled.",
    batteryId: "BAT-9883775",
    alarmCode: "BDT-004",
    age: "4 hours 30 mins",
    location: "Victoria Island Swap Station",
    assignee: "Daniel Amokachi",
    assignedTo: "Engineering Team",
    timeline: [
      {
        id: "1",
        date: "22 Feb 2024",
        status: "Triggered",
        statusVariant: "danger",
        description: {
          template: "Alert triggered when SOH dropped to {soh}.",
          highlights: { soh: "68%" },
        },
        actor: {
          action: "System detected by",
          name: "BMS Auto-Monitor",
        },
        duration: {
          range: "09:00:00 WAT",
          total: "",
        },
      },
      {
        id: "2",
        date: "22 Feb 2024",
        status: "Acknowledged",
        statusVariant: "warning",
        description: {
          template: "Alert acknowledged and assigned to {team} for inspection.",
          highlights: { team: "Engineering Team" },
        },
        actor: {
          action: "Acknowledged by",
          name: "Daniel Amokachi",
        },
        duration: {
          range: "13:25:43 WAT",
          total: "4h 25m",
        },
      },
    ],
  },
  "ALT-10484": {
    id: "ALT-10484",
    alertType: "Offline Detection",
    status: "in-progress",
    severity: "Level 2",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    description: "Battery has been offline and not communicating with the central system for an extended period. This may indicate communication module failure or battery relocation outside coverage area.",
    batteryId: "BAT-9883776",
    alarmCode: "OFF-002",
    age: "6 hours 45 mins",
    location: "Ikeja Swap Station",
    assignee: "Daniel Amokachi",
    assignedTo: "Field Operations",
    timeline: [
      {
        id: "1",
        date: "22 Feb 2024",
        status: "Triggered",
        statusVariant: "danger",
        description: {
          template: "Battery went offline after {duration} of no communication.",
          highlights: { duration: "30 minutes" },
        },
        actor: {
          action: "System detected by",
          name: "Communication Monitor",
        },
        duration: {
          range: "06:40:00 WAT",
          total: "",
        },
      },
      {
        id: "2",
        date: "22 Feb 2024",
        status: "Acknowledged",
        statusVariant: "warning",
        description: {
          template: "Alert acknowledged and escalated to field team.",
          highlights: {},
        },
        actor: {
          action: "Acknowledged by",
          name: "Daniel Amokachi",
        },
        duration: {
          range: "08:15:00 WAT",
          total: "1h 35m",
        },
      },
      {
        id: "3",
        date: "22 Feb 2024",
        status: "In Progress",
        statusVariant: "info",
        description: {
          template: "Field team dispatched to {location} for physical inspection.",
          highlights: { location: "Ikeja Swap Station" },
        },
        actor: {
          action: "Updated by",
          name: "Field Operations",
        },
        duration: {
          range: "13:25:43 WAT",
          total: "5h 10m",
        },
      },
    ],
  },
  "ALT-10485": {
    id: "ALT-10485",
    alertType: "Voltage Undervoltage Protection",
    status: "resolved",
    severity: "Level 1",
    triggeredOn: "22 Feb 2024, 13:25:43 WAT",
    description: "Battery voltage dropped below the minimum safe operating threshold. The battery was successfully rebalanced and voltage levels have returned to normal operating range.",
    batteryId: "BAT-9883777",
    alarmCode: "UVP-001",
    age: "Resolved",
    location: "Surulere Swap Station",
    assignee: "Daniel Amokachi",
    assignedTo: null,
    timeline: [
      {
        id: "1",
        date: "22 Feb 2024",
        status: "Triggered",
        statusVariant: "danger",
        description: {
          template: "Undervoltage detected at {voltage}. Minimum threshold is 3.0V per cell.",
          highlights: { voltage: "2.8V" },
        },
        actor: {
          action: "System detected by",
          name: "BMS Auto-Monitor",
        },
        duration: {
          range: "10:00:00 WAT",
          total: "",
        },
      },
      {
        id: "2",
        date: "22 Feb 2024",
        status: "Acknowledged",
        statusVariant: "warning",
        description: {
          template: "Alert acknowledged. Battery flagged for rebalancing.",
          highlights: {},
        },
        actor: {
          action: "Acknowledged by",
          name: "Daniel Amokachi",
        },
        duration: {
          range: "10:30:00 WAT",
          total: "30m",
        },
      },
      {
        id: "3",
        date: "22 Feb 2024",
        status: "In Progress",
        statusVariant: "info",
        description: {
          template: "Battery rebalancing procedure initiated.",
          highlights: {},
        },
        actor: {
          action: "Started by",
          name: "Station Technician",
        },
        duration: {
          range: "11:00:00 WAT",
          total: "30m",
        },
      },
      {
        id: "4",
        date: "22 Feb 2024",
        status: "Resolved",
        statusVariant: "success",
        description: {
          template: "Battery successfully rebalanced. Voltage restored to {voltage}.",
          highlights: { voltage: "3.7V" },
        },
        actor: {
          action: "Resolved by",
          name: "Station Technician",
        },
        duration: {
          range: "13:25:43 WAT",
          total: "2h 25m",
        },
      },
    ],
  },
}

export function getAlertDetail(alertId: string): AlertDetail | undefined {
  return mockAlertDetails[alertId]
}

// Mock trend data for telemetry charts
export const mockTrendData = {
  socTrend: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 48 },
    { label: "Apr", value: 65 },
    { label: "May", value: 58 },
    { label: "Jun", value: 72 },
    { label: "Jul", value: 68 },
    { label: "Aug", value: 75 },
    { label: "Sep", value: 82 },
    { label: "Oct", value: 78 },
    { label: "Nov", value: 85 },
    { label: "Dec", value: 80 },
  ],
  temperatureTrend: [
    { label: "Jan", value: 28 },
    { label: "Feb", value: 32 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 68 },
    { label: "May", value: 52 },
    { label: "Jun", value: 35 },
  ],
  voltageTrend: [
    { label: "Jan", value: 25 },
    { label: "Feb", value: 42 },
    { label: "Mar", value: 55 },
    { label: "Apr", value: 48 },
    { label: "May", value: 85 },
    { label: "Jun", value: 72 },
  ],
  currentTrend: [
    { label: "Jan", value: 15 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 92 },
    { label: "May", value: 78 },
    { label: "Jun", value: 55 },
  ],
}

// Movement History types and mock data
export type MovementEventType =
  | "battery-swap"
  | "checked-in"
  | "assigned-to-vehicle"
  | "transfer"
  | "recovery-action"

export interface MovementHistoryItem {
  id: string
  timestamp: string
  eventType: MovementEventType
  from: string
  to: string
  riderVehicleId: string | null
  location: string | null
  actionedBy: string
}

export const movementEventTypeLabels: Record<MovementEventType, string> = {
  "battery-swap": "Battery Swap",
  "checked-in": "Checked In",
  "assigned-to-vehicle": "Assigned to Vehicle",
  "transfer": "Transfer",
  "recovery-action": "Recovery Action",
}

export const mockMovementHistory: MovementHistoryItem[] = [
  {
    id: "SWP-10482",
    timestamp: "22 Feb 2024, 13:25:43 WAT",
    eventType: "battery-swap",
    from: "Yaba Station",
    to: "MAX-1142",
    riderVehicleId: "MAX-1142",
    location: "Yaba",
    actionedBy: "Daniel Amokachi",
  },
  {
    id: "SWP-10482",
    timestamp: "22 Feb 2024, 13:25:43 WAT",
    eventType: "checked-in",
    from: "MAX-1142",
    to: "Yaba Station",
    riderVehicleId: "MAX-1142",
    location: "Yaba",
    actionedBy: "Daniel Amokachi",
  },
  {
    id: "SWP-10482",
    timestamp: "22 Feb 2024, 13:25:43 WAT",
    eventType: "assigned-to-vehicle",
    from: "Ikeja Hub",
    to: "MAX-1142",
    riderVehicleId: "MAX-1142",
    location: "Ikeja",
    actionedBy: "Daniel Amokachi",
  },
  {
    id: "SWP-10482",
    timestamp: "22 Feb 2024, 13:25:43 WAT",
    eventType: "transfer",
    from: "Abeokuta Hub",
    to: "Yaba Station",
    riderVehicleId: null,
    location: null,
    actionedBy: "Daniel Amokachi",
  },
  {
    id: "SWP-10482",
    timestamp: "22 Feb 2024, 13:25:43 WAT",
    eventType: "recovery-action",
    from: "MAX-1142",
    to: "Lekki Station",
    riderVehicleId: "MAX-1142",
    location: "Lekki",
    actionedBy: "Daniel Amokachi",
  },
  {
    id: "SWP-10483",
    timestamp: "21 Feb 2024, 10:15:22 WAT",
    eventType: "battery-swap",
    from: "Ikeja Station",
    to: "MAX-1143",
    riderVehicleId: "MAX-1143",
    location: "Ikeja",
    actionedBy: "Sarah Johnson",
  },
  {
    id: "SWP-10484",
    timestamp: "21 Feb 2024, 09:45:11 WAT",
    eventType: "checked-in",
    from: "MAX-1143",
    to: "Ikeja Station",
    riderVehicleId: "MAX-1143",
    location: "Ikeja",
    actionedBy: "Sarah Johnson",
  },
  {
    id: "SWP-10485",
    timestamp: "20 Feb 2024, 16:30:00 WAT",
    eventType: "transfer",
    from: "Victoria Island Hub",
    to: "Surulere Station",
    riderVehicleId: null,
    location: null,
    actionedBy: "Michael Chen",
  },
  {
    id: "SWP-10486",
    timestamp: "20 Feb 2024, 14:20:33 WAT",
    eventType: "assigned-to-vehicle",
    from: "Surulere Station",
    to: "MAX-1144",
    riderVehicleId: "MAX-1144",
    location: "Surulere",
    actionedBy: "Michael Chen",
  },
  {
    id: "SWP-10487",
    timestamp: "19 Feb 2024, 11:00:00 WAT",
    eventType: "recovery-action",
    from: "MAX-1144",
    to: "Maintenance Hub",
    riderVehicleId: "MAX-1144",
    location: "Maintenance Hub",
    actionedBy: "Fatima Bello",
  },
  {
    id: "SWP-10488",
    timestamp: "18 Feb 2024, 08:30:00 WAT",
    eventType: "battery-swap",
    from: "Lekki Station",
    to: "MAX-1145",
    riderVehicleId: "MAX-1145",
    location: "Lekki",
    actionedBy: "Chidi Okafor",
  },
  {
    id: "SWP-10489",
    timestamp: "17 Feb 2024, 15:45:00 WAT",
    eventType: "checked-in",
    from: "MAX-1145",
    to: "Lekki Station",
    riderVehicleId: "MAX-1145",
    location: "Lekki",
    actionedBy: "Chidi Okafor",
  },
]

// Command Center types and mock data
export interface BatteryControlStatus {
  chargeFET: { enabled: boolean; statusOn: boolean }
  dischargeFET: { enabled: boolean; statusOn: boolean }
}

export type CommandStatus = "pending" | "applied" | "failed" | "timed-out"

export interface CommandAuditEntry {
  id: string
  timestamp: string
  commandName: string
  issuedBy: string
  deliveryStatus: "Queued" | "Sent" | "Expired"
  commandStatus: CommandStatus
  resultMessage: string
}

export const commandStatusVariantMap: Record<CommandStatus, "warning" | "success" | "danger" | "default"> = {
  pending: "warning",
  applied: "success",
  failed: "danger",
  "timed-out": "default",
}

export const commandStatusLabels: Record<CommandStatus, string> = {
  pending: "Pending",
  applied: "Applied",
  failed: "Failed",
  "timed-out": "Timed Out",
}

export const mockBatteryControlStatus: BatteryControlStatus = {
  chargeFET: { enabled: true, statusOn: true },
  dischargeFET: { enabled: true, statusOn: true },
}

export const mockCommandAuditLog: CommandAuditEntry[] = [
  {
    id: "CMD-001",
    timestamp: "20 Jan 2022 10:45 PM",
    commandName: "Full Disable",
    issuedBy: "Darius Dolapo",
    deliveryStatus: "Queued",
    commandStatus: "pending",
    resultMessage: "Waiting for battery rest state",
  },
  {
    id: "CMD-002",
    timestamp: "20 Jan 2022 10:45 PM",
    commandName: "Disable Charge",
    issuedBy: "Darius Dolapo",
    deliveryStatus: "Sent",
    commandStatus: "applied",
    resultMessage: "Command acknowledged by BMS",
  },
  {
    id: "CMD-003",
    timestamp: "20 Jan 2022 10:45 PM",
    commandName: "Re-enable Battery",
    issuedBy: "Darius Dolapo",
    deliveryStatus: "Sent",
    commandStatus: "applied",
    resultMessage: "Charge and discharge restored",
  },
  {
    id: "CMD-004",
    timestamp: "20 Jan 2022 10:45 PM",
    commandName: "Disable Discharge",
    issuedBy: "Darius Dolapo",
    deliveryStatus: "Sent",
    commandStatus: "failed",
    resultMessage: "Battery offline",
  },
  {
    id: "CMD-005",
    timestamp: "20 Jan 2022 10:45 PM",
    commandName: "Full Disable",
    issuedBy: "Darius Dolapo",
    deliveryStatus: "Expired",
    commandStatus: "timed-out",
    resultMessage: "Battery offline",
  },
]
