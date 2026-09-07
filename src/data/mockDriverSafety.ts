import { mockChampions } from "./mockChampions"

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

const INCIDENTS = ["None", "Harsh Braking", "Collision", "Speeding", "Sharp Cornering", "Night Driving", "Idling Abuse"] as const

function riskFromScore(score: number): RiskLevel {
  if (score >= 80) return "Low"
  if (score >= 65) return "Medium"
  if (score >= 50) return "High"
  return "Critical"
}

export const mockDriverRiskRecords: DriverRiskRecord[] = mockChampions.map((champion, index) => {
  const safetyScore = 38 + ((index * 17) % 58)
  const riskLevel = riskFromScore(safetyScore)
  return {
    id: champion.id,
    championName: champion.name,
    championId: champion.championId,
    location: champion.city,
    safetyScore,
    riskLevel,
    recentIncident: riskLevel === "Low" ? "None" : INCIDENTS[(index % (INCIDENTS.length - 1)) + 1],
    totalSafetyEvents: riskLevel === "Low" ? 1 + (index % 4) : 8 + (index % 20),
    lastActivity: champion.lastActiveDate,
  }
})

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
