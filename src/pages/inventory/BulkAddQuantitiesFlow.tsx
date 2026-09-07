import { useEffect, useState } from "react"

import { Modal, LoaderModal, DocUpload } from "@/components/max"
import { submitBulkQtyAdditions } from "@/data/inventoryApprovalStore"
import { getInventoryPartsSnapshot } from "@/data/inventoryStore"

import { downloadCsv } from "./csvDownload"

type BulkAddQuantitiesStep = "upload" | "validating" | "validated" | "importing" | "imported"

const initialStats = {
  totalRows: 4,
  validEntries: 4,
  rowsWithErrors: 0,
}

interface BulkAddQuantitiesFlowProps {
  open: boolean
  onClose: () => void
}

export function BulkAddQuantitiesFlow({ open, onClose }: BulkAddQuantitiesFlowProps) {
  const [step, setStep] = useState<BulkAddQuantitiesStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [stats] = useState(initialStats)

  useEffect(() => {
    if (!open) {
      setStep("upload")
      setFile(null)
    }
  }, [open])

  const handleImport = () => {
    setStep("importing")
    setTimeout(() => {
      submitBulkQtyAdditions()
      setStep("imported")
    }, 2000)
  }

  return (
    <>
      <Modal
        open={open && step === "upload"}
        onOpenChange={onClose}
        title="Bulk add quantities"
        subtitle="Increase on-hand stock for existing parts"
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[280px] shrink-0">
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
              Add quantities for multiple parts at once
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Download the template and fill in SKU ID and Quantity. Use the parts library sheet to copy SKU IDs and part names exactly.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="#"
                className="inline-block underline font-medium"
                style={{ color: "var(--color-status-amber)", fontSize: "14px" }}
                onClick={(e) => {
                  e.preventDefault()
                  downloadCsv("inventory-quantity-template.csv", [["SKU ID", "Quantity"]])
                }}
              >
                Download template sheet
              </a>
              <a
                href="#"
                className="inline-block underline font-medium"
                style={{ color: "var(--color-status-amber)", fontSize: "14px" }}
                onClick={(e) => {
                  e.preventDefault()
                  const parts = getInventoryPartsSnapshot()
                  downloadCsv("parts-library.csv", [
                    ["SKU ID", "Part name", "Location"],
                    ...parts.map((part) => [part.skuId, part.partName, part.location]),
                  ])
                }}
              >
                Download parts library sheet
              </a>
            </div>
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
        title="Bulk add quantities"
        subtitle="Increase on-hand stock for existing parts"
        showBackButton
        onBack={() => setStep("upload")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: handleImport,
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
            Quantities ready to import
          </h3>

          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with adding these quantities to on-hand stock.
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
                <p className="mt-2 font-semibold" style={{ fontSize: "28px", color: "var(--color-success-bright)" }}>
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
