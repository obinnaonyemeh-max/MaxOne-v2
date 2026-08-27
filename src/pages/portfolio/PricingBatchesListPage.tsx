import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import { TopBar, PageHeader, StatCard, PricingBatchDetailSheet } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockPricingBatchRecords, type PricingBatchRecord } from "@/data/mockPricingBatchRecords"
import { PricingBatchesTable } from "./PricingBatchesTable"
import { buildPricingBatchColumns } from "./pricingBatchColumns"

export default function PricingBatchesListPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [batches] = useState<PricingBatchRecord[]>(mockPricingBatchRecords)
  const [selectedBatch, setSelectedBatch] = useState<PricingBatchRecord | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const stats = useMemo(
    () => ({
      total: batches.length,
      active: batches.filter((b) => b.status === "Active").length,
      totalVehicles: batches.reduce((sum, b) => sum + b.vehicleCount, 0),
      totalGrandTotal: batches.reduce((sum, b) => sum + b.grandTotal, 0),
    }),
    [batches]
  )

  const columns = useMemo(() => buildPricingBatchColumns({ onView: setSelectedBatch, navigate }), [navigate])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Pricing Batches" },
        ]}
      />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Pricing Batches"
          subtitle="Vehicle pricing configurations linking pricing templates and financiers"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => navigate("/portfolio/pricing-configuration/pricing-batches/new")}
          >
            <Plus className="h-4 w-4" />
            Create New Pricing Batch
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Batches"
          value={stats.total.toLocaleString()}
          subtitle="Configured across all countries"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          subtitle="Currently in use"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Vehicles Covered"
          value={stats.totalVehicles.toLocaleString()}
          subtitle="Across all batches"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Combined Grand Total"
          value={"₦" + Math.round(stats.totalGrandTotal).toLocaleString()}
          subtitle="Sum of all batch costs"
          indicatorColor="var(--color-status-purple)"
        />
      </div>

      <PricingBatchesTable
        batches={batches}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedBatch(row)}
      />

      <PricingBatchDetailSheet
        batch={selectedBatch}
        isOpen={selectedBatch !== null}
        onClose={() => setSelectedBatch(null)}
      />
    </>
  )
}
