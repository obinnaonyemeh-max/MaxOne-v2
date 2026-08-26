import { useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, UserPlus } from "lucide-react"

import {
  TopBar,
  DataTable,
  StatusBadge,
  Pagination,
  BackButton,
  GenericFilterPopover,
  getActiveFilterCount,
  ReassignChampionsModal,
  Toast,
  useToast,
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
  getAgentById,
  mockAgentChampions,
  mockAgentPortfolioRecords,
  championStateVariantMap,
  championStates,
  type AgentChampionRecord,
  type ChampionState,
} from "@/data/mockAgentPortfolio"

const COLOR_GRAY_500 = "var(--color-gray-500)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_STATUS_INFO = "var(--color-status-info)"

const stateColors: Record<ChampionState, string> = {
  "Default":       COLOR_STATUS_DANGER,
  "Early Arrears": COLOR_STATUS_WARNING,
  "Inactive":      COLOR_GRAY_500,
  "Performing":    COLOR_STATUS_SUCCESS,
  "Watchlist":     COLOR_STATUS_INFO,
}

const filterSections: FilterSection[] = [
  {
    id: "state",
    title: "State",
    defaultExpanded: true,
    options: championStates.map((state) => ({
      value: state,
      label: state,
      color: stateColors[state],
    })),
  },
]

const defaultFilters: GenericFilterState = {
  state: [],
}

interface ChampionColumnsOptions {
  selectedIds: string[]
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
}

function getChampionColumns({
  selectedIds,
  allSelected,
  onToggle,
  onToggleAll,
}: ChampionColumnsOptions): ColumnDef<AgentChampionRecord>[] {
  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label="Select all champions"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => onToggle(row.original.id)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label={`Select ${row.original.name}`}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Champion",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatarUrl}
            alt={row.original.name}
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.championId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: "plate",
      header: "Plate",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.plate}</span>
      ),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <StatusBadge variant={championStateVariantMap[row.original.state]} withDot>
          {row.original.state}
        </StatusBadge>
      ),
    },
  ]
}

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()

  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const activeFilterCount = getActiveFilterCount(filters)
  const [reassignOpen, setReassignOpen] = useState(false)
  // Champion -> new agent. Local to this page: the mock data is a module constant,
  // so a reassignment lasts until the app reloads.
  const [reassignments, setReassignments] = useState<Record<string, string>>({})
  const { message: toast, variant: toastVariant, showToast } = useToast()

  const agent = agentId ? getAgentById(agentId) : undefined
  const champions = useMemo(
    () =>
      agentId
        ? mockAgentChampions.filter(
            (champion) => (reassignments[champion.id] ?? champion.agentId) === agentId
          )
        : [],
    [agentId, reassignments]
  )

  const filteredChampions = useMemo(() =>
    champions.filter((champion) => {
      if (filters.state.length > 0 && !filters.state.includes(champion.state)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !champion.name.toLowerCase().includes(q) &&
          !champion.championId.toLowerCase().includes(q) &&
          !champion.plate.toLowerCase().includes(q) &&
          !champion.phone.toLowerCase().includes(q)
        ) return false
      }
      return true
    }),
    [champions, filters, searchQuery]
  )

  const pagedChampions = useMemo(
    () => filteredChampions.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredChampions, currentPage, pageSize]
  )

  // Select-all applies to the rows currently in view, matching what the user sees.
  const allSelected =
    pagedChampions.length > 0 &&
    pagedChampions.every((champion) => selectedIds.includes(champion.id))

  const toggleChampion = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )

  const toggleAll = () =>
    setSelectedIds((prev) => {
      const pagedIds = pagedChampions.map((champion) => champion.id)
      return allSelected
        ? prev.filter((id) => !pagedIds.includes(id))
        : [...new Set([...prev, ...pagedIds])]
    })

  const handleReassign = (targetAgentIds: string[], reason: string) => {
    if (targetAgentIds.length === 0 || !reason) return
    const moved = selectedIds.length

    // With more than one agent picked the champions are spread evenly between
    // them, round-robin, so no single book absorbs the whole batch.
    setReassignments((prev) => {
      const next = { ...prev }
      selectedIds.forEach((id, index) => {
        next[id] = targetAgentIds[index % targetAgentIds.length]
      })
      return next
    })

    const destination =
      targetAgentIds.length === 1
        ? mockAgentPortfolioRecords.find((a) => a.id === targetAgentIds[0])?.agent
        : `${targetAgentIds.length} agents`

    showToast(`${moved} champion${moved === 1 ? "" : "s"} reassigned to ${destination} (${reason})`)
    setSelectedIds([])
    setReassignOpen(false)
  }

  const columns = useMemo(
    () => getChampionColumns({
      selectedIds,
      allSelected,
      onToggle: toggleChampion,
      onToggleAll: toggleAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, allSelected, pagedChampions]
  )

  if (!agent) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Driver Experience" },
            { label: "Agent Management" },
            { label: "Agent Portfolio", href: "/driver-experience/agents/portfolio" },
            { label: "Not found" },
          ]}
        />
        <div className="flex-1 px-6 py-6">
          <BackButton onClick={() => navigate("/driver-experience/agents/portfolio")} />
          <p className="mt-4 text-sm text-muted-foreground">Agent not found.</p>
        </div>
      </>
    )
  }

  const countState = (state: ChampionState) =>
    champions.filter((champion) => champion.state === state).length

  const stats = [
    { title: "Total Champions",      value: champions.length,                                    indicatorColor: COLOR_GRAY_500 },
    { title: "Active Champions",     value: countState("Performing"),                            indicatorColor: COLOR_STATUS_SUCCESS },
    { title: "At Risk Champions",    value: countState("Watchlist") + countState("Early Arrears"), indicatorColor: COLOR_STATUS_WARNING },
    { title: "Delinquent Champions", value: countState("Default"),                               indicatorColor: COLOR_STATUS_DANGER },
  ]


  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Agent Management" },
          { label: "Agent Portfolio", href: "/driver-experience/agents/portfolio" },
          { label: agent.agent },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="py-6">
          <div className="flex items-center gap-2">
            <BackButton onClick={() => navigate("/driver-experience/agents/portfolio")} />
            <h1
              className="flex items-end gap-1 font-semibold text-sidebar-item-active"
              style={{ fontSize: "22px" }}
            >
              {agent.agent}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
          </div>
          <p className="mt-1 ml-10 text-sm font-medium text-breadcrumb-root">
            {agent.department} &middot; Champions allocated to this agent
          </p>
        </div>

        <div className="pb-4">
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

        <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex items-center gap-2 px-2 py-2">
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

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search champion, ID, phone, or plate..."
                  className="h-9 w-64"
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

            {selectedIds.length > 0 && (
              <div className="ml-auto flex items-center gap-3 pr-1">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <Button
                  className="h-9 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
                  onClick={() => setReassignOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Reassign
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-y-auto">
            <DataTable columns={columns} data={pagedChampions} />
          </div>
        </div>

        <div className="mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredChampions.length / pageSize)}
            totalItems={filteredChampions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="champions"
          />
        </div>
      </div>

      <ReassignChampionsModal
        open={reassignOpen}
        onOpenChange={setReassignOpen}
        championCount={selectedIds.length}
        fromLabel={agent.agent}
        excludeAgentId={agent.id}
        fromLocation={agent.state}
        onConfirm={handleReassign}
      />

      <Toast message={toast} variant={toastVariant} />
    </>
  )
}
