import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
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

import { mockClosedAssets, type ClosedAssetRecord } from "@/data/mockClosedAssets"
import { CITY_FILTER_OPTIONS } from "@/data/cities"

const methodVariantMap: Record<string, "default" | "info"> = {
  "Disposed": "default",
  "Scrapped": "info",
}

const filterSections: FilterSection[] = [
  {
    id: "method",
    title: "Method",
    defaultExpanded: true,
    options: [
      { value: "Disposed", label: "Disposed" },
      { value: "Scrapped", label: "Scrapped" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_FILTER_OPTIONS,
  },
]

const defaultFilters: GenericFilterState = {
  method: [],
  location: [],
}

const columns: ColumnDef<ClosedAssetRecord>[] = [
  {
    accessorKey: "assetId",
    header: "Asset / ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.assetId}
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
    accessorKey: "manufacturer",
    header: "Manufacturer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.manufacturer}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.plateNumber}
      </span>
    ),
  },
  {
    accessorKey: "disposalMethod",
    header: "Disposal Method",
    cell: ({ row }) => (
      <StatusBadge variant={methodVariantMap[row.original.disposalMethod] || "default"}>
        {row.original.disposalMethod}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "disposalDate",
    header: "Disposal Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.disposalDate}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "recoveryValue",
    header: "Recovery Value",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.recoveryValue}
      </span>
    ),
  },
  {
    accessorKey: "writeOffAmount",
    header: "Write-Off Amount",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.writeOffAmount}
      </span>
    ),
  },
  {
    accessorKey: "closedBy",
    header: "Closed By",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.closedBy}
      </span>
    ),
  },
]

export default function ClosedAssetsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const activeFilterCount = getActiveFilterCount(filters)

  const disposedCount = mockClosedAssets.filter((r) => r.disposalMethod === "Disposed").length
  const scrappedCount = mockClosedAssets.filter((r) => r.disposalMethod === "Scrapped").length

  const filteredRecords = useMemo(() => {
    let result = mockClosedAssets

    if (filters.method?.length) {
      result = result.filter((r) => filters.method!.includes(r.disposalMethod))
    }
    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.assetId.toLowerCase().includes(q) ||
          r.plateNumber.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Closed Assets" }]}
      />
      <PageHeader
        title="Closed Assets"
        subtitle="Vehicles that have permanently exited the fleet lifecycle after completing disposal or scrap processes"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-4 gap-2 shrink-0">
          <StatCard
            title="Total Closed Assets"
            value={mockClosedAssets.length}
            indicatorColor="var(--color-gray-400)"
          />
          <StatCard
            title="Disposed"
            value={disposedCount}
            subtitle="Sold or disposed via disposal workflow"
            indicatorColor="var(--color-status-info)"
          />
          <StatCard
            title="Scrapped"
            value={scrappedCount}
            subtitle="Dismantled via scrap management"
            indicatorColor="var(--color-status-warning)"
          />
          <StatCard
            title="Total Recovery Value"
            value="$24,200"
            indicatorColor="var(--color-badge-active-text)"
          />
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
                    sections={filterSections}
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
                    placeholder="Search asset or plate..."
                    className="h-9 w-48"
                    autoFocus
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
            <DataTable columns={columns} data={filteredRecords} onRowClick={(row) => navigate(`/closed-assets/${row.assetId}`)} />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredRecords.length / pageSize))}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="assets"
          />
        </div>
      </div>
    </>
  )
}

export { mockClosedAssets, methodVariantMap }
export type { ClosedAssetRecord }
