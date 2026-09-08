import { useEffect, useRef, useState } from "react"

import {
  BulkValidationReport,
  DocUpload,
  FormField,
  InfoCard,
  LoaderModal,
  Modal,
  StatusBadge,
} from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ActivationRecord } from "@/data/mockActivationRecords"
import { STAGES, type StageKey } from "./stages"
import {
  applyBulkUpdates,
  buildPreviewRows,
  csvHeaders,
  downloadCsv,
  STAGE_CSV_COLUMNS,
  stageLabel,
  type BulkAction,
  type BulkPreviewRow,
} from "./bulkUpload"

type WizardStep = "select" | "upload" | "validating" | "review" | "importing" | "imported"

const ACTION_OPTIONS: { value: BulkAction; label: string }[] = [
  { value: "start", label: "Start new activation" },
  { value: "complete", label: "Complete pending activation" },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: ActivationRecord[]
  onApply: (next: ActivationRecord[]) => void
}

export function BulkActivationUploadModal({ open, onOpenChange, records, onApply }: Props) {
  const [step, setStep] = useState<WizardStep>("select")
  const [action, setAction] = useState<BulkAction>("start")
  const [stage, setStage] = useState<StageKey | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)
  const [previewRows, setPreviewRows] = useState<BulkPreviewRow[]>([])
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (open) return undefined
    clearTimer()
    setStep("select")
    setAction("start")
    setStage(undefined)
    setFile(null)
    setPreviewRows([])
    return clearTimer
  }, [open])

  const close = () => onOpenChange(false)
  const columns = stage ? STAGE_CSV_COLUMNS[stage] : []
  const errorCount = previewRows.filter((row) => row.status === "error").length
  const applyCount = previewRows.filter((row) => row.status !== "error").length
  const stats = {
    totalRows: previewRows.length,
    validEntries: applyCount,
    rowsWithErrors: errorCount,
  }

  const downloadTemplate = () => {
    if (!stage) return
    downloadCsv(`activation-${stage}-${action}-template.csv`, csvHeaders(stage), [])
  }

  const downloadErrorReport = () => {
    if (!stage || errorCount === 0) return
    const headers = ["status", "issue", ...csvHeaders(stage), "sub_batch"]
    const rows = previewRows
      .filter((row) => row.status === "error")
      .map((row) => [
        row.status,
        row.issue ?? "",
        ...csvHeaders(stage).map((key) => row.values[key] ?? ""),
        row.values.sub_batch ?? "",
      ])
    downloadCsv(`activation-${stage}-${action}-errors.csv`, headers, rows)
  }

  const goValidate = () => {
    if (!stage) return
    setStep("validating")
    timerRef.current = window.setTimeout(() => {
      setPreviewRows(buildPreviewRows(stage, action, records))
      setStep("review")
    }, 2000)
  }

  const goImport = () => {
    if (!stage) return
    setStep("importing")
    timerRef.current = window.setTimeout(() => {
      onApply(applyBulkUpdates(records, stage, action, previewRows))
      setStep("imported")
    }, 2000)
  }

  const mainOpen = open && (step === "select" || step === "upload" || step === "review")

  return (
    <>
      <Modal
        open={mainOpen}
        onOpenChange={(next) => { if (!next) close() }}
        title="Bulk Activation Upload"
        subtitle="Update multiple vehicle activation statuses at once"
        className={step === "review" ? "max-w-xl" : "max-w-3xl"}
        maxHeight="80vh"
        showBackButton={step === "upload" || step === "review"}
        onBack={() => setStep(step === "review" ? "upload" : "select")}
        secondaryAction={
          step === "review"
            ? errorCount > 0
              ? { label: "Download error report", onClick: downloadErrorReport }
              : { label: "Cancel", onClick: close }
            : { label: "Cancel", onClick: close }
        }
        primaryAction={
          step === "select"
            ? { label: "Next", onClick: () => setStep("upload"), disabled: !stage }
            : step === "upload"
              ? { label: "Validate data", onClick: goValidate, disabled: !file }
              : {
                  label: `Apply ${applyCount} update${applyCount === 1 ? "" : "s"}`,
                  onClick: goImport,
                  disabled: applyCount === 0,
                }
        }
      >
        {step === "select" && (
          <div className="flex flex-col gap-4">
            <FormField label="What do you want to do?">
              <div className="flex min-w-0 w-full items-center gap-1 rounded-md bg-gray-100 p-0.5">
                {ACTION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAction(option.value)}
                    className={cn(
                      "flex-1 rounded px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                      action === option.value
                        ? "bg-white text-gray-950 shadow-sm"
                        : "text-gray-500 hover:text-gray-950"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FormField>

            <div className="flex flex-col gap-2">
              <FormField label="Select Stage">
                <Select value={stage} onValueChange={(value) => setStage(value as StageKey)}>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((item) => (
                      <SelectItem key={item.key} value={item.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              {stage && (
                <button
                  type="button"
                  className="underline font-medium text-status-warning text-left"
                  style={{ fontSize: "14px" }}
                  onClick={downloadTemplate}
                >
                  Download {stageLabel(stage)} Template Sheets
                </button>
              )}
            </div>

            {stage && (
              <InfoCard title="Required CSV columns for this stage">
                <div className="flex flex-wrap gap-2">
                  {columns.map((col) => (
                    <StatusBadge key={col.key} variant="default" withDot={false}>
                      {col.key}
                    </StatusBadge>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>
        )}

        {step === "upload" && stage && (
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
                {action === "start"
                  ? "Start new activations in bulk"
                  : "Complete pending activations in bulk"}
              </h4>
              <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
                Use the provided template to {action === "start" ? "start" : "complete"} {stageLabel(stage)} for multiple vehicles and upload it to apply updates across selected records.
              </p>
              <button
                type="button"
                className="mt-4 inline-block underline font-medium text-status-warning"
                style={{ fontSize: "14px" }}
                onClick={downloadTemplate}
              >
                Download {stageLabel(stage)} Template Sheets
              </button>
              <div className="pt-2">
                <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
              </div>
            </div>
          </div>
        )}

        {step === "review" && (
          <BulkValidationReport
            stats={stats}
            successTitle="Activation data ready to import"
            successDescription="All entries have been successfully validated. You can proceed with applying these activation updates."
            errorTitle="Some activation rows could not be validated"
            errorDescription="Required columns are missing or some vehicles could not be matched. You can apply the valid updates now, and download the error report for the rows that need to be fixed."
          />
        )}
      </Modal>

      <LoaderModal open={open && step === "validating"} message="Validating file..." />
      <LoaderModal open={open && step === "importing"} message="Importing activation data..." />

      <Modal
        open={open && step === "imported"}
        onOpenChange={close}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Import successful!
          </p>
          <button
            onClick={close}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
