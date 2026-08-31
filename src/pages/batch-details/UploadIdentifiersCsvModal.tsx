import { useState } from "react"

import { Modal, DocUpload } from "@/components/max"
import { FormField, FormSection } from "./FormControls"

export function UploadIdentifiersCsvModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (file: File) => void
}) {
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const resetAndClose = () => {
    setCsvFile(null)
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setCsvFile(null)
        onOpenChange(next)
      }}
      title="Upload Vehicle Identifiers"
      subtitle="Each CSV upload creates a new sub-batch. Columns: Chassis (VIN), Engine No., Ignition No., Battery S/N, Color, Receiver."
      maxHeight="85vh"
      className="max-w-lg"
      primaryAction={{
        label: "Upload & Create Sub-Batch",
        onClick: () => {
          if (!csvFile) return
          onSubmit(csvFile)
          resetAndClose()
        },
        disabled: !csvFile,
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: resetAndClose,
      }}
    >
      <FormSection title="Vehicle Identifiers CSV">
        <FormField label="CSV File">
          <DocUpload
            uploadedFile={csvFile}
            onFileSelect={setCsvFile}
            accept=".csv"
            maxSizeLabel="CSV up to 10MB"
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}
