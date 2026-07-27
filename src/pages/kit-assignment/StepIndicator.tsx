import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type KitAssignmentStep = 1 | 2 | 3

const steps = [
  { number: 1, label: "Vehicle / Kit" },
  { number: 2, label: "New Assignment" },
  { number: 3, label: "Confirm" },
] as const

export function StepIndicator({ currentStep }: { currentStep: KitAssignmentStep }) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto py-6">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep
        const isActive = step.number === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isCompleted && "bg-brand-primary/10",
                  isActive && "bg-brand-dark text-white",
                  !isCompleted && !isActive && "bg-gray-100 text-breadcrumb-root"
                )}
              >
                {isCompleted ? <Check className="h-3 w-3 text-brand-dark" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-brand-dark" : "text-breadcrumb-root"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-3 mb-6",
                  isCompleted ? "bg-gray-300" : "bg-gray-200"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
