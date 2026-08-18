export interface DisposalRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  assessmentId: string
  location: string
  disposalStage: string
  condition: string
  duration: string
  sla: string
  costRatio: string
}

export const mockDisposalRecords = [
  { id: "1", assetId: "DSP-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 001A", assessmentId: "ASM-4401", location: "Lagos", disposalStage: "Pending Auction", condition: "Excellent", duration: "18d", sla: "Breached", costRatio: "82%" },
  { id: "2", assetId: "DSP-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 220B", assessmentId: "ASM-4402", location: "Ibadan", disposalStage: "Pending Auction", condition: "Salvage", duration: "5d", sla: "Within SLA", costRatio: "65%" },
  { id: "3", assetId: "DSP-003", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 112C", assessmentId: "ASM-4403", location: "Lagos", disposalStage: "Auctioned – Awaiting Pickup", condition: "Excellent", duration: "3d", sla: "Within SLA", costRatio: "91%" },
  { id: "4", assetId: "DSP-004", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 430D", assessmentId: "ASM-4404", location: "Abeokuta", disposalStage: "Auctioned – Awaiting Pickup", condition: "Salvage", duration: "9d", sla: "Breached", costRatio: "78%" },
  { id: "5", assetId: "DSP-005", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KBZ 550E", assessmentId: "ASM-4405", location: "Lagos", disposalStage: "Pending Auction", condition: "Fair", duration: "12d", sla: "Breached", costRatio: "70%" },
  { id: "6", assetId: "DSP-006", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KCA 660F", assessmentId: "ASM-4406", location: "Ibadan", disposalStage: "Disposed", condition: "", duration: "2d", sla: "Within SLA", costRatio: "95%" },
  { id: "7", assetId: "DSP-007", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 770G", assessmentId: "ASM-4407", location: "Lagos", disposalStage: "Disposed – Pending Write-Off", condition: "", duration: "4d", sla: "Within SLA", costRatio: "88%" },
  { id: "8", assetId: "DSP-008", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 880H", assessmentId: "ASM-4408", location: "Abeokuta", disposalStage: "Disposed – Pending Write-Off", condition: "", duration: "6d", sla: "Within SLA", costRatio: "75%" },
] satisfies DisposalRecord[]
