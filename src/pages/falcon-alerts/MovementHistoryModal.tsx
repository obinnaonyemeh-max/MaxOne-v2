import { Modal, StatusTimeline, type TimelineEntryData } from "@/components/max"
import type { TamperMovementEvent } from "@/data/mockTamperAlerts"

interface MovementHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: TamperMovementEvent[]
}

function toTimelineEntry(event: TamperMovementEvent): TimelineEntryData {
  return {
    id: event.id,
    date: event.timestamp,
    status: event.title,
    statusVariant: event.statusVariant,
    description:
      event.descriptionTemplate && event.name
        ? { template: event.descriptionTemplate, highlights: { name: event.name } }
        : { template: "", highlights: {} },
  }
}

export function MovementHistoryModal({ open, onOpenChange, events }: MovementHistoryModalProps) {
  const entries = events.map(toTimelineEntry)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Movement history"
      className="max-w-3xl"
      maxHeight="80vh"
    >
      {entries.length > 0 ? (
        <StatusTimeline entries={entries} dateColumnClassName="w-44" />
      ) : (
        <p className="py-8 text-center text-sm text-breadcrumb-root">
          No movement history for this vehicle.
        </p>
      )}
    </Modal>
  )
}
