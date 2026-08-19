import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, UserPlus, Car, UserCheck } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  StatusBadge,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockRecoveryAgents,
  mockRecoveryPairs,
  mockRecoveryVehicles,
  officerStatusVariantMap,
  pairStatusVariantMap,
  type RecoveryAgent,
  type RecoveryPair,
  type RecoveryVehicle,
  type OfficerStatus,
} from "@/data/mockRecoveryOfficers"
import { CustomerAssignmentFlow } from "./CustomerAssignmentFlow"
import { CreateRecoveryPairFlow } from "./CreateRecoveryPairFlow"
import { ManageVehiclesFlow } from "./ManageVehiclesFlow"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const zones = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"]
const officerStatusOptions: OfficerStatus[] = ["Active", "On Leave", "Inactive"]

const defaultFilters: GenericFilterState = { zone: [], status: [] }

let nextPairSeq = mockRecoveryPairs.length + 1

export default function RecoveryOfficersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "pairs"
  const handleTabChange = (value: string) => setSearchParams({ tab: value }, { replace: true })

  const [agents, setAgents] = useState<RecoveryAgent[]>(mockRecoveryAgents)
  const [pairs, setPairs] = useState<RecoveryPair[]>(mockRecoveryPairs)
  const [vehicles, setVehicles] = useState<RecoveryVehicle[]>(mockRecoveryVehicles)

  const [showAssignment, setShowAssignment] = useState(false)
  const [showCreatePair, setShowCreatePair] = useState(false)
  const [showManageVehicles, setShowManageVehicles] = useState(false)

  const [pairSearch, setPairSearch] = useState("")
  const [pairSearchOpen, setPairSearchOpen] = useState(false)
  const [pairFilters, setPairFilters] = useState<GenericFilterState>(defaultFilters)
  const [pairPage, setPairPage] = useState(1)
  const [pairPageSize, setPairPageSize] = useState(25)

  const [agentSearch, setAgentSearch] = useState("")
  const [agentSearchOpen, setAgentSearchOpen] = useState(false)
  const [agentFilters, setAgentFilters] = useState<GenericFilterState>(defaultFilters)
  const [agentPage, setAgentPage] = useState(1)
  const [agentPageSize, setAgentPageSize] = useState(25)

  const agentStats = useMemo(
    () => ({
      total: agents.length,
      active: agents.filter((a) => a.status === "Active").length,
      inactive: agents.filter((a) => a.status === "Inactive").length,
    }),
    [agents]
  )

  const agentById = useMemo(() => new Map(agents.map((a) => [a.id, a])), [agents])
  const vehicleForPair = useMemo(() => {
    const map = new Map<string, RecoveryVehicle>()
    vehicles.forEach((v) => {
      if (v.pairId) map.set(v.pairId, v)
    })
    return map
  }, [vehicles])

  const officerNames = (pair: RecoveryPair) => {
    const a = agentById.get(pair.officerAId)?.name
    const b = agentById.get(pair.officerBId)?.name
    return [a, b].filter(Boolean).join(" & ")
  }

  const pairFilterSections: FilterSection[] = [
    { id: "zone", title: "Zone", defaultExpanded: true, options: zones.map((z) => ({ value: z, label: z })) },
    { id: "status", title: "Status", options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] },
  ]

  const agentFilterSections: FilterSection[] = [
    { id: "zone", title: "Location", defaultExpanded: true, options: zones.map((z) => ({ value: z, label: z })) },
    { id: "status", title: "Status", options: officerStatusOptions.map((s) => ({ value: s, label: s })) },
  ]

  const filteredPairs = useMemo(() => {
    setPairPage(1)
    const q = pairSearch.trim().toLowerCase()
    return pairs.filter((pair) => {
      if (pairFilters.zone.length > 0 && !pairFilters.zone.includes(pair.zone)) return false
      if (pairFilters.status.length > 0 && !pairFilters.status.includes(pair.status)) return false
      if (
        q &&
        !pair.pairCode.toLowerCase().includes(q) &&
        !officerNames(pair).toLowerCase().includes(q) &&
        !pair.zone.toLowerCase().includes(q)
      )
        return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs, pairFilters, pairSearch, agentById])

  const filteredAgents = useMemo(() => {
    setAgentPage(1)
    const q = agentSearch.trim().toLowerCase()
    return agents.filter((agent) => {
      if (agentFilters.zone.length > 0 && !agentFilters.zone.includes(agent.location)) return false
      if (agentFilters.status.length > 0 && !agentFilters.status.includes(agent.status)) return false
      if (
        q &&
        !agent.name.toLowerCase().includes(q) &&
        !agent.staffId.toLowerCase().includes(q) &&
        !agent.phone.includes(q)
      )
        return false
      return true
    })
  }, [agents, agentFilters, agentSearch])

  const paginatedPairs = useMemo(() => {
    const start = (pairPage - 1) * pairPageSize
    return filteredPairs.slice(start, start + pairPageSize)
  }, [filteredPairs, pairPage, pairPageSize])

  const paginatedAgents = useMemo(() => {
    const start = (agentPage - 1) * agentPageSize
    return filteredAgents.slice(start, start + agentPageSize)
  }, [filteredAgents, agentPage, agentPageSize])

  const pairColumns: ColumnDef<RecoveryPair>[] = [
    {
      accessorKey: "pairCode",
      header: "Pair",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.pairCode}</span>
      ),
    },
    {
      id: "officers",
      header: "Officers",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{officerNames(row.original)}</span>
      ),
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.zone}</span>,
    },
    {
      id: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => {
        const vehicle = vehicleForPair.get(row.original.id)
        return (
          <span className="font-medium text-table-text text-sm">
            {vehicle ? `${vehicle.plateNumber} · ${vehicle.type}` : "Unassigned"}
          </span>
        )
      },
    },
    {
      accessorKey: "activeCases",
      header: "Active Cases",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.activeCases}</span>
      ),
    },
    {
      id: "successRate",
      header: "Success Rate",
      cell: ({ row }) => {
        const { successfulRecoveries, failedRecoveries } = row.original
        const total = successfulRecoveries + failedRecoveries
        const rate = total > 0 ? Math.round((successfulRecoveries / total) * 100) : 0
        return <span className="font-medium text-table-text text-sm">{rate}%</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={pairStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
  ]

  const agentColumns: ColumnDef<RecoveryAgent>[] = [
    {
      accessorKey: "name",
      header: "Agent",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src="/images/champvatar.png"
            alt={row.original.name}
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.staffId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.phone}</span>,
    },
    {
      id: "pair",
      header: "Pair",
      cell: ({ row }) => {
        const pair = pairs.find((p) => p.id === row.original.pairId)
        return (
          <span className="font-medium text-table-text text-sm">
            {pair ? pair.pairCode : "Unassigned"}
          </span>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.location}</span>,
    },
    {
      accessorKey: "casesHandled",
      header: "Cases Handled",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.casesHandled}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={officerStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
  ]

  const handleAssignCase = (pairId: string) => {
    setPairs((prev) => prev.map((p) => (p.id === pairId ? { ...p, activeCases: p.activeCases + 1 } : p)))
  }

  const handleCreatePair = (input: { officerAId: string; officerBId: string; zone: string; vehicleId: string | null }) => {
    const newPair: RecoveryPair = {
      id: String(nextPairSeq),
      pairCode: `RP-${String(nextPairSeq).padStart(3, "0")}`,
      officerAId: input.officerAId,
      officerBId: input.officerBId,
      zone: input.zone,
      status: "Active",
      vehicleId: input.vehicleId,
      activeCases: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      dateFormed: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    }
    nextPairSeq += 1

    setPairs((prev) => [...prev, newPair])
    setAgents((prev) =>
      prev.map((a) =>
        a.id === input.officerAId || a.id === input.officerBId ? { ...a, pairId: newPair.id } : a
      )
    )
    if (input.vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === input.vehicleId ? { ...v, pairId: newPair.id, status: "In Use" } : v))
      )
    }
  }

  const handleReassignVehicle = (vehicleId: string, pairId: string | null) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, pairId, status: pairId ? "In Use" : "Available" } : v))
    )
  }

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Officers" }]}
      />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Recovery Officers"
          subtitle="Manage recovery pairs, enlisted agents and operational vehicles"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button variant="outline" className="h-10 gap-2" onClick={() => setShowManageVehicles(true)}>
            <Car className="h-4 w-4" />
            Manage Vehicles
          </Button>
          <Button variant="outline" className="h-10 gap-2" onClick={() => setShowCreatePair(true)}>
            <UserPlus className="h-4 w-4" />
            Create Recovery Pair
          </Button>
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => setShowAssignment(true)}
          >
            <UserCheck className="h-4 w-4" />
            Make Customer Assignments
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        <StatCard
          title="All Recovery Officers"
          value={agentStats.total.toLocaleString()}
          subtitle="Enlisted agents across all zones"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active Officers"
          value={agentStats.active.toLocaleString()}
          subtitle="Available for field assignment"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Inactive Officers"
          value={agentStats.inactive.toLocaleString()}
          subtitle="Not currently enlisted"
          indicatorColor="var(--color-status-danger)"
        />
      </div>

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1 min-h-0">
          <TabsList variant="line" className="pb-0 gap-0 shrink-0">
            <TabsTrigger value="pairs" className={tabTriggerClass}>
              Recovery Pairs
            </TabsTrigger>
            <TabsTrigger value="agents" className={tabTriggerClass}>
              All Agents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pairs" className="mt-3 flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {getActiveFilterCount(pairFilters) > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {getActiveFilterCount(pairFilters)}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={pairFilterSections}
                      filters={pairFilters}
                      onFiltersChange={setPairFilters}
                    />
                  </PopoverContent>
                </Popover>

                {pairSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={pairSearch}
                      onChange={(e) => setPairSearch(e.target.value)}
                      placeholder="Search by pair code, officer or zone..."
                      className="h-9 w-72"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setPairSearchOpen(false)
                          setPairSearch("")
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setPairSearchOpen(false)
                        setPairSearch("")
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPairSearchOpen(true)}>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <DataTable columns={pairColumns} data={paginatedPairs} emptyMessage="No recovery pairs found." />
              </div>
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={pairPage}
                totalPages={Math.max(1, Math.ceil(filteredPairs.length / pairPageSize))}
                totalItems={filteredPairs.length}
                pageSize={pairPageSize}
                onPageChange={setPairPage}
                onPageSizeChange={setPairPageSize}
                itemLabel="pairs"
              />
            </div>
          </TabsContent>

          <TabsContent value="agents" className="mt-3 flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {getActiveFilterCount(agentFilters) > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {getActiveFilterCount(agentFilters)}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={agentFilterSections}
                      filters={agentFilters}
                      onFiltersChange={setAgentFilters}
                    />
                  </PopoverContent>
                </Popover>

                {agentSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={agentSearch}
                      onChange={(e) => setAgentSearch(e.target.value)}
                      placeholder="Search by name, staff ID or phone..."
                      className="h-9 w-72"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setAgentSearchOpen(false)
                          setAgentSearch("")
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setAgentSearchOpen(false)
                        setAgentSearch("")
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setAgentSearchOpen(true)}>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <DataTable columns={agentColumns} data={paginatedAgents} emptyMessage="No agents found." />
              </div>
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={agentPage}
                totalPages={Math.max(1, Math.ceil(filteredAgents.length / agentPageSize))}
                totalItems={filteredAgents.length}
                pageSize={agentPageSize}
                onPageChange={setAgentPage}
                onPageSizeChange={setAgentPageSize}
                itemLabel="agents"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CustomerAssignmentFlow
        open={showAssignment}
        onClose={() => setShowAssignment(false)}
        pairs={pairs}
        agents={agents}
        onAssign={handleAssignCase}
      />
      <CreateRecoveryPairFlow
        open={showCreatePair}
        onClose={() => setShowCreatePair(false)}
        agents={agents}
        vehicles={vehicles}
        onCreate={handleCreatePair}
      />
      <ManageVehiclesFlow
        open={showManageVehicles}
        onClose={() => setShowManageVehicles(false)}
        vehicles={vehicles}
        pairs={pairs}
        onReassign={handleReassignVehicle}
      />
    </>
  )
}
