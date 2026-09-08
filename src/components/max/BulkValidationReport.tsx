import { cn } from "@/lib/utils"

export interface BulkValidationStats {
  totalRows: number
  validEntries: number
  rowsWithErrors: number
}

interface BulkValidationReportProps {
  stats: BulkValidationStats
  successTitle: string
  successDescription: string
  errorTitle?: string
  errorDescription?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function BulkValidationReport({
  stats,
  successTitle,
  successDescription,
  errorTitle = "Some rows could not be validated",
  errorDescription = "You can apply the valid entries now. Download the error report to fix the remaining rows and upload them again.",
  emptyTitle = "No valid rows to import",
  emptyDescription = "None of the rows could be validated. Download the error report, fix the file, and upload again.",
}: BulkValidationReportProps) {
  const hasErrors = stats.rowsWithErrors > 0
  const hasValid = stats.validEntries > 0
  const isEmptyError = hasErrors && !hasValid

  const title = isEmptyError ? emptyTitle : hasErrors ? errorTitle : successTitle
  const description = isEmptyError ? emptyDescription : hasErrors ? errorDescription : successDescription

  return (
    <div className="flex flex-col items-center py-6">
      {hasErrors ? (
        <img src="/images/warning_Checkmark.svg" alt="Validation issues" className="h-16 w-16" />
      ) : (
        <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
      )}

      <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
        {title}
      </h3>
      <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
        {description}
      </p>

      <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <StatCell label="Total Rows" value={stats.totalRows} />
          <StatCell
            label="Valid Entries"
            value={stats.validEntries}
            valueClassName="text-status-success"
          />
          <StatCell
            label="Rows with Errors"
            value={stats.rowsWithErrors}
            valueClassName={hasErrors ? "text-status-danger" : undefined}
          />
        </div>
      </div>
    </div>
  )
}

function StatCell({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: number
  valueClassName?: string
}) {
  return (
    <div className="text-center px-4">
      <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
        {label}
      </p>
      <p
        className={cn("mt-2 font-semibold text-sidebar-item-active", valueClassName)}
        style={{ fontSize: "28px" }}
      >
        {value}
      </p>
    </div>
  )
}
