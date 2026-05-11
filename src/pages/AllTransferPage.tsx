import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, Download, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  DataTable,
  StatusBadge,
  Pagination,
  StatusTabs,
  type StatusTab,
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
  mockTransferRecords,
  type TransferRecord,
  statusVariantMap,
  flagVariantMap,
} from "@/data/mockTransferRecords"

const COLOR_STATUS_WARNING = "#E88E15"
const COLOR_STATUS_INFO = "#1855FC"
const COLOR_STATUS_DANGER = "#DC2626"
const COLOR_STATUS_SUCCESS = "#16B04F"
const COLOR_GRAY_500 = "#737373"


function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

const worklistCount = mockTransferRecords.filter(
  (r) => r.status === "Transfer In Progress" || r.status === "Transfer — Yet to Commence"
).length

const statusTabs: StatusTab[] = [
  { id: "all", label: "All", count: mockTransferRecords.length },
  { id: "my-worklist", label: "My Worklist", count: worklistCount },
]

const stats = [
  { title: "Open Transfers",       value: 24, indicatorColor: COLOR_GRAY_500       },
  { title: "Transfer in Progress", value: 9,  indicatorColor: COLOR_STATUS_WARNING  },
  { title: "Awaiting Approval",    value: 5,  indicatorColor: COLOR_STATUS_INFO     },
  { title: "SLA Breached",         value: 3,  indicatorColor: COLOR_STATUS_DANGER   },
]

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Transfer In Progress",       label: "Transfer In Progress",       color: COLOR_STATUS_WARNING },
      { value: "Transfer — Yet to Commence", label: "Transfer — Yet to Commence", color: COLOR_STATUS_INFO },
      { value: "Ownership Transferred",      label: "Ownership Transferred",      color: COLOR_STATUS_SUCCESS },
    ],
  },
  {
    id: "flag",
    title: "Flag",
    options: [
      { value: "Awaiting Approval",       label: "Awaiting Approval",       color: COLOR_STATUS_INFO },
      { value: "Returned for Correction", label: "Returned for Correction", color: COLOR_STATUS_DANGER },
      { value: "Approved",               label: "Approved",                color: COLOR_STATUS_SUCCESS },
    ],
  },
  {
    id: "breachStatus",
    title: "Breach Status",
    options: [
      { value: "Within SLA", label: "Within SLA", color: COLOR_STATUS_SUCCESS },
      { value: "Breached",   label: "Breached",   color: COLOR_STATUS_DANGER  },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
  flag: [],
  breachStatus: [],
}

const columns: ColumnDef<TransferRecord>[] = [
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted shrink-0">
          <img src={getVehicleIcon(row.original.assetType)} alt={row.original.assetType} className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.vehicleId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "champion",
    header: "Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.champion}
      </span>
    ),
  },
  {
    accessorKey: "hpCompletedDate",
    header: "HP Completed Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.hpCompletedDate}
      </span>
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
    accessorKey: "flag",
    header: "Flags",
    cell: ({ row }) => {
      const flag = row.original.flag
      if (!flag) {
        return <span className="text-table-text" style={{ fontSize: "14px" }}>—</span>
      }
      return (
        <StatusBadge variant={flagVariantMap[flag]} withDot>
          {flag}
        </StatusBadge>
      )
    },
  },
  {
    accessorKey: "days",
    header: "Days",
    cell: ({ row }) => (
      <span
        className="font-medium"
        style={{ fontSize: "14px", color: row.original.breached ? COLOR_STATUS_DANGER : COLOR_GRAY_500 }}
      >
        {row.original.days}
      </span>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.sla}
      </span>
    ),
  },
  {
    accessorKey: "breached",
    header: "Breach Status",
    cell: ({ row }) => (
      <StatusBadge variant={row.original.breached ? "danger" : "success"} withDot>
        {row.original.breached ? "Breached" : "Within SLA"}
      </StatusBadge>
    ),
  },
]

export default function AllTransferPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredRecords = useMemo(() =>
    mockTransferRecords.filter((record) => {
      if (activeTab === "my-worklist" &&
        record.status !== "Transfer In Progress" &&
        record.status !== "Transfer — Yet to Commence") return false
      if (filters.status.length > 0 && !filters.status.includes(record.status)) return false
      if (filters.flag.length > 0 && (record.flag === null || !filters.flag.includes(record.flag))) return false
      if (filters.breachStatus.length > 0) {
        const recordBreachStatus = record.breached ? "Breached" : "Within SLA"
        if (!filters.breachStatus.includes(recordBreachStatus)) return false
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!record.vehicleId.toLowerCase().includes(q) && !record.champion.toLowerCase().includes(q)) return false
      }
      return true
    }),
    [activeTab, filters, searchQuery]
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Transfer" }, { label: "All Transfer" }]} />

      <div className="flex items-start justify-between px-6 pt-6 pb-2 shrink-0">
        <div>
          <h1 className="text-foreground font-semibold" style={{ fontSize: "22px" }}>
            Ownership Transfer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "14px" }}>
            All open vehicle ownership transfers
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <div className="grid grid-cols-4 gap-2">
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
                  placeholder="Search vehicle or champion..."
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

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredRecords}
              onRowClick={(row) => navigate(`/transfer/all/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRecords.length / pageSize)}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="transfers"
          />
        </div>
      </div>
    </>
  )
}
