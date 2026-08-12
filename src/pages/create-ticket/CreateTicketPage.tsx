import { useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { TopBar } from "@/components/max/TopBar"
import { BackButton } from "@/components/max/BackButton"
import { ConfirmModal } from "@/components/max/ConfirmModal"
import { StepIndicator } from "./StepIndicator"
import { WizardFooter } from "./WizardFooter"
import { StepSelectChampion } from "./StepSelectChampion"
import { StepSelectCategory } from "./StepSelectCategory"
import { StepSelectSubcategory } from "./StepSelectSubcategory"
import { StepTicketDetails } from "./StepTicketDetails"
import type { WizardState, WizardAction, WizardStep } from "./types"

const initialState: WizardState = {
  currentStep: 1,
  championSearch: "",
  selectedChampion: null,
  categorySearch: "",
  selectedCategory: null,
  selectedSubcategory: null,
  details: {
    platform: "",
    reporter: "",
    priority: "",
    city: "",
    locationDescription: "",
    date: undefined,
    time: "",
    incidentDescription: "",
    attachments: [],
  },
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }

    case "SET_CHAMPION_SEARCH":
      return { ...state, championSearch: action.query }

    case "SELECT_CHAMPION":
      return { ...state, selectedChampion: action.champion, championSearch: "" }

    case "CLEAR_CHAMPION":
      return { ...state, selectedChampion: null, championSearch: "" }

    case "SET_CATEGORY_SEARCH":
      return { ...state, categorySearch: action.query }

    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategory: action.category,
        selectedSubcategory: null,
      }

    case "SELECT_SUBCATEGORY":
      return {
        ...state,
        selectedSubcategory: action.subcategory,
        details: {
          ...state.details,
          priority: action.subcategory.priorityLevel,
        },
      }

    case "UPDATE_DETAILS":
      return {
        ...state,
        details: { ...state.details, [action.field]: action.value },
      }

    case "ADD_ATTACHMENT":
      return {
        ...state,
        details: {
          ...state.details,
          attachments: [...state.details.attachments, action.file],
        },
      }

    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        details: {
          ...state.details,
          attachments: state.details.attachments.filter((_, i) => i !== action.index),
        },
      }

    case "RESET":
      return initialState

    default:
      return state
  }
}

function isNextEnabled(state: WizardState): boolean {
  switch (state.currentStep) {
    case 1:
      return state.selectedChampion !== null
    case 2:
      return state.selectedCategory !== null
    case 3:
      return state.selectedSubcategory !== null
    case 4: {
      const baseValid =
        state.details.platform !== "" &&
        state.details.reporter.trim() !== "" &&
        state.details.priority !== "" &&
        state.details.city !== ""

      return (
        baseValid &&
        state.details.date !== undefined &&
        state.details.incidentDescription.trim() !== ""
      )
    }
    default:
      return false
  }
}

export default function CreateTicketPage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (!isNextEnabled(state) || state.currentStep >= 4) return

    dispatch({ type: "SET_STEP", step: (state.currentStep + 1) as WizardStep })
  }

  const handleBack = () => {
    if (state.currentStep <= 1) return

    dispatch({ type: "SET_STEP", step: (state.currentStep - 1) as WizardStep })
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    navigate("/ticket-management")
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    const { attachments, ...restDetails } = state.details
    console.log("Submitting ticket:", {
      champion: state.selectedChampion?.name,
      category: state.selectedCategory?.name,
      subcategory: state.selectedSubcategory?.name,
      details: {
        ...restDetails,
        attachments: attachments.map((f) => f.name),
      },
    })
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Ticket created successfully", {
        description: `Ticket for ${state.selectedChampion?.name} has been submitted.`,
      })
      navigate("/ticket-management")
    }, 1500)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Ticket Management", href: "/ticket-management" },
          { label: "Create Ticket" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <BackButton onClick={handleCancel} />
            <div>
              <h1
                className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                style={{ fontSize: "22px" }}
              >
                Create Ticket
                <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </h1>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Follow the steps below to create a new support ticket
              </p>
            </div>
          </div>

          <StepIndicator currentStep={state.currentStep} />

          <div className="max-w-3xl mx-auto mt-6">
            {state.currentStep === 1 && (
              <StepSelectChampion
                searchQuery={state.championSearch}
                selectedChampion={state.selectedChampion}
                onSearchChange={(q) => dispatch({ type: "SET_CHAMPION_SEARCH", query: q })}
                onSelectChampion={(c) => dispatch({ type: "SELECT_CHAMPION", champion: c })}
                onClearChampion={() => dispatch({ type: "CLEAR_CHAMPION" })}
              />
            )}

            {state.currentStep === 2 && (
              <StepSelectCategory
                searchQuery={state.categorySearch}
                selectedCategory={state.selectedCategory}
                onSearchChange={(q) => dispatch({ type: "SET_CATEGORY_SEARCH", query: q })}
                onSelectCategory={(c) => dispatch({ type: "SELECT_CATEGORY", category: c })}
              />
            )}

            {state.currentStep === 3 && state.selectedCategory && (
              <StepSelectSubcategory
                category={state.selectedCategory}
                selectedSubcategory={state.selectedSubcategory}
                onSelectSubcategory={(s) => dispatch({ type: "SELECT_SUBCATEGORY", subcategory: s })}
              />
            )}

            {state.currentStep === 4 &&
              state.selectedChampion &&
              state.selectedCategory &&
              state.selectedSubcategory && (
                <StepTicketDetails
                  champion={state.selectedChampion}
                  category={state.selectedCategory}
                  subcategory={state.selectedSubcategory}
                  details={state.details}
                  onUpdateField={(field, value) =>
                    dispatch({ type: "UPDATE_DETAILS", field, value })
                  }
                  onAddAttachment={(file) => dispatch({ type: "ADD_ATTACHMENT", file })}
                  onRemoveAttachment={(index) => dispatch({ type: "REMOVE_ATTACHMENT", index })}
                />
              )}

            <WizardFooter
              currentStep={state.currentStep}
              isNextEnabled={isNextEnabled(state)}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        variant="warning"
        title="Cancel ticket creation?"
        subtitle="All progress will be lost and you'll be returned to the Ticket Management page."
        primaryAction={{
          label: "Yes, cancel",
          onClick: handleConfirmCancel,
        }}
        secondaryAction={{
          label: "Continue editing",
          onClick: () => setShowCancelDialog(false),
        }}
      />
    </>
  )
}
