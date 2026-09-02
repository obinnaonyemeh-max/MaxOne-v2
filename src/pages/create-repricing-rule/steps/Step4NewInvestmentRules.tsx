import type { Dispatch } from "react"
import { Lock } from "lucide-react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, totalCapitalInvestment, totalRedeploymentCost, vatRecomputed } from "../calculations"
import { type WizardAction, type WizardFields, type WizardState } from "../types"

interface Step4Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

interface LineItemRow {
  field: keyof WizardFields
  label: string
  auto?: boolean
}

const capitalInvestmentRows: LineItemRow[] = [
  { field: "refurbishmentCost", label: "Refurbishment", auto: true },
  { field: "batteryCost", label: "Battery" },
  { field: "chargerCost", label: "Charger" },
  { field: "trackerCost", label: "Tracker" },
]

const redeploymentRows: LineItemRow[] = [
  { field: "licensingRegistrationCost", label: "Licensing & Registration" },
  { field: "paintingBrandingCost", label: "Painting and Branding" },
  { field: "helmetCost", label: "Helmet" },
  { field: "vestCost", label: "Vest" },
  { field: "recoveryFeeCost", label: "Recovery" },
]

function LineItemTable({
  rows,
  values,
  dispatch,
  allowOverride,
  total,
  totalLabel,
  vatRow,
}: {
  rows: LineItemRow[]
  values: WizardState
  dispatch: Dispatch<WizardAction>
  allowOverride: boolean
  total: number
  totalLabel: string
  vatRow?: number
}) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Line Item</TableHead>
            <TableHead className="w-48">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const locked = row.auto && !allowOverride
            const rawValue = values[row.field] as number
            return (
              <TableRow key={row.field}>
                <TableCell className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
                  <div className="flex items-center gap-2">
                    {row.label}
                    {row.auto && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-info/10 px-2 py-0.5 text-status-info" style={{ fontSize: "10px", fontWeight: 600 }}>
                        {locked && <Lock className="h-2.5 w-2.5" />}
                        Auto-loaded
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                      ₦
                    </span>
                    <Input
                      type="number"
                      value={rawValue === 0 ? "" : rawValue}
                      disabled={locked}
                      onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: row.field, value: Number(e.target.value) || 0 })}
                      className="h-9 bg-input-soft pl-7 disabled:opacity-100 disabled:bg-gray-100"
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
          {vatRow !== undefined && (
            <TableRow>
              <TableCell className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
                <div className="flex items-center gap-2">
                  VAT (recomputed)
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-info/10 px-2 py-0.5 text-status-info" style={{ fontSize: "10px", fontWeight: 600 }}>
                    <Lock className="h-2.5 w-2.5" />
                    Auto-loaded
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
                {formatCurrency(vatRow)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between bg-brand-dark px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{totalLabel}</span>
        <span className="text-sm font-semibold text-white">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

export function Step4NewInvestmentRules({ values, dispatch }: Step4Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="New Investment Rules">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          Capital and redeployment costs for the new contract. Auto-loaded values come from the vehicle's
          refurbishment record and VAT policy — use "Edit template values" in the footer to override them.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-breadcrumb-root">Capital Investments</label>
          <LineItemTable
            rows={capitalInvestmentRows}
            values={values}
            dispatch={dispatch}
            allowOverride={values.allowTemplateOverride}
            total={totalCapitalInvestment(values)}
            totalLabel="Total Capital Investment"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-breadcrumb-root">Redeployment Costs</label>
          <LineItemTable
            rows={redeploymentRows}
            values={values}
            dispatch={dispatch}
            allowOverride={values.allowTemplateOverride}
            total={totalRedeploymentCost(values)}
            totalLabel="Total Redeployment Cost"
            vatRow={vatRecomputed(values)}
          />
        </div>
      </FormSection>
    </div>
  )
}
