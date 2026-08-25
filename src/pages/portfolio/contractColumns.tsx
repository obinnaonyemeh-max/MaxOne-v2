import { type ColumnDef } from "@tanstack/react-table"

import { StatusBadge } from "@/components/max"
import { type Contract, statusVariantMap, categoryVariantMap, retrievalStatusVariantMap } from "@/data/mockContracts"

export function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const contractIdColumn: ColumnDef<Contract> = {
  accessorKey: "contractId",
  header: "Contract",
  cell: ({ row }) => (
    <span className="font-medium text-table-text-primary text-sm">{row.original.contractId}</span>
  ),
}

const championColumn: ColumnDef<Contract> = {
  accessorKey: "championName",
  header: "Champion",
  cell: ({ row }) => (
    <div className="flex items-center gap-3">
      <img
        src="/images/champvatar.png"
        alt={row.original.championName}
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.championName}</p>
        <p className="text-xs text-muted-foreground">{row.original.maxId}</p>
      </div>
    </div>
  ),
}

const vehicleColumn: ColumnDef<Contract> = {
  accessorKey: "vehiclePlate",
  header: "Vehicle",
  cell: ({ row }) => (
    <div>
      <p className="font-medium text-table-text text-sm">{row.original.vehiclePlate}</p>
      <p className="text-xs text-muted-foreground">{row.original.vehicleType}</p>
    </div>
  ),
}

const locationColumn: ColumnDef<Contract> = {
  accessorKey: "location",
  header: "Location",
  cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.location}</span>,
}

const monthlyAmountColumn: ColumnDef<Contract> = {
  accessorKey: "monthlyAmount",
  header: "Monthly Amount",
  cell: ({ row }) => (
    <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.monthlyAmount)}</span>
  ),
}

const outstandingBalanceColumn: ColumnDef<Contract> = {
  accessorKey: "outstandingBalance",
  header: "Outstanding Balance",
  cell: ({ row }) => (
    <span
      className={`font-medium text-sm ${row.original.outstandingBalance > 0 ? "text-status-danger" : "text-table-text"}`}
    >
      {formatCurrency(row.original.outstandingBalance)}
    </span>
  ),
}

const hpValueColumn: ColumnDef<Contract> = {
  id: "hpValue",
  header: "HP Value",
  cell: ({ row }) => (
    <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.metrics.hpAmount)}</span>
  ),
}

const dpdColumn: ColumnDef<Contract> = {
  accessorKey: "dpd",
  header: "DPD",
  cell: ({ row }) => (
    <span className={`font-medium text-sm ${row.original.dpd > 0 ? "text-status-danger" : "text-table-text"}`}>
      {row.original.dpd > 0 ? `${row.original.dpd}d` : "—"}
    </span>
  ),
}

const categoryColumn: ColumnDef<Contract> = {
  accessorKey: "category",
  header: "Type",
  cell: ({ row }) => (
    <StatusBadge variant={categoryVariantMap[row.original.category]}>{row.original.category}</StatusBadge>
  ),
}

const statusColumn: ColumnDef<Contract> = {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => <StatusBadge variant={statusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>,
}

const championWithPhoneColumn: ColumnDef<Contract> = {
  accessorKey: "championName",
  header: "Champion",
  cell: ({ row }) => (
    <div className="flex items-center gap-3">
      <img
        src="/images/champvatar.png"
        alt={row.original.championName}
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.championName}</p>
        <p className="text-xs text-muted-foreground">{row.original.championPhone}</p>
      </div>
    </div>
  ),
}

const amountOverdueColumn: ColumnDef<Contract> = {
  accessorKey: "outstandingBalance",
  header: "Amount Overdue",
  cell: ({ row }) => (
    <span
      className={`font-medium text-sm ${row.original.outstandingBalance > 0 ? "text-status-danger" : "text-table-text"}`}
    >
      {formatCurrency(row.original.outstandingBalance)}
    </span>
  ),
}

const daysOverdueColumn: ColumnDef<Contract> = {
  accessorKey: "dpd",
  header: "Days Overdue",
  cell: ({ row }) => (
    <span className={`font-medium text-sm ${row.original.dpd > 0 ? "text-status-danger" : "text-table-text"}`}>
      {row.original.dpd > 0 ? `${row.original.dpd}d` : "—"}
    </span>
  ),
}

const lastAmountRemittedColumn: ColumnDef<Contract> = {
  accessorKey: "lastAmountRemitted",
  header: "Last Amount Remitted",
  cell: ({ row }) => (
    <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.lastAmountRemitted)}</span>
  ),
}

const lastRemittanceDateColumn: ColumnDef<Contract> = {
  accessorKey: "lastRemittanceDate",
  header: "Last Date Remitted",
  cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.lastRemittanceDate}</span>,
}

const retrievalStatusColumn: ColumnDef<Contract> = {
  accessorKey: "retrievalStatus",
  header: "Retrieval Status",
  cell: ({ row }) => (
    <StatusBadge variant={retrievalStatusVariantMap[row.original.retrievalStatus]}>
      {row.original.retrievalStatus}
    </StatusBadge>
  ),
}

const hpStatusColumn: ColumnDef<Contract> = {
  accessorKey: "status",
  header: "HP Status",
  cell: ({ row }) => <StatusBadge variant={statusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>,
}

// "All Contracts" / "Completed Contracts" — category varies per row, so the Type badge earns its place.
export const allContractsColumns: ColumnDef<Contract>[] = [
  contractIdColumn,
  championColumn,
  vehicleColumn,
  locationColumn,
  hpValueColumn,
  outstandingBalanceColumn,
  dpdColumn,
  categoryColumn,
  statusColumn,
]

// Single-category views (Initiated, Pending Approval) — every row shares the same
// category, so the Type column would just repeat itself; drop it.
export const categoryContractColumns: ColumnDef<Contract>[] = [
  contractIdColumn,
  championColumn,
  vehicleColumn,
  locationColumn,
  monthlyAmountColumn,
  outstandingBalanceColumn,
  statusColumn,
]

// Restructured Contracts — retrieval/remittance-focused view (champion contact, overdue
// amount/days, last remittance, retrieval status, HP status) rather than the generic set.
export const restructuredContractColumns: ColumnDef<Contract>[] = [
  contractIdColumn,
  championWithPhoneColumn,
  amountOverdueColumn,
  daysOverdueColumn,
  lastAmountRemittedColumn,
  lastRemittanceDateColumn,
  retrievalStatusColumn,
  hpStatusColumn,
  locationColumn,
]
