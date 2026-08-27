// Mock data for Portfolio > Products & Pricing > Pricing Configuration.
// A pricing batch is the "anchor product" a subscription plan is built on: its per-unit
// cost basis and anchor margins (GM/NIM) drive every tenor's target margins and the
// system-generated pricing engine matrix.

export type PricingBatchStatus = "Active" | "Draft"

export interface PricingBatch {
  id: string
  name: string
  vehicleType: "Two-Wheeler" | "Three-Wheeler" | "Four-Wheeler"
  /** Days used to convert a monthly remittance figure into a daily one. */
  daysPerMonth: number
  /** Per-unit vehicle cost — the batch's Total COS basis. */
  vehicleCost: number
  /** Per-unit monthly operating cost (insurance, tracking, maintenance reserve, etc.). */
  monthlyOperatingCost: number
  /** Anchor Gross Margin, % */
  anchorGM: number
  /** Anchor Net Interest Margin, % */
  anchorNIM: number
  /** Whether this batch has a saved remittance the pricing engine can generate off. */
  hasSavedRemittance: boolean
  status: PricingBatchStatus
}

export const mockPricingBatches: PricingBatch[] = [
  { id: "1", name: "Lagos Two-Wheeler — Aug 2026", vehicleType: "Two-Wheeler", daysPerMonth: 30, vehicleCost: 950000, monthlyOperatingCost: 18000, anchorGM: 42, anchorNIM: 18, hasSavedRemittance: true, status: "Active" },
  { id: "2", name: "Abuja Three-Wheeler — Jul 2026", vehicleType: "Three-Wheeler", daysPerMonth: 30, vehicleCost: 1600000, monthlyOperatingCost: 26000, anchorGM: 38, anchorNIM: 15, hasSavedRemittance: true, status: "Active" },
  { id: "3", name: "Port Harcourt Four-Wheeler — Jul 2026", vehicleType: "Four-Wheeler", daysPerMonth: 30, vehicleCost: 4200000, monthlyOperatingCost: 55000, anchorGM: 35, anchorNIM: 14, hasSavedRemittance: true, status: "Active" },
  { id: "4", name: "Kano Two-Wheeler — Jun 2026", vehicleType: "Two-Wheeler", daysPerMonth: 30, vehicleCost: 970000, monthlyOperatingCost: 18500, anchorGM: 40, anchorNIM: 17, hasSavedRemittance: false, status: "Draft" },
  { id: "5", name: "Ibadan Two-Wheeler — Jun 2026", vehicleType: "Two-Wheeler", daysPerMonth: 30, vehicleCost: 945000, monthlyOperatingCost: 17500, anchorGM: 43, anchorNIM: 19, hasSavedRemittance: true, status: "Active" },
]
