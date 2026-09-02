import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type AuditTrailEntry, auditTrailStatusVariantMap } from "@/data/mockRepricingAuditTrail"

const textCell = (value: string) => <span className="font-medium text-table-text text-sm">{value}</span>

const codeBadge = (value: string) => (
  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-sidebar-item-active">
    {value}
  </span>
)

const emptyDash = <span className="text-sm text-muted-foreground">&mdash;</span>

interface AuditTrailColumnsOptions {
  onViewHistory: (entry: AuditTrailEntry) => void
}

export function getAuditTrailColumns({ onViewHistory }: AuditTrailColumnsOptions): ColumnDef<AuditTrailEntry>[] {
  return [
    {
      accessorKey: "timestamp",
      header: "Date",
      cell: ({ row }) => textCell(format(new Date(row.original.timestamp), "dd MMM yyyy, HH:mm")),
    },
    {
      accessorKey: "contractId",
      header: "Contract",
      cell: ({ row }) => (row.original.contractId ? codeBadge(row.original.contractId) : emptyDash),
    },
    {
      accessorKey: "sessionId",
      header: "Session",
      cell: ({ row }) =>
        row.original.sessionId ? (
          <span className="text-sm text-muted-foreground">{row.original.sessionId}</span>
        ) : (
          emptyDash
        ),
    },
    {
      id: "ruleVersion",
      header: "Rule Version",
      cell: ({ row }) =>
        row.original.ruleCode ? codeBadge(`${row.original.ruleCode} · ${row.original.ruleVersion}`) : emptyDash,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.action}</span>
      ),
    },
    { accessorKey: "user", header: "User", cell: ({ row }) => textCell(row.original.user) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={auditTrailStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: "history",
      header: "History",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onViewHistory(row.original)
          }}
        >
          View calculation history
        </Button>
      ),
    },
  ]
}
