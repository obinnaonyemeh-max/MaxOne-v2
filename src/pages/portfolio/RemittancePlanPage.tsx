import { useMemo, useState } from "react"
import { Car, Layers, Megaphone, Wallet } from "lucide-react"

import { TopBar, PageHeader, CollapsibleCard, InfoGrid } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPricingBatchRecords } from "@/data/mockPricingBatchRecords"
import { mockPricingTemplates, costCategoryLabels, type CostCategoryKey } from "@/data/mockPricingTemplates"
import { categoryTotal, vehiclePurchaseCostTotal } from "@/data/mockPricingBatchRecords"
import { buildRemittanceSchedule, buildRemittancePlanSummary } from "./remittancePlan"
import { ProfitabilityCard } from "./ProfitabilityCard"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

const COST_OF_SALES_KEYS: CostCategoryKey[] = ["vehiclePurchaseCost", "costOfFunds"]
const OPEX_KEYS: CostCategoryKey[] = ["onboardingCost", "operationalCost", "maxAdvantage", "salesAndMarketing", "risksAndContingency"]

export default function RemittancePlanPage() {
  const [batchId, setBatchId] = useState("")

  const batch = useMemo(() => mockPricingBatchRecords.find((b) => b.id === batchId) ?? null, [batchId])
  const template = useMemo(
    () => (batch ? mockPricingTemplates.find((t) => t.id === batch.pricingTemplateId) ?? null : null),
    [batch]
  )
  const schedule = useMemo(() => (batch && template ? buildRemittanceSchedule(batch, template) : null), [batch, template])
  const summary = useMemo(() => (batch && schedule ? buildRemittancePlanSummary(batch, schedule) : null), [batch, schedule])

  const assetCost = batch ? vehiclePurchaseCostTotal(batch.costCategories) : 0

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Remittance Plan" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <PageHeader
          title="Remittance Plan"
          subtitle="Select a pricing batch to view its auto-generated remittance schedule and profitability"
        />

        <div className="px-6 pb-6 flex flex-col gap-6 max-w-5xl">
          <div className="flex flex-col gap-1.5 max-w-sm">
            <label className="text-xs font-medium text-breadcrumb-root">Pricing Batch</label>
            <Select value={batchId} onValueChange={setBatchId}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select a pricing batch" />
              </SelectTrigger>
              <SelectContent>
                {mockPricingBatchRecords.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.code} — {b.manufacturerName} {b.modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!batch || !template || !schedule || !summary ? (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
              <p className="text-sm font-medium text-breadcrumb-root">
                Select a pricing batch to view its remittance plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 items-start">
              <div className="col-span-2 flex flex-col gap-3">
                <CollapsibleCard
                  icon={Layers}
                  title="Remittance Schedule"
                  defaultOpen
                  helperText={`Auto-populated from ${batch.code}'s pricing template. View only.`}
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Tenor (months)</label>
                      <Input value={schedule.tenorMonths} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Days per Month</label>
                      <Input value={schedule.daysPerMonth} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Repayment Amount (Daily)</label>
                      <Input value={schedule.repaymentAmountDaily} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Max Advantage (Daily)</label>
                      <Input value={schedule.maxAdvantageDaily} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Battery Access Fees (Daily)</label>
                      <Input value={schedule.batteryAccessFeesDaily} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">Battery Swap Fee Subsidy (Daily)</label>
                      <Input value={schedule.batterySwapFeeSubsidyDaily} disabled className="h-9 bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-breadcrumb-root">% Equity Contribution</label>
                      <Input value={schedule.equityContributionPercent} disabled className="h-9 bg-gray-100" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">
                        Equity Contribution
                      </p>
                      <p className="mt-1 font-semibold text-sidebar-item-active text-sm">
                        {formatCurrency(schedule.equityContribution)}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Total Days</p>
                      <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{schedule.totalDays}</p>
                    </div>
                    <div className="rounded-md border border-brand-primary/40 bg-brand-primary/10 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">
                        Daily Remittance
                      </p>
                      <p className="mt-1 font-semibold text-sidebar-item-active text-sm">
                        {formatCurrency(schedule.dailyRemittance)}
                      </p>
                    </div>
                  </div>
                </CollapsibleCard>

                <CollapsibleCard icon={Wallet} title="Revenue Inputs">
                  <InfoGrid
                    columns={2}
                    items={[
                      { label: "Repayment Amount (Daily)", value: formatCurrency(schedule.repaymentAmountDaily) },
                      { label: "Max Advantage (Daily)", value: formatCurrency(schedule.maxAdvantageDaily) },
                      { label: "Battery Access Fees (Daily)", value: formatCurrency(schedule.batteryAccessFeesDaily) },
                      { label: "Battery Swap Fee Subsidy (Daily)", value: formatCurrency(schedule.batterySwapFeeSubsidyDaily) },
                      { label: "Total Days", value: schedule.totalDays },
                      { label: "Total Revenue", value: formatCurrency(summary.totalRevenue) },
                    ]}
                  />
                </CollapsibleCard>

                <CollapsibleCard icon={Car} title="Cost of Sales">
                  <InfoGrid
                    columns={2}
                    items={[
                      ...COST_OF_SALES_KEYS.map((key) => {
                        const category = batch.costCategories.find((c) => c.key === key)
                        return {
                          label: costCategoryLabels[key],
                          value: formatCurrency(category ? categoryTotal(category, assetCost) : 0),
                        }
                      }),
                      { label: "Total Cost of Sales", value: formatCurrency(summary.totalCostOfSales) },
                    ]}
                  />
                </CollapsibleCard>

                <CollapsibleCard icon={Megaphone} title="Opex">
                  <InfoGrid
                    columns={2}
                    items={[
                      ...OPEX_KEYS.map((key) => {
                        const category = batch.costCategories.find((c) => c.key === key)
                        return {
                          label: costCategoryLabels[key],
                          value: formatCurrency(category ? categoryTotal(category, assetCost) : 0),
                        }
                      }),
                      { label: "Total Opex", value: formatCurrency(summary.totalOpex) },
                    ]}
                  />
                </CollapsibleCard>

                <CollapsibleCard icon={Layers} title="Batch Details">
                  <InfoGrid
                    columns={2}
                    items={[
                      { label: "Country", value: batch.countryName },
                      { label: "Pricing Template", value: batch.pricingTemplateName },
                      { label: "Asset Class", value: batch.assetClassName },
                      { label: "Vehicle Type", value: batch.vehicleTypeName },
                      { label: "Manufacturer", value: batch.manufacturerName },
                      { label: "Model", value: batch.modelName },
                      { label: "Trim", value: batch.trimName },
                      { label: "Financier", value: batch.financierName },
                      { label: "Vehicles", value: batch.vehicleCount.toLocaleString() },
                      { label: "Date Created", value: batch.dateCreated },
                    ]}
                  />
                </CollapsibleCard>
              </div>

              <div className="col-span-1">
                <ProfitabilityCard summary={summary} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
