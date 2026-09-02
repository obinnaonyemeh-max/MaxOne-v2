import { useMemo, useState } from "react"
import { CheckCircle2, AlertTriangle, Info } from "lucide-react"

import { StatCard } from "@/components/max"
import { Switch } from "@/components/ui/switch"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"
import {
  type SettlementQuote,
  type SettlementValidationLevel,
  formatCurrency,
  formatSignedCurrency,
  buildSettlementComputation,
} from "./earlyTerminationCalculations"

interface SettlementTabProps {
  contract: EarlyTerminationContract | null
  quote: SettlementQuote | null
}

const validationIcon: Record<SettlementValidationLevel, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const validationTextClass: Record<SettlementValidationLevel, string> = {
  success: "text-status-success",
  warning: "text-status-warning",
  info: "text-muted-foreground",
}

export function SettlementTab({ contract, quote }: SettlementTabProps) {
  const [feeEnabled, setFeeEnabled] = useState(false)

  const settlement = useMemo(
    () => (contract && quote ? buildSettlementComputation(contract, quote, feeEnabled) : null),
    [contract, quote, feeEnabled]
  )

  if (!contract || !quote || !settlement) {
    return (
      <div className="px-6">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
          <p className="text-sm font-medium text-breadcrumb-root">
            Select a country, customer and contract to compute a settlement.
          </p>
        </div>
      </div>
    )
  }

  const metrics = [
    { title: "Operating Expense Overdue", value: settlement.operatingExpenseOverdue, indicatorColor: "var(--color-status-warning)" },
    { title: "Principal Overdue", value: settlement.principalOverdue, indicatorColor: "var(--color-status-warning)" },
    { title: "Outstanding Principal (Un-billed)", value: settlement.outstandingPrincipalUnbilled, indicatorColor: "var(--color-status-info)" },
    { title: "Accruals (S&M + Margin)", value: settlement.accruals, indicatorColor: "var(--color-status-info)" },
    { title: "Margin Buffer Shortfall", value: settlement.marginBufferShortfall, indicatorColor: "var(--color-status-info)" },
    { title: "Applicable Credits", value: -settlement.applicableCredits, indicatorColor: "var(--color-status-success)" },
  ]

  return (
    <div className="px-6 grid grid-cols-3 gap-4">
      <div className="col-span-2 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <StatCard
              key={metric.title}
              title={metric.title.toUpperCase()}
              value={formatSignedCurrency(metric.value)}
              indicatorColor={metric.indicatorColor}
            />
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-sidebar-item-active">Early Termination Fee</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Defaults to {formatCurrency(0)} unless configured by policy.</p>
          </div>
          <Switch checked={feeEnabled} onCheckedChange={setFeeEnabled} />
        </div>

        <div className="rounded-lg border border-brand-primary bg-brand-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Settlement Amount</p>
          <p className="mt-1 font-semibold text-sidebar-item-active" style={{ fontSize: "32px" }}>
            {formatCurrency(settlement.settlementAmount)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Operating overdue + principal overdue + un-billed principal + accruals ={" "}
            {formatCurrency(settlement.subtotal)}, less {formatCurrency(settlement.applicableCredits)} credits.
            {settlement.marginBufferShortfall > 0 && (
              <> Margin buffer of 40% applied ({formatCurrency(settlement.marginBufferShortfall)}), included in accruals above.</>
            )}
          </p>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Settlement Breakdown</span>
          <div className="mt-3 flex flex-col divide-y divide-gray-100">
            {settlement.breakdownLines.map((line) => (
              <div key={line.key} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-table-text">{line.label}</span>
                <span className="font-medium text-table-text-primary">{formatSignedCurrency(line.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 text-sm font-semibold text-sidebar-item-active">
              <span>Settlement Amount</span>
              <span>{formatCurrency(settlement.settlementAmount)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Settlement Validation</span>
          <div className="mt-3 flex flex-col gap-2.5">
            {settlement.validation.map((item) => {
              const Icon = validationIcon[item.level]
              return (
                <div key={item.key} className="flex items-start gap-2">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${validationTextClass[item.level]}`} />
                  <span className={`text-sm ${item.level === "info" ? "text-muted-foreground" : "text-table-text-primary"}`}>
                    {item.message}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
