import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { DistributionChart, type DistributionDataItem } from "./DistributionChart"

export interface RegionDistribution {
  region: string
  data: DistributionDataItem[]
}

interface FleetDistributionCardProps {
  title?: string
  regions: RegionDistribution[]
  className?: string
  action?: ReactNode
  compact?: boolean
}

export function FleetDistributionCard({
  title = "Fleet Distribution",
  regions,
  className,
  action,
  compact = false,
}: FleetDistributionCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg",
        className?.includes("h-full") && "flex min-h-0 flex-col overflow-hidden",
        className
      )}
    >
      <div className={cn(
        "flex shrink-0 items-center justify-between gap-3 px-5 pt-5 pb-4",
        compact && "px-4 pt-3 pb-2"
      )}>
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
        {action}
      </div>

      <div className={cn("min-h-0 flex-1 overflow-hidden px-5 pb-5", compact && "px-3 pb-3")}>
        <div className={cn("grid h-full min-h-0 gap-2", regions.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
          {regions.map((region) => (
            <DistributionChart
              key={region.region}
              title={region.region}
              data={region.data}
              compact={compact}
              className={compact ? "h-full min-h-0" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
