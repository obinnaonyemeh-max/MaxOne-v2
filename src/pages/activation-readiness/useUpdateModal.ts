import { useCallback, useEffect, useRef, useState } from "react"
import type { ActivationRecord, StageStatus } from "@/data/mockActivationRecords"
import { STAGE_KEYS, type StageKey } from "./stages"

export type DraftStages = Record<StageKey, StageStatus>

export function useUpdateModal() {
  const [record, setRecord]                 = useState<ActivationRecord | null>(null)
  const [draftStages, setDraftStages]       = useState<DraftStages>({} as DraftStages)
  const [openAccordions, setOpenAccordions] = useState<Set<StageKey>>(new Set())

  const draftRef = useRef(draftStages)
  useEffect(() => { draftRef.current = draftStages }, [draftStages])

  const open = useCallback((r: ActivationRecord) => {
    setRecord(r)
    setDraftStages({
      bikeAssembly:     r.bikeAssembly,
      qualityControl:   r.qualityControl,
      paintingBranding: r.paintingBranding,
      licensingReg:     r.licensingReg,
      tracker:          r.tracker,
      insurance:        r.insurance,
    })
    setOpenAccordions(new Set(["bikeAssembly"]))
  }, [])

  const close = useCallback(() => setRecord(null), [])

  const toggleAccordion = useCallback((key: StageKey) =>
    setOpenAccordions((prev) => new Set(prev.has(key) ? [] : [key])), [])

  const setStageStatus = useCallback((key: StageKey, status: StageStatus) =>
    setDraftStages((prev) => ({ ...prev, [key]: status })), [])

  const markCompleted = useCallback((key: StageKey) => {
    const updated = { ...draftRef.current, [key]: "completed" as StageStatus }
    const currentIdx = STAGE_KEYS.indexOf(key)
    const immediateNext = STAGE_KEYS[currentIdx + 1]
    if (immediateNext && updated[immediateNext] === "blocked") {
      updated[immediateNext] = "in-progress"
    }
    const nextOpen = STAGE_KEYS.slice(currentIdx + 1).find((k) => updated[k] !== "completed")

    setDraftStages(updated)
    setOpenAccordions(new Set(nextOpen ? [nextOpen] : []))
  }, [])

  return { record, draftStages, openAccordions, open, close, toggleAccordion, setStageStatus, markCompleted }
}
