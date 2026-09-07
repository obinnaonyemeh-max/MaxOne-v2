import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatusTabs,
  StatusBadge,
  GenericFilterPopover,
  getActiveFilterCount,
  ExpandableSearch,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CITY_HUB_OPTIONS } from "@/data/cities"
import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import {
  useIssuedPartMovements,
  useStockAdjustments,
} from "@/data/inventoryMovementStore"
import type {
  IssuedPartMovement,
  StockAdjustmentMovement,
} from "@/data/mockInventoryMovements"

const issuedFilterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_HUB_OPTIONS,
  },
]

const adjustmentFilterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_HUB_OPTIONS,
  },
  {
    id: "type",
    title: "Type",
    defaultExpanded: true,
    options: [
      { value: "Addition", label: "Addition" },
      { value: "Depletion", label: "Depletion" },
    ],
  },
]

const defaultIssuedFilters: GenericFilterState = {
  location: [],
}

const defaultAdjustmentFilters: GenericFilterState = {
  location: [],
  type: [],
}

const issuedColumns: ColumnDef<IssuedPartMovement>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.date}
      </span>
    ),
  },
  {
    accessorKey: "skuId",
    header: "SKU ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.skuId}
      </span>
    ),
  },
  {
    accessorKey: "partName",
    header: "Part name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.partName}
      </span>
    ),
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.qty}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Vehicle",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.plateNumber}
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
    accessorKey: "issuedBy",
    header: "Issued by",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.issuedBy}
      </span>
    ),
  },
]

const adjustmentColumns: ColumnDef<StockAdjustmentMovement>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.date}
      </span>
    ),
  },
  {
    accessorKey: "skuId",
    header: "SKU ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.skuId}
      </span>
    ),
  },
  {
    accessorKey: "partName",
    header: "Part name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.partName}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.type === "Addition" ? "success" : "warning"}
        size="sm"
      >
        {row.original.type}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.qty}
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
    accessorKey: "recordedBy",
    header: "Recorded by",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.recordedBy}
      </span>
    ),
  },
]

