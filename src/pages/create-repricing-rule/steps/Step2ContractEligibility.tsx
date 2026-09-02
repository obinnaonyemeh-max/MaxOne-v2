import type { Dispatch } from "react"
import { CheckboxGrid } from "@/components/max"
import { FormSection } from "@/pages/vehicles/FormControls"
import { PROCESS_STAGE_OPTIONS, REFURBISHMENT_STATUS_OPTIONS, VEHICLE_ELIGIBILITY_OPTIONS } from "../referenceData"
import { type WizardAction, type WizardState } from "../types"

interface Step2Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step2ContractEligibility({ values, dispatch }: Step2Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Contract Eligibility">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Automated matching criteria — a contract must satisfy at least one selection in every group below to be
          picked up by this rule.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-breadcrumb-root">Process Stage *</label>
          <CheckboxGrid
            columns={3}
            items={PROCESS_STAGE_OPTIONS.map((v) => ({ id: v, label: v }))}
            checked={values.processStages}
            onToggle={(id) => dispatch({ type: "TOGGLE_CHIP", field: "processStages", value: id })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-breadcrumb-root">Refurbishment Status *</label>
          <CheckboxGrid
            columns={2}
            items={REFURBISHMENT_STATUS_OPTIONS.map((v) => ({ id: v, label: v }))}
            checked={values.refurbishmentStatuses}
            onToggle={(id) => dispatch({ type: "TOGGLE_CHIP", field: "refurbishmentStatuses", value: id })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-breadcrumb-root">Vehicle Type Eligibility *</label>
          <CheckboxGrid
            columns={2}
            items={VEHICLE_ELIGIBILITY_OPTIONS.map((v) => ({ id: v, label: v }))}
            checked={values.vehicleTypeEligibility}
            onToggle={(id) => dispatch({ type: "TOGGLE_CHIP", field: "vehicleTypeEligibility", value: id })}
          />
        </div>
      </FormSection>
    </div>
  )
}
