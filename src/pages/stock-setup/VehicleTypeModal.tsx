import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  mockManufacturers,
  mockModels,
  mockTrims,
  type VehicleTypeRecord,
} from "@/data/mockStockSetup"
import { FormSection, FormField } from "./FormControls"

export function VehicleTypeModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: VehicleTypeRecord | null
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit Vehicle Type" : "Add Vehicle Type"}
      subtitle={editing ? "Update the vehicle type details below." : "Enter the vehicle type details below."}
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: editing ? "Update Vehicle Type" : "Create Vehicle Type",
        onClick: () => {
          console.log(editing ? "Update vehicle type submitted" : "Create vehicle type submitted")
          onOpenChange(false)
        },
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div key={editing?.id ?? "new"} className="space-y-8">
        <FormSection title="Vehicle Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Manufacturer">
              <Select defaultValue={editing?.manufacturer ?? ""}>
                <SelectTrigger className="h-12 w-full bg-input-soft">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {mockManufacturers.map((m) => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Model">
              <Select defaultValue={editing?.model ?? ""}>
                <SelectTrigger className="h-12 w-full bg-input-soft">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {mockModels.map((m) => (
                    <SelectItem key={m.id} value={m.modelName}>{m.modelName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Trim">
              <Select defaultValue={editing?.trim ?? ""}>
                <SelectTrigger className="h-12 w-full bg-input-soft">
                  <SelectValue placeholder="Select trim" />
                </SelectTrigger>
                <SelectContent>
                  {mockTrims.map((t) => (
                    <SelectItem key={t.id} value={t.trimName}>{t.trimName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Vehicle Category">
              <Select defaultValue={editing?.category ?? ""}>
                <SelectTrigger className="h-12 w-full bg-input-soft">
                  <SelectValue placeholder="Select vehicle category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal Combustion Engine">Internal Combustion Engine</SelectItem>
                  <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Performance & Specifications">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Battery Type / Powertrain">
              <Input placeholder="Enter battery type" className="h-12 bg-input-soft" defaultValue={editing?.battery ?? ""} />
            </FormField>
            <FormField label="Battery Capacity">
              <Input placeholder="e.g. 60 kWh" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Motor Power">
              <Input placeholder="e.g. 150 kW" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Top Speed">
              <Input placeholder="e.g. 180 km/h" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Range">
              <Input placeholder="e.g. 400 km" className="h-12 bg-input-soft" defaultValue={editing?.range ?? ""} />
            </FormField>
            <FormField label="Seating / Payload">
              <Input placeholder="Enter seating or payload" className="h-12 bg-input-soft" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Additional Notes">
          <FormField label="Notes">
            <Textarea placeholder="Enter any additional notes" className="min-h-[120px] bg-input-soft" />
          </FormField>
        </FormSection>
      </div>
    </Modal>
  )
}
