import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface FilterState {
  championStatus: string[]
  contractStatus: string[]
  locations: string[]
}

interface StatusOption {
  value: string
  label: string
  color: string
}

const championStatusOptions: StatusOption[] = [
  { value: "Active", label: "Active", color: "var(--color-badge-active-text)" },
  { value: "Inactive", label: "Inactive", color: "var(--color-danger)" },
]

const contractStatusOptions: StatusOption[] = [
  { value: "Active", label: "Active", color: "var(--color-badge-active-text)" },
  { value: "Inactive", label: "Inactive", color: "var(--color-danger)" },
]

const locationOptions = [
  "Ekiti",
  "Gbagba",
  "Eleyele",
  "Karu",
  "Bodija",
  "Lekki",
]

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
        className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
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

export function FilterPopover({
  filters,
  onFiltersChange,
  className,
}: FilterPopoverProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    championStatus: true,
    contractStatus: false,
    locations: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleChampionStatus = (value: string) => {
    const current = filters.championStatus
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, championStatus: updated })
  }

  const toggleContractStatus = (value: string) => {
    const current = filters.contractStatus
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, contractStatus: updated })
  }

  const toggleLocation = (value: string) => {
    const current = filters.locations
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, locations: updated })
  }

  return (
    <div className={cn("w-64 p-1", className)}>
      {/* Champion Status Section */}
      <div className="mb-2">
        <FilterSection
          title="Champion Status"
          isExpanded={expandedSections.championStatus}
          onToggle={() => toggleSection("championStatus")}
        >
          {championStatusOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <span className="font-medium text-sm">{option.label}</span>
              </div>
              <Switch
                checked={filters.championStatus.includes(option.value)}
                onCheckedChange={() => toggleChampionStatus(option.value)}
              />
            </div>
          ))}
        </FilterSection>
      </div>

      {/* Divider */}
      <div className="h-px bg-divider mx-2 mb-2" />

      {/* Contract Status Section */}
      <div className="mb-2">
        <FilterSection
          title="Contract Status"
          isExpanded={expandedSections.contractStatus}
          onToggle={() => toggleSection("contractStatus")}
        >
          {contractStatusOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <span className="font-medium text-sm">{option.label}</span>
              </div>
              <Switch
                checked={filters.contractStatus.includes(option.value)}
                onCheckedChange={() => toggleContractStatus(option.value)}
              />
            </div>
          ))}
        </FilterSection>
      </div>

      {/* Divider */}
      <div className="h-px bg-divider mx-2 mb-2" />

      {/* Location Section */}
      <div>
        <FilterSection
          title="Location"
          isExpanded={expandedSections.locations}
          onToggle={() => toggleSection("locations")}
        >
          {locationOptions.map((location) => (
            <div
              key={location}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <span className="font-medium text-sm">{location}</span>
              <Switch
                checked={filters.locations.includes(location)}
                onCheckedChange={() => toggleLocation(location)}
              />
            </div>
          ))}
        </FilterSection>
      </div>
    </div>
  )
}
