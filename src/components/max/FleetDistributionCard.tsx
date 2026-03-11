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
}

export function FleetDistributionCard({
  title = "Fleet Distribution",
  regions,
  className,
}: FleetDistributionCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg",
        className
      )}
    >
      <div className="px-5 pt-5 pb-4">
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
      </div>

      <div className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2">
          {regions.map((region) => (
            <DistributionChart
              key={region.region}
              title={region.region}
              data={region.data}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
