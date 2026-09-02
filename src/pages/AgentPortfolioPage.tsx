import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockAgentPortfolioRecords,
  agentStatusVariantMap,
  type AgentPortfolioRecord,
} from "@/data/mockAgentPortfolio"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  geographyLabel,
  geographyLevelForScope,
  type DriverExperienceGeographyLevel,
} from "@/data/driverExperienceGeography"

const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

function buildFilterSections(
  records: AgentPortfolioRecord[],
  geographyLevel: DriverExperienceGeographyLevel
): FilterSection[] {
  const geographyId = geographyLevel === "subcity" ? "subcity" : "city"
  const geographyOptions = [
    ...new Set(records.map((record) => record[geographyId])),
  ].sort()

  return [
    {
      id: geographyId,
      title: geographyLabel(geographyLevel),
      defaultExpanded: true,
      options: geographyOptions.map((value) => ({ value, label: value })),
    },
    {
      id: "status",
      title: "Status",
      options: [
        { value: "Active", label: "Active", color: COLOR_STATUS_SUCCESS },
        { value: "On Leave", label: "On Leave", color: COLOR_STATUS_WARNING },
        { value: "Inactive", label: "Inactive", color: COLOR_GRAY_500 },
      ],
    },
  ]
}

const defaultFilters: GenericFilterState = {
  city: [],
  subcity: [],
  status: [],
}

function buildColumns(
  geographyLevel: DriverExperienceGeographyLevel
): ColumnDef<AgentPortfolioRecord>[] {
  const geographyId = geographyLevel === "subcity" ? "subcity" : "city"

  return [
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-table-text-primary">
          {row.original.agent.charAt(0)}
        </span>
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.agent}
        </span>
      </div>
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
    accessorKey: "total",
    header: "Total Champions",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.total}
      </span>
    ),
  },
  {
    accessorKey: "active",
    header: "Active Champions",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.active}
      </span>
    ),
  },
  {
    accessorKey: "atRisk",
    header: "At Risk",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.atRisk}
      </span>
    ),
  },
  {
    accessorKey: "delinquent",
    header: "Delinquent",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.delinquent}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={agentStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  ]
}

export default function AgentPortfolioPage() {
  const navigate = useNavigate()
  const { dataScope, filterByCity } = useRoleSimulation()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const geographyLevel = geographyLevelForScope(dataScope)
  const geographyFilterId = geographyLevel === "subcity" ? "subcity" : "city"
  const scopedRecords = useMemo(
    () => mockAgentPortfolioRecords.filter((record) => filterByCity(record.city)),
    [filterByCity]
  )
  const filterSections = useMemo(
    () => buildFilterSections(scopedRecords, geographyLevel),
    [geographyLevel, scopedRecords]
  )
  const activeFilters = useMemo<GenericFilterState>(
    () => ({
      [geographyFilterId]: filters[geographyFilterId] ?? [],
      status: filters.status ?? [],
    }),
    [filters, geographyFilterId]
  )
  const activeFilterCount = getActiveFilterCount(activeFilters)
  const columns = useMemo(() => buildColumns(geographyLevel), [geographyLevel])

  const filteredRecords = useMemo(() =>
    scopedRecords.filter((record) => {
      const selectedGeographies = activeFilters[geographyFilterId]
      if (
        selectedGeographies.length > 0 &&
        !selectedGeographies.includes(record[geographyFilterId])
      ) return false
      if (activeFilters.status.length > 0 && !activeFilters.status.includes(record.status)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !record.agent.toLowerCase().includes(q) &&
          !record.city.toLowerCase().includes(q) &&
          !record.subcity.toLowerCase().includes(q) &&
          !record.department.toLowerCase().includes(q)
        ) return false
      }
      return true
    }),
    [activeFilters, geographyFilterId, scopedRecords, searchQuery]
  )

  const pagedRecords = useMemo(
    () => filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredRecords, currentPage, pageSize]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Agent Management" },
          { label: "Agents Portfolio" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Agents Portfolio"
          subtitle="Manage champion-to-agent allocations and portfolios"
          className="px-0"
        />

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
                  filters={activeFilters}
                  onFiltersChange={(nextFilters) => {
                    setFilters(nextFilters)
                    setCurrentPage(1)
                  }}
                />
              </PopoverContent>
            </Popover>

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agent, city, subcity or department..."
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
              data={pagedRecords}
              onRowClick={(row) => navigate(`/driver-experience/agents/portfolio/${row.id}`)}
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
            itemLabel="agents"
          />
        </div>
      </div>
    </>
  )
}
