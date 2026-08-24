import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export interface SwapHistoryFilterState {
  filters: GenericFilterState
  dateRange: DateRange | undefined
}

export const defaultSwapHistoryFilterState: SwapHistoryFilterState = {
  filters: { operator: [] },
  dateRange: undefined,
}

interface SwapHistoryFilterPanelProps {
  state: SwapHistoryFilterState
  operators: string[]
  onChange: (next: SwapHistoryFilterState) => void
}

export function getSwapHistoryActiveFilterCount(state: SwapHistoryFilterState): number {
  return getActiveFilterCount(state.filters) + (state.dateRange?.from ? 1 : 0)
}

export function SwapHistoryFilterPanel({
  state,
  operators,
  onChange,
}: SwapHistoryFilterPanelProps) {
  const activeCount = getSwapHistoryActiveFilterCount(state)

  const sections: FilterSection[] = [
    {
      id: "operator",
      title: "Operator",
      defaultExpanded: true,
      options: operators.map((operator) => ({
        value: operator,
        label: operator,
      })),
    },
  ]

  const formatDateRange = () => {
    if (!state.dateRange?.from) return "Select date range"
    if (!state.dateRange.to || state.dateRange.to.getTime() === state.dateRange.from.getTime()) {
      return format(state.dateRange.from, "dd MMM yyyy")
    }
    return `${format(state.dateRange.from, "dd MMM yyyy")} - ${format(state.dateRange.to, "dd MMM yyyy")}`
  }

  return (
    <div className="w-[300px] max-h-[70vh] overflow-y-auto p-1">
      <div className="flex items-center justify-between px-2 py-1.5">
        <p className="font-medium text-sm text-sidebar-item">Filters</p>
        <button
          type="button"
          disabled={activeCount === 0}
          onClick={() => onChange(defaultSwapHistoryFilterState)}
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
              defaultMonth={new Date(2024, 1, 1)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      <GenericFilterPopover
        sections={sections}
        filters={state.filters}
        onFiltersChange={(filters) => onChange({ ...state, filters })}
        className="w-full max-h-none"
      />
    </div>
  )
}
