import type { TimelineEntryData } from "@/components/max"

export interface SubBatch {
  id: string
  subBatchId: string
  batchId: string
  qty: number
  stage: string
  stageVariant: "success" | "warning" | "info" | "danger" | "default"
  stageHistory: TimelineEntryData[]
  createdDate: string
}

export const stageVariantMap: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  "At Port": "warning",
  "Identifier Upload": "info",
  "In Transit": "info",
  "In Production": "default",
  "Clearing": "warning",
  "Warehouse QA": "default",
  "Ready for Activation": "success",
}

const createStageHistory = (currentStage: string): TimelineEntryData[] => {
  const stages = ["In Production", "Identifier Upload", "In Transit", "At Port", "Clearing", "Warehouse QA", "Ready for Activation"]
  const currentIndex = stages.indexOf(currentStage)
  
  return stages.slice(0, currentIndex + 1).map((stage, idx) => ({
    id: `sh${idx + 1}`,
    date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx % 6]} 2026`,
    status: stage,
    statusVariant: stageVariantMap[stage] || "default",
    description: {
      template: "Sub-batch moved to {stage} stage",
      highlights: { stage },
    },
    actor: {
      action: "Updated by",
      name: "System",
    },
    duration: {
      range: `${idx * 5 + 1} - ${idx * 5 + 5} days`,
      total: "5 days",
    },
  }))
}

export function createIdentifierUploadHistory(createdDate: string): TimelineEntryData[] {
  return [
    {
      id: "sh1",
      date: createdDate,
      status: "Identifier Upload",
      statusVariant: "info",
      description: {
        template: "Sub-batch created from vehicle identifier upload",
        highlights: {},
      },
      actor: {
        action: "Created by",
        name: "System",
      },
      duration: {
        range: "—",
        total: "—",
      },
    },
  ]
}

function indexToLetters(index: number): string {
  let n = index
  let suffix = ""
  while (n >= 0) {
    suffix = String.fromCharCode(65 + (n % 26)) + suffix
    n = Math.floor(n / 26) - 1
  }
  return suffix
}

export function nextSubBatchId(batchId: string, existing: SubBatch[]): string {
  const prefix = batchId.replace(/^BATCH-/, "SB-")
  const used = new Set(
    existing
      .filter((sb) => sb.batchId === batchId)
      .map((sb) => sb.subBatchId.match(/-([A-Z]+)$/)?.[1] ?? ""),
  )

  for (let i = 0; i < 1000; i++) {
    const suffix = indexToLetters(i)
    if (!used.has(suffix)) return `${prefix}-${suffix}`
  }

  return `${prefix}-${Date.now()}`
}

export function createSubBatchFromUpload(batchId: string, qty: number, existing: SubBatch[]): SubBatch {
  const createdDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return {
    id: `sb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    subBatchId: nextSubBatchId(batchId, existing),
    batchId,
    qty,
    stage: "Identifier Upload",
    stageVariant: "info",
    stageHistory: createIdentifierUploadHistory(createdDate),
    createdDate,
  }
}

