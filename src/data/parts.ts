export interface RequiredPart {
  id: string
  partName: string
  qty: number
  status: "Ordered" | "Awaiting Supply" | "Received"
}
