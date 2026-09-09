import {
  GenericFilterPopover,
  type FilterSection,
  type GenericFilterState,
  getActiveFilterCount,
} from "@/components/max/GenericFilterPopover"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
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
  const { filterByCity, dataScope } = useRoleSimulation()
  const sections = dataScope
    ? [
        {
          ...stationFilterSections[0],
          options: CITIES.filter((city) => filterByCity(city)).map((city) => ({
            value: city,
            label: city,
          })),
        },
        stationFilterSections[1],
      ]
    : stationFilterSections

  return (
    <GenericFilterPopover
      sections={sections}
      filters={filters}
      onFiltersChange={onFiltersChange}
      className={className}
    />
  )
}
