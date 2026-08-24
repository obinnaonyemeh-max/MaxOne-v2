import {
  GenericFilterPopover,
  type FilterSection,
  type GenericFilterState,
  getActiveFilterCount,
} from "@/components/max/GenericFilterPopover"
import { CITIES } from "@/data/cities"
import { STATION_PROVIDERS } from "@/data/mockStationsData"

export type { GenericFilterState as StationFilters }
export { getActiveFilterCount }

export const stationFilterSections: FilterSection[] = [
  {
    id: "cities",
    title: "Location",
    options: CITIES.map((city) => ({ value: city, label: city })),
    defaultExpanded: true,
  },
  {
    id: "providers",
    title: "Provider",
    options: STATION_PROVIDERS.map((provider) => ({
      value: provider,
      label: provider,
    })),
  },
]

interface StationFilterPopoverProps {
  filters: GenericFilterState
  onFiltersChange: (filters: GenericFilterState) => void
  className?: string
}

export function StationFilterPopover({
  filters,
  onFiltersChange,
  className,
}: StationFilterPopoverProps) {
  return (
    <GenericFilterPopover
      sections={stationFilterSections}
      filters={filters}
      onFiltersChange={onFiltersChange}
      className={className}
    />
  )
}
