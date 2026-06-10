import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"

import { Banner, DataTable, StatusBadge, VehicleIcon } from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { vehicleTypeLabel } from "@/lib/utils"
import type {
  AuctionClosedResult,
  AllocatedVehicle,
  UnallocatedVehicle,
} from "@/data/mockAuction"

function identityCell(type: string, vehicleId: string) {
  return (
    <div className="flex items-center gap-3">
      <VehicleIcon assetType={type} />
      <div>
        <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{vehicleTypeLabel(type)}</p>
        <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{vehicleId}</p>
      </div>
    </div>
  )
}

function textCell(value: string) {
  return (
    <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
      {value}
    </span>
  )
}

const paymentVariant: Record<AllocatedVehicle["payment"], "success" | "warning"> = {
  Paid: "success",
  Awaiting: "warning",
}

const statusVariant: Record<AllocatedVehicle["status"], "info" | "warning"> = {
  Sold: "info",
  Secured: "warning",
}

function AllocatedAction({ action }: { action: AllocatedVehicle["action"] }) {
  if (action === "Reallocate") {
    return (
      <Button
        size="sm"
        className="bg-badge-inactive-bg text-badge-inactive-text hover:bg-badge-inactive-bg/80"
        onClick={(e) => e.stopPropagation()}
      >
        Reallocate
      </Button>
    )
  }
  if (action === "Collected") {
    return textCell("Collected")
  }
  return (
    <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
      {action}
    </Button>
  )
}

const allocatedColumns: ColumnDef<AllocatedVehicle>[] = [
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => identityCell(row.original.type, row.original.vehicleId),
  },
  { accessorKey: "plateNumber", header: "Plate No.", cell: ({ row }) => textCell(row.original.plateNumber) },
  { accessorKey: "makeModel", header: "Make / Model", cell: ({ row }) => textCell(row.original.makeModel) },
  { accessorKey: "location", header: "Location", cell: ({ row }) => textCell(row.original.location) },
  { accessorKey: "winner", header: "Winner", cell: ({ row }) => textCell(row.original.winner) },
  {
    accessorKey: "winningBid",
    header: "Winning Bid",
    cell: ({ row }) => (
      <span className="font-semibold text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.winningBid}
      </span>
    ),
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => (
      <StatusBadge variant={paymentVariant[row.original.payment]}>{row.original.payment}</StatusBadge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariant[row.original.status]}>{row.original.status}</StatusBadge>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <AllocatedAction action={row.original.action} />,
  },
]

function makeUnallocatedColumns(
  onReturnToPool: (vehicleId: string) => void
): ColumnDef<UnallocatedVehicle>[] {
  return [
    {
      accessorKey: "vehicleId",
      header: "Vehicle ID",
      cell: ({ row }) => identityCell(row.original.type, row.original.vehicleId),
    },
    { accessorKey: "plateNumber", header: "Plate No.", cell: ({ row }) => textCell(row.original.plateNumber) },
    { accessorKey: "makeModel", header: "Make / Model", cell: ({ row }) => textCell(row.original.makeModel) },
    { accessorKey: "location", header: "Location", cell: ({ row }) => textCell(row.original.location) },
    { accessorKey: "reason", header: "Reason", cell: ({ row }) => textCell(row.original.reason) },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onReturnToPool(row.original.vehicleId)
            }}
          >
            Return to Pool
          </Button>
        </div>
      ),
    },
  ]
}

const sectionLabel = "text-xs font-semibold uppercase tracking-wide text-gray-400"
const tableCard = "mt-2 rounded-t-[14px] rounded-b-[4px] border border-table-border overflow-x-auto py-2"

interface ClosedAllocationResultsProps {
  result: AuctionClosedResult
  onVehicleClick: (vehicleId: string) => void
}

export function ClosedAllocationResults({ result, onVehicleClick }: ClosedAllocationResultsProps) {
  const [unallocatedVehicles, setUnallocatedVehicles] = useState(result.unallocatedVehicles)

  const handleReturnToPool = (vehicleId: string) => {
    setUnallocatedVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicleId))
  }

  const unallocatedColumns = makeUnallocatedColumns(handleReturnToPool)

  return (
    <>
      <Banner
        variant="success"
        title="Auction closed. Allocation complete."
        description="Winner notifications sent. Bid data now visible."
        className="shrink-0"
      />

      <div className="mt-4 grid grid-cols-4 gap-2 shrink-0">
        <StatCard title="Allocated" value={result.allocated} indicatorColor="var(--color-status-success)" />
        <StatCard title="Unallocated" value={unallocatedVehicles.length} indicatorColor="var(--color-status-danger)" />
        <StatCard title="Total Revenue" value={result.totalRevenue} indicatorColor="var(--color-status-info)" />
        <StatCard title="Fill Rate" value={`${result.fillRate}%`} indicatorColor="var(--color-gray-400)" />
      </div>

      <div className="mt-6">
        <p className={sectionLabel}>Allocated Vehicles</p>
        <div className={tableCard}>
          <DataTable
            columns={allocatedColumns}
            data={result.allocatedVehicles}
            onRowClick={(row) => onVehicleClick(row.vehicleId)}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className={sectionLabel}>Unallocated Vehicles</p>
        <div className={tableCard}>
          <DataTable
            columns={unallocatedColumns}
            data={unallocatedVehicles}
            emptyMessage="All vehicles were allocated."
            onRowClick={(row) => onVehicleClick(row.vehicleId)}
          />
        </div>
      </div>
    </>
  )
}
