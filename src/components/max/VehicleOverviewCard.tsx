import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"

interface VehicleOverviewProps {
  status: string
  statusVariant?: "success" | "warning" | "info" | "danger" | "default"
  imageUrl: string
  details: {
    label: string
    value: string
    isStatus?: boolean
    statusVariant?: "success" | "warning" | "info" | "danger" | "default"
  }[]
  className?: string
}

export function VehicleOverviewCard({
  status,
  statusVariant = "info",
  imageUrl,
  details,
  className,
}: VehicleOverviewProps) {
  return (
    <div className={cn("bg-content-card p-5 rounded-lg border border-border", className)}>
      <h3 className="text-base font-medium text-sidebar-item-active mb-4">
        Vehicle Overview
      </h3>

      <div className="flex justify-center mb-4">
        <StatusBadge variant={statusVariant} withDot>
          {status}
        </StatusBadge>
      </div>

      <div className="flex justify-center py-4 mb-4">
        <img
          src={imageUrl}
          alt="Vehicle"
          className="w-auto object-contain"
          style={{ height: '141px' }}
        />
      </div>

      <div className="space-y-3">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-breadcrumb-root font-medium">
              {detail.label}
            </span>
            {detail.isStatus ? (
              <StatusBadge variant={detail.statusVariant || "success"} withDot size="sm">
                {detail.value}
              </StatusBadge>
            ) : (
              <span className="text-sm font-medium text-sidebar-item-active">
                {detail.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
