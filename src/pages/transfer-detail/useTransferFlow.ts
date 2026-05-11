import { useState } from "react"

export type FlowKind = "submit" | "approve" | "reject"
export type FlowStep = "confirm" | "submitting" | "submitted"

export interface FlowState {
  kind: FlowKind
  step: FlowStep
}

export function useTransferFlow() {
  const [flow, setFlow] = useState<FlowState | null>(null)

  const start = (kind: FlowKind) => setFlow({ kind, step: "confirm" })
  const close = () => setFlow(null)

  const run = (kind: FlowKind) => {
    setFlow({ kind, step: "submitting" })
    setTimeout(() => setFlow({ kind, step: "submitted" }), 2000)
  }

  const is = (kind: FlowKind, step: FlowStep) =>
    flow?.kind === kind && flow.step === step

  return { flow, start, close, run, is }
}
