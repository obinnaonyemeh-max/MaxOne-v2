import { useState } from "react"
import { Download } from "lucide-react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"
import { Button } from "@/components/ui/button"

type UploadFlowStep = "upload" | "validating" | "validated" | "importing" | "imported"

interface IceContractsUploadFlowProps {
  open: boolean
  onClose: () => void
  onComplete: (file: File, recordCount: number) => void
}

export function IceContractsUploadFlow({ open, onClose, onComplete }: IceContractsUploadFlowProps) {
  const [step, setStep] = useState<UploadFlowStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [recordCount, setRecordCount] = useState(0)

  // Reset the flow when the modal closes — adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) {
      setStep("upload")
      setFile(null)
      setFileError(null)
    }
  }

  const handleFileSelect = (selected: File) => {
    if (!/\.(csv|xlsx)$/i.test(selected.name)) {
      setFileError("Unsupported file type — please upload a .csv or .xlsx file.")
      setFile(null)
      return
    }
    setFileError(null)
    setFile(selected)
  }

  const handleValidate = () => {
    if (!file) return
    setStep("validating")
    setTimeout(() => {
      setRecordCount(20 + Math.floor(Math.random() * 60))
      setStep("validated")
    }, 1500)
  }

  const handleImport = () => {
    setStep("importing")
    setTimeout(() => {
      setStep("imported")
    }, 1500)
  }

  const handleDone = () => {
    if (file) onComplete(file, recordCount)
    onClose()
  }

  return (
    <>
      {/* Upload */}
      <Modal
        open={open && step === "upload"}
        onOpenChange={onClose}
        title="Upload ICE Contracts"
        subtitle="Batch process ICE contract parameters against the current active rule"
        className="max-w-3xl"
        primaryAction={{ label: "Validate data", onClick: handleValidate, disabled: !file }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      >
        <div className="flex gap-8">
          <div className="w-[280px] shrink-0">
            <DocUpload
              uploadedFile={file}
              onFileSelect={handleFileSelect}
              accept=".csv,.xlsx"
              maxSizeLabel="CSV, XLSX up to 10MB"
              label="Drag and drop your ICE contracts sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
            {fileError && <p className="mt-2 text-xs font-medium text-status-danger">{fileError}</p>}
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
              Batch process ICE contract repricing
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Use the provided template to list ICE contract parameters and upload it to reprice them against
              the current active rule.
            </p>
            <Button variant="outline" className="mt-4 h-9 gap-2" asChild>
              <a href="#">
                <Download className="h-4 w-4" />
                Download ICE Template
              </a>
            </Button>
            <div className="pt-4">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />

      {/* Validation report */}
      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Upload ICE Contracts"
        subtitle="Batch process ICE contract parameters against the current active rule"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-xl"
        primaryAction={{ label: "Process Batch Upload", onClick: handleImport }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      >
        <div className="flex flex-col items-center py-6">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />

          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Contracts ready to process
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with batch processing them.
          </p>

          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {recordCount}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: "28px", color: "var(--color-success-bright)" }}>
                  {recordCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "importing"} message="Processing batch upload..." />

      {/* Success */}
      <Modal open={open && step === "imported"} onOpenChange={onClose} hideHeader className="max-w-[280px]">
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Upload started!
          </p>
          <button
            onClick={handleDone}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
