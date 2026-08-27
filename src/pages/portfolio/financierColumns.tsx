import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type Financier, financierStatusVariantMap } from "@/data/mockFinanciers"

export function formatCurrency(amount: number, denomination: string = "NGN"): string {
  const symbol = denomination === "NGN" ? "₦" : denomination === "USD" ? "$" : denomination === "GBP" ? "£" : denomination === "EUR" ? "€" : ""
  return symbol + amount.toLocaleString()
}

interface FinancierColumnsOptions {
  onView: (row: Financier) => void
}

export function buildFinancierColumns({ onView }: FinancierColumnsOptions): ColumnDef<Financier>[] {
  return [
    {
      accessorKey: "financierName",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.financierName}</span>
      ),
    },
    {
      accessorKey: "financingPartner",
      header: "Financing Partner",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.financingPartner}</span>,
    },
    {
      accessorKey: "numberOfVehicles",
      header: "Vehicles",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.numberOfVehicles.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "loanAmount",
      header: "Loan Amount",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">
          {formatCurrency(row.original.loanAmount, row.original.collectionDenomination)}
        </span>
      ),
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
        <StatusBadge variant={financierStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
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
