import { type PricingBatch } from "@/data/mockPricingBatches"

export interface TenorStrategyRow {
  id: string
  enabled: boolean
  tenorMonths: number
  /** Percentage subtracted from the anchor batch's GM to derive this tenor's target GM. */
  grossMarginAdjustment: number
  /** Percentage subtracted from the anchor batch's NIM to derive this tenor's target NIM. */
  netMarginAdjustment: number
}

export interface EngineRow {
  tenorId: string
  tenorMonths: number
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

export function getTargetGM(batch: PricingBatch, row: TenorStrategyRow): number {
  return batch.anchorGM - row.grossMarginAdjustment
}

export function getTargetNIM(batch: PricingBatch, row: TenorStrategyRow): number {
  return batch.anchorNIM - row.netMarginAdjustment
}

// Builds the read-only pricing-engine matrix row for one tenor strategy row, anchored
// to the selected pricing batch's cost basis. Total COS is the batch's fixed per-unit
// vehicle cost; Operating Cost accrues with the length of the tenor. Required Revenue is
// solved so that (Revenue - TotalCOS) / Revenue == Target GM, which keeps Gross Profit and
// Target GM mutually consistent. Net Profit is Target NIM applied directly to that revenue.
export function buildEngineRow(batch: PricingBatch, row: TenorStrategyRow): EngineRow {
  const targetGM = getTargetGM(batch, row)
  const targetNIM = getTargetNIM(batch, row)

  const totalCOS = batch.vehicleCost
  const operatingCost = batch.monthlyOperatingCost * row.tenorMonths

  const gmFraction = Math.min(0.99, Math.max(0, targetGM / 100))
  const requiredRevenue = (totalCOS + operatingCost) / (1 - gmFraction)

  const grossProfit = requiredRevenue - totalCOS
  const netProfit = requiredRevenue * (targetNIM / 100)
  const totalHPValue = requiredRevenue
  const dailyRemittance = row.tenorMonths > 0 ? totalHPValue / (row.tenorMonths * batch.daysPerMonth) : 0

  return {
    tenorId: row.id,
    tenorMonths: row.tenorMonths,
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
