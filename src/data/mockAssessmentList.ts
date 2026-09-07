import type { TimelineEntryData } from "@/components/max/TimelineEntry"

export type AssessmentStatus = "Awaiting Assessment" | "Assessment Ongoing"

export interface AssessmentRecord {
  id: string
  /** Deactivated-vehicle id when this row came from a QA assignment; otherwise a seed id. */
  vehicleId: string
  assetType: string
  assetId: string
  plateNumber: string
  location: string
  assignedQaId: string
  daysInState: number
  status: AssessmentStatus
  activityHistory: TimelineEntryData[]
}

export function assignedHistoryEntry(qaName: string, date: string, id = "ah-assigned"): TimelineEntryData {
  return {
    id,
    date,
    status: "Assigned",
    statusVariant: "info",
    description: {
      template: "Vehicle assigned to {qa} for quality assessment",
      highlights: { qa: qaName },
    },
    actor: {
      action: "Assigned by",
      name: "Fleet Ops",
    },
    duration: {
      range: date,
      total: "",
    },
  }
}

export function assessmentStartedHistoryEntry(qaName: string, date: string, id = "ah-started"): TimelineEntryData {
  return {
    id,
    date,
    status: "Assessment Ongoing",
    statusVariant: "warning",
    description: {
      template: "{qa} started the quality assessment",
      highlights: { qa: qaName },
    },
    actor: {
      action: "Started by",
      name: qaName,
    },
    duration: {
      range: date,
      total: "",
    },
  }
}

export const mockAssessmentRecords: AssessmentRecord[] = [
  {
    id: "asm-1",
    vehicleId: "seed-1",
    assetType: "2 Wheeler",
    assetId: "MAX-LG-CH-501",
    plateNumber: "LG-501-AA",
    location: "Lagos Hub",
    assignedQaId: "qa-1",
    daysInState: 4,
    status: "Awaiting Assessment",
    activityHistory: [assignedHistoryEntry("Amaka Okonkwo", "29 Aug 2026", "asm-1-assigned")],
  },
  {
    id: "asm-2",
    vehicleId: "seed-2",
    assetType: "3 Wheeler",
    assetId: "MAX-LG-CH-502",
    plateNumber: "LG-502-BB",
    location: "Lagos Hub",
    assignedQaId: "qa-2",
    daysInState: 2,
    status: "Awaiting Assessment",
    activityHistory: [assignedHistoryEntry("Tunde Adebayo", "31 Aug 2026", "asm-2-assigned")],
  },
  {
    id: "asm-3",
    vehicleId: "seed-3",
    assetType: "2 Wheeler",
    assetId: "MAX-LG-CH-503",
    plateNumber: "LG-503-CC",
    location: "Lagos Hub",
    assignedQaId: "qa-3",
    daysInState: 6,
    status: "Assessment Ongoing",
    activityHistory: [
      assignedHistoryEntry("Ngozi Eze", "25 Aug 2026", "asm-3-assigned"),
      assessmentStartedHistoryEntry("Ngozi Eze", "27 Aug 2026", "asm-3-started"),
    ],
  },
  {
    id: "asm-4",
    vehicleId: "seed-4",
    assetType: "4 Wheeler",
    assetId: "MAX-LG-CH-504",
    plateNumber: "LG-504-DD",
    location: "Lagos Hub",
    assignedQaId: "qa-1",
    daysInState: 1,
    status: "Assessment Ongoing",
    activityHistory: [
      assignedHistoryEntry("Amaka Okonkwo", "31 Aug 2026", "asm-4-assigned"),
      assessmentStartedHistoryEntry("Amaka Okonkwo", "1 Sep 2026", "asm-4-started"),
    ],
  },
  {
    id: "asm-5",
    vehicleId: "seed-5",
    assetType: "3 Wheeler",
    assetId: "MAX-IB-CH-510",
    plateNumber: "IB-510-EE",
    location: "Ibadan Hub",
    assignedQaId: "qa-4",
    daysInState: 5,
    status: "Awaiting Assessment",
    activityHistory: [assignedHistoryEntry("Funke Adeyemi", "28 Aug 2026", "asm-5-assigned")],
  },
  {
    id: "asm-6",
    vehicleId: "seed-6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-511",
    plateNumber: "IB-511-FF",
    location: "Ibadan Hub",
    assignedQaId: "qa-5",
    daysInState: 8,
    status: "Assessment Ongoing",
    activityHistory: [
      assignedHistoryEntry("Ibrahim Musa", "22 Aug 2026", "asm-6-assigned"),
      assessmentStartedHistoryEntry("Ibrahim Musa", "24 Aug 2026", "asm-6-started"),
    ],
  },
  {
    id: "asm-7",
    vehicleId: "seed-7",
    assetType: "2 Wheeler",
    assetId: "MAX-AB-CH-520",
    plateNumber: "AB-520-GG",
    location: "Abeokuta Hub",
    assignedQaId: "qa-6",
    daysInState: 3,
    status: "Awaiting Assessment",
    activityHistory: [assignedHistoryEntry("Chinedu Okafor", "30 Aug 2026", "asm-7-assigned")],
  },
  {
    id: "asm-8",
    vehicleId: "seed-8",
    assetType: "4 Wheeler",
    assetId: "MAX-AB-CH-521",
    plateNumber: "AB-521-HH",
    location: "Abeokuta Hub",
    assignedQaId: "qa-6",
    daysInState: 7,
    status: "Assessment Ongoing",
    activityHistory: [
      assignedHistoryEntry("Chinedu Okafor", "23 Aug 2026", "asm-8-assigned"),
      assessmentStartedHistoryEntry("Chinedu Okafor", "26 Aug 2026", "asm-8-started"),
    ],
  },
]
