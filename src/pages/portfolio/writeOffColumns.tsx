import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"

import { StatusBadge } from "@/components/max"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type WriteOffBatch, writeOffStatusVariantMap } from "@/data/mockWriteOffBatches"

export type SortKey = "referenceId" | "submittedBy" | "provisionAmount" | "dateAdded" | "status"
export type SortDirection = "asc" | "desc"

export function formatProvisionAmount(amount: number): string {
  return "NGN " + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatDateAdded(dateAdded: string): string {
  return format(new Date(dateAdded), "dd/MMM/yyyy hh:mm a")
}

function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
}: {
  label: string
  sortKey: SortKey
  activeSortKey: SortKey | null
  sortDirection: SortDirection
  onSort: (key: SortKey) => void
}) {
  const isActive = activeSortKey === sortKey
  const Icon = isActive ? (sortDirection === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1.5 font-medium",
        isActive ? "text-sidebar-item-active" : "text-table-header-text"
      )}
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}

function RowActionsMenu({
  row,
  onAction,
}: {
  row: WriteOffBatch
  onAction: (action: "approve" | "reject", row: WriteOffBatch) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Row actions</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          disabled={row.status !== "Pending"}
          onClick={() => {
            onAction("approve", row)
            setOpen(false)
          }}
          className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={row.status !== "Pending"}
          onClick={() => {
            onAction("reject", row)
            setOpen(false)
          }}
          className="w-full rounded px-3 py-2 text-left text-sm text-status-danger transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Reject
        </button>
      </PopoverContent>
    </Popover>
  )
}

interface WriteOffColumnsOptions {
  selectedIds: string[]
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
  sortKey: SortKey | null
  sortDirection: SortDirection
  onSort: (key: SortKey) => void
  onAction: (action: "approve" | "reject", row: WriteOffBatch) => void
}

export function getWriteOffColumns({
  selectedIds,
  allSelected,
  onToggle,
  onToggleAll,
  sortKey,
  sortDirection,
  onSort,
  onAction,
}: WriteOffColumnsOptions): ColumnDef<WriteOffBatch>[] {
  const sortHeader = (label: string, key: SortKey) => () => (
    <SortableHeader
      label={label}
      sortKey={key}
      activeSortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  )

  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label="Select all write-off batches"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => onToggle(row.original.id)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label={`Select ${row.original.referenceId}`}
        />
      ),
    },
    {
      accessorKey: "referenceId",
      header: sortHeader("Reference ID", "referenceId"),
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.referenceId}
        </span>
      ),
    },
    {
      accessorKey: "submittedBy",
      header: sortHeader("Submitted By", "submittedBy"),
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.submittedBy}
        </span>
      ),
    },
    {
      accessorKey: "provisionAmount",
      header: sortHeader("Provision Amount", "provisionAmount"),
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {formatProvisionAmount(row.original.provisionAmount)}
        </span>
      ),
    },
    {
      accessorKey: "dateAdded",
      header: sortHeader("Date Added", "dateAdded"),
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {formatDateAdded(row.original.dateAdded)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: sortHeader("Status", "status"),
      cell: ({ row }) => (
        <StatusBadge variant={writeOffStatusVariantMap[row.original.status]}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActionsMenu row={row.original} onAction={onAction} />,
    },
  ]
}
