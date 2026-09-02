import type { RepricingVehicleType } from "@/data/mockRepricingEngine"
import type { RecoveryComponentKey } from "./referenceData"

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const STEP_TITLES: Record<WizardStep, string> = {
  1: "Rule Details",
  2: "Contract Eligibility",
  3: "Recovery Rules",
  4: "New Investment Rules",
  5: "Commercial Assumptions",
  6: "Pricing Constraints",
  7: "Repriced Income Statement",
  8: "Review & Activate",
}

export const TOTAL_STEPS = 8

export interface RecoveryRuleValue {
  method: string
  percent: number | null
}

export interface WizardFields {
  // Step 1 — Rule Details
  ruleName: string
  country: string
  vehicleType: RepricingVehicleType | ""
  vehicleModel: string
  effectiveDate: Date | undefined
  status: "Draft" | "Active"
  description: string

  // Step 2 — Contract Eligibility
  processStages: Set<string>
  refurbishmentStatuses: Set<string>
  vehicleTypeEligibility: Set<string>

  // Step 3 — Recovery Rules
  recoveryRules: Record<RecoveryComponentKey, RecoveryRuleValue>

  // Step 4 — New Investment Rules (Capital Investments)
  refurbishmentCost: number
  batteryCost: number
  chargerCost: number
  trackerCost: number
  // Step 4 — New Investment Rules (Redeployment Costs)
  licensingRegistrationCost: number
  paintingBrandingCost: number
  helmetCost: number
  vestCost: number
  recoveryFeeCost: number

  // Step 5 — Commercial Assumptions (Contract Structure)
  collectionDaysPerMonth: number
  // Step 5 — Commercial Assumptions (Funding)
  debtFundingPercent: number
  debtInterestRatePercent: number
  equityCostPercent: number
  lenderProcessingFeePercent: number
  // Step 5 — Commercial Assumptions (Commercial)
  vatPercent: number
  dailyBatterySwapSubsidy: number

  // Step 6 — Pricing Constraints
  maxDailyRemittancePercent: number
  minDailyRemittance: number
  maxTenorMonths: number
  minGrossMarginPercent: number
  minNetMarginPercent: number
}

export interface WizardState extends WizardFields {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  allowTemplateOverride: boolean
}

const initialRecoveryRuleDefaults: Record<RecoveryComponentKey, RecoveryRuleValue> = {
  outstandingVehiclePrincipal: { method: "Full Recovery", percent: 100 },
  interestIncome: { method: "Partial Recovery", percent: 60 },
  batterySwapSubsidyFee: { method: "Full Recovery", percent: 100 },
  onboardingCosts: { method: "Partial Recovery", percent: 50 },
  operationalCosts: { method: "Partial Recovery", percent: 40 },
  maxAdvantageCosts: { method: "No Recovery", percent: 0 },
  salesMarketingCosts: { method: "No Recovery", percent: 0 },
  riskContingencyCosts: { method: "Partial Recovery", percent: 30 },
  grossProfit: { method: "Carry Forward to New Contract", percent: 20 },
}

export const initialWizardState: WizardState = {
  currentStep: 1,
  completedSteps: [],
  allowTemplateOverride: false,

  ruleName: "",
  country: "",
  vehicleType: "",
  vehicleModel: "",
  effectiveDate: undefined,
  status: "Draft",
  description: "",

  processStages: new Set(["Repricing"]),
  refurbishmentStatuses: new Set(["Completed"]),
  vehicleTypeEligibility: new Set(["EV 2-Wheeler"]),

  recoveryRules: initialRecoveryRuleDefaults,

  refurbishmentCost: 85000,
  batteryCost: 420000,
  chargerCost: 65000,
  trackerCost: 38000,

  licensingRegistrationCost: 45000,
  paintingBrandingCost: 30000,
  helmetCost: 12000,
  vestCost: 6000,
  recoveryFeeCost: 25000,

  collectionDaysPerMonth: 26,

  debtFundingPercent: 80,
  debtInterestRatePercent: 22,
  equityCostPercent: 28,
  lenderProcessingFeePercent: 1.5,

  vatPercent: 7.5,
  dailyBatterySwapSubsidy: 200,

  maxDailyRemittancePercent: 115,
  minDailyRemittance: 1800,
  maxTenorMonths: 18,
  minGrossMarginPercent: 18,
  minNetMarginPercent: 8,
}

export type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "MARK_COMPLETE"; step: WizardStep }
  | { type: "UPDATE_FIELD"; field: keyof WizardFields; value: WizardFields[keyof WizardFields] }
  | { type: "TOGGLE_CHIP"; field: "processStages" | "refurbishmentStatuses" | "vehicleTypeEligibility"; value: string }
  | { type: "SET_RECOVERY_RULE"; key: RecoveryComponentKey; value: Partial<RecoveryRuleValue> }
  | { type: "TOGGLE_TEMPLATE_OVERRIDE" }
  | { type: "RESET" }

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }
    case "MARK_COMPLETE":
      return state.completedSteps.includes(action.step)
        ? state
        : { ...state, completedSteps: [...state.completedSteps, action.step] }
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "TOGGLE_CHIP": {
      const next = new Set(state[action.field])
      if (next.has(action.value)) next.delete(action.value)
      else next.add(action.value)
      return { ...state, [action.field]: next }
    }
    case "SET_RECOVERY_RULE":
      return {
        ...state,
        recoveryRules: {
          ...state.recoveryRules,
          [action.key]: { ...state.recoveryRules[action.key], ...action.value },
        },
      }
    case "TOGGLE_TEMPLATE_OVERRIDE":
      return { ...state, allowTemplateOverride: !state.allowTemplateOverride }
    case "RESET":
      return initialWizardState
    default:
      return state
  }
}
