import type { Dispatch } from "react"
import { Banner } from "@/components/max"
import { Input } from "@/components/ui/input"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { type WizardAction, type WizardState } from "../types"

interface Step6Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step6PricingConstraints({ values, dispatch }: Step6Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Pricing Constraints">
          <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
            Floors and ceilings the repriced contract is checked against once computed in Step 7.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Max Daily Remittance (% of previous)">
              <div className="relative">
                <Input
                  type="number"
                  value={values.maxDailyRemittancePercent}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "maxDailyRemittancePercent", value: Number(e.target.value) || 0 })}
                  className="h-9 bg-input-soft pr-7"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  %
                </span>
              </div>
            </FormField>

            <FormField label="Min Daily Remittance">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  ₦
                </span>
                <Input
                  type="number"
                  value={values.minDailyRemittance}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "minDailyRemittance", value: Number(e.target.value) || 0 })}
                  className="h-9 bg-input-soft pl-7"
                />
              </div>
            </FormField>

            <FormField label="Max Tenor (Months)">
              <Input
                type="number"
                value={values.maxTenorMonths}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "maxTenorMonths", value: Number(e.target.value) || 0 })}
                className="h-9 bg-input-soft"
              />
            </FormField>

            <FormField label="Min Gross Margin">
              <div className="relative">
                <Input
                  type="number"
                  value={values.minGrossMarginPercent}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "minGrossMarginPercent", value: Number(e.target.value) || 0 })}
                  className="h-9 bg-input-soft pr-7"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  %
                </span>
              </div>
            </FormField>

            <FormField label="Min Net Margin">
              <div className="relative">
                <Input
                  type="number"
                  value={values.minNetMarginPercent}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "minNetMarginPercent", value: Number(e.target.value) || 0 })}
                  className="h-9 bg-input-soft pr-7"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  %
                </span>
              </div>
            </FormField>
          </div>
        </FormSection>
      </div>

      <Banner
        variant="warning"
        title="Constraint breaches never block a session."
        description="The contract is parked in the Exception Queue with the failing constraint recorded."
      />
    </div>
  )
}
