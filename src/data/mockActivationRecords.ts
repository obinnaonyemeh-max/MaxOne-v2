export type StageStatus = "pending" | "in-progress" | "completed" | "blocked"
export type ReadyStatus = "Ready" | "Flagged" | null

export type ActivationStageKey =
  | "bikeAssembly"
  | "qualityControl"
  | "paintingBranding"
  | "licensingReg"
  | "tracker"
  | "insurance"

export interface StageSlaTimes {
  startedAt?: string
  completedAt?: string
}

export interface ActivationRecord {
  id: string
  chassis: string
  subBatch: string
  location: string
  bikeAssembly: StageStatus
  qualityControl: StageStatus
  paintingBranding: StageStatus
  licensingReg: StageStatus
  tracker: StageStatus
  insurance: StageStatus
  ready: ReadyStatus
  /** Set when a user starts or completes a stage, used for SLA tracking. */
  stageSla?: Partial<Record<ActivationStageKey, StageSlaTimes>>
}

export const mockActivationRecords: ActivationRecord[] = [
  { id: "1",  chassis: "HTGYU3994",   subBatch: "BTC34578TH", location: "Ikeja", bikeAssembly: "pending",     qualityControl: "blocked",     paintingBranding: "blocked",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "2",  chassis: "CHS3847JKL",  subBatch: "BTC34578TH", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "pending",     paintingBranding: "blocked",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "3",  chassis: "VHX9901MNA",  subBatch: "BTC34578TH", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "pending",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "4",  chassis: "ZZK4421BRT",  subBatch: "BTC34578TH", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "completed",   licensingReg: "completed",   tracker: "pending",     insurance: "blocked",     ready: null     },
  { id: "5",  chassis: "LMQ77520PQ",  subBatch: "BTC34578TH", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "completed",   licensingReg: "completed",   tracker: "completed",   insurance: "completed",   ready: "Ready"  },
  { id: "6",  chassis: "EVKN001XYZ",  subBatch: "BTC29113KN", location: "Ikeja", bikeAssembly: "pending",     qualityControl: "blocked",     paintingBranding: "blocked",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "7",  chassis: "EVKN002ABC",  subBatch: "BTC29113KN", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "pending",     paintingBranding: "blocked",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "8",  chassis: "EVKN003DEF",  subBatch: "BTC29113KN", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "completed",   licensingReg: "pending",     tracker: "blocked",     insurance: "blocked",     ready: null     },
  { id: "9",  chassis: "EVKN004GHI",  subBatch: "BTC29113KN", location: "Ikeja", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "completed",   licensingReg: "completed",   tracker: "completed",   insurance: "completed",   ready: "Ready"  },
  { id: "10", chassis: "AB001RTY",    subBatch: "BTC41002AB", location: "Accra", bikeAssembly: "pending",     qualityControl: "blocked",     paintingBranding: "blocked",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: "Flagged"},
  { id: "11", chassis: "AB002UVW",    subBatch: "BTC41002AB", location: "Accra", bikeAssembly: "completed",   qualityControl: "completed",   paintingBranding: "pending",     licensingReg: "blocked",     tracker: "blocked",     insurance: "blocked",     ready: null     },
]

export const stageStatusVariantMap: Record<StageStatus, "success" | "danger" | "warning" | "default"> = {
  "completed":  "success",
  "in-progress": "warning",
  "blocked":    "danger",
  "pending":    "default",
}

export const uniqueSubBatches = [...new Set(mockActivationRecords.map((r) => r.subBatch))]
