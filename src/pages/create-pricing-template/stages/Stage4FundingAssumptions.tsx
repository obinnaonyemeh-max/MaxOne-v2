import type { Dispatch } from "react"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { FieldGrid, type FieldConfig } from "../FieldGrid"
import { blendedCostOfFunds, fundingMixIsValid, formatCurrency, formatPercent, totalCostOfFunds } from "../calculations"
import { type WizardAction, type WizardState } from "../types"

const fields: FieldConfig[] = [
  { key: "debtFundingMixPercent", label: "Debt Funding Mix", unit: "percent" },
  { key: "equityFundingMixPercent", label: "Equity Funding Mix", unit: "percent" },
  { key: "debtCostOfFundsPercent", label: "Debt Cost of Funds", unit: "percent" },
  { key: "equityCostOfFundsPercent", label: "Equity Cost of Funds", unit: "percent" },
  { key: "lenderProcessingFee", label: "Lender Processing Fee", unit: "currency" },
]

interface Stage4Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Stage4FundingAssumptions({ values, dispatch }: Stage4Props) {
  const isValid = fundingMixIsValid(values)
  const mixSum = values.debtFundingMixPercent + values.equityFundingMixPercent

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Funding Assumptions">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Debt and equity funding mix and cost of funds used to derive the blended cost of funds.
        </p>

        <FieldGrid fields={fields} values={values} dispatch={dispatch} />

        <div
          className={`rounded-md border px-4 py-3 flex items-start gap-2 ${
            isValid ? "border-status-success/30 bg-status-success/5" : "border-status-danger/30 bg-status-danger/5"
          }`}
        >
          {isValid ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-status-success" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-status-danger" />
          )}
          <p className={`text-sm font-medium ${isValid ? "text-status-success" : "text-status-danger"}`}>
            {isValid
              ? "Debt and equity funding mix sums to 100%."
              : `Debt and equity funding mix must sum to 100% — currently ${mixSum}%.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-breadcrumb-root">Blended CoF (%)</p>
            <p className="mt-1 font-semibold text-sidebar-item-active text-sm">{formatPercent(blendedCostOfFunds(values))}</p>
          </div>
          <div className="rounded-md bg-brand-dark px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Cost of Funds (₦)</p>
            <p className="mt-1 font-semibold text-white text-sm">{formatCurrency(totalCostOfFunds(values))}</p>
          </div>
        </div>
      </FormSection>
    </div>
  )
}
