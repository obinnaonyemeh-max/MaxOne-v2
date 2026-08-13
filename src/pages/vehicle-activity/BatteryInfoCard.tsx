interface BatteryInfoCardProps {
  stateOfCharge: number
  batteryId: string
  stateOfHealth: number
  estimatedRangeKm: number
  chargeCycle: number
  onSwapHistoryClick?: () => void
  className?: string
}

function getChargeColor(charge: number): string {
  if (charge >= 60) return "var(--color-success)"
  if (charge >= 30) return "var(--color-status-warning)"
  return "var(--color-status-danger)"
}

export function BatteryInfoCard({
  stateOfCharge,
  batteryId,
  stateOfHealth,
  estimatedRangeKm,
  chargeCycle,
  onSwapHistoryClick,
  className,
}: BatteryInfoCardProps) {
  const fillColor = getChargeColor(stateOfCharge)
  const fillWidth = Math.max(0, Math.min(100, stateOfCharge))

  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 500 }}>
          Battery Info
        </h3>
        <button
          onClick={onSwapHistoryClick}
          className="hover:underline"
          style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
        >
          SWAP HISTORY
        </button>
      </div>

      <div
        className="w-full rounded-lg overflow-hidden p-1 mb-4"
        style={{ backgroundColor: "var(--color-gray-100)", minHeight: "56px" }}
      >
        <div
          className="h-full min-h-[48px] rounded-md transition-all duration-300"
          style={{ width: `${fillWidth}%`, backgroundColor: fillColor }}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <span className="block text-breadcrumb-root mb-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>
            Battery state of Charge
          </span>
          <span className="text-success" style={{ fontSize: "16px", fontWeight: 600 }}>
            {stateOfCharge}%
          </span>
        </div>
        <div>
          <span className="block text-breadcrumb-root mb-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>
            Battery ID
          </span>
          <span className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 600 }}>
            {batteryId}
          </span>
        </div>
        <div>
          <span className="block text-breadcrumb-root mb-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>
            State of Health
          </span>
          <span className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 600 }}>
            {stateOfHealth}%
          </span>
        </div>
        <div>
          <span className="block text-breadcrumb-root mb-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>
            Estimated range left
          </span>
          <span className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 600 }}>
            {estimatedRangeKm} km
          </span>
        </div>
        <div>
          <span className="block text-breadcrumb-root mb-0.5" style={{ fontSize: "11px", fontWeight: 500 }}>
            Charge Cycle
          </span>
          <span className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 600 }}>
            {chargeCycle}
          </span>
        </div>
      </div>
    </div>
  )
}
