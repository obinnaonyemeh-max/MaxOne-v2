import { useState } from "react"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"
import { BatteryLevelIcon } from "./BatteryLevelIcon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { BatteryStatus, AssignmentStatus } from "@/data/mockBatteryRegisterData"

interface BatteryListCardProps {
  id: string
  status: BatteryStatus
  lastUpdate: string
  chargeLevel: number
  isCharging?: boolean
  isPluggedIn?: boolean
  isSelected?: boolean
  isExpanded?: boolean
  simNumber: string
  assignmentStatus: AssignmentStatus
  assignedTo: string | null
  currentLocation: string
  batteryModel: string
  lastReportedTime: string
  lastSwapTime: string
  onClick?: () => void
  onExpandClick?: () => void
  onMenuItemClick?: (action: string) => void
  onViewFullInfo?: () => void
  className?: string
}

const statusToVariant: Record<BatteryStatus, "success" | "danger" | "warning" | "info" | "default" | "neutral"> = {
  "riding": "success",
  "in-transit": "default",
  "idle": "warning",
  "checked-in": "info",
  "retired": "danger",
  "unknown": "neutral",
}

const statusLabels: Record<BatteryStatus, string> = {
  "riding": "RIDING",
  "in-transit": "IN TRANSIT",
  "idle": "IDLE",
  "checked-in": "CHECKED-IN",
  "retired": "RETIRED",
  "unknown": "UNKNOWN",
}

const assignmentStatusToVariant: Record<AssignmentStatus, "success" | "default" | "warning"> = {
  "assigned": "success",
  "unassigned": "default",
  "maintenance": "warning",
}

const assignmentStatusLabels: Record<AssignmentStatus, string> = {
  "assigned": "ASSIGNED",
  "unassigned": "UNASSIGNED",
  "maintenance": "MAINTENANCE",
}

const menuItems = [
  { id: "telemetry", label: "View Telemetry" },
  { id: "alert-history", label: "View Alert History" },
  { id: "movement-history", label: "View Movement History" },
  { id: "command-center", label: "Go to Command Center" },
]

export function BatteryListCard({
  id,
  status,
  lastUpdate,
  chargeLevel,
  isCharging = false,
  isPluggedIn = false,
  isSelected = false,
  isExpanded = false,
  simNumber,
  assignmentStatus,
  assignedTo,
  currentLocation,
  batteryModel,
  lastReportedTime,
  lastSwapTime,
  onClick,
  onExpandClick,
  onMenuItemClick,
  onViewFullInfo,
  className,
}: BatteryListCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border rounded-lg transition-all cursor-pointer relative",
        isSelected
          ? "border-gray-950 shadow-sm"
          : "border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        {/* First Row: ID, Battery Icon, Status Badge, Menu */}
        <div className="flex items-center justify-between pr-6">
          <div className="flex items-center gap-2">
            <span
              className="text-gray-950"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {id}
            </span>
            <BatteryLevelIcon
              chargeLevel={chargeLevel}
              isCharging={isCharging}
              isPluggedIn={isPluggedIn}
            />
            <div className="flex items-center gap-2">
              <StatusBadge
                variant={statusToVariant[status]}
                size="sm"
                style={{ fontSize: "10px", letterSpacing: "0.05em" }}
              >
                {statusLabels[status]}
              </StatusBadge>
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-48 p-1"
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
          </div>
        </div>

        {/* Second Row: Last Update */}
        <div className="mt-1">
          <span
            className="text-gray-500"
            style={{ fontSize: "12px" }}
          >
            Last update: {lastUpdate}
          </span>
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
                  {/* Row 1 */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      State of Charge
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {chargeLevel}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      SIM Number
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {simNumber}
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <span className="block text-gray-500 mb-1" style={{ fontSize: "11px" }}>
                      Assignment Status
                    </span>
                    <StatusBadge
                      variant={assignmentStatusToVariant[assignmentStatus]}
                      size="sm"
                      style={{ fontSize: "9px", letterSpacing: "0.05em" }}
                    >
                      {assignmentStatusLabels[assignmentStatus]}
                    </StatusBadge>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Assigned to
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        fontSize: "13px",
                        color: assignedTo ? "var(--color-status-warning)" : "var(--color-gray-400)",
                      }}
                    >
                      {assignedTo || "-"}
                    </span>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Current Location
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {currentLocation}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Battery Model
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {batteryModel}
                    </span>
                  </div>

                  {/* Row 4 */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Last Reported Time
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {lastReportedTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Last Swap Time
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {lastSwapTime}
                    </span>
                  </div>
                </div>

                {/* View full info link */}
                <div className="mt-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewFullInfo?.()
                    }}
                    className="text-status-info hover:underline"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    View full info
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
