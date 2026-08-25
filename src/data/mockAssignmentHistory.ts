import {
  mockAgentChampions,
  mockAgentPortfolioRecords,
  reassignmentReasons,
} from "./mockAgentPortfolio"

export type AssignmentChangeType = "Assigned" | "Bulk Reassignment"

export type ChangedBy = "Admin" | "System"

export interface AssignmentHistoryRecord {
  id: string
  champion: string
  championId: string
  /** "—" when the champion had no agent before this change. */
  previousAgent: string
  newAgent: string
  changeType: AssignmentChangeType
  reason: string
  changedBy: ChangedBy
  dateTime: string
}

export const assignmentChangeTypes: AssignmentChangeType[] = [
  "Assigned",
  "Bulk Reassignment",
]

export const changedByOptions: ChangedBy[] = ["Admin", "System"]

export const changeTypeVariantMap: Record<AssignmentChangeType, "info" | "neutral"> = {
  "Assigned":          "info",
  "Bulk Reassignment": "neutral",
}

/** Deterministic pseudo-random so the mock is stable across reloads. */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// The log runs backwards from the same "today" the rest of the mock data uses.
const BASE_DATE = new Date(2026, 4, 28, 16, 40)

function formatStamp(minutesAgo: number): string {
  const d = new Date(BASE_DATE.getTime() - minutesAgo * 60_000)
  const day = String(d.getDate()).padStart(2, "0")
  const month = d.toLocaleString("en-GB", { month: "short" })
  const hours = d.getHours() % 12 || 12
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const meridiem = d.getHours() < 12 ? "am" : "pm"
  return `${day} ${month} ${d.getFullYear()}, ${hours}:${minutes} ${meridiem}`
}

function buildHistory(): AssignmentHistoryRecord[] {
  const agents = mockAgentPortfolioRecords
  const records: AssignmentHistoryRecord[] = []

  // A slice of the champion pool, so every row points at a champion that exists.
  const sample = mockAgentChampions.filter((_, index) => index % 7 === 0).slice(0, 45)

  sample.forEach((champion, index) => {
    const seed = index * 17 + 3

    // Bulk moves are driven by an operator; single assignments come off the
    // onboarding pipeline, which is why they read as System.
    const isBulk = index % 5 < 2
    const changeType: AssignmentChangeType = isBulk ? "Bulk Reassignment" : "Assigned"
    const changedBy: ChangedBy = isBulk ? "Admin" : "System"

    const newAgent = agents[Math.floor(seededRandom(seed) * agents.length)]
    let previousAgent = "—"
    if (isBulk) {
      const candidates = agents.filter((a) => a.id !== newAgent.id)
      previousAgent = candidates[Math.floor(seededRandom(seed + 5) * candidates.length)].agent
    }

    records.push({
      id: `ah-${index + 1}`,
      champion: champion.name,
      championId: champion.championId,
      previousAgent,
      newAgent: newAgent.agent,
      changeType,
      reason: reassignmentReasons[Math.floor(seededRandom(seed + 11) * reassignmentReasons.length)],
      changedBy,
      dateTime: formatStamp(index * 137 + Math.floor(seededRandom(seed + 19) * 90)),
    })
  })

  return records
}

export const mockAssignmentHistory: AssignmentHistoryRecord[] = buildHistory()
