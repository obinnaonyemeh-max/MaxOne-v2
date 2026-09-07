import { useSyncExternalStore } from "react"

import { addTimeOffApproval } from "./approvalStore"
import {
  getChampionDetails,
  listChampionDetails,
  type ChampionDetails,
} from "./mockChampionDetails"
import { mockChampions, type Champion } from "./mockChampions"
import { getTicketRecordsSnapshot, useTicketRecords } from "./ticketStore"
import { getWelfareNotesSnapshot, useWelfareRecords } from "./welfareStore"

let detailsById: Record<string, ChampionDetails> = Object.fromEntries(
  listChampionDetails().map((details) => [details.id, details])
)
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

function withLiveRelations(details: ChampionDetails): ChampionDetails {
  const tickets = getTicketRecordsSnapshot().filter(
    (ticket) => ticket.championId === details.championId
  )
  const overlayNotes = details.welfareNotes
  const loggedNotes = getWelfareNotesSnapshot(details.id)
  return {
    ...details,
    tickets,
    welfareNotes: [...loggedNotes, ...overlayNotes],
  }
}

export function getChampionsSnapshot(): Champion[] {
  return mockChampions
}

export function useChampions(): Champion[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return mockChampions
}

export function peekChampionDetails(id: string): ChampionDetails | undefined {
  const details = detailsById[id] ?? getChampionDetails(id)
  return details ? withLiveRelations(details) : undefined
}

export function useChampionDetails(id: string | undefined): ChampionDetails | undefined {
  useTicketRecords()
  useWelfareRecords()
  useSyncExternalStore(subscribe, getVersion, getVersion)
  if (!id) return undefined
  return peekChampionDetails(id)
}

export function createTimeOff(
  championId: string,
  input: {
    type: "Annual" | "Emergency" | "Sick"
    startDate: string
    endDate: string
  }
): ChampionDetails | null {
  const current = detailsById[championId] ?? getChampionDetails(championId)
  if (!current) return null

  const leave = {
    id: `to-${Date.now()}`,
    type: input.type,
    startDate: input.startDate,
    endDate: input.endDate,
    status: "Pending" as const,
    approvedBy: "—",
  }

  const updated: ChampionDetails = {
    ...current,
    timeOff: {
      ...current.timeOff,
      history: [leave, ...current.timeOff.history],
    },
  }
  detailsById = { ...detailsById, [championId]: updated }

  addTimeOffApproval({
    id: `to-${current.championId}-${leave.id}`,
    championName: current.name,
    championId: current.championId,
    city: current.city,
    subcity: current.subcity,
    leaveType: input.type,
    startDate: input.startDate,
    endDate: input.endDate,
    status: "Pending",
    approvedBy: "—",
  })

  emit()
  return withLiveRelations(updated)
}
