// Mock data for Portfolio > Products & Pricing > Pricing Configuration > Pricing Templates.
// A pricing template supplies the line items a new Pricing Batch's seven cost-breakdown
// accordions offer for entry. Risks & Contingency Cost line items are entered as a
// percentage of the Vehicle Purchase Cost total rather than a currency amount.

export const COST_CATEGORY_KEYS = [
  "vehiclePurchaseCost",
  "costOfFunds",
  "onboardingCost",
  "operationalCost",
  "maxAdvantage",
  "salesAndMarketing",
  "risksAndContingency",
] as const

export type CostCategoryKey = (typeof COST_CATEGORY_KEYS)[number]

export const costCategoryLabels: Record<CostCategoryKey, string> = {
  vehiclePurchaseCost: "Vehicle Purchase Cost",
  costOfFunds: "Cost of Funds",
  onboardingCost: "Onboarding Cost",
  operationalCost: "Operational Cost",
  maxAdvantage: "MAX Advantage",
  salesAndMarketing: "Sales & Marketing Cost",
  risksAndContingency: "Risks and Contingency Cost",
}

export type LineItemUnit = "currency" | "percentAssetCost"

export interface TemplateLineItem {
  id: string
  label: string
  defaultValue: number
  /** Read-only, system-calculated line item (e.g. debt interest derived from the loan). */
  auto?: boolean
  /** "percentAssetCost" line items are entered as a % of the Vehicle Purchase Cost total. */
  unit?: LineItemUnit
}

export interface TemplateCostCategory {
  key: CostCategoryKey
  lineItems: TemplateLineItem[]
}

// The baseline remittance schedule a Pricing Batch inherits (view-only in the batch's
// Remittance Plan) — daily figures that roll up into that batch's Daily Remittance.
export interface TemplateRemittanceSchedule {
  tenorMonths: number
  daysPerMonth: number
  repaymentAmountDaily: number
  maxAdvantageDaily: number
  batteryAccessFeesDaily: number
  batterySwapFeeSubsidyDaily: number
  equityContributionPercent: number
}

export type PricingTemplateStatus = "Draft" | "Active"

export interface PricingTemplate {
  id: string
  name: string
  costCategories: TemplateCostCategory[]
  remittanceSchedule: TemplateRemittanceSchedule
  /** Metadata captured by the Create Pricing Template wizard — optional so hand-seeded templates don't need it. */
  code?: string
  productType?: string
  vehicleTypePrimary?: string
  vehicleTypeSubtype?: string
  currency?: string
  effectiveDate?: string
  description?: string
  status?: PricingTemplateStatus
}

export function addPricingTemplate(template: PricingTemplate): void {
  mockPricingTemplates.unshift(template)
}

export function templateVehiclePurchaseCostTotal(costCategories: TemplateCostCategory[]): number {
  const category = costCategories.find((c) => c.key === "vehiclePurchaseCost")
  return category ? category.lineItems.reduce((sum, item) => sum + item.defaultValue, 0) : 0
}

export function templateCategoryTotal(category: TemplateCostCategory, assetCost: number): number {
  return category.lineItems.reduce((sum, item) => {
    if (item.unit === "percentAssetCost") return sum + (item.defaultValue / 100) * assetCost
    return sum + item.defaultValue
  }, 0)
}

export function templateGrandTotal(costCategories: TemplateCostCategory[]): number {
  const assetCost = templateVehiclePurchaseCostTotal(costCategories)
  return costCategories.reduce((sum, category) => sum + templateCategoryTotal(category, assetCost), 0)
}

function vehiclePurchaseCostItems(chassis: number, battery: number, charger: number, freight: number, duties: number): TemplateLineItem[] {
  return [
    { id: "li-chassis", label: "Base Purchase Price - Chassis", defaultValue: chassis },
    { id: "li-battery", label: "Base Purchase Price - Battery", defaultValue: battery },
    { id: "li-charger", label: "Base Purchase Price - Charger", defaultValue: charger },
    { id: "li-shipping-freight", label: "Shipping & Freight", defaultValue: freight },
    { id: "li-import-duties-taxes", label: "Import Duties & Taxes", defaultValue: duties },
  ]
}

