import type { TimelineEntryData } from "@/components/max/TimelineEntry"
import { mockChampions } from "./mockChampions"

export type WelfareStatus = "Healthy" | "Needs Attention" | "At Risk" | "Critical"
export type WelfareChampionState = "Active" | "Inactive" | "On Leave" | "Suspended"

export interface WelfareChampion {
  id: string
  name: string
  championId: string
  avatarUrl: string
  location: string
  subcity: string
  vehicle: string
  welfareStatus: WelfareStatus
  championState: WelfareChampionState
  lastContact: string
  nextFollowUp: string
  issuesLogged: number
  phoneNumber: string
  transferRejection?: {
    date: string
    ownershipType: string
    rejectionReason: string
  }
}

export const WELFARE_REFERENCE_DATE = new Date("2026-06-09")

const VEHICLES = ["4 Wheelers", "4 Wheelers", "3 Wheelers", "2 Wheelers"] as const
const WELFARE_STATUSES: WelfareStatus[] = ["Healthy", "Needs Attention", "At Risk", "Critical"]
const CHAMPION_STATES: WelfareChampionState[] = ["Active", "Active", "On Leave", "Inactive", "Suspended"]
const LAST_CONTACTS = ["8 Jun 2026", "5 Jun 2026", "1 Jun 2026", "28 May 2026", "9 Jun 2026"]
const NEXT_FOLLOW_UPS = ["9 Jun 2026", "7 Jun 2026", "5 Jun 2026", "3 Jun 2026", "12 Jun 2026", "11 Jun 2026"]

const TRANSFER_REJECTIONS: Record<string, NonNullable<WelfareChampion["transferRejection"]>> = {
  "4": {
    date: "5 Jul 2026",
    ownershipType: "Outright Payment",
    rejectionReason:
      "Outstanding hire-purchase balance of ₦200,000 must be fully settled before outright ownership transfer can be processed.",
  },
  "7": {
    date: "1 Jul 2026",
    ownershipType: "Outright Payment",
    rejectionReason:
      "Required documents (NIN verification, proof of final payment, and vehicle inspection report) were not provided. Please resubmit with complete documentation.",
  },
}

function issuesFor(index: number, status: WelfareStatus): number {
  if (status === "Healthy") return index % 2
  if (status === "Needs Attention") return 1 + (index % 2)
  if (status === "At Risk") return 4 + (index % 2)
  return 6 + (index % 2)
}

export const mockWelfareRecords: WelfareChampion[] = mockChampions.map((champion, index) => {
  const welfareStatus = WELFARE_STATUSES[index % WELFARE_STATUSES.length]
  const championState =
    champion.id === "4"
      ? "Suspended"
      : champion.id === "6"
        ? "On Leave"
        : champion.id === "7"
          ? "Inactive"
          : CHAMPION_STATES[index % CHAMPION_STATES.length]

  return {
    id: champion.id,
    name: champion.name,
    championId: champion.championId,
    avatarUrl: champion.avatarUrl,
    location: champion.city,
    subcity: champion.subcity,
    vehicle: VEHICLES[index % VEHICLES.length],
    welfareStatus,
    championState,
    lastContact: LAST_CONTACTS[index % LAST_CONTACTS.length],
    nextFollowUp: NEXT_FOLLOW_UPS[index % NEXT_FOLLOW_UPS.length],
    issuesLogged: issuesFor(index, welfareStatus),
    phoneNumber: champion.contactNumber,
    ...(TRANSFER_REJECTIONS[champion.id]
      ? { transferRejection: TRANSFER_REJECTIONS[champion.id] }
      : {}),
  }
})

const authoredWelfareTimelines: Record<string, TimelineEntryData[]> = {
  "1": [
    {
      id: "w1-1",
      date: "8 Jun 2026",
      status: "Welfare Check",
      statusVariant: "success",
      description: {
        template: "Routine welfare check completed. {outcome}",
        highlights: { outcome: "Champion reported no issues" },
      },
      actor: { action: "Logged by", name: "Aisha Bello" },
      duration: { range: "1 day ago", total: "" },
    },
    {
      id: "w1-2",
      date: "2 Jun 2026",
      status: "Follow-up Call",
      statusVariant: "info",
      description: {
        template: "Scheduled follow-up call completed. {topic} discussed.",
        highlights: { topic: "Vehicle condition and earnings" },
      },
      actor: { action: "Handled by", name: "Samson Oluwaseun" },
      duration: { range: "7 days ago", total: "" },
    },
  ],
  "2": [
    {
      id: "w2-1",
      date: "5 Jun 2026",
      status: "Issue Reported",
      statusVariant: "warning",
      description: {
        template: "Champion reported {issue}. Escalated to operations.",
        highlights: { issue: "brake pad wear and delayed servicing" },
      },
      actor: { action: "Logged by", name: "Ngozi Umeh" },
      duration: { range: "4 days ago", total: "" },
    },
  ],
  "4": [
    {
      id: "w4-0",
      date: "5 Jul 2026",
      status: "Transfer Rejected",
      statusVariant: "danger",
      description: {
        template: "Transfer of ownership request ({type}) was rejected. {reason}",
        highlights: { type: "Outright Payment", reason: "Escalated to welfare for follow-up" },
      },
      actor: { action: "Escalated by", name: "System" },
      duration: { range: "23 days ago", total: "" },
    },
  ],
  "7": [
    {
      id: "w7-0",
      date: "1 Jul 2026",
      status: "Transfer Rejected",
      statusVariant: "danger",
      description: {
        template: "Transfer of ownership request ({type}) was rejected. {reason}",
        highlights: { type: "Outright Payment", reason: "Escalated to welfare for follow-up" },
      },
      actor: { action: "Escalated by", name: "System" },
      duration: { range: "27 days ago", total: "" },
    },
  ],
}

const defaultTimeline: TimelineEntryData[] = [
  {
    id: "w-default",
    date: "9 Jun 2026",
    status: "No Interactions",
    statusVariant: "default",
    description: {
      template: "No welfare interactions have been recorded for this champion yet.",
      highlights: {},
    },
    actor: { action: "System", name: "Auto" },
    duration: { range: "—", total: "" },
  },
]

export function getWelfareTimeline(championId: string): TimelineEntryData[] {
  return authoredWelfareTimelines[championId] ?? defaultTimeline
}
