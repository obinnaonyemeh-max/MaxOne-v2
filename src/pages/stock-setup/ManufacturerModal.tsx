import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ManufacturerRecord } from "@/data/mockStockSetup"
import { FormSection, FormField } from "./FormControls"

export function ManufacturerModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ManufacturerRecord | null
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit Manufacturer" : "Add Manufacturer"}
      subtitle={editing ? "Update the manufacturer details below." : "Enter the manufacturer details below."}
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: editing ? "Update Manufacturer" : "Create Manufacturer",
        onClick: () => {
          console.log(editing ? "Update manufacturer submitted" : "Create manufacturer submitted")
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
        <FormSection title="Manufacturer Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Manufacturer / OEM Name">
              <Input placeholder="Enter manufacturer name" className="h-12 bg-input-soft" defaultValue={editing?.name ?? ""} />
            </FormField>
            <FormField label="Brand Name">
              <Input placeholder="Enter brand name" className="h-12 bg-input-soft" defaultValue={editing?.brand ?? ""} />
            </FormField>
            <FormField label="Country of Origin">
              <Input placeholder="Enter country of origin" className="h-12 bg-input-soft" defaultValue={editing?.country ?? ""} />
            </FormField>
            <FormField label="Status">
              <Select defaultValue={editing ? (editing.status === "active" ? "Active" : "Inactive") : "Active"}>
                <SelectTrigger className="h-12 w-full bg-input-soft">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Contact Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact Person">
              <Input placeholder="Enter contact person" className="h-12 bg-input-soft" defaultValue={editing?.contact ?? ""} />
            </FormField>
            <FormField label="Contact Email">
              <Input placeholder="Enter contact email" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Contact Phone">
              <Input placeholder="Enter contact phone" className="h-12 bg-input-soft" />
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
