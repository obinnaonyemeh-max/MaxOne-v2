import type { Dispatch } from "react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { RECOVERY_COMPONENTS, RECOVERY_METHODS } from "../referenceData"
import { type WizardAction, type WizardState } from "../types"

interface Step3Props {
  values: WizardState
  dispatch: Dispatch<WizardAction>
}

export function Step3RecoveryRules({ values, dispatch }: Step3Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <FormSection title="Recovery Rules">
        <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
          For each component of the previous contract, set how much is recovered into this repricing rather than
          written off.
        </p>

        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Component</TableHead>
                <TableHead className="w-56">Recovery Method</TableHead>
                <TableHead className="w-40">Default Recovery %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECOVERY_COMPONENTS.map((component) => {
                const rule = values.recoveryRules[component.key]
                const isMissing = rule.percent === null

                return (
                  <TableRow key={component.key}>
                    <TableCell className="font-medium text-sidebar-item-active whitespace-normal" style={{ fontSize: "13px" }}>
                      {component.label}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rule.method}
                        onValueChange={(v) => dispatch({ type: "SET_RECOVERY_RULE", key: component.key, value: { method: v } })}
                      >
                        <SelectTrigger className="h-9 w-full bg-input-soft">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RECOVERY_METHODS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          type="number"
                          value={rule.percent ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value
                            dispatch({
                              type: "SET_RECOVERY_RULE",
                              key: component.key,
                              value: { percent: raw === "" ? null : Number(raw) },
                            })
                          }}
                          placeholder="—"
                          className={cn("h-9 bg-input-soft pr-7", isMissing && "border-status-danger focus-visible:ring-status-danger/30")}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                          %
                        </span>
                      </div>
                      {isMissing && <p className="mt-1 text-xs font-medium text-status-danger">* Recovery % required</p>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </FormSection>
    </div>
  )
}
