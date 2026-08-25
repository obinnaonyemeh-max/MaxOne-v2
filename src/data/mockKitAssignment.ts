export interface KitChampion {
  id: string
  name: string
  championId: string
  phoneNumber: string
  email: string
}

export interface ReassignableVehicle {
  id: string
  searchLabel: string
  vehicleType: string
  vehicleModel: string
  currentPlateNumber: string
  currentChassisId: string
  currentChampion: KitChampion
}

export const mockKitChampions: KitChampion[] = [
  { id: "c1", name: "Opeyemi Orekoya", championId: "CH-10234", phoneNumber: "0803 221 5590", email: "opeyemi.orekoya@maxride.ng" },
  { id: "c2", name: "Chidinma Eze",    championId: "CH-10891", phoneNumber: "0805 774 1220", email: "chidinma.eze@maxride.ng" },
  { id: "c3", name: "Amina Yusuf",     championId: "CH-11002", phoneNumber: "0809 331 8842", email: "amina.yusuf@maxride.ng" },
  { id: "c4", name: "Emeka Obi",       championId: "CH-11245", phoneNumber: "0812 990 4471", email: "emeka.obi@maxride.ng" },
  { id: "c5", name: "Tunde Bakare",    championId: "CH-11310", phoneNumber: "0807 145 6690", email: "tunde.bakare@maxride.ng" },
]

export const mockReassignableVehicles: ReassignableVehicle[] = [
  {
    id: "v1",
    searchLabel: "EKON 450M1V2 — Black — KJA-119-XL",
    vehicleType: "eMotorcycle",
    vehicleModel: "EKON 450M1V2",
    currentPlateNumber: "KJA-119-XL",
    currentChassisId: "LB5DJ3R26SZ834290",
    currentChampion: mockKitChampions[0],
  },
  {
    id: "v2",
    searchLabel: "EKON 450M1V2 — Red — OGN-115-CT",
    vehicleType: "eMotorcycle",
    vehicleModel: "EKON 450M1V2",
    currentPlateNumber: "OGN-115-CT",
    currentChassisId: "LB5DJ3R26SZ871045",
    currentChampion: mockKitChampions[2],
  },
  {
    id: "v3",
    searchLabel: "eTricycle Conversion Kit — ABJ-772-KD",
    vehicleType: "eTricycle",
    vehicleModel: "Conversion Kit",
    currentPlateNumber: "ABJ-772-KD",
    currentChassisId: "LB5DJ3R26SZ905512",
    currentChampion: mockKitChampions[3],
  },
]
