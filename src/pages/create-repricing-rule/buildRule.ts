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
    parameters: {
      description: s.description,
      pricingBatchId: s.pricingBatchId,
      processStages: [...s.processStages],
      refurbishmentStatuses: [...s.refurbishmentStatuses],
      vehicleTypeEligibility: [...s.vehicleTypeEligibility],
      recoveryRules: s.recoveryRules,
      refurbishmentCost: s.refurbishmentCost,
      batteryCost: s.batteryCost,
      chargerCost: s.chargerCost,
      trackerCost: s.trackerCost,
      licensingRegistrationCost: s.licensingRegistrationCost,
      paintingBrandingCost: s.paintingBrandingCost,
      helmetCost: s.helmetCost,
      vestCost: s.vestCost,
      recoveryFeeCost: s.recoveryFeeCost,
      collectionDaysPerMonth: s.collectionDaysPerMonth,
      debtFundingPercent: s.debtFundingPercent,
      debtInterestRatePercent: s.debtInterestRatePercent,
      equityCostPercent: s.equityCostPercent,
      lenderProcessingFeePercent: s.lenderProcessingFeePercent,
      vatPercent: s.vatPercent,
      dailyBatterySwapSubsidy: s.dailyBatterySwapSubsidy,
      maxDailyRemittancePercent: s.maxDailyRemittancePercent,
      minDailyRemittance: s.minDailyRemittance,
      maxTenorMonths: s.maxTenorMonths,
      minGrossMarginPercent: s.minGrossMarginPercent,
      minNetMarginPercent: s.minNetMarginPercent,
    },
  }
}
