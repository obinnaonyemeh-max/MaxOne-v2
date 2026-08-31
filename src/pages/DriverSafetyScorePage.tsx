import { useState, useMemo, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"
import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  DriverDetailSheet,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockDriverRiskRecords,
  riskLevelVariantMap,
  type DriverRiskRecord,
} from "@/data/mockDriverSafety"
import { CITY_FILTER_OPTIONS } from "@/data/cities"

// ── Color constants ──

const COLOR_GREEN = "var(--color-badge-active-text)"
const COLOR_CYAN = "var(--color-status-info)"
const COLOR_BLUE = "var(--color-status-info)"
const COLOR_ORANGE = "var(--color-status-warning)"
const COLOR_RED = "var(--color-badge-inactive-text)"

// ── Summary stats derived from mock data ──

const activeDrivers = mockDriverRiskRecords.length
const driversOnline = mockDriverRiskRecords.filter(
  (d) => d.lastActivity === "30 May 2026"
).length
const avgSafetyScore = Math.round(
  mockDriverRiskRecords.reduce((sum, d) => sum + d.safetyScore, 0) /
    mockDriverRiskRecords.length
)
const pctSafe = Math.round(
  (mockDriverRiskRecords.filter((d) => d.riskLevel === "Low").length /
    mockDriverRiskRecords.length) *
    100
)
const pctAtRisk = Math.round(
  (mockDriverRiskRecords.filter(
    (d) => d.riskLevel === "High" || d.riskLevel === "Critical"
  ).length /
    mockDriverRiskRecords.length) *
    100
)
const totalSafetyEvents = mockDriverRiskRecords.reduce(
  (sum, d) => sum + d.totalSafetyEvents,
  0
)
const highRiskAlerts = mockDriverRiskRecords.filter(
  (d) => d.riskLevel === "High" || d.riskLevel === "Critical"
).length

const summaryStats = [
  { title: "No of Active Drivers", value: String(activeDrivers), indicatorColor: COLOR_GREEN },
  { title: "Drivers Online", value: String(driversOnline), indicatorColor: COLOR_CYAN },
  { title: "Average Safety Score", value: String(avgSafetyScore), indicatorColor: COLOR_BLUE },
  { title: "% Safe", value: `${pctSafe}%`, indicatorColor: COLOR_GREEN },
  { title: "% At-Risk", value: `${pctAtRisk}%`, indicatorColor: COLOR_ORANGE },
  { title: "Total Safety Events", value: String(totalSafetyEvents), indicatorColor: COLOR_RED },
  { title: "High Risk Alerts", value: String(highRiskAlerts), indicatorColor: COLOR_RED },
]

// ── Table columns ──

const columns: ColumnDef<DriverRiskRecord>[] = [
  {
    accessorKey: "championName",
    header: "Champion name / ID",
    cell: ({ row }) => (
      <div>
        <span className="text-table-text-primary font-medium block" style={{ fontSize: "13px" }}>
          {row.original.championName}
        </span>
        <span className="text-gray-400" style={{ fontSize: "12px" }}>
          {row.original.championId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "safetyScore",
    header: "Safety Score",
    cell: ({ row }) => {
      const score = row.original.safetyScore
      const color =
        score >= 80
          ? "text-badge-active-text"
          : score >= 60
            ? "text-status-warning"
            : "text-badge-inactive-text"
      return (
        <span className={`font-medium ${color}`} style={{ fontSize: "13px" }}>
          {score}
        </span>
      )
    },
  },
  {
    accessorKey: "riskLevel",
    header: "Risk Level",
    cell: ({ row }) => (
      <StatusBadge variant={riskLevelVariantMap[row.original.riskLevel]} size="sm">
        {row.original.riskLevel}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "recentIncident",
    header: "Recent Incident",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.recentIncident}
      </span>
    ),
  },
  {
    accessorKey: "totalSafetyEvents",
    header: "Total Safety Events",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.totalSafetyEvents}
      </span>
    ),
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.lastActivity}
      </span>
    ),
  },
]

// ── Filter sections ──

