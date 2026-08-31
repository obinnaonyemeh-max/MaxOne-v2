import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  StatCard,
  StatusTabs,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type StatusTab,
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
  mockRecoverySessions,
  recoveryCommandCenterStats,
  type RecoverySession,
} from "@/data/mockRecoveries"
import { RecoveryActiveMap } from "./RecoveryActiveMap"
import { RecoverySessionListCard } from "./RecoverySessionListCard"

type ListTab = "in-session" | "successful" | "failed"

const tabStatus: Record<ListTab, RecoverySession["status"]> = {
  "in-session": "In Session",
  successful: "Successful",
  failed: "Failed",
}

const tabLabel: Record<ListTab, string> = {
  "in-session": "Recoveries in session",
  successful: "Successful recoveries",
  failed: "Failed recoveries",
}

const activeRecoveries = mockRecoverySessions.filter((s) => s.status === "In Session")

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

export default function RecoveryCommandCenterPage() {
  const [listTab, setListTab] = useState<ListTab>("in-session")
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [selectedActiveId, setSelectedActiveId] = useState<string | null>(
    activeRecoveries[0]?.id ?? null
  )
  const activeFilterCount = getActiveFilterCount(filters)

  const tabs: StatusTab[] = [
    { id: "in-session", label: "In Session", count: recoveryCommandCenterStats.activeRecoveries },
    { id: "successful", label: "Successful", count: recoveryCommandCenterStats.successful },
    { id: "failed", label: "Failed", count: recoveryCommandCenterStats.failed },
  ]

  const listSessions = useMemo<RecoverySession[]>(() => {
    const status = tabStatus[listTab]
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
  }, [listTab, filters, searchQuery])

  // On the "In Session" tab, the map mirrors exactly what's listed so filtering/selection stay in sync.
  const mapSessions = listTab === "in-session" ? listSessions : activeRecoveries

  const handleCardClick = (session: RecoverySession) => {
    if (listTab === "in-session") {
      setSelectedActiveId(session.id)
    } else {
      setExpandedSessionId(expandedSessionId === session.id ? null : session.id)
    }
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Command Center" }]} />
      <PageHeader
        title="Recovery Command Center"
        subtitle="Live view of active field recoveries and portfolio-wide outcomes"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-5 gap-2 shrink-0 mb-4">
        <StatCard
          title="Active Recoveries"
          value={recoveryCommandCenterStats.activeRecoveries.toLocaleString()}
          subtitle="Currently in the field"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Successful"
          value={recoveryCommandCenterStats.successful.toLocaleString()}
          subtitle="Vehicles recovered"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Failed"
          value={recoveryCommandCenterStats.failed.toLocaleString()}
          subtitle="Closed without recovery"
          indicatorColor="var(--color-status-danger)"
        />
        <StatCard
          title="Success Rate"
          value={`${recoveryCommandCenterStats.successRate}%`}
          subtitle="Of resolved sessions"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Pending Check-Ins"
          value={recoveryCommandCenterStats.pendingCheckIns.toLocaleString()}
          subtitle="Awaiting post-recovery check-in"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <div className="flex-1 flex min-w-0 overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Recovery Outcomes List */}
        <div className="w-[390px] max-w-[min(390px,45vw)] min-w-0 shrink border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-950" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {listSessions.length.toLocaleString()}
                </h2>
                <span className="text-gray-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                  {tabLabel[listTab]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Filter">
                      <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-dark text-[10px] text-white flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="end">
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
                  placeholder="Search..."
                  inputClassName="w-40"
                />
              </div>
            </div>

            <StatusTabs
              tabs={tabs}
              activeTab={listTab}
              onTabChange={(tabId) => setListTab(tabId as ListTab)}
              className="px-0 justify-start"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {listSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-sm">No recoveries match your filters</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setFilters(defaultFilters)
                    setSearchQuery("")
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              listSessions.map((session) => (
                <RecoverySessionListCard
                  key={session.id}
                  session={session}
                  isSelected={listTab === "in-session" && selectedActiveId === session.id}
                  isExpanded={expandedSessionId === session.id}
                  onClick={() => handleCardClick(session)}
                  onExpandClick={() =>
                    setExpandedSessionId(expandedSessionId === session.id ? null : session.id)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Active Recoveries Map */}
        <div className="relative z-0 flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          <RecoveryActiveMap
            sessions={mapSessions}
            selectedSessionId={selectedActiveId}
            onSelectSession={setSelectedActiveId}
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </>
  )
}
