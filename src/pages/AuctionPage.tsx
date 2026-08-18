import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  Toast,
  useToast,
  ConfirmModal,
  GenericFilterPopover,
  getActiveFilterCount,
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

import { mockAuctionEvents, type AuctionEvent } from "@/data/mockAuction"
import { CITY_DEPOT_OPTIONS } from "@/data/cities"

const statusVariantMap: Record<AuctionEvent["status"], "success" | "info" | "default"> = {
  Active: "success",
  Upcoming: "info",
  Closed: "default",
}

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Active", label: "Active" },
      { value: "Upcoming", label: "Upcoming" },
      { value: "Closed", label: "Closed" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_DEPOT_OPTIONS,
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
  location: [],
}

export default function AuctionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { message, variant, showToast } = useToast()

  useEffect(() => {
    const state = location.state as { toast?: string } | null
    if (state?.toast) {
      showToast(state.toast, "success")
      window.history.replaceState({}, "")
    }
  }, [location.state, showToast])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<AuctionEvent | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      showToast(`${cancelTarget.title} has been cancelled.`, "success")
    }
    setCancelTarget(null)
  }

  const columns: ColumnDef<AuctionEvent>[] = [
    {
      accessorKey: "title",
      header: "Auction Title",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.location}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.startDate}
        </span>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: "vehicles",
      header: "Vehicles",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.vehicles}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={statusVariantMap[row.original.status] || "default"}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status !== "Upcoming" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/auction/${row.original.id}`)
              }}
            >
              View
            </Button>
          )}
          {row.original.status !== "Closed" && (
            <Button
              size="sm"
              className="bg-badge-inactive-bg text-badge-inactive-text hover:bg-badge-inactive-bg/80"
              onClick={(e) => {
                e.stopPropagation()
                setCancelTarget(row.original)
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ]

  const counts = useMemo(() => {
    return {
      active: mockAuctionEvents.filter((a) => a.status === "Active").length,
      upcoming: mockAuctionEvents.filter((a) => a.status === "Upcoming").length,
      closed: mockAuctionEvents.filter((a) => a.status === "Closed").length,
    }
  }, [])

  const filteredEvents = useMemo(() => {
    let result = mockAuctionEvents

    if (filters.status?.length) {
      result = result.filter((a) => filters.status!.includes(a.status))
    }
    if (filters.location?.length) {
      result = result.filter((a) => filters.location!.includes(a.location))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery])

  return (
    <>
      <Toast message={message} variant={variant} />
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Auction" }]}
      />

      <div className="relative shrink-0">
        <PageHeader
          title="Auction Events"
          subtitle="Manage, monitor and create auction events"
        />
        <div className="absolute right-6 top-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => navigate("/auction/create")}
          >
            <Plus className="h-4 w-4" />
            Create Auction
          </Button>
        </div>
      </div>

      <div className="px-6 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <StatCard
            title="Active"
            value={counts.active}
            indicatorColor="var(--color-badge-active-text)"
          />
          <StatCard
            title="Upcoming"
            value={counts.upcoming}
            indicatorColor="var(--color-status-info)"
          />
          <StatCard
            title="Closed This Month"
            value={7}
            indicatorColor="var(--color-gray-400)"
          />
        </div>

        <div className="mt-4 flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
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
                <PopoverContent className="w-auto p-2" align="start" side="bottom" avoidCollisions={false}>
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
                    placeholder="Search title or location..."
                    className="h-9 w-48"
                    autoFocus
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

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredEvents}
              onRowClick={(row) => navigate(`/auction/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredEvents.length / pageSize))}
            totalItems={filteredEvents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="auctions"
          />
        </div>
      </div>

      <ConfirmModal
        open={!!cancelTarget}
        onOpenChange={(open) => { if (!open) setCancelTarget(null) }}
        variant="destructive"
        title="Cancel this auction event?"
        subtitle={
          cancelTarget
            ? `"${cancelTarget.title}" will be cancelled. This action cannot be undone.`
            : ""
        }
        primaryAction={{
          label: "Yes, cancel auction",
          onClick: handleConfirmCancel,
        }}
        secondaryAction={{
          label: "Keep auction",
          onClick: () => setCancelTarget(null),
        }}
      />
    </>
  )
}
