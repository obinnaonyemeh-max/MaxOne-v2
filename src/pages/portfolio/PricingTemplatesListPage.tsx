import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import { TopBar, PageHeader, StatCard, PricingTemplateDetailSheet } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockPricingTemplates, templateGrandTotal, type PricingTemplate } from "@/data/mockPricingTemplates"
import { PricingTemplatesTable } from "./PricingTemplatesTable"
import { buildPricingTemplateColumns } from "./pricingTemplateColumns"

export default function PricingTemplatesListPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [templates] = useState<PricingTemplate[]>(mockPricingTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<PricingTemplate | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const stats = useMemo(
    () => ({
      total: templates.length,
      active: templates.filter((t) => t.status === "Active").length,
      draft: templates.filter((t) => t.status !== "Active").length,
      averageGrandTotal:
        templates.length > 0
          ? templates.reduce((sum, t) => sum + templateGrandTotal(t.costCategories), 0) / templates.length
          : 0,
    }),
    [templates]
  )

  const columns = useMemo(() => buildPricingTemplateColumns({ onView: setSelectedTemplate }), [])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Pricing Templates" },
        ]}
      />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Pricing Templates"
          subtitle="Baseline pricing formulas that Pricing Batches inherit from"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => navigate("/portfolio/pricing-configuration/templates/create")}
          >
            <Plus className="h-4 w-4" />
            Create Pricing Template
          </Button>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Total Templates"
          value={stats.total.toLocaleString()}
          subtitle="Available across all vehicle types"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          subtitle="Selectable when creating a batch"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Draft"
          value={stats.draft.toLocaleString()}
          subtitle="Not yet activated"
          indicatorColor="var(--color-status-purple)"
        />
        <StatCard
          title="Avg. Cost Base"
          value={"₦" + Math.round(stats.averageGrandTotal).toLocaleString()}
          subtitle="Across all templates"
          indicatorColor="var(--color-status-info)"
        />
      </div>

      <PricingTemplatesTable
        templates={templates}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedTemplate(row)}
      />

      <PricingTemplateDetailSheet
        template={selectedTemplate}
        isOpen={selectedTemplate !== null}
        onClose={() => setSelectedTemplate(null)}
      />
    </>
  )
}
