import { useEffect, useState } from "react"
import { PlayCircle } from "lucide-react"

import { ConfirmModal, LoaderModal } from "@/components/max"

interface RunRepricingModalProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

export function RunRepricingModal({ open, onClose, onComplete }: RunRepricingModalProps) {
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!open) setIsRunning(false)
  }, [open])

  const handleConfirm = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      onComplete()
      onClose()
    }, 1500)
  }

  return (
    <>
      <ConfirmModal
        open={open && !isRunning}
        onOpenChange={onClose}
        variant="default"
        icon={PlayCircle}
        title="Run repricing now?"
        subtitle="Every contract currently in the Repricing stage will be evaluated against the active rules immediately, outside the scheduled window."
        primaryAction={{ label: "Run Repricing", onClick: handleConfirm }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      />
      <LoaderModal open={open && isRunning} message="Running repricing session..." />
    </>
  )
}
