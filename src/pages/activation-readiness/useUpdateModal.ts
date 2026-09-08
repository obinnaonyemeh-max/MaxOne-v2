import { useCallback, useEffect, useRef, useState } from "react"
import type { ActivationRecord, StageSlaTimes, StageStatus } from "@/data/mockActivationRecords"
import { STAGE_KEYS, type StageKey } from "./stages"

export type DraftStages = Record<StageKey, StageStatus>
export type DraftStageSla = Partial<Record<StageKey, StageSlaTimes>>

function toRecord(base: ActivationRecord, stages: DraftStages, sla: DraftStageSla): ActivationRecord {
  const allDone = STAGE_KEYS.every((key) => stages[key] === "completed")
  return {
    ...base,
    ...stages,
    stageSla: sla,
    ready: allDone ? "Ready" : base.ready,
  }
}

function firstActionableStage(stages: DraftStages): StageKey | undefined {
  return STAGE_KEYS.find((k) => stages[k] !== "completed" && stages[k] !== "blocked")
}

export function useUpdateModal(onPersist?: (record: ActivationRecord) => void) {
  const [record, setRecord]                 = useState<ActivationRecord | null>(null)
  const [draftStages, setDraftStages]       = useState<DraftStages>({} as DraftStages)
  const [stageSla, setStageSla]             = useState<DraftStageSla>({})
  const [openAccordions, setOpenAccordions] = useState<Set<StageKey>>(new Set())

  const draftRef = useRef(draftStages)
  const slaRef   = useRef(stageSla)
  const persistRef = useRef(onPersist)
  useEffect(() => { draftRef.current = draftStages }, [draftStages])
  useEffect(() => { slaRef.current = stageSla }, [stageSla])
  useEffect(() => { persistRef.current = onPersist }, [onPersist])

  const commit = useCallback((nextStages: DraftStages, nextSla: DraftStageSla) => {
    setDraftStages(nextStages)
    setStageSla(nextSla)
    setRecord((prev) => {
      if (!prev) return prev
      const updated = toRecord(prev, nextStages, nextSla)
      persistRef.current?.(updated)
      return updated
    })
  }, [])

  const open = useCallback((r: ActivationRecord) => {
    const stages: DraftStages = {
      bikeAssembly:     r.bikeAssembly,
      qualityControl:   r.qualityControl,
      paintingBranding: r.paintingBranding,
      licensingReg:     r.licensingReg,
      tracker:          r.tracker,
      insurance:        r.insurance,
    }
    setRecord(r)
    setDraftStages(stages)
    setStageSla(r.stageSla ?? {})
    const firstOpen = firstActionableStage(stages)
    setOpenAccordions(new Set(firstOpen ? [firstOpen] : []))
  }, [])

  const close = useCallback(() => setRecord(null), [])

  const toggleAccordion = useCallback((key: StageKey) =>
    setOpenAccordions((prev) => new Set(prev.has(key) ? [] : [key])), [])

  const setStageStatus = useCallback((key: StageKey, status: StageStatus) => {
    const updated = { ...draftRef.current, [key]: status }
    commit(updated, slaRef.current)
  }, [commit])

  const startStage = useCallback((key: StageKey) => {
    const now = new Date().toISOString()
    const prevSla = slaRef.current[key]
    if (prevSla?.startedAt) return

    const updatedStages: DraftStages = { ...draftRef.current, [key]: "in-progress" }
    const updatedSla: DraftStageSla = {
      ...slaRef.current,
      [key]: { ...prevSla, startedAt: now },
    }
    commit(updatedStages, updatedSla)
  }, [commit])

  const markCompleted = useCallback((key: StageKey) => {
    const now = new Date().toISOString()
    const updated: DraftStages = { ...draftRef.current, [key]: "completed" }
    const currentIdx = STAGE_KEYS.indexOf(key)
    const immediateNext = STAGE_KEYS[currentIdx + 1]
    if (immediateNext && updated[immediateNext] === "blocked") {
      updated[immediateNext] = "pending"
    }
    const nextOpen = STAGE_KEYS.slice(currentIdx + 1).find((k) => updated[k] !== "completed")
    const prevSla = slaRef.current[key]
    const updatedSla: DraftStageSla = {
      ...slaRef.current,
      [key]: { ...prevSla, startedAt: prevSla?.startedAt, completedAt: now },
    }

    commit(updated, updatedSla)
    setOpenAccordions(new Set(nextOpen ? [nextOpen] : []))
  }, [commit])

  return {
    record,
    draftStages,
    stageSla,
    openAccordions,
    open,
    close,
    toggleAccordion,
    setStageStatus,
    startStage,
    markCompleted,
  }
}
