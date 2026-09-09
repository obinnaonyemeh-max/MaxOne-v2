import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import {
  DataTable,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  InfoGrid,
  Modal,
  Pagination,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type RepricingSession } from "@/data/mockRepricingEngine"
import { getRepricingSessionsColumns } from "./repricingSessionsTabColumns"

interface RepricingSessionsTabProps {
  sessions: RepricingSession[]
}

const defaultFilters: GenericFilterState = { sessionType: [], status: [] }

export function RepricingSessionsTab({ sessions }: RepricingSessionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [viewSession, setViewSession] = useState<RepricingSession | null>(null)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  const filterSections: FilterSection[] = useMemo(() => {
    const sessionTypes = [...new Set(sessions.map((session) => session.sessionType))].sort()
    const statuses = [...new Set(sessions.map((session) => session.status))].sort()

    return [
      { id: "sessionType", title: "Session Type", defaultExpanded: true, options: sessionTypes.map((t) => ({ value: t, label: t })) },
      { id: "status", title: "Status", options: statuses.map((s) => ({ value: s, label: s })) },
    ]
  }, [sessions])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (filters.sessionType.length > 0 && !filters.sessionType.includes(session.sessionType)) return false
      if (filters.status.length > 0 && !filters.status.includes(session.status)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !session.id.toLowerCase().includes(q) &&
          !session.trigger.toLowerCase().includes(q) &&
          !session.status.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [sessions, filters, searchQuery])

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredSessions.slice(start, start + pageSize)
  }, [filteredSessions, currentPage, pageSize])

  const columns = getRepricingSessionsColumns({ onView: setViewSession })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-100">
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
                  onFiltersChange={(next) => {
                    setFilters(next)
                    setCurrentPage(1)
                  }}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              placeholder="Search by session ID, trigger, status..."
              inputClassName="w-72"
            />
          </div>

          <DataTable columns={columns} data={paginatedSessions} emptyMessage="No repricing sessions yet." />
        </div>
      </div>

      <div className="px-6">
        <div className="rounded-lg border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredSessions.length / pageSize))}
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
      </div>

      <Modal
        open={viewSession !== null}
        onOpenChange={(open) => !open && setViewSession(null)}
        title={viewSession?.id}
        subtitle="Repricing session details"
        secondaryAction={{ label: "Close", onClick: () => setViewSession(null) }}
      >
        {viewSession && (
          <InfoGrid
            columns={2}
            items={[
              { label: "Run Time", value: viewSession.startTime },
              { label: "Trigger", value: viewSession.trigger },
              { label: "Duration", value: viewSession.duration },
              { label: "Status", value: viewSession.status },
              { label: "Contracts Found", value: viewSession.found },
              { label: "Successful", value: viewSession.repriced },
              { label: "Failed", value: viewSession.failed },
              { label: "Exceptions", value: viewSession.exceptions },
            ]}
          />
        )}
      </Modal>
    </div>
  )
}
