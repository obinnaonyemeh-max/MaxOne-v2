export type KitStatus = "Assigned" | "New"

export interface KitReport {
  id: string
  vehicleType: string
  model: string
  status: KitStatus
  reassigned: boolean
  champion: string | null
  plateNumber: string | null
  location: string
  assignmentDate: string | null
}

export const kitStatusVariantMap: Record<KitStatus, "success" | "default"> = {
  Assigned: "success",
  New: "default",
}

export const mockKitReports: KitReport[] = [
  {
    id: "KIT-30011",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    reassigned: false,
    champion: "Opeyemi Orekoya",
    plateNumber: "KJA-119-XL",
    location: "Lagos",
    assignmentDate: "12 Jun 2026",
  },
  {
    id: "KIT-30012",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    reassigned: true,
    champion: "Amina Yusuf",
    plateNumber: "OGN-115-CT",
    location: "Lagos",
    assignmentDate: "03 Jul 2026",
  },
  {
    id: "KIT-30013",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    reassigned: false,
    champion: "Chidinma Eze",
    plateNumber: "ABJ-772-KD",
    location: "Lagos",
    assignmentDate: "15 Jul 2026",
  },
  {
    id: "KIT-30014",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "New",
    reassigned: false,
    champion: null,
    plateNumber: null,
    location: "Lagos",
    assignmentDate: null,
  },
  {
    id: "KIT-30015",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "New",
    reassigned: false,
    champion: null,
    plateNumber: null,
    location: "Lagos",
    assignmentDate: null,
  },
  {
    id: "KIT-30016",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    reassigned: false,
    champion: "Emeka Obi",
    plateNumber: "LND-889-RS",
    location: "Lagos",
    assignmentDate: "22 Jun 2026",
  },
  {
    id: "KIT-30017",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    reassigned: true,
    champion: "Tunde Bakare",
    plateNumber: "LND-330-QZ",
    location: "Ibadan",
    assignmentDate: "01 Jul 2026",
  },
]
