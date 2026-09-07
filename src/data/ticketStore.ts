import { useSyncExternalStore } from "react"

import {
  buildTicketDetailFromRecord,
  getTicketDetail,
  type TicketDetail,
} from "./mockTicketDetail"
import {
  mockTicketRecords,
  type TicketRecord,
} from "./mockTicketRecords"

export interface CreateTicketInput {
  championId: string
  affectedChampion: string
  category: string
  city: string
  subcity: string
  location: string
  assignedAgent: string
  ticketCreator: string
  priority: TicketRecord["priority"]
}

export interface TicketComment {
  id: string
  author: string
  text: string
  timestamp: string
}

let records: TicketRecord[] = mockTicketRecords
let extraComments: Record<string, TicketComment[]> = {}
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

export function getTicketRecordsSnapshot(): TicketRecord[] {
  return records
}

export function useTicketRecords(): TicketRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return records
}

function nextTicketId(): string {
  let max = 10100
  for (const record of records) {
    const match = record.ticketId.match(/TKT-2026-(\d+)$/)
    if (match) max = Math.max(max, Number.parseInt(match[1], 10))
  }
  return `TKT-2026-${max + 1}`
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function createTicket(input: CreateTicketInput): TicketRecord {
  const record: TicketRecord = {
    id: `tkt-${Date.now()}`,
    ticketId: nextTicketId(),
    championId: input.championId,
    affectedChampion: input.affectedChampion,
    category: input.category,
    location: input.location,
    city: input.city,
    subcity: input.subcity,
    assignedAgent: input.assignedAgent,
    ticketCreator: input.ticketCreator,
    priority: input.priority,
    status: "Open",
    sla: "Within SLA",
    dateCreated: formatToday(),
  }
  records = [record, ...records]
  emit()
  return record
}

function updateRecord(
  id: string,
  patch: Partial<TicketRecord>
): TicketRecord | null {
  let updated: TicketRecord | null = null
  records = records.map((record) => {
    if (record.id !== id) return record
    updated = { ...record, ...patch }
    return updated
  })
  if (updated) emit()
  return updated
}

export function reassignTicket(id: string, assignedAgent: string): TicketRecord | null {
  return updateRecord(id, { assignedAgent })
}

export function changeTicketStatus(
  id: string,
  status: TicketRecord["status"]
): TicketRecord | null {
  return updateRecord(id, { status })
}

export function closeTicket(id: string): TicketRecord | null {
  return updateRecord(id, { status: "Closed" })
}

export function addTicketComment(id: string, text: string, author = "You"): TicketComment | null {
  const record = records.find((ticket) => ticket.id === id)
  if (!record || !text.trim()) return null
  const now = new Date()
  const formatted = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const comment: TicketComment = {
    id: `cmt-${Date.now()}`,
    author,
    text: text.trim(),
    timestamp: `${formatted}, ${time}`,
  }
  extraComments = {
    ...extraComments,
    [id]: [...(extraComments[id] ?? []), comment],
  }
  emit()
  return comment
}

export function mergeTicketDetail(record: TicketRecord): TicketDetail {
  const authored = getTicketDetail(record.id)
  const base = authored ?? buildTicketDetailFromRecord(record)
  return {
    ...base,
    status: record.status,
    priority: record.priority,
    sla: record.sla,
    category: record.category,
    dateCreated: record.dateCreated,
    champion: { name: record.affectedChampion, id: record.championId },
    agent: { name: record.assignedAgent, department: base.agent.department },
    incident: {
      ...base.incident,
      location: record.location,
      reporter: record.affectedChampion,
      ticketCreator: record.ticketCreator,
      comments: [...base.incident.comments, ...(extraComments[record.id] ?? [])],
    },
  }
}
