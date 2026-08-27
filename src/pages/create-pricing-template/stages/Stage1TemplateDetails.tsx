import type { Dispatch } from "react"
import { DatePickerField } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { mockAssetClasses, mockVehicleTypeOptions } from "@/data/mockVehicleCatalog"
import { COLLECTION_DENOMINATIONS } from "@/data/mockFinanciers"
import { type WizardAction, type WizardState } from "../types"

const PRODUCT_TYPES = ["Hire Purchase", "Lease-to-Own", "Subscription", "Outright Sale"]

interface Stage1Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Stage1TemplateDetails({ values, dispatch }: Stage1Props) {
  const vehicleTypeOptions = mockVehicleTypeOptions.filter((v) => v.assetClassId === values.vehicleTypePrimary)

  const handlePrimaryChange = (value: string) => {
    dispatch({ type: "UPDATE_FIELD", field: "vehicleTypePrimary", value })
    dispatch({ type: "UPDATE_FIELD", field: "vehicleTypeSubtype", value: "" })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Template Details">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Core identity for this pricing template — name, product, vehicle class and effective date.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Template Name *">
            <Input
              value={values.templateName}
              onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "templateName", value: e.target.value })}
              placeholder="e.g. Two-Wheeler EV — Standard"
              className="h-9 bg-input-soft"
            />
          </FormField>
          <FormField label="Template Code *">
            <Input
              value={values.templateCode}
              onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "templateCode", value: e.target.value })}
              placeholder="e.g. TPL-2W-STD"
              className="h-9 bg-input-soft"
            />
          </FormField>

          <FormField label="Product Type *">
            <Select value={values.productType} onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "productType", value: v })}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Currency *">
            <Select value={values.currency} onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "currency", value: v })}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {COLLECTION_DENOMINATIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Vehicle Type — Primary *">
            <Select value={values.vehicleTypePrimary} onValueChange={handlePrimaryChange}>
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder="Select asset class" />
              </SelectTrigger>
              <SelectContent>
                {mockAssetClasses.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Vehicle Type — Subtype *">
            <Select
              value={values.vehicleTypeSubtype}
              onValueChange={(v) => dispatch({ type: "UPDATE_FIELD", field: "vehicleTypeSubtype", value: v })}
              disabled={!values.vehicleTypePrimary}
            >
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue placeholder={values.vehicleTypePrimary ? "Select vehicle type" : "Select primary type first"} />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypeOptions.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Effective Date *">
            <DatePickerField
              value={values.effectiveDate}
              onChange={(d) => dispatch({ type: "UPDATE_FIELD", field: "effectiveDate", value: d })}
              placeholder="DD MMM YYYY"
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
            placeholder="Describe when this template should be used..."
            rows={3}
            className="text-sm bg-input-soft"
          />
        </FormField>
      </FormSection>
    </div>
  )
}
