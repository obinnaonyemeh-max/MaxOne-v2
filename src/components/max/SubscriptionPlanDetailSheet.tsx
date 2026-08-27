import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { type SubscriptionPlan, subscriptionPlanStatusVariantMap } from "@/data/mockSubscriptionPlans"

interface SubscriptionPlanDetailSheetProps {
  plan: SubscriptionPlan | null
  isOpen: boolean
  onClose: () => void
}

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

export function SubscriptionPlanDetailSheet({ plan, isOpen, onClose }: SubscriptionPlanDetailSheetProps) {
  if (!plan) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[45vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{plan.pricingBatchName}</SheetTitle>
            <StatusBadge variant={subscriptionPlanStatusVariantMap[plan.status]}>{plan.status}</StatusBadge>
          </div>
          <SheetDescription>
            {plan.vehicleType} &middot; Anchor GM {plan.anchorGM}% &middot; Anchor NIM {plan.anchorNIM}% &middot; Added {plan.dateCreated}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Anchor Product
              </span>
            </div>
            <div className="px-4 pb-4">
              <InfoGrid
                columns={2}
                items={[
                  { label: "Pricing Batch", value: plan.pricingBatchName },
                  { label: "Vehicle Type", value: plan.vehicleType },
                  { label: "Days per Month", value: plan.daysPerMonth },
                  { label: "Date Created", value: plan.dateCreated },
                  { label: "Anchor GM", value: `${plan.anchorGM}%` },
                  { label: "Anchor NIM", value: `${plan.anchorNIM}%` },
                ]}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Tenor Pricing Strategy
              </span>
            </div>
            <div className="px-4 pb-4 flex flex-col gap-3">
              {plan.tenors.map((tenor) => (
                <div key={tenor.tenorMonths} className="rounded-md border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sidebar-item-active text-sm">{tenor.tenorMonths} months</span>
                    <span className="text-xs text-breadcrumb-root">
                      GM Adj. −{tenor.grossMarginAdjustment}% &middot; NIM Adj. −{tenor.netMarginAdjustment}%
                    </span>
                  </div>
                  <InfoGrid
                    columns={4}
                    items={[
                      { label: "Target GM", value: `${tenor.targetGM.toFixed(2)}%` },
                      { label: "Target NIM", value: `${tenor.targetNIM.toFixed(2)}%` },
                      { label: "Total COS", value: formatCurrency(tenor.totalCOS) },
                      { label: "Operating Cost", value: formatCurrency(tenor.operatingCost) },
                      { label: "Required Revenue", value: formatCurrency(tenor.requiredRevenue) },
                      { label: "Daily Remittance", value: formatCurrency(tenor.dailyRemittance) },
                      { label: "Total HP Value", value: formatCurrency(tenor.totalHPValue) },
                      { label: "Gross / Net Profit", value: `${formatCurrency(tenor.grossProfit)} / ${formatCurrency(tenor.netProfit)}` },
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          <Button variant="outline" className="h-9 px-3" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
