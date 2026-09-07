import { useSyncExternalStore } from "react"

import type { TimelineEntryData } from "@/components/max/TimelineEntry"
import type { WelfareNote } from "./mockChampionDetails"
import {
  getWelfareTimeline,
  mockWelfareRecords,
  type WelfareChampion,
} from "./mockWelfare"

export interface LogWelfareNoteInput {
  channel: WelfareNote["channel"]
  interactionType: WelfareNote["interactionType"]
  summary: string
  issuesRaised: string
  actionTaken: string
  followUpRequired: boolean
  incidentStatus: WelfareNote["incidentStatus"]
  loggedBy?: string
}

let records: WelfareChampion[] = mockWelfareRecords
let timelines: Record<string, TimelineEntryData[]> = Object.fromEntries(
  mockWelfareRecords.map((record) => [record.id, [...getWelfareTimeline(record.id)]])
)
let notes: Record<string, WelfareNote[]> = {}
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

export function getWelfareRecordsSnapshot(): WelfareChampion[] {
  return records
}

export function useWelfareRecords(): WelfareChampion[] {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return records
}

export function getWelfareNotesSnapshot(championId: string): WelfareNote[] {
  return notes[championId] ?? []
}

export function getWelfareTimelineSnapshot(championId: string): TimelineEntryData[] {
  return timelines[championId] ?? getWelfareTimeline(championId)
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function scheduleFollowUp(id: string, nextFollowUp: string): WelfareChampion | null {
  let updated: WelfareChampion | null = null
  records = records.map((record) => {
    if (record.id !== id) return record
    updated = { ...record, nextFollowUp }
    return updated
  })
  if (updated) emit()
  return updated
}

export function logWelfareNote(id: string, input: LogWelfareNoteInput): WelfareChampion | null {
  let updated: WelfareChampion | null = null
  const today = formatToday()
  records = records.map((record) => {
    if (record.id !== id) return record
    updated = {
      ...record,
      lastContact: today,
      issuesLogged: input.issuesRaised.trim()
        ? record.issuesLogged + 1
        : record.issuesLogged,
    }
    return updated
  })
  if (!updated) return null

  const note: WelfareNote = {
    id: `wn-${Date.now()}`,
    date: today,
    loggedBy: input.loggedBy ?? "You",
    channel: input.channel,
    interactionType: input.interactionType,
    summary: input.summary,
    issuesRaised: input.issuesRaised,
    actionTaken: input.actionTaken,
    followUpRequired: input.followUpRequired,
    incidentStatus: input.incidentStatus,
  }
  notes = { ...notes, [id]: [note, ...(notes[id] ?? [])] }

  const timelineEntry: TimelineEntryData = {
    id: `wlog-${Date.now()}`,
    date: today,
    status: input.interactionType,
    statusVariant: input.followUpRequired ? "warning" : "success",
    description: {
      template: input.summary || "Welfare note logged.",
      highlights: {},
    },
    actor: { action: "Logged by", name: note.loggedBy },
    duration: { range: "Just now", total: "" },
  }
  timelines = {
    ...timelines,
    [id]: [timelineEntry, ...(timelines[id] ?? getWelfareTimeline(id))],
  }

  emit()
  return updated
}
