import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, Plus } from "lucide-react"

import {
  TopBar,
  DataTable,
  StatusBadge,
  Pagination,
  PageHeader,
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
import {
  mockTicketRecords,
  type TicketRecord,
  statusVariantMap,
  priorityVariantMap,
  slaVariantMap,
} from "@/data/mockTicketRecords"
import { TicketDetailSheet } from "@/components/max/TicketDetailSheet"
import { getTicketDetail, buildTicketDetailFromRecord } from "@/data/mockTicketDetail"

const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_GRAY_500 = "var(--color-gray-500)"
const COLOR_STATUS_PURPLE = "var(--color-status-purple)"

const stats = [
  { title: "Open Tickets",      value: mockTicketRecords.filter((r) => r.status === "Open").length,             indicatorColor: COLOR_STATUS_WARNING },
  { title: "In Progress",       value: mockTicketRecords.filter((r) => r.status === "In Progress").length,      indicatorColor: COLOR_STATUS_INFO },
  { title: "SLA Breached",      value: mockTicketRecords.filter((r) => r.sla === "Breached").length,            indicatorColor: COLOR_STATUS_DANGER },
  { title: "Received Today",    value: mockTicketRecords.filter((r) => r.dateCreated === "28 May 2026").length, indicatorColor: COLOR_GRAY_500 },
  { title: "Pending Feedback",  value: mockTicketRecords.filter((r) => r.status === "Pending Feedback").length, indicatorColor: COLOR_STATUS_PURPLE },
  { title: "Closed",            value: mockTicketRecords.filter((r) => r.status === "Closed").length,           indicatorColor: COLOR_STATUS_SUCCESS },
]

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Open",             label: "Open",             color: COLOR_STATUS_WARNING },
      { value: "In Progress",      label: "In Progress",      color: COLOR_STATUS_INFO },
      { value: "Pending Feedback", label: "Pending Feedback",  color: COLOR_STATUS_PURPLE },
      { value: "Closed",           label: "Closed",           color: COLOR_STATUS_SUCCESS },
    ],
  },
  {
    id: "priority",
    title: "Priority",
    options: [
      { value: "High",   label: "High",   color: COLOR_STATUS_DANGER },
      { value: "Medium", label: "Medium", color: COLOR_STATUS_WARNING },
      { value: "Low",    label: "Low",    color: COLOR_GRAY_500 },
    ],
  },
  {
    id: "category",
    title: "Category",
    options: [
      { value: "Vehicle Breakdown", label: "Vehicle Breakdown" },
      { value: "Payment Dispute",   label: "Payment Dispute" },
      { value: "App Issue",         label: "App Issue" },
      { value: "Insurance Claim",   label: "Insurance Claim" },
      { value: "Accident Report",   label: "Accident Report" },
    ],
  },
  {
    id: "assignee",
    title: "Assignee",
    options: [
      { value: "Fatima Bello",  label: "Fatima Bello" },
      { value: "Chidi Okafor",  label: "Chidi Okafor" },
      { value: "Ngozi Eze",     label: "Ngozi Eze" },
      { value: "Tunde Bakare",  label: "Tunde Bakare" },
    ],
  },
  {
    id: "sla",
    title: "SLA",
    options: [
      { value: "Within SLA", label: "Within SLA", color: COLOR_STATUS_SUCCESS },
      { value: "At Risk",    label: "At Risk",    color: COLOR_STATUS_WARNING },
      { value: "Breached",   label: "Breached",   color: COLOR_STATUS_DANGER },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
  priority: [],
  category: [],
  assignee: [],
  sla: [],
}

const columns: ColumnDef<TicketRecord>[] = [
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.ticketId}
      </span>
    ),
  },
  {
    accessorKey: "affectedChampion",
    header: "Affected Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.affectedChampion}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.category}
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
    accessorKey: "assignedAgent",
    header: "Assigned Agent",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedAgent}
      </span>
    ),
  },
  {
    accessorKey: "ticketCreator",
    header: "Ticket Creator",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.ticketCreator}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <StatusBadge variant={priorityVariantMap[row.original.priority]} withDot>
        {row.original.priority}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <StatusBadge variant={slaVariantMap[row.original.sla]} withDot>
        {row.original.sla}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.dateCreated}
      </span>
    ),
  },
]

export default function TicketManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const selectedRecord = selectedTicketId
    ? mockTicketRecords.find((r) => r.id === selectedTicketId)
    : null

  const ticketDetail = selectedRecord
    ? getTicketDetail(selectedRecord.id) ?? buildTicketDetailFromRecord(selectedRecord)
    : null

  const filteredRecords = useMemo(() =>
    mockTicketRecords.filter((record) => {
      if (filters.status.length > 0 && !filters.status.includes(record.status)) return false
      if (filters.priority.length > 0 && !filters.priority.includes(record.priority)) return false
      if (filters.category.length > 0 && !filters.category.includes(record.category)) return false
      if (filters.assignee.length > 0 && !filters.assignee.includes(record.assignedAgent)) return false
      if (filters.sla.length > 0 && !filters.sla.includes(record.sla)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !record.ticketId.toLowerCase().includes(q) &&
          !record.affectedChampion.toLowerCase().includes(q) &&
          !record.assignedAgent.toLowerCase().includes(q)
        ) return false
      }
      return true
    }),
    [filters, searchQuery]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Ticket Management" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="flex items-start justify-between">
          <PageHeader
            title="Ticket Management"
            subtitle="Track and manage driver support tickets and issue resolution"
            className="px-0"
          />
          <div className="py-6">
            <Button
              className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90 pl-3 pr-4"
              onClick={() => navigate("/ticket-management/create")}
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </div>
        </div>

        <div className="pb-4">
          <div className="grid grid-cols-6 gap-2">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                indicatorColor={stat.indicatorColor}
              />
            ))}
          </div>
        </div>

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
                  placeholder="Search ticket, champion, or agent..."
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

          <div className="overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredRecords}
              onRowClick={(row) => setSelectedTicketId(row.id)}
            />
          </div>
        </div>

        <div className="mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRecords.length / pageSize)}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="tickets"
          />
        </div>
      </div>

      <TicketDetailSheet
        isOpen={!!ticketDetail}
        ticket={ticketDetail}
        onClose={() => setSelectedTicketId(null)}
      />
    </>
  )
}
