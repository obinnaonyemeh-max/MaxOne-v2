import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal, CalendarDays } from "lucide-react"
import { format } from "date-fns"

import {
  DataTable,
  StatusBadge,
  Pagination,
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
import { Calendar } from "@/components/ui/calendar"
import {
  mockAlertHistory,
  alertStatusVariantMap,
  alertStatusLabels,
  getAlertDetail,
  type AlertHistoryItem,
  type AlertStatus,
  type AlertDetail,
} from "@/data/mockBatteryRegisterData"
import { AlertDetailSheet } from "./AlertDetailSheet"

const columns: ColumnDef<AlertHistoryItem>[] = [
  {
    accessorKey: "id",
    header: "Alert ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "alertType",
    header: "Alert Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.alertType}
      </span>
    ),
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.severity}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Alert Status",
    cell: ({ row }) => {
      const status = row.original.status as AlertStatus
      return (
        <StatusBadge variant={alertStatusVariantMap[status]}>
          {alertStatusLabels[status]}
        </StatusBadge>
      )
    },
  },
  {
    accessorKey: "triggeredOn",
    header: "Triggered on",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.triggeredOn}
      </span>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned to",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedTo}
      </span>
    ),
  },
  {
    accessorKey: "resolutionStatus",
    header: "Resolution Status",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.resolutionStatus}
      </span>
    ),
  },
]

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Alert Status",
    defaultExpanded: true,
    options: [
      { value: "triggered", label: "Triggered", color: "var(--color-status-danger)" },
      { value: "acknowledged", label: "Acknowledged", color: "var(--color-status-warning)" },
      { value: "in-progress", label: "In Progress", color: "var(--color-status-info)" },
      { value: "resolved", label: "Resolved", color: "var(--color-success)" },
    ],
  },
  {
    id: "severity",
    title: "Severity",
    options: [
      { value: "Level 1", label: "Level 1" },
      { value: "Level 2", label: "Level 2" },
      { value: "Level 3", label: "Level 3" },
      { value: "Level 4", label: "Level 4" },
    ],
  },
  {
    id: "alertType",
    title: "Alert Type",
    options: [
      { value: "Over Temperature Protection", label: "Over Temperature" },
      { value: "Battery Degradation Threshold", label: "Battery Degradation" },
      { value: "Offline Detection", label: "Offline Detection" },
      { value: "Voltage Undervoltage Protection", label: "Undervoltage" },
      { value: "Cell Imbalance Detected", label: "Cell Imbalance" },
      { value: "SOH Below Threshold", label: "SOH Below Threshold" },
      { value: "Communication Loss", label: "Communication Loss" },
      { value: "Overcurrent Protection", label: "Overcurrent" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
  severity: [],
  alertType: [],
}

export function AlertHistoryTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null)

  const handleRowClick = (row: AlertHistoryItem) => {
    const alertDetail = getAlertDetail(row.id)
    if (alertDetail) {
      setSelectedAlert(alertDetail)
      setSelectedAlertId(row.id)
    }
  }

  const handleCloseSheet = () => {
    setSelectedAlertId(null)
    setSelectedAlert(null)
  }

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredData = useMemo(() => {
    let data = mockAlertHistory

    // Apply status filter
    if (filters.status.length > 0) {
      data = data.filter((item) => filters.status.includes(item.status))
    }

    // Apply severity filter
    if (filters.severity.length > 0) {
      data = data.filter((item) => filters.severity.includes(item.severity))
    }

    // Apply alert type filter
    if (filters.alertType.length > 0) {
      data = data.filter((item) => filters.alertType.includes(item.alertType))
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.alertType.toLowerCase().includes(query) ||
          item.assignedTo.toLowerCase().includes(query)
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
          <ExpandableSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            placeholder="Search alert ID, type, or assignee..."
            inputClassName="w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-y-auto">
          <DataTable
            columns={columns}
            data={paginatedData}
            emptyMessage="No alerts found."
            onRowClick={handleRowClick}
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
          itemLabel="alerts"
        />
      </div>

      {/* Alert Detail Sheet */}
      <AlertDetailSheet
        alert={selectedAlert}
        isOpen={!!selectedAlertId}
        onClose={handleCloseSheet}
      />
    </>
  )
}