export default function InventoryMovementHistoryPage() {
  const issuedMovements = useCityScopedRecords(useIssuedPartMovements(), "location")
  const adjustments = useCityScopedRecords(useStockAdjustments(), "location")

  const [activeTab, setActiveTab] = useState("issued")

  const [issuedPage, setIssuedPage] = useState(1)
  const [issuedPageSize, setIssuedPageSize] = useState(25)
  const [issuedFilters, setIssuedFilters] = useState<GenericFilterState>(defaultIssuedFilters)
  const [issuedSearch, setIssuedSearch] = useState("")
  const [issuedSearchOpen, setIssuedSearchOpen] = useState(false)

  const [adjustmentPage, setAdjustmentPage] = useState(1)
  const [adjustmentPageSize, setAdjustmentPageSize] = useState(25)
  const [adjustmentFilters, setAdjustmentFilters] =
    useState<GenericFilterState>(defaultAdjustmentFilters)
  const [adjustmentSearch, setAdjustmentSearch] = useState("")
  const [adjustmentSearchOpen, setAdjustmentSearchOpen] = useState(false)

  const issuedFilterCount = getActiveFilterCount(issuedFilters)
  const adjustmentFilterCount = getActiveFilterCount(adjustmentFilters)

  const filteredIssued = useMemo(() => {
    let result = issuedMovements

    if (issuedFilters.location?.length) {
      result = result.filter((row) => issuedFilters.location!.includes(row.location))
    }

    if (issuedSearch.trim()) {
      const query = issuedSearch.toLowerCase()
      result = result.filter(
        (row) =>
          row.skuId.toLowerCase().includes(query) ||
          row.partName.toLowerCase().includes(query) ||
          row.plateNumber.toLowerCase().includes(query)
      )
    }

    return result
  }, [issuedMovements, issuedFilters, issuedSearch])

  const filteredAdjustments = useMemo(() => {
    let result = adjustments

    if (adjustmentFilters.location?.length) {
      result = result.filter((row) => adjustmentFilters.location!.includes(row.location))
    }

    if (adjustmentFilters.type?.length) {
      result = result.filter((row) => adjustmentFilters.type!.includes(row.type))
    }

    if (adjustmentSearch.trim()) {
      const query = adjustmentSearch.toLowerCase()
      result = result.filter(
        (row) =>
          row.skuId.toLowerCase().includes(query) ||
          row.partName.toLowerCase().includes(query)
      )
    }

    return result
  }, [adjustments, adjustmentFilters, adjustmentSearch])

  const paginatedIssued = useMemo(() => {
    const start = (issuedPage - 1) * issuedPageSize
    return filteredIssued.slice(start, start + issuedPageSize)
  }, [filteredIssued, issuedPage, issuedPageSize])

  const paginatedAdjustments = useMemo(() => {
    const start = (adjustmentPage - 1) * adjustmentPageSize
    return filteredAdjustments.slice(start, start + adjustmentPageSize)
  }, [filteredAdjustments, adjustmentPage, adjustmentPageSize])

  const isIssued = activeTab === "issued"
  const filterCount = isIssued ? issuedFilterCount : adjustmentFilterCount
  const filterSections = isIssued ? issuedFilterSections : adjustmentFilterSections
  const filters = isIssued ? issuedFilters : adjustmentFilters
  const searchOpen = isIssued ? issuedSearchOpen : adjustmentSearchOpen
  const searchValue = isIssued ? issuedSearch : adjustmentSearch
  const searchPlaceholder = isIssued
    ? "Search SKU, part name, or plate..."
    : "Search SKU or part name..."

  const tabs = [
    { id: "issued", label: "Parts Issued", count: filteredIssued.length },
    { id: "adjustments", label: "Stock Adjustments", count: filteredAdjustments.length },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Lifecycle" },
          { label: "Inventory" },
          { label: "Movement History" },
        ]}
      />
      <PageHeader
        title="Movement History"
        subtitle="Track stock movements across hubs"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <StatusTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="px-0 mb-4 shrink-0"
        />

        <div className="mt-0 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center gap-2 px-2 py-2 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
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
                  onFiltersChange={(next) => {
                    if (isIssued) {
                      setIssuedFilters(next)
                      setIssuedPage(1)
                    } else {
                      setAdjustmentFilters(next)
                      setAdjustmentPage(1)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={isIssued ? setIssuedSearchOpen : setAdjustmentSearchOpen}
              value={searchValue}
              onValueChange={(value) => {
                if (isIssued) {
                  setIssuedSearch(value)
                  setIssuedPage(1)
                } else {
                  setAdjustmentSearch(value)
                  setAdjustmentPage(1)
                }
              }}
              placeholder={searchPlaceholder}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isIssued ? (
              <DataTable
                columns={issuedColumns}
                data={paginatedIssued}
                emptyMessage="No parts issued"
              />
            ) : (
              <DataTable
                columns={adjustmentColumns}
                data={paginatedAdjustments}
                emptyMessage="No stock adjustments"
              />
            )}
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          {isIssued ? (
            <Pagination
              currentPage={issuedPage}
              totalPages={Math.max(1, Math.ceil(filteredIssued.length / issuedPageSize))}
              totalItems={filteredIssued.length}
              pageSize={issuedPageSize}
              onPageChange={setIssuedPage}
              onPageSizeChange={setIssuedPageSize}
              itemLabel="movements"
            />
          ) : (
            <Pagination
              currentPage={adjustmentPage}
              totalPages={Math.max(1, Math.ceil(filteredAdjustments.length / adjustmentPageSize))}
              totalItems={filteredAdjustments.length}
              pageSize={adjustmentPageSize}
              onPageChange={setAdjustmentPage}
              onPageSizeChange={setAdjustmentPageSize}
              itemLabel="movements"
            />
          )}
        </div>
      </div>
    </>
  )
}
