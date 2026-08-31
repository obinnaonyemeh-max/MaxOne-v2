import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  StatusBadge,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  PendingRecoveryDetailSheet,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockPendingRecoveries,
  assignmentStatusVariantMap,
  type PendingRecovery,
  type AssignmentStatus,
} from "@/data/mockRecoveries"
import { mockRecoveryPairs } from "@/data/mockRecoveryOfficers"

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const uniqueZones = [...new Set(mockPendingRecoveries.map((r) => r.zone))].sort()
const assignmentStatusOptions: AssignmentStatus[] = ["Unassigned", "Assigned"]

const filterSections: FilterSection[] = [
  {
    id: "zone",
    title: "Zone",
    defaultExpanded: true,
    options: uniqueZones.map((z) => ({ value: z, label: z })),
  },
  {
    id: "assignmentStatus",
    title: "Assignment",
    options: assignmentStatusOptions.map((s) => ({ value: s, label: s })),
  },
]

const defaultFilters: GenericFilterState = {
  zone: [],
  assignmentStatus: [],
}

const columns: ColumnDef<PendingRecovery>[] = [
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
    accessorKey: "outstandingBalance",
    header: "Outstanding Balance",
    cell: ({ row }) => (
      <span className="font-medium text-status-danger text-sm">
        {formatCurrency(row.original.outstandingBalance)}
      </span>
    ),
  },
  {
    accessorKey: "daysOverdue",
    header: "Days Overdue",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.daysOverdue}</span>
    ),
  },
  {
    id: "pairCode",
    header: "Assigned Pair",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.pairCode ?? "—"}</span>
    ),
  },
  {
    accessorKey: "assignmentStatus",
    header: "Assignment",
    cell: ({ row }) => (
      <StatusBadge variant={assignmentStatusVariantMap[row.original.assignmentStatus]}>
        {row.original.assignmentStatus}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "dateFlagged",
    header: "Date Flagged",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateFlagged}</span>
    ),
  },
]

export default function PendingRecoveriesPage() {
  const [recoveries, setRecoveries] = useState<PendingRecovery[]>(mockPendingRecoveries)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedRecoveryId, setSelectedRecoveryId] = useState<string | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const stats = useMemo(
    () => ({
      total: recoveries.length,
      unassigned: recoveries.filter((r) => r.assignmentStatus === "Unassigned").length,
      assigned: recoveries.filter((r) => r.assignmentStatus === "Assigned").length,
    }),
    [recoveries]
  )

  const filteredRecoveries = useMemo(() => {
    setCurrentPage(1)
    const q = searchQuery.trim().toLowerCase()
    return recoveries.filter((record) => {
      if (filters.zone.length > 0 && !filters.zone.includes(record.zone)) return false
      if (
        filters.assignmentStatus.length > 0 &&
        !filters.assignmentStatus.includes(record.assignmentStatus)
      )
        return false
      if (
        q &&
        !record.caseId.toLowerCase().includes(q) &&
        !record.championName.toLowerCase().includes(q) &&
        !record.maxId.toLowerCase().includes(q) &&
        !record.vehiclePlate.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [recoveries, filters, searchQuery])

  const paginatedRecoveries = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRecoveries.slice(start, start + pageSize)
  }, [filteredRecoveries, currentPage, pageSize])

  const selectedRecovery = recoveries.find((r) => r.id === selectedRecoveryId) ?? null

  const handleAssignPair = (recoveryId: string, pairId: string) => {
    const pair = mockRecoveryPairs.find((p) => p.id === pairId)
    if (!pair) return
    setRecoveries((prev) =>
      prev.map((r) =>
        r.id === recoveryId ? { ...r, assignmentStatus: "Assigned", pairCode: pair.pairCode } : r
      )
    )
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Pending Recoveries" }]} />
      <PageHeader
        title="Pending Recoveries"
        subtitle="Recovery cases awaiting officer assignment or session start"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Pending"
          value={stats.total.toLocaleString()}
          subtitle="Cases not yet in session"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Unassigned"
          value={stats.unassigned.toLocaleString()}
          subtitle="Awaiting a recovery pair"
          indicatorColor="var(--color-status-warning)"
        />
        <StatCard
          title="Assigned"
          value={stats.assigned.toLocaleString()}
          subtitle="Pair assigned, session not started"
          indicatorColor="var(--color-status-info)"
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

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search by case, champion, MAX ID or plate..."
              inputClassName="w-72"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={paginatedRecoveries}
              emptyMessage="No pending recoveries found."
              onRowClick={(record) => setSelectedRecoveryId(record.id)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredRecoveries.length / pageSize))}
            totalItems={filteredRecoveries.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="cases"
          />
        </div>
      </div>

      <PendingRecoveryDetailSheet
        recovery={selectedRecovery}
        isOpen={selectedRecoveryId !== null}
        onClose={() => setSelectedRecoveryId(null)}
        onAssignPair={handleAssignPair}
      />
    </>
  )
}
