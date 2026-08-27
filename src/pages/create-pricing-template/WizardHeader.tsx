import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/max"
import { STAGE_TITLES, TOTAL_STAGES, type WizardStage } from "./types"

interface WizardHeaderProps {
  templateName: string
  status: "Draft" | "Active"
  currentStage: WizardStage
  isSubmitting: boolean
  isNextEnabled: boolean
  onPrevious: () => void
  onNext: () => void
  onPublish: () => void
  onSaveDraft: () => void
}

export function WizardHeader({
  templateName,
  status,
  currentStage,
  isSubmitting,
  isNextEnabled,
  onPrevious,
  onNext,
  onPublish,
  onSaveDraft,
}: WizardHeaderProps) {
  const isLastStage = currentStage === TOTAL_STAGES

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            {templateName || "New Pricing Template"}
          </h1>
          <StatusBadge variant={status === "Active" ? "success" : "default"}>{status}</StatusBadge>
        </div>
        <p className="mt-0.5 text-xs font-medium text-breadcrumb-root">
          Stage {currentStage} of {TOTAL_STAGES} &middot; {STAGE_TITLES[currentStage]}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
          Save Draft
        </Button>
        {currentStage > 1 && (
          <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
            Previous
          </Button>
        )}
        {isLastStage ? (
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={onPublish}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Template"}
          </Button>
        ) : (
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={onNext}
            disabled={!isNextEnabled}
          >
            Next Stage
          </Button>
        )}
      </div>
    </div>
  )
}
