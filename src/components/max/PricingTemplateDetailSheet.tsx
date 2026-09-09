import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Pencil, Archive } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import {
  costCategoryLabels,
  templateCategoryTotal,
  templateVehiclePurchaseCostTotal,
  type PricingTemplate,
} from "@/data/mockPricingTemplates"
import { mockAssetClasses } from "@/data/mockVehicleCatalog"

interface PricingTemplateDetailSheetProps {
  template: PricingTemplate | null
  isOpen: boolean
  onClose: () => void
  onArchive: (template: PricingTemplate) => void
}

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function PricingTemplateDetailSheet({ template, isOpen, onClose, onArchive }: PricingTemplateDetailSheetProps) {
  const navigate = useNavigate()
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null)

  useEffect(() => {
    setOpenCategoryKey(template?.costCategories[0]?.key ?? null)
  }, [template?.id])

  if (!template) return null

  const assetCost = templateVehiclePurchaseCostTotal(template.costCategories)
  const assetClass = mockAssetClasses.find((a) => a.id === template.vehicleTypeSubtype)
  const status = template.status ?? "Draft"
  const isArchived = status === "Inactive"

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{template.name}</SheetTitle>
            <StatusBadge variant={status === "Active" ? "success" : "default"}>{status}</StatusBadge>
          </div>
          <SheetDescription>
            {template.code ?? "—"} &middot; {template.productType ?? "—"} &middot; {template.currency ?? "—"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Template Details
              </span>
            </div>
            <div className="px-4 pb-4">
              <InfoGrid
                columns={2}
                items={[
                  { label: "Template Code", value: template.code ?? "—" },
                  { label: "Product Type", value: template.productType ?? "—" },
                  { label: "Vehicle Type", value: [template.vehicleTypePrimary, assetClass?.name].filter(Boolean).join(" · ") || "—" },
                  { label: "Currency", value: template.currency ?? "—" },
                  { label: "Effective Date", value: template.effectiveDate ?? "—" },
                  { label: "Status", value: status },
                  { label: "Description", value: template.description ?? "—" },
                ]}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Remittance Schedule
              </span>
            </div>
            <div className="px-4 pb-4">
              <InfoGrid
                columns={2}
                items={[
                  { label: "Tenor", value: `${template.remittanceSchedule.tenorMonths} months` },
                  { label: "Days per Month", value: template.remittanceSchedule.daysPerMonth },
                  { label: "Repayment Amount (Daily)", value: formatCurrency(template.remittanceSchedule.repaymentAmountDaily) },
                  { label: "Max Advantage (Daily)", value: formatCurrency(template.remittanceSchedule.maxAdvantageDaily) },
                  { label: "Battery Access Fees (Daily)", value: formatCurrency(template.remittanceSchedule.batteryAccessFeesDaily) },
                  { label: "Battery Swap Fee Subsidy (Daily)", value: formatCurrency(template.remittanceSchedule.batterySwapFeeSubsidyDaily) },
                  { label: "% Equity Contribution", value: `${template.remittanceSchedule.equityContributionPercent}%` },
                ]}
              />
            </div>
          </div>

          {template.costCategories.map((category) => (
            <div key={category.key} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenCategoryKey((prev) => (prev === category.key ? null : category.key))}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                  {costCategoryLabels[category.key]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sidebar-item-active">
                    {formatCurrency(templateCategoryTotal(category, assetCost))}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openCategoryKey === category.key ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {openCategoryKey === category.key && (
                <div className="px-4 pb-4">
                  <InfoGrid
                    columns={2}
                    items={category.lineItems.map((li) => ({
                      label: li.label,
                      value: li.unit === "percentAssetCost" ? `${li.defaultValue}%` : formatCurrency(li.defaultValue),
                    }))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          {status === "Draft" && (
            <Button
              className="h-9 px-3 gap-1.5 bg-brand-dark text-white hover:bg-brand-dark/90"
              onClick={() => {
                onClose()
                navigate(`/portfolio/pricing-configuration/templates/create?edit=${template.id}`)
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Continue Editing
            </Button>
          )}
          <Button
            variant="outline"
            className="h-9 px-3 gap-1.5 border-status-danger/30 text-status-danger hover:bg-status-danger/10 disabled:pointer-events-none disabled:opacity-40"
            disabled={isArchived}
            onClick={() => onArchive(template)}
          >
            <Archive className="h-3.5 w-3.5" />
            {isArchived ? "Template Archived" : "Archive Template"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
