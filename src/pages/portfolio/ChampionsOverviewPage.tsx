import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockPortfolioChampions,
  portfolioChampionStats,
  type PortfolioChampion,
  type RetrievalStatus,
  type ContractStatus,
} from "@/data/mockPortfolioChampions"

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

const retrievalVariant: Record<RetrievalStatus, BadgeVariant> = {
  "Good Standing": "success",
  Retrieved: "danger",
  Prepaid: "info",
  "Due for Retrieval": "warning",
  Overdue: "warning",
}

const contractVariant: Record<ContractStatus, BadgeVariant> = {
  Active: "success",
  Closed: "default",
  Initiated: "info",
  "Marked for Closure": "warning",
  Paused: "yard",
}

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

// Stat-card display config, sourced from the portfolio-wide totals in mockPortfolioChampions.ts
const championStats = [
  {
    title: "Total Champions",
    value: portfolioChampionStats.total.toLocaleString(),
    subtitle: "Across all locations",
    indicatorColor: "var(--color-brand-primary)",
  },
  {
    title: "Active Champions",
    value: portfolioChampionStats.active.toLocaleString(),
    subtitle: "Contract status active",
    indicatorColor: "var(--color-status-success)",
  },
  {
    title: "Inactive Champions",
    value: portfolioChampionStats.inactive.toLocaleString(),
    subtitle: "paused, initiated, marked",
    indicatorColor: "var(--color-status-warning)",
  },
  {
    title: "Champions with Contract Complete",
    value: portfolioChampionStats.contractComplete.toLocaleString(),
    subtitle: "Contract status closed",
    indicatorColor: "var(--color-status-info)",
  },
]

const uniqueLocations = [...new Set(mockPortfolioChampions.map((c) => c.location))].sort()
const retrievalOptions: RetrievalStatus[] = [
  "Good Standing",
  "Retrieved",
  "Prepaid",
  "Due for Retrieval",
  "Overdue",
]
const contractOptions: ContractStatus[] = [
  "Active",
  "Closed",
  "Initiated",
  "Marked for Closure",
  "Paused",
]

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: uniqueLocations.map((loc) => ({ value: loc, label: loc })),
  },
  {
    id: "retrievalStatus",
    title: "Retrieval Status",
    options: retrievalOptions.map((s) => ({ value: s, label: s })),
  },
  {
    id: "contractStatus",
    title: "Contract Status",
    options: contractOptions.map((s) => ({ value: s, label: s })),
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
  retrievalStatus: [],
  contractStatus: [],
}

const columns: ColumnDef<PortfolioChampion>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src="/images/champvatar.png"
          alt={row.original.name}
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.maxId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.contact}</span>
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
    accessorKey: "daysOverdue",
    header: "Days Overdue",
    cell: ({ row }) => {
      const days = row.original.daysOverdue
      if (days === null) return <span className="text-muted-foreground text-sm">—</span>
      return (
        <span
          className={`font-medium text-sm ${days > 30 ? "text-status-danger" : "text-status-warning"}`}
        >
          {days} d
        </span>
      )
    },
  },
  {
    accessorKey: "amountOverdue",
    header: "Amount Overdue",
    cell: ({ row }) => {
      const amount = row.original.amountOverdue
      if (amount === null) return <span className="text-muted-foreground text-sm">—</span>
      return <span className="font-medium text-table-text text-sm">{formatCurrency(amount)}</span>
    },
  },
  {
    accessorKey: "lastRemittance",
    header: "Last Remittance",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">
        {formatCurrency(row.original.lastRemittance)}
      </span>
    ),
  },
  {
    accessorKey: "dateOfLastRemittance",
    header: "Date of Last Remittance",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">
        {row.original.dateOfLastRemittance}
      </span>
    ),
  },
  {
    accessorKey: "retrievalStatus",
    header: "Retrieval Status",
    cell: ({ row }) => (
      <StatusBadge variant={retrievalVariant[row.original.retrievalStatus]}>
        {row.original.retrievalStatus}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "contractStatus",
    header: "Contract Status",
    cell: ({ row }) => (
      <StatusBadge variant={contractVariant[row.original.contractStatus]}>
        {row.original.contractStatus}
      </StatusBadge>
    ),
  },
]

export default function ChampionsOverviewPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredChampions = useMemo(() => {
    setCurrentPage(1)
    return mockPortfolioChampions.filter((champion) => {
      if (filters.location.length > 0 && !filters.location.includes(champion.location)) return false
      if (
        filters.retrievalStatus.length > 0 &&
        !filters.retrievalStatus.includes(champion.retrievalStatus)
      )
        return false
      if (
        filters.contractStatus.length > 0 &&
        !filters.contractStatus.includes(champion.contractStatus)
      )
        return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !champion.name.toLowerCase().includes(q) &&
          !champion.maxId.toLowerCase().includes(q) &&
          !champion.contact.includes(q)
        )
          return false
      }
      return true
    })
  }, [filters, searchQuery])

  const paginatedChampions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredChampions.slice(start, start + pageSize)
  }, [filteredChampions, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Champions" },
          { label: "Champion Overview" },
        ]}
      />
      <PageHeader
        title="Champions Overview"
        subtitle="Portfolio view of champion contracts, remittances and retrieval status"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        {championStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
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
                  placeholder="Search by name, MAX ID or phone..."
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
              data={paginatedChampions}
              onRowClick={(row) => navigate(`/portfolio/champions/overview/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredChampions.length / pageSize))}
            totalItems={filteredChampions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="champions"
          />
        </div>
      </div>
    </>
  )
}
