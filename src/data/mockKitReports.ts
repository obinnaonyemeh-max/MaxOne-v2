export type KitStatus = "Assigned" | "Reassigned" | "Created"

export interface KitReport {
  id: string
  vehicleType: string
  model: string
  status: KitStatus
  client: string | null
  plateNumber: string | null
  location: string
  assignmentDate: string | null
  lastUpdated: string
}

export const kitStatusVariantMap: Record<KitStatus, "warning" | "danger" | "default"> = {
  Assigned: "warning",
  Reassigned: "danger",
  Created: "default",
}

export const mockKitReports: KitReport[] = [
  {
    id: "KIT-30011",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    client: "Opeyemi Orekoya",
    plateNumber: "KJA-119-XL",
    location: "Lagos",
    assignmentDate: "12 Jun 2026",
    lastUpdated: "18 Jul 2026",
  },
  {
    id: "KIT-30012",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Reassigned",
    client: "Amina Yusuf",
    plateNumber: "OGN-115-CT",
    location: "Lagos",
    assignmentDate: "03 Jul 2026",
    lastUpdated: "20 Jul 2026",
  },
  {
    id: "KIT-30013",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    client: "Chidinma Eze",
    plateNumber: "ABJ-772-KD",
    location: "Lagos",
    assignmentDate: "15 Jul 2026",
    lastUpdated: "15 Jul 2026",
  },
  {
    id: "KIT-30014",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Created",
    client: null,
    plateNumber: null,
    location: "Lagos",
    assignmentDate: null,
    lastUpdated: "10 Jul 2026",
  },
  {
    id: "KIT-30015",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Created",
    client: null,
    plateNumber: null,
    location: "Lagos",
    assignmentDate: null,
    lastUpdated: "08 Jul 2026",
  },
  {
    id: "KIT-30016",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Assigned",
    client: "Emeka Obi",
    plateNumber: "LND-889-RS",
    location: "Lagos",
    assignmentDate: "22 Jun 2026",
    lastUpdated: "22 Jun 2026",
  },
  {
    id: "KIT-30017",
    vehicleType: "E-tricycle Conversion Kit",
    model: "Conversion Kit",
    status: "Reassigned",
    client: "Tunde Bakare",
    plateNumber: "LND-330-QZ",
    location: "Lagos",
    assignmentDate: "01 Jul 2026",
    lastUpdated: "19 Jul 2026",
  },
]
