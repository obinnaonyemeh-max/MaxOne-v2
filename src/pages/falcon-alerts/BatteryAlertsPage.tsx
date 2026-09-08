import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { CalendarDays, SlidersHorizontal } from "lucide-react"
import { endOfDay, format, isValid, parse, startOfDay } from "date-fns"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  StatusTabs,
  type StatusTab,
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
  batteryAlertsUnresolvedCount,
  batteryAlertsResolvedCount,
  type AlertHistoryItem,
  type AlertStatus,
  type AlertDetail,
} from "@/data/mockBatteryRegisterData"
import { AlertDetailSheet } from "@/pages/battery-register/AlertDetailSheet"

const columns: ColumnDef<AlertHistoryItem>[] = [
  {
    accessorKey: "batteryId",
    header: "Battery ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.batteryId}
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

const statusTabs: StatusTab[] = [
  { id: "unresolved", label: "Unresolved", count: batteryAlertsUnresolvedCount },
  { id: "resolved", label: "Resolved", count: batteryAlertsResolvedCount },
]

function parseTriggeredOn(value: string): Date | null {
  const parsed = parse(value.replace(/ WAT$/, ""), "dd MMM yyyy, HH:mm:ss", new Date())
  return isValid(parsed) ? parsed : null
}

export default function BatteryAlertsPage() {
  const [activeTab, setActiveTab] = useState("unresolved")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null)
  const [historyVersion, setHistoryVersion] = useState(0)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredAlerts = useMemo(
    () =>
      mockAlertHistory.filter((alert) => {
        const isResolved = alert.status === "resolved"
        if (activeTab === "unresolved" && isResolved) return false
        if (activeTab === "resolved" && !isResolved) return false
        if (filters.status.length > 0 && !filters.status.includes(alert.status)) return false
        if (filters.severity.length > 0 && !filters.severity.includes(alert.severity)) return false
        if (filters.alertType.length > 0 && !filters.alertType.includes(alert.alertType)) return false

        const triggeredAt = parseTriggeredOn(alert.triggeredOn)
        if (startDate && triggeredAt && triggeredAt < startOfDay(startDate)) return false
        if (endDate && triggeredAt && triggeredAt > endOfDay(endDate)) return false

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          if (
            !alert.batteryId.toLowerCase().includes(query) &&
            !alert.alertType.toLowerCase().includes(query) &&
            !alert.assignedTo.toLowerCase().includes(query)
          ) {
            return false
          }
        }

        return true
      }),
    [activeTab, endDate, filters, historyVersion, searchQuery, startDate]
  )

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize))
  const pagedAlerts = useMemo(
    () => filteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredAlerts, currentPage, pageSize]
  )

  const dateRangeLabel = (() => {
    if (startDate && endDate) {
      return `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
    }
    if (startDate) return `From ${format(startDate, "dd MMM yyyy")}`
    if (endDate) return `Until ${format(endDate, "dd MMM yyyy")}`
    return "Date Range"
  })()

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Alerts" },
          { label: "Battery Alerts" },
        ]}
      />

      <PageHeader
        title="Battery Alerts"
        subtitle="Monitor and resolve battery protection events across the fleet."
        className="shrink-0"
      />

      <div className="shrink-0">
        <StatusTabs
          tabs={statusTabs}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <div className="flex min-h-0 flex-1 flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex shrink-0 items-center gap-2 px-2 py-2">
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">{dateRangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-sidebar-item-active">
                    Select Date Range
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-breadcrumb-root">
                        Start Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-9 w-full justify-start gap-2 text-sm font-normal"
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
                            onSelect={(date) => {
                              setStartDate(date)
                              setCurrentPage(1)
                            }}
                            disabled={(date) => (endDate ? date > endDate : false)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-breadcrumb-root">
                        End Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-9 w-full justify-start gap-2 text-sm font-normal"
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
                            onSelect={(date) => {
                              setEndDate(date)
                              setCurrentPage(1)
                            }}
                            disabled={(date) => (startDate ? date < startDate : false)}
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
                        setCurrentPage(1)
                      }}
                    >
                      Clear dates
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              placeholder="Search battery ID, type, or assignee..."
              inputClassName="w-64"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={pagedAlerts}
              emptyMessage="No alerts found."
              onRowClick={(row) => {
                const alertDetail = getAlertDetail(row.id)
                if (!alertDetail) return
                setSelectedAlert(alertDetail)
                setSelectedAlertId(row.id)
              }}
            />
          </div>
        </div>

        <div className="mt-1 mb-6 shrink-0 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAlerts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            itemLabel="alerts"
          />
        </div>
      </div>

      <AlertDetailSheet
        alert={selectedAlert}
        isOpen={!!selectedAlertId}
        onClose={() => {
          setSelectedAlertId(null)
          setSelectedAlert(null)
        }}
        onResolved={(updated) => {
          setSelectedAlert(updated)
          setHistoryVersion((version) => version + 1)
        }}
      />
    </>
  )
}
