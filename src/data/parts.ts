export interface RequiredPart {
  id: string
  partName: string
  qty: number
  status: "Ordered" | "Awaiting Supply" | "Received"
  /** Unit cost in NGN. Shown on Full Build; omitted for GFM / City Fleet Officer. */
  cost?: number
}
