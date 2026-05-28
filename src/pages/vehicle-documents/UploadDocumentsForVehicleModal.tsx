import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Modal, ConfirmModal } from "@/components/max"
import { TransferUploadSection } from "@/pages/transfer-detail/TransferUploadSection"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const REQUIRED_DOCUMENTS = [
  "Vehicle Registration Certificate",
  "Insurance Certificate",
  "Roadworthiness Certificate",
  "Hackney Permit",
  "Driver's License",
  "Vehicle License",
  "Customs Clearance Certificate",
  "Procurement Invoice",
]

interface DocEntry {
  expiry: Date | undefined
  file: File | null
}

interface Props {
  open: boolean
  vehicleOptions: { value: string; label: string }[]
  defaultVehicleId?: string
  onClose: () => void
  onSubmit?: (payload: {
    vehicleId: string
    documents: { name: string; expiry: Date | undefined; file: File }[]
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

function emptyEntries(): Record<string, DocEntry> {
  return Object.fromEntries(
    REQUIRED_DOCUMENTS.map((name) => [name, { expiry: undefined, file: null }])
  )
}

export function UploadDocumentsForVehicleModal({
  open,
  vehicleOptions,
  defaultVehicleId,
  onClose,
  onSubmit,
}: Props) {
  const [vehicleId, setVehicleId] = useState<string>(defaultVehicleId ?? "")
  const [entries, setEntries] = useState<Record<string, DocEntry>>(emptyEntries)
  const [addAnother, setAddAnother] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setVehicleId(defaultVehicleId ?? "")
      setEntries(emptyEntries())
      setAddAnother(false)
      setFormKey((k) => k + 1)
      setConfirmOpen(false)
    }
  }, [open, defaultVehicleId])

  const updateEntry = (name: string, patch: Partial<DocEntry>) => {
    setEntries((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }))
  }

  const attachedCount = REQUIRED_DOCUMENTS.filter((n) => entries[n]?.file).length
  const missingCount = REQUIRED_DOCUMENTS.length - attachedCount
  const canSubmit = !!vehicleId && attachedCount > 0

  const performSubmit = () => {
    const documents = REQUIRED_DOCUMENTS
      .map((name) => ({ name, ...entries[name] }))
      .filter((d): d is { name: string; expiry: Date | undefined; file: File } => !!d.file)
    onSubmit?.({ vehicleId, documents })
    if (addAnother) {
      setVehicleId("")
      setEntries(emptyEntries())
      setFormKey((k) => k + 1)
    } else {
      onClose()
    }
  }

  const handleSubmit = () => {
    if (missingCount > 0) {
      setConfirmOpen(true)
      return
    }
    performSubmit()
  }

  return (
    <>
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Upload Documents"
      subtitle="Upload one or more compliance documents for a vehicle."
      className="max-w-xl"
      maxHeight="90vh"
      primaryAction={{
        label: `Submit Upload${attachedCount > 1 ? ` (${attachedCount})` : ""}`,
        onClick: handleSubmit,
        disabled: !canSubmit,
        icon: true,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
      leftAction={
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={addAnother}
            onChange={(e) => setAddAnother(e.target.checked)}
            className="h-4 w-4 rounded accent-gray-950 shrink-0"
          />
          <span
            className="font-medium text-sidebar-item-active"
            style={{ fontSize: "13px" }}
          >
            Add another
          </span>
        </label>
      }
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <SectionHeader label="Vehicle" />
          <div className="flex flex-col gap-2">
            <FieldLabel>
              Plate Number <span className="text-status-danger">*</span>
            </FieldLabel>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger className="h-12 w-full bg-input-soft">
                <SelectValue placeholder="Select plate number..." />
              </SelectTrigger>
              <SelectContent>
                {vehicleOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader label="Documents" />
          {REQUIRED_DOCUMENTS.map((name) => {
            const entry = entries[name]
            return (
              <div key={name} className="space-y-3">
                <h4
                  className="font-semibold text-sidebar-item-active"
                  style={{ fontSize: "14px" }}
                >
                  {name} <span className="text-status-danger">*</span>
                </h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-input-soft"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {entry?.expiry ? (
                        format(entry.expiry, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Expiry date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={entry?.expiry}
                      onSelect={(d) => updateEntry(name, { expiry: d })}
                    />
                  </PopoverContent>
                </Popover>
                <TransferUploadSection
                  key={`${formKey}-${name}`}
                  uploadedFile={entry?.file ?? null}
                  onFileSelect={(f) => updateEntry(name, { file: f })}
                  showCard={false}
                />
              </div>
            )
          })}
        </div>
      </div>
    </Modal>

    <ConfirmModal
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      variant="warning"
      title="Submit with missing documents?"
      subtitle={`You've attached ${attachedCount} of ${REQUIRED_DOCUMENTS.length} required documents. ${missingCount} ${missingCount === 1 ? "document is" : "documents are"} still missing. Are you sure you want to submit?`}
      primaryAction={{
        label: "Submit Anyway",
        onClick: () => {
          setConfirmOpen(false)
          performSubmit()
        },
      }}
      secondaryAction={{
        label: "Keep Editing",
        onClick: () => setConfirmOpen(false),
      }}
    />
    </>
  )
}
