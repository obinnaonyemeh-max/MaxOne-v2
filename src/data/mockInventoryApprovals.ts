import type { StockAdjustmentType } from "./mockInventoryMovements"

export type InventoryApprovalType = StockAdjustmentType
export type InventoryApprovalDecision = "Approved" | "Rejected"

export interface NewPartPayload {
  manufacturer: string
  model: string
  trim: string
  costPrice?: number
}

export interface InventoryApprovalRequest {
  id: string
  date: string
  skuId: string
  partName: string
  type: InventoryApprovalType
  qty: number
  location: string
  requestedBy: string
  newPart?: NewPartPayload
}

export interface InventoryApprovalHistoryRow extends InventoryApprovalRequest {
  status: InventoryApprovalDecision
  reviewedBy: string
  reviewedDate: string
  reason?: string
}

export const mockPendingInventoryApprovals: InventoryApprovalRequest[] = [
  {
    id: "apr-p1",
    date: "2 Sep 2026",
    skuId: "PRT-001",
    partName: "Front Brake Pad Set",
    type: "Addition",
    qty: 12,
    location: "Lagos Hub",
    requestedBy: "Fleet Ops",
  },
  {
    id: "apr-p2",
    date: "2 Sep 2026",
    skuId: "PRT-002",
    partName: "Rear Tire 90/90-17",
    type: "Depletion",
    qty: 3,
    location: "Lagos Hub",
    requestedBy: "Chidi N.",
  },
  {
    id: "apr-p3",
    date: "1 Sep 2026",
    skuId: "PRT-006",
    partName: "Shock Absorber Pair",
    type: "Addition",
    qty: 5,
    location: "Ibadan Hub",
    requestedBy: "Kwame A.",
  },
  {
    id: "apr-p4",
    date: "1 Sep 2026",
    skuId: "PRT-009",
    partName: "Side Mirror Pair",
    type: "Depletion",
    qty: 4,
    location: "Abeokuta Hub",
    requestedBy: "Tunde B.",
  },
  {
    id: "apr-p5",
    date: "31 Aug 2026",
    skuId: "PRT-012",
    partName: "Horn Unit",
    type: "Addition",
    qty: 20,
    location: "Osogbo Hub",
    requestedBy: "Funke A.",
  },
  {
    id: "apr-p6",
    date: "31 Aug 2026",
    skuId: "PRT-007",
    partName: "Disc Rotor",
    type: "Depletion",
    qty: 2,
    location: "Ibadan Hub",
    requestedBy: "Fleet Ops",
  },
  {
    id: "apr-p7",
    date: "30 Aug 2026",
    skuId: "PRT-005",
    partName: "Throttle Assembly",
    type: "Addition",
    qty: 8,
    location: "Lagos Hub",
    requestedBy: "Emeka O.",
  },
]

export const mockInventoryApprovalHistory: InventoryApprovalHistoryRow[] = [
  {
    id: "apr-h1",
    date: "28 Aug 2026",
    skuId: "PRT-003",
    partName: "Headlight Assembly",
    type: "Addition",
    qty: 4,
    location: "Lagos Hub",
    requestedBy: "Fleet Ops",
    status: "Approved",
    reviewedBy: "Desmond N.",
    reviewedDate: "28 Aug 2026",
  },
  {
    id: "apr-h2",
    date: "27 Aug 2026",
    skuId: "PRT-008",
    partName: "Chain Kit",
    type: "Depletion",
    qty: 2,
    location: "Ibadan Hub",
    requestedBy: "Kwame A.",
    status: "Rejected",
    reviewedBy: "Desmond N.",
    reviewedDate: "27 Aug 2026",
    reason: "Quantity exceeds the latest cycle count.",
  },
  {
    id: "apr-h3",
    date: "26 Aug 2026",
    skuId: "PRT-010",
    partName: "Seat Assembly",
    type: "Addition",
    qty: 6,
    location: "Abeokuta Hub",
    requestedBy: "Tunde B.",
    status: "Approved",
    reviewedBy: "Adaeze K.",
    reviewedDate: "26 Aug 2026",
  },
  {
    id: "apr-h4",
    date: "25 Aug 2026",
    skuId: "PRT-011",
    partName: "Wiring Harness",
    type: "Addition",
    qty: 10,
    location: "Abeokuta Hub",
    requestedBy: "Fleet Ops",
    status: "Rejected",
    reviewedBy: "Desmond N.",
    reviewedDate: "25 Aug 2026",
    reason: "Duplicate of an earlier request already in review.",
  },
  {
    id: "apr-h5",
    date: "24 Aug 2026",
    skuId: "PRT-013",
    partName: "Battery Terminal Kit",
    type: "Depletion",
    qty: 5,
    location: "Osogbo Hub",
    requestedBy: "Funke A.",
    status: "Approved",
    reviewedBy: "Funke A.",
    reviewedDate: "24 Aug 2026",
  },
  {
    id: "apr-h6",
    date: "23 Aug 2026",
    skuId: "PRT-004",
    partName: "Controller Unit",
    type: "Addition",
    qty: 3,
    location: "Lagos Hub",
    requestedBy: "Emeka O.",
    status: "Rejected",
    reviewedBy: "Desmond N.",
    reviewedDate: "23 Aug 2026",
    reason: "Cost price has not been verified.",
  },
  {
    id: "apr-h7",
    date: "22 Aug 2026",
    skuId: "PRT-014",
    partName: "Rear Fender",
    type: "Depletion",
    qty: 1,
    location: "Osogbo Hub",
    requestedBy: "Funke A.",
    status: "Approved",
    reviewedBy: "Adaeze K.",
    reviewedDate: "22 Aug 2026",
  },
  {
    id: "apr-h8",
    date: "21 Aug 2026",
    skuId: "PRT-001",
    partName: "Front Brake Pad Set",
    type: "Depletion",
    qty: 8,
    location: "Lagos Hub",
    requestedBy: "Chidi N.",
    status: "Rejected",
    reviewedBy: "Desmond N.",
    reviewedDate: "21 Aug 2026",
    reason: "Awaiting pickup is already high for this SKU.",
  },
  {
    id: "apr-h9",
    date: "20 Aug 2026",
    skuId: "PRT-006",
    partName: "Shock Absorber Pair",
    type: "Addition",
    qty: 4,
    location: "Ibadan Hub",
    requestedBy: "Kwame A.",
    status: "Approved",
    reviewedBy: "Desmond N.",
    reviewedDate: "20 Aug 2026",
  },
]
