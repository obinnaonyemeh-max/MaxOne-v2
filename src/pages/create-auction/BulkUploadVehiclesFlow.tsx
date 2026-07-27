import { useEffect, useState } from "react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"

type BulkUploadStep = "upload" | "validating" | "validated"

const initialStats = {
  totalRows: 6,
  validEntries: 4,
  rowsWithErrors: 2,
}

const errorRows = [
  {
    vehicleId: "VH-00512",
    buyoutPrice: "₦45,000",
    reason: "Vehicle not found",
  },
  {
    vehicleId: "VH-00488",
    buyoutPrice: "—",
    reason: "Buyout price missing",
  },
]

interface BulkUploadVehiclesFlowProps {
  open: boolean
  onClose: () => void
  onComplete?: () => void
}

export function BulkUploadVehiclesFlow({ open, onClose, onComplete }: BulkUploadVehiclesFlowProps) {
  const [step, setStep] = useState<BulkUploadStep>("upload")
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
        title="Bulk Upload Vehicles"
        subtitle="Add multiple vehicles to this auction at once"
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
              Add multiple vehicles at once
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Use the provided template to enter each Vehicle ID and its Buyout Price, then upload the
              completed file to add them to this auction.
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
        title="Bulk Upload Vehicles"
        subtitle="Add multiple vehicles to this auction at once"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-xl"
        primaryAction={{
          label: "Add valid vehicles",
          onClick: () => {
            onComplete?.()
            onClose()
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
            Validation complete
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            {stats.validEntries} of {stats.totalRows} entries are valid and will be added to the auction.
            Rows with errors are listed below and will be skipped.
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
                <p className="mt-2 font-semibold" style={{ fontSize: "28px", color: "var(--color-status-danger)" }}>
                  {stats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>

          {errorRows.length > 0 && (
            <div className="mt-6 w-full">
              <h4 className="font-semibold text-sidebar-item-active mb-3" style={{ fontSize: "14px" }}>
                Rows with errors
              </h4>
              <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-3 px-4 py-2.5 bg-table-header-bg">
                  <span className="text-table-header-text font-medium" style={{ fontSize: "12px" }}>Vehicle ID</span>
                  <span className="text-table-header-text font-medium" style={{ fontSize: "12px" }}>Buyout Price</span>
                  <span className="text-table-header-text font-medium" style={{ fontSize: "12px" }}>Reason</span>
                </div>
                {errorRows.map((row) => (
                  <div key={row.vehicleId} className="grid grid-cols-[1fr_1fr_1.5fr] gap-3 px-4 py-3 items-center">
                    <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>
                      {row.vehicleId}
                    </span>
                    <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>
                      {row.buyoutPrice}
                    </span>
                    <span className="font-medium text-status-danger" style={{ fontSize: "13px" }}>
                      {row.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
