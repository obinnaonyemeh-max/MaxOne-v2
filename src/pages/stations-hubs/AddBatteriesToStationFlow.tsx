import { useEffect, useState } from "react"
import { Modal, LoaderModal, DocUpload } from "@/components/max"

type AddBatteriesStep = "bulk" | "validating" | "validated" | "importing" | "imported"

const initialStats = {
  totalRows: 25,
  validEntries: 25,
  rowsWithErrors: 0,
}

interface AddBatteriesToStationFlowProps {
  open: boolean
  stationName: string
  onClose: () => void
  onComplete?: (importedCount: number) => void
}

export function AddBatteriesToStationFlow({
  open,
  stationName,
  onClose,
  onComplete,
}: AddBatteriesToStationFlowProps) {
  const [step, setStep] = useState<AddBatteriesStep>("bulk")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [validationStats] = useState(initialStats)

  useEffect(() => {
    if (!open) {
      setStep("bulk")
      setUploadedFile(null)
    }
  }, [open])

  return (
    <>
      <Modal
        open={open && step === "bulk"}
        onOpenChange={onClose}
        title="Add batteries to swap station"
        subtitle="Upload multiple batteries using a template sheet"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setStep("validating")
            setTimeout(() => {
              setStep("validated")
            }, 2000)
          },
          disabled: !uploadedFile,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
      >
        <div className="flex gap-6">
          <div className="w-[280px] shrink-0">
            <DocUpload
              uploadedFile={uploadedFile}
              onFileSelect={setUploadedFile}
              accept=".xlsx,.xls,.csv"
              maxSizeLabel=""
              label="Drag and drop filled template sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
                Bulk add batteries you wish to assign to {stationName || "this swap station"}
              </h3>
              <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
                Download the template, fill in the required battery details under the designated headers, and upload the completed file to import them into the system.
              </p>
            </div>
            <a
              href="#"
              className="inline-block font-medium underline"
              style={{ fontSize: "14px", color: "var(--color-status-amber)" }}
              onClick={(e) => {
                e.preventDefault()
                console.log("Download battery template")
              }}
            >
              Download template sheet
            </a>
            <div className="pt-2">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />

      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Add batteries to swap station"
        subtitle="Upload multiple batteries using a template sheet"
        showBackButton
        onBack={() => setStep("bulk")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: () => {
            setStep("importing")
            setTimeout(() => {
              onComplete?.(validationStats.validEntries)
              setStep("imported")
            }, 2000)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
      >
        <div className="flex flex-col items-center py-6">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />

          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Batteries ready to import
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with importing them into the system.
          </p>

          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {validationStats.totalRows}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: "28px", color: "var(--color-success-bright)" }}>
                  {validationStats.validEntries}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {validationStats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "importing"} message="Importing data..." />

      <Modal
        open={open && step === "imported"}
        onOpenChange={onClose}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Import successful!
          </p>
          <button
            onClick={onClose}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
