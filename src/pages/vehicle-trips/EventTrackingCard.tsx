import { useMemo } from "react"
import { StatusTimeline, type TimelineEntryData } from "@/components/max"
import {
  formatClock,
  type TripEvent,
  type TripEventType,
  type TripPoint,
} from "@/data/mockVehicleActivity"

const EVENT_VARIANT: Record<TripEventType, TimelineEntryData["statusVariant"]> = {
  start: "success",
  stop: "warning",
  harsh_brake: "danger",
  overspeed: "danger",
  geofence: "warning",
  charge: "info",
}

interface EventTrackingCardProps {
  events: TripEvent[]
  tripPoints: TripPoint[]
  startSeconds: number
  className?: string
}

function eventDescription(event: TripEvent): { template: string; highlights: Record<string, string> } {
  if (event.type === "start") {
    return { template: "Trip started — heading to {place}", highlights: { place: "Ajah" } }
  }
  if (event.type === "stop") {
    return { template: "Trip ended — arrived {place}", highlights: { place: "Ajah" } }
  }
  if (event.type === "charge") {
    return { template: "Battery swap at {place}", highlights: { place: "Lekki Station" } }
  }
  if (event.type === "overspeed") {
    return { template: "Overspeeding on {place}", highlights: { place: "Lekki-Epe Expressway" } }
  }
  if (event.type === "geofence") {
    return { template: "Geofence event near {place}", highlights: { place: "Lekki" } }
  }
  return { template: "Harsh braking detected", highlights: {} }
}

export function EventTrackingCard({
  events,
  tripPoints,
  startSeconds,
  className,
}: EventTrackingCardProps) {
  const entries = useMemo(
    () =>
      events.map((event) => {
        const point = tripPoints[Math.min(event.pointIndex, tripPoints.length - 1)]
        const description = eventDescription(event)
        return {
          id: event.id,
          date: formatClock(startSeconds + (point?.elapsedSeconds ?? 0)).replace(/:\d{2} (am|pm)$/i, " $1"),
          status: event.label,
          statusVariant: EVENT_VARIANT[event.type],
          description,
        } satisfies TimelineEntryData
      }),
    [events, startSeconds, tripPoints]
  )

  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col min-h-0 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <h3 className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 500 }}>
          Event Tracking
        </h3>
        <span className="text-breadcrumb-root" style={{ fontSize: "13px", fontWeight: 500 }}>
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {entries.length > 0 ? (
          <StatusTimeline entries={entries} />
        ) : (
          <p className="py-6 text-center text-sm text-breadcrumb-root">No events for this trip.</p>
        )}
      </div>
    </div>
  )
}
