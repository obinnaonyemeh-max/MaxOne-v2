import { useEffect, useState } from "react"
import { Modal } from "@/components/max"
import { Textarea } from "@/components/ui/textarea"
import {
  ENFORCEMENT_ACTION_LABELS,
  type EnforcementRecord,
} from "@/data/mockEnforcement"

interface ReverseEnforcementModalProps {
  open: boolean
  record: EnforcementRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function ReverseEnforcementModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: ReverseEnforcementModalProps) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!open) setReason("")
  }, [open])

  const actionLabel = record ? ENFORCEMENT_ACTION_LABELS[record.action] : "enforcement"

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reverse enforcement"
      className="max-w-lg"
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
      primaryAction={{
        label: "Reverse enforcement",
        disabled: !reason.trim(),
        onClick: () => {
          if (!reason.trim()) return
          onConfirm(reason.trim())
        },
      }}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sidebar-item-active" style={{ fontSize: "14px" }}>
          You are about to reverse{" "}
          <span className="font-semibold">{actionLabel}</span> on{" "}
          <span className="font-semibold">{record?.plateNumber}</span> for{" "}
          <span className="font-semibold">{record?.championName}</span>. This will
          lift the restriction and log the reversal in the vehicle’s enforcement
          history.
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
            Reason for reversal
          </label>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this enforcement is being reversed..."
            className="min-h-[120px] resize-y bg-white border-gray-200"
          />
        </div>
      </div>
    </Modal>
  )
}
