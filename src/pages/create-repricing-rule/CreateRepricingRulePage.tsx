import { useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { TopBar } from "@/components/max"
import { addRepricingRule, mockRepricingRules } from "@/data/mockRepricingEngine"
import { StepperSidebar } from "./StepperSidebar"
import { WizardHeader } from "./WizardHeader"
import { recoveryRulesAreComplete } from "./calculations"
import { buildRepricingRuleFromWizard } from "./buildRule"
import { Step1RuleDetails } from "./steps/Step1RuleDetails"
import { Step2ContractEligibility } from "./steps/Step2ContractEligibility"
import { Step3RecoveryRules } from "./steps/Step3RecoveryRules"
import { Step4NewInvestmentRules } from "./steps/Step4NewInvestmentRules"
import { Step5CommercialAssumptions } from "./steps/Step5CommercialAssumptions"
import { Step6PricingConstraints } from "./steps/Step6PricingConstraints"
import { Step7RepricedIncomeStatement } from "./steps/Step7RepricedIncomeStatement"
import { Step8ReviewActivate } from "./steps/Step8ReviewActivate"
import { initialWizardState, wizardReducer, TOTAL_STEPS, type WizardState, type WizardStep } from "./types"

const REPRICING_ENGINE_ROUTE = "/portfolio/products-pricing/repricing-engine"

function isStepValid(step: WizardStep, state: WizardState): boolean {
  if (step === 1) {
    return (
      state.ruleName.trim() !== "" &&
      state.country !== "" &&
      state.vehicleType !== "" &&
      state.vehicleModel !== "" &&
      state.effectiveDate !== undefined
    )
  }
  if (step === 2) {
    return state.processStages.size > 0 && state.refurbishmentStatuses.size > 0 && state.vehicleTypeEligibility.size > 0
  }
  if (step === 3) {
    return recoveryRulesAreComplete(state)
  }
  return true
}

export default function CreateRepricingRulePage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isNextEnabled = isStepValid(state.currentStep, state)

  const handleNext = () => {
    if (!isNextEnabled) return
    dispatch({ type: "MARK_COMPLETE", step: state.currentStep })
    if (state.currentStep < TOTAL_STEPS) {
      dispatch({ type: "SET_STEP", step: (state.currentStep + 1) as WizardStep })
    }
  }

  const handleBack = () => {
    if (state.currentStep > 1) {
      dispatch({ type: "SET_STEP", step: (state.currentStep - 1) as WizardStep })
    }
  }

  const handleSelectStep = (step: WizardStep) => {
    dispatch({ type: "SET_STEP", step })
  }

  const handleEditTemplateValues = () => {
    dispatch({ type: "SET_STEP", step: 1 })
  }

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: `${state.ruleName || "Untitled rule"} has been saved as a draft.`,
    })
  }

  const handleActivate = () => {
    const auditPassed = isStepValid(1, state) && isStepValid(2, state) && isStepValid(3, state)
    if (!auditPassed) {
      toast.error("Fix the required fields before activating", {
        description: "Check Rule Details, Contract Eligibility and Recovery Rules.",
      })
      const failingStep: WizardStep = !isStepValid(1, state) ? 1 : !isStepValid(2, state) ? 2 : 3
      dispatch({ type: "SET_STEP", step: failingStep })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const existingActiveRule = mockRepricingRules.find(
        (r) => r.status === "Active" && r.country === state.country && r.vehicleType === state.vehicleType
      )
      if (existingActiveRule) {
        existingActiveRule.status = "Inactive"
      }

      const nextSeq = mockRepricingRules.length + 1
      const code = `RR-${String(nextSeq).padStart(3, "0")}`
      const rule = buildRepricingRuleFromWizard(`rr-custom-${nextSeq}`, code, state, "Active")
      addRepricingRule(rule)

      setIsSubmitting(false)
      toast.success("Repricing rule activated", {
        description: `${rule.name} is now the active rule for ${rule.country} · ${rule.vehicleType}.`,
      })
      navigate(`${REPRICING_ENGINE_ROUTE}?tab=rules`)
    }, 1000)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Dynamic Repricing Engine", href: REPRICING_ENGINE_ROUTE },
          { label: "Create Rule" },
        ]}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <WizardHeader
          ruleName={state.ruleName}
          status={state.status}
          currentStep={state.currentStep}
          isSubmitting={isSubmitting}
          isNextEnabled={isNextEnabled}
          onPrevious={handleBack}
          onNext={handleNext}
          onActivate={handleActivate}
          onSaveDraft={handleSaveDraft}
          onEditTemplateValues={handleEditTemplateValues}
        />

        <div className="flex-1 min-h-0 flex">
          <StepperSidebar currentStep={state.currentStep} completedSteps={state.completedSteps} onSelectStep={handleSelectStep} />

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {state.currentStep === 1 && <Step1RuleDetails values={state} dispatch={dispatch} />}
              {state.currentStep === 2 && <Step2ContractEligibility values={state} dispatch={dispatch} />}
              {state.currentStep === 3 && <Step3RecoveryRules values={state} dispatch={dispatch} />}
              {state.currentStep === 4 && <Step4NewInvestmentRules values={state} dispatch={dispatch} />}
              {state.currentStep === 5 && <Step5CommercialAssumptions values={state} dispatch={dispatch} />}
              {state.currentStep === 6 && <Step6PricingConstraints values={state} dispatch={dispatch} />}
              {state.currentStep === 7 && <Step7RepricedIncomeStatement values={state} />}
              {state.currentStep === 8 && <Step8ReviewActivate values={state} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
