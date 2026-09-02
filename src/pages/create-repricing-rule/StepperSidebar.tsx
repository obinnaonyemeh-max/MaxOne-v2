import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEP_TITLES, TOTAL_STEPS, type WizardStep } from "./types"

const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => (i + 1) as WizardStep)

interface StepperSidebarProps {
  currentStep: WizardStep
  completedSteps: WizardStep[]
  onSelectStep: (step: WizardStep) => void
}

export function StepperSidebar({ currentStep, completedSteps, onSelectStep }: StepperSidebarProps) {
  const progress = Math.round((completedSteps.length / TOTAL_STEPS) * 100)

  return (
    <div className="w-[300px] shrink-0 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Progress</span>
          <span className="text-xs font-semibold text-sidebar-item-active">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full bg-brand-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <nav className="px-2 py-2">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step)
          const isActive = step === currentStep
          const isClickable = isCompleted || isActive
          const isLast = step === TOTAL_STEPS

          return (
            <button
              key={step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStep(step)}
              className={cn(
                "w-full flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                isActive && "bg-gray-100",
                isClickable && !isActive && "hover:bg-gray-50",
                !isClickable && "cursor-not-allowed opacity-60"
              )}
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isCompleted && "bg-brand-primary/15 text-brand-dark",
                    isActive && !isCompleted && "bg-brand-dark text-white",
                    !isActive && !isCompleted && "bg-gray-100 text-breadcrumb-root"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : step}
                </span>
                {!isLast && <span className="mt-1 h-6 w-px bg-gray-200" />}
              </div>
              <span
                className={cn(
                  "mt-0.5 text-sm font-medium leading-tight",
                  isActive ? "text-sidebar-item-active" : isCompleted ? "text-sidebar-item-active" : "text-breadcrumb-root"
                )}
              >
                {STEP_TITLES[step]}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
