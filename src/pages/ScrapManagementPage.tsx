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
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ScrapRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  assessmentId: string
  location: string
  scrapStage: string
  daysInStage: string
  sla: string
  estScrapValue: string
}

const stageStats = [
  { title: "Scrap In Progress", value: 2, subtitle: "Avg 11d in stage", indicatorColor: "var(--color-status-warning)" },
  { title: "Scrapped", value: 1, subtitle: "Avg 2d in stage", indicatorColor: "var(--color-badge-active-text)" },
  { title: "Scrapped – Pending Write-Off", value: 2, subtitle: "Avg 8d in stage", indicatorColor: "#8B5CF6" },
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
    options: [
      { value: "Nairobi", label: "Nairobi" },
      { value: "Mombasa", label: "Mombasa" },
      { value: "Kisumu", label: "Kisumu" },
    ],
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

const mockScrapRecords: ScrapRecord[] = [
  { id: "1", assetId: "SCR-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 101A", assessmentId: "ASM-5501", location: "Nairobi", scrapStage: "Assigned for Scrap", daysInStage: "3d", sla: "Within SLA", estScrapValue: "$420" },
  { id: "2", assetId: "SCR-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 330B", assessmentId: "ASM-5502", location: "Mombasa", scrapStage: "Assigned for Scrap", daysInStage: "9d", sla: "Breached", estScrapValue: "$380" },
  { id: "3", assetId: "SCR-003", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 220C", assessmentId: "ASM-5503", location: "Nairobi", scrapStage: "Scrap In Progress", daysInStage: "6d", sla: "Within SLA", estScrapValue: "$510" },
  { id: "4", assetId: "SCR-004", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 540D", assessmentId: "ASM-5504", location: "Kisumu", scrapStage: "Scrap In Progress", daysInStage: "16d", sla: "Breached", estScrapValue: "$620" },
  { id: "5", assetId: "SCR-005", vehicleModel: "Seal", manufacturer: "BYD", plateNumber: "KCZ 660E", assessmentId: "ASM-5505", location: "Nairobi", scrapStage: "Scrapped", daysInStage: "2d", sla: "Within SLA", estScrapValue: "$350" },
  { id: "6", assetId: "SCR-006", vehicleModel: "EX30", manufacturer: "Volvo", plateNumber: "KDB 880F", assessmentId: "ASM-5506", location: "Mombasa", scrapStage: "Scrapped – Pending Write-Off", daysInStage: "12d", sla: "Breached", estScrapValue: "$290" },
  { id: "7", assetId: "SCR-007", vehicleModel: "Atto 3", manufacturer: "BYD", plateNumber: "KAB 990G", assessmentId: "ASM-5507", location: "Nairobi", scrapStage: "Scrapped – Pending Write-Off", daysInStage: "4d", sla: "Within SLA", estScrapValue: "$440" },
]

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

  const breachCount = mockScrapRecords.filter((r) => r.sla === "Breached").length

  const filteredRecords = useMemo(() => {
    let result = mockScrapRecords

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
  }, [filters, searchQuery, breachFilter])

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
            value={mockScrapRecords.length}
            indicatorColor="var(--color-gray-400)"
          />
          {stageStats.map((stat) => (
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
          className={`mt-3 shrink-0 flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left transition-colors ${
            breachFilter
              ? "border-danger bg-danger/5"
              : "border-danger/30 bg-danger/5 hover:border-danger"
          }`}
        >
          <AlertTriangle className="h-5 w-5 text-danger shrink-0" />
          <div>
            <p className="font-semibold text-sm text-foreground">{breachCount} Vehicles in SLA Breach</p>
            <p className="text-xs text-muted-foreground">Click to filter breached vehicles</p>
          </div>
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
