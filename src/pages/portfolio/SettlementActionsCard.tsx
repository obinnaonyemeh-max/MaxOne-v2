import { useState } from "react"
import { toast } from "sonner"
import { Download, FileText, ArrowLeftRight, Ban } from "lucide-react"

import { ConfirmModal, LoaderModal } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"

interface SettlementActionsCardProps {
  contract: EarlyTerminationContract
  onCancel: () => void
}

export function SettlementActionsCard({ contract, onCancel }: SettlementActionsCardProps) {
  const [transferStep, setTransferStep] = useState<"idle" | "confirm" | "running">("idle")

  const handleExport = () => {
    toast.success("Settlement breakdown exported", { description: `${contract.contractNumber}-settlement.csv` })
  }

  const handleGenerateLetter = () => {
    toast.success("Settlement letter generated", { description: `Ready for ${contract.customerName}.` })
  }

  const handleTransferConfirm = () => {
    setTransferStep("running")
    setTimeout(() => {
      setTransferStep("idle")
      toast.success("Asset transfer initiated", {
        description: `${contract.vehicleManufacturer} ${contract.vehicleModel} · ${contract.vehiclePlate}`,
      })
    }, 1200)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-10 gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Settlement Breakdown
        </Button>
        <Button variant="outline" className="h-10 gap-2" onClick={handleGenerateLetter}>
          <FileText className="h-4 w-4" />
          Generate Settlement Letter
        </Button>
        <Button variant="outline" className="h-10 gap-2" onClick={() => setTransferStep("confirm")}>
          <ArrowLeftRight className="h-4 w-4" />
          Proceed to Asset Transfer
        </Button>
        <Button variant="ghost" className="h-10 gap-2 ml-auto text-muted-foreground" onClick={onCancel}>
          <Ban className="h-4 w-4" />
          Cancel
        </Button>
      </div>

      <ConfirmModal
        open={transferStep === "confirm"}
        onOpenChange={(open) => !open && setTransferStep("idle")}
        variant="default"
        icon={ArrowLeftRight}
        title="Proceed to asset transfer?"
        subtitle={`${contract.vehicleManufacturer} ${contract.vehicleModel} · ${contract.vehiclePlate} will be routed for asset transfer.`}
        primaryAction={{ label: "Proceed", onClick: handleTransferConfirm }}
        secondaryAction={{ label: "Cancel", onClick: () => setTransferStep("idle") }}
      />
      <LoaderModal open={transferStep === "running"} message="Initiating asset transfer..." />
    </div>
  )
}
