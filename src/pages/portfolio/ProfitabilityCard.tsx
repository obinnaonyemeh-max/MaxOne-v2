import { type RemittancePlanSummary } from "./remittancePlan"

function formatCurrency(amount: number): string {
  return Math.round(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface ProfitabilityCardProps {
  summary: RemittancePlanSummary
}

export function ProfitabilityCard({ summary }: ProfitabilityCardProps) {
  return (
    <div className="sticky top-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="bg-brand-primary/20 px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark">Profitability</span>
      </div>
      <div className="px-5 py-4 flex flex-col divide-y divide-gray-100">
        <div className="flex flex-col gap-1 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-breadcrumb-root">Gross Profit</span>
            <span className="text-sm font-semibold text-sidebar-item-active">{formatCurrency(summary.grossProfit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm italic font-medium text-status-warning">Gross Margin</span>
            <span className="text-sm italic font-semibold text-status-warning">{summary.grossMargin.toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-breadcrumb-root">Net Income</span>
            <span className="text-sm font-semibold text-sidebar-item-active">{formatCurrency(summary.netIncome)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm italic font-medium text-status-warning">Net Income Margin</span>
            <span className="text-sm italic font-semibold text-status-warning">{summary.netIncomeMargin.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
