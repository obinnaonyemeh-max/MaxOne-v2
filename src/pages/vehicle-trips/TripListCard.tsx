import { cn } from "@/lib/utils"
import type { VehicleTrip } from "@/data/mockVehicleActivity"

interface TripListCardProps {
  trip: VehicleTrip
  isSelected?: boolean
  onClick?: () => void
}

export function TripListCard({ trip, isSelected = false, onClick }: TripListCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full min-w-0 text-left bg-white border rounded-lg p-4 transition-all",
        isSelected ? "shadow-sm" : "border-gray-200 hover:border-gray-300"
      )}
      style={isSelected ? { borderColor: "#E88E15" } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sidebar-item-active font-semibold shrink-0" style={{ fontSize: "14px" }}>
          Trip #{trip.number}
        </span>
        <span className="text-breadcrumb-root text-right min-w-0" style={{ fontSize: "12px" }}>
          {trip.date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <Field label="Start" value={trip.startTime} />
        <Field label="End" value={trip.endTime} align="right" />
        <Field label="Distance" value={`${trip.distanceKm.toFixed(2)} km`} />
        <Field label="Duration" value={trip.durationLabel} align="right" />
        <Field label="Max speed" value={`${trip.maxSpeedKmph} kmph`} />
        <div className="text-right">
          <span className="block text-gray-500" style={{ fontSize: "11px" }}>
            Alerts
          </span>
          <span
            className="font-medium"
            style={{
              fontSize: "13px",
              color: trip.alertCount > 0 ? "var(--color-status-danger)" : "var(--color-success)",
            }}
          >
            {trip.alertCount > 0 ? `${trip.alertCount} detected` : "None"}
          </span>
        </div>
      </div>
    </button>
  )
}

function Field({
  label,
  value,
  align = "left",
}: {
  label: string
  value: string
  align?: "left" | "right"
}) {
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
        {label}
      </span>
      <span className="block text-gray-950 font-medium break-words" style={{ fontSize: "13px" }}>
        {value}
      </span>
    </div>
  )
}
