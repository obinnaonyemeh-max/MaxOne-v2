import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { type RepricingSession, repricingSessionStatusVariantMap } from "@/data/mockRepricingEngine"

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

export const repricingSessionColumns: ColumnDef<RepricingSession>[] = [
  {
    accessorKey: "id",
    header: "Session ID",
    cell: ({ row }) => <span className="font-medium text-table-text-primary text-sm">{row.original.id}</span>,
  },
  { accessorKey: "sessionType", header: "Session Type", cell: ({ row }) => textCell(row.original.sessionType) },
  { accessorKey: "startTime", header: "Start Time", cell: ({ row }) => textCell(row.original.startTime) },
  { accessorKey: "endTime", header: "End Time", cell: ({ row }) => textCell(row.original.endTime) },
  { accessorKey: "found", header: "Found", cell: ({ row }) => textCell(row.original.found) },
  { accessorKey: "repriced", header: "Repriced", cell: ({ row }) => textCell(row.original.repriced) },
  {
    accessorKey: "exceptions",
    header: "Exceptions",
    cell: ({ row }) => (
      <span className={`font-medium text-sm ${row.original.exceptions > 0 ? "text-status-warning" : "text-table-text"}`}>
        {row.original.exceptions}
      </span>
    ),
  },
  {
    accessorKey: "failed",
    header: "Failed",
    cell: ({ row }) => (
      <span className={`font-medium text-sm ${row.original.failed > 0 ? "text-status-danger" : "text-table-text"}`}>
        {row.original.failed}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={repricingSessionStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
    ),
  },
]
