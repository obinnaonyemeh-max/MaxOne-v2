import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Pencil, RefreshCw } from "lucide-react"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  type RepricingException,
  exceptionReasonVariantMap,
} from "@/data/mockRepricingExceptions"

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

interface RepricingExceptionColumnsOptions {
  onEditInputs: (exception: RepricingException) => void
  onApproveOverride: (exception: RepricingException) => void
  onRerun: (exception: RepricingException) => void
}

export function getRepricingExceptionColumns({
  onEditInputs,
  onApproveOverride,
  onRerun,
}: RepricingExceptionColumnsOptions): ColumnDef<RepricingException>[] {
  return [
    {
      accessorKey: "exceptionId",
      header: "Exception",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-sidebar-item-active">
          {row.original.exceptionId}
        </span>
      ),
    },
    {
      accessorKey: "contractId",
      header: "Contract",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-sidebar-item-active">
          {row.original.contractId}
        </span>
      ),
    },
    {
      accessorKey: "championName",
      header: "Champion",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.championName}</span>
      ),
    },
    {
      accessorKey: "vehicleType",
      header: "Type",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {row.original.vehicleType}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <StatusBadge variant={exceptionReasonVariantMap[row.original.reason]}>{row.original.reason}</StatusBadge>
      ),
    },
    {
      accessorKey: "sessionId",
      header: "Session",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.sessionId}</span>,
    },
    {
      accessorKey: "detectedAt",
      header: "Detected",
      cell: ({ row }) => textCell(format(new Date(row.original.detectedAt), "dd MMM yyyy, HH:mm")),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) =>
        row.original.assignee ? (
          textCell(row.original.assignee)
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation()
              onEditInputs(row.original)
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Inputs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onApproveOverride(row.original)
            }}
          >
            Approve Override
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation()
              onRerun(row.original)
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Re-run
          </Button>
        </div>
      ),
    },
  ]
}
