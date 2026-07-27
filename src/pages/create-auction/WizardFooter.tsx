import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { AuctionStep } from "./types"

interface WizardFooterProps {
  currentStep: AuctionStep
  isNextEnabled: boolean
  isSubmitting: boolean
  onCancel: () => void
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function WizardFooter({
  currentStep,
  isNextEnabled,
  isSubmitting,
  onCancel,
  onBack,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  return (
    <div className="border-t border-divider py-4 mt-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(
            currentStep === 3 && "bg-status-danger/10 text-status-danger hover:bg-status-danger/20 border-0"
          )}
        >
          {currentStep === 3 ? "Discard" : "Cancel"}
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
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Publishing..." : "Publish Auction"}
            </Button>
          ) : (
            <Button
              className="bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!isNextEnabled}
              onClick={onNext}
            >
              {currentStep === 1 ? "Next — Assign Vehicles" : "Next — Review & Publish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
