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

export type ChargeSpotSort =
  | "duration-longest"
  | "duration-shortest"
  | "frequency-highest"
  | "frequency-lowest"
  | null

export interface ChargeSpotsFilterState {
  filters: GenericFilterState
  sort: ChargeSpotSort
  dateRange: DateRange | undefined
}

export const defaultChargeSpotsFilterState: ChargeSpotsFilterState = {
  filters: {
    category: [],
    days: [],
  },
  sort: null,
  dateRange: undefined,
}

export const chargeSpotsFilterSections: FilterSection[] = [
  {
    id: "category",
    title: "Category",
    defaultExpanded: true,
    options: [
      { value: "day", label: "Day Spots (6AM - 6:59PM)" },
      { value: "night", label: "Night Spots (7PM - 5:59AM)" },
      { value: "weekday", label: "Weekday Spots" },
      { value: "weekend", label: "Weekend Spots" },
    ],
  },
  {
    id: "days",
    title: "Days of the week",
    options: [
      { value: "monday", label: "Monday" },
      { value: "tuesday", label: "Tuesday" },
      { value: "wednesday", label: "Wednesday" },
      { value: "thursday", label: "Thursday" },
      { value: "friday", label: "Friday" },
      { value: "saturday", label: "Saturday" },
      { value: "sunday", label: "Sunday" },
    ],
  },
]

const durationSortOptions: { value: ChargeSpotSort; label: string }[] = [
  { value: "duration-longest", label: "Longest average spot duration" },
  { value: "duration-shortest", label: "Shortest average spot duration" },
]

const frequencySortOptions: { value: ChargeSpotSort; label: string }[] = [
  { value: "frequency-highest", label: "Highest number of spots" },
  { value: "frequency-lowest", label: "Lowest number of spots" },
]

interface ChargeSpotsFilterPanelProps {
  state: ChargeSpotsFilterState
  onChange: (next: ChargeSpotsFilterState) => void
}

export function getChargeSpotsActiveFilterCount(state: ChargeSpotsFilterState): number {
  return (
    getActiveFilterCount(state.filters) +
    (state.sort ? 1 : 0) +
    (state.dateRange?.from ? 1 : 0)
  )
}

function SortOptionList({
  options,
  selected,
  onSelect,
}: {
  options: { value: ChargeSpotSort; label: string }[]
  selected: ChargeSpotSort
  onSelect: (value: ChargeSpotSort) => void
}) {
  return (
    <div className="space-y-1 px-2 pb-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() =>
            onSelect(selected === option.value ? null : option.value)
          }
          className={cn(
            "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
            selected === option.value
              ? "bg-muted text-sidebar-item-active font-medium"
              : "text-breadcrumb-root hover:bg-muted font-medium"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function ChargeSpotsFilterPanel({
  state,
  onChange,
}: ChargeSpotsFilterPanelProps) {
  const activeCount = getChargeSpotsActiveFilterCount(state)

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
          onClick={() => onChange(defaultChargeSpotsFilterState)}
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

      {/* Date Range */}
      <div className="px-2 py-2">
        <p className="font-medium text-sm text-sidebar-item mb-2">Date Range</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 w-full justify-start gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[1200]" align="start">
            <Calendar
              mode="range"
              selected={state.dateRange}
              onSelect={(range) =>
                onChange({ ...state, dateRange: range })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      {/* Sort by Average Duration */}
      <div className="px-2 py-1">
        <p className="font-medium text-sm text-sidebar-item mb-1">
          Sort by Average Duration
        </p>
        <SortOptionList
          options={durationSortOptions}
          selected={
            state.sort === "duration-longest" || state.sort === "duration-shortest"
              ? state.sort
              : null
          }
          onSelect={(value) => onChange({ ...state, sort: value })}
        />
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      {/* Sort by Frequency */}
      <div className="px-2 py-1">
        <p className="font-medium text-sm text-sidebar-item mb-1">
          Sort by Frequency
        </p>
        <SortOptionList
          options={frequencySortOptions}
          selected={
            state.sort === "frequency-highest" || state.sort === "frequency-lowest"
              ? state.sort
              : null
          }
          onSelect={(value) => onChange({ ...state, sort: value })}
        />
      </div>

      <div className="h-px bg-divider mx-2 my-2" />

      {/* Category + Days via GenericFilterPopover */}
      <GenericFilterPopover
        sections={chargeSpotsFilterSections}
        filters={state.filters}
        onFiltersChange={(filters) => onChange({ ...state, filters })}
        className="w-full max-h-none"
      />
    </div>
  )
}