const driverFilterSections: FilterSection[] = [
  {
    id: "locations",
    title: "Location",
    defaultExpanded: true,
    options: CITY_FILTER_OPTIONS,
  },
  {
    id: "riskLevels",
    title: "Risk Level",
    options: [
      { value: "Low", label: "Low", color: "var(--color-badge-active-text)" },
      { value: "Medium", label: "Medium", color: "var(--color-status-warning)" },
      { value: "High", label: "High", color: "var(--color-badge-inactive-text)" },
      { value: "Critical", label: "Critical", color: "var(--color-status-info)" },
    ],
  },
  {
    id: "safetyScoreRange",
    title: "Safety Score",
    options: [
      { value: "0-40", label: "0 – 40" },
      { value: "41-60", label: "41 – 60" },
      { value: "61-80", label: "61 – 80" },
      { value: "81-100", label: "81 – 100" },
    ],
  },
  {
    id: "totalEventsRange",
    title: "Total Events",
    options: [
      { value: "0-5", label: "0 – 5" },
      { value: "6-10", label: "6 – 10" },
      { value: "11-20", label: "11 – 20" },
      { value: "21+", label: "21+" },
    ],
  },
]

// ── Helpers for range filter matching ──

function matchesRange(value: number, range: string): boolean {
  if (range.endsWith("+")) {
    const min = parseInt(range.replace("+", ""), 10)
    return value >= min
  }
  const [minStr, maxStr] = range.split("-")
  return value >= parseInt(minStr, 10) && value <= parseInt(maxStr, 10)
}

// ── Page component ──

export default function DriverSafetyScorePage() {
  const [period, setPeriod] = useState("30")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<GenericFilterState>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)

  const selectedDriver = selectedDriverId
    ? mockDriverRiskRecords.find((r) => r.id === selectedDriverId) ?? null
    : null

  const activeFilterCount = getActiveFilterCount(filters)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredData = useMemo(() => {
    let data = mockDriverRiskRecords.filter((record) => {
      const locations = filters.locations || []
      if (locations.length > 0 && !locations.includes(record.location)) return false

      const riskLevels = filters.riskLevels || []
      if (riskLevels.length > 0 && !riskLevels.includes(record.riskLevel)) return false

      const scoreRanges = filters.safetyScoreRange || []
      if (scoreRanges.length > 0 && !scoreRanges.some((r: string) => matchesRange(record.safetyScore, r)))
        return false

      const eventRanges = filters.totalEventsRange || []
      if (eventRanges.length > 0 && !eventRanges.some((r: string) => matchesRange(record.totalSafetyEvents, r)))
        return false

      return true
    })

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      data = data.filter(
        (record) =>
          record.championName.toLowerCase().includes(q) ||
          record.championId.toLowerCase().includes(q) ||
          record.location.toLowerCase().includes(q) ||
          record.riskLevel.toLowerCase().includes(q) ||
          record.recentIncident.toLowerCase().includes(q)
      )
    }

    return data
  }, [filters, searchQuery])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Drivers Safety Performance" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Drivers Safety Performance"
            subtitle="Monitor and analyze driver safety metrics and scoring"
            className="px-0"
          />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-4 gap-2">
          {summaryStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        {/* Driver Risk View Table */}
        <div className="mt-6 flex flex-col">
          <h3
            className="text-gray-950 mb-3 shrink-0"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Driver Risk View
          </h3>
          <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
                    >
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
                      sections={driverFilterSections}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </PopoverContent>
                </Popover>

                <ExpandableSearch
                  open={searchOpen}
                  onOpenChange={setSearchOpen}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Search drivers..."
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={columns} data={paginatedData} onRowClick={(row) => setSelectedDriverId(row.id)} />
            </div>
          </div>
          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / pageSize)}
              totalItems={filteredData.length}
              pageSize={pageSize}
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              itemLabel="drivers"
            />
          </div>
        </div>
      </div>

      <DriverDetailSheet
        driver={selectedDriver}
        isOpen={selectedDriverId !== null}
        onClose={() => setSelectedDriverId(null)}
      />
    </>
  )
}
