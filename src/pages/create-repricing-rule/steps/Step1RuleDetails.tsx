import type { Dispatch } from "react"
import { DatePickerField } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { mockCountries } from "@/data/mockCountries"
import type { RepricingVehicleType } from "@/data/mockRepricingEngine"
import { EV_VEHICLE_MODELS, ICE_VEHICLE_MODELS } from "../referenceData"
import { type WizardAction, type WizardState } from "../types"

interface Step1Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step1RuleDetails({ values, dispatch }: Step1Props) {
  const modelOptions = values.vehicleType === "ICE" ? ICE_VEHICLE_MODELS : values.vehicleType === "EV" ? EV_VEHICLE_MODELS : []

  const handleVehicleTypeChange = (value: string) => {
    dispatch({ type: "UPDATE_FIELD", field: "vehicleType", value: value as RepricingVehicleType })
    dispatch({ type: "UPDATE_FIELD", field: "vehicleModel", value: "" })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Rule Details">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Core identity for this repricing rule — name, targeted vehicle, country and when it takes effect.
        </p>

        <FormField label="Rule Name *">
          <Input
            value={values.ruleName}
            onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "ruleName", value: e.target.value })}
            placeholder="e.g. EV 2W · Nigeria Standard Repricing"
            className="h-9 bg-input-soft"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Country *">
            <Select value={values.country} onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "country", value: v })}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {mockCountries.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Vehicle Type *">
            <Select value={values.vehicleType} onValueChange={handleVehicleTypeChange}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EV">EV</SelectItem>
                <SelectItem value="ICE">ICE</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Vehicle Model *">
            <Select
              value={values.vehicleModel}
              onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "vehicleModel", value: v })}
              disabled={!values.vehicleType}
            >
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder={values.vehicleType ? "Select vehicle model" : "Select vehicle type first"} />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Effective Date *">
            <DatePickerField
              value={values.effectiveDate}
              onChange={(d) => dispatch({ type: "UPDATE_FIELD", field: "effectiveDate", value: d })}
              placeholder="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              triggerClassName="bg-input-soft"
            />
          </FormField>

          <FormField label="Status">
            <Select value={values.status} onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "status", value: v as WizardState["status"] })}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            value={values.description}
            onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "description", value: e.target.value })}
            placeholder="Describe when this rule should apply..."
            rows={3}
            className="text-sm bg-input-soft"
          />
        </FormField>
      </FormSection>
    </div>
  )
}
