// Reference constants for the Create Repricing Rule wizard — option lists used to preview
// recovery and constraint math before any real contract has been matched against the rule.

export const EV_VEHICLE_MODELS = ["MAX Bolt 2W", "MAX Tri EV", "MAX Volt 2W", "MAX Cargo 3W EV"]
export const ICE_VEHICLE_MODELS = ["Keke Bajaj RE", "Boxer 150", "TVS King Deluxe", "Apache RTR 150"]

export const PROCESS_STAGE_OPTIONS = ["Repricing", "Refurbishment", "Retrieved", "Warehouse", "Active"]
export const REFURBISHMENT_STATUS_OPTIONS = ["Completed", "In Progress", "Not Started", "Pricing"]
export const VEHICLE_ELIGIBILITY_OPTIONS = ["EV 2-Wheeler", "EV 3-Wheeler", "ICE 2-Wheeler", "ICE 3-Wheeler"]

export const RECOVERY_METHODS = ["Full Recovery", "Partial Recovery", "No Recovery", "Carry Forward to New Contract"]

// Portfolio-wide policy figure for redeployed retrieved units — not user-editable per rule.
export const EXPECTED_COLLECTION_RATE_PERCENT = 92

export type RecoveryComponentKey =
  | "outstandingVehiclePrincipal"
  | "interestIncome"
  | "batterySwapSubsidyFee"
  | "onboardingCosts"
  | "operationalCosts"
  | "maxAdvantageCosts"
  | "salesMarketingCosts"
  | "riskContingencyCosts"
  | "grossProfit"

export const RECOVERY_COMPONENTS: { key: RecoveryComponentKey; label: string }[] = [
  { key: "outstandingVehiclePrincipal", label: "Outstanding Vehicle Principal" },
  { key: "interestIncome", label: "Interest Income" },
  { key: "batterySwapSubsidyFee", label: "Battery Swap Subsidy Fee" },
  { key: "onboardingCosts", label: "Onboarding Costs" },
  { key: "operationalCosts", label: "Operational Costs" },
  { key: "maxAdvantageCosts", label: "MAX Advantage Costs" },
  { key: "salesMarketingCosts", label: "Sales & Marketing Costs" },
  { key: "riskContingencyCosts", label: "Risk & Contingency Costs" },
  { key: "grossProfit", label: "Gross Profit" },
]

export interface PreviousContractBaseline extends Record<RecoveryComponentKey, number> {
  previousDailyRemittance: number
}
