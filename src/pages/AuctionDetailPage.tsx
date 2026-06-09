import { useState, useMemo, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  BackButton,
  DataTable,
  StatusBadge,
  Pagination,
  Banner,
  ConfirmModal,
  VehicleIcon,
  GenericFilterPopover,
  getActiveFilterCount,
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
  mockAuctionEvents,
  mockAuctionAllocations,
  mockAuctionClosedResults,
  allocationFilterSections,
  defaultAllocationFilters,
  type AllocationVehicle,
} from "@/data/mockAuction"
import { vehicleTypeLabel } from "@/lib/utils"
import { ClosedAllocationResults } from "./auction-detail/ClosedAllocationResults"

const statusVariantMap: Record<AllocationVehicle["auctionStatus"], "success" | "info" | "warning"> = {
  Available: "success",
  Sold: "info",
  Reserved: "warning",
}

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "Closed"
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${h}h ${pad(m)}m ${pad(s)}s`
}

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const event = mockAuctionEvents.find((e) => e.id === id)
  const allocation = mockAuctionAllocations.find((a) => a.eventId === id)
  const closedResult = mockAuctionClosedResults.find((r) => r.eventId === id)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultAllocationFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [remaining, setRemaining] = useState(allocation?.endsInSeconds ?? 0)
  const [showCancel, setShowCancel] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const isActive = event?.status === "Active"
  const isUpcoming = event?.status === "Upcoming"
  const isClosed = event?.status === "Closed"
  const canCancel = event?.status === "Active" || event?.status === "Upcoming"

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  const vehicles = allocation?.vehicles ?? []

  const renderWinningBid = (vehicle: AllocationVehicle) => {
    if (isUpcoming) {
      return <span className="text-gray-400" style={{ fontSize: "14px" }}>-</span>
    }
    if (isActive) {
      return (
        <span className="italic text-gray-400" style={{ fontSize: "14px" }}>
          {vehicle.bids > 0 ? "Hidden — auction active" : "No bids yet"}
        </span>
      )
    }
    if (vehicle.bids === 0 || !vehicle.winningBid) {
      return (
        <span className="italic text-gray-400" style={{ fontSize: "14px" }}>
          No bids
        </span>
      )
    }
    return (
      <span className="font-semibold text-table-text-primary" style={{ fontSize: "14px" }}>
        {vehicle.winningBid}
      </span>
    )
  }

  const columns: ColumnDef<AllocationVehicle>[] = [
    {
      accessorKey: "vehicleId",
      header: "Vehicle ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <VehicleIcon assetType={row.original.type} />
          <div>
            <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{vehicleTypeLabel(row.original.type)}</p>
            <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.vehicleId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "plateNumber",
      header: "Plate No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.plateNumber}
        </span>
      ),
    },
    {
      accessorKey: "makeModel",
      header: "Make / Model",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.makeModel}
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
      accessorKey: "auctionStatus",
      header: "Auction Status",
      cell: ({ row }) =>
        isUpcoming ? (
          <StatusBadge variant="info">Upcoming</StatusBadge>
        ) : (
          <StatusBadge variant={statusVariantMap[row.original.auctionStatus] || "default"}>
            {row.original.auctionStatus}
          </StatusBadge>
        ),
    },
    {
      accessorKey: "bids",
      header: "Bids",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {isUpcoming ? "-" : row.original.bids}
        </span>
      ),
    },
    {
      accessorKey: "winningBid",
      header: "Winning Bid",
      cell: ({ row }) => renderWinningBid(row.original),
    },
  ]

  const filteredVehicles = useMemo(() => {
    let result = vehicles

    if (filters.auctionStatus?.length) {
      result = result.filter((v) => filters.auctionStatus!.includes(v.auctionStatus))
    }
    if (filters.type?.length) {
      result = result.filter((v) => filters.type!.includes(v.type))
    }
    if (filters.location?.length) {
      result = result.filter((v) => filters.location!.includes(v.location))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (v) =>
          v.vehicleId.toLowerCase().includes(q) ||
          v.plateNumber.toLowerCase().includes(q) ||
          v.makeModel.toLowerCase().includes(q)
      )
    }

    return result
  }, [vehicles, filters, searchQuery])

  if (!event) {
    return (
      <>
        <TopBar
          breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Auction" }]}
        />
        <div className="px-6 py-12 text-center text-muted-foreground">Auction not found.</div>
      </>
    )
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Lifecycle" },
          { label: "Disposal & Auction" },
          { label: "Auction" },
          { label: event.title },
        ]}
      />

      <div className="relative shrink-0">
        <header className="px-6 py-6">
          <div className="flex items-center gap-3">
            <BackButton onClick={() => navigate("/auction")} />
            <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
              Allocation Results
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
          </div>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root">
            {event.title} · {event.status} · {event.vehicles} vehicles
          </p>
        </header>
        {canCancel && (
          <div className="absolute right-6 top-6">
            <Button
              className="h-10 bg-badge-inactive-bg text-badge-inactive-text hover:bg-badge-inactive-bg/80"
              onClick={() => setShowCancel(true)}
            >
              Cancel Auction
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-6">
        {isClosed && closedResult ? (
          <ClosedAllocationResults
            result={closedResult}
            onVehicleClick={(vid) => navigate(`/auction/${id}/vehicle/${vid}`)}
          />
        ) : (
        <>
        {isActive && (
          <Banner
            variant="warning"
            title="Auction Active"
            description="Bid amounts hidden until auction closes. Allocation results appear at close."
            className="shrink-0"
          />
        )}

        {isUpcoming && (
          <Banner
            variant="info"
            title="Auction Upcoming"
            description={`Bidding has not started. Vehicles are listed below and open for bids on ${event.startDate}.`}
            className="shrink-0"
          />
        )}

        <div className="mt-4 grid grid-cols-4 gap-2 shrink-0">
          <StatCard
            title="Total Vehicles"
            value={event.vehicles}
            indicatorColor="var(--color-gray-400)"
          />
          <StatCard
            title="Bids Placed"
            value={allocation?.bidsPlaced ?? 0}
            indicatorColor="var(--color-status-info)"
          />
          <StatCard
            title="Unique Bidders"
            value={allocation?.uniqueBidders ?? 0}
            indicatorColor="var(--color-gray-400)"
          />
          <StatCard
            title="Time Remaining"
            value={isActive ? formatCountdown(remaining) : isUpcoming ? "Not started" : "Closed"}
            indicatorColor="var(--color-status-success)"
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
                <PopoverContent className="w-auto p-2" align="start">
                  <GenericFilterPopover
                    sections={allocationFilterSections}
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
                    placeholder="Search vehicle, plate or model..."
                    className="h-9 w-56"
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
              data={filteredVehicles}
              emptyMessage="No vehicles in this auction."
              onRowClick={(row) => navigate(`/auction/${id}/vehicle/${row.vehicleId}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredVehicles.length / pageSize))}
            totalItems={filteredVehicles.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="vehicles"
          />
        </div>
        </>
        )}
      </div>

      <ConfirmModal
        open={showCancel}
        onOpenChange={setShowCancel}
        variant="destructive"
        title="Cancel this auction event?"
        subtitle={`"${event.title}" will be cancelled. This action cannot be undone.`}
        primaryAction={{
          label: "Yes, cancel auction",
          onClick: () =>
            navigate("/auction", {
              state: { toast: `${event.title} has been cancelled.` },
            }),
        }}
        secondaryAction={{
          label: "Keep auction",
          onClick: () => setShowCancel(false),
        }}
      />
    </>
  )
}
