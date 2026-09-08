import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface FilterState {
  championStatus: string[]
  contractStatus: string[]
  assetClasses: string[]
  vehicleTypes: string[]
  locations: string[]
}

interface StatusOption {
  value: string
  label: string
  color?: string
}

const championStatusOptions: StatusOption[] = [
  { value: "Active", label: "Active", color: "var(--color-badge-active-text)" },
  { value: "Inactive", label: "Inactive", color: "var(--color-danger)" },
]

const contractStatusOptions: StatusOption[] = [
  { value: "Active", label: "Active", color: "var(--color-badge-active-text)" },
  { value: "Inactive", label: "Inactive", color: "var(--color-danger)" },
]

const assetClassOptions: StatusOption[] = [
  { value: "2 Wheeler", label: "2 Wheeler", color: "var(--color-status-info)" },
  { value: "3 Wheeler", label: "3 Wheeler", color: "var(--color-status-warning)" },
  { value: "4 Wheeler", label: "4 Wheeler", color: "var(--color-status-purple)" },
]

const vehicleTypeOptions: StatusOption[] = [
  { value: "EV", label: "EV", color: "var(--color-success)" },
  { value: "ICE", label: "ICE", color: "var(--color-gray-500)" },
]

const locationOptions = [
  "Ekiti",
  "Gbagba",
  "Eleyele",
  "Karu",
  "Bodija",
  "Lekki",
]

const SECTION_IDS = [
  "championStatus",
  "contractStatus",
  "assetClass",
  "vehicleType",
  "locations",
] as const

interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-sm text-sidebar-item">{title}</span>
        {isExpanded ? (
          <Minus className="h-4 w-4 text-sidebar-item" />
        ) : (
          <Plus className="h-4 w-4 text-sidebar-item" />
        )}
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FilterPopoverProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

function FilterOptionRow({
  option,
  checked,
  onToggle,
}: {
  option: StatusOption
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-50">
      <div className="flex items-center gap-2">
        {option.color && (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: option.color }}
          />
        )}
        <span className="font-medium text-sm">{option.label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}

export function FilterPopover({
  filters,
  onFiltersChange,
  className,
}: FilterPopoverProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    championStatus: true,
    contractStatus: false,
    assetClass: false,
    vehicleType: false,
    locations: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[section]
      const next: Record<string, boolean> = {}
      SECTION_IDS.forEach((id) => {
        next[id] = false
      })
      if (!isCurrentlyExpanded) {
        next[section] = true
      }
      return next
    })
  }

  const toggleFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [key]: updated })
  }

  return (
    <div className={cn("w-64 max-h-[calc(var(--radix-popover-content-available-height)-2rem)] overflow-y-auto p-1", className)}>
      <div className="mb-2">
        <FilterSection
          title="Champion Status"
          isExpanded={expandedSections.championStatus}
          onToggle={() => toggleSection("championStatus")}
        >
          {championStatusOptions.map((option) => (
            <FilterOptionRow
              key={option.value}
              option={option}
              checked={filters.championStatus.includes(option.value)}
              onToggle={() => toggleFilter("championStatus", option.value)}
            />
          ))}
        </FilterSection>
      </div>

      <div className="h-px bg-divider mx-2 mb-2" />

      <div className="mb-2">
        <FilterSection
          title="Contract Status"
          isExpanded={expandedSections.contractStatus}
          onToggle={() => toggleSection("contractStatus")}
        >
          {contractStatusOptions.map((option) => (
            <FilterOptionRow
              key={option.value}
              option={option}
              checked={filters.contractStatus.includes(option.value)}
              onToggle={() => toggleFilter("contractStatus", option.value)}
            />
          ))}
        </FilterSection>
      </div>

      <div className="h-px bg-divider mx-2 mb-2" />

      <div className="mb-2">
        <FilterSection
          title="Asset Class"
          isExpanded={expandedSections.assetClass}
          onToggle={() => toggleSection("assetClass")}
        >
          {assetClassOptions.map((option) => (
            <FilterOptionRow
              key={option.value}
              option={option}
              checked={filters.assetClasses.includes(option.value)}
              onToggle={() => toggleFilter("assetClasses", option.value)}
            />
          ))}
        </FilterSection>
      </div>

      <div className="h-px bg-divider mx-2 mb-2" />

      <div className="mb-2">
        <FilterSection
          title="Vehicle Type"
          isExpanded={expandedSections.vehicleType}
          onToggle={() => toggleSection("vehicleType")}
        >
          {vehicleTypeOptions.map((option) => (
            <FilterOptionRow
              key={option.value}
              option={option}
              checked={filters.vehicleTypes.includes(option.value)}
              onToggle={() => toggleFilter("vehicleTypes", option.value)}
            />
          ))}
        </FilterSection>
      </div>

      <div className="h-px bg-divider mx-2 mb-2" />

      <div>
        <FilterSection
          title="Location"
          isExpanded={expandedSections.locations}
          onToggle={() => toggleSection("locations")}
        >
          {locationOptions.map((location) => (
            <FilterOptionRow
              key={location}
              option={{ value: location, label: location }}
              checked={filters.locations.includes(location)}
              onToggle={() => toggleFilter("locations", location)}
            />
          ))}
        </FilterSection>
      </div>
    </div>
  )
}
