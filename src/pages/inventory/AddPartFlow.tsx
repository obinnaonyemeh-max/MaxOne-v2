import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Modal, LoaderModal, DocUpload } from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CITY_HUB_OPTIONS } from "@/data/cities"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { type AddPartInput } from "@/data/inventoryStore"
import {
  submitBulkNewPartRequests,
  submitNewPartRequest,
} from "@/data/inventoryApprovalStore"
import {
  AddVehicleOptionCard,
  FormField,
  FormSection,
} from "@/pages/vehicles/FormControls"
import { manufacturers, models, trims } from "@/pages/vehicles/options"

import { downloadCsv } from "./csvDownload"

type AddPartStep = "options" | "single" | "bulk" | "validating" | "validated" | "importing" | "imported"

const emptyForm: AddPartInput = {
  partName: "",
  manufacturer: "",
  model: "",
  trim: "",
  location: "",
  costPrice: undefined,
  onHandQuantity: undefined,
}

const initialStats = {
  totalRows: 12,
  validEntries: 12,
  rowsWithErrors: 0,
}

interface AddPartFlowProps {
  open: boolean
  onClose: () => void
}

export function AddPartFlow({ open, onClose }: AddPartFlowProps) {
  const { filterByCity, dataScope } = useRoleSimulation()
  const locationOptions = CITY_HUB_OPTIONS.filter(
    (option) => !dataScope || filterByCity(option.value)
  )
  const [step, setStep] = useState<AddPartStep>("options")
  const [addAnother, setAddAnother] = useState(false)
  const [form, setForm] = useState<AddPartInput>(emptyForm)
  const [costPriceInput, setCostPriceInput] = useState("")
  const [onHandInput, setOnHandInput] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof AddPartInput, string>>>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [validationStats] = useState(initialStats)

  useEffect(() => {
    if (!open) {
      setStep("options")
      setAddAnother(false)
      setForm(emptyForm)
      setCostPriceInput("")
      setOnHandInput("")
      setErrors({})
      setUploadedFile(null)
    }
  }, [open])

  const resetSingleForm = () => {
    setForm(emptyForm)
    setCostPriceInput("")
    setOnHandInput("")
    setErrors({})
  }

  const handleAddPart = () => {
    const nextErrors: Partial<Record<keyof AddPartInput, string>> = {}
    if (!form.partName.trim()) nextErrors.partName = "Part name is required"
    if (!form.manufacturer) nextErrors.manufacturer = "Manufacturer is required"
    if (!form.model) nextErrors.model = "Model is required"
    if (!form.trim) nextErrors.trim = "Trim is required"
    if (!form.location) nextErrors.location = "Location is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const costPrice = costPriceInput.trim() === "" ? undefined : Number(costPriceInput)
    const onHandQuantity = onHandInput.trim() === "" ? undefined : Number.parseInt(onHandInput, 10)

    const request = submitNewPartRequest({
      ...form,
      partName: form.partName.trim(),
      costPrice: Number.isFinite(costPrice) ? costPrice : undefined,
      onHandQuantity: Number.isFinite(onHandQuantity) ? onHandQuantity : undefined,
    })
    toast.success(`${request.skuId} submitted for approval`)

    if (addAnother) {
      resetSingleForm()
      return
    }
    onClose()
  }

  const handleImportParts = () => {
    setStep("importing")
    setTimeout(() => {
      submitBulkNewPartRequests()
      setStep("imported")
    }, 2000)
  }

  return (
    <>
      <Modal
        open={open && step === "options"}
        onOpenChange={onClose}
        title="Add parts"
        subtitle="Choose how you want to add parts to inventory."
      >
        <div className="grid grid-cols-2 gap-4">
          <AddVehicleOptionCard
            icon="/images/single_vehicle.svg"
            title="Add a single part"
            description="Enter part details manually"
            onClick={() => setStep("single")}
          />
          <AddVehicleOptionCard
            icon="/images/bulk_vehicles.svg"
            title="Bulk upload parts"
            description="Enter multiple parts at once"
            onClick={() => setStep("bulk")}
          />
        </div>
      </Modal>

      <Modal
        open={open && step === "single"}
        onOpenChange={onClose}
        title="Add a single part"
        subtitle="Enter the part details. SKU ID is generated automatically."
        showBackButton
        onBack={() => setStep("options")}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Add Part",
          onClick: handleAddPart,
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
        leftAction={
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addAnother}
              onChange={(e) => setAddAnother(e.target.checked)}
              className="h-4 w-4 rounded appearance-none border border-gray-200 bg-gray-100 checked:bg-brand-dark checked:border-brand-dark cursor-pointer checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
            />
            <span className="text-sm font-medium text-sidebar-item-active">Add another</span>
          </label>
        }
      >
        <div className="space-y-8">
          <FormSection title="Part details">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Part name" error={errors.partName}>
                <Input
                  placeholder="Enter part name"
                  className="h-12 bg-input-soft"
                  value={form.partName}
                  onChange={(e) => setForm((prev) => ({ ...prev, partName: e.target.value }))}
                />
              </FormField>
              <FormField label="Location" error={errors.location}>
                <Select
                  value={form.location || undefined}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Vehicle fitment">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Vehicle manufacturer" error={errors.manufacturer}>
                <Select
                  value={form.manufacturer || undefined}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, manufacturer: value }))}
                >
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Model" error={errors.model}>
                <Select
                  value={form.model || undefined}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, model: value }))}
                >
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Trim" error={errors.trim}>
                <Select
                  value={form.trim || undefined}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, trim: value }))}
                >
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a vehicle trim" />
                  </SelectTrigger>
                  <SelectContent>
                    {trims.map((trim) => (
                      <SelectItem key={trim} value={trim}>
                        {trim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Stock (optional)">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Cost price" hint="Leave blank if unknown">
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter cost price"
                  className="h-12 bg-input-soft"
                  value={costPriceInput}
                  onChange={(e) => setCostPriceInput(e.target.value)}
                />
              </FormField>
              <FormField label="On-hand quantity" hint="Defaults to 0">
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter quantity"
                  className="h-12 bg-input-soft"
                  value={onHandInput}
                  onChange={(e) => setOnHandInput(e.target.value)}
                />
              </FormField>
            </div>
          </FormSection>
        </div>
      </Modal>

      <Modal
        open={open && step === "bulk"}
        onOpenChange={onClose}
        title="Bulk upload parts"
        subtitle="Upload multiple parts using a template sheet"
        showBackButton
        onBack={() => setStep("options")}
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setStep("validating")
            setTimeout(() => {
              setStep("validated")
            }, 2000)
          },
          disabled: !uploadedFile,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[280px] shrink-0">
            <DocUpload
              uploadedFile={uploadedFile}
              onFileSelect={setUploadedFile}
              accept=".xlsx,.xls,.csv"
              maxSizeLabel=""
              label="Drag and drop filled template sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
                Bulk add parts you wish to import into inventory
              </h3>
              <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
                Download the template, fill in part name, manufacturer, model, trim, and location, then upload the completed file.
              </p>
            </div>
            <a
              href="#"
              className="inline-block font-medium underline"
              style={{ fontSize: "14px", color: "var(--color-status-amber)" }}
              onClick={(e) => {
                e.preventDefault()
                downloadCsv("inventory-parts-template.csv", [
                  ["Part name", "Manufacturer", "Model", "Trim", "Location", "Cost Price", "On-hand Quantity"],
                ])
              }}
            >
              Download template sheet
            </a>
            <div className="pt-2">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />

      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Bulk upload parts"
        subtitle="Upload multiple parts using a template sheet"
        showBackButton
        onBack={() => setStep("bulk")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: handleImportParts,
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
      >
        <div className="flex flex-col items-center py-6">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />

          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Parts ready to import
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with importing them into inventory.
          </p>

          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {validationStats.totalRows}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: "28px", color: "var(--color-success-bright)" }}>
                  {validationStats.validEntries}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {validationStats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "importing"} message="Importing data..." />

      <Modal
        open={open && step === "imported"}
        onOpenChange={onClose}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Import successful!
          </p>
          <button
            onClick={onClose}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
