export interface DeactivatedVehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string
  location: string
  daysInState: number
  dateAdded: string
}

export const mockDeactivatedVehicles: DeactivatedVehicle[] = [
  { id: "1", assetType: "2 Wheeler", assetId: "MAX-LG-CH-401", plateNumber: "LG-401-XY", location: "Lagos Hub", daysInState: 12, dateAdded: "21 Aug 2026" },
  { id: "2", assetType: "3 Wheeler", assetId: "MAX-LG-CH-402", plateNumber: "LG-402-AB", location: "Lagos Hub", daysInState: 8, dateAdded: "25 Aug 2026" },
  { id: "3", assetType: "2 Wheeler", assetId: "MAX-LG-CH-403", plateNumber: "LG-403-CD", location: "Lagos Hub", daysInState: 5, dateAdded: "28 Aug 2026" },
  { id: "4", assetType: "4 Wheeler", assetId: "MAX-LG-CH-404", plateNumber: "LG-404-EF", location: "Lagos Hub", daysInState: 3, dateAdded: "30 Aug 2026" },
  { id: "5", assetType: "2 Wheeler", assetId: "MAX-LG-CH-405", plateNumber: "LG-405-GH", location: "Lagos Hub", daysInState: 1, dateAdded: "1 Sep 2026" },
  { id: "6", assetType: "3 Wheeler", assetId: "MAX-IB-CH-410", plateNumber: "IB-410-JK", location: "Ibadan Hub", daysInState: 15, dateAdded: "18 Aug 2026" },
  { id: "7", assetType: "2 Wheeler", assetId: "MAX-IB-CH-411", plateNumber: "IB-411-LM", location: "Ibadan Hub", daysInState: 6, dateAdded: "27 Aug 2026" },
  { id: "8", assetType: "4 Wheeler", assetId: "MAX-IB-CH-412", plateNumber: "IB-412-NP", location: "Ibadan Hub", daysInState: 2, dateAdded: "31 Aug 2026" },
  { id: "9", assetType: "2 Wheeler", assetId: "MAX-AB-CH-420", plateNumber: "AB-420-QR", location: "Abeokuta Hub", daysInState: 9, dateAdded: "24 Aug 2026" },
  { id: "10", assetType: "3 Wheeler", assetId: "MAX-OS-CH-430", plateNumber: "OS-430-ST", location: "Osogbo Hub", daysInState: 18, dateAdded: "15 Aug 2026" },
  { id: "11", assetType: "2 Wheeler", assetId: "MAX-OS-CH-431", plateNumber: "OS-431-UV", location: "Osogbo Hub", daysInState: 7, dateAdded: "26 Aug 2026" },
  { id: "12", assetType: "4 Wheeler", assetId: "MAX-OS-CH-432", plateNumber: "OS-432-WX", location: "Osogbo Hub", daysInState: 4, dateAdded: "29 Aug 2026" },
]
