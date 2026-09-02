import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type RepricingSession, repricingSessionStatusVariantMap } from "@/data/mockRepricingEngine"

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

interface RepricingSessionsColumnsOptions {
  onView: (session: RepricingSession) => void
}

export function getRepricingSessionsColumns({
  onView,
}: RepricingSessionsColumnsOptions): ColumnDef<RepricingSession>[] {
  return [
    {
      accessorKey: "id",
      header: "Session ID",
      cell: ({ row }) => (
        <span className="font-semibold text-table-text-primary text-sm">{row.original.id}</span>
      ),
    },
    { accessorKey: "startTime", header: "Run Time", cell: ({ row }) => textCell(row.original.startTime) },
    { accessorKey: "trigger", header: "Trigger", cell: ({ row }) => textCell(row.original.trigger) },
    { accessorKey: "found", header: "Contracts Found", cell: ({ row }) => textCell(row.original.found) },
    {
      accessorKey: "repriced",
      header: "Successful",
      cell: ({ row }) => <span className="font-medium text-status-success text-sm">{row.original.repriced}</span>,
    },
    {
      accessorKey: "failed",
      header: "Failed",
      cell: ({ row }) => <span className="font-medium text-status-danger text-sm">{row.original.failed}</span>,
    },
    {
      accessorKey: "exceptions",
      header: "Exceptions",
      cell: ({ row }) => <span className="font-medium text-status-warning text-sm">{row.original.exceptions}</span>,
    },
    { accessorKey: "duration", header: "Duration", cell: ({ row }) => textCell(row.original.duration) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={repricingSessionStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onView(row.original)
          }}
        >
          View Session
        </Button>
      ),
    },
  ]
}
