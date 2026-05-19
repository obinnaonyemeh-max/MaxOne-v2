export interface BatchRecord {
  id: string
  batchId: string
  oem: string
  model: string
  qty: number
  stage: string
  destination: string
  eta: string
}

export const mockBatches = [
  { id: "1", batchId: "BATCH-12-3056", oem: "TailG", model: "Jidi", qty: 20000, stage: "At Port", destination: "Ghana / Accra", eta: "100d" },
  { id: "2", batchId: "BATCH-0990", oem: "Spiro", model: "Ekon", qty: 5000, stage: "Identifier Upload", destination: "Nigeria / Lagos", eta: "105d" },
  { id: "3", batchId: "BATCH-2026-003", oem: "King", model: "MAX M4", qty: 2500, stage: "In Transit", destination: "Nigeria / Lagos", eta: "75d" },
  { id: "4", batchId: "BATCH-2026-002", oem: "TailG", model: "Jidi", qty: 400, stage: "Ready for Activation", destination: "Ghana / Accra", eta: "65d" },
  { id: "5", batchId: "BATCH-2026-001", oem: "Spiro", model: "Ekon", qty: 1000, stage: "Identifier Upload", destination: "Nigeria / Lagos", eta: "74d" },
  { id: "6", batchId: "BATCH-2026-006", oem: "King", model: "MAX M4", qty: 3000, stage: "In Production", destination: "Nigeria / Lagos", eta: "120d" },
  { id: "7", batchId: "BATCH-2026-007", oem: "TailG", model: "Jidi", qty: 1500, stage: "Clearing", destination: "Ghana / Accra", eta: "45d" },
  { id: "8", batchId: "BATCH-2026-008", oem: "Spiro", model: "Ekon", qty: 800, stage: "Warehouse QA", destination: "Nigeria / Lagos", eta: "30d" },
] satisfies BatchRecord[]
