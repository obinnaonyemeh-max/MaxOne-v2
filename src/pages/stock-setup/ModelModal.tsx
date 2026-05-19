import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockManufacturers, type ModelRecord } from "@/data/mockStockSetup"
import { FormSection, FormField } from "./FormControls"

export function ModelModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ModelRecord | null
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit Model" : "Add Model"}
      subtitle={editing ? "Update the model details below." : "Enter the model details below."}
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: editing ? "Update Model" : "Create Model",
        onClick: () => {
          console.log(editing ? "Update model submitted" : "Create model submitted")
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
        <FormSection title="Model Information">
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
            <FormField label="Model Name">
              <Input placeholder="Enter model name" className="h-12 bg-input-soft" defaultValue={editing?.modelName ?? ""} />
            </FormField>
          </div>
        </FormSection>
      </div>
    </Modal>
  )
}
