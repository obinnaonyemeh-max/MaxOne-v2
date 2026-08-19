import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Check, X, Loader2 } from "lucide-react"
import { Modal } from "@/components/max"
import { cn } from "@/lib/utils"

type StepStatus = "pending" | "loading" | "success" | "fail"
type Phase = "running" | "failed" | "done"

const STEPS = [
  { key: "external", label: "External Voltage Connected", failLabel: "External Voltage Not Connected" },
  { key: "internal", label: "Internal Voltage Restored", failLabel: "Internal Voltage Not Restored" },
  { key: "heartbeat", label: "Heart Beat Received", failLabel: "Heart Beat Not Received" },
] as const

// The heartbeat check fails on the first attempt to demo the retry path, then
// succeeds on retry. Set to null for an always-successful run.
const FAIL_STEP = 2

const STEP_MS = 1400 // simulated ping/verify time per check
const LINE_MS = 350 // connector draw

const EASE_OUT = [0.23, 1, 0.32, 1] as const // strong ease-out (animate skill)

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

interface PingResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewDetails: () => void
  onResolve: () => void
}

export function PingResultModal({ open, onOpenChange, onViewDetails, onResolve }: PingResultModalProps) {
  const reduceMotion = useReducedMotion()
  const [statuses, setStatuses] = useState<StepStatus[]>(["pending", "pending", "pending"])
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false])
  const [connectors, setConnectors] = useState<boolean[]>([false, false])
  const [phase, setPhase] = useState<Phase>("running")

  const runIdRef = useRef(0)
  const attemptRef = useRef(0)
  const failedStepRef = useRef<number | null>(null)

  const updateStatus = (i: number, s: StepStatus) =>
    setStatuses((prev) => prev.map((v, idx) => (idx === i ? s : v)))
  const revealStep = (i: number) =>
    setRevealed((prev) => prev.map((v, idx) => (idx === i ? true : v)))
  const drawConnector = (i: number) =>
    setConnectors((prev) => prev.map((v, idx) => (idx === i ? true : v)))

  const runFrom = useCallback(async (start: number, runId: number) => {
    for (let i = start; i < STEPS.length; i++) {
      if (i > 0) {
        drawConnector(i - 1)
        await sleep(LINE_MS)
        if (runIdRef.current !== runId) return
      }
      revealStep(i)
      updateStatus(i, "loading")
      await sleep(STEP_MS)
      if (runIdRef.current !== runId) return

      const willFail = i === FAIL_STEP && attemptRef.current === 0
      if (willFail) {
        updateStatus(i, "fail")
        failedStepRef.current = i
        setPhase("failed")
        return
      }
      updateStatus(i, "success")
    }
    setPhase("done")
  }, [])

  // The modal is remounted (via key) each time it opens, so state starts fresh
  // from the initializers above — no reset needed. Defer the kick-off out of the
  // effect body so we never setState synchronously inside the effect.
  useEffect(() => {
    if (!open) return
    const runId = ++runIdRef.current
    const t = setTimeout(() => runFrom(0, runId), 0)
    return () => {
      clearTimeout(t)
      runIdRef.current += 1
    }
  }, [open, runFrom])

  const handleRetry = () => {
    const from = failedStepRef.current
    if (from == null) return
    attemptRef.current += 1
    updateStatus(from, "loading")
    setPhase("running")
    const runId = ++runIdRef.current
    runFrom(from, runId)
  }

  const handleResolve = () => {
    onOpenChange(false)
    onResolve()
  }

  const handleViewDetails = () => {
    onViewDetails()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ping Result"
      className="max-w-md"
      leftAction={
        phase === "running" ? (
          <span className="text-sm text-gray-400">Pinging device…</span>
        ) : undefined
      }
      secondaryAction={
        phase === "done" ? { label: "View details", onClick: handleViewDetails } : undefined
      }
      primaryAction={
        phase === "failed"
          ? { label: "Retry", onClick: handleRetry }
          : phase === "done"
            ? { label: "Resolve tamper", onClick: handleResolve }
            : undefined
      }
    >
      <div className="py-1">
        {STEPS.map((step, i) => {
          const status = statuses[i]
          const isFail = status === "fail"
          const isSuccess = status === "success"
          const isLoading = status === "loading"
          const nextStatus = statuses[i + 1]

          return (
            <div key={step.key}>
              {revealed[i] && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <StepIcon status={status} reduceMotion={!!reduceMotion} />
                  <span
                    className={cn(
                      "font-semibold transition-colors",
                      isSuccess && "text-status-success",
                      isFail && "text-status-danger",
                      (isLoading || status === "pending") && "text-gray-400"
                    )}
                    style={{ fontSize: "14px" }}
                  >
                    {isFail ? step.failLabel : step.label}
                  </span>
                </motion.div>
              )}

              {/* Connector to the next step */}
              {i < STEPS.length - 1 && connectors[i] && (
                <div className="ml-[13px] h-5 w-0.5 overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full w-full origin-top",
                      nextStatus === "fail" ? "bg-status-danger" : "bg-status-success"
                    )}
                    initial={reduceMotion ? { opacity: 0 } : { transform: "scaleY(0)" }}
                    animate={reduceMotion ? { opacity: 1 } : { transform: "scaleY(1)" }}
                    transition={{ duration: LINE_MS / 1000, ease: EASE_OUT }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

function StepIcon({ status, reduceMotion }: { status: StepStatus; reduceMotion: boolean }) {
  if (status === "loading" || status === "pending") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
      </span>
    )
  }

  const isSuccess = status === "success"
  return (
    <motion.span
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full text-white",
        isSuccess ? "bg-status-success" : "bg-status-danger"
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "scale(0.6)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={reduceMotion ? { duration: 0.15 } : { type: "spring", duration: 0.4, bounce: 0.35 }}
    >
      {isSuccess ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </motion.span>
  )
}
