export interface InboundBatchRecord {
  id: string
  batchId: string
  oem: string
  vehicleModel: string
  quantity: number
  currentStage: string
  destination: string
  daysInStage: string
  eta: string
}

export const mockInboundBatches = [
  { id: "1", batchId: "BATCH-2026-003", oem: "King", vehicleModel: "MAX M4", quantity: 2500, currentStage: "In Transit", destination: "Nigeria / Lagos", daysInStage: "0d", eta: "81 days" },
  { id: "2", batchId: "BATCH-2026-002", oem: "TailG", vehicleModel: "Jidi", quantity: 400, currentStage: "Identifier Upload", destination: "Ghana / Accra", daysInStage: "1d", eta: "71 days" },
  { id: "3", batchId: "BATCH-2026-001", oem: "Spiro", vehicleModel: "Ekon", quantity: 1000, currentStage: "Identifier Upload", destination: "Nigeria / Lagos", daysInStage: "1d", eta: "80 days" },
] satisfies InboundBatchRecord[]
