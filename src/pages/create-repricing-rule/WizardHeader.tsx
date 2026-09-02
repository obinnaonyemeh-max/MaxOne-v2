import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/max"
import { STEP_TITLES, TOTAL_STEPS, type WizardStep } from "./types"

interface WizardHeaderProps {
  ruleName: string
  status: "Draft" | "Active"
  currentStep: WizardStep
  isSubmitting: boolean
  isNextEnabled: boolean
  onPrevious: () => void
  onNext: () => void
  onActivate: () => void
  onSaveDraft: () => void
  onEditTemplateValues: () => void
}

export function WizardHeader({
  ruleName,
  status,
  currentStep,
  isSubmitting,
  isNextEnabled,
  onPrevious,
  onNext,
  onActivate,
  onSaveDraft,
  onEditTemplateValues,
}: WizardHeaderProps) {
  const isLastStep = currentStep === TOTAL_STEPS

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            {ruleName || "New Repricing Rule"}
          </h1>
          <StatusBadge variant={status === "Active" ? "success" : "default"}>{status}</StatusBadge>
        </div>
        <p className="mt-0.5 text-xs font-medium text-breadcrumb-root">
          Stage {currentStep} of {TOTAL_STEPS} &middot; {STEP_TITLES[currentStep]}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
          Save Draft
        </Button>
        {currentStep > 1 && (
          <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
            Previous
          </Button>
        )}
        {currentStep > 1 && (
          <Button variant="ghost" className="text-status-info hover:text-status-info" onClick={onEditTemplateValues} disabled={isSubmitting}>
            Edit template values
          </Button>
        )}
        {isLastStep ? (
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={onActivate}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Activating..." : "Activate Rule"}
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
