import { cn } from "@/lib/utils"
import { TimelineEntry, type TimelineEntryData } from "./TimelineEntry"

interface StatusTimelineProps {
  entries: TimelineEntryData[]
  className?: string
  /** Width class for the date column (default "w-28"). Widen to keep long timestamps on one line. */
  dateColumnClassName?: string
}

const variantToColor: Record<string, string> = {
  success: "bg-status-success",
  warning: "bg-status-warning",
  info: "bg-status-info",
  danger: "bg-status-danger",
  default: "bg-gray-400",
}

export function StatusTimeline({ entries, className, dateColumnClassName = "w-28" }: StatusTimelineProps) {
  const groupedEntries = entries.reduce<Record<string, TimelineEntryData[]>>(
    (acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = []
      }
      acc[entry.date].push(entry)
      return acc
    },
    {}
  )

  const dates = Object.keys(groupedEntries)
  const totalEntries = entries.length

  let entryCounter = 0

  return (
    <div className={cn("", className)}>
      {dates.map((date) => {
        const dateEntries = groupedEntries[date]

        return (
          <div key={date}>
            {dateEntries.map((entry, entryIndex) => {
              const currentEntryIndex = entryCounter
              entryCounter++
              const isLastEntry = currentEntryIndex === totalEntries - 1
              const isFirstInDate = entryIndex === 0

              return (
                <div key={entry.id} className="flex">
                  {/* Date Column */}
                  <div className={cn("shrink-0", dateColumnClassName)}>
                    {isFirstInDate && (
                      <span className="text-sm font-medium text-sidebar-item-active">
                        {date}
                      </span>
                    )}
                  </div>

                  {/* Timeline Column - Dot and Line */}
                  <div className="flex flex-col items-center mx-4">
                    {/* Dot - aligned with status badge */}
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0 mt-2",
                        variantToColor[entry.statusVariant]
                      )}
                    />
                    {/* Vertical Line */}
                    <div
                      className="flex-1 w-px bg-border"
                      style={{ 
                        minHeight: isLastEntry ? '4px' : '100px'
                      }}
                    />
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 pb-6">
                    <TimelineEntry entry={entry} />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export type { TimelineEntryData }
