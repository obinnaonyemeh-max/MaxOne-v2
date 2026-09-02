import { useEffect, useRef, useState } from "react"
import { UploadCloud } from "lucide-react"

import { Modal, DocDropZone } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface NewWriteOffInput {
  writeOffAmount: number
  numberOfContracts: number
  file: File
}

interface NewWriteOffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: NewWriteOffInput) => void
}

export function NewWriteOffModal({ open, onOpenChange, onSubmit }: NewWriteOffModalProps) {
  const [writeOffAmount, setWriteOffAmount] = useState<number>(0)
  const [numberOfContracts, setNumberOfContracts] = useState<number>(0)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setWriteOffAmount(0)
      setNumberOfContracts(0)
      setFile(null)
    }
  }, [open])

  const isValid = writeOffAmount > 0 && numberOfContracts > 0 && file !== null

  const handleUpload = () => {
    if (!isValid || !file) return
    onSubmit({ writeOffAmount, numberOfContracts, file })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Write-Off"
      subtitle="Enter the details and parameters for processing the new batch of Write-Offs. Once completed, proceed to upload the sheet."
      className="max-w-3xl"
      primaryAction={{
        label: "Upload Sheet",
        onClick: handleUpload,
        disabled: !isValid,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="grid grid-cols-2 gap-6">
        <DocDropZone
          file={file}
          onFileSelect={setFile}
          accept=".csv,.xlsx"
          maxSizeLabel="CSV, XLSX up to 10MB"
          label="Drag and drop your file here"
          icon={<UploadCloud className="mx-auto h-7 w-7 text-gray-400 mb-2" />}
          className="min-h-[220px]"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
              Write-Off Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                ₦
              </span>
              <Input
                type="number"
                value={writeOffAmount || ""}
                onChange={(e) => setWriteOffAmount(Number(e.target.value) || 0)}
                placeholder="Enter amount for Write-Off"
                className="h-12 bg-input-soft pl-7"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
              Number of Contracts
            </label>
            <Input
              type="number"
              value={numberOfContracts || ""}
              onChange={(e) => setNumberOfContracts(Number(e.target.value) || 0)}
              placeholder="No of Contracts"
              className="h-12 bg-input-soft"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
              Sheet File
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setFile(f)
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose file
              </Button>
              <span className="truncate text-gray-400 font-medium" style={{ fontSize: "13px" }}>
                {file ? file.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
