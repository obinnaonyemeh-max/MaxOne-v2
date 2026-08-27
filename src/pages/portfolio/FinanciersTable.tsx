import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Financier } from "@/data/mockFinanciers"

interface FinanciersTableProps {
  financiers: Financier[]
  columns: ColumnDef<Financier>[]
  isLoading?: boolean
  onRowClick?: (row: Financier) => void
}

const defaultFilters: GenericFilterState = { financingPartner: [], status: [] }

export function FinanciersTable({ financiers, columns, isLoading = false, onRowClick }: FinanciersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  const filterSections: FilterSection[] = useMemo(() => {
    const partners = [...new Set(financiers.map((f) => f.financingPartner))].sort()
    const statuses = [...new Set(financiers.map((f) => f.status))]
    return [
      {
        id: "financingPartner",
        title: "Financing Partner",
        defaultExpanded: true,
        options: partners.map((p) => ({ value: p, label: p })),
      },
      { id: "status", title: "Status", options: statuses.map((s) => ({ value: s, label: s })) },
    ]
  }, [financiers])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredFinanciers = useMemo(() => {
    setCurrentPage(1)
    return financiers.filter((financier) => {
      if (filters.financingPartner.length > 0 && !filters.financingPartner.includes(financier.financingPartner))
        return false
      if (filters.status.length > 0 && !filters.status.includes(financier.status)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !financier.financierName.toLowerCase().includes(q) &&
          !financier.financingPartner.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [financiers, filters, searchQuery])

  const paginatedFinanciers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredFinanciers.slice(start, start + pageSize)
  }, [filteredFinanciers, currentPage, pageSize])

  return (
    <div className="px-6 mt-2 flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2 shrink-0">
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
              <GenericFilterPopover sections={filterSections} filters={filters} onFiltersChange={setFilters} />
            </PopoverContent>
          </Popover>

          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by financier or partner name..."
                className="h-9 w-72"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false)
                    setSearchQuery("")
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery("")
                }}
              >
                ×
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={paginatedFinanciers}
            isLoading={isLoading}
            emptyMessage="No financiers found."
            onRowClick={onRowClick}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredFinanciers.length / pageSize))}
          totalItems={filteredFinanciers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="financiers"
        />
      </div>
    </div>
  )
}
