export interface Vehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string | null
  batchNumber: string
  location: string
  championStatus: "Active" | "Inactive" | null
  contractStatus: "Active" | "Inactive" | null
  lifecycleState: "Active" | "Temporarily Inactive" | "Inactive" | "Refurb" | "Inbound"
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
    lifecycleState: "Active",
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
    lifecycleState: "Active",
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
    lifecycleState: "Temporarily Inactive",
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
    lifecycleState: "Inactive",
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
    lifecycleState: "Inbound",
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
    lifecycleState: "Refurb",
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
    lifecycleState: "Active",
    driverSafetyScore: 65,
    contractRisk: "Medium",
    collectionPercent: 60,
    daysInState: 15,
    dateCreated: "3 Dec 2023",
  },
] satisfies Vehicle[]

export const mockVehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => ({
  ...baseMockVehicles[i % baseMockVehicles.length],
  id: String(i + 1),
}))
