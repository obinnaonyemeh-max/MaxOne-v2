import { useSyncExternalStore } from "react"

import {
  mockAgentChampions,
  mockAgentPortfolioRecords,
  type AgentChampionRecord,
  type AgentPortfolioRecord,
  type ChampionState,
} from "./mockAgentPortfolio"

let agents: AgentPortfolioRecord[] = mockAgentPortfolioRecords
let champions: AgentChampionRecord[] = mockAgentChampions
let version = 0

const listeners = new Set<() => void>()

function emit() {
  version += 1
  listeners.forEach((listener) => listener())
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getVersion() {
  return version
}

function recountAgent(agentId: string): AgentPortfolioRecord | undefined {
  const agent = agents.find((record) => record.id === agentId)
  if (!agent) return undefined
  const book = champions.filter((champion) => champion.agentId === agentId)
  const active = book.filter((champion) => champion.state === "Performing").length
  const atRisk = book.filter(
    (champion) => champion.state === "Watchlist" || champion.state === "Early Arrears"
  ).length
  const delinquent = book.filter((champion) => champion.state === "Default").length
  const inactive = book.filter((champion) => champion.state === "Inactive").length
  return {
    ...agent,
    active,
    atRisk,
    delinquent,
    inactive,
    total: book.length,
  }
}

export function useAgentPortfolioRecords(): AgentPortfolioRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return agents
}

export function useAgentChampions(): AgentChampionRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return champions
}

export function getAgentByIdSnapshot(agentId: string): AgentPortfolioRecord | undefined {
  return agents.find((agent) => agent.id === agentId)
}

export function reassignChampions(
  championIds: string[],
  targetAgentIds: string[]
): void {
  if (championIds.length === 0 || targetAgentIds.length === 0) return
  const touched = new Set<string>()

  champions = champions.map((champion) => {
    const index = championIds.indexOf(champion.id)
    if (index < 0) return champion
    touched.add(champion.agentId)
    const nextAgentId = targetAgentIds[index % targetAgentIds.length]
    touched.add(nextAgentId)
    return { ...champion, agentId: nextAgentId }
  })

  agents = agents.map((agent) => {
    if (!touched.has(agent.id)) return agent
    return recountAgent(agent.id) ?? agent
  })

  emit()
}

export type { ChampionState }
