import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
  color?: string
}

export interface FilterSection {
  id: string
  title: string
  options: FilterOption[]
  defaultExpanded?: boolean
}

export interface GenericFilterState {
  [key: string]: string[]
}

interface FilterSectionComponentProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSectionComponent({ title, isExpanded, onToggle, children }: FilterSectionComponentProps) {
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

interface GenericFilterPopoverProps {
  sections: FilterSection[]
  filters: GenericFilterState
  onFiltersChange: (filters: GenericFilterState) => void
  className?: string
}

export function GenericFilterPopover({
  sections,
  filters,
  onFiltersChange,
  className,
}: GenericFilterPopoverProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    sections.forEach((section, index) => {
      initial[section.id] = section.defaultExpanded ?? index === 0
    })
    return initial
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleFilter = (sectionId: string, value: string) => {
    const current = filters[sectionId] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [sectionId]: updated })
  }

  return (
    <div className={cn("w-64 p-1", className)}>
      {sections.map((section, index) => (
        <div key={section.id}>
          {index > 0 && <div className="h-px bg-divider mx-2 mb-2" />}
          <div className={index < sections.length - 1 ? "mb-2" : ""}>
            <FilterSectionComponent
              title={section.title}
              isExpanded={expandedSections[section.id]}
              onToggle={() => toggleSection(section.id)}
            >
              {section.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <Switch
                    checked={(filters[section.id] || []).includes(option.value)}
                    onCheckedChange={() => toggleFilter(section.id, option.value)}
                  />
                </div>
              ))}
            </FilterSectionComponent>
          </div>
        </div>
      ))}
    </div>
  )
}

export function getActiveFilterCount(filters: GenericFilterState): number {
  return Object.values(filters).reduce((count, arr) => count + arr.length, 0)
}
