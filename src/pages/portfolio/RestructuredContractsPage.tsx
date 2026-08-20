import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { TopBar, PageHeader, StatCard, StatusTabs, ContractDetailSheet, type StatusTab } from "@/components/max"
import { mockContracts, type Contract } from "@/data/mockContracts"
import { ContractsTable } from "./ContractsTable"
import { restructuredContractColumns, formatCurrency } from "./contractColumns"

type TabId = "undergoing-restructuring" | "awaiting-checkout"

const tabs: StatusTab[] = [
  { id: "undergoing-restructuring", label: "Undergoing Restructuring" },
  { id: "awaiting-checkout", label: "Awaiting Checkout" },
]

export default function RestructuredContractsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab")
  const activeTab: TabId = tabs.some((t) => t.id === rawTab) ? (rawTab as TabId) : "undergoing-restructuring"

  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [activeTab])

  const handleTabChange = (tabId: string) => setSearchParams({ tab: tabId }, { replace: true })

  const handleContractUpdate = (id: string, updates: Partial<Contract>) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  const restructuredContracts = useMemo(
    () => contracts.filter((c) => c.category === "Restructured"),
    [contracts]
  )

  const stats = useMemo(
    () => ({
      total: restructuredContracts.length,
      undergoingRestructuring: restructuredContracts.filter(
        (c) => c.restructureStage === "Undergoing Restructuring"
      ).length,
      awaitingCheckOut: restructuredContracts.filter((c) => c.restructureStage === "Awaiting Checkout").length,
      totalOutstanding: restructuredContracts.reduce((sum, c) => sum + c.outstandingBalance, 0),
    }),
    [restructuredContracts]
  )

  const tabContracts = useMemo(
    () =>
      restructuredContracts.filter((c) =>
        activeTab === "awaiting-checkout"
          ? c.restructureStage === "Awaiting Checkout"
          : c.restructureStage === "Undergoing Restructuring"
      ),
    [restructuredContracts, activeTab]
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }, { label: "Restructured Contracts" }]} />
      <PageHeader
        title="Restructured Contracts"
        subtitle="Contracts renegotiated with revised repayment terms"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Restructured"
          value={stats.total.toLocaleString()}
          subtitle="Contracts in this queue"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Undergoing Restructuring"
          value={stats.undergoingRestructuring.toLocaleString()}
          subtitle="Terms currently being revised"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Awaiting Check Out"
          value={stats.awaitingCheckOut.toLocaleString()}
          subtitle="Restructuring complete, pending checkout"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Total Outstanding Balance"
          value={formatCurrency(stats.totalOutstanding)}
          subtitle="Owed across restructured contracts"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} className="shrink-0" />

      <ContractsTable
        contracts={tabContracts}
        columns={restructuredContractColumns}
        isLoading={isLoading}
        itemLabel="contracts"
        emptyMessage={
          activeTab === "awaiting-checkout"
            ? "No contracts awaiting checkout."
            : "No contracts undergoing restructuring."
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
