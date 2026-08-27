import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { TopBar, BackButton, DataTable } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { mockPricingBatches } from "@/data/mockPricingBatches"
import { mockSubscriptionPlans, addSubscriptionPlan, type SubscriptionPlanTenor } from "@/data/mockSubscriptionPlans"
import { buildEngineRow, type TenorStrategyRow } from "./pricingEngine"
import { buildTenorStrategyColumns } from "./tenorStrategyColumns"
import { pricingEngineColumns } from "./pricingEngineColumns"

const SUBSCRIPTION_PLANS_LIST_ROUTE = "/portfolio/pricing-configuration/subscription-plans"

let tenorRowSeq = 1

const defaultTenorRows = (): TenorStrategyRow[] => [
  { id: `tenor-${tenorRowSeq++}`, enabled: true, tenorMonths: 12, grossMarginAdjustment: 0, netMarginAdjustment: 0 },
  { id: `tenor-${tenorRowSeq++}`, enabled: true, tenorMonths: 6, grossMarginAdjustment: 0, netMarginAdjustment: 0 },
  { id: `tenor-${tenorRowSeq++}`, enabled: true, tenorMonths: 3, grossMarginAdjustment: 0, netMarginAdjustment: 0 },
]

export default function SubscriptionPlansPage() {
  const navigate = useNavigate()
  const [pricingBatchId, setPricingBatchId] = useState("")
  const [tenorRows, setTenorRows] = useState<TenorStrategyRow[]>([])

  const selectedBatch = useMemo(
    () => mockPricingBatches.find((b) => b.id === pricingBatchId) ?? null,
    [pricingBatchId]
  )

  const handleSelectBatch = (id: string) => {
    setPricingBatchId(id)
    setTenorRows((prev) => (prev.length === 0 ? defaultTenorRows() : prev))
  }

  const handleToggleEnabled = (id: string) => {
    setTenorRows((prev) => prev.map((row) => (row.id === id ? { ...row, enabled: !row.enabled } : row)))
  }

  const handleFieldChange = (
    id: string,
    field: "tenorMonths" | "grossMarginAdjustment" | "netMarginAdjustment",
    value: number
  ) => {
    setTenorRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleDeleteRow = (id: string) => {
    setTenorRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleAddTenor = () => {
    setTenorRows((prev) => [
      ...prev,
      { id: `tenor-${tenorRowSeq++}`, enabled: true, tenorMonths: 0, grossMarginAdjustment: 0, netMarginAdjustment: 0 },
    ])
  }

  const tenorColumns = useMemo(
    () =>
      buildTenorStrategyColumns({
        batch: selectedBatch,
        onToggleEnabled: handleToggleEnabled,
        onFieldChange: handleFieldChange,
        onDelete: handleDeleteRow,
      }),
    [selectedBatch]
  )

  const engineRows = useMemo(() => {
    if (!selectedBatch || !selectedBatch.hasSavedRemittance) return []
    return tenorRows
      .filter((row) => row.enabled && row.tenorMonths > 0)
      .map((row) => buildEngineRow(selectedBatch, row))
  }, [selectedBatch, tenorRows])

  const isValid = selectedBatch !== null && engineRows.length > 0

  const handleSave = () => {
    if (!isValid || !selectedBatch) return

    const tenors: SubscriptionPlanTenor[] = tenorRows
      .filter((row) => row.enabled && row.tenorMonths > 0)
      .map((row) => {
        const engine = buildEngineRow(selectedBatch, row)
        return {
          tenorMonths: row.tenorMonths,
          grossMarginAdjustment: row.grossMarginAdjustment,
          netMarginAdjustment: row.netMarginAdjustment,
          targetGM: engine.targetGM,
          targetNIM: engine.targetNIM,
          totalCOS: engine.totalCOS,
          operatingCost: engine.operatingCost,
          requiredRevenue: engine.requiredRevenue,
          dailyRemittance: engine.dailyRemittance,
          totalHPValue: engine.totalHPValue,
          grossProfit: engine.grossProfit,
          netProfit: engine.netProfit,
        }
      })

    addSubscriptionPlan({
      id: String(mockSubscriptionPlans.length + 1),
      pricingBatchId: selectedBatch.id,
      pricingBatchName: selectedBatch.name,
      vehicleType: selectedBatch.vehicleType,
      daysPerMonth: selectedBatch.daysPerMonth,
      anchorGM: selectedBatch.anchorGM,
      anchorNIM: selectedBatch.anchorNIM,
      tenors,
      status: "Active",
      dateCreated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    })

    toast.success("Subscription plan saved", {
      description: `${selectedBatch.name} tenor strategy has been saved with ${engineRows.length} active tenor${engineRows.length === 1 ? "" : "s"}.`,
    })
    navigate(SUBSCRIPTION_PLANS_LIST_ROUTE)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Subscription Plans", href: SUBSCRIPTION_PLANS_LIST_ROUTE },
          { label: "New" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 flex items-center gap-3">
          <BackButton onClick={() => navigate(SUBSCRIPTION_PLANS_LIST_ROUTE)} />
          <div>
            <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
              Add Subscription Plan
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
            <p className="mt-1 text-sm font-medium text-breadcrumb-root">
              Configure tenor-based subscription pricing anchored to a pricing batch
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-6 max-w-5xl">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <FormSection title="Anchor Product">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Pricing Batch *">
                  <Select value={pricingBatchId} onValueChange={handleSelectBatch}>
                    <SelectTrigger className="h-9 w-full bg-input-soft">
                      <SelectValue placeholder="Select a pricing batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPricingBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Days per Month">
                  <Input
                    value={selectedBatch ? selectedBatch.daysPerMonth : ""}
                    disabled
                    placeholder="Auto-populated from batch"
                    className="h-9 bg-gray-100"
                  />
                </FormField>
              </div>
            </FormSection>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <FormSection title="Tenor Pricing Strategy">
              <div className="flex flex-col gap-1 -mt-2">
                <p className="text-sm font-medium text-breadcrumb-root">
                  Define how each shorter tenor derives its margins from the anchor. When the anchor pricing
                  changes, every tenor recalculates automatically.
                </p>
                {selectedBatch && (
                  <p className="text-xs font-medium text-sidebar-item-active">
                    Anchor GM: {selectedBatch.anchorGM}% &middot; Anchor NIM: {selectedBatch.anchorNIM}%
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-table-border overflow-hidden">
                <DataTable
                  columns={tenorColumns}
                  data={tenorRows}
                  emptyMessage={
                    selectedBatch
                      ? "No tenors yet. Use “+ Add Tenor” to define one."
                      : "Select a pricing batch to configure tenor strategies."
                  }
                />
              </div>

              <Button
                variant="outline"
                className="h-9 gap-2 self-start"
                onClick={handleAddTenor}
                disabled={!selectedBatch}
              >
                <Plus className="h-4 w-4" />
                Add Tenor
              </Button>
            </FormSection>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <FormSection title="Pricing Engine · System-Generated Output">
              {engineRows.length === 0 ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-10">
                  <p className="text-sm font-medium text-breadcrumb-root">
                    Link a batch with a saved remittance to generate pricing.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-table-border overflow-hidden overflow-x-auto">
                  <DataTable columns={pricingEngineColumns} data={engineRows} />
                </div>
              )}
            </FormSection>
          </div>
        </div>

        <div className="px-6 border-t border-divider py-4 mt-2 max-w-5xl">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate(SUBSCRIPTION_PLANS_LIST_ROUTE)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!isValid}
              onClick={handleSave}
            >
              Save Subscription Plans
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
