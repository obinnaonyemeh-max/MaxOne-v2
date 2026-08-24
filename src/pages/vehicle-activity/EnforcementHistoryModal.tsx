import { Modal, StatusTimeline, type TimelineEntryData } from "@/components/max"
import type { EnforcementEvent } from "@/data/mockVehicleActivity"

interface EnforcementHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: EnforcementEvent[]
}

function toTimelineEntry(event: EnforcementEvent): TimelineEntryData {
  const highlights: Record<string, string> = {
    triggered: event.triggeredType,
    reason: event.reason,
  }

  let template = "Triggered type: {triggered} • Reason: {reason}"
  if (event.issuedBy) {
    highlights.issuer = event.issuedBy
    template = "Triggered type: {triggered} • Issued by: {issuer} • Reason: {reason}"
  }

  return {
    id: event.id,
    date: event.timestamp,
    status: event.type,
    statusVariant: event.statusVariant === "success" ? "info" : event.statusVariant,
    description: { template, highlights },
  }
}

export function EnforcementHistoryModal({
  open,
  onOpenChange,
  events,
}: EnforcementHistoryModalProps) {
  const entries = events.map(toTimelineEntry)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Enforcement history"
      className="max-w-3xl"
      maxHeight="80vh"
    >
      {entries.length > 0 ? (
        <StatusTimeline entries={entries} />
      ) : (
        <p className="py-8 text-center text-sm text-breadcrumb-root">
          No enforcement history for this vehicle.
        </p>
      )}
    </Modal>
  )
}
