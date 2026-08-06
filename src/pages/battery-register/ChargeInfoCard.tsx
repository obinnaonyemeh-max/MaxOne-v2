import { StatusBadge } from "@/components/max"
import type { BatteryStatus } from "@/data/mockBatteryRegisterData"

interface ChargeInfoCardProps {
  status: BatteryStatus
  stateOfCharge: number
  stateOfHealth: number
  distanceLeft: number
  className?: string
}

const statusToVariant: Record<BatteryStatus, "success" | "danger" | "warning" | "info" | "default" | "neutral"> = {
  "riding": "success",
  "in-transit": "default",
  "idle": "warning",
  "checked-in": "checkin",
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

function getChargeColor(charge: number): string {
  if (charge >= 60) return "var(--color-success)"
  if (charge >= 30) return "var(--color-status-warning)"
  return "var(--color-status-danger)"
}

function ChargeBar({ chargeLevel, className }: { chargeLevel: number; className?: string }) {
  const fillColor = getChargeColor(chargeLevel)
  const fillWidth = Math.max(0, Math.min(100, chargeLevel))

  return (
    <div
      className={`w-full rounded-lg overflow-hidden p-1 ${className ?? ""}`}
      style={{ backgroundColor: "var(--color-gray-100)" }}
    >
      <div
        className="h-full rounded-md transition-all duration-300"
        style={{
          width: `${fillWidth}%`,
          backgroundColor: fillColor,
        }}
      />
    </div>
  )
}

export function ChargeInfoCard({
  status,
  stateOfCharge,
  stateOfHealth,
  distanceLeft,
  className,
}: ChargeInfoCardProps) {
  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sidebar-item-active"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          Charge Info
        </h3>
        <StatusBadge
          variant={statusToVariant[status]}
          size="sm"
          style={{ fontSize: "11px", letterSpacing: "0.05em" }}
        >
          {statusLabels[status]}
        </StatusBadge>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4" style={{ width: "90%" }}>
        <div>
          <span
            className="block text-breadcrumb-root mb-0.5"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            State of Charge
          </span>
          <span
            className="text-success"
            style={{ fontSize: "20px", fontWeight: 600 }}
          >
            {stateOfCharge} <span style={{ fontSize: "14px", fontWeight: 400 }}>%</span>
          </span>
        </div>
        <div>
          <span
            className="block text-breadcrumb-root mb-0.5"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            State of Health
          </span>
          <span
            className="text-sidebar-item-active"
            style={{ fontSize: "20px", fontWeight: 600 }}
          >
            {stateOfHealth} <span style={{ fontSize: "14px", fontWeight: 400 }}>%</span>
          </span>
        </div>
        <div>
          <span
            className="block text-breadcrumb-root mb-0.5"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            Distance left
          </span>
          <span
            className="text-sidebar-item-active"
            style={{ fontSize: "20px", fontWeight: 600 }}
          >
            {distanceLeft} <span style={{ fontSize: "14px", fontWeight: 400 }}>km</span>
          </span>
        </div>
      </div>

      {/* Charge Bar - grows to fill remaining space */}
      <div className="flex-1 flex items-center">
        <ChargeBar chargeLevel={stateOfCharge} className="h-full min-h-[56px]" />
      </div>
    </div>
  )
}
