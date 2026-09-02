import { useEffect, useState } from "react"

import { Modal } from "@/components/max"
import { Textarea } from "@/components/ui/textarea"
import { type RepricingException } from "@/data/mockRepricingExceptions"

interface ApproveOverrideModalProps {
  exception: RepricingException | null
  onClose: () => void
  onApprove: (exception: RepricingException, notes: string) => void
}

export function ApproveOverrideModal({ exception, onClose, onApprove }: ApproveOverrideModalProps) {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!exception) setNotes("")
  }, [exception])

  const isValid = notes.trim().length > 0

  const handleApprove = () => {
    if (!exception || !isValid) return
    onApprove(exception, notes.trim())
  }

  return (
    <Modal
      open={exception !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Approve Override"
      subtitle={
        exception
          ? `${exception.contractId} will be marked resolved with this exception overridden. Sign-off notes are required.`
          : undefined
      }
      primaryAction={{ label: "Approve Override", onClick: handleApprove, disabled: !isValid }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
          Sign-off Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Explain why this exception is safe to override..."
          className="min-h-[120px] bg-input-soft"
        />
      </div>
    </Modal>
  )
}
