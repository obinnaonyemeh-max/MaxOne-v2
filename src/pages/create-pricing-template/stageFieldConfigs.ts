import { type FieldConfig } from "./FieldGrid"

export const commercialAssumptionsFields: FieldConfig[] = [
  { key: "baseTenorMonths", label: "Base Tenor (months)", unit: "number" },
  { key: "collectionDaysPerMonth", label: "Collection Days per Month", unit: "number" },
  { key: "expectedCollectionRatePercent", label: "Expected Collection Rate", unit: "percent" },
  { key: "vatRatePercent", label: "VAT Rate", unit: "percent" },
  { key: "maxProcessingFee", label: "MAX Processing Fee", unit: "currency" },
  { key: "comprehensiveInsuranceRatePercent", label: "Comprehensive Insurance Rate", unit: "percent" },
  { key: "refurbishmentProvisionRatePercent", label: "Refurbishment Provision Rate", unit: "percent" },
  { key: "defaultProvisionRatePercent", label: "Default Provision Rate", unit: "percent" },
  { key: "dailyBatterySwapSubsidy", label: "Daily Battery Swap Subsidy", unit: "currency" },
  { key: "monthlyHmoValue", label: "Monthly HMO Value", unit: "currency" },
]

export const vehiclePurchaseCostFields: FieldConfig[] = [
  { key: "basePurchasePriceChassis", label: "Base Purchase Price - Chassis", unit: "currency" },
  { key: "basePurchasePriceBattery", label: "Base Purchase Price - Battery", unit: "currency" },
  { key: "basePurchasePriceCharger", label: "Base Purchase Price - Charger", unit: "currency" },
  { key: "shippingAndFreight", label: "Shipping & Freight", unit: "currency" },
  { key: "importDutiesAndTaxes", label: "Import Duties & Taxes", unit: "currency" },
]

export const onboardingCostFields: FieldConfig[] = [
  { key: "tracker", label: "Tracker", unit: "currency" },
  { key: "loadingAndOffloading", label: "Loading & Offloading", unit: "currency" },
  { key: "paintingAndBranding", label: "Painting & Branding", unit: "currency" },
  { key: "safetyTracking", label: "Safety Tracking", unit: "currency" },
  { key: "fuelForTesting", label: "Fueling Cost for Testing & Activation", unit: "currency" },
  { key: "licenceAndRegistration", label: "License & Registration", unit: "currency" },
  { key: "weldingBrackets", label: "Welding of Metal Brackets", unit: "currency" },
  { key: "vest", label: "Vest", unit: "currency" },
  { key: "helmet", label: "Helmet", unit: "currency" },
]

export const operationalCostFields: FieldConfig[] = [
  { key: "recoveryCost", label: "Recovery Cost", unit: "currency" },
  { key: "fieldOperations", label: "Field Operations", unit: "currency" },
  { key: "techAndPlatform", label: "Tech & Platform", unit: "currency" },
]

export const maxAdvantageCostFields: FieldConfig[] = [
  { key: "maintenanceAndServicing", label: "Maintenance & Servicing", unit: "currency" },
  { key: "lifeAssurance", label: "Life Assurance", unit: "currency" },
  { key: "emergencyResponse", label: "Emergency Response", unit: "currency" },
]

export const salesMarketingCostFields: FieldConfig[] = [
  { key: "marketingAndCustomerAcquisition", label: "Marketing & Customer Acquisition", unit: "currency" },
  { key: "referralProgramme", label: "Referral Programme", unit: "currency" },
  { key: "brandAndContent", label: "Brand & Content", unit: "currency" },
]

export const marginTargetFields: FieldConfig[] = [
  { key: "targetGrossMarginPercent", label: "Target Gross Margin", unit: "percent" },
  { key: "targetNetMarginPercent", label: "Target Net Margin", unit: "percent" },
  { key: "targetMaxAdvantageMarginPercent", label: "Target MAX Advantage Margin", unit: "percent" },
  { key: "targetBatteryAccessMarginPercent", label: "Target Battery Access Margin", unit: "percent" },
]
