import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { type RepricingRule, repricingRuleStatusVariantMap } from "@/data/mockRepricingEngine"

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

interface RepricingRuleColumnsOptions {
  onView: (rule: RepricingRule) => void
  onDuplicate: (rule: RepricingRule) => void
  onDeactivate: (rule: RepricingRule) => void
}

export function getRepricingRuleColumns({
  onView,
  onDuplicate,
  onDeactivate,
}: RepricingRuleColumnsOptions): ColumnDef<RepricingRule>[] {
  return [
    {
      accessorKey: "vehicleType",
      header: "Vehicle Type",
      cell: ({ row }) => (
        <StatusBadge variant={row.original.vehicleType === "EV" ? "info" : "warning"} size="sm">
          {row.original.vehicleType}
        </StatusBadge>
      ),
    },
    { accessorKey: "vehicleModel", header: "Vehicle Model", cell: ({ row }) => textCell(row.original.vehicleModel) },
    {
      accessorKey: "name",
      header: "Rule Name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.name}</span>
      ),
    },
    { accessorKey: "country", header: "Country", cell: ({ row }) => textCell(row.original.country) },
    { accessorKey: "version", header: "Version", cell: ({ row }) => textCell(row.original.version) },
    { accessorKey: "effectiveDate", header: "Effective Date", cell: ({ row }) => textCell(row.original.effectiveDate) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={repricingRuleStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onView(row.original)
            }}
            className="text-sm font-medium text-status-info hover:underline"
          >
            View
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(row.original)
            }}
            className="text-sm font-medium text-sidebar-item-active hover:underline"
          >
            Duplicate
          </button>
          <button
            type="button"
            disabled={row.original.status === "Inactive"}
            onClick={(e) => {
              e.stopPropagation()
              onDeactivate(row.original)
            }}
            className="text-sm font-medium text-status-danger hover:underline disabled:pointer-events-none disabled:opacity-40"
          >
            Deactivate
          </button>
        </div>
      ),
    },
  ]
}
