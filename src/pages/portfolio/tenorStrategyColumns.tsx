import { type ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type PricingBatch } from "@/data/mockPricingBatches"
import { getTargetGM, getTargetNIM, type TenorStrategyRow } from "./pricingEngine"

interface TenorStrategyColumnsOptions {
  batch: PricingBatch | null
  onToggleEnabled: (id: string) => void
  onFieldChange: (id: string, field: "tenorMonths" | "grossMarginAdjustment" | "netMarginAdjustment", value: number) => void
  onDelete: (id: string) => void
}

export function buildTenorStrategyColumns({
  batch,
  onToggleEnabled,
  onFieldChange,
  onDelete,
}: TenorStrategyColumnsOptions): ColumnDef<TenorStrategyRow>[] {
  return [
    {
      id: "enabled",
      header: "",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.enabled}
          onChange={() => onToggleEnabled(row.original.id)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-dark"
          aria-label={`Toggle ${row.original.tenorMonths}-month tenor`}
        />
      ),
    },
    {
      accessorKey: "tenorMonths",
      header: "Tenor (Months)",
      cell: ({ row }) => (
        <Input
          type="number"
          value={row.original.tenorMonths}
          onChange={(e) => onFieldChange(row.original.id, "tenorMonths", Number(e.target.value) || 0)}
          className="h-9 w-24 bg-input-soft"
        />
      ),
    },
    {
      accessorKey: "grossMarginAdjustment",
      header: "Gross Margin Adj.",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="relative w-32">
            <Input
              type="number"
              value={row.original.grossMarginAdjustment}
              onChange={(e) => onFieldChange(row.original.id, "grossMarginAdjustment", Number(e.target.value) || 0)}
              className="h-9 w-32 bg-input-soft pr-7"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
              %
            </span>
          </div>
          <span className="text-xs text-breadcrumb-root">Anchor GM − {row.original.grossMarginAdjustment}%</span>
        </div>
      ),
    },
    {
      accessorKey: "netMarginAdjustment",
      header: "Net Margin Adj.",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="relative w-32">
            <Input
              type="number"
              value={row.original.netMarginAdjustment}
              onChange={(e) => onFieldChange(row.original.id, "netMarginAdjustment", Number(e.target.value) || 0)}
              className="h-9 w-32 bg-input-soft pr-7"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
              %
            </span>
          </div>
          <span className="text-xs text-breadcrumb-root">Anchor NIM − {row.original.netMarginAdjustment}%</span>
        </div>
      ),
    },
    {
      id: "calculatedTargetGM",
      header: "Target GM",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">
          {batch ? `${getTargetGM(batch, row.original).toFixed(2)}%` : "—"}
        </span>
      ),
    },
    {
      id: "calculatedTargetNIM",
      header: "Target NIM",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">
          {batch ? `${getTargetNIM(batch, row.original).toFixed(2)}%` : "—"}
        </span>
      ),
    },
    {
      id: "rowActions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-status-danger hover:bg-status-danger/10 hover:text-status-danger"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]
}
