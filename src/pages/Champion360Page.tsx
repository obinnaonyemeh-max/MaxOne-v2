import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal, ArrowLeftRight } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
  Banner,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTransferApprovals, useTimeOffApprovals } from "@/data/approvalStore"
import { useChampions } from "@/data/championStore"
import type { Champion } from "@/data/mockChampions"
import { championsForSimulationMode } from "@/data/driverExperienceAssignmentScope"
import {
  geographyLabel,
  geographyLevelForScope,
  type DriverExperienceGeographyLevel,
} from "@/data/driverExperienceGeography"

function buildChampionStats(champions: Champion[], totalSubtitle: string) {
  const total = champions.length
  const active = champions.filter((champion) => {
    const lastActive = new Date(champion.lastActiveDate)
    const sevenDaysAgo = new Date("2026-05-24")
    return lastActive > sevenDaysAgo
  }).length
  const inactive = total - active
  const percent = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100)

  return [
    {
      title: "Total Champions",
      value: total,
      subtitle: totalSubtitle,
      trend: { value: 2.5, direction: "up" as const },
      indicatorColor: "var(--color-brand-primary)",
    },
    {
      title: "Active Champions",
      value: active,
      subtitle: `${percent(active)}% of champions`,
      trend: { value: 4.2, direction: "up" as const },
      indicatorColor: "var(--color-status-success)",
    },
    {
      title: "Inactive Champions",
      value: inactive,
      subtitle: `${percent(inactive)}% of champions`,
      trend: { value: 1.8, direction: "down" as const },
      indicatorColor: "var(--color-status-danger)",
    },
  ]
}

function buildFilterSections(
  champions: Champion[],
  geographyLevel: DriverExperienceGeographyLevel
): FilterSection[] {
  const usesSubcity = geographyLevel === "subcity"
  const id = usesSubcity ? "subcity" : "city"
  const values = [
    ...new Set(
      champions.map((champion) =>
        usesSubcity ? champion.subcity : champion.city
      )
    ),
  ].sort()

  return [
    {
      id,
      title: geographyLabel(geographyLevel),
      defaultExpanded: true,
      options: values.map((value) => ({ value, label: value })),
    },
  ]
}

const defaultFilters: GenericFilterState = {
  city: [],
  subcity: [],
}

function buildColumns(
  geographyLevel: DriverExperienceGeographyLevel
): ColumnDef<Champion>[] {
  const usesSubcity = geographyLevel === "subcity"

  return [
    {
      accessorKey: "name",
      header: "Champion",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatarUrl}
            alt={row.original.name}
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.championId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.contactNumber}</span>
      ),
    },
    {
      accessorKey: usesSubcity ? "subcity" : "city",
      header: geographyLabel(geographyLevel),
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">
          {usesSubcity ? row.original.subcity : row.original.city}
        </span>
      ),
    },
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.plateNumber}</span>
      ),
    },
    {
      accessorKey: "lastActiveDate",
      header: "Last Active Date",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.lastActiveDate}</span>
      ),
    },
  ]
}

export default function Champion360Page() {
  const navigate = useNavigate()
  const { isFullBuild, mode, dataScope, filterByCity } = useRoleSimulation()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const champions = useChampions()
  const transfers = useTransferApprovals()
  const timeOffs = useTimeOffApprovals()
  const pendingApprovalCount = useMemo(
    () =>
      transfers.filter((record) => record.status === "Pending" && filterByCity(record.city)).length +
      timeOffs.filter((record) => record.status === "Pending" && filterByCity(record.city)).length,
    [filterByCity, timeOffs, transfers]
  )
  const geographyLevel = geographyLevelForScope(dataScope)
  const geographyFilterId = geographyLevel === "subcity" ? "subcity" : "city"
  const activeFilters = useMemo<GenericFilterState>(
    () => ({ [geographyFilterId]: filters[geographyFilterId] ?? [] }),
    [filters, geographyFilterId]
  )
  const activeFilterCount = getActiveFilterCount(activeFilters)
  const scopedChampions = useMemo(
    () => championsForSimulationMode(champions, mode),
    [champions, mode]
  )
  const championStats = useMemo(
    () => buildChampionStats(
      scopedChampions,
      mode === "welfare-agent"
        ? `Assigned to you in ${
            dataScope?.type === "city" || dataScope?.type === "subCity"
              ? dataScope.city
              : "your city"
          }`
        : dataScope?.type === "city"
          ? `Across ${dataScope.city}`
          : "Across all cities"
    ),
    [dataScope, mode, scopedChampions]
  )
  const filterSections = useMemo(
    () => buildFilterSections(scopedChampions, geographyLevel),
    [geographyLevel, scopedChampions]
  )
  const columns = useMemo(() => buildColumns(geographyLevel), [geographyLevel])
  const handleFiltersChange = (nextFilters: GenericFilterState) => {
    setFilters(nextFilters)
    setCurrentPage(1)
  }
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const filteredChampions = useMemo(() => {
    return scopedChampions.filter((champion) => {
      const selectedGeographies = activeFilters[geographyFilterId]
      const championGeography =
        geographyLevel === "subcity" ? champion.subcity : champion.city
      if (
        selectedGeographies.length > 0 &&
        !selectedGeographies.includes(championGeography)
      ) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !champion.name.toLowerCase().includes(q) &&
          !champion.championId.toLowerCase().includes(q) &&
          !champion.contactNumber.includes(q) &&
          !champion.plateNumber.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [activeFilters, geographyFilterId, geographyLevel, scopedChampions, searchQuery])

  const paginatedChampions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredChampions.slice(start, start + pageSize)
  }, [filteredChampions, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Champion Overview" },
        ]}
      />
      <PageHeader
        title="Champion Overview"
        subtitle="Comprehensive view of driver champion profiles and performance"
        className="shrink-0"
      />

      {(isFullBuild || mode === "welfare-manager") && (
        <div className="px-6 mb-4">
          <Banner
            variant="info"
            icon={<ArrowLeftRight className="h-5 w-5 text-status-info" />}
            title={`${pendingApprovalCount} pending approval(s) require your attention`}
            description="Review and process pending ownership transfers and time-off requests."
            action={
              <Button size="sm" onClick={() => navigate("/driver-experience/approvals")}>
                View Approvals
              </Button>
            }
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-6 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 shrink-0 mb-4">
        {championStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            trend={stat.trend}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="px-6 flex flex-col">
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
                  onFiltersChange={handleFiltersChange}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={handleSearchQueryChange}
              placeholder="Search name, ID, phone, or plate..."
              inputClassName="w-56"
            />
          </div>

          <div>
            <DataTable
              columns={columns}
              data={paginatedChampions}
              onRowClick={(row) => navigate(`/champion-360/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredChampions.length / pageSize))}
            totalItems={filteredChampions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize)
              setCurrentPage(1)
            }}
            itemLabel="champions"
          />
        </div>
      </div>
      </div>
    </>
  )
}
