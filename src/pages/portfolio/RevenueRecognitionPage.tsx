import { useMemo, useState } from "react"
import { FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { TopBar, StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/pages/vehicles/FormControls"
import { mockCountries } from "@/data/mockCountries"
import { mockPricingTemplates } from "@/data/mockPricingTemplates"
import { buildRevenueRecognition } from "./revenueRecognitionCalculations"
import { RevenueRecognitionTable } from "./RevenueRecognitionTable"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export default function RevenueRecognitionPage() {
  const [countryId, setCountryId] = useState("")
  const [templateId, setTemplateId] = useState("")

  const country = useMemo(() => mockCountries.find((c) => c.id === countryId) ?? null, [countryId])
  const template = useMemo(() => mockPricingTemplates.find((t) => t.id === templateId) ?? null, [templateId])
  const breakdown = useMemo(() => (template ? buildRevenueRecognition(template) : null), [template])

  const handleSave = () => {
    if (!template) return
    toast.success("Recognition breakdown saved", {
      description: `${template.name}'s revenue recognition profile has been saved.`,
    })
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Products & Pricing" }, { label: "Revenue Recognition" }]} />

      <div className="px-6 flex items-start justify-between">
        <div className="py-6">
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
            Revenue Recognition
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root max-w-2xl">
            Revenue allocation profile computed automatically from a pricing template.
          </p>
        </div>
        <div className="py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            disabled={!template || !breakdown}
            onClick={handleSave}
          >
            <FileText className="h-4 w-4" />
            Save Recognition Breakdown
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Country">
              <Select value={countryId} onValueChange={setCountryId}>
                <SelectTrigger className="h-9 w-full bg-input-soft">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Pricing Template">
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="h-9 w-full bg-input-soft">
                  <SelectValue placeholder="Select pricing template" />
                </SelectTrigger>
                <SelectContent>
                  {mockPricingTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {breakdown && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Tenor</p>
                <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{breakdown.tenorMonths} months</p>
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Collection Days</p>
                <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{breakdown.collectionDaysPerMonth} / month</p>
              </div>
              <div className="rounded-md border border-brand-primary/40 bg-brand-primary/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Total Contract Revenue</p>
                <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{formatCurrency(breakdown.totalContractRevenue)}</p>
              </div>
              <div className="rounded-md border border-brand-primary/40 bg-brand-primary/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Daily Remittance</p>
                <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{formatCurrency(breakdown.dailyRemittanceTotal)}</p>
              </div>
            </div>
          )}
        </div>

        {!template || !breakdown ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
            <p className="text-sm font-medium text-breadcrumb-root">
              Select a pricing template to view its revenue recognition breakdown.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 items-start">
            <div className="col-span-2">
              <RevenueRecognitionTable sections={breakdown.sections} />
            </div>

            <div className="col-span-1 flex flex-col gap-3 sticky top-6">
              <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Country</span>
                <span className="text-sm font-semibold text-sidebar-item-active">
                  {country ? `${country.flag} ${country.name}` : "—"}
                </span>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Pricing Template</span>
                <p className="mt-1 text-sm font-semibold text-sidebar-item-active">{template.name}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Allocation Summary</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-breadcrumb-root">Total Revenue</span>
                  <span className="text-sm font-semibold text-sidebar-item-active">{formatCurrency(breakdown.totalContractRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-breadcrumb-root">Daily Remittance</span>
                  <span className="text-sm font-semibold text-sidebar-item-active">{formatCurrency(breakdown.dailyRemittanceTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-breadcrumb-root">Tenor × Collection Days</span>
                  <span className="text-sm font-semibold text-sidebar-item-active">
                    {breakdown.tenorMonths} × {breakdown.collectionDaysPerMonth} = {breakdown.totalDays} days
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-breadcrumb-root">Allocation Status</span>
                  <StatusBadge variant="success">{breakdown.allocationStatusPercent.toFixed(2)}%</StatusBadge>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Reconciliation Checklist</span>
                {[
                  "Pricing template loaded successfully",
                  "Revenue allocation = 100%",
                  "Daily remittance reconciles with total contract revenue",
                ].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-status-success" />
                    <span className="text-sm font-medium text-sidebar-item-active">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
