import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { StatusBadge } from "@/components/max"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  type EvRepricedContract,
  refurbishmentStatusVariantMap,
  evRepricingStatusVariantMap,
} from "@/data/mockEvRepricedContracts"

const textCell = (value: string | number) => (
  <span className="font-medium text-table-text text-sm">{value}</span>
)

export function formatDailyRemittance(amount: number): string {
  return "₦" + amount.toLocaleString()
}

function RowActionsMenu({
  contract,
  onView,
  onRerun,
}: {
  contract: EvRepricedContract
  onView: (contract: EvRepricedContract) => void
  onRerun: (contract: EvRepricedContract) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Row actions</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => {
            onView(contract)
            setOpen(false)
          }}
          className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => {
            onRerun(contract)
            setOpen(false)
          }}
          className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
        >
          Re-run Repricing
        </button>
      </PopoverContent>
    </Popover>
  )
}

interface EvRepricingColumnsOptions {
  onView: (contract: EvRepricedContract) => void
  onRerun: (contract: EvRepricedContract) => void
}

export function getEvRepricingColumns({
  onView,
  onRerun,
}: EvRepricingColumnsOptions): ColumnDef<EvRepricedContract>[] {
  return [
    {
      accessorKey: "contractId",
      header: "Contract ID",
      cell: ({ row }) => (
        <span className="font-semibold text-table-text-primary text-sm">{row.original.contractId}</span>
      ),
    },
    {
      accessorKey: "championName",
      header: "Champion Name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary text-sm">{row.original.championName}</span>
      ),
    },
    {
      accessorKey: "championId",
      header: "Champion ID",
      cell: ({ row }) => <span className="font-medium text-muted-foreground text-sm">{row.original.championId}</span>,
    },
    { accessorKey: "plateNumber", header: "Plate Number", cell: ({ row }) => textCell(row.original.plateNumber) },
    { accessorKey: "vehicleModel", header: "Vehicle Model", cell: ({ row }) => textCell(row.original.vehicleModel) },
    {
      accessorKey: "refurbishmentStatus",
      header: "Refurbishment",
      cell: ({ row }) => (
        <StatusBadge variant={refurbishmentStatusVariantMap[row.original.refurbishmentStatus]}>
          {row.original.refurbishmentStatus}
        </StatusBadge>
      ),
    },
    {
      id: "ruleApplied",
      header: "Rule Applied",
      cell: ({ row }) =>
        row.original.ruleCode ? (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-sidebar-item-active">
            {row.original.ruleCode} &middot; {row.original.ruleVersion}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">&mdash;</span>
        ),
    },
    {
      accessorKey: "repricingStatus",
      header: "Repricing Status",
      cell: ({ row }) => (
        <StatusBadge variant={evRepricingStatusVariantMap[row.original.repricingStatus]}>
          {row.original.repricingStatus}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "dailyRemittance",
      header: "Daily Remittance",
      cell: ({ row }) => textCell(formatDailyRemittance(row.original.dailyRemittance)),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActionsMenu contract={row.original} onView={onView} onRerun={onRerun} />,
    },
  ]
}
