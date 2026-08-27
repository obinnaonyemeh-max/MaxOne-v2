import { useEffect, useState } from "react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"

type UploadStep = "upload" | "validating" | "validated"

interface UploadVehiclesModalProps {
  open: boolean
  onClose: () => void
  onComplete: (vehicleCount: number) => void
}

export function UploadVehiclesModal({ open, onClose, onComplete }: UploadVehiclesModalProps) {
  const [step, setStep] = useState<UploadStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [validCount, setValidCount] = useState(0)

  useEffect(() => {
    if (!open) {
      setStep("upload")
      setFile(null)
    }
  }, [open])

  return (
    <>
      <Modal
        open={open && step === "upload"}
        onOpenChange={onClose}
        title="Upload Vehicles"
        subtitle="Add the VIN/asset list this pricing batch will cover"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setStep("validating")
            setTimeout(() => {
              setValidCount(6 + Math.floor(Math.random() * 40))
              setStep("validated")
            }, 1500)
          },
          disabled: !file,
        }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      >
        <div className="flex gap-8">
          <div className="w-[280px] shrink-0">
            <DocUpload
              uploadedFile={file}
              onFileSelect={setFile}
              accept=".xlsx,.xls,.csv"
              maxSizeLabel=""
              label="Drag and drop filled template sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
              Add multiple vehicles at once
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Use the provided template to enter each VIN/asset ID, then upload the completed file to
              link them to this pricing batch.
            </p>
            <a
              href="#"
              className="mt-4 inline-block underline font-medium"
              style={{ color: "var(--color-status-amber)", fontSize: "14px" }}
            >
              Download template sheet
            </a>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />

      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Upload Vehicles"
        subtitle="Add the VIN/asset list this pricing batch will cover"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-sm"
        primaryAction={{
          label: "Add to batch",
          onClick: () => {
            onComplete(validCount)
            onClose()
          },
          icon: true,
        }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      >
        <div className="flex flex-col items-center py-4">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Validation complete
          </h3>
          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            {validCount} vehicles are valid and will be linked to this pricing batch.
          </p>
        </div>
      </Modal>
    </>
  )
}
