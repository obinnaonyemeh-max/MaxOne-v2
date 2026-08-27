import type { Dispatch } from "react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { FieldGrid, type FieldConfig } from "./FieldGrid"
import { formatCurrency } from "./calculations"
import { type WizardAction, type WizardFields } from "./types"

interface AutoBadge {
  label: string
  value: number
  formula: string
}

interface CostCategoryStageProps {
  title: string
  description: string
  fields: FieldConfig[]
  values: WizardFields
  dispatch: Dispatch<WizardAction>
  total: number
  totalLabel: string
  autoBadge?: AutoBadge
}

export function CostCategoryStage({
  title,
  description,
  fields,
  values,
  dispatch,
  total,
  totalLabel,
  autoBadge,
}: CostCategoryStageProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title={title}>
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">{description}</p>

        <FieldGrid fields={fields} values={values} dispatch={dispatch} />

        {autoBadge && (
          <div className="rounded-md border border-status-info/30 bg-status-info/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-status-info">{autoBadge.label}</span>
              <span className="text-sm font-semibold text-status-info">{formatCurrency(autoBadge.value)}</span>
            </div>
            <p className="mt-1 text-xs text-breadcrumb-root">{autoBadge.formula}</p>
          </div>
        )}

        <div className="rounded-md bg-brand-dark px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{totalLabel}</span>
          <span className="text-lg font-semibold text-white">{formatCurrency(total)}</span>
        </div>
      </FormSection>
    </div>
  )
}
