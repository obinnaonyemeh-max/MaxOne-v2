import type { SimulationMode } from "@/data/rolePermissions"
import { isInCityScope } from "@/data/cityScope"

export const SIMULATED_DRIVER_EXPERIENCE_AGENTS = {
  "call-centre-agent": {
    id: "call-centre-agent-1",
    name: "Fatima Bello",
  },
  "welfare-agent": {
    id: "welfare-agent-1",
    name: "Chidi Okafor",
    city: "Lagos",
  },
} as const

const ASSIGNED_CHAMPION_IDS: Partial<Record<SimulationMode, Set<string>>> = {
  "welfare-agent": new Set([
    "2", "6", "10", "14", "18", "22", "26", "30", "34", "38",
  ]),
}

export function isChampionAssignedForSimulationMode(
  championId: string,
  mode: SimulationMode,
  location?: string
): boolean {
  if (mode === "call-centre-agent") {
    return true
  }
  if (mode === "field-ops-manager" || mode === "welfare-manager") {
    return isInCityScope(location, "Lagos")
  }
  const assignedIds = ASSIGNED_CHAMPION_IDS[mode]
  if (!assignedIds) return true
  if (mode === "welfare-agent") {
    return (
      assignedIds.has(championId) &&
      isInCityScope(location, SIMULATED_DRIVER_EXPERIENCE_AGENTS[mode].city)
    )
  }
  return assignedIds.has(championId)
}

export function championsForSimulationMode<
  T extends { id: string; state?: string; location?: string }
>(
  champions: readonly T[],
  mode: SimulationMode
): T[] {
  if (mode === "call-centre-agent") {
    return [...champions]
  }
  if (mode === "field-ops-manager" || mode === "welfare-manager") {
    return champions.filter(
      (champion) =>
        isInCityScope(champion.state, "Lagos") ||
        isInCityScope(champion.location, "Lagos")
    )
  }
  const assignedIds = ASSIGNED_CHAMPION_IDS[mode]
  if (!assignedIds) return [...champions]
  return champions.filter((champion) => {
    if (!assignedIds.has(champion.id)) return false
    if (mode !== "welfare-agent") return true
    const city = SIMULATED_DRIVER_EXPERIENCE_AGENTS[mode].city
    return (
      isInCityScope(champion.state, city) ||
      isInCityScope(champion.location, city)
    )
  })
}

export function ticketsForSimulationMode<
  T extends { assignedAgent: string; city?: string; location?: string }
>(
  tickets: readonly T[],
  mode: SimulationMode
): T[] {
  if (mode === "call-centre-agent") {
    return [...tickets]
  }
  if (mode === "field-ops-manager" || mode === "welfare-manager") {
    return tickets.filter((ticket) =>
      isInCityScope(ticket.city ?? ticket.location, "Lagos")
    )
  }
  if (mode !== "welfare-agent") {
    return [...tickets]
  }
  const agent = SIMULATED_DRIVER_EXPERIENCE_AGENTS[mode]
  return tickets.filter(
    (ticket) =>
      ticket.assignedAgent === agent.name &&
      isInCityScope(ticket.city ?? ticket.location, agent.city)
  )
}
