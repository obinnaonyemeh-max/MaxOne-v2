import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/max"
import { ASSESSMENT_QUESTIONS, type AssessmentAnswers } from "./assessmentQuestions"

interface ViewAssessmentReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alertId: string
  answers: AssessmentAnswers
  imageUrl?: string
  comment?: string
}

export function ViewAssessmentReportModal({
  open,
  onOpenChange,
  alertId,
  answers,
  imageUrl,
  comment,
}: ViewAssessmentReportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <DialogTitle className="font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
              Assessment Report
            </DialogTitle>
            <DialogDescription className="mt-1 font-medium text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Submitted assessment for {alertId}.
            </DialogDescription>
          </div>
          <DialogClose className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6">
          {/* Answers */}
          <div>
            <p
              className="text-gray-400 mb-3"
              style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.6px", textTransform: "uppercase" }}
            >
              Answers
            </p>
            <div className="rounded-lg border border-gray-100 divide-y divide-gray-100">
              {ASSESSMENT_QUESTIONS.map((question, i) => {
                const value = answers[question]
                return (
                  <div key={question} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-gray-800" style={{ fontSize: "13px" }}>
                      <span className="text-gray-400 mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {question}
                    </span>
                    <StatusBadge variant={value === "yes" ? "success" : "neutral"} withDot>
                      {value === "yes" ? "Yes" : "No"}
                    </StatusBadge>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attached image */}
          {imageUrl && (
            <div>
              <p
                className="text-gray-700 mb-2"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Attached image
              </p>
              <img
                src={imageUrl}
                alt="Assessment attachment"
                className="w-full max-h-64 rounded-lg border border-gray-200 object-cover"
              />
            </div>
          )}

          {/* Comment */}
          {comment && (
            <div>
              <p
                className="text-gray-700 mb-2"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                Comment
              </p>
              <p className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">
                {comment}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
          <Button
            className="h-10 px-6 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
