import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ASSESSMENT_QUESTIONS as QUESTIONS,
  type AssessmentAnswer as Answer,
  type AssessmentAnswers,
} from "./assessmentQuestions"

// Direction-aware stack shuffle. Forward: the new card rises from the back
// position (offset/rotated/small) to the front on top, while the old one recedes
// underneath. Backward: the current card slides back onto the stack on top,
// revealing the previous card underneath.
//
// Full transform strings (same function list/order in every pose) so Motion
// keeps it on the GPU — the x/y/scale shorthands run on the main thread and drop
// frames under load (per the `animate` skill).
const CENTER_T = "translateX(0px) translateY(0px) scale(1) rotate(0deg)"
const BACK_T = "translateX(18px) translateY(12px) scale(0.9) rotate(3deg)"
const FRONT_T = "translateX(0px) translateY(-12px) scale(1.05) rotate(0deg)"

// Subtle blur at the off-centre poses (sharp at rest) blends the two overlapping
// cards into one perceived transformation during the crossfade — the standards'
// mask trick, kept well under the 20px ceiling.
const BLUR = "blur(2px)"
const SHARP = "blur(0px)"

const cardVariants = {
  initial: (d: number) =>
    d > 0
      ? { opacity: 0, transform: BACK_T, filter: BLUR, zIndex: 2 }
      : { opacity: 0, transform: FRONT_T, filter: BLUR, zIndex: 1 },
  animate: (d: number) => ({ opacity: 1, transform: CENTER_T, filter: SHARP, zIndex: d > 0 ? 2 : 1 }),
  exit: (d: number) =>
    d > 0
      ? { opacity: 0, transform: FRONT_T, filter: BLUR, zIndex: 1 }
      : { opacity: 0, transform: BACK_T, filter: BLUR, zIndex: 2 },
}

// Reduced motion: keep the crossfade, drop the transform-based movement.
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// Strong ease-in-out for on-screen morphing (from the animate skill's table).
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

interface AssessmentReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAnswers?: AssessmentAnswers
  onComplete?: (answers: AssessmentAnswers) => void
}

export function AssessmentReportModal({
  open,
  onOpenChange,
  initialAnswers,
  onComplete,
}: AssessmentReportModalProps) {
  const total = QUESTIONS.length
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  // Seed from any previously given answers so "Edit" from the summary returns
  // here with them intact. The parent remounts this modal (via key) on each open,
  // so this initializer re-runs with the latest initialAnswers.
  const [answers, setAnswers] = useState<(Answer | null)[]>(() =>
    QUESTIONS.map((q) => initialAnswers?.[q] ?? null)
  )

  const answer = answers[step]

  const reset = () => {
    setStep(0)
    setDirection(1)
    setAnswers(Array(total).fill(null))
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const setAnswer = (value: Answer) => {
    setAnswers((prev) => prev.map((a, i) => (i === step ? value : a)))
  }

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (answer == null) return
    if (step < total - 1) {
      setDirection(1)
      setStep(step + 1)
      return
    }
    const result = Object.fromEntries(
      QUESTIONS.map((q, i) => [q, answers[i] as Answer])
    ) as AssessmentAnswers
    onComplete?.(result)
    handleOpenChange(false)
  }

  const isLast = step === total - 1

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 gap-0 border-0 bg-transparent shadow-none max-w-[400px]">
        <div className="relative h-[430px]">
          {/* Card stacked behind */}
          <div className="absolute inset-0 rounded-2xl bg-white shadow-md opacity-40 rotate-3 translate-x-3 translate-y-1.5" />
          {/* Main card (animates like it's shuffled from / to the back) */}
          <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={reduceMotion ? reducedVariants : cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={reduceMotion ? { duration: 0.2, ease: "easeOut" } : { duration: 0.45, ease: EASE_IN_OUT }}
            className="absolute inset-0 flex flex-col rounded-2xl bg-white shadow-xl p-6">
          {/* Progress + close */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5">
              {QUESTIONS.map((q, i) => (
                <span
                  key={q}
                  className={cn(
                    "h-1 w-6 rounded-full transition-colors",
                    i === step ? "bg-gray-900" : i < step ? "bg-gray-400" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
            <DialogClose className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>

          {/* Question */}
          <p
            className="text-gray-400 mb-3"
            style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Question {String(step + 1).padStart(2, "0")}
          </p>
          <DialogTitle
            className="text-gray-950"
            style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1.25 }}
          >
            {QUESTIONS[step]}
          </DialogTitle>

          {/* Yes / No */}
          <p
            className="text-gray-400 mt-8 mb-3"
            style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Select only one
          </p>
          <div className="flex flex-col">
            {(["yes", "no"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAnswer(value)}
                className="flex items-center gap-3 py-2 text-left"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    answer === value ? "border-brand-dark" : "border-gray-300"
                  )}
                >
                  {answer === value && <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />}
                </span>
                <span className="text-gray-800" style={{ fontSize: "15px" }}>
                  {value === "yes" ? "Yes" : "No"}
                </span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 mt-auto pt-6">
            {step > 0 && (
              <Button variant="ghost" className="h-10 px-4" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              className="h-10 px-6 bg-brand-dark text-white hover:bg-brand-dark/90"
              onClick={handleNext}
              disabled={answer == null}
            >
              {isLast ? "Submit" : "Next"}
            </Button>
          </div>
          </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
