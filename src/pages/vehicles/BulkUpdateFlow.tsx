import { useEffect, useState } from "react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"

type BulkUpdateStep = "upload" | "validating" | "validated" | "importing" | "imported"

const initialStats = {
  totalRows: 18,
  validEntries: 18,
  rowsWithErrors: 0,
}

interface BulkUpdateFlowProps {
  open: boolean
  onClose: () => void
}

export function BulkUpdateFlow({ open, onClose }: BulkUpdateFlowProps) {
  const [step, setStep] = useState<BulkUpdateStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [stats] = useState(initialStats)

  useEffect(() => {
    if (!open) {
      setStep("upload")
      setFile(null)
    }
  }, [open])

  return (
    <>
      {/* Upload */}
      <Modal
        open={open && step === "upload"}
        onOpenChange={onClose}
        title="Bulk Update Vehicles"
        subtitle="Update multiple vehicles in the system all at once"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setStep("validating")
            setTimeout(() => {
              setStep("validated")
            }, 2000)
          },
          disabled: !file,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: onClose,
        }}
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
              Update multiple vehicles at once
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Use the provided template to modify vehicle details and upload it to apply updates across selected records.
            </p>
            <a
              href="#"
              className="mt-4 inline-block underline font-medium"
              style={{ color: 'var(--color-status-amber)', fontSize: '14px' }}
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

      {/* Validation report */}
      <Modal
        open={open && step === "validated"}
        onOpenChange={onClose}
        title="Bulk Update Vehicles"
        subtitle="Update multiple vehicles in the system all at once"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-xl"
        primaryAction={{
          label: "Update Data",
          onClick: () => {
            setStep("importing")
            setTimeout(() => {
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
            Vehicles ready to update
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with updating them in the system.
          </p>

          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {stats.totalRows}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: '28px', color: 'var(--color-success-bright)' }}>
                  {stats.validEntries}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>
                  {stats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <LoaderModal open={open && step === "importing"} message="Updating data..." />

      {/* Success */}
      <Modal
        open={open && step === "imported"}
        onOpenChange={onClose}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Update successful!
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
