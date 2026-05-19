import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockModels, type TrimRecord } from "@/data/mockStockSetup"
import { FormSection, FormField } from "./FormControls"

export function TrimModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: TrimRecord | null
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit Trim" : "Add Trim"}
      subtitle={editing ? "Update the trim details below." : "Enter the trim details below."}
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: editing ? "Update Trim" : "Create Trim",
        onClick: () => {
          console.log(editing ? "Update trim submitted" : "Create trim submitted")
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
        <FormSection title="Trim Information">
          <div className="grid grid-cols-2 gap-4">
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
            <FormField label="Trim Name">
              <Input placeholder="Enter trim name" className="h-12 bg-input-soft" defaultValue={editing?.trimName ?? ""} />
            </FormField>
          </div>
        </FormSection>
      </div>
    </Modal>
  )
}
