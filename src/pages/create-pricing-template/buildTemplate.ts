import { format } from "date-fns"
import { type PricingTemplate, type TemplateCostCategory } from "@/data/mockPricingTemplates"
import { buildIncomeStatement, hmoAutoComputed, vatAutoComputed } from "./calculations"
import { type WizardState } from "./types"

export function buildPricingTemplateFromWizard(id: string, s: WizardState): PricingTemplate {
  const statement = buildIncomeStatement(s)

  const costCategories: TemplateCostCategory[] = [
    {
      key: "vehiclePurchaseCost",
      lineItems: [
        { id: "li-chassis", label: "Base Purchase Price - Chassis", defaultValue: s.basePurchasePriceChassis },
        { id: "li-battery", label: "Base Purchase Price - Battery", defaultValue: s.basePurchasePriceBattery },
        { id: "li-charger", label: "Base Purchase Price - Charger", defaultValue: s.basePurchasePriceCharger },
        { id: "li-shipping-freight", label: "Shipping & Freight", defaultValue: s.shippingAndFreight },
        { id: "li-import-duties-taxes", label: "Import Duties & Taxes", defaultValue: s.importDutiesAndTaxes },
      ],
    },
    {
      key: "costOfFunds",
      lineItems: [
        { id: "li-interest-debt", label: "Interest Expense (Debt) — auto", defaultValue: 0, auto: true },
        { id: "li-lender-processing-fee", label: "Lender Processing Fee", defaultValue: s.lenderProcessingFee },
      ],
    },
    {
      key: "onboardingCost",
      lineItems: [
        { id: "li-tracker", label: "Tracker", defaultValue: s.tracker },
        { id: "li-loading-offloading", label: "Loading & Offloading", defaultValue: s.loadingAndOffloading },
        { id: "li-painting-branding", label: "Painting & Branding", defaultValue: s.paintingAndBranding },
        { id: "li-safety-tracking", label: "Safety Tracking", defaultValue: s.safetyTracking },
        { id: "li-fueling-testing", label: "Fueling Cost for Testing & Activation", defaultValue: s.fuelForTesting },
        { id: "li-license-registration", label: "License & Registration", defaultValue: s.licenceAndRegistration },
        { id: "li-welding-brackets", label: "Welding of Metal Brackets", defaultValue: s.weldingBrackets },
        { id: "li-vest", label: "Vest", defaultValue: s.vest },
        { id: "li-helmet", label: "Helmet", defaultValue: s.helmet },
      ],
    },
    {
      key: "operationalCost",
      lineItems: [
        { id: "li-vat", label: "VAT — auto", defaultValue: vatAutoComputed(s), auto: true },
        { id: "li-recovery-cost", label: "Recovery Cost", defaultValue: s.recoveryCost },
        { id: "li-field-operations", label: "Field Operations", defaultValue: s.fieldOperations },
        { id: "li-tech-platform", label: "Tech & Platform", defaultValue: s.techAndPlatform },
      ],
    },
    {
      key: "maxAdvantage",
      lineItems: [
        { id: "li-hmo", label: "HMO — auto", defaultValue: hmoAutoComputed(s), auto: true },
        { id: "li-maintenance-servicing", label: "Maintenance & Servicing", defaultValue: s.maintenanceAndServicing },
        { id: "li-life-assurance", label: "Life Assurance", defaultValue: s.lifeAssurance },
        { id: "li-emergency-response", label: "Emergency Response", defaultValue: s.emergencyResponse },
      ],
    },
    {
      key: "salesAndMarketing",
      lineItems: [
        { id: "li-marketing-acquisition", label: "Marketing & Customer Acquisition", defaultValue: s.marketingAndCustomerAcquisition },
        { id: "li-referral-programme", label: "Referral Programme", defaultValue: s.referralProgramme },
        { id: "li-brand-content", label: "Brand & Content", defaultValue: s.brandAndContent },
      ],
    },
    {
      key: "risksAndContingency",
      lineItems: [
        { id: "li-comprehensive-insurance", label: "Comprehensive Insurance (% of asset cost)", defaultValue: s.comprehensiveInsuranceRatePercent, unit: "percentAssetCost" },
        { id: "li-refurbishment-provision", label: "Refurbishment Provision (% of asset cost)", defaultValue: s.refurbishmentProvisionRatePercent, unit: "percentAssetCost" },
        { id: "li-default-provision", label: "Default Provision (% of asset cost)", defaultValue: s.defaultProvisionRatePercent, unit: "percentAssetCost" },
      ],
    },
  ]

  return {
    id,
    name: s.templateName,
    code: s.templateCode,
    productType: s.productType,
    vehicleTypePrimary: s.vehicleTypePrimary,
    vehicleTypeSubtype: s.vehicleTypeSubtype,
    currency: s.currency,
    effectiveDate: s.effectiveDate ? format(s.effectiveDate, "dd MMM yyyy") : undefined,
    description: s.description,
    status: s.status,
    costCategories,
    remittanceSchedule: {
      tenorMonths: s.baseTenorMonths,
      daysPerMonth: s.collectionDaysPerMonth,
      repaymentAmountDaily: Math.round(statement.dailyRemittanceTarget),
      maxAdvantageDaily: Math.round(statement.maxAdvantageDailyTarget),
      batteryAccessFeesDaily: Math.round(statement.batteryAccessDailyTarget),
      batterySwapFeeSubsidyDaily: s.dailyBatterySwapSubsidy,
      equityContributionPercent: s.equityFundingMixPercent,
    },
  }
}
