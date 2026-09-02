// Mock data for Portfolio Ops > WO Recovery.
// A write-off batch is a master-wallet write-off sheet submitted for provisioning
// and approval — a CSV/XLSX of contracts to write off, plus the total provision
// amount and contract count declared at submission time.

export type WriteOffStatus = "Approved" | "Rejected" | "Pending"

export interface WriteOffBatch {
  id: string
  /** Format: WO-MASTERWALLET-YYYYMMDD-XXX */
  referenceId: string
  submittedBy: string
  provisionAmount: number
  numberOfContracts: number
  /** ISO datetime string */
  dateAdded: string
  status: WriteOffStatus
  fileName: string
}

export const writeOffStatusVariantMap: Record<WriteOffStatus, "success" | "danger" | "warning"> = {
  Approved: "success",
  Rejected: "danger",
  Pending: "warning",
}

export const mockWriteOffBatches: WriteOffBatch[] = [
  {
    id: "1",
    referenceId: "WO-MASTERWALLET-20260622-001",
    submittedBy: "Chidinma Okafor",
    provisionAmount: 199443393.90,
    numberOfContracts: 214,
    dateAdded: "2026-06-22T11:50:00",
    status: "Approved",
    fileName: "write-off-batch-001.csv",
  },
  {
    id: "2",
    referenceId: "WO-MASTERWALLET-20260619-004",
    submittedBy: "Tunde Bakare",
    provisionAmount: 87250000.00,
    numberOfContracts: 96,
    dateAdded: "2026-06-19T09:12:00",
    status: "Pending",
    fileName: "wo_recovery_batch4.xlsx",
  },
  {
    id: "3",
    referenceId: "WO-MASTERWALLET-20260615-002",
    submittedBy: "Amaka Eze",
    provisionAmount: 312980500.75,
    numberOfContracts: 341,
    dateAdded: "2026-06-15T14:35:00",
    status: "Rejected",
    fileName: "masterwallet-writeoffs-june.csv",
  },
  {
    id: "4",
    referenceId: "WO-MASTERWALLET-20260610-003",
    submittedBy: "Emeka Nwosu",
    provisionAmount: 54120750.20,
    numberOfContracts: 58,
    dateAdded: "2026-06-10T08:02:00",
    status: "Approved",
    fileName: "wo-batch-june-03.csv",
  },
  {
    id: "5",
    referenceId: "WO-MASTERWALLET-20260605-007",
    submittedBy: "Funmilayo Adebayo",
    provisionAmount: 145630200.00,
    numberOfContracts: 160,
    dateAdded: "2026-06-05T16:48:00",
    status: "Pending",
    fileName: "write_off_sheet_07.xlsx",
  },
  {
    id: "6",
    referenceId: "WO-MASTERWALLET-20260528-005",
    submittedBy: "Ibrahim Musa",
    provisionAmount: 203445000.50,
    numberOfContracts: 225,
    dateAdded: "2026-05-28T10:20:00",
    status: "Approved",
    fileName: "wo-recovery-may-05.csv",
  },
  {
    id: "7",
    referenceId: "WO-MASTERWALLET-20260520-006",
    submittedBy: "Ngozi Umeh",
    provisionAmount: 68990300.10,
    numberOfContracts: 74,
    dateAdded: "2026-05-20T13:05:00",
    status: "Rejected",
    fileName: "batch06-writeoffs.xlsx",
  },
  {
    id: "8",
    referenceId: "WO-MASTERWALLET-20260512-009",
    submittedBy: "Segun Adeyemi",
    provisionAmount: 121880000.00,
    numberOfContracts: 132,
    dateAdded: "2026-05-12T15:40:00",
    status: "Approved",
    fileName: "wo-batch-09.csv",
  },
  {
    id: "9",
    referenceId: "WO-MASTERWALLET-20260505-008",
    submittedBy: "Halima Yusuf",
    provisionAmount: 39215600.60,
    numberOfContracts: 41,
    dateAdded: "2026-05-05T09:55:00",
    status: "Pending",
    fileName: "may-writeoff-batch08.xlsx",
  },
  {
    id: "10",
    referenceId: "WO-MASTERWALLET-20260428-010",
    submittedBy: "Chukwuemeka Obi",
    provisionAmount: 176305400.30,
    numberOfContracts: 190,
    dateAdded: "2026-04-28T12:15:00",
    status: "Approved",
    fileName: "wo-recovery-april-10.csv",
  },
]
