import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { KitAssignmentStep } from "./StepIndicator"

interface WizardFooterProps {
  currentStep: KitAssignmentStep
  isNextEnabled: boolean
  isSubmitting?: boolean
  onBack: () => void
  onNext: () => void
  onCancel: () => void
  onSubmit: () => void
}

export function WizardFooter({
  currentStep,
  isNextEnabled,
  isSubmitting = false,
  onBack,
  onNext,
  onCancel,
  onSubmit,
}: WizardFooterProps) {
  return (
    <div className="border-t border-divider py-4 mt-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
          )}

          {currentStep === 3 ? (
            <Button
              className="bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!isNextEnabled || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Assigning..." : "Assign"}
            </Button>
          ) : (
            <Button
              className="bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!isNextEnabled}
              onClick={onNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
