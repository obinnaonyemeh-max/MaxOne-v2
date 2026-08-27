import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import {
  type PricingBatchRecord,
  pricingBatchStatusVariantMap,
  categoryTotal,
  vehiclePurchaseCostTotal,
} from "@/data/mockPricingBatchRecords"

interface PricingBatchDetailSheetProps {
  batch: PricingBatchRecord | null
  isOpen: boolean
  onClose: () => void
}

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function PricingBatchDetailSheet({ batch, isOpen, onClose }: PricingBatchDetailSheetProps) {
  const navigate = useNavigate()
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null)

  useEffect(() => {
    setOpenCategoryKey(batch?.costCategories[0]?.key ?? null)
  }, [batch?.id])

  if (!batch) return null

  const assetCost = vehiclePurchaseCostTotal(batch.costCategories)

  const handleEdit = () => {
    onClose()
    navigate(`/portfolio/pricing-configuration/pricing-batches/${batch.id}/edit`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[42vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{batch.code}</SheetTitle>
            <StatusBadge variant={pricingBatchStatusVariantMap[batch.status]}>{batch.status}</StatusBadge>
          </div>
          <SheetDescription>
            {batch.countryName} &middot; {batch.manufacturerName} {batch.modelName} ({batch.trimName}) &middot; Added {batch.dateCreated}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-brand-dark p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Grand Total</span>
              <span className="text-xl font-semibold text-white">{formatCurrency(batch.grandTotal)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Batch Details
              </span>
            </div>
            <div className="px-4 pb-4">
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
            </div>
          </div>

          {batch.costCategories.map((category) => (
            <div key={category.key} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenCategoryKey((prev) => (prev === category.key ? null : category.key))}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                  {category.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sidebar-item-active">
                    {formatCurrency(categoryTotal(category, assetCost))}
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
                      value: li.unit === "percentAssetCost" ? `${li.value}%` : formatCurrency(li.value),
                    }))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          <Button variant="outline" className="h-9 px-3" onClick={onClose}>
            Close
          </Button>
          <Button className="h-9 px-3 bg-brand-dark text-white hover:bg-brand-dark/90" onClick={handleEdit}>
            Edit Batch
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
