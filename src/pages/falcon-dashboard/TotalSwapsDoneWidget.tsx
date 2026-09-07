import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import {
  GenericFilterPopover,
  TimeSeriesStatCard,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CITIES } from "@/data/cities"
import {
  mockSwapStations,
  type StationProvider,
} from "@/data/mockStationsData"
import { swapDashboardTrend } from "@/data/mockSwapDashboardData"

const PROVIDER_COLORS: Record<StationProvider, string> = {
  MAX: "var(--color-status-info)",
  Siltech: "var(--color-status-warning)",
  Pash: "var(--color-status-purple)",
  Spiro: "var(--color-success)",
}

const STATION_FILTER_SECTIONS: FilterSection[] = CITIES.map((city, index) => ({
  id: city,
  title: city,
  defaultExpanded: index === 0,
  options: mockSwapStations
    .filter((station) => station.city === city)
    .map((station) => ({
      value: station.id,
      label: station.name,
      color: PROVIDER_COLORS[station.provider],
    })),
})).filter((section) => section.options.length > 0)

const EMPTY_STATION_FILTERS: GenericFilterState = Object.fromEntries(
  STATION_FILTER_SECTIONS.map((section) => [section.id, []])
)

const TOTAL_SWAPS_TODAY = mockSwapStations.reduce(
  (total, station) => total + station.totalSwapsToday,
  0
)

export function TotalSwapsDoneWidget({ fill = false }: { fill?: boolean }) {
  const [filters, setFilters] = useState<GenericFilterState>(EMPTY_STATION_FILTERS)
  const selectedStationIds = useMemo(
    () => Object.values(filters).flat(),
    [filters]
  )
  const activeFilterCount = getActiveFilterCount(filters)

  const data = useMemo(() => {
    if (selectedStationIds.length === 0 || TOTAL_SWAPS_TODAY === 0) {
      return swapDashboardTrend
    }

    const selectedSwaps = mockSwapStations
      .filter((station) => selectedStationIds.includes(station.id))
      .reduce((total, station) => total + station.totalSwapsToday, 0)
    const scale = selectedSwaps / TOTAL_SWAPS_TODAY

    return swapDashboardTrend.map((point) => ({
      ...point,
      value: Math.round(point.value * scale),
      secondaryValue:
        point.secondaryValue == null
          ? undefined
          : Math.round(point.secondaryValue * scale),
    }))
  }, [selectedStationIds])

  return (
    <TimeSeriesStatCard
      title="Total Swaps Done"
      valueLabel="Total Swaps"
      data={data}
      primaryTooltipLabel="Swaps"
      secondaryTooltipLabel="Revenue"
      lineColor="var(--color-status-info)"
      valueColorClassName="text-gray-950"
      formatSecondaryValue={(value) => `NGN ${value.toLocaleString()}`}
      chartHeight={300}
      fill={fill}
      showPeriodFilter={!fill}
      headerAction={
        fill ? undefined : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <GenericFilterPopover
                className="w-72"
                sections={STATION_FILTER_SECTIONS}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </PopoverContent>
          </Popover>
        )
      }
    />
  )
}
