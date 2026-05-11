import { XCircle, AlertTriangle } from "lucide-react"
import { Banner } from "@/components/max"
import type { TransferRecord } from "@/data/mockTransferRecords"
import { isOwnershipTransferred, isReturnedForCorrection, isAwaitingApproval } from "@/data/mockTransferRecords"

interface Props {
  record: TransferRecord
  commenced: boolean
}

export function TransferBanners({ record, commenced }: Props) {
  if (isOwnershipTransferred(record)) {
    return (
      <Banner
        variant="success"
        title="Ownership Transfer Complete"
        description="This vehicle has been successfully transferred. The champion is now the registered owner. Review the activity log for the full transfer history."
      />
    )
  }

  return (
    <>
      {record.breached && !commenced && (
        <Banner
          variant="danger"
          icon={<AlertTriangle className="h-5 w-5 text-status-danger" />}
          title={`SLA Breached — ${record.days - record.sla} days overdue`}
          description={`Transfer has been In Progress for ${record.days} days against a ${record.sla}-day SLA.`}
        />
      )}

      {commenced && (
        <Banner
          variant="success"
          title="Transfer commenced"
          description={
            <>
              Status updated to <strong>Transfer In Progress</strong>. Complete the checklist and upload the signed document to submit for FM approval.
            </>
          }
        />
      )}

      {!commenced && isReturnedForCorrection(record) && (
        <div className="rounded-lg border border-status-danger/30 bg-status-danger/[0.06] px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-status-danger shrink-0" />
            <p className="font-bold text-sm text-status-danger">Returned for Correction</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Rejected by Fleet Manager · Today at 10:05</p>
          <p className="text-sm text-foreground">
            <span className="font-semibold">Reason</span> — "The uploaded document appears to be an unsigned draft. Please ensure the champion has signed the document and re-upload the correct version."
          </p>
        </div>
      )}

      {!commenced && isAwaitingApproval(record) && (
        <Banner
          variant="info"
          title="Awaiting your approval"
          description="The Documentation Officer has completed all required steps and submitted this record. Review the checklist and document before approving or rejecting."
        />
      )}
    </>
  )
}
