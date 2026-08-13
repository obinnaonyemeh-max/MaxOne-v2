import { cn } from "@/lib/utils"
import type { VehicleStop } from "@/data/mockVehicleActivity"

interface StopListCardProps {
  stop: VehicleStop
  isSelected?: boolean
  onClick?: () => void
}

export function StopListCard({ stop, isSelected = false, onClick }: StopListCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full min-w-0 text-left bg-white border rounded-lg p-4 transition-all",
        isSelected ? "shadow-sm" : "border-gray-200 hover:border-gray-300"
      )}
      style={isSelected ? { borderColor: "#E88E15" } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sidebar-item-active font-semibold shrink-0" style={{ fontSize: "14px" }}>
          Stop #{stop.number}
        </span>
        <span className="text-breadcrumb-root text-right min-w-0" style={{ fontSize: "12px" }}>
          {stop.date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <Field label="Start time" value={stop.startTime} />
        <Field label="End time" value={stop.endTime} align="right" />
        <Field label="Stop duration" value={stop.durationLabel} />
        <Field
          label="Stop location"
          value={`${stop.lat.toFixed(6)}, ${stop.lng.toFixed(6)}`}
          align="right"
        />
      </div>

      {isSelected && (
        <span
          className="absolute bottom-3 right-3 h-2 w-2 rounded-full"
          style={{ backgroundColor: "#E88E15" }}
        />
      )}
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
