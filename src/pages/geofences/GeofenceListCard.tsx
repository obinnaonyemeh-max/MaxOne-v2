import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/max/StatusBadge"
import { geofenceTypeBadge, type Geofence } from "@/data/mockGeofences"

interface GeofenceListCardProps {
  geofence: Geofence
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpand: () => void
}

export function GeofenceListCard({
  geofence,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}: GeofenceListCardProps) {
  const badge = geofenceTypeBadge[geofence.type]

  return (
    <div
      onClick={onSelect}
      data-geofence-id={geofence.id}
      className={cn(
        "rounded-lg border bg-white p-3 cursor-pointer transition-all",
        isSelected ? "border-gray-950 shadow-sm" : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-950 truncate" style={{ fontSize: "14px" }}>
              {geofence.name}
            </p>
            <StatusBadge
              variant={badge.variant}
              size="sm"
              style={{ fontSize: "10px", letterSpacing: "0.05em" }}
            >
              {badge.label}
            </StatusBadge>
          </div>
          <p className="text-gray-500 truncate mt-0.5" style={{ fontSize: "13px" }}>
            {geofence.area}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Stat label="Number of visits per period" value={geofence.metrics.visitsPerPeriod.toLocaleString()} />
                <Stat label="Active visits" value={geofence.metrics.activeVisits.toLocaleString()} align="right" />
                <Stat label="Average time spent per rider" value={geofence.metrics.avgDuration} />
                <Stat label="Number of Vehicle" value={geofence.metrics.vehicleCount.toLocaleString()} align="right" />
                <Stat label="Unauthorized exits" value={geofence.metrics.unauthorizedExits.toLocaleString()} />
                <Stat label="Active Alerts" value={geofence.metrics.activeAlerts.toLocaleString()} align="right" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ label, value, align }: { label: string; value: string; align?: "right" }) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
        {label}
      </span>
      <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
        {value}
      </span>
    </div>
  )
}
