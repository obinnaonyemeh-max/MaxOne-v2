import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal, Plus } from "lucide-react"

import {
  TopBar,
  DataTable,
  StatusBadge,
  Pagination,
  PageHeader,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { useCan, useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { ticketsForSimulationMode } from "@/data/driverExperienceAssignmentScope"
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
import {
  geographyLabel,
  geographyLevelForScope,
  type DriverExperienceGeographyLevel,
} from "@/data/driverExperienceGeography"

const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_GRAY_500 = "var(--color-gray-500)"
const COLOR_STATUS_PURPLE = "var(--color-status-purple)"

function buildTicketStats(records: TicketRecord[]) {
  return [
    { title: "Open Tickets", value: records.filter((record) => record.status === "Open").length, indicatorColor: COLOR_STATUS_WARNING },
    { title: "In Progress", value: records.filter((record) => record.status === "In Progress").length, indicatorColor: COLOR_STATUS_INFO },
    { title: "SLA Breached", value: records.filter((record) => record.sla === "Breached").length, indicatorColor: COLOR_STATUS_DANGER },
    { title: "Received Today", value: records.filter((record) => record.dateCreated === "28 May 2026").length, indicatorColor: COLOR_GRAY_500 },
    { title: "Pending Feedback", value: records.filter((record) => record.status === "Pending Feedback").length, indicatorColor: COLOR_STATUS_PURPLE },
    { title: "Closed", value: records.filter((record) => record.status === "Closed").length, indicatorColor: COLOR_STATUS_SUCCESS },
  ]
}

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
  city: [],
  subcity: [],
  status: [],
  priority: [],
  category: [],
  assignee: [],
  sla: [],
}

function buildColumns(
  geographyLevel: DriverExperienceGeographyLevel
): ColumnDef<TicketRecord>[] {
  const geographyId = geographyLevel === "subcity" ? "subcity" : "city"

  return [
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
    accessorKey: geographyId,
    header: geographyLabel(geographyLevel),
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original[geographyId]}
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
}

export default function TicketManagementPage() {
  const navigate = useNavigate()
  const { mode, dataScope } = useRoleSimulation()
  const canCreateTicket = useCan("ticketManagement.create")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const geographyLevel = geographyLevelForScope(dataScope)
  const geographyFilterId = geographyLevel === "subcity" ? "subcity" : "city"
  const scopedTicketRecords = useMemo(
    () => ticketsForSimulationMode(mockTicketRecords, mode),
    [mode]
  )
  const stats = useMemo(
    () => buildTicketStats(scopedTicketRecords),
    [scopedTicketRecords]
  )
  const visibleFilterSections = useMemo(
    () => {
      const geographyOptions = [
        ...new Set(
          scopedTicketRecords.map((record) => record[geographyFilterId])
        ),
      ].sort()
      const operationalSections =
        mode === "call-centre-agent" || mode === "welfare-agent"
          ? filterSections.filter((section) => section.id !== "assignee")
          : filterSections

      return [
        {
          id: geographyFilterId,
          title: geographyLabel(geographyLevel),
          defaultExpanded: true,
          options: geographyOptions.map((value) => ({ value, label: value })),
        },
        ...operationalSections.map((section) => ({
          ...section,
          defaultExpanded: false,
        })),
      ]
    },
    [geographyFilterId, geographyLevel, mode, scopedTicketRecords]
  )
  const activeFilters = useMemo<GenericFilterState>(
    () => Object.fromEntries(
      visibleFilterSections.map((section) => [
        section.id,
        filters[section.id] ?? [],
      ])
    ),
    [filters, visibleFilterSections]
  )
  const activeFilterCount = getActiveFilterCount(activeFilters)
  const columns = useMemo(() => buildColumns(geographyLevel), [geographyLevel])

  const selectedRecord = selectedTicketId
    ? scopedTicketRecords.find((record) => record.id === selectedTicketId)
    : null

  const ticketDetail = selectedRecord
    ? getTicketDetail(selectedRecord.id) ?? buildTicketDetailFromRecord(selectedRecord)
    : null

  const filteredRecords = useMemo(() =>
    scopedTicketRecords.filter((record) => {
      const selectedGeographies = activeFilters[geographyFilterId] ?? []
      if (
        selectedGeographies.length > 0 &&
        !selectedGeographies.includes(record[geographyFilterId])
      ) return false
      if (activeFilters.status?.length > 0 && !activeFilters.status.includes(record.status)) return false
      if (activeFilters.priority?.length > 0 && !activeFilters.priority.includes(record.priority)) return false
      if (activeFilters.category?.length > 0 && !activeFilters.category.includes(record.category)) return false
      if (activeFilters.assignee?.length > 0 && !activeFilters.assignee.includes(record.assignedAgent)) return false
      if (activeFilters.sla?.length > 0 && !activeFilters.sla.includes(record.sla)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !record.ticketId.toLowerCase().includes(q) &&
          !record.affectedChampion.toLowerCase().includes(q) &&
          !record.assignedAgent.toLowerCase().includes(q) &&
          !record.city.toLowerCase().includes(q) &&
          !record.subcity.toLowerCase().includes(q)
        ) return false
      }
      return true
    }),
    [activeFilters, geographyFilterId, scopedTicketRecords, searchQuery]
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
          {canCreateTicket && (
            <div className="py-6">
              <Button
                className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90 pl-3 pr-4"
                onClick={() => navigate("/ticket-management/create")}
              >
                <Plus className="h-4 w-4" />
                Create Ticket
              </Button>
            </div>
          )}
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
                  sections={visibleFilterSections}
                  filters={activeFilters}
                  onFiltersChange={(nextFilters) => {
                    setFilters(nextFilters)
                    setCurrentPage(1)
                  }}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search ticket, champion, or agent..."
              inputClassName="w-56"
            />
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
