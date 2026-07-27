import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { TopBar } from "@/components/max/TopBar"
import { BackButton } from "@/components/max/BackButton"
import { ConfirmModal } from "@/components/max/ConfirmModal"
import { StepIndicator, type KitAssignmentStep } from "./StepIndicator"
import { WizardFooter } from "./WizardFooter"
import { StepSelectVehicle } from "./StepSelectVehicle"
import { StepNewAssignment, type NewAssignmentDetails } from "./StepNewAssignment"
import { StepConfirm } from "./StepConfirm"
import { type ReassignableVehicle } from "@/data/mockKitAssignment"

const KIT_LIST_ROUTE = "/activation-assignment/asset-reassignment/kit"

const emptyDetails: NewAssignmentDetails = {
  newPlateNumber: "",
  newChassisId: "",
  newClientId: "",
}

export default function KitAssignmentPage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState<KitAssignmentStep>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<ReassignableVehicle | null>(null)
  const [details, setDetails] = useState<NewAssignmentDetails>(emptyDetails)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isNextEnabled = (() => {
    switch (currentStep) {
      case 1:
        return selectedVehicle !== null
      case 2:
        return (
          details.newPlateNumber.trim() !== "" &&
          details.newChassisId.trim() !== "" &&
          details.newClientId !== ""
        )
      case 3:
        return true
      default:
        return false
    }
  })()

  const handleNext = () => {
    if (isNextEnabled && currentStep < 3) {
      setCurrentStep((s) => (s + 1) as KitAssignmentStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as KitAssignmentStep)
    }
  }

  const handleConfirmCancel = () => {
    setShowCancelDialog(false)
    navigate(KIT_LIST_ROUTE)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Kit assigned successfully", {
        description: `${selectedVehicle?.searchLabel} has been reassigned.`,
      })
      navigate(KIT_LIST_ROUTE)
    }, 1500)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Activation & Assignment" },
          { label: "Asset Reassignment" },
          { label: "Kit", href: KIT_LIST_ROUTE },
          { label: "Kit Assignment" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="mb-1 flex items-center gap-3">
            <BackButton onClick={() => setShowCancelDialog(true)} />
            <div>
              <h1
                className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                style={{ fontSize: "22px" }}
              >
                Kit Assignment
                <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </h1>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Reassign a vehicle/kit to a new client in a few steps
              </p>
            </div>
          </div>

          <StepIndicator currentStep={currentStep} />

          <div className="mx-auto mt-6 max-w-3xl">
            {currentStep === 1 && (
              <StepSelectVehicle
                searchQuery={searchQuery}
                selectedVehicle={selectedVehicle}
                onSearchChange={setSearchQuery}
                onSelectVehicle={(v) => {
                  setSelectedVehicle(v)
                  setSearchQuery("")
                }}
                onClearVehicle={() => {
                  setSelectedVehicle(null)
                  setSearchQuery("")
                }}
              />
            )}

            {currentStep === 2 && (
              <StepNewAssignment
                details={details}
                onUpdateField={(field, value) =>
                  setDetails((prev) => ({ ...prev, [field]: value }))
                }
              />
            )}

            {currentStep === 3 && selectedVehicle && (
              <StepConfirm vehicle={selectedVehicle} details={details} />
            )}

            <WizardFooter
              currentStep={currentStep}
              isNextEnabled={isNextEnabled}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
              onCancel={() => setShowCancelDialog(true)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        variant="warning"
        title="Cancel kit assignment?"
        subtitle="All progress will be lost and you'll be returned to the Kit Reports page."
        primaryAction={{ label: "Yes, cancel", onClick: handleConfirmCancel }}
        secondaryAction={{ label: "Continue editing", onClick: () => setShowCancelDialog(false) }}
      />
    </>
  )
}
