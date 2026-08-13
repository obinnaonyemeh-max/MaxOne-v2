import { type ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { StatusBadge } from "@/components/max"
import type {
  ManufacturerRecord,
  VehicleTypeRecord,
  ModelRecord,
  TrimRecord,
} from "@/data/mockStockSetup"

type RowActions<T> = {
  onEdit?: (row: T) => void
}

function RowActionButtons<T>({ row, actions }: { row: T; actions: RowActions<T> }) {
  if (!actions.onEdit) return null
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          actions.onEdit?.(row)
        }}
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  )
}

function primaryCell(value: string) {
  return (
    <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
      {value}
    </span>
  )
}

function secondaryCell(value: string) {
  return (
    <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
      {value}
    </span>
  )
}

function withOptionalActions<T>(
  cols: ColumnDef<T>[],
  actions: RowActions<T>
): ColumnDef<T>[] {
  if (!actions.onEdit) return cols
  return [
    ...cols,
    { id: "actions", header: "", cell: ({ row }) => <RowActionButtons row={row.original} actions={actions} /> },
  ]
}

export function getManufacturerColumns(actions: RowActions<ManufacturerRecord>): ColumnDef<ManufacturerRecord>[] {
  return withOptionalActions(
    [
      { accessorKey: "name", header: "Name", cell: ({ row }) => primaryCell(row.original.name) },
      { accessorKey: "brand", header: "Brand", cell: ({ row }) => secondaryCell(row.original.brand) },
      { accessorKey: "country", header: "Country", cell: ({ row }) => secondaryCell(row.original.country) },
      { accessorKey: "contact", header: "Contact", cell: ({ row }) => secondaryCell(row.original.contact) },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge variant="success">
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </StatusBadge>
        ),
      },
    ],
    actions
  )
}

export function getVehicleTypeColumns(actions: RowActions<VehicleTypeRecord>): ColumnDef<VehicleTypeRecord>[] {
  return withOptionalActions(
    [
      { accessorKey: "name", header: "Name", cell: ({ row }) => primaryCell(row.original.name) },
      { accessorKey: "vehicleType", header: "Vehicle Type", cell: ({ row }) => secondaryCell(row.original.vehicleType) },
      { accessorKey: "model", header: "Model", cell: ({ row }) => secondaryCell(row.original.model) },
      { accessorKey: "manufacturer", header: "Manufacturer", cell: ({ row }) => secondaryCell(row.original.manufacturer) },
      { accessorKey: "trim", header: "Trim", cell: ({ row }) => secondaryCell(row.original.trim) },
      { accessorKey: "category", header: "Category", cell: ({ row }) => secondaryCell(row.original.category) },
      { accessorKey: "battery", header: "Battery", cell: ({ row }) => secondaryCell(row.original.battery) },
      { accessorKey: "range", header: "Range", cell: ({ row }) => secondaryCell(row.original.range) },
    ],
    actions
  )
}

export function getModelColumns(actions: RowActions<ModelRecord>): ColumnDef<ModelRecord>[] {
  return withOptionalActions(
    [
      { accessorKey: "manufacturer", header: "Manufacturer", cell: ({ row }) => primaryCell(row.original.manufacturer) },
      { accessorKey: "modelName", header: "Model Name", cell: ({ row }) => secondaryCell(row.original.modelName) },
    ],
    actions
  )
}

export function getTrimColumns(actions: RowActions<TrimRecord>): ColumnDef<TrimRecord>[] {
  return withOptionalActions(
    [
      { accessorKey: "model", header: "Model", cell: ({ row }) => primaryCell(row.original.model) },
      { accessorKey: "trimName", header: "Trim Name", cell: ({ row }) => secondaryCell(row.original.trimName) },
    ],
    actions
  )
}
