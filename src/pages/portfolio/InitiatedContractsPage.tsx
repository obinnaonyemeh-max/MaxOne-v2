import { useEffect, useMemo, useState } from "react"

import { TopBar, PageHeader, StatCard, ContractDetailSheet } from "@/components/max"
import { mockContracts, type Contract } from "@/data/mockContracts"
import { ContractsTable } from "./ContractsTable"
import { categoryContractColumns, formatCurrency } from "./contractColumns"

const initiatedContracts = mockContracts.filter((c) => c.category === "Initiated")

export default function InitiatedContractsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const stats = useMemo(
    () => ({
      total: initiatedContracts.length,
      active: initiatedContracts.filter((c) => c.status === "Active").length,
      paused: initiatedContracts.filter((c) => c.status === "Paused").length,
      totalMonthlyValue: initiatedContracts.reduce((sum, c) => sum + c.monthlyAmount, 0),
    }),
    []
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }, { label: "Initiated Contracts" }]} />
      <PageHeader
        title="Initiated Contracts"
        subtitle="Newly initiated champion contracts awaiting full activation"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Initiated"
          value={stats.total.toLocaleString()}
          subtitle="Contracts in this queue"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          subtitle="Currently in good standing"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Paused"
          value={stats.paused.toLocaleString()}
          subtitle="On hold"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Total Monthly Value"
          value={formatCurrency(stats.totalMonthlyValue)}
          subtitle="Combined monthly repayment"
          indicatorColor="var(--color-status-info)"
        />
      </div>

      <ContractsTable
        contracts={initiatedContracts}
        columns={categoryContractColumns}
        isLoading={isLoading}
        itemLabel="contracts"
        emptyMessage="No initiated contracts found."
        onRowClick={(row) => setSelectedContract(row)}
      />

      <ContractDetailSheet
        contract={selectedContract}
        isOpen={selectedContract !== null}
        onClose={() => setSelectedContract(null)}
      />
    </>
  )
}
