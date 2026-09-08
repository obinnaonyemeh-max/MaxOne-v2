import type { ActivationStageKey } from "@/data/mockActivationRecords"

export type StageKey = ActivationStageKey

export const STAGES: { key: StageKey; label: string }[] = [
  { key: "bikeAssembly",     label: "Bike Assembly"        },
  { key: "qualityControl",   label: "Quality Control"      },
  { key: "paintingBranding", label: "Painting & Branding"  },
  { key: "licensingReg",     label: "Licensing & Reg."     },
  { key: "tracker",          label: "Tracker Installation" },
  { key: "insurance",        label: "Insurance"            },
]

export const STAGE_KEYS = STAGES.map((s) => s.key)
