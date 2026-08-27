export type WizardStage =
  | 1 // Template Details
  | 2 // Commercial Assumptions
  | 3 // Vehicle Purchase Cost
  | 4 // Funding Assumptions
  | 5 // Onboarding Costs
  | 6 // Operational Costs
  | 7 // MAX Advantage Costs
  | 8 // Sales & Marketing Costs
  | 9 // Risk & Contingency Costs
  | 10 // Margin Targets
  | 11 // Summary Income Statement

export const STAGE_TITLES: Record<WizardStage, string> = {
  1: "Template Details",
  2: "Commercial Assumptions",
  3: "Vehicle Purchase Cost",
  4: "Funding Assumptions",
  5: "Onboarding Costs",
  6: "Operational Costs",
  7: "MAX Advantage Costs",
  8: "Sales & Marketing Costs",
  9: "Risk & Contingency Costs",
  10: "Margin Targets",
  11: "Summary Income Statement",
}

export const TOTAL_STAGES = 11

export interface WizardFields {
  // Stage 1 — Template Details
  templateName: string
  templateCode: string
  productType: string
  vehicleTypePrimary: string
  vehicleTypeSubtype: string
  currency: string
  effectiveDate: Date | undefined
  status: "Draft" | "Active"
  description: string

  // Stage 2 — Commercial Assumptions
  baseTenorMonths: number
  collectionDaysPerMonth: number
  expectedCollectionRatePercent: number
  vatRatePercent: number
  maxProcessingFee: number
  comprehensiveInsuranceRatePercent: number
  refurbishmentProvisionRatePercent: number
  defaultProvisionRatePercent: number
  dailyBatterySwapSubsidy: number
  monthlyHmoValue: number

  // Stage 3 — Vehicle Purchase Cost
  basePurchasePriceChassis: number
  basePurchasePriceBattery: number
  basePurchasePriceCharger: number
  shippingAndFreight: number
  importDutiesAndTaxes: number

  // Stage 4 — Funding Assumptions
  debtCostOfFundsPercent: number
  equityCostOfFundsPercent: number
  debtFundingMixPercent: number
  equityFundingMixPercent: number
  lenderProcessingFee: number

  // Stage 5 — Onboarding Costs
  tracker: number
  loadingAndOffloading: number
  paintingAndBranding: number
  safetyTracking: number
  fuelForTesting: number
  licenceAndRegistration: number
  weldingBrackets: number
  vest: number
  helmet: number

  // Stage 6 — Operational Costs
  recoveryCost: number
  fieldOperations: number
  techAndPlatform: number

  // Stage 7 — MAX Advantage Costs
  maintenanceAndServicing: number
  lifeAssurance: number
  emergencyResponse: number

  // Stage 8 — Sales & Marketing Costs
  marketingAndCustomerAcquisition: number
  referralProgramme: number
  brandAndContent: number

  // Stage 10 — Margin Targets
  targetGrossMarginPercent: number
  targetNetMarginPercent: number
  targetMaxAdvantageMarginPercent: number
  targetBatteryAccessMarginPercent: number
}

export interface WizardState extends WizardFields {
  currentStage: WizardStage
  completedStages: WizardStage[]
}

export const initialWizardState: WizardState = {
  currentStage: 1,
  completedStages: [],

  templateName: "",
  templateCode: "",
  productType: "",
  vehicleTypePrimary: "",
  vehicleTypeSubtype: "",
  currency: "NGN",
  effectiveDate: undefined,
  status: "Draft",
  description: "",

  baseTenorMonths: 20,
  collectionDaysPerMonth: 26,
  expectedCollectionRatePercent: 95,
  vatRatePercent: 7.5,
  maxProcessingFee: 0,
  comprehensiveInsuranceRatePercent: 4.5,
  refurbishmentProvisionRatePercent: 2,
  defaultProvisionRatePercent: 5,
  dailyBatterySwapSubsidy: 0,
  monthlyHmoValue: 0,

  basePurchasePriceChassis: 0,
  basePurchasePriceBattery: 0,
  basePurchasePriceCharger: 0,
  shippingAndFreight: 0,
  importDutiesAndTaxes: 0,

  debtCostOfFundsPercent: 0,
  equityCostOfFundsPercent: 0,
  debtFundingMixPercent: 70,
  equityFundingMixPercent: 30,
  lenderProcessingFee: 0,

  tracker: 0,
  loadingAndOffloading: 0,
  paintingAndBranding: 0,
  safetyTracking: 0,
  fuelForTesting: 0,
  licenceAndRegistration: 0,
  weldingBrackets: 0,
  vest: 0,
  helmet: 0,

  recoveryCost: 0,
  fieldOperations: 0,
  techAndPlatform: 0,

  maintenanceAndServicing: 0,
  lifeAssurance: 0,
  emergencyResponse: 0,

  marketingAndCustomerAcquisition: 0,
  referralProgramme: 0,
  brandAndContent: 0,

  targetGrossMarginPercent: 40,
  targetNetMarginPercent: 15,
  targetMaxAdvantageMarginPercent: 10,
  targetBatteryAccessMarginPercent: 10,
}

export type WizardAction =
  | { type: "SET_STAGE"; stage: WizardStage }
  | { type: "MARK_COMPLETE"; stage: WizardStage }
  | { type: "UPDATE_FIELD"; field: keyof WizardFields; value: WizardFields[keyof WizardFields] }
  | { type: "RESET" }

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, currentStage: action.stage }
    case "MARK_COMPLETE":
      return state.completedStages.includes(action.stage)
        ? state
        : { ...state, completedStages: [...state.completedStages, action.stage] }
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET":
      return initialWizardState
    default:
      return state
  }
}
