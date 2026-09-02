import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { ConfirmModal, LoaderModal } from "@/components/max"

interface RerunableContract {
  contractId: string
}

interface RerunContractModalProps<T extends RerunableContract> {
  contract: T | null
  onClose: () => void
  onComplete: (contract: T) => void
}

export function RerunContractModal<T extends RerunableContract>({
  contract,
  onClose,
  onComplete,
}: RerunContractModalProps<T>) {
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!contract) setIsRunning(false)
  }, [contract])

  const handleConfirm = () => {
    if (!contract) return
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      onComplete(contract)
      onClose()
    }, 1200)
  }

  return (
    <>
      <ConfirmModal
        open={contract !== null && !isRunning}
        onOpenChange={onClose}
        variant="default"
        icon={RefreshCw}
        title="Re-run repricing for this contract?"
        subtitle={
          contract
            ? `${contract.contractId} will be re-evaluated against the current active rule immediately.`
            : undefined
        }
        primaryAction={{ label: "Re-run Repricing", onClick: handleConfirm }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      />
      <LoaderModal open={contract !== null && isRunning} message="Re-running repricing..." />
    </>
  )
}
