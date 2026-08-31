import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { mockChairmanAllocations, type ChairmanAllocation } from "@/data/mockChairmanAllocations"
import { CITY_FILTER_OPTIONS } from "@/data/cities"

const mcpStats = [
  {
    title: "Total MCP Vehicles",
    value: 35,
    indicatorColor: "var(--color-status-warning)",
  },
  {
    title: "Avl. for Assignment",
    value: 1,
    indicatorColor: "var(--color-status-info)",
  },
  {
    title: "Pending Approval",
    value: 7,
    indicatorColor: "var(--color-status-warning)",
  },
  {
    title: "Asgn. to Chairmen",
    value: 28,
    indicatorColor: "var(--color-badge-active-text)",
  },
  {
    title: "Active Vehicles",
    value: 21,
    indicatorColor: "var(--color-badge-active-text)",
  },
  {
    title: "Inactive Vehicles",
    value: 5,
    indicatorColor: "var(--color-gray-500)",
  },
  {
    title: "Avg Utilization Rate",
    value: "75%",
    indicatorColor: "var(--color-status-info)",
  },
]

const filterSections: FilterSection[] = [
  {
    id: "chairmanStatus",
    title: "Chairman Status",
    defaultExpanded: true,
    options: [
      { value: "all", label: "All Chairmen (7)", color: "var(--color-foreground)" },
      { value: "Assigned", label: "Assigned (5)", color: "var(--color-badge-active-text)" },
      { value: "Pending Approval", label: "Pending Approval (2)", color: "var(--color-status-warning)" },
      { value: "Available for Assignment", label: "Available for Assignment (0)", color: "var(--color-status-info)" },
    ],
  },
  {
    id: "locations",
    title: "Locations",
    options: CITY_FILTER_OPTIONS,
  },
  {
    id: "subcities",
    title: "Subcities",
    options: [
      { value: "Bole", label: "Bole" },
      { value: "Kirkos", label: "Kirkos" },
      { value: "Arada", label: "Arada" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  chairmanStatus: [],
  locations: [],
  subcities: [],
}

function UtilizationBar({ rate }: { rate: number }) {
  const color = rate >= 70 ? "var(--color-success)" : rate >= 50 ? "var(--color-warning)" : "var(--color-danger)"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${rate}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-medium text-table-text" style={{ fontSize: "12px" }}>{rate}%</span>
    </div>
  )
}

const columns: ColumnDef<ChairmanAllocation>[] = [
  {
    accessorKey: "chairman",
    header: "Chairman Name / ID",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.chairmanName}</p>
        <p className="text-xs text-muted-foreground">{row.original.chairmanId}</p>
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
    accessorKey: "subcityPark",
    header: "Subcity / Park",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.subcityPark}</span>
    ),
  },
  {
    accessorKey: "dateAdded",
    header: "Date Added",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateAdded}</span>
    ),
  },
  {
    accessorKey: "vehiclesAssigned",
    header: "Vehicles Assigned",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.vehiclesAssigned}</span>
    ),
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const val = row.original.active
      return (
        <span
          className={val > 0 ? "font-medium text-status-success text-sm" : "font-medium text-table-text text-sm"}
        >
          {val}
        </span>
      )
    },
  },
  {
    accessorKey: "inactive",
    header: "Inactive",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.inactive}</span>
    ),
  },
  {
    accessorKey: "pending",
    header: "Pending",
    cell: ({ row }) => {
      const val = row.original.pending
      return (
        <span
          className={val > 0 ? "font-medium text-status-warning text-sm" : "font-medium text-table-text text-sm"}
        >
          {val}
        </span>
      )
    },
  },
  {
    accessorKey: "utilizationRate",
    header: "Utilization Rate",
    cell: ({ row }) => <UtilizationBar rate={row.original.utilizationRate} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const variantMap: Record<string, "success" | "warning" | "info"> = {
        Assigned: "success",
        "Pending Approval": "warning",
        "Available for Assignment": "info",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
]

export default function MCPManagementPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredChairmen = useMemo(() => {
    let result = mockChairmanAllocations

    const statusFilter = filters.chairmanStatus || []
    if (statusFilter.length > 0 && !statusFilter.includes("all")) {
      result = result.filter((c) => statusFilter.includes(c.status))
    }

    if (filters.locations?.length) {
      result = result.filter((c) => filters.locations!.includes(c.location))
    }
    if (filters.subcities?.length) {
      result = result.filter((c) => filters.subcities!.includes(c.subcityPark))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.chairmanName.toLowerCase().includes(q) ||
          c.chairmanId.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Deployment" }, { label: "MCP Management" }]}
      />
      <PageHeader
        title="MCP Management"
        subtitle="Monitor MCP vehicle allocation to chairmen and track utilization performance"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-7 gap-2 shrink-0">
          {mcpStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
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
                placeholder="Search chairman / ID..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredChairmen}
              onRowClick={(row) => navigate(`/mcp-management/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredChairmen.length / pageSize))}
            totalItems={filteredChairmen.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="chairmen"
          />
        </div>
      </div>
    </>
  )
}
