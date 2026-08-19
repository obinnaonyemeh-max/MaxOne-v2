import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { TopBar, PageHeader, StatCard, StatusTabs, ContractDetailSheet, type StatusTab } from "@/components/max"
import { mockContracts, type Contract } from "@/data/mockContracts"
import { ContractsTable } from "./ContractsTable"
import { allContractsColumns } from "./contractColumns"

type TabId = "all" | "completed"

const tabs: StatusTab[] = [
  { id: "all", label: "All Contracts" },
  { id: "completed", label: "Completed Contracts" },
]

export default function ContractsPage() {
  const navigate = useNavigate()
  const { tab } = useParams<{ tab: string }>()
  const activeTab: TabId = (tabs.some((t) => t.id === tab) ? tab : "all") as TabId

  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  const stats = useMemo(
    () => ({
      all: contracts.length,
      active: contracts.filter((c) => c.status === "Active").length,
      paused: contracts.filter((c) => c.status === "Paused").length,
      markedForClosure: contracts.filter((c) => c.status === "Marked for Closure").length,
      completed: contracts.filter((c) => c.status === "Completed").length,
    }),
    [contracts]
  )

  // Brief simulated fetch so the table's skeleton state is exercised on
  // mount and whenever the active tab changes.
  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [activeTab])

  const handleTabChange = (tabId: string) => {
    navigate(`/portfolio/contracts/${tabId}`)
  }

  const tabContracts = useMemo(
    () => (activeTab === "completed" ? contracts.filter((c) => c.status === "Completed") : contracts),
    [activeTab, contracts]
  )

  const handleContractUpdate = (id: string, updates: Partial<Contract>) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    setSelectedContract((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev))
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Contracts" }]} />
      <PageHeader
        title="Contracts"
        subtitle="Portfolio view of champion contracts across every workflow stage"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-5 gap-2 shrink-0 mb-4">
        <StatCard
          title="All Contracts"
          value={stats.all.toLocaleString()}
          subtitle="Across all locations"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active Contracts"
          value={stats.active.toLocaleString()}
          subtitle="Currently in good standing"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Paused Contracts"
          value={stats.paused.toLocaleString()}
          subtitle="On hold or disputed"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Marked for Closure"
          value={stats.markedForClosure.toLocaleString()}
          subtitle="Pending final settlement"
          indicatorColor="var(--color-status-warning)"
        />
        <StatCard
          title="Completed"
          value={stats.completed.toLocaleString()}
          subtitle="Fully paid and closed"
          indicatorColor="var(--color-status-info)"
        />
      </div>

      <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} className="shrink-0" />

      <ContractsTable
        contracts={tabContracts}
        columns={allContractsColumns}
        isLoading={isLoading}
        itemLabel="contracts"
        emptyMessage={activeTab === "completed" ? "No completed contracts found." : "No contracts found."}
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
