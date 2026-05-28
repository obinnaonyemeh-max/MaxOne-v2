import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Modal } from "@/components/max"
import { TransferUploadSection } from "@/pages/transfer-detail/TransferUploadSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_REPLACE_DOC = "Document"

const DOCUMENT_TYPES = [
  "Vehicle Registration Certificate",
  "Insurance Certificate",
  "Roadworthiness Certificate",
  "Hackney Permit",
  "Driver's License",
  "Vehicle License",
  "Customs Clearance Certificate",
  "Procurement Invoice",
]

interface Props {
  open: boolean
  vehicleId: string
  defaultDocumentType?: string
  defaultExpiryDate?: Date
  uploadedBy?: string
  mode?: "upload" | "replace"
  onClose: () => void
  onSubmit?: (payload: {
    file: File
    vehicleId: string
    documentType: string
    expiryDate: Date | undefined
    uploadedBy: string
    notes: string
  }) => void
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
      {children}
    </label>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
      <h3
        className="font-semibold text-sidebar-item-active uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        {label}
      </h3>
    </div>
  )
}

export function UploadDocumentModal({
  open,
  vehicleId,
  defaultDocumentType,
  defaultExpiryDate,
  uploadedBy = "Fleet Ops PM",
  mode = "upload",
  onClose,
  onSubmit,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string>(defaultDocumentType ?? "")
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(defaultExpiryDate)
  const [uploader, setUploader] = useState<string>(uploadedBy)
  const [notes, setNotes] = useState<string>("")

  useEffect(() => {
    if (open) {
      setFile(null)
      setDocumentType(defaultDocumentType ?? "")
      setExpiryDate(defaultExpiryDate)
      setUploader(uploadedBy)
      setNotes("")
    }
  }, [open, defaultDocumentType, defaultExpiryDate, uploadedBy])

  const canSubmit = !!file && !!documentType

  const handleSubmit = () => {
    if (!file) return
    onSubmit?.({ file, vehicleId, documentType, expiryDate, uploadedBy: uploader, notes })
    onClose()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={
        mode === "replace"
          ? `Replace ${documentType || DEFAULT_REPLACE_DOC}`
          : "Upload Document"
      }
      subtitle={
        mode === "replace"
          ? `Upload a new version for ${vehicleId}.`
          : "Add a compliance document for this vehicle."
      }
      maxHeight="90vh"
      className="max-w-2xl"
      primaryAction={{
        label: mode === "replace" ? "Submit Replacement" : "Submit Upload",
        onClick: handleSubmit,
        disabled: !canSubmit,
        icon: true,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <SectionHeader label="Required" />

          <TransferUploadSection
            uploadedFile={file}
            onFileSelect={setFile}
            showCard={false}
          />

          {mode === "upload" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel>Vehicle ID</FieldLabel>
                <Input value={vehicleId} readOnly className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel>Document Type</FieldLabel>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className={mode === "upload" ? "grid grid-cols-2 gap-4" : ""}>
            <div className="flex flex-col gap-2">
              <FieldLabel>Expiry Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start text-left font-normal bg-input-soft"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? (
                      format(expiryDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} />
                </PopoverContent>
              </Popover>
            </div>
            {mode === "upload" && (
              <div className="flex flex-col gap-2">
                <FieldLabel>Uploaded By</FieldLabel>
                <Input
                  value={uploader}
                  onChange={(e) => setUploader(e.target.value)}
                  className="h-12 bg-input-soft"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader label="Optional" />
          <div className="flex flex-col gap-2">
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant notes..."
              className="min-h-[120px] bg-input-soft"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
