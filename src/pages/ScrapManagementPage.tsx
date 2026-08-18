import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, AlertTriangle } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
  Banner,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { mockScrapRecords, type ScrapRecord } from "@/data/mockScrap"
import { CITY_FILTER_OPTIONS } from "@/data/cities"
import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"

const stageStats = [
  { title: "Scrap In Progress", value: 2, subtitle: "Avg 11d in stage", indicatorColor: "var(--color-status-warning)" },
  { title: "Scrapped", value: 1, subtitle: "Avg 2d in stage", indicatorColor: "var(--color-badge-active-text)" },
  { title: "Scrapped – Pending Write-Off", value: 2, subtitle: "Avg 8d in stage", indicatorColor: "var(--color-status-purple)" },
]

const filterSections: FilterSection[] = [
  {
    id: "stage",
    title: "Stage",
    defaultExpanded: true,
    options: [
      { value: "Assigned for Scrap", label: "Assigned for Scrap" },
      { value: "Scrap In Progress", label: "Scrap In Progress" },
      { value: "Scrapped", label: "Scrapped" },
      { value: "Scrapped – Pending Write-Off", label: "Scrapped – Pending Write-Off" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_FILTER_OPTIONS,
  },
  {
    id: "sla",
    title: "SLA",
    options: [
      { value: "Within SLA", label: "Within SLA" },
      { value: "Breached", label: "Breached" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  stage: [],
  location: [],
  sla: [],
}

const stageVariantMap: Record<string, "warning" | "info" | "success" | "refurb" | "default"> = {
  "Assigned for Scrap": "default",
  "Scrap In Progress": "info",
  "Scrapped": "success",
  "Scrapped – Pending Write-Off": "refurb",
}

const slaVariantMap: Record<string, "danger" | "success"> = {
  "Breached": "danger",
  "Within SLA": "success",
}

const columns: ColumnDef<ScrapRecord>[] = [
  {
    accessorKey: "assetId",
    header: "Asset / ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.assetId}
      </span>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle Model",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.vehicleModel}
      </span>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.manufacturer}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.plateNumber}
      </span>
    ),
  },
  {
    accessorKey: "assessmentId",
    header: "Assessment ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assessmentId}
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
    accessorKey: "scrapStage",
    header: "Scrap Stage",
    cell: ({ row }) => (
      <StatusBadge variant={stageVariantMap[row.original.scrapStage] || "default"}>
        {row.original.scrapStage}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "daysInStage",
    header: "Days in Stage",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.daysInStage}
      </span>
    ),
  },
  {
    accessorKey: "sla",
    header: "",
    cell: ({ row }) => (
      <StatusBadge variant={slaVariantMap[row.original.sla] || "default"} withDot>
        {row.original.sla}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "estScrapValue",
    header: "Est. Scrap Value",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.estScrapValue}
      </span>
    ),
  },
]

export default function ScrapManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [breachFilter, setBreachFilter] = useState(false)
  const navigate = useNavigate()
  const activeFilterCount = getActiveFilterCount(filters)
  const scopedRecords = useCityScopedRecords(mockScrapRecords, "location")
  const scopedStageStats = useMemo(
    () =>
      stageStats.map((stat) => ({
        ...stat,
        value: scopedRecords.filter((r) => r.scrapStage === stat.title).length,
      })),
    [scopedRecords]
  )

  const breachCount = scopedRecords.filter((r) => r.sla === "Breached").length

  const filteredRecords = useMemo(() => {
    let result = scopedRecords

    if (breachFilter) {
      result = result.filter((r) => r.sla === "Breached")
    }

    if (filters.stage?.length) {
      result = result.filter((r) => filters.stage!.includes(r.scrapStage))
    }
    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }
    if (filters.sla?.length) {
      result = result.filter((r) => filters.sla!.includes(r.sla))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.assetId.toLowerCase().includes(q) ||
          r.plateNumber.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery, breachFilter, scopedRecords])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Scrap Management" }]}
      />
      <PageHeader
        title="Scrap Management"
        subtitle="Terminal asset workflow — vehicles in scrap cannot be converted back to operational use"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-4 gap-2 shrink-0">
          <StatCard
            title="Total in Scrap"
            value={scopedRecords.length}
            indicatorColor="var(--color-gray-400)"
          />
          {scopedStageStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBreachFilter(!breachFilter)}
          className="mt-3 shrink-0 w-full text-left transition-opacity hover:opacity-90"
        >
          <Banner
            variant="danger"
            icon={<AlertTriangle className="h-5 w-5 text-status-danger" />}
            title={`${breachCount} Vehicles in SLA Breach`}
            description="Click to filter breached vehicles"
            className={breachFilter ? "border-status-danger" : ""}
          />
        </button>

        <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
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
                    placeholder="Search asset or plate..."
                    className="h-9 w-48"
                    autoFocus
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
                    <span className="sr-only">Close search</span>
                    ×
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable columns={columns} data={filteredRecords} onRowClick={(row) => navigate(`/scrap-management/${row.assetId}`)} />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredRecords.length / pageSize))}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="vehicles"
          />
        </div>
      </div>
    </>
  )
}

export { mockScrapRecords, stageVariantMap }
export type { ScrapRecord }
