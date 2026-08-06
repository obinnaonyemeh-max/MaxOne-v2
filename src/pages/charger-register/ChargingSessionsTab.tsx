import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"
import {
  DataTable,
  Pagination,
  StatusBadge,
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
  getChargingSessionsByChargerId,
  getChargingSessionDetail,
  type ChargingSession,
  type ChargingSessionDetail,
  type ChargingSessionStatus,
} from "@/data/mockChargerData"
import { SessionDetailSheet } from "./SessionDetailSheet"

const statusToVariant: Record<ChargingSessionStatus, "success" | "danger" | "warning"> = {
  COMPLETED: "success",
  FAULTED: "danger",
  "IN PROGRESS": "warning",
}

const statusLabels: Record<ChargingSessionStatus, string> = {
  COMPLETED: "Completed",
  FAULTED: "Faulted",
  "IN PROGRESS": "In Progress",
}

const filterSections: FilterSection[] = [
  {
    id: "finalStatus",
    title: "Final Status",
    defaultExpanded: true,
    options: [
      { value: "COMPLETED", label: "Completed", color: "var(--color-success)" },
      { value: "FAULTED", label: "Faulted", color: "var(--color-danger)" },
      { value: "IN PROGRESS", label: "In Progress", color: "var(--color-warning)" },
    ],
  },
  {
    id: "battery",
    title: "Battery",
    options: [
      { value: "BAT-2048", label: "BAT-2048" },
      { value: "BAT-1982", label: "BAT-1982" },
      { value: "BAT-2110", label: "BAT-2110" },
      { value: "BAT-1876", label: "BAT-1876" },
      { value: "BAT-2201", label: "BAT-2201" },
      { value: "BAT-1755", label: "BAT-1755" },
      { value: "BAT-2300", label: "BAT-2300" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  finalStatus: [],
  battery: [],
}

const columns: ColumnDef<ChargingSession>[] = [
  {
    accessorKey: "sessionId",
    header: "Session ID",
    cell: ({ row }) => (
      <span className="font-semibold text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.sessionId}
      </span>
    ),
  },
  {
    accessorKey: "battery",
    header: "Battery",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.battery}
      </span>
    ),
  },
  {
    accessorKey: "started",
    header: "Started",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.started}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.duration}
      </span>
    ),
  },
  {
    accessorKey: "finalStatus",
    header: "Final Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusToVariant[row.original.finalStatus]}>
        {statusLabels[row.original.finalStatus]}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "energy",
    header: "Energy",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.energy}
      </span>
    ),
  },
  {
    accessorKey: "peakOutput",
    header: "Peak Output",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.peakOutput}
      </span>
    ),
  },
  {
    id: "soc",
    header: "SOC",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.socStart}% → {row.original.socEnd}%
      </span>
    ),
  },
  {
    accessorKey: "peakTemp",
    header: "Peak Temp",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.peakTemp}
      </span>
    ),
  },
]

interface ChargingSessionsTabProps {
  chargerId: string
}

export function ChargingSessionsTab({ chargerId }: ChargingSessionsTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [submittedSearch, setSubmittedSearch] = useState("")
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<ChargingSessionDetail | null>(null)

  const handleRowClick = (row: ChargingSession) => {
    const detail = getChargingSessionDetail(row.id)
    if (detail) {
      setSelectedSession(detail)
      setSelectedSessionId(row.id)
    }
  }

  const handleCloseSheet = () => {
    setSelectedSessionId(null)
    setSelectedSession(null)
  }

  const sessions = useMemo(
    () => getChargingSessionsByChargerId(chargerId),
    [chargerId]
  )

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (
        filters.finalStatus.length > 0 &&
        !filters.finalStatus.includes(session.finalStatus)
      ) {
        return false
      }

      if (
        filters.battery.length > 0 &&
        !filters.battery.includes(session.battery)
      ) {
        return false
      }

      if (submittedSearch) {
        const query = submittedSearch.toLowerCase()
        const haystack = [
          session.sessionId,
          session.battery,
          session.started,
          session.duration,
          session.finalStatus,
          session.energy,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      return true
    })
  }, [sessions, filters, submittedSearch])

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize))
  const pageData = filteredSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const activeFilterCount = getActiveFilterCount(filters)

  const handleFiltersChange = (next: GenericFilterState) => {
    setFilters(next)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
          <div className="flex items-center gap-2">
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
                  onFiltersChange={handleFiltersChange}
                />
              </PopoverContent>
            </Popover>

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search session or battery..."
                  className="h-9 w-56"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSubmittedSearch(searchQuery)
                      setCurrentPage(1)
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
                    setSubmittedSearch("")
                    setCurrentPage(1)
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

        <DataTable
          columns={columns}
          data={pageData}
          emptyMessage="No charging sessions found."
          onRowClick={handleRowClick}
        />
      </div>

      <div className="mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSessions.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="sessions"
        />
      </div>

      <SessionDetailSheet
        session={selectedSession}
        isOpen={!!selectedSessionId}
        onClose={handleCloseSheet}
      />
    </>
  )
}
