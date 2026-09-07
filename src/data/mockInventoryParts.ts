export interface InventoryPart {
  id: string
  skuId: string
  partName: string
  location: string
  costPrice?: number
  onHandQuantity: number
  awaitingPickup: number
  manufacturer: string
  model: string
  trim: string
}

export function availableQuantity(part: InventoryPart): number {
  return Math.max(0, part.onHandQuantity - part.awaitingPickup)
}

export const mockInventoryParts: InventoryPart[] = [
  { id: "inv-1", skuId: "PRT-001", partName: "Front Brake Pad Set", location: "Lagos Hub", costPrice: 18500, onHandQuantity: 42, awaitingPickup: 6, manufacturer: "Honda", model: "Model A", trim: "Standard" },
  { id: "inv-2", skuId: "PRT-002", partName: "Rear Tire 90/90-17", location: "Lagos Hub", costPrice: 22000, onHandQuantity: 28, awaitingPickup: 4, manufacturer: "Honda", model: "Model B", trim: "Premium" },
  { id: "inv-3", skuId: "PRT-003", partName: "Headlight Assembly", location: "Lagos Hub", costPrice: 14500, onHandQuantity: 15, awaitingPickup: 2, manufacturer: "Yamaha", model: "Model A", trim: "Standard" },
  { id: "inv-4", skuId: "PRT-004", partName: "Controller Unit", location: "Lagos Hub", onHandQuantity: 8, awaitingPickup: 1, manufacturer: "Bajaj", model: "Model C", trim: "Sport" },
  { id: "inv-5", skuId: "PRT-005", partName: "Throttle Assembly", location: "Lagos Hub", costPrice: 6700, onHandQuantity: 31, awaitingPickup: 0, manufacturer: "TVS", model: "Model A", trim: "Standard" },
  { id: "inv-6", skuId: "PRT-006", partName: "Shock Absorber Pair", location: "Ibadan Hub", costPrice: 31200, onHandQuantity: 12, awaitingPickup: 3, manufacturer: "Honda", model: "Model D", trim: "Luxury" },
  { id: "inv-7", skuId: "PRT-007", partName: "Disc Rotor", location: "Ibadan Hub", costPrice: 9800, onHandQuantity: 20, awaitingPickup: 5, manufacturer: "Suzuki", model: "Model B", trim: "Sport" },
  { id: "inv-8", skuId: "PRT-008", partName: "Chain Kit", location: "Ibadan Hub", costPrice: 12400, onHandQuantity: 9, awaitingPickup: 0, manufacturer: "Yamaha", model: "Model C", trim: "Premium" },
  { id: "inv-9", skuId: "PRT-009", partName: "Side Mirror Pair", location: "Abeokuta Hub", costPrice: 4100, onHandQuantity: 36, awaitingPickup: 8, manufacturer: "Bajaj", model: "Model A", trim: "Standard" },
  { id: "inv-10", skuId: "PRT-010", partName: "Seat Assembly", location: "Abeokuta Hub", costPrice: 16800, onHandQuantity: 7, awaitingPickup: 1, manufacturer: "TVS", model: "Model B", trim: "Premium" },
  { id: "inv-11", skuId: "PRT-011", partName: "Wiring Harness", location: "Abeokuta Hub", onHandQuantity: 11, awaitingPickup: 0, manufacturer: "Honda", model: "Model C", trim: "Standard" },
  { id: "inv-12", skuId: "PRT-012", partName: "Horn Unit", location: "Osogbo Hub", costPrice: 2500, onHandQuantity: 48, awaitingPickup: 12, manufacturer: "Suzuki", model: "Model A", trim: "Standard" },
  { id: "inv-13", skuId: "PRT-013", partName: "Battery Terminal Kit", location: "Osogbo Hub", costPrice: 3200, onHandQuantity: 22, awaitingPickup: 0, manufacturer: "Yamaha", model: "Model D", trim: "Sport" },
  { id: "inv-14", skuId: "PRT-014", partName: "Rear Fender", location: "Osogbo Hub", costPrice: 8900, onHandQuantity: 5, awaitingPickup: 2, manufacturer: "Honda", model: "Model A", trim: "Premium" },
]
