import { useState } from "react"

import { Modal, DocUpload } from "@/components/max"
import { Input } from "@/components/ui/input"
import { FormSection, FormField } from "./FormControls"

export function MoveStageModal({
  open,
  onOpenChange,
  nextStage,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nextStage: string
  onConfirm: () => void
}) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Logistics Information Required"
      subtitle={`These fields are required before moving to "${nextStage}".`}
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: `Confirm & Move to ${nextStage}`,
        onClick: () => {
          onConfirm()
          onOpenChange(false)
        },
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="space-y-8">
        <FormSection title="Logistics Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Container Number">
              <Input placeholder="Enter container number" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Shipping Line">
              <Input placeholder="Enter shipping line" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Port of Arrival">
              <Input placeholder="Enter port of arrival" className="h-12 bg-input-soft" />
            </FormField>
            <FormField label="Invoice / PO Reference">
              <Input placeholder="Enter invoice or PO reference" className="h-12 bg-input-soft" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Upload CSV">
          <FormField label="Vehicle Identifiers CSV">
            <DocUpload
              uploadedFile={csvFile}
              onFileSelect={setCsvFile}
              accept=".csv"
              maxSizeLabel="CSV up to 10MB"
            />
          </FormField>
        </FormSection>
      </div>
    </Modal>
  )
}
