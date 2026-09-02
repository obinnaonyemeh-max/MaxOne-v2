import { useMemo, useState } from "react"
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
import { reassignmentReasons } from "@/data/mockAgentPortfolio"
import {
  mockAssignmentHistory,
  assignmentChangeTypes,
  changeTypeVariantMap,
  changedByOptions,
  type AssignmentHistoryRecord,
} from "@/data/mockAssignmentHistory"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  geographyLabel,
  geographyLevelForScope,
  type DriverExperienceGeographyLevel,
} from "@/data/driverExperienceGeography"

function buildFilterSections(
  records: AssignmentHistoryRecord[],
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
      id: "changeType",
      title: "Change Type",
      options: assignmentChangeTypes.map((value) => ({ value, label: value })),
    },
    {
      id: "reason",
      title: "Reason",
      options: reassignmentReasons.map((value) => ({ value, label: value })),
    },
    {
      id: "changedBy",
      title: "Changed By",
      options: changedByOptions.map((value) => ({ value, label: value })),
    },
  ]
}

const defaultFilters: GenericFilterState = {
  city: [],
  subcity: [],
  changeType: [],
  reason: [],
  changedBy: [],
}

function buildColumns(
  geographyLevel: DriverExperienceGeographyLevel
): ColumnDef<AssignmentHistoryRecord>[] {
  const geographyId = geographyLevel === "subcity" ? "subcity" : "city"

  return [
  {
    accessorKey: "champion",
    header: "Champion",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.champion}</p>
        <p className="text-xs text-muted-foreground">{row.original.championId}</p>
      </div>
    ),
  },
  {
    accessorKey: "previousAgent",
    header: "Previous Agent",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.previousAgent}</span>
    ),
  },
  {
    accessorKey: "newAgent",
    header: "New Agent",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.newAgent}</span>
    ),
  },
  {
    accessorKey: geographyId,
    header: geographyLabel(geographyLevel),
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">
        {row.original[geographyId]}
      </span>
    ),
  },
  {
    accessorKey: "changeType",
    header: "Change Type",
    cell: ({ row }) => (
      <StatusBadge variant={changeTypeVariantMap[row.original.changeType]} withDot>
        {row.original.changeType}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.reason}</span>
    ),
  },
  {
    accessorKey: "changedBy",
    header: "Changed By",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.changedBy}</span>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateTime}</span>
    ),
  },
  ]
}

export default function AssignmentHistoryPage() {
  const { dataScope, filterByCity } = useRoleSimulation()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const geographyLevel = geographyLevelForScope(dataScope)
  const geographyFilterId = geographyLevel === "subcity" ? "subcity" : "city"
  const scopedRecords = useMemo(
    () => mockAssignmentHistory.filter((record) => filterByCity(record.city)),
    [filterByCity]
  )
  const filterSections = useMemo(
    () => buildFilterSections(scopedRecords, geographyLevel),
    [geographyLevel, scopedRecords]
  )
  const activeFilters = useMemo<GenericFilterState>(
    () => ({
      [geographyFilterId]: filters[geographyFilterId] ?? [],
      changeType: filters.changeType ?? [],
      reason: filters.reason ?? [],
      changedBy: filters.changedBy ?? [],
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
      if (activeFilters.changeType.length > 0 && !activeFilters.changeType.includes(record.changeType)) return false
      if (activeFilters.reason.length > 0 && !activeFilters.reason.includes(record.reason)) return false
      if (activeFilters.changedBy.length > 0 && !activeFilters.changedBy.includes(record.changedBy)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !record.champion.toLowerCase().includes(q) &&
          !record.championId.toLowerCase().includes(q) &&
          !record.previousAgent.toLowerCase().includes(q) &&
          !record.newAgent.toLowerCase().includes(q) &&
          !record.city.toLowerCase().includes(q) &&
          !record.subcity.toLowerCase().includes(q)
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
          { label: "Assignment History" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Assignment History"
          subtitle="Every champion-to-agent change, who made it and why"
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
                  onFiltersChange={(next) => {
                    setFilters(next)
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search champion or agent..."
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
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="overflow-y-auto">
            <DataTable columns={columns} data={pagedRecords} />
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
            itemLabel="changes"
          />
        </div>
      </div>
    </>
  )
}
