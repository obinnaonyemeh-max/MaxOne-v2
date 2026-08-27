import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type Country } from "@/data/mockCountries"
import { type BatchCostCategory, categoryTotal, vehiclePurchaseCostTotal } from "@/data/mockPricingBatchRecords"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

interface LiveCostSummaryCardProps {
  country: Country | null
  costCategories: BatchCostCategory[]
  grandTotal: number
  vehicleCount: number
  onUploadVehicles: () => void
}

export function LiveCostSummaryCard({
  country,
  costCategories,
  grandTotal,
  vehicleCount,
  onUploadVehicles,
}: LiveCostSummaryCardProps) {
  const assetCost = vehiclePurchaseCostTotal(costCategories)

  return (
    <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Live Cost Summary</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
          {country && <span className="text-base leading-none">{country.flag}</span>}
          <span className="font-semibold text-sidebar-item-active text-base">{country ? country.name : "—"}</span>
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {costCategories.map((category) => (
          <div key={category.key} className="flex items-center justify-between py-2.5">
            <span className="text-sm font-medium text-breadcrumb-root">{category.label}</span>
            <span className="text-sm font-medium text-sidebar-item-active">
              {formatCurrency(categoryTotal(category, assetCost))}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-brand-dark px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Grand Total</span>
        <span className="text-lg font-semibold text-white">{formatCurrency(grandTotal)}</span>
      </div>

      <div className="flex items-center justify-between text-xs font-medium text-breadcrumb-root">
        <span>Vehicles linked</span>
        <span className="text-sidebar-item-active">{vehicleCount.toLocaleString()}</span>
      </div>

      <Button variant="outline" className="h-10 gap-2 w-full" onClick={onUploadVehicles}>
        <Upload className="h-4 w-4" />
        Upload Vehicles
      </Button>
    </div>
  )
}
