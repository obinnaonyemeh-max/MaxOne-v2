import type { Dispatch } from "react"
import { Input } from "@/components/ui/input"
import { type WizardAction, type WizardFields } from "./types"

export interface FieldConfig {
  key: keyof WizardFields
  label: string
  unit?: "currency" | "percent" | "number"
}

interface FieldGridProps {
  fields: FieldConfig[]
  values: WizardFields
  dispatch: Dispatch<WizardAction>
}

export function FieldGrid({ fields, values, dispatch }: FieldGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {fields.map((field) => {
        const rawValue = values[field.key] as number
        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-breadcrumb-root">{field.label}</label>
            <div className="relative">
              {field.unit === "currency" && (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  ₦
                </span>
              )}
              <Input
                type="number"
                value={rawValue === 0 ? "" : rawValue}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_FIELD", field: field.key, value: Number(e.target.value) || 0 })
                }
                placeholder={`Enter ${field.label}`}
                className={
                  field.unit === "currency" ? "h-9 bg-input-soft pl-7" : field.unit === "percent" ? "h-9 bg-input-soft pr-7" : "h-9 bg-input-soft"
                }
              />
              {field.unit === "percent" && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                  %
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
