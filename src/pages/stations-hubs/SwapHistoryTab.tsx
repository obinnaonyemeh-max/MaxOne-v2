import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"
import { startOfDay, endOfDay } from "date-fns"
import {
  DataTable,
  Pagination,
  ExpandableSearch,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  formatSwapDate,
  getSwapHistoryForStation,
  getSwapHistoryOperators,
  type StationSwapRecord,
} from "@/data/mockStationSwapHistory"
import {
  SwapHistoryFilterPanel,
  defaultSwapHistoryFilterState,
  getSwapHistoryActiveFilterCount,
  type SwapHistoryFilterState,
} from "./SwapHistoryFilterPanel"

const columns: ColumnDef<StationSwapRecord>[] = [
  {
    accessorKey: "id",
    header: "Swap ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "operator",
    header: "Operator",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.operator}
      </span>
    ),
  },
  {
    accessorKey: "champion",
    header: "Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.champion}
      </span>
    ),
  },
  {
    accessorKey: "checkedInBatteryId",
    header: "Checked-in Battery ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.checkedInBatteryId}
      </span>
    ),
  },
  {
    accessorKey: "checkedInAt",
    header: "Check-in Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {formatSwapDate(row.original.checkedInAt)}
      </span>
    ),
  },
  {
    accessorKey: "checkedOutBatteryId",
    header: "Checked-out Battery ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.checkedOutBatteryId}
      </span>
    ),
  },
  {
    accessorKey: "checkedOutAt",
    header: "Check-out Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {formatSwapDate(row.original.checkedOutAt)}
      </span>
    ),
  },
]

interface SwapHistoryTabProps {
  stationId: string
}

export function SwapHistoryTab({ stationId }: SwapHistoryTabProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterState, setFilterState] = useState<SwapHistoryFilterState>(
    defaultSwapHistoryFilterState
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const swaps = useMemo(() => getSwapHistoryForStation(stationId), [stationId])
  const operators = useMemo(() => getSwapHistoryOperators(stationId), [stationId])

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const operatorFilters = filterState.filters.operator ?? []
    const dateRange = filterState.dateRange
    const rangeStart = dateRange?.from ? startOfDay(dateRange.from) : null
    const rangeEnd = dateRange?.to
      ? endOfDay(dateRange.to)
      : dateRange?.from
        ? endOfDay(dateRange.from)
        : null

    return swaps.filter((swap) => {
      if (operatorFilters.length > 0 && !operatorFilters.includes(swap.operator)) {
        return false
      }

      if (rangeStart || rangeEnd) {
        const checkedIn = new Date(swap.checkedInAt)
        if (rangeStart && checkedIn < rangeStart) return false
        if (rangeEnd && checkedIn > rangeEnd) return false
      }

      if (!query) return true
      return (
        swap.id.toLowerCase().includes(query) ||
        swap.operator.toLowerCase().includes(query) ||
        swap.champion.toLowerCase().includes(query) ||
        swap.checkedInBatteryId.toLowerCase().includes(query) ||
        swap.checkedOutBatteryId.toLowerCase().includes(query)
      )
    })
  }, [filterState.dateRange, filterState.filters.operator, searchQuery, swaps])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [currentPage, filtered, pageSize])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const activeFilterCount = getSwapHistoryActiveFilterCount(filterState)

  const handleFilterChange = (next: SwapHistoryFilterState) => {
    setFilterState(next)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2">
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
              <SwapHistoryFilterPanel
                state={filterState}
                operators={operators}
                onChange={handleFilterChange}
              />
            </PopoverContent>
          </Popover>

          <ExpandableSearch
            open={searchOpen}
            onOpenChange={(open) => {
              setSearchOpen(open)
              if (!open) setCurrentPage(1)
            }}
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            placeholder="Search swap ID, operator, champion, or battery..."
            inputClassName="w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginated}
            emptyMessage="No battery swap history to show yet."
          />
        </div>
      </div>

      <div className="mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="swaps"
        />
      </div>
    </>
  )
}
