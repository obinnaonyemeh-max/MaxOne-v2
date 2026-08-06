export interface BatteryLocation {
  id: string
  lat: number
  lng: number
  soh: number
  state: "riding" | "idle" | "checked-in" | "in-transit" | "retired" | "unknown"
}

export interface BatteryAlert {
  id: string
  type: "over-temperature" | "low-soh" | "offline" | "critical"
  title: string
  description: string
  count: number
  severity: "L1" | "L2" | "L3"
}

export interface SOHDistributionData {
  range: string
  count: number
  color: string
}

export interface BatteryStateData {
  state: string
  count: number
  color: string
}

export const batteryStats = {
  activeBatteries: 35900,
  offlineBatteries: 205,
  criticalAlerts: {
    total: 4,
    l1: 3,
    l2: 1,
  },
  avgSOH: 82.6,
  atRiskBatteries: {
    total: 309,
    lowSOH: 32,
    thermal: 177,
  },
  pendingRemoteCommands: 2,
}

export const sohDistributionData: SOHDistributionData[] = [
  { range: "0 - 60", count: 38000, color: "var(--color-status-danger)" },
  { range: "60 - 69", count: 22000, color: "var(--color-status-warning)" },
  { range: "70 - 79", count: 15000, color: "var(--color-status-warning)" },
  { range: "80 - 89", count: 18000, color: "var(--color-badge-active-text)" },
  { range: "90 - 100", count: 32000, color: "var(--color-success)" },
]

export const batteryStateData: BatteryStateData[] = [
  { state: "Riding", count: 20495, color: "var(--color-success)" },
  { state: "Idle", count: 8500, color: "var(--color-badge-active-text)" },
  { state: "Checked-In", count: 3200, color: "var(--color-status-info)" },
  { state: "In Transit", count: 2100, color: "var(--color-status-warning)" },
  { state: "Retired", count: 1200, color: "var(--color-gray-400)" },
  { state: "Unknown", count: 405, color: "var(--color-gray-500)" },
]

export const batteryLocations: BatteryLocation[] = [
  { id: "BAT-001", lat: 6.5244, lng: 3.3792, soh: 85, state: "riding" },
  { id: "BAT-002", lat: 6.4541, lng: 3.3947, soh: 72, state: "idle" },
  { id: "BAT-003", lat: 6.5833, lng: 3.3500, soh: 91, state: "riding" },
  { id: "BAT-004", lat: 6.4698, lng: 3.5852, soh: 65, state: "checked-in" },
  { id: "BAT-005", lat: 6.6018, lng: 3.3515, soh: 88, state: "riding" },
  { id: "BAT-006", lat: 6.4378, lng: 3.4542, soh: 45, state: "in-transit" },
  { id: "BAT-007", lat: 6.5095, lng: 3.3711, soh: 79, state: "riding" },
  { id: "BAT-008", lat: 6.4281, lng: 3.4219, soh: 92, state: "idle" },
  { id: "BAT-009", lat: 6.5500, lng: 3.4000, soh: 67, state: "riding" },
  { id: "BAT-010", lat: 6.4800, lng: 3.3300, soh: 83, state: "riding" },
  { id: "BAT-011", lat: 6.5600, lng: 3.5200, soh: 76, state: "checked-in" },
  { id: "BAT-012", lat: 6.4100, lng: 3.4800, soh: 58, state: "retired" },
  { id: "BAT-013", lat: 6.5900, lng: 3.3800, soh: 94, state: "riding" },
  { id: "BAT-014", lat: 6.4500, lng: 3.5500, soh: 81, state: "idle" },
  { id: "BAT-015", lat: 6.5200, lng: 3.4500, soh: 69, state: "in-transit" },
]

export const batteryAlerts: BatteryAlert[] = [
  {
    id: "ALERT-001",
    type: "over-temperature",
    title: "Over Temperature Protection",
    description: "26 batteries currently exceed the configured thermal threshold and require operational review.",
    count: 26,
    severity: "L1",
  },
  {
    id: "ALERT-002",
    type: "low-soh",
    title: "Low State of Health",
    description: "12 batteries have SOH below 50% and may need replacement.",
    count: 12,
    severity: "L2",
  },
  {
    id: "ALERT-003",
    type: "offline",
    title: "Batteries Offline",
    description: "8 batteries have been offline for more than 24 hours.",
    count: 8,
    severity: "L1",
  },
]
