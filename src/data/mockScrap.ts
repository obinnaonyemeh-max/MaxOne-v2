export interface ScrapRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  assessmentId: string
  location: string
  scrapStage: string
  daysInStage: string
  sla: string
  estScrapValue: string
}

export const mockScrapRecords = [
  { id: "1", assetId: "SCR-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 101A", assessmentId: "ASM-5501", location: "Lagos", scrapStage: "Assigned for Scrap", daysInStage: "3d", sla: "Within SLA", estScrapValue: "$420" },
  { id: "2", assetId: "SCR-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 330B", assessmentId: "ASM-5502", location: "Ibadan", scrapStage: "Assigned for Scrap", daysInStage: "9d", sla: "Breached", estScrapValue: "$380" },
  { id: "3", assetId: "SCR-003", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 220C", assessmentId: "ASM-5503", location: "Lagos", scrapStage: "Scrap In Progress", daysInStage: "6d", sla: "Within SLA", estScrapValue: "$510" },
  { id: "4", assetId: "SCR-004", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 540D", assessmentId: "ASM-5504", location: "Abeokuta", scrapStage: "Scrap In Progress", daysInStage: "16d", sla: "Breached", estScrapValue: "$620" },
  { id: "5", assetId: "SCR-005", vehicleModel: "Seal", manufacturer: "BYD", plateNumber: "KCZ 660E", assessmentId: "ASM-5505", location: "Lagos", scrapStage: "Scrapped", daysInStage: "2d", sla: "Within SLA", estScrapValue: "$350" },
  { id: "6", assetId: "SCR-006", vehicleModel: "EX30", manufacturer: "Volvo", plateNumber: "KDB 880F", assessmentId: "ASM-5506", location: "Ibadan", scrapStage: "Scrapped – Pending Write-Off", daysInStage: "12d", sla: "Breached", estScrapValue: "$290" },
  { id: "7", assetId: "SCR-007", vehicleModel: "Atto 3", manufacturer: "BYD", plateNumber: "KAB 990G", assessmentId: "ASM-5507", location: "Lagos", scrapStage: "Scrapped – Pending Write-Off", daysInStage: "4d", sla: "Within SLA", estScrapValue: "$440" },
] satisfies ScrapRecord[]
