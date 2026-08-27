import { type ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type PricingBatchRecord, pricingBatchStatusVariantMap } from "@/data/mockPricingBatchRecords"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

interface PricingBatchColumnsOptions {
  onView: (row: PricingBatchRecord) => void
  navigate: ReturnType<typeof useNavigate>
}

export function buildPricingBatchColumns({ onView, navigate }: PricingBatchColumnsOptions): ColumnDef<PricingBatchRecord>[] {
  return [
    {
      accessorKey: "code",
      header: "Batch",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-table-text-primary text-sm">{row.original.code}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.manufacturerName} {row.original.modelName} &middot; {row.original.trimName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "countryName",
      header: "Country",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.countryName}</span>,
    },
    {
      accessorKey: "vehicleTypeName",
      header: "Vehicle Type",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.vehicleTypeName}</span>,
    },
    {
      accessorKey: "financierName",
      header: "Financier",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.financierName}</span>,
    },
    {
      accessorKey: "vehicleCount",
      header: "Vehicles",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.vehicleCount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "grandTotal",
      header: "Grand Total",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.grandTotal)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={pricingBatchStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
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
            onClick={(e) => {
              e.stopPropagation()
              onView(row.original)
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/portfolio/pricing-configuration/pricing-batches/${row.original.id}/edit`)
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ]
}
