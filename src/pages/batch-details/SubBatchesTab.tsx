import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  DataTable,
  StatusBadge,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { getSubBatchesByBatchId, stageVariantMap, type SubBatch } from "@/data/mockSubBatches"

interface SubBatchesTabProps {
  batchId: string
}

const subBatchColumns: ColumnDef<SubBatch>[] = [
  {
    accessorKey: "subBatchId",
    header: "Sub-Batch ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.subBatchId}
      </span>
    ),
  },
  {
    accessorKey: "qty",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.qty.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <StatusBadge variant={stageVariantMap[row.original.stage] || "default"}>
        {row.original.stage}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.createdDate}
      </span>
    ),
  },
]

const filterSections: FilterSection[] = [
  {
    id: "stage",
    title: "Stage",
    defaultExpanded: true,
    options: [
      { value: "In Production", label: "In Production" },
      { value: "Identifier Upload", label: "Identifier Upload" },
      { value: "In Transit", label: "In Transit" },
      { value: "At Port", label: "At Port" },
      { value: "Clearing", label: "Clearing" },
      { value: "Warehouse QA", label: "Warehouse QA" },
      { value: "Ready for Activation", label: "Ready for Activation" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  stage: [],
}

export function SubBatchesTab({ batchId }: SubBatchesTabProps) {
  const navigate = useNavigate()
  const subBatches = getSubBatchesByBatchId(batchId)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  
  const filterCount = getActiveFilterCount(filters)

  const filteredSubBatches = subBatches.filter((sb) => {
    if (filters.stage.length > 0 && !filters.stage.includes(sb.stage)) {
      return false
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!sb.subBatchId.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  const handleRowClick = (subBatch: SubBatch) => {
    navigate(`/inbound/batches/${batchId}/sub-batches/${subBatch.subBatchId}`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filter</span>
                {filterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                    {filterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <GenericFilterPopover
                sections={filterSections}
                filters={filters}
                onFiltersChange={(f) => { setFilters(f); setCurrentPage(1) }}
              />
            </PopoverContent>
          </Popover>

          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                placeholder="Search sub-batch ID..."
                className="h-9 w-56"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery("") } }}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9"
                onClick={() => { setSearchOpen(false); setSearchQuery("") }}>×</Button>
            </div>
          ) : (
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={subBatchColumns}
            data={filteredSubBatches}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSubBatches.length / pageSize)}
          totalItems={filteredSubBatches.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="sub-batches"
        />
      </div>
    </div>
  )
}
