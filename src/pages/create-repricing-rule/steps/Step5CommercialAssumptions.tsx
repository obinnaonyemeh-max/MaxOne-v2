import type { Dispatch } from "react"
import { CheckCircle2 } from "lucide-react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { Input } from "@/components/ui/input"
import { EXPECTED_COLLECTION_RATE_PERCENT } from "../referenceData"
import { defaultTenorMonths, equityFundingPercent, formatPercent } from "../calculations"
import { type WizardAction, type WizardState } from "../types"

interface Step5Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

function PercentField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-breadcrumb-root">{label}</label>
      <div className="flex h-9 items-center rounded-md border border-gray-200 bg-gray-100 px-3 font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
        {value}
      </div>
    </div>
  )
}

function EditableField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string
  value: number
  unit: "percent" | "currency" | "number"
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-breadcrumb-root">{label}</label>
      <div className="relative">
        {unit === "currency" && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
            ₦
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={unit === "currency" ? "h-9 bg-input-soft pl-7" : unit === "percent" ? "h-9 bg-input-soft pr-7" : "h-9 bg-input-soft"}
        />
        {unit === "percent" && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
            %
          </span>
        )}
      </div>
    </div>
  )
}

export function Step5CommercialAssumptions({ values, dispatch }: Step5Props) {
  const tenor = defaultTenorMonths(values)
  const equityPercent = equityFundingPercent(values)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Contract Structure">
          <div className="grid grid-cols-2 gap-4">
            <PercentField label="Default Tenor (Months)" value={`${tenor} months`} />
            <EditableField
              label="Collection Days / Month"
              value={values.collectionDaysPerMonth}
              unit="number"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "collectionDaysPerMonth", value: v })}
            />
            <PercentField label="Collection Days (Auto-computed)" value={`${tenor * values.collectionDaysPerMonth} days`} />
            <PercentField label="Expected Collection Rate" value={formatPercent(EXPECTED_COLLECTION_RATE_PERCENT, 0)} />
          </div>
        </FormSection>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Funding">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              label="Debt Funding"
              value={values.debtFundingPercent}
              unit="percent"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "debtFundingPercent", value: Math.min(100, Math.max(0, v)) })}
            />
            <PercentField label="Equity Funding (Auto-computed)" value={formatPercent(equityPercent, 0)} />
            <EditableField
              label="Debt Interest Rate"
              value={values.debtInterestRatePercent}
              unit="percent"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "debtInterestRatePercent", value: v })}
            />
            <EditableField
              label="Equity Cost"
              value={values.equityCostPercent}
              unit="percent"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "equityCostPercent", value: v })}
            />
            <EditableField
              label="Lender Processing Fee"
              value={values.lenderProcessingFeePercent}
              unit="percent"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "lenderProcessingFeePercent", value: v })}
            />
          </div>

          <div className="rounded-md border border-status-success/30 bg-status-success/5 px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-status-success" />
            <p className="text-sm font-medium text-status-success">
              Total funding split {formatPercent(values.debtFundingPercent, 0)} debt + {formatPercent(equityPercent, 0)} equity = 100%
            </p>
          </div>
        </FormSection>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Commercial">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              label="VAT"
              value={values.vatPercent}
              unit="percent"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "vatPercent", value: v })}
            />
            <EditableField
              label="Daily Battery Swap Subsidy"
              value={values.dailyBatterySwapSubsidy}
              unit="currency"
              onChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "dailyBatterySwapSubsidy", value: v })}
            />
          </div>
        </FormSection>
      </div>
    </div>
  )
}
