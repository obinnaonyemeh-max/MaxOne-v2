export interface TransferRecord {
  id: string
  assetType: "2 Wheeler" | "3 Wheeler" | "4 Wheeler"
  vehicleId: string
  champion: string
  hpCompletedDate: string
  status: "Transfer In Progress" | "Transfer — Yet to Commence" | "Ownership Transferred"
  flag: "Awaiting Approval" | "Returned for Correction" | "Approved" | null
  days: number
  sla: number
  breached: boolean
}

export const mockTransferRecords: TransferRecord[] = [
  { id: "1",  assetType: "2 Wheeler", vehicleId: "VH-2024-00341", champion: "Adaeze Okonkwo",   hpCompletedDate: "28 Apr 2026", status: "Transfer In Progress",      flag: "Awaiting Approval",      days: 4, sla: 5, breached: false },
  { id: "2",  assetType: "2 Wheeler", vehicleId: "VH-2024-00298", champion: "Emeka Nwosu",       hpCompletedDate: "27 Apr 2026", status: "Transfer In Progress",      flag: "Awaiting Approval",      days: 3, sla: 5, breached: false },
  { id: "3",  assetType: "3 Wheeler", vehicleId: "VH-2024-00317", champion: "Oluwaseun Bello",   hpCompletedDate: "26 Apr 2026", status: "Transfer In Progress",      flag: "Returned for Correction", days: 3, sla: 5, breached: false },
  { id: "4",  assetType: "2 Wheeler", vehicleId: "VH-2024-00389", champion: "Ibrahim Yusuf",     hpCompletedDate: "29 Apr 2026", status: "Transfer In Progress",      flag: null,                      days: 1, sla: 5, breached: false },
  { id: "5",  assetType: "2 Wheeler", vehicleId: "VH-2024-00251", champion: "Funmilayo Ade",     hpCompletedDate: "21 Apr 2026", status: "Transfer In Progress",      flag: null,                      days: 8, sla: 5, breached: true  },
  { id: "6",  assetType: "4 Wheeler", vehicleId: "VH-2024-00372", champion: "Tunde Bakare",      hpCompletedDate: "25 Apr 2026", status: "Transfer In Progress",      flag: "Awaiting Approval",      days: 2, sla: 5, breached: false },
  { id: "7",  assetType: "2 Wheeler", vehicleId: "VH-2024-00284", champion: "Chioma Obi",        hpCompletedDate: "24 Apr 2026", status: "Transfer In Progress",      flag: null,                      days: 4, sla: 5, breached: false },
  { id: "8",  assetType: "3 Wheeler", vehicleId: "VH-2024-00356", champion: "Yemi Adesanya",     hpCompletedDate: "23 Apr 2026", status: "Transfer In Progress",      flag: "Returned for Correction", days: 6, sla: 5, breached: true  },
  { id: "9",  assetType: "2 Wheeler", vehicleId: "VH-2024-00301", champion: "Amaka Eze",         hpCompletedDate: "22 Apr 2026", status: "Transfer In Progress",      flag: null,                      days: 3, sla: 5, breached: false },
  { id: "10", assetType: "2 Wheeler", vehicleId: "VH-2024-00401", champion: "Ngozi Eze",         hpCompletedDate: "30 Apr 2026", status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "11", assetType: "4 Wheeler", vehicleId: "VH-2024-00415", champion: "Chukwuemeka Ibe",   hpCompletedDate: "30 Apr 2026", status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "12", assetType: "2 Wheeler", vehicleId: "VH-2024-00423", champion: "Adaora Nwosu",      hpCompletedDate: "1 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "13", assetType: "2 Wheeler", vehicleId: "VH-2024-00431", champion: "Segun Falowo",      hpCompletedDate: "1 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "14", assetType: "3 Wheeler", vehicleId: "VH-2024-00445", champion: "Kemi Adeyemi",      hpCompletedDate: "2 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "15", assetType: "2 Wheeler", vehicleId: "VH-2024-00458", champion: "Bola Okafor",       hpCompletedDate: "2 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "16", assetType: "4 Wheeler", vehicleId: "VH-2024-00462", champion: "Uche Nwosu",        hpCompletedDate: "3 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "17", assetType: "2 Wheeler", vehicleId: "VH-2024-00477", champion: "Femi Adebayo",      hpCompletedDate: "3 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "18", assetType: "2 Wheeler", vehicleId: "VH-2024-00489", champion: "Grace Obi",         hpCompletedDate: "4 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "19", assetType: "3 Wheeler", vehicleId: "VH-2024-00496", champion: "Emeka Okafor",      hpCompletedDate: "4 May 2026",  status: "Transfer — Yet to Commence", flag: null,                     days: 0, sla: 5, breached: false },
  { id: "20", assetType: "2 Wheeler", vehicleId: "VH-2024-00192", champion: "Patience Ogbu",     hpCompletedDate: "18 Apr 2026", status: "Ownership Transferred",      flag: "Approved",               days: 3, sla: 5, breached: false },
  { id: "21", assetType: "4 Wheeler", vehicleId: "VH-2024-00178", champion: "Tobi Adewale",      hpCompletedDate: "15 Apr 2026", status: "Ownership Transferred",      flag: "Approved",               days: 2, sla: 5, breached: false },
  { id: "22", assetType: "2 Wheeler", vehicleId: "VH-2024-00165", champion: "Nkem Obi",          hpCompletedDate: "12 Apr 2026", status: "Ownership Transferred",      flag: "Approved",               days: 4, sla: 5, breached: false },
  { id: "23", assetType: "3 Wheeler", vehicleId: "VH-2024-00153", champion: "Adaeze Eze",        hpCompletedDate: "10 Apr 2026", status: "Ownership Transferred",      flag: "Approved",               days: 3, sla: 5, breached: false },
  { id: "24", assetType: "2 Wheeler", vehicleId: "VH-2024-00142", champion: "Ibrahim Ali",       hpCompletedDate: "8 Apr 2026",  status: "Ownership Transferred",      flag: "Approved",               days: 1, sla: 5, breached: false },
]

export const statusVariantMap: Record<TransferRecord["status"], "warning" | "refurb" | "success"> = {
  "Transfer In Progress":       "warning",
  "Transfer — Yet to Commence": "refurb",
  "Ownership Transferred":      "success",
}

export const flagVariantMap: Record<NonNullable<TransferRecord["flag"]>, "info" | "danger" | "success"> = {
  "Awaiting Approval":       "info",
  "Returned for Correction": "danger",
  "Approved":                "success",
}

export const isReturnedForCorrection = (r: TransferRecord) => r.flag === "Returned for Correction"
export const isAwaitingApproval = (r: TransferRecord) => r.flag === "Awaiting Approval"
export const isOwnershipTransferred = (r: TransferRecord) => r.status === "Ownership Transferred"
export const isYetToCommence = (r: TransferRecord) => r.status === "Transfer — Yet to Commence"
