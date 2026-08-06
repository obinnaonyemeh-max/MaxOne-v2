import { useState } from "react"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/max/StatusBadge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ChargerStatus, LifecycleStatus } from "@/data/mockChargerData"

interface ChargerListCardProps {
  id: string
  status: ChargerStatus
  lastUpdate: string
  isSelected?: boolean
  isExpanded?: boolean
  imei: string
  assignedTo: string | null
  assignedToAvatar: string | null
  chargerType: string
  lifecycleStatus: LifecycleStatus
  manufacturer: string
  chargerModel: string
  currentLocation: string
  stateDeployed: string
  lastReportedTime: string
  onClick?: () => void
  onExpandClick?: () => void
  onMenuItemClick?: (action: string) => void
  onViewFullInfo?: () => void
  className?: string
}

const statusToVariant: Record<ChargerStatus, "success" | "danger" | "warning" | "info" | "default" | "neutral"> = {
  "online": "success",
  "charging": "info",
  "pending": "warning",
  "offline": "neutral",
}

const statusLabels: Record<ChargerStatus, string> = {
  "online": "ONLINE",
  "charging": "CHARGING",
  "pending": "PENDING",
  "offline": "OFFLINE",
}

const lifecycleToVariant: Record<LifecycleStatus, "success" | "danger" | "warning"> = {
  "active": "success",
  "inactive": "danger",
  "maintenance": "warning",
}

const lifecycleLabels: Record<LifecycleStatus, string> = {
  "active": "ACTIVE",
  "inactive": "INACTIVE",
  "maintenance": "MAINTENANCE",
}

const menuItems = [
  { id: "view-charger-info", label: "View charger info" },
  { id: "view-charge-sessions", label: "View charge sessions" },
  { id: "view-charge-spots", label: "View charge spots" },
]

export function ChargerListCard({
  id,
  status,
  lastUpdate,
  isSelected = false,
  isExpanded = false,
  imei,
  assignedTo,
  assignedToAvatar,
  chargerType,
  lifecycleStatus,
  manufacturer,
  chargerModel,
  currentLocation,
  stateDeployed,
  lastReportedTime,
  onClick,
  onExpandClick,
  onMenuItemClick,
  onViewFullInfo,
  className,
}: ChargerListCardProps) {
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
        {/* First Row: ID, Status Badge, Menu */}
        <div className="flex items-center justify-between pr-6">
          <div className="flex items-center gap-2">
            <span
              className="text-gray-950"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {id}
            </span>
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
                  {/* Row 1: IMEI / Assigned to */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      IMEI
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {imei}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Assigned to
                    </span>
                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                        {assignedTo || "-"}
                      </span>
                      {assignedToAvatar && (
                        <img
                          src={assignedToAvatar}
                          alt={assignedTo || "Assignee"}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Charger Type / Lifecycle status */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Charger Type
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {chargerType}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500 mb-1" style={{ fontSize: "11px" }}>
                      Lifecycle status
                    </span>
                    <StatusBadge
                      variant={lifecycleToVariant[lifecycleStatus]}
                      size="sm"
                      style={{ fontSize: "9px", letterSpacing: "0.05em" }}
                    >
                      {lifecycleLabels[lifecycleStatus]}
                    </StatusBadge>
                  </div>

                  {/* Row 3: Manufacturer / Charger Model */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Manufacturer
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {manufacturer}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Charger Model
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {chargerModel}
                    </span>
                  </div>

                  {/* Row 4: Current Location / State Deployed */}
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
                      State Deployed
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {stateDeployed}
                    </span>
                  </div>

                  {/* Row 5: Last Reported Time */}
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Last Reported Time
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {lastReportedTime}
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
