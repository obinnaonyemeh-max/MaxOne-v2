import { useEffect, useMemo, useState } from "react"
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
  ContractDetailSheet,
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
  mockContracts,
  statusVariantMap,
  categoryVariantMap,
  type Contract,
  type ContractStatus,
  type ContractCategory,
} from "@/data/mockContracts"

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

type TabId = "all" | "initiated" | "restructured" | "pending-approval" | "disputed"

const tabCategory: Record<Exclude<TabId, "all">, ContractCategory> = {
  initiated: "Initiated",
  restructured: "Restructured",
  "pending-approval": "Pending Approval",
  disputed: "Disputed",
}

const tabs: StatusTab[] = [
  { id: "all", label: "All Contracts" },
  { id: "initiated", label: "Initiated Contracts" },
  { id: "restructured", label: "Restructured Contracts" },
  { id: "pending-approval", label: "Pending Approvals" },
  { id: "disputed", label: "Disputed Contracts" },
]

const uniqueLocations = [...new Set(mockContracts.map((c) => c.location))].sort()
const statusOptions: ContractStatus[] = ["Active", "Paused", "Marked for Closure", "Completed"]
const vehicleTypeOptions = ["Two-Wheeler", "Three-Wheeler", "Four-Wheeler"]

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: uniqueLocations.map((loc) => ({ value: loc, label: loc })),
  },
  {
    id: "status",
    title: "Status",
    options: statusOptions.map((s) => ({ value: s, label: s })),
  },
  {
    id: "vehicleType",
    title: "Vehicle Type",
    options: vehicleTypeOptions.map((v) => ({ value: v, label: v })),
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
  status: [],
  vehicleType: [],
}

const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "contractId",
    header: "Contract",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.contractId}</span>
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
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "monthlyAmount",
    header: "Monthly Amount",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">
        {formatCurrency(row.original.monthlyAmount)}
      </span>
    ),
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding Balance",
    cell: ({ row }) => (
      <span
        className={`font-medium text-sm ${row.original.outstandingBalance > 0 ? "text-status-danger" : "text-table-text"}`}
      >
        {formatCurrency(row.original.outstandingBalance)}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge variant={categoryVariantMap[row.original.category]}>
        {row.original.category === "Standard" ? "Standard" : row.original.category}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status]}>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

export default function ContractsPage() {
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()
  const activeTab: TabId = (tabs.some((t) => t.id === tab) ? tab : "all") as TabId

  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  // Row-level detail drawer only opens from the two workflow-queue tabs that
  // have an actionable review flow (approve/dispute, resolve).
  const isDetailTab = activeTab === "pending-approval" || activeTab === "disputed"

  const stats = useMemo(
    () => ({
      all: contracts.length,
      active: contracts.filter((c) => c.status === "Active").length,
      paused: contracts.filter((c) => c.status === "Paused").length,
      markedForClosure: contracts.filter((c) => c.status === "Marked for Closure").length,
      completed: contracts.filter((c) => c.status === "Completed").length,
    }),
    [contracts]
  )

  const handleContractUpdate = (id: string, updates: Partial<Contract>) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  // Brief simulated fetch so the table's skeleton state is exercised on
  // mount and whenever the active tab changes.
  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [activeTab])

  const handleTabChange = (tabId: string) => {
    setCurrentPage(1)
    setFilters(defaultFilters)
    setSearchQuery("")
    navigate(`/portfolio/contracts/${tabId}`)
  }

  const filteredContracts = useMemo(() => {
    setCurrentPage(1)
    const category = activeTab === "all" ? null : tabCategory[activeTab]
    return contracts.filter((contract) => {
      if (category && contract.category !== category) return false
      if (filters.location.length > 0 && !filters.location.includes(contract.location)) return false
      if (filters.status.length > 0 && !filters.status.includes(contract.status)) return false
      if (filters.vehicleType.length > 0 && !filters.vehicleType.includes(contract.vehicleType)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !contract.contractId.toLowerCase().includes(q) &&
          !contract.championName.toLowerCase().includes(q) &&
          !contract.maxId.toLowerCase().includes(q) &&
          !contract.vehiclePlate.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [activeTab, contracts, filters, searchQuery])

  const paginatedContracts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredContracts.slice(start, start + pageSize)
  }, [filteredContracts, currentPage, pageSize])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }]} />
      <PageHeader
        title="Contracts"
        subtitle="Portfolio view of champion contracts across every workflow stage"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-5 gap-2 shrink-0 mb-4">
        <StatCard
          title="All Contracts"
          value={stats.all.toLocaleString()}
          subtitle="Across all locations"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active Contracts"
          value={stats.active.toLocaleString()}
          subtitle="Currently in good standing"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Paused Contracts"
          value={stats.paused.toLocaleString()}
          subtitle="On hold or disputed"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Marked for Closure"
          value={stats.markedForClosure.toLocaleString()}
          subtitle="Pending final settlement"
          indicatorColor="var(--color-status-warning)"
        />
        <StatCard
          title="Completed"
          value={stats.completed.toLocaleString()}
          subtitle="Fully paid and closed"
          indicatorColor="var(--color-status-info)"
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
                  placeholder="Search by contract, champion, MAX ID or plate..."
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
              data={paginatedContracts}
              isLoading={isLoading}
              emptyMessage="No contracts found."
              onRowClick={isDetailTab ? (row) => setSelectedContract(row) : undefined}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredContracts.length / pageSize))}
            totalItems={filteredContracts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="contracts"
          />
        </div>
      </div>

      <ContractDetailSheet
        contract={selectedContract}
        isOpen={selectedContract !== null}
        onClose={() => setSelectedContract(null)}
        onUpdate={handleContractUpdate}
      />
    </>
  )
}
