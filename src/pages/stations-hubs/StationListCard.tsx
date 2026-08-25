import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { BatteryLevelIcon } from "@/components/max/BatteryLevelIcon"
import {
  formatStationCollections,
  type SwapStation,
} from "@/data/mockStationsData"
import {
  StationActionsMenu,
  type StationMenuAction,
} from "./StationActionsMenu"

interface StationListCardProps {
  station: SwapStation
  isSelected?: boolean
  isExpanded?: boolean
  onClick?: () => void
  onExpandClick?: () => void
  onMenuAction?: (action: StationMenuAction) => void
  onViewFullInfo?: () => void
}

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "N/A"
  return String(value)
}

function DetailField({
  label,
  value,
  align = "left",
}: {
  label: string
  value: string
  align?: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
        {label}
      </span>
      <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
        {value}
      </span>
    </div>
  )
}

export function StationListCard({
  station,
  isSelected = false,
  isExpanded = false,
  onClick,
  onExpandClick,
  onMenuAction,
  onViewFullInfo,
}: StationListCardProps) {
  const isEmpty = station.batteriesAvailable === 0
  const averageSoc = isEmpty ? "N/A" : `${station.averageSoc}%`

  return (
    <div
      className={cn(
        "relative w-full cursor-pointer rounded-lg border bg-white text-left transition-all",
        isSelected
          ? "border-gray-950 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex items-start gap-3 pr-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
            <img
              src="/images/station.svg"
              alt=""
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="min-w-0 truncate text-gray-950"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                {station.name}
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                <BatteryLevelIcon
                  chargeLevel={station.averageSoc}
                  tooltip={`Average SOC: ${station.averageSoc}%`}
                />
                <StationActionsMenu onAction={onMenuAction} />
              </div>
            </div>
            <p
              className="mt-1 truncate text-gray-500"
              style={{ fontSize: "11px", fontWeight: 500 }}
            >
              <span style={{ color: isEmpty ? "#B5A018" : "inherit", fontWeight: 600 }}>
                {station.batteriesAvailable}
              </span>
              {` of ${station.batteriesCapacity} batteries available · ${station.city} · ${station.provider}`}
            </p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <DetailField label="Sub-city" value={displayValue(station.subCity)} />
                  <DetailField label="City" value={station.city} align="right" />
                  <DetailField
                    label="Available Batteries"
                    value={`${station.batteriesAvailable} of ${station.batteriesCapacity}`}
                  />
                  <DetailField
                    label="Average State of Charge"
                    value={averageSoc}
                    align="right"
                  />
                  <DetailField
                    label="Number of Reserved Batteries"
                    value={displayValue(station.reservedBatteries)}
                  />
                  <DetailField
                    label="Total Swaps (Today)"
                    value={station.totalSwapsToday.toLocaleString()}
                    align="right"
                  />
                  <DetailField
                    label="Total Collections"
                    value={formatStationCollections(station.totalCollections)}
                  />
                  <DetailField label="Provider" value={station.provider} align="right" />
                </div>

                <div className="mt-4 text-right">
                  <button
                    type="button"
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

      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onExpandClick?.()
        }}
        aria-label={isExpanded ? "Collapse station details" : "Expand station details"}
        className={cn(
          "absolute right-3 rounded p-1 hover:bg-gray-100",
          isExpanded ? "top-3" : "top-1/2 -translate-y-1/2"
        )}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </motion.button>
    </div>
  )
}
