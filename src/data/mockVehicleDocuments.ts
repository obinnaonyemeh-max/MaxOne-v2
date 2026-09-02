export type DocumentStatus = "valid" | "expiring" | "expired"
export type VehicleDocStatus = "Complete" | "Expiring Soon" | "Expired"
export type VehicleType = "2-Wheel" | "3-Wheel"
export type UploadStatus = "Uploaded" | "Expired" | "Expiring Soon"

export interface ChecklistDocument {
  name: string
  uploadedBy: string
  uploadStatus: UploadStatus
  expiry: string | null
  status: DocumentStatus
}

export interface VehicleDocumentRecord {
  vehicleId: string
  champion: string
  type: VehicleType
  documents: DocumentStatus[]
  completion: number
  status: VehicleDocStatus
  lastUpdated: string
  location: string
  checklist: ChecklistDocument[]
}

const defaultChecklist: ChecklistDocument[] = [
  { name: "Vehicle Registration Certificate", uploadedBy: "D. Adeola",  uploadStatus: "Uploaded",       expiry: "05 May 2027", status: "valid" },
  { name: "Insurance Certificate",            uploadedBy: "K. Ibrahim", uploadStatus: "Uploaded",       expiry: "03 May 2027", status: "valid" },
  { name: "Roadworthiness Certificate",       uploadedBy: "D. Adeola",  uploadStatus: "Uploaded",       expiry: "12 Jun 2026", status: "valid" },
  { name: "Hackney Permit",                   uploadedBy: "Fleet Mgr",  uploadStatus: "Uploaded",       expiry: "08 May 2026", status: "valid" },
  { name: "Driver's License",                 uploadedBy: "Fleet Mgr",  uploadStatus: "Uploaded",       expiry: "14 Nov 2028", status: "valid" },
  { name: "Vehicle License",                  uploadedBy: "K. Ibrahim", uploadStatus: "Uploaded",       expiry: "05 Mar 2027", status: "valid" },
  { name: "Customs Clearance Certificate",    uploadedBy: "Fleet Mgr",  uploadStatus: "Expiring Soon", expiry: null,           status: "expiring" },
  { name: "Procurement Invoice",              uploadedBy: "Fleet Mgr",  uploadStatus: "Expiring Soon", expiry: null,           status: "expiring" },
]

const vh43Checklist: ChecklistDocument[] = [
  { name: "Vehicle Registration Certificate", uploadedBy: "D. Adeola",  uploadStatus: "Expired",       expiry: "05 May 2027", status: "expired" },
  { name: "Insurance Certificate",            uploadedBy: "K. Ibrahim", uploadStatus: "Expired",       expiry: "03 May 2026", status: "expired" },
  { name: "Roadworthiness Certificate",       uploadedBy: "D. Adeola",  uploadStatus: "Uploaded",      expiry: "12 Jun 2026", status: "valid" },
  { name: "Hackney Permit",                   uploadedBy: "Fleet Mgr",  uploadStatus: "Uploaded",      expiry: "08 May 2026", status: "valid" },
  { name: "Driver's License",                 uploadedBy: "Fleet Mgr",  uploadStatus: "Uploaded",      expiry: "14 Nov 2028", status: "valid" },
  { name: "Vehicle License",                  uploadedBy: "K. Ibrahim", uploadStatus: "Uploaded",      expiry: "05 Mar 2027", status: "valid" },
  { name: "Customs Clearance Certificate",    uploadedBy: "Fleet Mgr",  uploadStatus: "Expiring Soon", expiry: null,          status: "expiring" },
  { name: "Procurement Invoice",              uploadedBy: "Fleet Mgr",  uploadStatus: "Expiring Soon", expiry: null,          status: "expiring" },
]

export interface ComplianceAlert {
  vehicleId: string
  message: string
}

export const mockVehicleDocuments: VehicleDocumentRecord[] = [
  {
    vehicleId: "VH-00043",
    champion: "Adewale Okafor",
    type: "2-Wheel",
    documents: ["expired", "expired", "valid", "valid", "valid", "valid", "expiring", "expiring"],
    completion: 62,
    status: "Expired",
    lastUpdated: "03 May 2026",
    location: "Ikeja",
    checklist: vh43Checklist,
  },
  {
    vehicleId: "VH-00091",
    champion: "Chidi Eze",
    type: "3-Wheel",
    documents: ["valid", "expiring", "valid", "valid", "valid", "valid", "expiring", "expiring"],
    completion: 88,
    status: "Expiring Soon",
    lastUpdated: "01 May 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00127",
    champion: "Blessing Nwosu",
    type: "2-Wheel",
    documents: ["expired", "valid", "valid", "valid", "valid", "valid", "expiring", "expiring"],
    completion: 75,
    status: "Expired",
    lastUpdated: "28 Apr 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00012",
    champion: "Fatima Sule",
    type: "2-Wheel",
    documents: ["valid", "valid", "valid", "expiring", "valid", "valid", "expiring", "expiring"],
    completion: 100,
    status: "Expiring Soon",
    lastUpdated: "02 May 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00055",
    champion: "Emeka Obi",
    type: "3-Wheel",
    documents: ["valid", "valid", "valid", "valid", "valid", "valid", "expiring", "expiring"],
    completion: 100,
    status: "Expiring Soon",
    lastUpdated: "04 May 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00182",
    champion: "Amaka Eze",
    type: "2-Wheel",
    documents: ["valid", "valid", "valid", "valid", "valid", "valid", "valid", "expiring"],
    completion: 100,
    status: "Complete",
    lastUpdated: "06 May 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00034",
    champion: "Yusuf Musa",
    type: "3-Wheel",
    documents: ["valid", "valid", "valid", "valid", "valid", "valid", "valid", "expiring"],
    completion: 100,
    status: "Complete",
    lastUpdated: "05 May 2026",
    location: "Ikeja",
    checklist: defaultChecklist,
  },
  {
    vehicleId: "VH-00067",
    champion: "Grace Adeyemi",
    type: "2-Wheel",
    documents: ["valid", "valid", "valid", "valid", "valid", "valid", "expiring", "expiring"],
    completion: 88,
    status: "Complete",
    lastUpdated: "05 May 2026",
    location: "Accra, Ghana",
    checklist: defaultChecklist,
  },
]

export const vehicleDocumentStats = {
  coveragePct: 74,
  coverageComplete: 148,
  coverageTotal: 200,
  coverageTrend: 6,
  expiredCount: 18,
  expiredVehicles: 12,
  expiredFleetPct: 9,
  expiringSoonCount: 31,
  expiringVehicles: 5,
  totalFleet: 200,
  region: "Lagos, Nigeria",
}

export const complianceAlerts: ComplianceAlert[] = [
  { vehicleId: "VH-00043", message: "Insurance Certificate expired 3 days ago" },
  { vehicleId: "VH-00091", message: "Roadworthiness Certificate expiring in 2 days" },
  { vehicleId: "VH-00127", message: "Vehicle Registration expired today" },
]

export const docStatusVariantMap: Record<VehicleDocStatus, "success" | "warning" | "danger"> = {
  Complete: "success",
  "Expiring Soon": "warning",
  Expired: "danger",
}
