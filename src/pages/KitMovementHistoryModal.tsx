import { Modal, StatusTimeline, type TimelineEntryData } from "@/components/max"
import {
  getKitMovements,
  type KitEventType,
  type KitMovementEvent,
} from "@/data/mockKitMovements"
import type { KitReport } from "@/data/mockKitReports"

// Match the status colors used in the Kit Reports table (kitStatusVariantMap):
// Created → default (gray), Assignment → success (green), Reassignment → info (blue)
const eventVariantMap: Record<KitEventType, TimelineEntryData["statusVariant"]> = {
  Created: "default",
  Assignment: "success",
  Reassignment: "info",
}

const eventActionMap: Record<KitEventType, string> = {
  Created: "Created by",
  Assignment: "Assigned by",
  Reassignment: "Reassigned by",
}

function toTimelineEntry(event: KitMovementEvent): TimelineEntryData {
  const highlights: Record<string, string> = {
    chassis: event.chassisKitId,
    reason: event.reason,
  }

  let template: string

  if (event.eventType === "Created") {
    template = "Kit {chassis} was created and added to inventory. Reason: {reason}."
  } else if (event.eventType === "Reassignment") {
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
    status: event.eventType,
    statusVariant: eventVariantMap[event.eventType],
    description: { template, highlights },
    actor: { action: eventActionMap[event.eventType], name: event.actor },
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
