import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, Check } from "lucide-react"
import {
  Modal,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockTechnicians, type Technician } from "@/data/mockTechnicians"

const LOCATIONS = Array.from(new Set(mockTechnicians.map((t) => t.city)))

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: LOCATIONS.map((city) => ({ value: city, label: city })),
  },
]

const defaultFilters: GenericFilterState = { location: [] }

interface ReassignTechnicianModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTechnician?: string
  onReassign: (technician: Technician) => void
}

export function ReassignTechnicianModal({
  open,
  onOpenChange,
  currentTechnician,
  onReassign,
}: ReassignTechnicianModalProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const reset = () => {
    setSearch("")
    setFilters(defaultFilters)
    setSelectedId(null)
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const technicians = useMemo(
    () =>
      mockTechnicians.filter((t) => {
        if (filters.location.length > 0 && !filters.location.includes(t.city)) return false
        if (search) {
          const q = search.toLowerCase()
          if (!t.name.toLowerCase().includes(q) && !t.city.toLowerCase().includes(q)) return false
        }
        return true
      }),
    [filters, search]
  )

  const selected = mockTechnicians.find((t) => t.id === selectedId)

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Reassign Technician"
      subtitle={currentTechnician ? `Currently assigned to ${currentTechnician}` : "Search and select a technician to reassign this tamper."}
      className="max-w-lg"
      maxHeight="80vh"
      secondaryAction={{ label: "Cancel", onClick: () => handleOpenChange(false) }}
      primaryAction={{
        label: "Reassign",
        disabled: !selected,
        onClick: () => {
          if (!selected) return
          onReassign(selected)
          handleOpenChange(false)
        },
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Search + filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search technician, specialty or city…"
              className="h-10 pl-9"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
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
              <GenericFilterPopover sections={filterSections} filters={filters} onFiltersChange={setFilters} />
            </PopoverContent>
          </Popover>
        </div>

        <span className="text-xs text-breadcrumb-root">
          {technicians.length} technician{technicians.length === 1 ? "" : "s"} available
        </span>

        {/* Technician list — fixed height so the modal doesn't resize as results change */}
        <div className="h-[340px] overflow-y-auto -mx-1 px-1 space-y-2">
          {technicians.length === 0 ? (
            <p className="py-10 text-center text-sm text-breadcrumb-root">No technicians match your search.</p>
          ) : (
            technicians.map((tech) => {
              const isSelected = tech.id === selectedId
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedId(tech.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    isSelected
                      ? "border-brand-dark bg-brand-dark/5"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-sidebar-item-active">
                    {tech.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sidebar-item-active truncate" style={{ fontSize: "14px" }}>
                      {tech.name}
                    </p>
                    <p className="text-breadcrumb-root truncate" style={{ fontSize: "12px" }}>
                      {tech.city}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected ? "border-brand-dark bg-brand-dark text-white" : "border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}
