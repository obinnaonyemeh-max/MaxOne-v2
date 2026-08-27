import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type SubscriptionPlan, subscriptionPlanStatusVariantMap } from "@/data/mockSubscriptionPlans"

interface SubscriptionPlanColumnsOptions {
  onView: (row: SubscriptionPlan) => void
}

export function buildSubscriptionPlanColumns({ onView }: SubscriptionPlanColumnsOptions): ColumnDef<SubscriptionPlan>[] {
  return [
    {
      accessorKey: "pricingBatchName",
      header: "Pricing Batch",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-table-text-primary text-sm">{row.original.pricingBatchName}</p>
          <p className="text-xs text-muted-foreground">{row.original.vehicleType}</p>
        </div>
      ),
    },
    {
      id: "tenors",
      header: "Tenors",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">
          {row.original.tenors.map((t) => `${t.tenorMonths}mo`).join(", ")}
        </span>
      ),
    },
    {
      accessorKey: "anchorGM",
      header: "Anchor GM",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.anchorGM}%</span>,
    },
    {
      accessorKey: "anchorNIM",
      header: "Anchor NIM",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.anchorNIM}%</span>,
    },
    {
      accessorKey: "dateCreated",
      header: "Date Created",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.dateCreated}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={subscriptionPlanStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
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
          View
        </Button>
      ),
    },
  ]
}
