import type { RequiredPart } from "./parts"
export type { RequiredPart }

export interface RefurbishmentRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  location: string
  refurbishmentStage: string
  daysInStage: string
  assignedTo: string
  status: string
}

export const mockRefurbishmentRecords = [
  { id: "1", assetId: "AST-4201", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-201-XY", location: "Lagos Hub", refurbishmentStage: "Awaiting Supply", daysInStage: "6d", assignedTo: "Emeka O.", status: "Pending Parts" },
  { id: "2", assetId: "AST-4202", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-305-AB", location: "Lagos Hub", refurbishmentStage: "In Progress", daysInStage: "1d", assignedTo: "Emeka O.", status: "In Repair" },
  { id: "3", assetId: "AST-4210", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "AC-112-GH", location: "Ibadan Hub", refurbishmentStage: "In Progress", daysInStage: "8d", assignedTo: "Kwame A.", status: "In Repair" },
  { id: "4", assetId: "AST-4215", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-410-CD", location: "Lagos Hub", refurbishmentStage: "In Progress", daysInStage: "10d", assignedTo: "Chidi N.", status: "In Repair" },
  { id: "5", assetId: "AST-4220", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-502-EF", location: "Lagos Hub", refurbishmentStage: "In Progress", daysInStage: "1d", assignedTo: "Emeka O.", status: "In Repair" },
  { id: "6", assetId: "AST-4225", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-220-KL", location: "Ibadan Hub", refurbishmentStage: "Quality Check", daysInStage: "2d", assignedTo: "Kwame A.", status: "QC Passed" },
  { id: "7", assetId: "AST-4230", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-615-MN", location: "Lagos Hub", refurbishmentStage: "Quality Check", daysInStage: "1d", assignedTo: "Chidi N.", status: "QC Passed" },
  { id: "8", assetId: "AST-4235", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-710-PQ", location: "Lagos Hub", refurbishmentStage: "Tracking IoT", daysInStage: "2d", assignedTo: "Emeka O.", status: "Tracking Setup" },
  { id: "9", assetId: "AST-4240", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "AC-330-RS", location: "Ibadan Hub", refurbishmentStage: "Tracking IoT", daysInStage: "1d", assignedTo: "Kwame A.", status: "Tracking Setup" },
  { id: "10", assetId: "AST-4245", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-820-TU", location: "Lagos Hub", refurbishmentStage: "Activation Ready", daysInStage: "1d", assignedTo: "Chidi N.", status: "Ready" },
  { id: "11", assetId: "AST-4250", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-905-VW", location: "Lagos Hub", refurbishmentStage: "Activation Ready", daysInStage: "0d", assignedTo: "Emeka O.", status: "Ready" },
  { id: "12", assetId: "AST-4255", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-440-XZ", location: "Ibadan Hub", refurbishmentStage: "Awaiting Supply", daysInStage: "5d", assignedTo: "Kwame A.", status: "Pending Parts" },
] satisfies RefurbishmentRecord[]

/** Required parts — statuses are system-managed (auto-updated on receipt). */
export const mockRefurbishmentPartsMap: Record<string, RequiredPart[]> = {
  "AST-4201": [
    { id: "1", partName: "Battery Pack", qty: 1, status: "Ordered", cost: 180000 },
    { id: "2", partName: "Controller Unit", qty: 1, status: "Awaiting Supply", cost: 45000 },
  ],
  "AST-4255": [
    { id: "1", partName: "Front Fork", qty: 1, status: "Ordered", cost: 32000 },
    { id: "2", partName: "Rear Shock", qty: 1, status: "Awaiting Supply", cost: 28000 },
  ],
  "AST-4202": [
    { id: "1", partName: "Brake Pads", qty: 2, status: "Received", cost: 8500 },
  ],
  "AST-4210": [
    { id: "1", partName: "Motor Assembly", qty: 1, status: "Received", cost: 95000 },
    { id: "2", partName: "Wiring Harness", qty: 1, status: "Received", cost: 15000 },
  ],
  "AST-4215": [
    { id: "1", partName: "Display Panel", qty: 1, status: "Received", cost: 22000 },
  ],
  "AST-4220": [
    { id: "1", partName: "Throttle Assembly", qty: 1, status: "Received", cost: 12000 },
    { id: "2", partName: "Brake Lever", qty: 2, status: "Received", cost: 6500 },
  ],
  "AST-4225": [
    { id: "1", partName: "Battery Pack", qty: 1, status: "Received", cost: 180000 },
  ],
  "AST-4230": [
    { id: "1", partName: "Controller Unit", qty: 1, status: "Received", cost: 45000 },
    { id: "2", partName: "Wiring Harness", qty: 1, status: "Received", cost: 15000 },
  ],
}

/** Additional parts added via PKA — statuses are system-managed. */
export const mockRefurbishmentAdditionalPartsMap: Record<string, RequiredPart[]> = {
  "AST-4210": [
    { id: "a1", partName: "Throttle Grip", qty: 1, status: "Awaiting Supply", cost: 4200 },
  ],
  "AST-4215": [
    { id: "a1", partName: "Screws Kit", qty: 4, status: "Received", cost: 1500 },
  ],
  "AST-4220": [
    { id: "a1", partName: "Side Mirror", qty: 2, status: "Ordered", cost: 3800 },
  ],
  "AST-4225": [
    { id: "a1", partName: "Cable Tie Pack", qty: 1, status: "Received", cost: 800 },
  ],
}
