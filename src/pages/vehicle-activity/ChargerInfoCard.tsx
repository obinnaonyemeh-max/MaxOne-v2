import { StatusBadge } from "@/components/max/StatusBadge"
import type { ChargerActivityStatus } from "@/data/mockVehicleActivity"

interface ChargerInfoCardProps {
  chargerId: string
  status: ChargerActivityStatus
  chargeSessions: number
  topChargingSpot: string
  className?: string
}

const statusToVariant: Record<ChargerActivityStatus, "success" | "info" | "neutral"> = {
  charging: "info",
  online: "success",
  offline: "neutral",
}

const statusLabels: Record<ChargerActivityStatus, string> = {
  charging: "Charging",
  online: "Online",
  offline: "Offline",
}

export function ChargerInfoCard({
  chargerId,
  status,
  chargeSessions,
  topChargingSpot,
  className,
}: ChargerInfoCardProps) {
  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 500 }}>
          Charger
        </h3>
        <StatusBadge variant={statusToVariant[status]} withDot size="sm">
          {statusLabels[status]}
        </StatusBadge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-breadcrumb-root font-medium">Charger ID</span>
          <span className="text-sm font-medium text-sidebar-item-active">{chargerId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-breadcrumb-root font-medium">Status</span>
          <span className="text-sm font-medium text-sidebar-item-active">{statusLabels[status]}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-breadcrumb-root font-medium">Charge Sessions</span>
          <span className="text-sm font-medium text-sidebar-item-active">{chargeSessions}</span>
        </div>
        <div>
          <span className="block text-sm text-breadcrumb-root font-medium mb-1">Top Charging Spot</span>
          <span className="text-sm font-medium text-sidebar-item-active">{topChargingSpot}</span>
        </div>
      </div>
    </div>
  )
}
