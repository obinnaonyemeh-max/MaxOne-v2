import { useEffect, useState } from "react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"

type UploadStep = "upload" | "validating" | "validated"

interface UploadIceContractsModalProps {
  open: boolean
  onClose: () => void
  onComplete: (contractCount: number) => void
}

export function UploadIceContractsModal({ open, onClose, onComplete }: UploadIceContractsModalProps) {
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
        title="Upload ICE Contracts"
        subtitle="Add ICE contracts to the fuel-index repricing scope"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setStep("validating")
            setTimeout(() => {
              setValidCount(4 + Math.floor(Math.random() * 30))
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
              label="Drag and drop filled ICE contracts sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
              Add ICE contracts to repricing
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Use the ICE contracts template to list each contract ID, then upload the completed file to
              include them in the next repricing run.
            </p>
            <a
              href="#"
              className="mt-4 inline-block underline font-medium"
              style={{ color: "var(--color-status-amber)", fontSize: "14px" }}
            >
              Download ICE template
            </a>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />

      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Upload ICE Contracts"
        subtitle="Add ICE contracts to the fuel-index repricing scope"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-sm"
        primaryAction={{
          label: "Add to scope",
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
            {validCount} ICE contracts are valid and will be included in the next repricing run.
          </p>
        </div>
      </Modal>
    </>
  )
}
