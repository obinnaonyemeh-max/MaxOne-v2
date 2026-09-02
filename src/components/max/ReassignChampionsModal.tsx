import { useState } from "react"
import { Check, Search, SlidersHorizontal } from "lucide-react"

import { Banner } from "./Banner"
import { Modal } from "./Modal"
import { GenericFilterPopover, getActiveFilterCount, type FilterSection, type GenericFilterState } from "./GenericFilterPopover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  mockAgentPortfolioRecords,
  reassignmentReasons,
  type AgentPortfolioRecord,
} from "@/data/mockAgentPortfolio"

const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: [...new Set(mockAgentPortfolioRecords.map((a) => a.state))]
      .sort()
      .map((state) => ({ value: state, label: state })),
  },
  {
    id: "status",
    title: "Status",
    options: [
      { value: "Active",   label: "Active",   color: COLOR_STATUS_SUCCESS },
      { value: "On Leave", label: "On Leave", color: COLOR_STATUS_WARNING },
      { value: "Inactive", label: "Inactive", color: COLOR_GRAY_500 },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
  status: [],
}

export interface ReassignChampionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** How many champions are being moved — drives the subtitle copy. */
  championCount: number
  /** Who they're moving from, shown in the subtitle. */
  fromLabel?: string
  /** Agent to leave out of the list, usually the current owner. */
  excludeAgentId?: string
  /** Where the champions sit today. Drives suggestions and the warning banner. */
  fromLocation?: string
  /** Profile reassignment targets one agent; bulk agent flows may target several. */
  selectionMode?: "single" | "multiple"
  onConfirm: (agentIds: string[], reason: string) => void
}

export function ReassignChampionsModal({
  open,
  onOpenChange,
  championCount,
  fromLabel,
  excludeAgentId,
  fromLocation,
  selectionMode = "multiple",
  onConfirm,
}: ReassignChampionsModalProps) {
  const [targetAgentIds, setTargetAgentIds] = useState<string[]>([])
  const [reason, setReason] = useState<string>("")
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  // Clear the form on close so it never reopens half-filled.
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTargetAgentIds([])
      setReason("")
      setSearch("")
      setFilters(defaultFilters)
    }
    onOpenChange(next)
  }

  const matches = (agent: AgentPortfolioRecord) => {
    if (filters.location.length > 0 && !filters.location.includes(agent.state)) return false
    if (filters.status.length > 0 && !filters.status.includes(agent.status)) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !agent.agent.toLowerCase().includes(q) &&
        !agent.state.toLowerCase().includes(q) &&
        !agent.department.toLowerCase().includes(q)
      ) return false
    }
    return true
  }

  const byName = (a: AgentPortfolioRecord, b: AgentPortfolioRecord) =>
    a.agent.localeCompare(b.agent)

  const available = mockAgentPortfolioRecords.filter((agent) => agent.id !== excludeAgentId)

  // Agents already covering the champions' location, offered first. Suggestions
  // ignore the search/filter below, which belongs to the "other agents" list.
  const suggested = fromLocation
    ? available.filter((agent) => agent.state === fromLocation).sort(byName)
    : []

  // The full A–Z list, including the suggested agents — they appear in both
  // places and share selection state, since they're keyed by id.
  const rest = available.filter(matches).sort(byName)

  // Select all covers the suggested agents when there are any, since that's the
  // section it sits on; otherwise it covers the whole list.
  const selectAllPool = suggested.length > 0 ? suggested : rest
  const allSelected =
    selectAllPool.length > 0 &&
    selectAllPool.every((agent) => targetAgentIds.includes(agent.id))

  const isSingleSelection = selectionMode === "single"

  const toggleAgent = (id: string) =>
    setTargetAgentIds((prev) => {
      if (isSingleSelection) {
        return prev.includes(id) ? [] : [id]
      }
      return prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    })

  const toggleAll = () =>
    setTargetAgentIds((prev) => {
      const poolIds = selectAllPool.map((agent) => agent.id)
      return allSelected
        ? prev.filter((id) => !poolIds.includes(id))
        : [...new Set([...prev, ...poolIds])]
    })

  const plural = championCount === 1 ? "" : "s"
  const activeFilterCount = getActiveFilterCount(filters)

  // Champions are normally served by an agent in their own city, so flag any
  // selection that would move them out of it.
  const outOfLocation = fromLocation
    ? mockAgentPortfolioRecords.filter(
        (agent) => targetAgentIds.includes(agent.id) && agent.state !== fromLocation
      )
    : []

  const outOfLocationCities = [...new Set(outOfLocation.map((agent) => agent.state))]

  const renderAgent = (agent: AgentPortfolioRecord) => {
    const isSelected = targetAgentIds.includes(agent.id)
    return (
      <button
        type="button"
        key={agent.id}
        onClick={() => toggleAgent(agent.id)}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
          isSelected
            ? "border-brand-dark bg-gray-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-table-text-primary">
          {agent.agent.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-table-text-primary">{agent.agent}</p>
          <p className="text-xs text-muted-foreground">
            {agent.state} &middot; {agent.total} champions
          </p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            isSelected ? "border-brand-dark bg-brand-dark text-white" : "border-gray-300"
          )}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </span>
      </button>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={isSingleSelection ? "Reassign champion" : "Reassign champions"}
      subtitle={
        fromLabel
          ? `Move ${championCount} champion${plural} from ${fromLabel} to another agent`
          : `Move ${championCount} champion${plural} to another agent`
      }
      className="max-w-lg"
      maxHeight="88vh"
      primaryAction={{
        label: "Reassign",
        onClick: () => onConfirm(targetAgentIds, reason),
        disabled: targetAgentIds.length === 0 || !reason,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => handleOpenChange(false),
      }}
    >
      <div className="flex flex-col gap-3">
        {outOfLocation.length > 0 && (
          <Banner
            variant="warning"
            title={
              outOfLocation.length === 1
                ? "Selected agent is in a different location"
                : "Selected agents are in different locations"
            }
            description={
              <>
                You're about to move {championCount} champion{plural} to{" "}
                {outOfLocation.length === 1 ? (
                  <>
                    <span className="font-medium">{outOfLocation[0].agent}</span> in{" "}
                    <span className="font-medium">{outOfLocation[0].state}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">{outOfLocation.length} agents</span> in{" "}
                    <span className="font-medium">{outOfLocationCities.join(", ")}</span>
                  </>
                )}
                , outside their current agent's location of{" "}
                <span className="font-medium">{fromLocation}</span>.
              </>
            }
          />
        )}

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-table-text-primary">Reason</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {reassignmentReasons.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-1">
          {suggested.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Suggested in {fromLocation}
                </p>
                {!isSingleSelection && (
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-sm font-medium text-status-info hover:underline"
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </button>
                )}
              </div>
              {suggested.map(renderAgent)}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                List of agents A&ndash;Z
              </p>
              {!isSingleSelection && suggested.length === 0 && rest.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-sm font-medium text-status-info hover:underline"
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              )}
            </div>
            {/* Search + filter, scoped to this list */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search agent, location or department..."
                  className="h-9 pl-9"
                />
              </div>
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
                <PopoverContent className="w-auto p-2" align="end">
                  <GenericFilterPopover
                    sections={filterSections}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {rest.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No agents match.
              </p>
            ) : (
              rest.map(renderAgent)
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {isSingleSelection
            ? targetAgentIds.length === 1
              ? "1 agent selected"
              : "Select one agent"
            : `${targetAgentIds.length} of ${available.length} selected`}
        </p>
      </div>
    </Modal>
  )
}
