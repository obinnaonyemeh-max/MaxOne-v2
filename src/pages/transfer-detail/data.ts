import type { TimelineEntryData } from "@/components/max"

export const checklistItems = [
  { id: "1", text: "Confirm vehicle tracker has been removed",            completedBy: "Chiamaka A.", completedAt: "Today 10:44" },
  { id: "2", text: "Confirm ownership transfer document has been signed", completedBy: "Chiamaka A.", completedAt: "Today 10:45" },
]

export const activityLog: TimelineEntryData[] = [
  {
    id: "al0",
    date: "Today",
    status: "Ownership Transferred",
    statusVariant: "success",
    description: {
      template: "Ownership successfully transferred to {champion}. Transfer is now complete.",
      highlights: { champion: "Adaeze Okonkwo" },
    },
    actor: { action: "Approved by", name: "Fleet Manager" },
    duration: { range: "Today 11:45", total: "" },
  },
  {
    id: "al1",
    date: "Today",
    status: "Submitted for FM Approval",
    statusVariant: "info",
    description: {
      template: "Submitted for FM approval by {person}",
      highlights: { person: "Chiamaka A." },
    },
    actor: { action: "Submitted by", name: "Chiamaka A." },
    duration: { range: "Today 11:32", total: "" },
  },
  {
    id: "al2",
    date: "Today",
    status: "Document Uploaded",
    statusVariant: "warning",
    description: {
      template: "Document uploaded: {document}",
      highlights: { document: "Ownership_Transfer_VH-2024-00341_signed.pdf" },
    },
    actor: { action: "Uploaded by", name: "Chiamaka A." },
    duration: { range: "Today 11:31", total: "" },
  },
  {
    id: "al3",
    date: "Today",
    status: "Checklist Completed",
    statusVariant: "success",
    description: {
      template: "Checklist: {item} — confirmed",
      highlights: { item: "Transfer document signed" },
    },
    actor: { action: "Confirmed by", name: "Chiamaka A." },
    duration: { range: "Today 10:45", total: "" },
  },
  {
    id: "al4",
    date: "Today",
    status: "Checklist Completed",
    statusVariant: "success",
    description: {
      template: "Checklist: {item} — confirmed",
      highlights: { item: "Tracker removed" },
    },
    actor: { action: "Confirmed by", name: "Chiamaka A." },
    duration: { range: "Today 10:44", total: "" },
  },
  {
    id: "al5",
    date: "Today",
    status: "Status Changed",
    statusVariant: "warning",
    description: {
      template: "Status changed from {from} to {to}",
      highlights: { from: "Transfer — Yet to Commence", to: "Transfer In Progress" },
    },
    actor: { action: "Updated by", name: "System" },
    duration: { range: "Today 09:02", total: "" },
  },
  {
    id: "al6",
    date: "28 Apr 2026",
    status: "Record Created",
    statusVariant: "default",
    description: {
      template: "Transfer record created — {event}",
      highlights: { event: "HP contract completed" },
    },
    actor: { action: "Created by", name: "System" },
    duration: { range: "28 Apr 08:30", total: "" },
  },
]