export let mockSubBatches: SubBatch[] = [
  // BATCH-12-3056 sub-batches (4)
  {
    id: "sb-1-1",
    subBatchId: "SB-12-3056-A",
    batchId: "BATCH-12-3056",
    qty: 5000,
    stage: "At Port",
    stageVariant: "warning",
    stageHistory: createStageHistory("At Port"),
    createdDate: "15 Jan 2026",
  },
  {
    id: "sb-1-2",
    subBatchId: "SB-12-3056-B",
    batchId: "BATCH-12-3056",
    qty: 5000,
    stage: "In Transit",
    stageVariant: "info",
    stageHistory: createStageHistory("In Transit"),
    createdDate: "15 Jan 2026",
  },
  {
    id: "sb-1-3",
    subBatchId: "SB-12-3056-C",
    batchId: "BATCH-12-3056",
    qty: 5000,
    stage: "Identifier Upload",
    stageVariant: "info",
    stageHistory: createStageHistory("Identifier Upload"),
    createdDate: "20 Jan 2026",
  },
  {
    id: "sb-1-4",
    subBatchId: "SB-12-3056-D",
    batchId: "BATCH-12-3056",
    qty: 5000,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "25 Jan 2026",
  },
  
  // BATCH-0990 sub-batches (2)
  {
    id: "sb-2-1",
    subBatchId: "SB-0990-A",
    batchId: "BATCH-0990",
    qty: 2500,
    stage: "Identifier Upload",
    stageVariant: "info",
    stageHistory: createStageHistory("Identifier Upload"),
    createdDate: "10 Feb 2026",
  },
  {
    id: "sb-2-2",
    subBatchId: "SB-0990-B",
    batchId: "BATCH-0990",
    qty: 2500,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "15 Feb 2026",
  },
  
  // BATCH-2026-003 sub-batches (3)
  {
    id: "sb-3-1",
    subBatchId: "SB-2026-003-A",
    batchId: "BATCH-2026-003",
    qty: 800,
    stage: "In Transit",
    stageVariant: "info",
    stageHistory: createStageHistory("In Transit"),
    createdDate: "5 Mar 2026",
  },
  {
    id: "sb-3-2",
    subBatchId: "SB-2026-003-B",
    batchId: "BATCH-2026-003",
    qty: 850,
    stage: "Identifier Upload",
    stageVariant: "info",
    stageHistory: createStageHistory("Identifier Upload"),
    createdDate: "8 Mar 2026",
  },
  {
    id: "sb-3-3",
    subBatchId: "SB-2026-003-C",
    batchId: "BATCH-2026-003",
    qty: 850,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "12 Mar 2026",
  },
  
  // BATCH-2026-002 sub-batches (1)
  {
    id: "sb-4-1",
    subBatchId: "SB-2026-002-A",
    batchId: "BATCH-2026-002",
    qty: 400,
    stage: "Ready for Activation",
    stageVariant: "success",
    stageHistory: createStageHistory("Ready for Activation"),
    createdDate: "1 Apr 2026",
  },
  
  // BATCH-2026-001 sub-batches (2)
  {
    id: "sb-5-1",
    subBatchId: "SB-2026-001-A",
    batchId: "BATCH-2026-001",
    qty: 500,
    stage: "Identifier Upload",
    stageVariant: "info",
    stageHistory: createStageHistory("Identifier Upload"),
    createdDate: "20 Apr 2026",
  },
  {
    id: "sb-5-2",
    subBatchId: "SB-2026-001-B",
    batchId: "BATCH-2026-001",
    qty: 500,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "25 Apr 2026",
  },
  
  // BATCH-2026-006 sub-batches (4)
  {
    id: "sb-6-1",
    subBatchId: "SB-2026-006-A",
    batchId: "BATCH-2026-006",
    qty: 750,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "1 May 2026",
  },
  {
    id: "sb-6-2",
    subBatchId: "SB-2026-006-B",
    batchId: "BATCH-2026-006",
    qty: 750,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "5 May 2026",
  },
  {
    id: "sb-6-3",
    subBatchId: "SB-2026-006-C",
    batchId: "BATCH-2026-006",
    qty: 750,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "10 May 2026",
  },
  {
    id: "sb-6-4",
    subBatchId: "SB-2026-006-D",
    batchId: "BATCH-2026-006",
    qty: 750,
    stage: "In Production",
    stageVariant: "default",
    stageHistory: createStageHistory("In Production"),
    createdDate: "15 May 2026",
  },
  
  // BATCH-2026-007 sub-batches (3)
  {
    id: "sb-7-1",
    subBatchId: "SB-2026-007-A",
    batchId: "BATCH-2026-007",
    qty: 500,
    stage: "Clearing",
    stageVariant: "warning",
    stageHistory: createStageHistory("Clearing"),
    createdDate: "1 Jun 2026",
  },
  {
    id: "sb-7-2",
    subBatchId: "SB-2026-007-B",
    batchId: "BATCH-2026-007",
    qty: 500,
    stage: "At Port",
    stageVariant: "warning",
    stageHistory: createStageHistory("At Port"),
    createdDate: "5 Jun 2026",
  },
  {
    id: "sb-7-3",
    subBatchId: "SB-2026-007-C",
    batchId: "BATCH-2026-007",
    qty: 500,
    stage: "In Transit",
    stageVariant: "info",
    stageHistory: createStageHistory("In Transit"),
    createdDate: "10 Jun 2026",
  },
  
  // BATCH-2026-008 sub-batches (2)
  {
    id: "sb-8-1",
    subBatchId: "SB-2026-008-A",
    batchId: "BATCH-2026-008",
    qty: 400,
    stage: "Warehouse QA",
    stageVariant: "default",
    stageHistory: createStageHistory("Warehouse QA"),
    createdDate: "15 Jun 2026",
  },
  {
    id: "sb-8-2",
    subBatchId: "SB-2026-008-B",
    batchId: "BATCH-2026-008",
    qty: 400,
    stage: "Clearing",
    stageVariant: "warning",
    stageHistory: createStageHistory("Clearing"),
    createdDate: "20 Jun 2026",
  },
]

export function getSubBatchesByBatchId(batchId: string): SubBatch[] {
  return mockSubBatches.filter(sb => sb.batchId === batchId)
}

export function getSubBatchById(subBatchId: string): SubBatch | undefined {
  return mockSubBatches.find(sb => sb.subBatchId === subBatchId)
}

export function getSubBatchByIds(batchId: string, subBatchId: string): SubBatch | undefined {
  return mockSubBatches.find(sb => sb.batchId === batchId && sb.subBatchId === subBatchId)
}
