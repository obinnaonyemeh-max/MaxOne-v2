import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

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
import {
  mockTamperAlerts,
  tamperStatusVariantMap,
  tamperUnresolvedCount,
  tamperResolvedCount,
  type TamperAlert,
} from "@/data/mockTamperAlerts"

const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"

const filterSections: FilterSection[] = [
  {
    id: "type",
    title: "Type",
    defaultExpanded: true,
    options: [
      { value: "Missed heartbeat",      label: "Missed heartbeat",      color: COLOR_STATUS_WARNING },
      { value: "External voltage loss", label: "External voltage loss", color: COLOR_STATUS_DANGER },
      { value: "Internal voltage loss", label: "Internal voltage loss", color: COLOR_STATUS_DANGER },
      { value: "Locked & moving",       label: "Locked & moving",       color: COLOR_STATUS_DANGER },
    ],
  },
  {
    id: "checkStatus",
    title: "Check Status",
    options: [
      { value: "Checked In",  label: "Checked In",  color: COLOR_STATUS_SUCCESS },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  type: [],
  checkStatus: [],
}

const columns: ColumnDef<TamperAlert>[] = [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted shrink-0">
          <img src="/images/2_wheeler_ev.svg" alt="2 Wheeler EV" className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>2 Wheeler</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.plateNumber}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={tamperStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "assignedTechnician",
    header: "Assigned Technician",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedTechnician}
      </span>
    ),
  },
  {
    accessorKey: "assignedRecoveryPair",
    header: "Assigned Recovery Pair",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedRecoveryPair}
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
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.dateTime}
      </span>
    ),
  },
]

const statusTabs: StatusTab[] = [
  { id: "unresolved", label: "Unresolved", count: tamperUnresolvedCount },
  { id: "resolved", label: "Resolved", count: tamperResolvedCount },
]

export default function TamperAlertsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("unresolved")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredAlerts = useMemo(() =>
    mockTamperAlerts.filter((alert) => {
      const isResolved = alert.status === "Resolved"
      if (activeTab === "unresolved" && isResolved) return false
      if (activeTab === "resolved" && !isResolved) return false
      if (filters.type.length > 0 && !filters.type.includes(alert.type)) return false
      if (filters.checkStatus.length > 0 && !filters.checkStatus.includes(alert.checkStatus)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !alert.plateNumber.toLowerCase().includes(q) &&
          !alert.assignedTechnician.toLowerCase().includes(q) &&
          !alert.location.toLowerCase().includes(q)
        ) return false
      }
      return true
    }),
    [activeTab, filters, searchQuery]
  )

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize))
  const pagedAlerts = useMemo(
    () => filteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredAlerts, currentPage, pageSize]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Alerts" },
          { label: "Tamper Alerts" },
        ]}
      />

      <PageHeader
        title="Tamper Alerts"
        subtitle="Monitor and resolve device tamper events across the fleet."
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

      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4">
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

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              placeholder="Search plate, technician or location..."
              inputClassName="w-64"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={pagedAlerts}
              onRowClick={(row) => navigate(`/falcon/alerts/tamper/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
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
    </>
  )
}
