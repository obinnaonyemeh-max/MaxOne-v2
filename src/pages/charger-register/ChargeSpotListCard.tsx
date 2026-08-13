import { Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/max"

export interface SpotClusterCardData {
  id: string
  title: string
  frequency: number
  averageStopDuration: string
  location: { lat: number; lng: number }
  avgDistanceBetweenStop: string
}

interface ChargeSpotListCardProps {
  spot: SpotClusterCardData
  isSelected?: boolean
  onClick?: () => void
  onViewHeatMap?: () => void
  onShareLocation?: () => void
  className?: string
}

export function ChargeSpotListCard({
  spot,
  isSelected = false,
  onClick,
  onViewHeatMap,
  onShareLocation,
  className,
}: ChargeSpotListCardProps) {
  return (
    <div
      className={cn(
        "bg-white border rounded-lg transition-all cursor-pointer p-4",
        isSelected
          ? "border-gray-950 shadow-sm"
          : "border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3
          className="text-gray-950 flex-1"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {spot.title}
        </h3>
        {onShareLocation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onShareLocation()
                }}
                className="shrink-0 mt-0.5 rounded-md p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Share location"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Share location</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <span className="block text-gray-500" style={{ fontSize: "11px" }}>
            Frequency
          </span>
          <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
            {spot.frequency}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-gray-500" style={{ fontSize: "11px" }}>
            Average stop duration
          </span>
          <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
            {spot.averageStopDuration}
          </span>
        </div>
        <div>
          <span className="block text-gray-500" style={{ fontSize: "11px" }}>
            Location
          </span>
          <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
            Long {spot.location.lng.toFixed(6)}, Lat {spot.location.lat.toFixed(6)}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-gray-500" style={{ fontSize: "11px" }}>
            Avg distance between stop
          </span>
          <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
            {spot.avgDistanceBetweenStop}
          </span>
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onViewHeatMap?.()
          }}
          className="hover:underline"
          style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
        >
          VIEW HEAT MAP
        </button>
      </div>
    </div>
  )
}
