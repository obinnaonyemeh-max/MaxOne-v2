import { cn } from "@/lib/utils"

interface BatteryLevelIconProps {
  chargeLevel: number
  isCharging?: boolean
  isPluggedIn?: boolean
  className?: string
}

function getFillColor(level: number): string {
  if (level >= 50) return "var(--color-success)"
  if (level >= 20) return "var(--color-status-warning)"
  return "var(--color-status-danger)"
}

export function BatteryLevelIcon({
  chargeLevel,
  isCharging = false,
  isPluggedIn = false,
  className,
}: BatteryLevelIconProps) {
  const fillColor = getFillColor(chargeLevel)
  const fillWidth = Math.max(0, Math.min(100, chargeLevel))
  
  const showLightningBolt = isCharging
  const showRedX = isPluggedIn && !isCharging

  return (
    <svg
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-6", className)}
    >
      {/* Battery body - filled background */}
      <rect
        x="0"
        y="0"
        width="21"
        height="14"
        rx="2.5"
        fill="var(--color-gray-200)"
      />
      
      {/* Battery tip - filled */}
      <rect
        x="21"
        y="4"
        width="3"
        height="6"
        rx="1"
        fill="var(--color-gray-200)"
      />
      
      {/* Battery charge fill */}
      <rect
        x="1.5"
        y="1.5"
        width={Math.max(0, (fillWidth / 100) * 18)}
        height="11"
        rx="1.5"
        fill={fillColor}
      />
      
      {/* Lightning bolt for charging */}
      {showLightningBolt && (
        <path
          d="M12 1L8 7.5H11L9 13L14 6.5H11L12 1Z"
          fill="white"
          stroke={fillColor}
          strokeWidth="0.5"
        />
      )}
      
      {/* Red X for plugged in but not charging */}
      {showRedX && (
        <g>
          <line
            x1="7"
            y1="4"
            x2="14"
            y2="10"
            stroke="var(--color-status-danger)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="4"
            x2="7"
            y2="10"
            stroke="var(--color-status-danger)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  )
}
