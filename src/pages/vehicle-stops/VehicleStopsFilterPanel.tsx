import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export type StopDurationFilter = "any" | "under-12" | "12-60" | "over-60"

export interface VehicleStopsFilterState {
  duration: StopDurationFilter
  dateRange: DateRange | undefined
}

export const defaultVehicleStopsFilterState: VehicleStopsFilterState = {
  duration: "any",
  dateRange: undefined,
}

const durationOptions: { value: StopDurationFilter; label: string }[] = [
  { value: "any", label: "Any duration" },
  { value: "under-12", label: "Under 12 mins" },
  { value: "12-60", label: "12 to 60 mins" },
  { value: "over-60", label: "Over 1 hour" },
]

interface VehicleStopsFilterPanelProps {
  state: VehicleStopsFilterState
  onChange: (next: VehicleStopsFilterState) => void
}

export function getVehicleStopsActiveFilterCount(state: VehicleStopsFilterState): number {
  return (state.duration !== "any" ? 1 : 0) + (state.dateRange?.from ? 1 : 0)
}

export function VehicleStopsFilterPanel({
  state,
  onChange,
}: VehicleStopsFilterPanelProps) {
  const activeCount = getVehicleStopsActiveFilterCount(state)

  const formatDateRange = () => {
    if (!state.dateRange?.from) return "Select date range"
    if (!state.dateRange.to) return format(state.dateRange.from, "dd MMM yyyy")
    return `${format(state.dateRange.from, "dd MMM yyyy")} - ${format(state.dateRange.to, "dd MMM yyyy")}`
  }

  return (
    <div className="w-[300px] max-h-[70vh] overflow-y-auto p-1">
      <div className="flex items-center justify-between px-2 py-1.5">
        <p className="font-medium text-sm text-sidebar-item">Filters</p>
        <button
          type="button"
          disabled={activeCount === 0}
          onClick={() => onChange(defaultVehicleStopsFilterState)}
          className={cn(
            "text-sm font-medium transition-colors",
            activeCount > 0
              ? "text-status-info hover:underline"
              : "text-gray-300 cursor-not-allowed"
          )}
        >
          Clear all
        </button>
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      <div className="px-2 py-2">
        <p className="font-medium text-sm text-sidebar-item mb-2">Stop duration</p>
        <div className="space-y-1">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...state, duration: option.value })}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                state.duration === option.value
                  ? "bg-muted text-sidebar-item-active font-medium"
                  : "text-breadcrumb-root hover:bg-muted font-medium"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      <div className="px-2 py-2">
        <p className="font-medium text-sm text-sidebar-item mb-2">Date Range</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 w-full justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[1200]" align="start">
            <Calendar
              mode="range"
              selected={state.dateRange}
              onSelect={(range) => onChange({ ...state, dateRange: range })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
