import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
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
  mockPendingCheckIns,
  pendingCheckInStats,
  type PendingCheckIn,
} from "@/data/mockRecoveries"

const uniqueZones = [...new Set(mockPendingCheckIns.map((c) => c.zone))].sort()

const filterSections: FilterSection[] = [
  {
    id: "zone",
    title: "Zone",
    defaultExpanded: true,
    options: uniqueZones.map((z) => ({ value: z, label: z })),
  },
]

const defaultFilters: GenericFilterState = { zone: [] }

const columns: ColumnDef<PendingCheckIn>[] = [
  {
    accessorKey: "caseId",
    header: "Case",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.caseId}</span>
    ),
  },
  {
    accessorKey: "championName",
    header: "Champion",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src="/images/champvatar.png"
          alt={row.original.championName}
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="font-medium text-table-text-primary text-sm">{row.original.championName}</p>
          <p className="text-xs text-muted-foreground">{row.original.maxId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vehiclePlate",
    header: "Vehicle",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text text-sm">{row.original.vehiclePlate}</p>
        <p className="text-xs text-muted-foreground">{row.original.vehicleType}</p>
      </div>
    ),
  },
  {
    accessorKey: "zone",
    header: "Zone",
    cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.zone}</span>,
  },
  {
    id: "pair",
    header: "Recovery Pair",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.pairCode}</p>
        <p className="text-xs text-muted-foreground">{row.original.officers}</p>
      </div>
    ),
  },
  {
    accessorKey: "recoveredAt",
    header: "Recovered",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.recoveredAt}</span>
    ),
  },
  {
    accessorKey: "checkInDueDate",
    header: "Check-In Due",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.checkInDueDate}</span>
    ),
  },
]

export default function PendingCheckInsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredCheckIns = useMemo(() => {
    setCurrentPage(1)
    const q = searchQuery.trim().toLowerCase()
    return mockPendingCheckIns.filter((record) => {
      if (filters.zone.length > 0 && !filters.zone.includes(record.zone)) return false
      if (
        q &&
        !record.caseId.toLowerCase().includes(q) &&
        !record.championName.toLowerCase().includes(q) &&
        !record.maxId.toLowerCase().includes(q) &&
        !record.vehiclePlate.toLowerCase().includes(q) &&
        !record.pairCode.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [filters, searchQuery])

  const paginatedCheckIns = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCheckIns.slice(start, start + pageSize)
  }, [filteredCheckIns, currentPage, pageSize])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Pending Check-Ins" }]} />
      <PageHeader
        title="Pending Check-Ins"
        subtitle="Vehicles recovered successfully and awaiting a post-recovery check-in"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Pending Check-Ins"
          value={pendingCheckInStats.total.toLocaleString()}
          subtitle="Recovered vehicles awaiting check-in"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Recovery Pairs Involved"
          value={pendingCheckInStats.pairsInvolved.toLocaleString()}
          subtitle="Pairs with an open check-in"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Zones Affected"
          value={pendingCheckInStats.zonesAffected.toLocaleString()}
          subtitle="Zones with pending check-ins"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <div className="px-6 flex flex-col flex-1 min-h-0">
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
                  placeholder="Search by case, champion, MAX ID, plate or pair..."
                  className="h-9 w-72"
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
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={paginatedCheckIns}
              emptyMessage="No pending check-ins found."
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredCheckIns.length / pageSize))}
            totalItems={filteredCheckIns.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="check-ins"
          />
        </div>
      </div>
    </>
  )
}
