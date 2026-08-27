import { FormSection } from "@/pages/vehicles/FormControls"
import {
  comprehensiveInsuranceCost,
  defaultProvisionCost,
  formatCurrency,
  refurbishmentProvisionCost,
  totalRiskContingencyCosts,
} from "../calculations"
import { type WizardState } from "../types"

interface Stage9Props {
  values: WizardState
}

export function Stage9RiskContingencyCosts({ values }: Stage9Props) {
  const cards = [
    {
      label: "Comprehensive Insurance Cost",
      value: comprehensiveInsuranceCost(values),
      formula: `${values.comprehensiveInsuranceRatePercent}% p.a. × Vehicle Cost × (${values.baseTenorMonths} / 12 months)`,
    },
    {
      label: "Refurbishment Provision",
      value: refurbishmentProvisionCost(values),
      formula: `${values.refurbishmentProvisionRatePercent}% × Vehicle Cost`,
    },
    {
      label: "Default Provision",
      value: defaultProvisionCost(values),
      formula: `${values.defaultProvisionRatePercent}% × Vehicle Cost`,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Risk & Contingency Costs">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Auto-calculated from the rates set in Commercial Assumptions and the Vehicle Purchase Cost. Read-only.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">{card.label}</p>
              <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{formatCurrency(card.value)}</p>
              <p className="mt-1 text-xs text-breadcrumb-root">{card.formula}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-brand-dark px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Total Risk & Contingency Costs</span>
          <span className="text-lg font-semibold text-white">{formatCurrency(totalRiskContingencyCosts(values))}</span>
        </div>
      </FormSection>
    </div>
  )
}
