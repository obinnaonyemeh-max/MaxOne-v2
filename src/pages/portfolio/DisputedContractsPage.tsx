import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { TopBar, PageHeader, StatCard, StatusTabs, ContractDetailSheet, type StatusTab } from "@/components/max"
import { mockContracts, type Contract } from "@/data/mockContracts"
import { ContractsTable } from "./ContractsTable"
import { categoryContractColumns, formatCurrency } from "./contractColumns"

type TabId = "pending-resolve" | "resolved"

const tabs: StatusTab[] = [
  { id: "pending-resolve", label: "Pending Dispute" },
  { id: "resolved", label: "Resolved" },
]

export default function DisputedContractsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab")
  const activeTab: TabId = tabs.some((t) => t.id === rawTab) ? (rawTab as TabId) : "pending-resolve"

  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [activeTab])

  const handleTabChange = (tabId: string) => setSearchParams({ tab: tabId }, { replace: true })

  const disputedContracts = useMemo(() => contracts.filter((c) => c.category === "Disputed"), [contracts])

  const stats = useMemo(
    () => ({
      total: disputedContracts.length,
      pendingResolve: disputedContracts.filter((c) => c.disputeStatus === "Pending Resolve").length,
      resolved: disputedContracts.filter((c) => c.disputeStatus === "Resolved").length,
      totalOutstanding: disputedContracts.reduce((sum, c) => sum + c.outstandingBalance, 0),
    }),
    [disputedContracts]
  )

  const tabContracts = useMemo(
    () =>
      disputedContracts.filter((c) =>
        activeTab === "resolved" ? c.disputeStatus === "Resolved" : c.disputeStatus === "Pending Resolve"
      ),
    [disputedContracts, activeTab]
  )

  const handleContractUpdate = (id: string, updates: Partial<Contract>) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }, { label: "Disputed Contracts" }]} />
      <PageHeader
        title="Disputed Contracts"
        subtitle="Contracts flagged for dispute resolution"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Disputed"
          value={stats.total.toLocaleString()}
          subtitle="Contracts in this queue"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Pending Resolve"
          value={stats.pendingResolve.toLocaleString()}
          subtitle="Awaiting resolution"
          indicatorColor="var(--color-status-danger)"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved.toLocaleString()}
          subtitle="Reactivated after resolution"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Outstanding in Dispute"
          value={formatCurrency(stats.totalOutstanding)}
          subtitle="Balance tied up in disputes"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} className="shrink-0" />

      <ContractsTable
        contracts={tabContracts}
        columns={categoryContractColumns}
        isLoading={isLoading}
        itemLabel="contracts"
        emptyMessage={
          activeTab === "resolved" ? "No resolved disputes found." : "No contracts pending dispute resolution."
        }
        onRowClick={(row) => setSelectedContract(row)}
      />

      <ContractDetailSheet
        contract={selectedContract}
        isOpen={selectedContract !== null}
        onClose={() => setSelectedContract(null)}
        onUpdate={handleContractUpdate}
      />
    </>
  )
}
