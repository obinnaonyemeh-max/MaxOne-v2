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
import { type PricingTemplate } from "@/data/mockPricingTemplates"

interface PricingTemplatesTableProps {
  templates: PricingTemplate[]
  columns: ColumnDef<PricingTemplate>[]
  isLoading?: boolean
  onRowClick?: (row: PricingTemplate) => void
}

const defaultFilters: GenericFilterState = { status: [], productType: [] }

export function PricingTemplatesTable({ templates, columns, isLoading = false, onRowClick }: PricingTemplatesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  const filterSections: FilterSection[] = useMemo(() => {
    const statuses = [...new Set(templates.map((t) => t.status ?? "Draft"))]
    const productTypes = [...new Set(templates.map((t) => t.productType).filter((p): p is string => Boolean(p)))]
    return [
      { id: "status", title: "Status", defaultExpanded: true, options: statuses.map((s) => ({ value: s, label: s })) },
      { id: "productType", title: "Product Type", options: productTypes.map((p) => ({ value: p, label: p })) },
    ]
  }, [templates])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredTemplates = useMemo(() => {
    setCurrentPage(1)
    return templates.filter((template) => {
      const status = template.status ?? "Draft"
      if (filters.status.length > 0 && !filters.status.includes(status)) return false
      if (filters.productType.length > 0 && !filters.productType.includes(template.productType ?? "")) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!template.name.toLowerCase().includes(q) && !(template.code ?? "").toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [templates, filters, searchQuery])

  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTemplates.slice(start, start + pageSize)
  }, [filteredTemplates, currentPage, pageSize])

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
                placeholder="Search by template name or code..."
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
            data={paginatedTemplates}
            isLoading={isLoading}
            emptyMessage="No pricing templates found."
            onRowClick={onRowClick}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredTemplates.length / pageSize))}
          totalItems={filteredTemplates.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="templates"
        />
      </div>
    </div>
  )
}
