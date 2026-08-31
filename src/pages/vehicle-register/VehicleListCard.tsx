import { useState } from "react"
import { ChevronDown, MoreHorizontal, Signal } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { clickableSurfaceProps } from "@/lib/clickableSurface"
import { StatusBadge } from "@/components/max/StatusBadge"
import { BatteryLevelIcon } from "@/components/max/BatteryLevelIcon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { TrackingStatus, VehicleCategory, VehicleType } from "@/data/mockVehicleRegister"

interface VehicleListCardProps {
  id: string
  plateNumber: string
  category: VehicleCategory
  vehicleType: VehicleType
  trackingStatus: TrackingStatus
  lastUpdate: string
  vehicleModel: string
  city: string
  brand: string
  financier: string
  driverSafetyScore: number
  signalStrength: number
  lastSeen: string
  batterySoC?: number
  assignedChampion?: string
  speed?: number
  isSelected?: boolean
  isExpanded?: boolean
  onClick?: () => void
  onExpandClick?: () => void
  onMenuItemClick?: (action: string) => void
  onViewFullInfo?: () => void
  className?: string
}

function getVehicleIcon(vehicleType: VehicleType, category: VehicleCategory): string {
  const typePrefix = vehicleType === "2 Wheeler" ? "2_wheeler" 
    : vehicleType === "3 Wheeler" ? "3_wheeler" 
    : "4_wheeler"
  const suffix = category === "ev" ? "_ev" : ""
  return `/images/${typePrefix}${suffix}.svg`
}

const statusToVariant: Record<TrackingStatus, "success" | "danger" | "warning" | "neutral"> = {
  moving: "success",
  stopped: "warning",
  offline: "danger",
  pending: "neutral",
}

const statusLabels: Record<TrackingStatus, string> = {
  moving: "MOVING",
  stopped: "STOPPED",
  offline: "OFFLINE",
  pending: "PENDING",
}

function getSafetyScoreColor(score: number): string {
  if (score >= 70) return "var(--color-success)"
  if (score >= 50) return "var(--color-warning)"
  return "var(--color-danger)"
}

function SafetyScoreRing({ score }: { score: number }) {
  const color = getSafetyScoreColor(score)
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--color-gray-200)"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="font-medium text-gray-950" style={{ fontSize: "13px" }}>{score}</span>
    </div>
  )
}

function getSignalColor(strength: number): string {
  if (strength >= 70) return "var(--color-success)"
  if (strength >= 40) return "var(--color-warning)"
  return "var(--color-danger)"
}

const menuItems = [
  { id: "view-vehicle-history", label: "View vehicle activity" },
  { id: "view-trips", label: "View vehicle trips" },
  { id: "geofence-visit-history", label: "Geofence visit history" },
  { id: "enforcement-actions", label: "Enforcement actions" },
  { id: "enforcement-history", label: "Enforcement history" },
]

export function VehicleListCard({
  id: _id,
  plateNumber,
  category,
  vehicleType,
  trackingStatus,
  lastUpdate,
  vehicleModel,
  city,
  brand,
  financier,
  driverSafetyScore,
  signalStrength,
  lastSeen,
  batterySoC,
  assignedChampion,
  speed: _speed,
  isSelected = false,
  isExpanded = false,
  onClick,
  onExpandClick,
  onMenuItemClick,
  onViewFullInfo,
  className,
}: VehicleListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isEV = category === "ev"
  const vehicleIcon = getVehicleIcon(vehicleType, category)

  return (
    <div
      className={cn(
        "bg-white border rounded-lg transition-all cursor-pointer relative",
        isSelected
          ? "border-gray-950 shadow-sm"
          : "border-gray-200 hover:border-gray-300",
        className
      )}
      {...clickableSurfaceProps(onClick, plateNumber)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 pr-6">
          {/* Vehicle Icon */}
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
            isEV ? "bg-green-50" : "bg-amber-50"
          )}>
            <img
              src={vehicleIcon}
              alt={`${vehicleType} ${isEV ? "EV" : "ICE"}`}
              className="w-8 h-8"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* First Row: Plate Number, Battery (EV), Status Badge, Menu */}
            <div className="flex items-center gap-2">
              <span
                className="text-gray-950 font-semibold"
                style={{ fontSize: "14px" }}
              >
                {plateNumber}
              </span>
              {isEV && batterySoC !== undefined && (
                <BatteryLevelIcon chargeLevel={batterySoC} />
              )}
              <StatusBadge
                variant={statusToVariant[trackingStatus]}
                size="sm"
                style={{ fontSize: "10px", letterSpacing: "0.05em" }}
              >
                {statusLabels[trackingStatus]}
              </StatusBadge>
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Vehicle actions"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-56 p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onMenuItemClick?.(item.id)
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Second Row: Last Update */}
            <div className="mt-1">
              <span className="text-gray-500" style={{ fontSize: "12px" }}>
                Last update: {lastUpdate}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Row 1: Vehicle Model / Assigned Champion */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Vehicle Model
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {vehicleModel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Assigned Champion
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {assignedChampion || "-"}
                    </span>
                  </div>

                  {/* Row 2: Vehicle Type / Location */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Vehicle Type
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {vehicleType} ({isEV ? "EV" : "ICE"})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Location
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {city}
                    </span>
                  </div>

                  {/* Row 3: Brand / Financier */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Brand
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {brand}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Financier
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {financier}
                    </span>
                  </div>

                  {/* Row 4: Driver Safety / Battery (EV only) or Signal (ICE) */}
                  <div>
                    <span className="block text-gray-500 mb-1" style={{ fontSize: "11px" }}>
                      Driver Safety
                    </span>
                    <SafetyScoreRing score={driverSafetyScore} />
                  </div>
                  {isEV && batterySoC !== undefined ? (
                    <div className="text-right">
                      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                        Battery
                      </span>
                      <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                        {batterySoC}%
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                        Signal
                      </span>
                      <div className="flex items-center justify-end gap-1.5">
                        <Signal 
                          className="h-4 w-4" 
                          style={{ color: getSignalColor(signalStrength) }}
                        />
                        <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                          {signalStrength}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Row 5: Signal (EV only) / Last Seen OR just Last Seen (ICE) */}
                  {isEV && (
                    <div>
                      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                        Signal
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Signal 
                          className="h-4 w-4" 
                          style={{ color: getSignalColor(signalStrength) }}
                        />
                        <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                          {signalStrength}%
                        </span>
                      </div>
                    </div>
                  )}
                  <div className={isEV ? "text-right" : ""}>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Last Seen
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {lastSeen}
                    </span>
                  </div>
                </div>

                {/* View vehicle activity link */}
                <div className="mt-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewFullInfo?.()
                    }}
                    className="text-status-info hover:underline"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    View vehicle activity
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chevron - Vertically centered on right side of collapsed content */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          onExpandClick?.()
        }}
        className={cn(
          "absolute right-4 p-1 rounded hover:bg-gray-100",
          isExpanded ? "top-4" : "top-1/2 -translate-y-1/2"
        )}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </motion.button>
    </div>
  )
}
