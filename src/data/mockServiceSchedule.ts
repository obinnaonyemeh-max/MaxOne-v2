import type { RequiredPart } from "./parts"
export type { RequiredPart }

export interface ServiceRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  location: string
  provider: string
  type: string
  stage: string
  days: string
  assignedTo: string
  sla: string
}

export const mockServiceRecords = [
  { id: "1", assetId: "AST-5001", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-701-AA", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "Awaiting Supply", days: "6d", assignedTo: "Emeka O.", sla: "Breached" },
  { id: "2", assetId: "AST-5002", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-702-BB", location: "Lagos Hub", provider: "3PL", type: "Unscheduled", stage: "Awaiting Supply", days: "3d", assignedTo: "External – MotoFix Ltd", sla: "Within SLA" },
  { id: "3", assetId: "AST-5010", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "AC-201-CC", location: "Ibadan Hub", provider: "In-House", type: "Scheduled", stage: "In Progress", days: "4d", assignedTo: "Kwame A.", sla: "Near SLA" },
  { id: "4", assetId: "AST-5015", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-410-DD", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "In Progress", days: "8d", assignedTo: "Chidi N.", sla: "Breached" },
  { id: "5", assetId: "AST-5020", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-502-EE", location: "Lagos Hub", provider: "3PL", type: "Unscheduled", stage: "In Progress", days: "2d", assignedTo: "External – AutoCare", sla: "Within SLA" },
  { id: "6", assetId: "AST-5025", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-220-FF", location: "Ibadan Hub", provider: "In-House", type: "Scheduled", stage: "Awaiting Supply", days: "7d", assignedTo: "Kwame A.", sla: "Breached" },
  { id: "7", assetId: "AST-5030", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-615-GG", location: "Lagos Hub", provider: "In-House", type: "Unscheduled", stage: "Quality Check", days: "2d", assignedTo: "Chidi N.", sla: "Within SLA" },
  { id: "8", assetId: "AST-5035", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-710-HH", location: "Lagos Hub", provider: "3PL", type: "Scheduled", stage: "Quality Check", days: "1d", assignedTo: "External – MotoFix Ltd", sla: "Within SLA" },
  { id: "9", assetId: "AST-5040", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "AC-330-JJ", location: "Ibadan Hub", provider: "In-House", type: "Scheduled", stage: "Tel. Revalidation", days: "2d", assignedTo: "Kwame A.", sla: "Near SLA" },
  { id: "10", assetId: "AST-5045", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-820-KK", location: "Lagos Hub", provider: "In-House", type: "Unscheduled", stage: "Tel. Revalidation", days: "1d", assignedTo: "Emeka O.", sla: "Within SLA" },
  { id: "11", assetId: "AST-5050", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-905-LL", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "Completed", days: "1d", assignedTo: "Chidi N.", sla: "Within SLA" },
  { id: "12", assetId: "AST-5055", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-440-MM", location: "Ibadan Hub", provider: "3PL", type: "Scheduled", stage: "Completed", days: "0d", assignedTo: "External – AutoCare", sla: "Within SLA" },
] satisfies ServiceRecord[]

export const mockServicePartsMap: Record<string, RequiredPart[]> = {
  "AST-5001": [
    { id: "1", partName: "Battery Pack", qty: 1, status: "Ordered" },
    { id: "2", partName: "Controller Unit", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-5002": [
    { id: "1", partName: "Brake Pads", qty: 2, status: "Received" },
  ],
  "AST-5010": [
    { id: "1", partName: "Motor Assembly", qty: 1, status: "Ordered" },
    { id: "2", partName: "Wiring Harness", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-5015": [
    { id: "1", partName: "Display Panel", qty: 1, status: "Ordered" },
  ],
}
