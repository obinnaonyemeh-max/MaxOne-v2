// Mock data for Portfolio > Products & Pricing > Pricing Configuration > Pricing Batches.
// A Pricing Batch links a target country, a pricing template, one vehicle spec (asset
// class > type, manufacturer > model > trim), and a financier, then captures the final
// (possibly overridden) cost line items inherited from the template.

import {
  costCategoryLabels,
  mockPricingTemplates,
  type CostCategoryKey,
  type LineItemUnit,
  type PricingTemplate,
} from "./mockPricingTemplates"

export type PricingBatchStatus = "Active" | "Draft"

export interface BatchCostLineItem {
  id: string
  label: string
  value: number
  auto?: boolean
  unit?: LineItemUnit
}

export interface BatchCostCategory {
  key: CostCategoryKey
  label: string
  lineItems: BatchCostLineItem[]
}

export interface PricingBatchRecord {
  id: string
  code: string
  countryId: string
  countryName: string
  pricingTemplateId: string
  pricingTemplateName: string
  assetClassId: string
  assetClassName: string
  vehicleTypeId: string
  vehicleTypeName: string
  manufacturerId: string
  manufacturerName: string
  modelId: string
  modelName: string
  trimId: string
  trimName: string
  financierId: string
  financierName: string
  costCategories: BatchCostCategory[]
  grandTotal: number
  vehicleCount: number
  status: PricingBatchStatus
  dateCreated: string
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const pricingBatchStatusVariantMap: Record<PricingBatchStatus, BadgeVariant> = {
  Active: "success",
  Draft: "default",
}

export function vehiclePurchaseCostTotal(costCategories: BatchCostCategory[]): number {
  const category = costCategories.find((c) => c.key === "vehiclePurchaseCost")
  return category ? category.lineItems.reduce((sum, item) => sum + item.value, 0) : 0
}

// Risks & Contingency line items are entered as a % of the Vehicle Purchase Cost total
// rather than a currency amount, so its category total needs that asset cost as context.
export function categoryTotal(category: BatchCostCategory, assetCost: number): number {
  return category.lineItems.reduce((sum, item) => {
    if (item.unit === "percentAssetCost") return sum + (item.value / 100) * assetCost
    return sum + item.value
  }, 0)
}

export function batchGrandTotal(costCategories: BatchCostCategory[]): number {
  const assetCost = vehiclePurchaseCostTotal(costCategories)
  return costCategories.reduce((sum, category) => sum + categoryTotal(category, assetCost), 0)
}

// Seeds a batch's cost categories straight from a template's default values, so seed
// records stay in sync with the template line items instead of duplicating them.
function categoriesFromTemplate(template: PricingTemplate): BatchCostCategory[] {
  return template.costCategories.map((category) => ({
    key: category.key,
    label: costCategoryLabels[category.key],
    lineItems: category.lineItems.map((li) => ({ id: li.id, label: li.label, value: li.defaultValue, auto: li.auto, unit: li.unit })),
  }))
}

const twoWheelerTemplate = mockPricingTemplates.find((t) => t.id === "tpl-two-wheeler-standard")!
const threeWheelerTemplate = mockPricingTemplates.find((t) => t.id === "tpl-three-wheeler-standard")!

const seedCostCategories = categoriesFromTemplate(twoWheelerTemplate)
const largerCostCategories = categoriesFromTemplate(threeWheelerTemplate)

export const mockPricingBatchRecords: PricingBatchRecord[] = [
  {
    id: "1",
    code: "MAX-NG-BATCH-044",
    countryId: "ng",
    countryName: "Nigeria",
    pricingTemplateId: "tpl-two-wheeler-standard",
    pricingTemplateName: "Two-Wheeler — Standard",
    assetClassId: "two-wheeler",
    assetClassName: "Two-Wheeler",
    vehicleTypeId: "vt-motorcycle",
    vehicleTypeName: "Standard Motorcycle",
    manufacturerId: "bajaj",
    manufacturerName: "Bajaj",
    modelId: "bajaj-boxer",
    modelName: "Boxer",
    trimId: "bajaj-boxer-standard",
    trimName: "Standard",
    financierId: "1",
    financierName: "Lagos Fleet Expansion I",
    costCategories: seedCostCategories,
    grandTotal: batchGrandTotal(seedCostCategories),
    vehicleCount: 40,
    status: "Active",
    dateCreated: "12 Jan 2024",
  },
  {
    id: "2",
    code: "MAX-KE-BATCH-017",
    countryId: "ke",
    countryName: "Kenya",
    pricingTemplateId: "tpl-three-wheeler-standard",
    pricingTemplateName: "Three-Wheeler — Standard",
    assetClassId: "three-wheeler",
    assetClassName: "Three-Wheeler",
    vehicleTypeId: "vt-cargo-tricycle",
    vehicleTypeName: "Cargo Tricycle",
    manufacturerId: "piaggio",
    manufacturerName: "Piaggio",
    modelId: "piaggio-ape-xtra",
    modelName: "Ape Xtra",
    trimId: "piaggio-ape-xtra-standard",
    trimName: "Standard",
    financierId: "2",
    financierName: "Abuja Two-Wheeler Batch",
    costCategories: largerCostCategories,
    grandTotal: batchGrandTotal(largerCostCategories),
    vehicleCount: 65,
    status: "Active",
    dateCreated: "03 Feb 2024",
  },
  {
    id: "3",
    code: "MAX-UG-BATCH-009",
    countryId: "ug",
    countryName: "Uganda",
    pricingTemplateId: "tpl-two-wheeler-standard",
    pricingTemplateName: "Two-Wheeler — Standard",
    assetClassId: "two-wheeler",
    assetClassName: "Two-Wheeler",
    vehicleTypeId: "vt-scooter",
    vehicleTypeName: "Delivery Scooter",
    manufacturerId: "tvs",
    manufacturerName: "TVS",
    modelId: "tvs-king-deluxe",
    modelName: "King Deluxe",
    trimId: "tvs-king-deluxe-standard",
    trimName: "Standard",
    financierId: "3",
    financierName: "Port Harcourt Tricycle Fund",
    costCategories: seedCostCategories,
    grandTotal: batchGrandTotal(seedCostCategories),
    vehicleCount: 28,
    status: "Draft",
    dateCreated: "19 Feb 2024",
  },
]

export function addPricingBatchRecord(record: PricingBatchRecord): void {
  mockPricingBatchRecords.unshift(record)
}
