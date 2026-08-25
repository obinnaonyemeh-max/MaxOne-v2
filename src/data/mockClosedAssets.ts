export interface ClosedAssetRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  disposalMethod: string
  disposalDate: string
  location: string
  recoveryValue: string
  writeOffAmount: string
  closedBy: string
}

export const mockClosedAssets = [
  { id: "1", assetId: "CLS-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 101A", disposalMethod: "Disposed", disposalDate: "2026-01-15", location: "Lagos", recoveryValue: "$4,200", writeOffAmount: "$3,800", closedBy: "James Mwangi" },
  { id: "2", assetId: "CLS-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 330B", disposalMethod: "Scrapped", disposalDate: "2026-01-22", location: "Ibadan", recoveryValue: "$1,850", writeOffAmount: "$5,350", closedBy: "Grace Ochieng" },
  { id: "3", assetId: "CLS-003", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 220C", disposalMethod: "Disposed", disposalDate: "2026-02-03", location: "Lagos", recoveryValue: "$5,100", writeOffAmount: "$4,000", closedBy: "Peter Kamau" },
  { id: "4", assetId: "CLS-004", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 540D", disposalMethod: "Scrapped", disposalDate: "2026-02-10", location: "Abeokuta", recoveryValue: "$2,300", writeOffAmount: "$8,700", closedBy: "Sarah Wanjiku" },
  { id: "5", assetId: "CLS-005", vehicleModel: "Seal", manufacturer: "BYD", plateNumber: "KCZ 660E", disposalMethod: "Disposed", disposalDate: "2026-02-18", location: "Lagos", recoveryValue: "$3,500", writeOffAmount: "$3,300", closedBy: "David Otieno" },
  { id: "6", assetId: "CLS-006", vehicleModel: "EX30", manufacturer: "Volvo", plateNumber: "KDB 880F", disposalMethod: "Scrapped", disposalDate: "2026-02-25", location: "Ibadan", recoveryValue: "$1,800", writeOffAmount: "$4,200", closedBy: "Alice Njeri" },
  { id: "7", assetId: "CLS-007", vehicleModel: "Atto 3", manufacturer: "BYD", plateNumber: "KAB 990G", disposalMethod: "Disposed", disposalDate: "2026-03-01", location: "Lagos", recoveryValue: "$2,950", writeOffAmount: "$5,100", closedBy: "James Mwangi" },
  { id: "8", assetId: "CLS-008", vehicleModel: "ID.4", manufacturer: "VW", plateNumber: "KCA 110H", disposalMethod: "Scrapped", disposalDate: "2026-03-05", location: "Abeokuta", recoveryValue: "$2,500", writeOffAmount: "$6,200", closedBy: "Grace Ochieng" },
] satisfies ClosedAssetRecord[]
