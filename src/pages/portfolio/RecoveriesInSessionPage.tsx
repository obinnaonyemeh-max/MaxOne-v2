import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  StatusBadge,
  StatusTabs,
  GenericFilterPopover,
  getActiveFilterCount,
  type StatusTab,
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
  mockRecoverySessions,
  recoverySessionStats,
  sessionStatusVariantMap,
  formatElapsed,
  type RecoverySession,
  type SessionStatus,
} from "@/data/mockRecoveries"

type TabId = "in-session" | "successful" | "failed"

const tabStatus: Record<TabId, SessionStatus> = {
  "in-session": "In Session",
  successful: "Successful",
  failed: "Failed",
}

const uniqueZones = [...new Set(mockRecoverySessions.map((s) => s.zone))].sort()

const filterSections: FilterSection[] = [
  {
    id: "zone",
    title: "Zone",
    defaultExpanded: true,
    options: uniqueZones.map((z) => ({ value: z, label: z })),
  },
]

const defaultFilters: GenericFilterState = { zone: [] }

const baseColumns: ColumnDef<RecoverySession>[] = [
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
]

const inSessionColumn: ColumnDef<RecoverySession> = {
  id: "elapsed",
  header: "Session Timer",
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-status-info animate-pulse" />
      <span className="font-medium text-table-text text-sm">{formatElapsed(row.original.elapsedMinutes)}</span>
    </div>
  ),
}

const completedAtColumn: ColumnDef<RecoverySession> = {
  accessorKey: "completedAt",
  header: "Completed",
  cell: ({ row }) => (
    <span className="font-medium text-table-text text-sm">{row.original.completedAt ?? "—"}</span>
  ),
}

const outcomeNotesColumn: ColumnDef<RecoverySession> = {
  accessorKey: "outcomeNotes",
  header: "Outcome Notes",
  cell: ({ row }) => (
    <span className="text-table-text text-sm">{row.original.outcomeNotes ?? "—"}</span>
  ),
}

const statusColumn: ColumnDef<RecoverySession> = {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <StatusBadge variant={sessionStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
  ),
}

const columnsByTab: Record<TabId, ColumnDef<RecoverySession>[]> = {
  "in-session": [...baseColumns, inSessionColumn, statusColumn],
  successful: [...baseColumns, completedAtColumn, statusColumn],
  failed: [...baseColumns, completedAtColumn, outcomeNotesColumn, statusColumn],
}

export default function RecoveriesInSessionPage() {
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()
  const activeTab: TabId = (["in-session", "successful", "failed"].includes(tab ?? "")
    ? tab
    : "in-session") as TabId

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const tabs: StatusTab[] = [
    { id: "in-session", label: "In Session", count: recoverySessionStats.inSession },
    { id: "successful", label: "Successful Recoveries", count: recoverySessionStats.successful },
    { id: "failed", label: "Failed Recoveries", count: recoverySessionStats.failed },
  ]

  const handleTabChange = (tabId: string) => {
    setCurrentPage(1)
    setFilters(defaultFilters)
    setSearchQuery("")
    navigate(`/portfolio/recovery/sessions/${tabId}`)
  }

  const filteredSessions = useMemo(() => {
    setCurrentPage(1)
    const status = tabStatus[activeTab]
    const q = searchQuery.trim().toLowerCase()
    return mockRecoverySessions.filter((session) => {
      if (session.status !== status) return false
      if (filters.zone.length > 0 && !filters.zone.includes(session.zone)) return false
      if (
        q &&
        !session.caseId.toLowerCase().includes(q) &&
        !session.championName.toLowerCase().includes(q) &&
        !session.pairCode.toLowerCase().includes(q) &&
        !session.vehiclePlate.toLowerCase().includes(q)
      )
        return false
      return true
    })
  }, [activeTab, filters, searchQuery])

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredSessions.slice(start, start + pageSize)
  }, [filteredSessions, currentPage, pageSize])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recoveries in Session" }]} />
      <PageHeader
        title="Recoveries in Session"
        subtitle="Active field recoveries and their outcomes"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        <StatCard
          title="Recoveries in Session"
          value={recoverySessionStats.inSession.toLocaleString()}
          subtitle="Currently active in the field"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Successful Recoveries"
          value={recoverySessionStats.successful.toLocaleString()}
          subtitle="Vehicle recovered"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Failed Recoveries"
          value={recoverySessionStats.failed.toLocaleString()}
          subtitle="Session closed without recovery"
          indicatorColor="var(--color-status-danger)"
        />
      </div>

      <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} className="shrink-0" />

      <div className="px-6 mt-2 flex flex-col flex-1 min-h-0">
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
                  placeholder="Search by case, champion or pair..."
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
              columns={columnsByTab[activeTab]}
              data={paginatedSessions}
              emptyMessage="No recovery sessions found."
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredSessions.length / pageSize))}
            totalItems={filteredSessions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="sessions"
          />
        </div>
      </div>
    </>
  )
}
