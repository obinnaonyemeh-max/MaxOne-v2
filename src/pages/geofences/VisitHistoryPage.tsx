import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, CalendarDays } from "lucide-react"
import { format, parse } from "date-fns"
import type { DateRange } from "react-day-picker"

import {
  TopBar,
  BackButton,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  mockVisitRecords,
  visitSummary,
  visitTypeVariantMap,
  visitStatusVariantMap,
  type VisitRecord,
} from "@/data/mockVisitHistory"

const COLOR_INFO = "var(--color-status-info)"
const COLOR_SUCCESS = "var(--color-success)"
const COLOR_WARNING = "var(--color-warning)"
const COLOR_DANGER = "var(--color-danger)"

const stats = [
  { title: "Geofence Visits", value: visitSummary.geofenceVisits.toLocaleString(), indicatorColor: COLOR_INFO },
  { title: "Avg. Duration — Swap Station", value: visitSummary.avgSwapStationDuration, indicatorColor: COLOR_SUCCESS },
  { title: "Avg. Duration — Office Area", value: visitSummary.avgOfficeDuration, indicatorColor: COLOR_WARNING },
  { title: "Total Alerts Detected", value: visitSummary.totalAlerts.toLocaleString(), indicatorColor: COLOR_DANGER },
]

const filterSections: FilterSection[] = [
  {
    id: "type",
    title: "Type",
    defaultExpanded: true,
    options: [
      { value: "City", label: "City", color: COLOR_INFO },
      { value: "Office", label: "Office", color: COLOR_WARNING },
      { value: "Swap Station", label: "Swap Station", color: COLOR_SUCCESS },
    ],
  },
  {
    id: "status",
    title: "Status",
    options: [
      { value: "Active", label: "Active", color: COLOR_SUCCESS },
      { value: "Ended", label: "Ended", color: "var(--color-gray-500)" },
      { value: "Inside Zone", label: "Inside Zone", color: COLOR_INFO },
      { value: "Out of Zone", label: "Out of Zone", color: COLOR_DANGER },
    ],
  },
]

const defaultFilters: GenericFilterState = { type: [], status: [] }

const columns: ColumnDef<VisitRecord>[] = [
  {
    accessorKey: "officerName",
    header: "Officer Name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.officerName}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge variant={visitTypeVariantMap[row.original.type]} withDot>
        {row.original.type}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.startTime}
      </span>
    ),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.endTime}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration of Visit",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.duration}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={visitStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "alerts",
    header: "Alerts",
    cell: ({ row }) => (
      <span
        className="font-medium"
        style={{ fontSize: "14px", color: row.original.alerts > 0 ? COLOR_DANGER : "var(--color-gray-500)" }}
      >
        {row.original.alerts}
      </span>
    ),
  },
]

export default function VisitHistoryPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const activeFilterCount = getActiveFilterCount(filters)

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range"
    if (!dateRange.to) return format(dateRange.from, "dd MMM yyyy")
    return `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
  }

  const filteredRecords = useMemo(
    () =>
      mockVisitRecords.filter((record) => {
        if (filters.type.length > 0 && !filters.type.includes(record.type)) return false
        if (filters.status.length > 0 && !filters.status.includes(record.status)) return false
        if (searchQuery && !record.officerName.toLowerCase().includes(searchQuery.toLowerCase()))
          return false
        if (dateRange?.from || dateRange?.to) {
          const recordDate = parse(record.startTime.split(",")[0].trim(), "dd MMM yyyy", new Date())
          if (dateRange.from && recordDate < dateRange.from) return false
          if (dateRange.to && recordDate > dateRange.to) return false
        }
        return true
      }),
    [filters, searchQuery, dateRange]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const pagedRecords = useMemo(
    () => filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredRecords, currentPage, pageSize]
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Falcon" }, { label: "Geofencing" }, { label: "Visit History" }]} />

      <div className="px-6 py-6 shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate(-1)} />
          <h1
            className="flex items-end gap-1 font-semibold text-sidebar-item-active"
            style={{ fontSize: "22px" }}
          >
            Visit History
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
        </div>
        <p className="mt-1 text-sm font-medium text-breadcrumb-root">
          Geofence visit activity, durations and alerts.
        </p>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} indicatorColor={stat.indicatorColor} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
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
                <GenericFilterPopover
                  sections={filterSections}
                  filters={filters}
                  onFiltersChange={(next) => {
                    setFilters(next)
                    setCurrentPage(1)
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Date Range — dual-month range calendar, matching Fleet Register */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range)
                    setCurrentPage(1)
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search officer…"
                  className="h-9 w-56"
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
            <DataTable columns={columns} data={pagedRecords} />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            itemLabel="visits"
          />
        </div>
      </div>
    </>
  )
}
