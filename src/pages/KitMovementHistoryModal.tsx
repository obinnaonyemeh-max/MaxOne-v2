import { Modal, StatusTimeline, type TimelineEntryData } from "@/components/max"
import { getKitMovements, type KitMovementEvent } from "@/data/mockKitMovements"
import type { KitReport } from "@/data/mockKitReports"

function toTimelineEntry(event: KitMovementEvent): TimelineEntryData {
  const highlights: Record<string, string> = {
    chassis: event.chassisKitId,
    reason: event.reason,
  }

  const isCreated = event.eventType === "Created"
  const isReassignment = event.eventType === "Reassignment"

  let template: string

  if (isCreated) {
    template = "Kit {chassis} was created and added to inventory. Reason: {reason}."
  } else if (isReassignment) {
    highlights.fromClient = event.fromClient ?? "—"
    highlights.toClient = event.toClient ?? "—"
    highlights.plate = event.plateChange
    template =
      "Kit {chassis} reassigned from {fromClient} to {toClient}. Plate {plate}. Reason: {reason}."
  } else {
    highlights.toClient = event.toClient ?? "—"
    highlights.plate = event.plateChange
    template =
      "Kit {chassis} assigned to {toClient} with plate {plate}. Reason: {reason}."
  }

  return {
    id: event.id,
    date: event.date,
    status: isCreated ? "New" : "Assigned",
    statusVariant: isCreated ? "default" : "success",
    description: { template, highlights },
    actor: { action: isCreated ? "Created by" : "Assigned by", name: event.actor },
    duration: { range: event.dateTime, total: "" },
  }
}

interface KitMovementHistoryModalProps {
  kit: KitReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KitMovementHistoryModal({ kit, open, onOpenChange }: KitMovementHistoryModalProps) {
  const entries = kit ? getKitMovements(kit.id).map(toTimelineEntry) : []

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Movement History"
      subtitle={kit ? `${kit.id} — ${kit.vehicleType}` : undefined}
      className="max-w-3xl"
      maxHeight="80vh"
    >
      {entries.length > 0 ? (
        <StatusTimeline entries={entries} />
      ) : (
        <p className="py-8 text-center text-sm text-breadcrumb-root">
          No movement history for this kit.
        </p>
      )}
    </Modal>
  )
}
