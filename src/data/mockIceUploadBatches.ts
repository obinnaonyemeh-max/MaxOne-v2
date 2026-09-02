// Mock data for the ICE Repricing tab's bulk-upload history log — every manual CSV/XLSX
// batch submitted for ICE contract repricing.

export type IceUploadStatus = "Completed" | "Processing" | "Failed"

export interface IceUploadBatch {
  id: string
  /** Format: UP-ICE-YYYYMMDD-XX */
  batchId: string
  /** ISO datetime */
  uploadedAt: string
  uploadedBy: string
  records: number
  status: IceUploadStatus
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const iceUploadStatusVariantMap: Record<IceUploadStatus, BadgeVariant> = {
  Completed: "success",
  Processing: "info",
  Failed: "danger",
}

export const mockIceUploadBatches: IceUploadBatch[] = [
  {
    id: "1",
    batchId: "UP-ICE-20260828-01",
    uploadedAt: "2026-08-28T09:15:00",
    uploadedBy: "Desmond Nsogbuwa",
    records: 42,
    status: "Completed",
  },
  {
    id: "2",
    batchId: "UP-ICE-20260825-03",
    uploadedAt: "2026-08-25T14:02:00",
    uploadedBy: "Amara Nwachukwu",
    records: 18,
    status: "Completed",
  },
  {
    id: "3",
    batchId: "UP-ICE-20260821-02",
    uploadedAt: "2026-08-21T11:40:00",
    uploadedBy: "Tunde Balogun",
    records: 27,
    status: "Failed",
  },
  {
    id: "4",
    batchId: "UP-ICE-20260818-01",
    uploadedAt: "2026-08-18T16:22:00",
    uploadedBy: "Desmond Nsogbuwa",
    records: 35,
    status: "Completed",
  },
  {
    id: "5",
    batchId: "UP-ICE-20260812-04",
    uploadedAt: "2026-08-12T08:55:00",
    uploadedBy: "Grace Adeboye",
    records: 12,
    status: "Completed",
  },
  {
    id: "6",
    batchId: "UP-ICE-20260805-02",
    uploadedAt: "2026-08-05T13:10:00",
    uploadedBy: "Musa Garba",
    records: 21,
    status: "Completed",
  },
]
