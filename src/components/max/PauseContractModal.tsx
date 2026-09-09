import { useState } from "react"

import { Modal } from "./Modal"
import { Textarea } from "@/components/ui/textarea"

interface PauseContractModalProps {
  open: boolean
  onClose: () => void
  championName: string
  contractId: string
  onConfirm: (reason: string) => void
}

export function PauseContractModal({ open, onClose, championName, contractId, onConfirm }: PauseContractModalProps) {
  const [reason, setReason] = useState("")
  const isValid = reason.trim().length > 0

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm(reason.trim())
    setReason("")
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason("")
          onClose()
        }
      }}
      title="Pause Contract"
      subtitle={`${championName} · ${contractId}`}
      primaryAction={{ label: "Pause Contract", onClick: handleConfirm, disabled: !isValid }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-table-text">
          Pausing this contract stops daily remittance collection until it's resumed. A reason is
          required and will be recorded in the pause history.
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
            Reason for Pausing *
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Vehicle in the workshop for repairs..."
            className="min-h-[100px] bg-input-soft"
          />
        </div>
      </div>
    </Modal>
  )
}
