import { cn } from "@/lib/utils"

export interface BatteryStatusChip {
  id: string
  label: string
  count: number
  color: string
}

interface BatteryStatusFilterChipsProps {
  chips: BatteryStatusChip[]
  activeChipId: string | null
  onChipClick: (chipId: string | null) => void
  className?: string
}

export function BatteryStatusFilterChips({
  chips,
  activeChipId,
  onChipClick,
  className,
}: BatteryStatusFilterChipsProps) {
  const total = chips.reduce((sum, chip) => sum + chip.count, 0)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Legend Row */}
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
        {chips.map((chip) => {
          const isActive = activeChipId === chip.id
          return (
            <button
              key={chip.id}
              onClick={() => onChipClick(isActive ? null : chip.id)}
              className={cn(
                "flex items-center gap-1.5 hover:opacity-70 transition-opacity",
                isActive && "underline underline-offset-2"
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: chip.color }}
              />
              <span
                className="text-gray-700"
                style={{ fontSize: "12.5px", fontWeight: 500 }}
              >
                {chip.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Segmented Bar */}
      <div className="flex h-10 rounded-lg overflow-hidden border-2 border-transparent">
        {chips.map((chip, index) => {
          const percentage = (chip.count / total) * 100
          const isActive = activeChipId === chip.id
          const isFirst = index === 0
          const isLast = index === chips.length - 1

          return (
            <button
              key={chip.id}
              onClick={() => onChipClick(isActive ? null : chip.id)}
              className={cn(
                "flex items-center justify-start pl-2 transition-all relative",
                "font-semibold text-white hover:opacity-90 overflow-hidden",
                isActive && "ring-2 ring-gray-950 ring-inset z-10"
              )}
              style={{
                backgroundColor: chip.color,
                width: `${percentage}%`,
                fontSize: "12px",
                borderTopLeftRadius: isFirst ? "6px" : 0,
                borderBottomLeftRadius: isFirst ? "6px" : 0,
                borderTopRightRadius: isLast ? "6px" : 0,
                borderBottomRightRadius: isLast ? "6px" : 0,
              }}
            >
              {percentage >= 8 && (
                <span className="whitespace-nowrap">
                  {chip.count.toLocaleString()}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
