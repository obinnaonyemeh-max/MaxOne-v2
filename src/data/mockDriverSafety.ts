export type RiskLevel = "Low" | "Medium" | "High" | "Critical"

export interface DriverRiskRecord {
  id: string
  championName: string
  championId: string
  location: string
  safetyScore: number
  riskLevel: RiskLevel
  recentIncident: string
  totalSafetyEvents: number
  lastActivity: string
}

export interface CriticalEventCategory {
  name: string
  count: number
  color: string
}

export interface BehavioralTrendPoint {
  date: string
  events: number
}

export const riskLevelVariantMap: Record<RiskLevel, "success" | "warning" | "danger" | "info"> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
  Critical: "info",
}

export const mockDriverRiskRecords: DriverRiskRecord[] = [
  { id: "1",  championName: "Adaeze Okonkwo",    championId: "CHM-1001", location: "Lagos",          safetyScore: 92, riskLevel: "Low",      recentIncident: "None",            totalSafetyEvents: 2,  lastActivity: "30 May 2026" },
  { id: "2",  championName: "Emeka Nwosu",        championId: "CHM-1002", location: "Lagos",          safetyScore: 78, riskLevel: "Medium",   recentIncident: "Harsh Braking",   totalSafetyEvents: 8,  lastActivity: "29 May 2026" },
  { id: "3",  championName: "Ibrahim Yusuf",      championId: "CHM-1003", location: "Osogbo",           safetyScore: 45, riskLevel: "Critical", recentIncident: "Collision",       totalSafetyEvents: 22, lastActivity: "28 May 2026" },
  { id: "4",  championName: "Oluwaseun Bello",    championId: "CHM-1004", location: "Ibadan",         safetyScore: 85, riskLevel: "Low",      recentIncident: "None",            totalSafetyEvents: 3,  lastActivity: "30 May 2026" },
  { id: "5",  championName: "Funmilayo Ade",      championId: "CHM-1005", location: "Lagos",          safetyScore: 61, riskLevel: "High",     recentIncident: "Speeding",        totalSafetyEvents: 14, lastActivity: "27 May 2026" },
  { id: "6",  championName: "Tunde Bakare",       championId: "CHM-1006", location: "Abeokuta",          safetyScore: 72, riskLevel: "Medium",   recentIncident: "Sharp Cornering", totalSafetyEvents: 9,  lastActivity: "29 May 2026" },
  { id: "7",  championName: "Chioma Obi",         championId: "CHM-1007", location: "Sango Ota",  safetyScore: 88, riskLevel: "Low",      recentIncident: "None",            totalSafetyEvents: 4,  lastActivity: "30 May 2026" },
  { id: "8",  championName: "Yemi Adesanya",      championId: "CHM-1008", location: "Abeokuta",          safetyScore: 53, riskLevel: "High",     recentIncident: "Night Driving",   totalSafetyEvents: 17, lastActivity: "26 May 2026" },
  { id: "9",  championName: "Amaka Eze",          championId: "CHM-1009", location: "Lagos",          safetyScore: 95, riskLevel: "Low",      recentIncident: "None",            totalSafetyEvents: 1,  lastActivity: "30 May 2026" },
  { id: "10", championName: "Ngozi Eze",          championId: "CHM-1010", location: "Sango Ota",  safetyScore: 67, riskLevel: "Medium",   recentIncident: "Idling Abuse",    totalSafetyEvents: 11, lastActivity: "28 May 2026" },
  { id: "11", championName: "Chukwuemeka Ibe",    championId: "CHM-1011", location: "Osogbo",           safetyScore: 39, riskLevel: "Critical", recentIncident: "Collision",       totalSafetyEvents: 26, lastActivity: "25 May 2026" },
  { id: "12", championName: "Adaora Nwosu",       championId: "CHM-1012", location: "Lagos",          safetyScore: 81, riskLevel: "Low",      recentIncident: "Harsh Braking",   totalSafetyEvents: 5,  lastActivity: "29 May 2026" },
  { id: "13", championName: "Segun Falowo",       championId: "CHM-1013", location: "Ibadan",         safetyScore: 58, riskLevel: "High",     recentIncident: "Speeding",        totalSafetyEvents: 15, lastActivity: "27 May 2026" },
  { id: "14", championName: "Kemi Adeyemi",       championId: "CHM-1014", location: "Abeokuta",          safetyScore: 74, riskLevel: "Medium",   recentIncident: "Sharp Cornering", totalSafetyEvents: 7,  lastActivity: "28 May 2026" },
  { id: "15", championName: "Bola Okafor",        championId: "CHM-1015", location: "Osogbo",           safetyScore: 90, riskLevel: "Low",      recentIncident: "None",            totalSafetyEvents: 2,  lastActivity: "30 May 2026" },
]

export const mockCriticalEvents: CriticalEventCategory[] = [
  { name: "Collision",       count: 12, color: "var(--color-badge-inactive-text)" },
  { name: "Speeding",        count: 34, color: "var(--color-status-warning)" },
  { name: "Harsh Braking",   count: 28, color: "var(--color-status-info)" },
  { name: "Night Driving",   count: 19, color: "var(--color-status-pink-text)" },
  { name: "Sharp Cornering", count: 15, color: "var(--color-badge-active-text)" },
  { name: "Idling Abuse",    count: 8,  color: "var(--color-gray-500)" },
]

export const mockBehavioralTrend: BehavioralTrendPoint[] = [
  { date: "May 1",  events: 18 },
  { date: "May 3",  events: 22 },
  { date: "May 5",  events: 15 },
  { date: "May 7",  events: 28 },
  { date: "May 9",  events: 20 },
  { date: "May 11", events: 25 },
  { date: "May 13", events: 17 },
  { date: "May 15", events: 30 },
  { date: "May 17", events: 23 },
  { date: "May 19", events: 19 },
  { date: "May 21", events: 27 },
  { date: "May 23", events: 14 },
  { date: "May 25", events: 21 },
  { date: "May 27", events: 26 },
  { date: "May 29", events: 16 },
]
