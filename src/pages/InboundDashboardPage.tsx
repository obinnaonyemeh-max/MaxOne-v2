import { useState } from "react"
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
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface InboundBatchRecord {
  id: string
  batchId: string
  oem: string
  vehicleModel: string
  quantity: number
  currentStage: string
  destination: string
  daysInStage: string
  eta: string
}

const COLOR_STATUS_INFO = "#1855FC"
const COLOR_GRAY_500 = "#737373"

const inboundStats = [
  { title: "In Production", value: 0, subtitle: "0 batches, Avg 0d", indicatorColor: COLOR_GRAY_500 },
  { title: "Identifier Upload", value: 1400, subtitle: "2 batches, Avg 1d", indicatorColor: COLOR_STATUS_INFO },
  { title: "In Transit", value: 2500, subtitle: "1 batch, Avg 0d", indicatorColor: COLOR_STATUS_INFO },
  { title: "At Port", value: 0, subtitle: "0 batches, Avg 0d", indicatorColor: COLOR_GRAY_500 },
  { title: "Clearing", value: 0, subtitle: "0 batches, Avg 0d", indicatorColor: COLOR_GRAY_500 },
  { title: "Warehouse QA", value: 0, subtitle: "0 batches, Avg 0d", indicatorColor: COLOR_GRAY_500 },
  { title: "Ready for Activation", value: 0, subtitle: "0 batches, Avg 0d", indicatorColor: COLOR_GRAY_500 },
]

const inboundFilterSections: FilterSection[] = [
  {
    id: "currentStage",
    title: "Current Stage",
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
  {
    id: "oem",
    title: "OEM / Manufacturer",
    options: [
      { value: "King", label: "King" },
      { value: "TailG", label: "TailG" },
      { value: "Spiro", label: "Spiro" },
    ],
  },
  {
    id: "destination",
    title: "Destination",
    options: [
      { value: "Nigeria / Lagos", label: "Nigeria / Lagos" },
      { value: "Ghana / Accra", label: "Ghana / Accra" },
    ],
  },
]

const defaultInboundFilters: GenericFilterState = {
  currentStage: [],
  oem: [],
  destination: [],
}

const mockInboundBatches: InboundBatchRecord[] = [
  { id: "1", batchId: "BATCH-2026-003", oem: "King", vehicleModel: "MAX M4", quantity: 2500, currentStage: "In Transit", destination: "Nigeria / Lagos", daysInStage: "0d", eta: "81 days" },
  { id: "2", batchId: "BATCH-2026-002", oem: "TailG", vehicleModel: "Jidi", quantity: 400, currentStage: "Identifier Upload", destination: "Ghana / Accra", daysInStage: "1d", eta: "71 days" },
  { id: "3", batchId: "BATCH-2026-001", oem: "Spiro", vehicleModel: "Ekon", quantity: 1000, currentStage: "Identifier Upload", destination: "Nigeria / Lagos", daysInStage: "1d", eta: "80 days" },
]

const columns: ColumnDef<InboundBatchRecord>[] = [
  {
    accessorKey: "batchId",
    header: "Batch ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.batchId}
      </span>
    ),
  },
  {
    accessorKey: "oem",
    header: "OEM / Manufacturer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.oem}
      </span>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle Model",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.vehicleModel}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.quantity.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "currentStage",
    header: "Current Stage",
    cell: ({ row }) => (
      <StatusBadge variant="info">{row.original.currentStage}</StatusBadge>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: "daysInStage",
    header: "Days in Stage",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.daysInStage}
      </span>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.eta}
      </span>
    ),
  },
]

export default function InboundDashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultInboundFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  return (
    <>
      <div className="grid grid-cols-7 gap-2 shrink-0 mt-4">
        {inboundStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <GenericFilterPopover
                  sections={inboundFilterSections}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </PopoverContent>
            </Popover>

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search batches, OEMs, VIN"
                  className="h-9 w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("Search:", searchQuery)
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
                  <span className="sr-only">Close search</span>
                  ×
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable columns={columns} data={mockInboundBatches} />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(mockInboundBatches.length / pageSize)}
          totalItems={mockInboundBatches.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="records"
        />
      </div>
    </>
  )
}
