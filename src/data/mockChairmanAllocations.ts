export interface ChairmanAllocation {
  id: string
  chairmanName: string
  chairmanId: string
  location: string
  subcityPark: string
  dateAdded: string
  vehiclesAssigned: number
  active: number
  inactive: number
  pending: number
  utilizationRate: number
  status: "Assigned" | "Pending Approval" | "Available for Assignment"
}

export const mockChairmanAllocations = [
  {
    id: "1",
    chairmanName: "Abebe Tadesse",
    chairmanId: "CHR-001",
    location: "Lagos",
    subcityPark: "Bole",
    dateAdded: "2026-01-10",
    vehiclesAssigned: 8,
    active: 6,
    inactive: 1,
    pending: 1,
    utilizationRate: 75,
    status: "Assigned",
  },
  {
    id: "2",
    chairmanName: "Kebede Alemu",
    chairmanId: "CHR-002",
    location: "Sagamu",
    subcityPark: "Kirkos",
    dateAdded: "2026-01-15",
    vehiclesAssigned: 5,
    active: 3,
    inactive: 2,
    pending: 0,
    utilizationRate: 60,
    status: "Assigned",
  },
  {
    id: "3",
    chairmanName: "Dawit Mengistu",
    chairmanId: "CHR-003",
    location: "Ibadan",
    subcityPark: "Arada",
    dateAdded: "2026-02-01",
    vehiclesAssigned: 0,
    active: 0,
    inactive: 0,
    pending: 3,
    utilizationRate: 0,
    status: "Pending Approval",
  },
  {
    id: "4",
    chairmanName: "Tigist Hailu",
    chairmanId: "CHR-004",
    location: "Abeokuta",
    subcityPark: "Bole",
    dateAdded: "2026-01-20",
    vehiclesAssigned: 6,
    active: 5,
    inactive: 1,
    pending: 0,
    utilizationRate: 83,
    status: "Assigned",
  },
  {
    id: "5",
    chairmanName: "Yonas Bekele",
    chairmanId: "CHR-005",
    location: "Sango Ota",
    subcityPark: "Kirkos",
    dateAdded: "2026-02-05",
    vehiclesAssigned: 4,
    active: 2,
    inactive: 2,
    pending: 0,
    utilizationRate: 50,
    status: "Assigned",
  },
  {
    id: "6",
    chairmanName: "Sara Mohammed",
    chairmanId: "CHR-006",
    location: "Osogbo",
    subcityPark: "Arada",
    dateAdded: "2026-02-10",
    vehiclesAssigned: 0,
    active: 0,
    inactive: 0,
    pending: 2,
    utilizationRate: 0,
    status: "Pending Approval",
  },
  {
    id: "7",
    chairmanName: "Ephrem Desta",
    chairmanId: "CHR-007",
    location: "Akure",
    subcityPark: "Bole",
    dateAdded: "2026-01-25",
    vehiclesAssigned: 5,
    active: 4,
    inactive: 0,
    pending: 1,
    utilizationRate: 80,
    status: "Assigned",
  },
] satisfies ChairmanAllocation[]
