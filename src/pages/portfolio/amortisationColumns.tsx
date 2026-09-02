import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { formatCurrency, type AmortisationPeriod, type AmortisationStatus } from "./earlyTerminationCalculations"

const textCell = (value: string) => <span className="font-medium text-table-text text-sm">{value}</span>
const currencyCell = (amount: number) => <span className="font-medium text-table-text text-sm">{formatCurrency(amount)}</span>

const amortisationStatusVariantMap: Record<AmortisationStatus, "success" | "warning" | "default" | "danger"> = {
  Paid: "success",
  Current: "warning",
  Outstanding: "default",
  Overdue: "danger",
}

export const amortisationColumns: ColumnDef<AmortisationPeriod>[] = [
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => <span className="font-semibold text-table-text-primary text-sm">{row.original.period}</span>,
  },
  { accessorKey: "dueDate", header: "Due Date", cell: ({ row }) => textCell(row.original.dueDate) },
  { accessorKey: "dailyRemittance", header: "Daily Remittance", cell: ({ row }) => currencyCell(row.original.dailyRemittance) },
  { accessorKey: "principal", header: "Principal", cell: ({ row }) => currencyCell(row.original.principal) },
  { accessorKey: "interest", header: "Interest", cell: ({ row }) => currencyCell(row.original.interest) },
  { accessorKey: "vehicleSaleRevenue", header: "Vehicle Sale Revenue", cell: ({ row }) => currencyCell(row.original.vehicleSaleRevenue) },
  { accessorKey: "maxAdvantage", header: "MAX Advantage", cell: ({ row }) => currencyCell(row.original.maxAdvantage) },
  { accessorKey: "batteryAccess", header: "Battery Access", cell: ({ row }) => currencyCell(row.original.batteryAccess) },
  { accessorKey: "processingFee", header: "Processing Fee", cell: ({ row }) => currencyCell(row.original.processingFee) },
  { accessorKey: "balance", header: "Balance", cell: ({ row }) => currencyCell(row.original.balance) },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={amortisationStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
    ),
  },
]
