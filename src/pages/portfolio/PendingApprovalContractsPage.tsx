import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { TopBar, PageHeader, StatCard, StatusTabs, ContractDetailSheet, type StatusTab } from "@/components/max"
import { mockContracts, type Contract } from "@/data/mockContracts"
import { ContractsTable } from "./ContractsTable"
import { categoryContractColumns, formatCurrency } from "./contractColumns"

type TabId = "pending-approval" | "approved"

const tabs: StatusTab[] = [
  { id: "pending-approval", label: "Pending Approvals" },
  { id: "approved", label: "Approved" },
]

export default function PendingApprovalContractsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab")
  const activeTab: TabId = tabs.some((t) => t.id === rawTab) ? (rawTab as TabId) : "pending-approval"

  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [activeTab])

  const handleTabChange = (tabId: string) => setSearchParams({ tab: tabId }, { replace: true })

  const pendingApprovalContracts = useMemo(
    () => contracts.filter((c) => c.category === "Pending Approval"),
    [contracts]
  )

  const approvedContracts = useMemo(
    () => contracts.filter((c) => approvedIds.has(c.id)),
    [contracts, approvedIds]
  )

  const tabContracts = activeTab === "approved" ? approvedContracts : pendingApprovalContracts

  const stats = useMemo(
    () => ({
      total: pendingApprovalContracts.length,
      active: pendingApprovalContracts.filter((c) => c.status === "Active").length,
      paused: pendingApprovalContracts.filter((c) => c.status === "Paused").length,
      totalMonthlyValue: pendingApprovalContracts.reduce((sum, c) => sum + c.monthlyAmount, 0),
    }),
    [pendingApprovalContracts]
  )

  const handleContractUpdate = (id: string, updates: Partial<Contract>) => {
    if (updates.category === "Standard") {
      setApprovedIds((prev) => new Set(prev).add(id))
    }
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }, { label: "Pending Approval" }]} />
      <PageHeader
        title="Pending Approval"
        subtitle="Contracts awaiting review and an approve or dispute decision"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Pending Approval"
          value={stats.total.toLocaleString()}
          subtitle="Awaiting a decision"
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
          title="Monthly Value Awaiting Approval"
          value={formatCurrency(stats.totalMonthlyValue)}
          subtitle="Combined monthly repayment"
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
          activeTab === "approved" ? "No contracts have been approved yet." : "No contracts pending approval."
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