function costOfFundsItems(interestDebt: number, interestEquity: number, processingFees: number, hedging: number): TemplateLineItem[] {
  return [
    { id: "li-interest-debt", label: "Interest Expense (Debt) — auto", defaultValue: interestDebt, auto: true },
    { id: "li-interest-equity", label: "Interest Expense (Equity)", defaultValue: interestEquity },
    { id: "li-processing-fees", label: "Processing Fees", defaultValue: processingFees },
    { id: "li-fx-hedging", label: "Currency Exchange Hedging", defaultValue: hedging },
  ]
}

function onboardingCostItems(
  tracker: number,
  loading: number,
  painting: number,
  safetyTracking: number,
  fueling: number,
  license: number,
  welding: number,
  vest: number,
  helmet: number
): TemplateLineItem[] {
  return [
    { id: "li-tracker", label: "Tracker", defaultValue: tracker },
    { id: "li-loading-offloading", label: "Loading & Offloading", defaultValue: loading },
    { id: "li-painting-branding", label: "Painting & Branding", defaultValue: painting },
    { id: "li-safety-tracking", label: "Safety Tracking", defaultValue: safetyTracking },
    { id: "li-fueling-testing", label: "Fueling Cost for Testing & Activation", defaultValue: fueling },
    { id: "li-license-registration", label: "License & Registration", defaultValue: license },
    { id: "li-welding-brackets", label: "Welding of Metal Brackets", defaultValue: welding },
    { id: "li-vest", label: "Vest", defaultValue: vest },
    { id: "li-helmet", label: "Helmet", defaultValue: helmet },
  ]
}

function operationalCostItems(vat: number, recovery: number): TemplateLineItem[] {
  return [
    { id: "li-vat", label: "VAT", defaultValue: vat },
    { id: "li-recovery-cost", label: "Recovery Cost", defaultValue: recovery },
  ]
}

function maxAdvantageItems(hmo: number, maintenanceServicing: number, lifeAssurance: number, emergencyResponse: number): TemplateLineItem[] {
  return [
    { id: "li-hmo", label: "HMO", defaultValue: hmo },
    { id: "li-maintenance-servicing", label: "Maintenance & Servicing", defaultValue: maintenanceServicing },
    { id: "li-life-assurance", label: "Life Assurance", defaultValue: lifeAssurance },
    { id: "li-emergency-response", label: "Emergency Response", defaultValue: emergencyResponse },
  ]
}

function salesAndMarketingItems(marketing: number): TemplateLineItem[] {
  return [{ id: "li-marketing-acquisition", label: "Marketing & Customer Acquisition", defaultValue: marketing }]
}

function risksAndContingencyItems(comprehensiveInsurance: number, refurbishment: number, defaultProvision: number): TemplateLineItem[] {
  return [
    { id: "li-comprehensive-insurance", label: "Comprehensive Insurance (% of asset cost)", defaultValue: comprehensiveInsurance, unit: "percentAssetCost" },
    { id: "li-refurbishment-provision", label: "Refurbishment Provision (% of asset cost)", defaultValue: refurbishment, unit: "percentAssetCost" },
    { id: "li-default-provision", label: "Default Provision (% of asset cost)", defaultValue: defaultProvision, unit: "percentAssetCost" },
  ]
}

