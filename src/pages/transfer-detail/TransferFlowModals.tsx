import { ConfirmModal, LoaderModal, Modal } from "@/components/max"
import { Textarea } from "@/components/ui/textarea"
import type { useTransferFlow } from "./useTransferFlow"

type Flow = ReturnType<typeof useTransferFlow>

interface Props {
  flow: Flow
  onBackToList: () => void
  rejectReason: string
  setRejectReason: (s: string) => void
  showRejectConfirm: boolean
  setShowRejectConfirm: (open: boolean) => void
  showApproveConfirm: boolean
  setShowApproveConfirm: (open: boolean) => void
}

export function TransferFlowModals({
  flow,
  onBackToList,
  rejectReason,
  setRejectReason,
  showRejectConfirm,
  setShowRejectConfirm,
  showApproveConfirm,
  setShowApproveConfirm,
}: Props) {
  return (
    <>
      <ConfirmModal
        open={flow.is("submit", "confirm")}
        onOpenChange={(o) => { if (!o) flow.close() }}
        variant="success"
        title="Submit for Approval"
        subtitle="Please confirm you have completed the checklist and uploaded the required ownership transfer document before submitting."
        primaryAction={{ label: "Confirm & Submit", onClick: () => flow.run("submit") }}
        secondaryAction={{ label: "Cancel", onClick: flow.close }}
      />
      <LoaderModal open={flow.is("submit", "submitting")} message="Submitting..." />
      <ConfirmModal
        open={flow.is("submit", "submitted")}
        onOpenChange={() => {}}
        variant="success"
        title="Submitted for Approval"
        subtitle="Your transfer record has been submitted. The Fleet Manager will review and approve or reject it."
        primaryAction={{ label: "Back to All Transfers", onClick: onBackToList }}
      />

      <LoaderModal open={flow.is("approve", "submitting")} message="Approving transfer..." />
      <ConfirmModal
        open={flow.is("approve", "submitted")}
        onOpenChange={() => {}}
        variant="success"
        title="Transfer Approved"
        subtitle="The ownership transfer has been approved. The champion will be notified."
        primaryAction={{ label: "Back to All Transfers", onClick: onBackToList }}
      />

      <LoaderModal open={flow.is("reject", "submitting")} message="Submitting rejection..." />
      <ConfirmModal
        open={flow.is("reject", "submitted")}
        onOpenChange={() => {}}
        variant="destructive"
        title="Rejection Submitted"
        subtitle="The transfer has been rejected and returned to the Documentation Officer for corrections."
        primaryAction={{ label: "Back to All Transfers", onClick: onBackToList }}
      />

      <Modal
        open={showRejectConfirm}
        onOpenChange={(open) => {
          setShowRejectConfirm(open)
          if (!open) setRejectReason("")
        }}
        title="Reject — Return to Officer"
        subtitle="Provide a reason so the officer can make corrections."
        primaryAction={{
          label: "Submit Rejection",
          onClick: () => {
            setShowRejectConfirm(false)
            setRejectReason("")
            flow.run("reject")
          },
          disabled: rejectReason.trim().length === 0,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setShowRejectConfirm(false)
            setRejectReason("")
          },
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Rejection Reason</label>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Describe why this transfer is being returned to the officer..."
            className="min-h-[120px] resize-none"
          />
        </div>
      </Modal>

      <ConfirmModal
        open={showApproveConfirm}
        onOpenChange={setShowApproveConfirm}
        variant="success"
        title="Confirm Approval"
        subtitle="Please confirm that you have reviewed the uploaded document and completed checklist. Approving will finalise the ownership transfer."
        primaryAction={{
          label: "Approve Transfer",
          onClick: () => {
            setShowApproveConfirm(false)
            flow.run("approve")
          },
        }}
        secondaryAction={{ label: "Cancel", onClick: () => setShowApproveConfirm(false) }}
      />
    </>
  )
}
