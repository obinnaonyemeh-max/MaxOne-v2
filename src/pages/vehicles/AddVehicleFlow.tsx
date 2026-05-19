import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Modal, LoaderModal } from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

import {
  AddVehicleOptionCard,
  FileDropZone,
  FormField,
  FormSection,
} from "./FormControls"
import {
  financialPartners,
  locations,
  manufacturers,
  models,
  platformTypes,
  trims,
  vehicleTypes,
} from "./options"

type AddVehicleStep = "options" | "single" | "bulk" | "validating" | "validated" | "importing" | "imported"

const initialStats = {
  totalRows: 25,
  validEntries: 25,
  rowsWithErrors: 0,
}

interface AddVehicleFlowProps {
  open: boolean
  onClose: () => void
}

export function AddVehicleFlow({ open, onClose }: AddVehicleFlowProps) {
  const [step, setStep] = useState<AddVehicleStep>("options")
  const [addAnother, setAddAnother] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [validationStats] = useState(initialStats)

  useEffect(() => {
    if (!open) {
      setStep("options")
      setAddAnother(false)
      setDeliveryDate(undefined)
      setUploadedFile(null)
    }
  }, [open])

  return (
    <>
      {/* Options chooser */}
      <Modal
        open={open && step === "options"}
        onOpenChange={onClose}
        title="Add vehicles"
        subtitle="Choose how you want to add vehicles to the system."
      >
        <div className="grid grid-cols-2 gap-4">
          <AddVehicleOptionCard
            icon="/images/single_vehicle.svg"
            title="Add a single vehicle"
            description="Enter vehicle details manually"
            onClick={() => setStep("single")}
          />
          <AddVehicleOptionCard
            icon="/images/bulk_vehicles.svg"
            title="Bulk upload vehicles"
            description="Enter multiple vehicles at once"
            onClick={() => setStep("bulk")}
          />
        </div>
      </Modal>

      {/* Add a single vehicle */}
      <Modal
        open={open && step === "single"}
        onOpenChange={onClose}
        title="Add vehicles"
        subtitle="Choose how you want to add vehicles to the system."
        showBackButton
        onBack={() => setStep("options")}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Add Vehicle",
          onClick: () => {
            console.log("Add vehicle submitted")
            if (!addAnother) {
              onClose()
            }
          },
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
          <FormSection title="Basic Vehicle Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Vehicle Type">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Vehicle Manufacturer">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Model">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Trim">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a vehicle trim" />
                  </SelectTrigger>
                  <SelectContent>
                    {trims.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Platform Type">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a platform type" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformTypes.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Vehicle Identification">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Chassis Number (VIN)">
                <Input placeholder="Enter the chassis number" className="h-12 bg-input-soft" />
              </FormField>
              <FormField label="Engine Number">
                <Input placeholder="Enter the engine number" className="h-12 bg-input-soft" />
              </FormField>
              <FormField label="Ignition Number">
                <Input placeholder="Enter the ignition number" className="h-12 bg-input-soft" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Vendor & Financial Details">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="OEM/Vendor Name">
                <Input placeholder="Enter vendor name" className="h-12 bg-input-soft" />
              </FormField>
              <FormField label="Financial Partner">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a financial partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialPartners.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Assignment, Location & Delivery Date">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Receiver">
                <Input placeholder="Enter receiver name" className="h-12 bg-input-soft" />
              </FormField>
              <FormField label="Location">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Delivery Date">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-input-soft"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? format(deliveryDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                    />
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>
          </FormSection>
        </div>
      </Modal>

      {/* Bulk upload */}
      <Modal
        open={open && step === "bulk"}
        onOpenChange={onClose}
        title="Bulk upload vehicles"
        subtitle="Upload multiple vehicles using a template sheet"
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
        <div className="flex gap-6">
          <div className="w-[280px] shrink-0">
            <FileDropZone
              onFileSelect={setUploadedFile}
              file={uploadedFile}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
                Bulk add vehicles you wish to import into the system
              </h3>
              <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
                Download the template, fill in the required vehicle details under the designated headers, and upload the completed file to import them into the system.
              </p>
            </div>
            <a
              href="#"
              className="inline-block font-medium underline"
              style={{ fontSize: '14px', color: 'var(--color-status-amber)' }}
              onClick={(e) => {
                e.preventDefault()
                console.log("Download template")
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

      {/* Validation report */}
      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Bulk upload vehicles"
        subtitle="Upload multiple vehicles using a template sheet"
        showBackButton
        onBack={() => setStep("bulk")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: () => {
            setStep("importing")
            setTimeout(() => {
              setStep("imported")
            }, 2000)
          },
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
            Vehicles ready to import
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with importing them into the system.
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
                <p className="mt-2 font-semibold" style={{ fontSize: '28px', color: 'var(--color-success-bright)' }}>
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

      {/* Import success */}
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
