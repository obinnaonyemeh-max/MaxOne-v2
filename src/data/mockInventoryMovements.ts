export interface IssuedPartMovement {
  id: string
  date: string
  skuId: string
  partName: string
  qty: number
  plateNumber: string
  location: string
  issuedBy: string
}

export type StockAdjustmentType = "Addition" | "Depletion"

export interface StockAdjustmentMovement {
  id: string
  date: string
  skuId: string
  partName: string
  type: StockAdjustmentType
  qty: number
  location: string
  recordedBy: string
}

export const mockIssuedPartMovements: IssuedPartMovement[] = [
  { id: "iss-1", date: "2 Sep 2026", skuId: "PRT-001", partName: "Front Brake Pad Set", qty: 2, plateNumber: "LG-201-XY", location: "Lagos Hub", issuedBy: "Emeka O." },
  { id: "iss-2", date: "1 Sep 2026", skuId: "PRT-005", partName: "Throttle Assembly", qty: 1, plateNumber: "LG-701-AA", location: "Lagos Hub", issuedBy: "Chidi N." },
  { id: "iss-3", date: "1 Sep 2026", skuId: "PRT-003", partName: "Headlight Assembly", qty: 1, plateNumber: "LG-305-AB", location: "Lagos Hub", issuedBy: "Emeka O." },
  { id: "iss-4", date: "31 Aug 2026", skuId: "PRT-006", partName: "Shock Absorber Pair", qty: 1, plateNumber: "AC-112-GH", location: "Ibadan Hub", issuedBy: "Kwame A." },
  { id: "iss-5", date: "30 Aug 2026", skuId: "PRT-008", partName: "Chain Kit", qty: 1, plateNumber: "AC-201-CC", location: "Ibadan Hub", issuedBy: "Kwame A." },
  { id: "iss-6", date: "29 Aug 2026", skuId: "PRT-002", partName: "Rear Tire 90/90-17", qty: 2, plateNumber: "LG-410-CD", location: "Lagos Hub", issuedBy: "Chidi N." },
  { id: "iss-7", date: "28 Aug 2026", skuId: "PRT-009", partName: "Side Mirror Pair", qty: 1, plateNumber: "AC-220-FF", location: "Abeokuta Hub", issuedBy: "Tunde B." },
  { id: "iss-8", date: "27 Aug 2026", skuId: "PRT-010", partName: "Seat Assembly", qty: 1, plateNumber: "AC-440-XZ", location: "Abeokuta Hub", issuedBy: "Tunde B." },
  { id: "iss-9", date: "26 Aug 2026", skuId: "PRT-007", partName: "Disc Rotor", qty: 2, plateNumber: "AC-220-KL", location: "Ibadan Hub", issuedBy: "Kwame A." },
  { id: "iss-10", date: "25 Aug 2026", skuId: "PRT-012", partName: "Horn Unit", qty: 1, plateNumber: "AC-330-RS", location: "Osogbo Hub", issuedBy: "Funke A." },
  { id: "iss-11", date: "24 Aug 2026", skuId: "PRT-013", partName: "Battery Terminal Kit", qty: 2, plateNumber: "LG-502-EE", location: "Osogbo Hub", issuedBy: "Funke A." },
  { id: "iss-12", date: "22 Aug 2026", skuId: "PRT-004", partName: "Controller Unit", qty: 1, plateNumber: "LG-615-MN", location: "Lagos Hub", issuedBy: "Emeka O." },
  { id: "iss-13", date: "21 Aug 2026", skuId: "PRT-014", partName: "Rear Fender", qty: 1, plateNumber: "LG-820-TU", location: "Osogbo Hub", issuedBy: "Funke A." },
]

export const mockStockAdjustments: StockAdjustmentMovement[] = [
  { id: "adj-1", date: "2 Sep 2026", skuId: "PRT-001", partName: "Front Brake Pad Set", type: "Addition", qty: 20, location: "Lagos Hub", recordedBy: "Fleet Ops" },
  { id: "adj-2", date: "1 Sep 2026", skuId: "PRT-012", partName: "Horn Unit", type: "Depletion", qty: 6, location: "Osogbo Hub", recordedBy: "Funke A." },
  { id: "adj-3", date: "1 Sep 2026", skuId: "PRT-005", partName: "Throttle Assembly", type: "Addition", qty: 15, location: "Lagos Hub", recordedBy: "Fleet Ops" },
  { id: "adj-4", date: "31 Aug 2026", skuId: "PRT-006", partName: "Shock Absorber Pair", type: "Addition", qty: 8, location: "Ibadan Hub", recordedBy: "Kwame A." },
  { id: "adj-5", date: "30 Aug 2026", skuId: "PRT-009", partName: "Side Mirror Pair", type: "Depletion", qty: 4, location: "Abeokuta Hub", recordedBy: "Tunde B." },
  { id: "adj-6", date: "29 Aug 2026", skuId: "PRT-002", partName: "Rear Tire 90/90-17", type: "Addition", qty: 12, location: "Lagos Hub", recordedBy: "Fleet Ops" },
  { id: "adj-7", date: "28 Aug 2026", skuId: "PRT-011", partName: "Wiring Harness", type: "Depletion", qty: 3, location: "Abeokuta Hub", recordedBy: "Tunde B." },
  { id: "adj-8", date: "27 Aug 2026", skuId: "PRT-008", partName: "Chain Kit", type: "Addition", qty: 10, location: "Ibadan Hub", recordedBy: "Fleet Ops" },
  { id: "adj-9", date: "26 Aug 2026", skuId: "PRT-003", partName: "Headlight Assembly", type: "Depletion", qty: 2, location: "Lagos Hub", recordedBy: "Emeka O." },
  { id: "adj-10", date: "25 Aug 2026", skuId: "PRT-007", partName: "Disc Rotor", type: "Addition", qty: 6, location: "Ibadan Hub", recordedBy: "Kwame A." },
  { id: "adj-11", date: "24 Aug 2026", skuId: "PRT-013", partName: "Battery Terminal Kit", type: "Addition", qty: 16, location: "Osogbo Hub", recordedBy: "Fleet Ops" },
  { id: "adj-12", date: "22 Aug 2026", skuId: "PRT-010", partName: "Seat Assembly", type: "Depletion", qty: 1, location: "Abeokuta Hub", recordedBy: "Tunde B." },
  { id: "adj-13", date: "21 Aug 2026", skuId: "PRT-014", partName: "Rear Fender", type: "Addition", qty: 5, location: "Osogbo Hub", recordedBy: "Funke A." },
]
