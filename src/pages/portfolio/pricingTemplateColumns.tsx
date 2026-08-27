import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockAssetClasses, mockVehicleTypeOptions } from "@/data/mockVehicleCatalog"
import { templateGrandTotal, type PricingTemplate } from "@/data/mockPricingTemplates"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function vehicleTypeLabel(template: PricingTemplate): string {
  const assetClass = mockAssetClasses.find((a) => a.id === template.vehicleTypePrimary)
  const subtype = mockVehicleTypeOptions.find((v) => v.id === template.vehicleTypeSubtype)
  if (!assetClass && !subtype) return "—"
  return [assetClass?.name, subtype?.name].filter(Boolean).join(" · ")
}

interface PricingTemplateColumnsOptions {
  onView: (row: PricingTemplate) => void
}

export function buildPricingTemplateColumns({ onView }: PricingTemplateColumnsOptions): ColumnDef<PricingTemplate>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.code ?? "—"}</p>
        </div>
      ),
    },
    {
      id: "productType",
      header: "Product Type",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.productType ?? "—"}</span>,
    },
    {
      id: "vehicleType",
      header: "Vehicle Type",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{vehicleTypeLabel(row.original)}</span>,
    },
    {
      id: "currency",
      header: "Currency",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.currency ?? "—"}</span>,
    },
    {
      id: "grandTotal",
      header: "Total Cost Base",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{formatCurrency(templateGrandTotal(row.original.costCategories))}</span>
      ),
    },
    {
      id: "effectiveDate",
      header: "Effective Date",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.effectiveDate ?? "—"}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === "Active" ? "success" : "default"}>{row.original.status ?? "Draft"}</StatusBadge>
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
