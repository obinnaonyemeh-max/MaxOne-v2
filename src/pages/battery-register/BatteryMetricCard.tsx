interface BatteryMetricCardProps {
  iconSrc: string
  label: string
  value: number
  unit: string
  valueColor?: string
  showAlert?: boolean
}

export function BatteryMetricCard({
  iconSrc,
  label,
  value,
  unit,
  valueColor = "text-sidebar-item-active",
  showAlert = false,
}: BatteryMetricCardProps) {
  return (
    <div className="bg-content-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <img src={iconSrc} alt={label} className="h-7 w-7" />
        {showAlert && (
          <img src="/images/alert_icon.svg" alt="Alert" className="h-4 w-4" />
        )}
      </div>
      <span
        className="block text-breadcrumb-root mb-1"
        style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {label}
      </span>
      <span
        className={valueColor}
        style={{ fontSize: "28px", fontWeight: 600 }}
      >
        {value}
        <span
          className="text-breadcrumb-root"
          style={{ fontSize: "14px", fontWeight: 400, marginLeft: "4px" }}
        >
          {unit}
        </span>
      </span>
    </div>
  )
}
