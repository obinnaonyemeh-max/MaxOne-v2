import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { TopBar, PageHeader, StatCard, FinancierDetailSheet } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockFinanciers, type Financier } from "@/data/mockFinanciers"
import { FinanciersTable } from "./FinanciersTable"
import { buildFinancierColumns, formatCurrency } from "./financierColumns"
import { CreateFinancierModal, type CreateFinancierInput } from "./CreateFinancierModal"

let nextFinancierSeq = mockFinanciers.length + 1

export default function FinanciersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [financiers, setFinanciers] = useState<Financier[]>(mockFinanciers)
  const [selectedFinancier, setSelectedFinancier] = useState<Financier | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const stats = useMemo(
    () => ({
      total: financiers.length,
      active: financiers.filter((f) => f.status === "Active").length,
      totalLoanAmount: financiers.reduce((sum, f) => sum + f.loanAmount, 0),
      totalVehiclesFinanced: financiers.reduce((sum, f) => sum + f.numberOfVehicles, 0),
    }),
    [financiers]
  )

  const columns = useMemo(() => buildFinancierColumns({ onView: setSelectedFinancier }), [])

  const handleCreate = (input: CreateFinancierInput) => {
    const totalVehicleCost = input.numberOfVehicles * input.vehicleCost
    const equity = input.loanAmount * (input.equityContributionPercent / 100)

    const newFinancier: Financier = {
      id: String(nextFinancierSeq++),
      ...input,
      totalVehicleCost,
      equity,
      status: "Active",
      dateCreated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      remittanceStatus: "Pending First Remittance",
      totalAmountRemitted: 0,
      outstandingBalance: input.loanAmount,
    }

    setFinanciers((prev) => [newFinancier, ...prev])
    setShowCreate(false)
    toast.success("Financier added", {
      description: `${newFinancier.financierName} has been added to the funding portfolio.`,
    })
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Funding" }, { label: "Financiers" }]} />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Financiers"
          subtitle="Manage financing partners funding the vehicle fleet"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Add Financier
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Financiers"
          value={stats.total.toLocaleString()}
          subtitle="Added to the portfolio"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          subtitle="Currently funding vehicles"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Total Loan Amount"
          value={formatCurrency(stats.totalLoanAmount)}
          subtitle="Combined across all financiers"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Vehicles Financed"
          value={stats.totalVehiclesFinanced.toLocaleString()}
          subtitle="Across all funding batches"
          indicatorColor="var(--color-status-purple)"
        />
      </div>

      <FinanciersTable
        financiers={financiers}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedFinancier(row)}
      />

      <FinancierDetailSheet
        financier={selectedFinancier}
        isOpen={selectedFinancier !== null}
        onClose={() => setSelectedFinancier(null)}
      />

      <CreateFinancierModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </>
  )
}
