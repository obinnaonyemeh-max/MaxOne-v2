export interface ConversionRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  location: string
  assessmentId: string
  costRatio: string
  repairEstimate: string
  disposalStage: string
  reason: string
  requestedBy: string
  requestDate: string
  status: string
}

export const mockConversionRecords = [
  { id: "1", assetId: "DSP-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 001A", location: "Nairobi", assessmentId: "ASM-4401", costRatio: "82%", repairEstimate: "$1,800", disposalStage: "Pending Auction", reason: "Vehicle passed re-inspection with minor fixes needed", requestedBy: "James Ochieng", requestDate: "2026-03-08", status: "Pending" },
  { id: "2", assetId: "DSP-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 220B", location: "Mombasa", assessmentId: "ASM-4402", costRatio: "65%", repairEstimate: "$2,400", disposalStage: "Pending Auction", reason: "Enterprise client requested vehicle for dedicated fleet use", requestedBy: "Amina Hassan", requestDate: "2026-03-06", status: "Pending" },
  { id: "3", assetId: "DSP-008", vehicleModel: "ID.4", manufacturer: "VW", plateNumber: "KDA 880H", location: "Nakuru", assessmentId: "ASM-4408", costRatio: "75%", repairEstimate: "$1,200", disposalStage: "Pending Auction", reason: "Minor cosmetic damage only, mechanically sound", requestedBy: "Peter Kamau", requestDate: "2026-03-04", status: "Approved" },
  { id: "4", assetId: "DSP-006", vehicleModel: "EX30", manufacturer: "Volvo", plateNumber: "KCA 660F", location: "Mombasa", assessmentId: "ASM-4406", costRatio: "95%", repairEstimate: "$3,500", disposalStage: "Pending Auction", reason: "High repair cost but strategically needed for expansion", requestedBy: "Grace Muthoni", requestDate: "2026-03-02", status: "Rejected" },
] satisfies ConversionRecord[]