export const mockPricingTemplates: PricingTemplate[] = [
  {
    id: "tpl-two-wheeler-standard",
    name: "Two-Wheeler — Standard",
    code: "TPL-2W-STD",
    productType: "Hire Purchase",
    vehicleTypePrimary: "two-wheeler",
    vehicleTypeSubtype: "vt-motorcycle",
    currency: "NGN",
    effectiveDate: "01 Jan 2024",
    description: "Standard EV two-wheeler pricing template.",
    status: "Active",
    costCategories: [
      { key: "vehiclePurchaseCost", lineItems: vehiclePurchaseCostItems(520000, 220000, 65000, 25000, 45000) },
      { key: "costOfFunds", lineItems: costOfFundsItems(60000, 18000, 15000, 8000) },
      { key: "onboardingCost", lineItems: onboardingCostItems(18000, 4000, 9000, 6000, 3000, 12000, 2500, 3500, 4500) },
      { key: "operationalCost", lineItems: operationalCostItems(20000, 8000) },
      { key: "maxAdvantage", lineItems: maxAdvantageItems(12000, 9000, 4000, 3000) },
      { key: "salesAndMarketing", lineItems: salesAndMarketingItems(20000) },
      { key: "risksAndContingency", lineItems: risksAndContingencyItems(3, 2, 5) },
    ],
    remittanceSchedule: {
      tenorMonths: 20,
      daysPerMonth: 26,
      repaymentAmountDaily: 2650,
      maxAdvantageDaily: 900,
      batteryAccessFeesDaily: 1600,
      batterySwapFeeSubsidyDaily: 200,
      equityContributionPercent: 20,
    },
  },
  {
    id: "tpl-three-wheeler-standard",
    name: "Three-Wheeler — Standard",
    code: "TPL-3W-STD",
    productType: "Hire Purchase",
    vehicleTypePrimary: "three-wheeler",
    vehicleTypeSubtype: "vt-cargo-tricycle",
    currency: "NGN",
    effectiveDate: "01 Jan 2024",
    description: "Standard three-wheeler pricing template.",
    status: "Active",
    costCategories: [
      { key: "vehiclePurchaseCost", lineItems: vehiclePurchaseCostItems(950000, 350000, 90000, 42000, 78000) },
      { key: "costOfFunds", lineItems: costOfFundsItems(95000, 28000, 22000, 12000) },
      { key: "onboardingCost", lineItems: onboardingCostItems(18000, 6000, 12000, 7000, 4500, 18000, 3500, 4000, 5500) },
      { key: "operationalCost", lineItems: operationalCostItems(32000, 14000) },
      { key: "maxAdvantage", lineItems: maxAdvantageItems(15000, 14000, 5000, 4000) },
      { key: "salesAndMarketing", lineItems: salesAndMarketingItems(28000) },
      { key: "risksAndContingency", lineItems: risksAndContingencyItems(3, 2, 5) },
    ],
    remittanceSchedule: {
      tenorMonths: 24,
      daysPerMonth: 26,
      repaymentAmountDaily: 4200,
      maxAdvantageDaily: 1400,
      batteryAccessFeesDaily: 0,
      batterySwapFeeSubsidyDaily: 0,
      equityContributionPercent: 20,
    },
  },
  {
    id: "tpl-four-wheeler-standard",
    name: "Four-Wheeler — Standard",
    code: "TPL-4W-STD",
    productType: "Lease-to-Own",
    vehicleTypePrimary: "four-wheeler",
    vehicleTypeSubtype: "vt-sedan",
    currency: "NGN",
    effectiveDate: "01 Jan 2024",
    description: "Standard four-wheeler pricing template.",
    status: "Active",
    costCategories: [
      { key: "vehiclePurchaseCost", lineItems: vehiclePurchaseCostItems(2600000, 850000, 150000, 95000, 210000) },
      { key: "costOfFunds", lineItems: costOfFundsItems(240000, 65000, 45000, 25000) },
      { key: "onboardingCost", lineItems: onboardingCostItems(22000, 9000, 20000, 10000, 8000, 35000, 5000, 5000, 6500) },
      { key: "operationalCost", lineItems: operationalCostItems(80000, 30000) },
      { key: "maxAdvantage", lineItems: maxAdvantageItems(24000, 32000, 9000, 7000) },
      { key: "salesAndMarketing", lineItems: salesAndMarketingItems(45000) },
      { key: "risksAndContingency", lineItems: risksAndContingencyItems(3, 2, 5) },
    ],
    remittanceSchedule: {
      tenorMonths: 30,
      daysPerMonth: 26,
      repaymentAmountDaily: 9800,
      maxAdvantageDaily: 2600,
      batteryAccessFeesDaily: 0,
      batterySwapFeeSubsidyDaily: 0,
      equityContributionPercent: 25,
    },
  },
]
