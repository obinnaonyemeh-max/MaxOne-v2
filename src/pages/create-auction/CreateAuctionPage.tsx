import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { TopBar, BackButton, ConfirmModal, type GenericFilterState } from "@/components/max"
import { useCityScopedRecords, useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { CITY_DEPOT_OPTIONS } from "@/data/cities"
import {
  mockAuctionVehicles,
  defaultAuctionVehicleFilters,
} from "@/data/mockAuction"
import { BulkUploadVehiclesFlow } from "./BulkUploadVehiclesFlow"
import { StepIndicator } from "./StepIndicator"
import { StepAuctionDetails } from "./StepAuctionDetails"
import { StepAssignVehicles } from "./StepAssignVehicles"
import { StepReview } from "./StepReview"
import { WizardFooter } from "./WizardFooter"
import type { AuctionForm, AuctionStep } from "./types"

export default function CreateAuctionPage() {
  const navigate = useNavigate()
  const { filterByCity, dataScope } = useRoleSimulation()
  const auctionableVehicles = useCityScopedRecords(mockAuctionVehicles, "location")
  const locationOptions = CITY_DEPOT_OPTIONS
    .map((option) => option.value)
    .filter((loc) => !dataScope || filterByCity(loc))
  const [currentStep, setCurrentStep] = useState<AuctionStep>(1)
  const [form, setForm] = useState<AuctionForm>({
    title: "",
    location: "",
    startDate: undefined,
    endDate: undefined,
    minBid: "",
    minIncrement: "",
  })
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([])
  const [buyoutPrices, setBuyoutPrices] = useState<Record<string, string>>({})
  const [bulkPrice, setBulkPrice] = useState("")
  const [vehicleFilters, setVehicleFilters] = useState<GenericFilterState>(defaultAuctionVehicleFilters)
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [vehicleSearchOpen, setVehicleSearchOpen] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)

  const filteredVehicles = auctionableVehicles.filter((v) => {
    if (form.location && v.location !== form.location) return false
    if (vehicleFilters.condition?.length && !vehicleFilters.condition.includes(v.condition)) return false
    if (vehicleFilters.type?.length && !vehicleFilters.type.includes(v.type)) return false
    if (vehicleFilters.location?.length && !vehicleFilters.location.includes(v.location)) return false
    if (vehicleSearch.trim()) {
      const q = vehicleSearch.toLowerCase()
      return (
        v.vehicleId.toLowerCase().includes(q) ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.makeModel.toLowerCase().includes(q)
      )
    }
    return true
  })

  const selectedVehicles = auctionableVehicles.filter((v) => selectedVehicleIds.includes(v.id))

  const allSelected =
    filteredVehicles.length > 0 && filteredVehicles.every((v) => selectedVehicleIds.includes(v.id))

  const updateField = <K extends keyof AuctionForm>(field: K, value: AuctionForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setForm((prev) => ({
      ...prev,
      startDate: date,
      endDate: prev.endDate && date && prev.endDate <= date ? undefined : prev.endDate,
    }))
  }

  const removeVehicle = (id: string) => {
    setSelectedVehicleIds((prev) => prev.filter((v) => v !== id))
    setBuyoutPrices((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const toggleVehicle = (id: string) => {
    if (selectedVehicleIds.includes(id)) removeVehicle(id)
    else setSelectedVehicleIds((prev) => [...prev, id])
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedVehicleIds([])
      setBuyoutPrices({})
    } else {
      setSelectedVehicleIds(filteredVehicles.map((v) => v.id))
    }
  }

  const applyPriceToAll = () => {
    if (!bulkPrice.trim()) return
    setBuyoutPrices((prev) => {
      const next = { ...prev }
      selectedVehicleIds.forEach((id) => {
        next[id] = bulkPrice
      })
      return next
    })
  }

  const isNextEnabled = (() => {
    switch (currentStep) {
      case 1:
        return (
          form.title.trim() !== "" &&
          form.location !== "" &&
          form.startDate !== undefined &&
          form.endDate !== undefined &&
          form.minBid.trim() !== ""
        )
      case 2:
        return selectedVehicleIds.length > 0
      default:
        return true
    }
  })()

  const handleNext = () => {
    if (isNextEnabled && currentStep < 3) setCurrentStep((currentStep + 1) as AuctionStep)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as AuctionStep)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/auction", {
        state: { toast: `${form.title || "Auction"} has been published.` },
      })
    }, 1500)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Lifecycle" },
          { label: "Disposal & Auction" },
          { label: "Auction", href: "/auction" },
          { label: "Create Auction" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <BackButton onClick={() => setShowCancelDialog(true)} />
            <div>
              <h1
                className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                style={{ fontSize: "22px" }}
              >
                Create Auction
                <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </h1>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Follow the steps below to create an auction event
              </p>
            </div>
          </div>

          <StepIndicator currentStep={currentStep} />

          <div className={cn("mx-auto mt-6", currentStep === 2 ? "max-w-6xl" : "max-w-3xl")}>
            {currentStep === 1 && (
              <StepAuctionDetails
                form={form}
                locationOptions={locationOptions}
                onUpdateField={updateField}
                onStartDateChange={handleStartDateChange}
              />
            )}

            {currentStep === 2 && (
              <StepAssignVehicles
                filteredVehicles={filteredVehicles}
                selectedVehicles={selectedVehicles}
                selectedVehicleIds={selectedVehicleIds}
                allSelected={allSelected}
                onToggleVehicle={toggleVehicle}
                onToggleAll={toggleAll}
                vehicleFilters={vehicleFilters}
                onFiltersChange={setVehicleFilters}
                vehicleSearch={vehicleSearch}
                onSearchChange={setVehicleSearch}
                vehicleSearchOpen={vehicleSearchOpen}
                onSearchOpenChange={setVehicleSearchOpen}
                onBulkUpload={() => setBulkUploadOpen(true)}
                buyoutPrices={buyoutPrices}
                onBuyoutPriceChange={(id, value) =>
                  setBuyoutPrices((prev) => ({ ...prev, [id]: value }))
                }
                onRemoveVehicle={removeVehicle}
                bulkPrice={bulkPrice}
                onBulkPriceChange={setBulkPrice}
                onApplyPriceToAll={applyPriceToAll}
              />
            )}

            {currentStep === 3 && (
              <StepReview form={form} selectedVehicles={selectedVehicles} buyoutPrices={buyoutPrices} />
            )}

            <WizardFooter
              currentStep={currentStep}
              isNextEnabled={isNextEnabled}
              isSubmitting={isSubmitting}
              onCancel={() => setShowCancelDialog(true)}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <BulkUploadVehiclesFlow
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onComplete={() => {
          setSelectedVehicleIds(auctionableVehicles.map((v) => v.id))
          setCurrentStep(3)
        }}
      />

      <ConfirmModal
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        variant="warning"
        title="Cancel auction creation?"
        subtitle="All progress will be lost and you'll be returned to the Auction Events page."
        primaryAction={{ label: "Yes, cancel", onClick: () => { setShowCancelDialog(false); navigate("/auction") } }}
        secondaryAction={{ label: "Continue editing", onClick: () => setShowCancelDialog(false) }}
      />
    </>
  )
}
