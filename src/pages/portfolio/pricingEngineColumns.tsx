import { type ColumnDef } from "@tanstack/react-table"
import { type EngineRow } from "./pricingEngine"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

const textCell = (value: string) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

export const pricingEngineColumns: ColumnDef<EngineRow>[] = [
  {
    accessorKey: "tenorMonths",
    header: "Tenor",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.tenorMonths} months</span>
    ),
  },
  { accessorKey: "totalCOS", header: "Total COS", cell: ({ row }) => textCell(formatCurrency(row.original.totalCOS)) },
  { accessorKey: "operatingCost", header: "Operating Cost", cell: ({ row }) => textCell(formatCurrency(row.original.operatingCost)) },
  { accessorKey: "targetGM", header: "Target GM", cell: ({ row }) => textCell(`${row.original.targetGM.toFixed(2)}%`) },
  { accessorKey: "targetNIM", header: "Target NIM", cell: ({ row }) => textCell(`${row.original.targetNIM.toFixed(2)}%`) },
  { accessorKey: "requiredRevenue", header: "Required Revenue", cell: ({ row }) => textCell(formatCurrency(row.original.requiredRevenue)) },
  { accessorKey: "dailyRemittance", header: "Daily Remittance", cell: ({ row }) => textCell(formatCurrency(row.original.dailyRemittance)) },
  { accessorKey: "totalHPValue", header: "Total HP Value", cell: ({ row }) => textCell(formatCurrency(row.original.totalHPValue)) },
  {
    accessorKey: "grossProfit",
    header: "Gross Profit",
    cell: ({ row }) => (
      <span className="font-medium text-status-success text-sm">{formatCurrency(row.original.grossProfit)}</span>
    ),
  },
  {
    accessorKey: "netProfit",
    header: "Net Profit",
    cell: ({ row }) => (
      <span className="font-medium text-status-success text-sm">{formatCurrency(row.original.netProfit)}</span>
    ),
  },
]
