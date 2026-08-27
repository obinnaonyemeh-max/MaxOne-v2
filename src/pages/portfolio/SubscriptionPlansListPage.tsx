import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import { TopBar, PageHeader, StatCard, SubscriptionPlanDetailSheet } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockSubscriptionPlans, type SubscriptionPlan } from "@/data/mockSubscriptionPlans"
import { SubscriptionPlansTable } from "./SubscriptionPlansTable"
import { buildSubscriptionPlanColumns } from "./subscriptionPlanColumns"

export default function SubscriptionPlansListPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [plans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const stats = useMemo(
    () => ({
      total: plans.length,
      active: plans.filter((p) => p.status === "Active").length,
      draft: plans.filter((p) => p.status === "Draft").length,
      totalTenors: plans.reduce((sum, p) => sum + p.tenors.length, 0),
    }),
    [plans]
  )

  const columns = useMemo(() => buildSubscriptionPlanColumns({ onView: setSelectedPlan }), [])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Subscription Plans" },
        ]}
      />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Subscription Plans"
          subtitle="Tenor-based pricing strategies configured across pricing batches"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => navigate("/portfolio/pricing-configuration/subscription-plans/new")}
          >
            <Plus className="h-4 w-4" />
            Add Subscription Plan
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Plans"
          value={stats.total.toLocaleString()}
          subtitle="Configured across all batches"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          subtitle="Currently in use"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Draft"
          value={stats.draft.toLocaleString()}
          subtitle="Not yet activated"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Tenors Configured"
          value={stats.totalTenors.toLocaleString()}
          subtitle="Across all plans"
          indicatorColor="var(--color-status-info)"
        />
      </div>

      <SubscriptionPlansTable
        plans={plans}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedPlan(row)}
      />

      <SubscriptionPlanDetailSheet
        plan={selectedPlan}
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  )
}
