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
import { type PricingBatchRecord } from "@/data/mockPricingBatchRecords"

interface PricingBatchesTableProps {
  batches: PricingBatchRecord[]
  columns: ColumnDef<PricingBatchRecord>[]
  isLoading?: boolean
  onRowClick?: (row: PricingBatchRecord) => void
}

const defaultFilters: GenericFilterState = { countryName: [], financierName: [] }

export function PricingBatchesTable({ batches, columns, isLoading = false, onRowClick }: PricingBatchesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  const filterSections: FilterSection[] = useMemo(() => {
    const countries = [...new Set(batches.map((b) => b.countryName))].sort()
    const financiers = [...new Set(batches.map((b) => b.financierName))].sort()
    return [
      {
        id: "countryName",
        title: "Country",
        defaultExpanded: true,
        options: countries.map((c) => ({ value: c, label: c })),
      },
      { id: "financierName", title: "Financier", options: financiers.map((f) => ({ value: f, label: f })) },
    ]
  }, [batches])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredBatches = useMemo(() => {
    setCurrentPage(1)
    return batches.filter((batch) => {
      if (filters.countryName.length > 0 && !filters.countryName.includes(batch.countryName)) return false
      if (filters.financierName.length > 0 && !filters.financierName.includes(batch.financierName)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !batch.code.toLowerCase().includes(q) &&
          !batch.manufacturerName.toLowerCase().includes(q) &&
          !batch.modelName.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [batches, filters, searchQuery])

  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBatches.slice(start, start + pageSize)
  }, [filteredBatches, currentPage, pageSize])

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
                placeholder="Search by batch code, manufacturer or model..."
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
            data={paginatedBatches}
            isLoading={isLoading}
            emptyMessage="No pricing batches found."
            onRowClick={onRowClick}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredBatches.length / pageSize))}
          totalItems={filteredBatches.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="batches"
        />
      </div>
    </div>
  )
}
