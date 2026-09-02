import { format } from "date-fns"
import { type RepricingRule } from "@/data/mockRepricingEngine"
import { type WizardState } from "./types"

export function buildRepricingRuleFromWizard(id: string, code: string, s: WizardState, status: RepricingRule["status"]): RepricingRule {
  return {
    id,
    code,
    vehicleType: s.vehicleType || "EV",
    vehicleModel: s.vehicleModel,
    name: s.ruleName,
    country: s.country,
    version: "v1",
    effectiveDate: s.effectiveDate ? format(s.effectiveDate, "dd MMM yyyy") : "",
    status,
  }
}
