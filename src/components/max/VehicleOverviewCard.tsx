import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"

type OverviewStatusVariant = "success" | "warning" | "info" | "danger" | "default" | "refurb"

interface VehicleOverviewProps {
  title?: string
  subtitle?: string
  headerRight?: ReactNode
  footer?: ReactNode
  status?: string
  statusVariant?: OverviewStatusVariant
  imageUrl?: string
  showImage?: boolean
  details: {
    label: string
    value: string
    hint?: string
    indicator?: string
    isStatus?: boolean
    statusVariant?: OverviewStatusVariant
  }[]
  className?: string
}

export function VehicleOverviewCard({
  title = "Vehicle Overview",
  subtitle,
  headerRight,
  footer,
  status,
  statusVariant = "info",
  imageUrl,
  showImage = true,
  details,
  className,
}: VehicleOverviewProps) {
  return (
    <div className={cn("bg-content-card p-5 rounded-lg border border-border", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-medium text-sidebar-item-active">
            {title}
          </h3>
          {subtitle && (
            <p className="text-breadcrumb-root mt-1" style={{ fontSize: "12px", lineHeight: 1.45 }}>
              {subtitle}
            </p>
          )}
        </div>
        {headerRight}
      </div>

      {status && (
        <div className="flex justify-center mb-4">
          <StatusBadge variant={statusVariant} withDot>
            {status}
          </StatusBadge>
        </div>
      )}

      {showImage && imageUrl && (
        <div className="flex justify-center py-4 mb-4">
          <img
            src={imageUrl}
            alt="Vehicle"
            className="w-auto object-contain"
            style={{ height: "141px" }}
          />
        </div>
      )}

      <div className="space-y-3">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-start justify-between gap-3">
            <span className="flex items-start gap-2 text-sm text-breadcrumb-root font-medium min-w-0">
              {detail.indicator && (
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: detail.indicator }}
                />
              )}
              {detail.label}
            </span>
            <div className="min-w-0 text-right">
              {detail.isStatus ? (
                <StatusBadge variant={detail.statusVariant || "success"} withDot size="sm">
                  {detail.value}
                </StatusBadge>
              ) : (
                <span className="text-sm font-medium text-sidebar-item-active break-words">
                  {detail.value}
                </span>
              )}
              {detail.hint && (
                <span className="block text-breadcrumb-root mt-0.5" style={{ fontSize: "11px" }}>
                  {detail.hint}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {footer && <div className="mt-4 pt-3 border-t border-gray-200">{footer}</div>}
    </div>
  )
}
