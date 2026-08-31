import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import {
  ExpandableSearch,
  GenericFilterPopover,
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

interface TabToolbarProps {
  filterSections: FilterSection[]
  filters: GenericFilterState
  onFiltersChange: (next: GenericFilterState) => void
  searchPlaceholder?: string
  onSearchSubmit?: (query: string) => void
}

export function TabToolbar({
  filterSections,
  filters,
  onFiltersChange,
  searchPlaceholder = "Search...",
  onSearchSubmit,
}: TabToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <GenericFilterPopover
              sections={filterSections}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </PopoverContent>
        </Popover>

        <ExpandableSearch
          open={searchOpen}
          onOpenChange={setSearchOpen}
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder={searchPlaceholder}
          onSubmit={onSearchSubmit}
        />
      </div>
    </div>
  )
}
