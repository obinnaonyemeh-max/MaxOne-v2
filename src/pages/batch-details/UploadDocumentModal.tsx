import { useState } from "react"
import { Modal } from "@/components/max"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection, FormField, DocDropZone } from "./FormControls"
import { documentTypeOptions } from "./options"

export function UploadDocumentModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [uploadDocType, setUploadDocType] = useState("")
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null)

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setUploadDocType("")
          setUploadDocFile(null)
        }
        onOpenChange(next)
      }}
      title="Upload Document"
      subtitle="Select a document type and upload a file."
      maxHeight="85vh"
      className="max-w-lg"
      primaryAction={{
        label: "Upload",
        onClick: () => onOpenChange(false),
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="space-y-6">
        <FormSection title="Upload Document">
          <FormField label="Document Type">
            <Select value={uploadDocType} onValueChange={setUploadDocType}>
              <SelectTrigger className="h-12 w-full bg-gray-50">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="File">
            <DocDropZone
              file={uploadDocFile}
              onFileSelect={setUploadDocFile}
            />
          </FormField>
        </FormSection>
      </div>
    </Modal>
  )
}
