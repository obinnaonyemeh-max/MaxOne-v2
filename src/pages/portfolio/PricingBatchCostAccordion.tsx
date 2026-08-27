import { useState } from "react"
import { ChevronDown, Car, Wallet, Layers, Megaphone, type LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { type BatchCostCategory } from "@/data/mockPricingBatchRecords"
import { type CostCategoryKey } from "@/data/mockPricingTemplates"

const categoryIcons: Record<CostCategoryKey, LucideIcon> = {
  vehiclePurchaseCost: Car,
  costOfFunds: Wallet,
  onboardingCost: Layers,
  operationalCost: Layers,
  maxAdvantage: Wallet,
  salesAndMarketing: Megaphone,
  risksAndContingency: Layers,
}

// Suggested example values shown in the placeholder for the percent-of-asset-cost fields.
const percentExampleHints: Record<string, number> = {
  "li-comprehensive-insurance": 3,
  "li-refurbishment-provision": 2,
  "li-default-provision": 5,
}

interface PricingBatchCostAccordionProps {
  category: BatchCostCategory
  onLineItemChange: (categoryKey: string, lineItemId: string, value: number) => void
}

export function PricingBatchCostAccordion({ category, onLineItemChange }: PricingBatchCostAccordionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const Icon = categoryIcons[category.key]
  const isPercentCategory = category.lineItems.some((item) => item.unit === "percentAssetCost")

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="flex-1 font-semibold text-sidebar-item-active text-sm">{category.label}</span>
        <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 px-5 py-4">
          {isPercentCategory && (
            <p className="mb-3 text-xs font-medium text-breadcrumb-root">
              Entered as a % of asset cost. Values compute live in the summary.
            </p>
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {category.lineItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">{item.label}</label>
                {item.auto ? (
                  <Input value={item.value.toFixed(2)} disabled className="h-9 bg-gray-100" />
                ) : item.unit === "percentAssetCost" ? (
                  <div className="relative">
                    <Input
                      type="number"
                      value={item.value === 0 ? "" : item.value}
                      onChange={(e) => onLineItemChange(category.key, item.id, Number(e.target.value) || 0)}
                      placeholder={`e.g. ${percentExampleHints[item.id] ?? 0}`}
                      className="h-9 bg-input-soft pr-7"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                      %
                    </span>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={item.value === 0 ? "" : item.value}
                    onChange={(e) => onLineItemChange(category.key, item.id, Number(e.target.value) || 0)}
                    placeholder={`Enter ${item.label}`}
                    className="h-9 bg-input-soft"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
