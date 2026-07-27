import { type ColumnDef } from "@tanstack/react-table"
import { StatusBadge, VehicleIcon } from "@/components/max"
import { type AuctionVehicle } from "@/data/mockAuction"
import { vehicleTypeLabel } from "@/lib/utils"

const conditionVariantMap: Record<AuctionVehicle["condition"], "success" | "warning" | "danger"> = {
  Excellent: "success",
  Fair: "warning",
  Salvage: "danger",
}

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
    {value}
  </span>
)

interface VehicleColumnsOptions {
  selectedVehicleIds: string[]
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
}

export function getVehicleColumns({
  selectedVehicleIds,
  allSelected,
  onToggle,
  onToggleAll,
}: VehicleColumnsOptions): ColumnDef<AuctionVehicle>[] {
  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label="Select all vehicles"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedVehicleIds.includes(row.original.id)}
          onChange={() => onToggle(row.original.id)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label={`Select ${row.original.vehicleId}`}
        />
      ),
    },
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
    { accessorKey: "plateNumber", header: "Plate No.", cell: ({ row }) => textCell(row.original.plateNumber) },
    { accessorKey: "makeModel", header: "Make / Model", cell: ({ row }) => textCell(row.original.makeModel) },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => (
        <StatusBadge variant={conditionVariantMap[row.original.condition] || "default"}>
          {row.original.condition}
        </StatusBadge>
      ),
    },
    { accessorKey: "score", header: "Score", cell: ({ row }) => textCell(row.original.score) },
    { accessorKey: "location", header: "Location", cell: ({ row }) => textCell(row.original.location) },
  ]
}
