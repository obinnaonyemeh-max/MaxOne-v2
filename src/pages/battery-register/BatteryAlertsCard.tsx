import type { BatteryAlert } from "@/data/mockBatteryRegisterData"

interface BatteryAlertsCardProps {
  alerts: BatteryAlert[]
}

const alertIconSrc: Record<BatteryAlert["type"], string> = {
  "over-temperature": "/images/temp.svg",
  "low-soh": "/images/soh_low.svg",
  "offline": "/images/offline.svg",
}

export function BatteryAlertsCard({ alerts }: BatteryAlertsCardProps) {
  const hasAlerts = alerts.length > 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src="/images/alert_icon.svg"
          alt="Alerts"
          className="h-6 w-6"
        />
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          Active Battery Alerts
        </h3>
      </div>

      {/* Description */}
      <p
        className="text-gray-500 mb-4"
        style={{ fontSize: "13px", lineHeight: 1.5 }}
      >
        {hasAlerts
          ? "This battery currently has active fault and degradation events requiring operational review."
          : "No active alerts for this battery."}
      </p>

      {/* Alert List */}
      {hasAlerts && (
        <div className="space-y-2 mb-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <img
                src={alertIconSrc[alert.type]}
                alt={alert.type}
                className="h-5 w-5 shrink-0"
              />
              <span
                className="text-gray-700 flex-1"
                style={{ fontSize: "13px" }}
              >
                {alert.message}
                {alert.type === "low-soh" && alert.value && (
                  <span className="text-gray-400 ml-1">• {alert.value}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* Footer - aligned to bottom */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span
          className="text-gray-400"
          style={{ fontSize: "11px" }}
        >
          Last updated 2 minutes ago
        </span>
        <button
          className="hover:underline"
          style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
        >
          VIEW ALERT HISTORY
        </button>
      </div>
    </div>
  )
}
