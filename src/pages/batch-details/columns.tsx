import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Trash2, Pencil, ChevronDown, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import type { VehicleIdentifier, RegistrationRecord, BatchDocument } from "@/data/mockBatchDetailRows"
import { officerOptions, registrationStatusOptions, registrationStatusVariant } from "./options"

export function getRegistrationColumns(
  onStatusChange: (id: string, status: RegistrationRecord["status"]) => void,
  onOfficerChange: (id: string, officer: string) => void,
  onDateChange: (id: string, date: Date | undefined) => void,
  selectedIds: Set<string>,
  onToggleSelect: (id: string) => void,
  onToggleAll: () => void,
  allSelected: boolean,
): ColumnDef<RegistrationRecord>[] {
  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 rounded border border-gray-200 accent-brand-dark cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.original.id)}
          onChange={() => onToggleSelect(row.original.id)}
          className="h-4 w-4 rounded border border-gray-200 accent-brand-dark cursor-pointer"
        />
      ),
    },
    {
      accessorKey: "chassisNo",
      header: "Chassis No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.chassisNo}
        </span>
      ),
    },
    {
      accessorKey: "engineNo",
      header: "Engine No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.engineNo}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="flex items-center gap-1 cursor-pointer">
              <StatusBadge variant={registrationStatusVariant[row.original.status]} withDot>
                {row.original.status}
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </StatusBadge>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1" align="start">
            <div className="flex flex-col">
              {registrationStatusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                  onClick={() => onStatusChange(row.original.id, option)}
                >
                  <StatusBadge variant={registrationStatusVariant[option]} withDot>
                    {option}
                  </StatusBadge>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      accessorKey: "assignedOfficer",
      header: "Assigned Officer",
      cell: ({ row }) => <OfficerCell row={row.original} onOfficerChange={onOfficerChange} />,
    },
    {
      accessorKey: "dateAssigned",
      header: "Date Assigned",
      cell: ({ row }) => {
        const dateValue = row.original.dateAssigned ? new Date(row.original.dateAssigned) : undefined
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-40 justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "dd/MM/yyyy") : <span className="text-muted-foreground">dd/mm/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => onDateChange(row.original.id, date)}
              />
            </PopoverContent>
          </Popover>
        )
      },
    },
  ]
}

function OfficerCell({
  row,
  onOfficerChange,
}: {
  row: RegistrationRecord
  onOfficerChange: (id: string, officer: string) => void
}) {
  const [query, setQuery] = useState(row.assignedOfficer)
  const filtered = officerOptions.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  )
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-44 justify-start text-left font-normal text-sm"
        >
          {row.assignedOfficer || <span className="text-muted-foreground">Officer name</span>}
          <ChevronDown className="ml-auto h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <div className="p-2 border-b border-border">
          <Input
            type="text"
            placeholder="Search officer..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              onOfficerChange(row.id, e.target.value)
            }}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        <div className="max-h-40 overflow-y-auto p-1">
          {filtered.map((officer) => (
            <button
              key={officer}
              type="button"
              className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors text-left"
              onClick={() => {
                setQuery(officer)
                onOfficerChange(row.id, officer)
              }}
            >
              {officer}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No officers found</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const documentColumns: ColumnDef<BatchDocument>[] = [
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => (
      <span className="font-medium text-brand-dark underline decoration-dotted cursor-pointer hover:text-brand-dark/80" style={{ fontSize: "14px" }}>
        {row.original.document}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "uploaded",
    header: "Uploaded",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.uploaded}
      </span>
    ),
  },
]

export function getIdentifierColumns({
  showSubBatchId = false,
  onSubBatchClick,
  onEdit,
  onDelete,
}: {
  showSubBatchId?: boolean
  onSubBatchClick?: (subBatchId: string) => void
  onEdit?: (row: VehicleIdentifier) => void
  onDelete?: (id: string) => void
} = {}): ColumnDef<VehicleIdentifier>[] {
  const columns: ColumnDef<VehicleIdentifier>[] = []

  if (showSubBatchId) {
    columns.push({
      accessorKey: "subBatchId",
      header: "Sub-Batch ID",
      cell: ({ row }) => (
        <button
          type="button"
          className="font-medium text-brand-dark underline decoration-dotted cursor-pointer hover:text-brand-dark/80"
          style={{ fontSize: "14px" }}
          onClick={(e) => {
            e.stopPropagation()
            onSubBatchClick?.(row.original.subBatchId)
          }}
        >
          {row.original.subBatchId}
        </button>
      ),
    })
  }

  columns.push(
    {
      accessorKey: "chassisVin",
      header: "Chassis (VIN)",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.chassisVin}
        </span>
      ),
    },
    {
      accessorKey: "engineNo",
      header: "Engine No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.engineNo}
        </span>
      ),
    },
    {
      accessorKey: "ignitionNo",
      header: "Ignition No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.ignitionNo}
        </span>
      ),
    },
    {
      accessorKey: "batterySn",
      header: "Battery S/N",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.batterySn}
        </span>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.color}
        </span>
      ),
    },
    {
      accessorKey: "receiver",
      header: "Receiver",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.receiver}
        </span>
      ),
    },
  )

  if (onEdit || onDelete) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {onEdit && (
            <button
              type="button"
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(row.original)
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
              aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(row.original.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    })
  }

  return columns
}
