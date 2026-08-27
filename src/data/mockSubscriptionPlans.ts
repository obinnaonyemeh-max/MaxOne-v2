// Mock data for Portfolio > Products & Pricing > Pricing Configuration > Subscription Plans.
// A subscription plan is a saved tenor pricing strategy anchored to a pricing batch — each
// tenor row carries its margin adjustments plus the pricing-engine matrix values computed
// from them at save time.

import { mockPricingBatches, type PricingBatch } from "./mockPricingBatches"

export type SubscriptionPlanStatus = "Active" | "Draft"

export interface SubscriptionPlanTenor {
  tenorMonths: number
  grossMarginAdjustment: number
  netMarginAdjustment: number
  targetGM: number
  targetNIM: number
  totalCOS: number
  operatingCost: number
  requiredRevenue: number
  dailyRemittance: number
  totalHPValue: number
  grossProfit: number
  netProfit: number
}

export interface SubscriptionPlan {
  id: string
  pricingBatchId: string
  pricingBatchName: string
  vehicleType: PricingBatch["vehicleType"]
  daysPerMonth: number
  anchorGM: number
  anchorNIM: number
  tenors: SubscriptionPlanTenor[]
  status: SubscriptionPlanStatus
  dateCreated: string
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const subscriptionPlanStatusVariantMap: Record<SubscriptionPlanStatus, BadgeVariant> = {
  Active: "success",
  Draft: "default",
}

function buildTenor(batch: PricingBatch, tenorMonths: number, gmAdj: number, nimAdj: number): SubscriptionPlanTenor {
  const targetGM = batch.anchorGM - gmAdj
  const targetNIM = batch.anchorNIM - nimAdj
  const totalCOS = batch.vehicleCost
  const operatingCost = batch.monthlyOperatingCost * tenorMonths
  const gmFraction = Math.min(0.99, Math.max(0, targetGM / 100))
  const requiredRevenue = (totalCOS + operatingCost) / (1 - gmFraction)
  const grossProfit = requiredRevenue - totalCOS
  const netProfit = requiredRevenue * (targetNIM / 100)
  const totalHPValue = requiredRevenue
  const dailyRemittance = tenorMonths > 0 ? totalHPValue / (tenorMonths * batch.daysPerMonth) : 0

  return {
    tenorMonths,
    grossMarginAdjustment: gmAdj,
    netMarginAdjustment: nimAdj,
    targetGM,
    targetNIM,
    totalCOS,
    operatingCost,
    requiredRevenue,
    dailyRemittance,
    totalHPValue,
    grossProfit,
    netProfit,
  }
}

function batchFor(id: string): PricingBatch {
  const batch = mockPricingBatches.find((b) => b.id === id)
  if (!batch) throw new Error(`Unknown seed pricing batch: ${id}`)
  return batch
}

function planFromBatch(
  id: string,
  batchId: string,
  tenorDefs: [number, number, number][],
  status: SubscriptionPlanStatus,
  dateCreated: string
): SubscriptionPlan {
  const batch = batchFor(batchId)
  return {
    id,
    pricingBatchId: batch.id,
    pricingBatchName: batch.name,
    vehicleType: batch.vehicleType,
    daysPerMonth: batch.daysPerMonth,
    anchorGM: batch.anchorGM,
    anchorNIM: batch.anchorNIM,
    tenors: tenorDefs.map(([months, gmAdj, nimAdj]) => buildTenor(batch, months, gmAdj, nimAdj)),
    status,
    dateCreated,
  }
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  planFromBatch(
    "1",
    "1",
    [
      [12, 0, 0],
      [6, 4, 2],
      [3, 8, 5],
    ],
    "Active",
    "20 Aug 2026"
  ),
  planFromBatch(
    "2",
    "2",
    [
      [12, 0, 0],
      [6, 3, 2],
    ],
    "Active",
    "18 Aug 2026"
  ),
  planFromBatch(
    "3",
    "5",
    [
      [12, 0, 0],
      [6, 5, 3],
      [3, 9, 6],
    ],
    "Draft",
    "12 Aug 2026"
  ),
]

export function addSubscriptionPlan(plan: SubscriptionPlan): void {
  mockSubscriptionPlans.unshift(plan)
}
