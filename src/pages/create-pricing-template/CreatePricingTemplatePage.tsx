import { useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { TopBar } from "@/components/max"
import { mockPricingTemplates, addPricingTemplate } from "@/data/mockPricingTemplates"
import { StepperSidebar } from "./StepperSidebar"
import { WizardHeader } from "./WizardHeader"
import { CostCategoryStage } from "./CostCategoryStage"
import { FieldGrid } from "./FieldGrid"
import {
  commercialAssumptionsFields,
  maxAdvantageCostFields,
  marginTargetFields,
  onboardingCostFields,
  operationalCostFields,
  salesMarketingCostFields,
  vehiclePurchaseCostFields,
} from "./stageFieldConfigs"
import { Stage1TemplateDetails } from "./stages/Stage1TemplateDetails"
import { Stage4FundingAssumptions } from "./stages/Stage4FundingAssumptions"
import { Stage9RiskContingencyCosts } from "./stages/Stage9RiskContingencyCosts"
import { Stage11Summary } from "./stages/Stage11Summary"
import { buildPricingTemplateFromWizard } from "./buildTemplate"
import {
  fundingMixIsValid,
  hmoAutoComputed,
  totalMaxAdvantageCosts,
  totalOnboardingCosts,
  totalOperationalCosts,
  totalSalesMarketingCosts,
  totalVehiclePurchaseCost,
  vatAutoComputed,
} from "./calculations"
import { initialWizardState, wizardReducer, TOTAL_STAGES, type WizardStage, type WizardState } from "./types"

const PRICING_TEMPLATES_LIST_ROUTE = "/portfolio/pricing-configuration/templates"

function isStageValid(stage: WizardStage, state: WizardState): boolean {
  if (stage === 1) {
    return (
      state.templateName.trim() !== "" &&
      state.templateCode.trim() !== "" &&
      state.productType !== "" &&
      state.vehicleTypePrimary !== "" &&
      state.vehicleTypeSubtype !== "" &&
      state.currency !== "" &&
      state.effectiveDate !== undefined
    )
  }
  if (stage === 4) {
    return fundingMixIsValid(state)
  }
  return true
}

export default function CreatePricingTemplatePage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isNextEnabled = isStageValid(state.currentStage, state)

  const handleNext = () => {
    if (!isNextEnabled) return
    dispatch({ type: "MARK_COMPLETE", stage: state.currentStage })
    if (state.currentStage < TOTAL_STAGES) {
      dispatch({ type: "SET_STAGE", stage: (state.currentStage + 1) as WizardStage })
    }
  }

  const handlePrevious = () => {
    if (state.currentStage > 1) {
      dispatch({ type: "SET_STAGE", stage: (state.currentStage - 1) as WizardStage })
    }
  }

  const handleSelectStage = (stage: WizardStage) => {
    dispatch({ type: "SET_STAGE", stage })
  }

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: `${state.templateName || "Untitled template"} has been saved as a draft.`,
    })
  }

  const handlePublish = () => {
    const auditPassed = isStageValid(1, state) && isStageValid(4, state)
    if (!auditPassed) {
      toast.error("Fix the audit check before publishing", {
        description: "Check Template Details and Funding Assumptions on the Summary stage.",
      })
      dispatch({ type: "SET_STAGE", stage: 11 })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const nextSeq = mockPricingTemplates.length + 1
      const template = buildPricingTemplateFromWizard(`tpl-custom-${nextSeq}`, { ...state, status: "Active" })
      addPricingTemplate(template)
      setIsSubmitting(false)
      toast.success("Pricing template published", {
        description: `${template.name} is now available when creating pricing batches.`,
      })
      navigate(PRICING_TEMPLATES_LIST_ROUTE)
    }, 1000)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Pricing Templates", href: PRICING_TEMPLATES_LIST_ROUTE },
          { label: "New" },
        ]}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <WizardHeader
          templateName={state.templateName}
          status={state.status}
          currentStage={state.currentStage}
          isSubmitting={isSubmitting}
          isNextEnabled={isNextEnabled}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
        />

        <div className="flex-1 min-h-0 flex">
          <StepperSidebar currentStage={state.currentStage} completedStages={state.completedStages} onSelectStage={handleSelectStage} />

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {state.currentStage === 1 && <Stage1TemplateDetails values={state} dispatch={dispatch} />}

              {state.currentStage === 2 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <p className="mb-4 text-sm font-medium text-breadcrumb-root">
                    Baseline tenor, collection and rate assumptions that drive every downstream calculation.
                  </p>
                  <FieldGrid fields={commercialAssumptionsFields} values={state} dispatch={dispatch} />
                </div>
              )}

              {state.currentStage === 3 && (
                <CostCategoryStage
                  title="Vehicle Purchase Cost"
                  description="Per-unit acquisition cost — the basis for the risk, funding and margin calculations later in this wizard."
                  fields={vehiclePurchaseCostFields}
                  values={state}
                  dispatch={dispatch}
                  total={totalVehiclePurchaseCost(state)}
                  totalLabel="Total Vehicle Purchase Cost"
                />
              )}

              {state.currentStage === 4 && <Stage4FundingAssumptions values={state} dispatch={dispatch} />}

              {state.currentStage === 5 && (
                <CostCategoryStage
                  title="Onboarding Costs"
                  description="One-time per-unit costs incurred while activating a champion on this vehicle."
                  fields={onboardingCostFields}
                  values={state}
                  dispatch={dispatch}
                  total={totalOnboardingCosts(state)}
                  totalLabel="Total Onboarding Costs"
                />
              )}

              {state.currentStage === 6 && (
                <CostCategoryStage
                  title="Operational Costs"
                  description="Recurring operational overhead attributable to this vehicle over its tenor."
                  fields={operationalCostFields}
                  values={state}
                  dispatch={dispatch}
                  total={totalOperationalCosts(state)}
                  totalLabel="Total Operational Costs"
                  autoBadge={{
                    label: "VAT (Auto-Computed)",
                    value: vatAutoComputed(state),
                    formula: "7.5% × (Estimated Revenue − Vehicle Purchase Cost)",
                  }}
                />
              )}

              {state.currentStage === 7 && (
                <CostCategoryStage
                  title="MAX Advantage Costs"
                  description="Champion welfare benefits bundled into this pricing template."
                  fields={maxAdvantageCostFields}
                  values={state}
                  dispatch={dispatch}
                  total={totalMaxAdvantageCosts(state)}
                  totalLabel="Total MAX Advantage Costs"
                  autoBadge={{
                    label: "HMO (Auto-Computed)",
                    value: hmoAutoComputed(state),
                    formula: "Monthly HMO Value × Base Tenor (months)",
                  }}
                />
              )}

              {state.currentStage === 8 && (
                <CostCategoryStage
                  title="Sales & Marketing Costs"
                  description="Acquisition and retention spend allocated to this vehicle batch."
                  fields={salesMarketingCostFields}
                  values={state}
                  dispatch={dispatch}
                  total={totalSalesMarketingCosts(state)}
                  totalLabel="Total Sales & Marketing Costs"
                />
              )}

              {state.currentStage === 9 && <Stage9RiskContingencyCosts values={state} />}

              {state.currentStage === 10 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <p className="mb-4 text-sm font-medium text-breadcrumb-root">
                    The margin targets this template solves pricing for in the Summary Income Statement.
                  </p>
                  <FieldGrid fields={marginTargetFields} values={state} dispatch={dispatch} />
                </div>
              )}

              {state.currentStage === 11 && <Stage11Summary values={state} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
