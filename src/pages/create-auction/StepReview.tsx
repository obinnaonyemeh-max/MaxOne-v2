import { type ColumnDef } from "@tanstack/react-table"
import { Banner, DataTable, InfoCard, InfoGrid, StatusBadge, VehicleIcon } from "@/components/max"
import { type AuctionVehicle } from "@/data/mockAuction"
import { vehicleTypeLabel } from "@/lib/utils"
import type { AuctionForm } from "./types"

const conditionVariantMap: Record<AuctionVehicle["condition"], "success" | "warning" | "danger"> = {
  Excellent: "success",
  Fair: "warning",
  Salvage: "danger",
}

interface StepReviewProps {
  form: AuctionForm
  selectedVehicles: AuctionVehicle[]
  buyoutPrices: Record<string, string>
}

export function StepReview({ form, selectedVehicles, buyoutPrices }: StepReviewProps) {
  const minBidDisplay = form.minBid ? `₦${form.minBid}` : "—"

  const columns: ColumnDef<AuctionVehicle>[] = [
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
      accessorKey: "makeModel",
      header: "Make / Model",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.makeModel}
        </span>
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
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => (
        <StatusBadge variant={conditionVariantMap[row.original.condition] || "default"}>
          {row.original.condition}
        </StatusBadge>
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
      id: "buyoutPrice",
      header: "Buyout Price",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {buyoutPrices[row.original.id] ? `₦${buyoutPrices[row.original.id]}` : "—"}
        </span>
      ),
    },
    {
      id: "minBid",
      header: "Min Bid",
      cell: () => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {minBidDisplay}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Banner
        variant="info"
        title="Once published, auction status will be Upcoming"
        description="Bidders notified 2 weeks before start date."
      />

      <InfoCard title="Auction Summary">
        <InfoGrid
          columns={2}
          showDividers
          items={[
            { label: "Title", value: form.title || "—" },
            { label: "Location", value: form.location || "—" },
            { label: "Start date", value: form.startDate ? form.startDate.toLocaleDateString("en-GB") : "—" },
            { label: "End date", value: form.endDate ? form.endDate.toLocaleDateString("en-GB") : "—" },
            { label: "Min bid price", value: minBidDisplay },
            { label: "Vehicles assigned", value: `${selectedVehicles.length} vehicles` },
          ]}
        />
      </InfoCard>

      <div>
        <h3 className="font-semibold text-sidebar-item-active mb-3" style={{ fontSize: "16px" }}>
          Assigned Vehicles
        </h3>
        <div className="overflow-x-auto rounded-lg border border-table-border pt-2">
          <DataTable columns={columns} data={selectedVehicles} />
        </div>
      </div>
    </div>
  )
}
