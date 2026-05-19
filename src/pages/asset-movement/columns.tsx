import { type ColumnDef } from "@tanstack/react-table"
import { StatusBadge } from "@/components/max"
import type {
  CheckInRecord,
  CheckoutRecord,
  MovementLogRecord,
} from "@/data/mockAssetMovement"

function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

function VehicleIcon({ assetType }: { assetType: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
      <img src={getVehicleIcon(assetType)} alt={assetType} className="h-5 w-5" />
    </div>
  )
}

export const checkInColumns: ColumnDef<CheckInRecord>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "checkInType",
    header: "Check-In Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.checkInType}</span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.reason}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.checkInDate}</span>
    ),
  },
  {
    accessorKey: "days",
    header: "Days",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.days}</span>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.sla}</span>
    ),
  },
  {
    accessorKey: "breachStatus",
    header: "Breach Status",
    cell: ({ row }) => {
      const status = row.original.breachStatus
      const variantMap: Record<string, "success" | "warning" | "danger"> = {
        "Within SLA": "success",
        "Near SLA": "warning",
        "Breached": "danger",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "nextAction",
    header: "Next Action",
    cell: ({ row }) => {
      const action = row.original.nextAction
      const variantMap: Record<string, "danger" | "warning" | "info" | "default"> = {
        "Deactivate": "danger",
        "Follow Up": "warning",
        "Escalate": "warning",
        "Assessment Required": "info",
        "Monitor": "default",
      }
      return <StatusBadge variant={variantMap[action]}>{action}</StatusBadge>
    },
  },
]

export const checkoutColumns: ColumnDef<CheckoutRecord>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.plateNumber}</span>
    ),
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.checkInDate}</span>
    ),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-Out Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.checkOutDate}</span>
    ),
  },
  {
    accessorKey: "checkInReason",
    header: "Check-In Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.checkInReason}</span>
    ),
  },
  {
    accessorKey: "checkOutStatus",
    header: "Check-Out Status",
    cell: ({ row }) => {
      const status = row.original.checkOutStatus
      const variantMap: Record<string, "success" | "warning" | "danger" | "info"> = {
        "Active Vehicle": "success",
        "OEM Outbound": "warning",
        "Outright Sale": "danger",
        "Operational Vehicle": "info",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "officer",
    header: "Officer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.officer}</span>
    ),
  },
]

export const movementLogColumns: ColumnDef<MovementLogRecord>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.timestamp}</span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.plateNumber}</span>
    ),
  },
  {
    accessorKey: "movementType",
    header: "Movement Type",
    cell: ({ row }) => {
      const type = row.original.movementType
      const variant = type === "Check-Out" ? "success" : "warning"
      return <StatusBadge variant={variant}>{type}</StatusBadge>
    },
  },
  {
    accessorKey: "movementReason",
    header: "Movement Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.movementReason}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "officer",
    header: "Officer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.officer}</span>
    ),
  },
  {
    accessorKey: "referenceSource",
    header: "Reference Source",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.referenceSource}</span>
    ),
  },
]
