import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, CalendarDays } from "lucide-react"
import { format } from "date-fns"

import {
  DataTable,
  Pagination,
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
import { Calendar } from "@/components/ui/calendar"
import {
  mockMovementHistory,
  movementEventTypeLabels,
  type MovementHistoryItem,
  type MovementEventType,
} from "@/data/mockBatteryRegisterData"

const columns: ColumnDef<MovementHistoryItem>[] = [
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
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.timestamp}
      </span>
    ),
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {movementEventTypeLabels[row.original.eventType]}
      </span>
    ),
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.from}
      </span>
    ),
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.to}
      </span>
    ),
  },
  {
    accessorKey: "riderVehicleId",
    header: "Rider/Vehicle ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.riderVehicleId || "-"}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.location || "-"}
      </span>
    ),
  },
  {
    accessorKey: "actionedBy",
    header: "Actioned by",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.actionedBy}
      </span>
    ),
  },
]

const filterSections: FilterSection[] = [
  {
    id: "eventType",
    title: "Event Type",
    defaultExpanded: true,
    options: [
      { value: "battery-swap", label: "Battery Swap" },
      { value: "checked-in", label: "Checked In" },
      { value: "assigned-to-vehicle", label: "Assigned to Vehicle" },
      { value: "transfer", label: "Transfer" },
      { value: "recovery-action", label: "Recovery Action" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: [
      { value: "Yaba", label: "Yaba" },
      { value: "Ikeja", label: "Ikeja" },
      { value: "Lekki", label: "Lekki" },
      { value: "Surulere", label: "Surulere" },
      { value: "Maintenance Hub", label: "Maintenance Hub" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  eventType: [],
  location: [],
}

export function MovementHistoryTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredData = useMemo(() => {
    let data = mockMovementHistory

    if (filters.eventType.length > 0) {
      data = data.filter((item) => filters.eventType.includes(item.eventType))
    }

    if (filters.location.length > 0) {
      data = data.filter((item) => item.location && filters.location.includes(item.location))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.from.toLowerCase().includes(query) ||
          item.to.toLowerCase().includes(query) ||
          (item.riderVehicleId && item.riderVehicleId.toLowerCase().includes(query)) ||
          item.actionedBy.toLowerCase().includes(query)
      )
    }

    return data
  }, [searchQuery, filters])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const getDateRangeLabel = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
    }
    if (startDate) {
      return `From ${format(startDate, "dd MMM yyyy")}`
    }
    if (endDate) {
      return `Until ${format(endDate, "dd MMM yyyy")}`
    }
    return "Date Range"
  }

  return (
    <>
      {/* Table Container */}
      <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 px-2 py-2">
          {/* Filter Button */}
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
                onFiltersChange={setFilters}
              />
            </PopoverContent>
          </Popover>

          {/* Date Range Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">{getDateRangeLabel()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-sidebar-item-active">
                  Select Date Range
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-breadcrumb-root font-medium">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 h-9 text-sm font-normal"
                        >
                          <span className={startDate ? "text-sidebar-item-active" : "text-breadcrumb-root"}>
                            {startDate ? format(startDate, "dd MMM yyyy") : "Pick date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => endDate ? date > endDate : false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-breadcrumb-root font-medium">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 h-9 text-sm font-normal"
                        >
                          <span className={endDate ? "text-sidebar-item-active" : "text-breadcrumb-root"}>
                            {endDate ? format(endDate, "dd MMM yyyy") : "Pick date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => startDate ? date < startDate : false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-breadcrumb-root"
                    onClick={() => {
                      setStartDate(undefined)
                      setEndDate(undefined)
                    }}
                  >
                    Clear dates
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search swap ID, location, vehicle..."
                className="h-9 w-64"
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
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-y-auto">
          <DataTable
            columns={columns}
            data={paginatedData}
            emptyMessage="No movement history found."
          />
        </div>
      </div>

      {/* Pagination Container */}
      <div className="mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="movements"
        />
      </div>
    </>
  )
}
