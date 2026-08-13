import {
  GenericFilterPopover,
  type FilterSection,
  type GenericFilterState,
  getActiveFilterCount,
} from "@/components/max/GenericFilterPopover"
import {
  CITIES,
  VEHICLE_TYPES,
  FINANCIERS,
  BRANDS,
  LIFECYCLE_STATUSES,
} from "@/data/mockVehicleRegister"

export type { GenericFilterState as VehicleFilters }
export { getActiveFilterCount }

const lifecycleStatusColors: Record<string, string> = {
  "Exit": "#EF4444",
  "Active": "#22C55E",
  "Inbound": "#3B82F6",
  "Operational Fleet": "#8B5CF6",
  "3PL Check-in": "#F59E0B",
  "Yard Check-in": "#6B7280",
}

export const vehicleFilterSections: FilterSection[] = [
  {
    id: "cities",
    title: "Location",
    options: CITIES.map((city) => ({ value: city, label: city })),
    defaultExpanded: true,
  },
  {
    id: "vehicleTypes",
    title: "Vehicle Type",
    options: VEHICLE_TYPES.map((type) => ({ value: type, label: type })),
  },
  {
    id: "financiers",
    title: "Financier",
    options: FINANCIERS.map((financier) => ({ value: financier, label: financier })),
  },
  {
    id: "brands",
    title: "Brand",
    options: BRANDS.map((brand) => ({ value: brand, label: brand })),
  },
  {
    id: "lifecycleStatuses",
    title: "Lifecycle Status",
    options: LIFECYCLE_STATUSES.map((status) => ({
      value: status,
      label: status,
      color: lifecycleStatusColors[status],
    })),
  },
]

interface VehicleFilterPopoverProps {
  filters: GenericFilterState
  onFiltersChange: (filters: GenericFilterState) => void
  className?: string
}

export function VehicleFilterPopover({
  filters,
  onFiltersChange,
  className,
}: VehicleFilterPopoverProps) {
  return (
    <GenericFilterPopover
      sections={vehicleFilterSections}
      filters={filters}
      onFiltersChange={onFiltersChange}
      className={className}
    />
  )
}
