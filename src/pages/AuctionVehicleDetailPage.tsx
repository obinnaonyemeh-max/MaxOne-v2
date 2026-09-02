import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { TopBar, BackButton, StatusBadge, InfoCard, InfoGrid, DataTable } from "@/components/max"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { mockAuctionEvents, getAuctionVehicleDetail, type BidHistoryEntry } from "@/data/mockAuction"
import { ConditionAssessment } from "./auction-detail/ConditionAssessment"

const bidHistoryColumns: ColumnDef<BidHistoryEntry>[] = [
  {
    accessorKey: "bidderId",
    header: "Bidder ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.bidderId}
      </span>
    ),
  },
  {
    accessorKey: "bidAmount",
    header: "Bid Amount",
    cell: ({ row }) => (
      <span
        className={cn(
          "text-table-text-primary",
          row.original.status === "Leading" ? "font-semibold" : "font-medium"
        )}
        style={{ fontSize: "14px" }}
      >
        {row.original.bidAmount}
      </span>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.time}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={row.original.status === "Leading" ? "success" : "default"}>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

function formatAuctionDates(start?: string, end?: string): string {
  if (!start || !end) return start ?? end ?? "-"
  const [startDay, startMon, startYear] = start.split(" ")
  const [endDay, endMon, endYear] = end.split(" ")
  if (startMon === endMon && startYear === endYear) {
    return `${startDay}–${endDay} ${endMon} ${endYear}`
  }
  return `${start} – ${end}`
}

export default function AuctionVehicleDetailPage() {
  const { id, vehicleId } = useParams<{ id: string; vehicleId: string }>()
  const navigate = useNavigate()
  const { filterByCity } = useRoleSimulation()

  const event = mockAuctionEvents.find((e) => e.id === id)
  const vehicle = vehicleId ? getAuctionVehicleDetail(vehicleId) : null

  useEffect(() => {
    if (vehicle && !filterByCity(vehicle.location)) {
      navigate("/auction", { replace: true })
    }
  }, [filterByCity, navigate, vehicle])

  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    if (!vehicle) return
    setRemaining(vehicle.bidEndsInSeconds)
    const timer = setInterval(() => setRemaining((prev) => (prev > 0 ? prev - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [vehicle?.bidEndsInSeconds])

  if (!vehicle) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Auction" }]} />
        <div className="px-6 py-12 text-center text-muted-foreground">Vehicle not found.</div>
      </>
    )
  }

  const [mainPhoto, ...sidePhotos] = vehicle.photos
  const isSold = vehicle.status === "Sold"
  const fromDisposal = id === "disposal"

  return (
    <>
      <TopBar
        breadcrumbs={
          fromDisposal
            ? [
                { label: "Lifecycle" },
                { label: "Disposal & Auction" },
                { label: "Disposal Management" },
                { label: vehicle.vehicleId },
              ]
            : [
                { label: "Lifecycle" },
                { label: "Disposal & Auction" },
                { label: "Auction" },
                { label: event?.title ?? "Auction" },
                { label: vehicle.vehicleId },
              ]
        }
      />

      <header className="px-6 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <BackButton
            onClick={() => navigate(fromDisposal ? "/disposal-management" : id ? `/auction/${id}` : "/auction")}
          />
          <h1 className="flex items-center gap-2 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
            {vehicle.year} {vehicle.makeModel} · {vehicle.vehicleId}
            <StatusBadge variant={vehicle.statusVariant}>{vehicle.status}</StatusBadge>
          </h1>
        </div>
      </header>

      <div className="px-6 flex flex-col flex-1 min-h-0 overflow-y-auto pb-8">
        <div className="grid grid-cols-3 grid-rows-1 gap-2 shrink-0" style={{ height: "350px" }}>
          <div className="col-span-2 overflow-hidden rounded-lg border border-content-card-border">
            <img src={mainPhoto} alt={`${vehicle.makeModel} main`} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {sidePhotos.map((photo, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-lg border border-content-card-border"
              >
                <img src={photo} alt={`${vehicle.makeModel} ${i + 2}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-6">
          <div className="flex-1 min-w-0">
        <Tabs defaultValue="vehicle-info" className="flex flex-col">
          <TabsList variant="line" className="shrink-0 pb-0 gap-0 w-fit">
            <TabsTrigger value="vehicle-info" className="px-4 py-2" style={{ fontSize: "14px" }}>
              Vehicle Information
            </TabsTrigger>
            <TabsTrigger value="sale-info" className="px-4 py-2" style={{ fontSize: "14px" }}>
              Sale Information
            </TabsTrigger>
            <TabsTrigger value="condition" className="px-4 py-2" style={{ fontSize: "14px" }}>
              Condition Assessment
            </TabsTrigger>
            <TabsTrigger value="bid-history" className="px-4 py-2" style={{ fontSize: "14px" }}>
              Bid History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle-info" className="mt-4">
            <InfoCard title="Vehicle Information">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Vehicle ID", value: vehicle.vehicleId },
                  {
                    label: "Plate Number",
                    value: <span className="text-status-info">{vehicle.plateNumber}</span>,
                  },
                  { label: "VIN", value: vehicle.vin },
                  { label: "Location", value: vehicle.location },
                  { label: "Make / Model", value: vehicle.makeModel },
                  { label: "Year", value: vehicle.year },
                  { label: "Type", value: `${vehicle.type} · ${vehicle.fuel}` },
                  { label: "Body Style", value: vehicle.bodyStyle },
                  { label: "Engine", value: vehicle.engine },
                  { label: "Transmission", value: vehicle.transmission },
                  { label: "Colour", value: vehicle.colour },
                  { label: "Odometer", value: vehicle.odometer },
                  { label: "Loss Type", value: vehicle.lossType },
                  { label: "Title Status", value: vehicle.titleStatus },
                  { label: "Key Status", value: vehicle.keyStatus },
                  {
                    label: "Condition",
                    value: (
                      <span className="flex items-center gap-1.5">
                        <StatusBadge variant="success">{vehicle.condition}</StatusBadge>
                        <span className="text-breadcrumb-root">({vehicle.conditionScore})</span>
                      </span>
                    ),
                  },
                ]}
              />
            </InfoCard>

            <InfoCard title="Vehicle Description" className="mt-4">
              <p className="text-sm leading-relaxed text-table-text">{vehicle.description}</p>
            </InfoCard>
          </TabsContent>

          <TabsContent value="sale-info" className="mt-4">
            <InfoCard title="Sale Information">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Location", value: vehicle.location },
                  { label: "Auction", value: event?.title ?? "-" },
                  { label: "Auction Date", value: formatAuctionDates(event?.startDate, event?.endDate) },
                  { label: "ACV", value: vehicle.acv },
                  { label: "Seller", value: vehicle.seller },
                ]}
              />
            </InfoCard>
          </TabsContent>

          <TabsContent value="condition" className="mt-4">
            <ConditionAssessment parts={vehicle.conditionParts} />
          </TabsContent>

          <TabsContent value="bid-history" className="mt-4">
            <div className="rounded-lg border border-table-border overflow-x-auto py-2">
              <DataTable columns={bidHistoryColumns} data={vehicle.bidHistory} />
            </div>
          </TabsContent>
        </Tabs>
          </div>

          <aside className="w-80 shrink-0 self-start sticky top-0">
          <InfoCard title="Bid Information">
            <div>
              {[
                {
                  label: "Current Bid",
                  value: (
                    <span className="text-lg font-bold tabular-nums text-sidebar-item-active">
                      {vehicle.currentBid}
                    </span>
                  ),
                },
                { label: "Number of Bids", value: vehicle.numberOfBids },
                { label: "Min Increment", value: vehicle.minIncrement },
                {
                  label: "Time Remaining",
                  value: isSold ? (
                    <span className="text-sm font-medium text-sidebar-item-active">Auction Closed</span>
                  ) : (
                    <span className="text-lg font-bold tabular-nums text-sidebar-item-active">
                      {formatHMS(remaining)}
                    </span>
                  ),
                },
                {
                  label: "Auction Status",
                  value: <StatusBadge variant={vehicle.statusVariant}>{vehicle.status}</StatusBadge>,
                },
                {
                  label: "VAMS Status",
                  value: (
                    <StatusBadge variant="warning">
                      {isSold ? "Awaiting Pickup" : vehicle.vamsStatus}
                    </StatusBadge>
                  ),
                },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn("py-3 first:pt-0", i < arr.length - 1 && "border-b border-gray-100")}
                >
                  <p className="text-xs font-medium text-breadcrumb-root">{row.label}</p>
                  <div className="mt-1 font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
          </aside>
        </div>
      </div>
    </>
  )
}
