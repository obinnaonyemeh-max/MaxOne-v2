export type VehicleStatus = 
  | "Exit" 
  | "Active" 
  | "Inbound" 
  | "Operational Fleet" 
  | "3PL Check-in Fleet" 
  | "Yard check-in Fleet"

export type ExitSubStatus = "HP Complete" | "Outright Sale" | "Disposed" | "Scrapped" | "Write-off" | "OEM Outbound" | "Stolen/Missing"
export type ActiveSubStatus = "MCP" | "Retail" | "Enterprise"
export type InboundSubStatus = "Production" | "Documentation" | "Logistics" | "Pre-Deployment"
export type OperationalFleetSubStatus = "Operational Vehicle" | "Demo" | "System test"
export type ThreePLCheckinSubStatus = "Violation" | "Accident" | "Others" | "Asset Maintenance"
export type YardCheckinSubStatus = "Asset retrieved" | "Deactivated" | "Assessed - No repair required" | "Assessed - Refurbish" | "Assessed - Dispose" | "Assessed - Scrap"

export type SubStatus = 
  | ExitSubStatus 
  | ActiveSubStatus 
  | InboundSubStatus 
  | OperationalFleetSubStatus 
  | ThreePLCheckinSubStatus 
  | YardCheckinSubStatus

export interface Vehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string | null
  batchNumber: string
  location: string
  championStatus: "Active" | "Inactive" | null
  contractStatus: "Active" | "Inactive" | null
  vehicleStatus: VehicleStatus
  subStatus: SubStatus
  driverSafetyScore: number | null
  contractRisk: "Low" | "Medium" | "High" | null
  collectionPercent: number | null
  daysInState: number
  dateCreated: string
}

const baseMockVehicles = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-234-XY",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    vehicleStatus: "Active",
    subStatus: "MCP",
    driverSafetyScore: 92,
    contractRisk: "Low",
    collectionPercent: 98,
    daysInState: 45,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "2",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-203",
    plateNumber: "ABJ-891-KL",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Active",
    subStatus: "Retail",
    driverSafetyScore: 78,
    contractRisk: "Low",
    collectionPercent: 85,
    daysInState: 120,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "KAN-456-MN",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    vehicleStatus: "3PL Check-in Fleet",
    subStatus: "Violation",
    driverSafetyScore: 55,
    contractRisk: "Medium",
    collectionPercent: 72,
    daysInState: 8,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "OYO-123-AB",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Exit",
    subStatus: "HP Complete",
    driverSafetyScore: 88,
    contractRisk: "Low",
    collectionPercent: 100,
    daysInState: 30,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: null,
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: null,
    contractStatus: null,
    vehicleStatus: "Inbound",
    subStatus: "Production",
    driverSafetyScore: null,
    contractRisk: null,
    collectionPercent: null,
    daysInState: 3,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "EKI-789-CD",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Yard check-in Fleet",
    subStatus: "Assessed - Refurbish",
    driverSafetyScore: 35,
    contractRisk: "High",
    collectionPercent: 45,
    daysInState: 200,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "7",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-567-EF",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Operational Fleet",
    subStatus: "Operational Vehicle",
    driverSafetyScore: 65,
    contractRisk: "Medium",
    collectionPercent: 60,
    daysInState: 15,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "8",
    assetType: "3 Wheeler",
    assetId: "MAX-IB-CH-204",
    plateNumber: "LAG-890-GH",
    batchNumber: "MAX-3774B56",
    location: "Victoria Island",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Active",
    subStatus: "Enterprise",
    driverSafetyScore: 82,
    contractRisk: "Low",
    collectionPercent: 95,
    daysInState: 60,
    dateCreated: "15 Jan 2024",
  },
  {
    id: "9",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-205",
    plateNumber: null,
    batchNumber: "MAX-3774B57",
    location: "Lekki",
    championStatus: null,
    contractStatus: null,
    vehicleStatus: "Inbound",
    subStatus: "Documentation",
    driverSafetyScore: null,
    contractRisk: null,
    collectionPercent: null,
    daysInState: 5,
    dateCreated: "20 Feb 2024",
  },
  {
    id: "10",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-206",
    plateNumber: "ABJ-234-IJ",
    batchNumber: "MAX-3774B58",
    location: "Abuja",
    championStatus: "Active",
    contractStatus: "Inactive",
    vehicleStatus: "Exit",
    subStatus: "Outright Sale",
    driverSafetyScore: 75,
    contractRisk: "Low",
    collectionPercent: 100,
    daysInState: 10,
    dateCreated: "5 Mar 2024",
  },
  {
    id: "11",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-207",
    plateNumber: "KAN-567-KL",
    batchNumber: "MAX-3774B59",
    location: "Kano",
    championStatus: "Active",
    contractStatus: "Active",
    vehicleStatus: "Operational Fleet",
    subStatus: "Demo",
    driverSafetyScore: 90,
    contractRisk: "Low",
    collectionPercent: 88,
    daysInState: 25,
    dateCreated: "10 Apr 2024",
  },
  {
    id: "12",
    assetType: "3 Wheeler",
    assetId: "MAX-IB-CH-208",
    plateNumber: "PH-789-MN",
    batchNumber: "MAX-3774B60",
    location: "Port Harcourt",
    championStatus: "Active",
    contractStatus: "Inactive",
    vehicleStatus: "3PL Check-in Fleet",
    subStatus: "Accident",
    driverSafetyScore: 45,
    contractRisk: "High",
    collectionPercent: 50,
    daysInState: 15,
    dateCreated: "25 May 2024",
  },
] satisfies Vehicle[]

export const mockVehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => ({
  ...baseMockVehicles[i % baseMockVehicles.length],
  id: String(i + 1),
}))
