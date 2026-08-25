import { useState } from "react"
import { X, ImagePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/max"
import { DocUpload } from "@/components/max/DocUpload"
import { ASSESSMENT_QUESTIONS, type AssessmentAnswers } from "./assessmentQuestions"

interface AssessmentSummaryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alertId: string
  answers: AssessmentAnswers
  onEdit: () => void
  onSubmit: (payload: { image: File | null; comment: string }) => void
}

export function AssessmentSummaryModal({
  open,
  onOpenChange,
  alertId,
  answers,
  onEdit,
  onSubmit,
}: AssessmentSummaryModalProps) {
  const [image, setImage] = useState<File | null>(null)
  const [comment, setComment] = useState("")

  const reset = () => {
    setImage(null)
    setComment("")
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const handleEdit = () => {
    reset()
    onEdit()
  }

  const handleSubmit = () => {
    onSubmit({ image, comment })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <DialogTitle className="font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
              Assessment Report
            </DialogTitle>
            <DialogDescription className="mt-1 font-medium text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Review the answers and add supporting evidence for {alertId}.
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

          {/* Image upload (optional) */}
          <div>
            <p
              className="text-gray-700 mb-2"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              Attach image <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            <DocUpload
              uploadedFile={image}
              onFileSelect={setImage}
              accept="image/*"
              maxSizeLabel="PNG, JPG up to 10MB"
              label="Drag and drop an image, or click to browse"
              icon={<ImagePlus className="mx-auto h-7 w-7 text-gray-400 mb-2" />}
            />
          </div>

          {/* Comment (optional) */}
          <div>
            <p
              className="text-gray-700 mb-2"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              Comment <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any observations or notes about the recovery..."
              className="min-h-[90px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <Button variant="ghost" className="h-10 px-4" onClick={handleEdit}>
            Edit
          </Button>
          <Button
            className="h-10 px-6 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={handleSubmit}
          >
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
