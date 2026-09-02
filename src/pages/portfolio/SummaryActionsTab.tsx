import { useState } from "react"
import { toast } from "sonner"
import { Download, FileText, ShieldCheck, ArrowLeftRight, Ban, CheckCircle2, AlertTriangle, Info } from "lucide-react"

import { StatCard, ConfirmModal, LoaderModal } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"
import {
  type SettlementQuote,
  type SettlementValidationLevel,
  formatCurrency,
  buildSettlementComputation,
} from "./earlyTerminationCalculations"

interface SummaryActionsTabProps {
  contract: EarlyTerminationContract | null
  quote: SettlementQuote | null
  onApprove: (contractId: string) => void
  onCancel: () => void
}

const validationIcon: Record<SettlementValidationLevel, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const validationTextClass: Record<SettlementValidationLevel, string> = {
  success: "text-status-success",
  warning: "text-status-warning",
  info: "text-muted-foreground",
}

type ActionStep = "idle" | "confirm" | "running"

export function SummaryActionsTab({ contract, quote, onApprove, onCancel }: SummaryActionsTabProps) {
  const [approveStep, setApproveStep] = useState<ActionStep>("idle")
  const [transferStep, setTransferStep] = useState<ActionStep>("idle")

  const settlement = contract && quote ? buildSettlementComputation(contract, quote, false) : null

  if (!contract || !quote || !settlement) {
    return (
      <div className="px-6">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
          <p className="text-sm font-medium text-breadcrumb-root">
            Select a country, customer and contract to review the settlement summary.
          </p>
        </div>
      </div>
    )
  }

  const isTerminated = contract.status === "Completed"

  const handleExport = () => {
    toast.success("Settlement breakdown exported", { description: `${contract.contractNumber}-settlement.csv` })
  }

  const handleGenerateLetter = () => {
    toast.success("Settlement letter generated", { description: `Ready for ${contract.customerName}.` })
  }

  const handleApproveConfirm = () => {
    setApproveStep("running")
    setTimeout(() => {
      setApproveStep("idle")
      onApprove(contract.id)
      toast.success("Early termination approved", { description: `${contract.contractNumber} marked as completed.` })
    }, 1200)
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
    <div className="px-6 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Settlement Amount"
          value={formatCurrency(settlement.settlementAmount)}
          subtitle="Total payout balance"
          indicatorColor="var(--color-brand-primary)"
          className="border-brand-primary bg-brand-primary/5"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(quote.outstandingBalance)}
          subtitle="Active debt balance"
          indicatorColor="var(--color-status-danger)"
        />
        <StatCard
          title="Collection Rate"
          value={`${quote.collectionRate.toFixed(1)}%`}
          subtitle="Actual vs. expected"
          indicatorColor="var(--color-status-success)"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Settlement Validation</span>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
          {settlement.validation.map((item) => {
            const Icon = validationIcon[item.level]
            return (
              <div key={item.key} className="flex items-start gap-2">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${validationTextClass[item.level]}`} />
                <span className={`text-sm ${item.level === "info" ? "text-muted-foreground" : "text-table-text-primary"}`}>
                  {item.message}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-10 gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Settlement Breakdown
        </Button>
        <Button variant="outline" className="h-10 gap-2" onClick={handleGenerateLetter}>
          <FileText className="h-4 w-4" />
          Generate Settlement Letter
        </Button>
        <Button variant="outline" className="h-10 gap-2" disabled={isTerminated} onClick={() => setApproveStep("confirm")}>
          <ShieldCheck className="h-4 w-4" />
          {isTerminated ? "Termination Approved" : "Approve Early Termination"}
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
        open={approveStep === "confirm"}
        onOpenChange={(open) => !open && setApproveStep("idle")}
        variant="warning"
        icon={ShieldCheck}
        title="Approve early termination?"
        subtitle={`${contract.contractNumber} will be marked as terminated and settled for ${formatCurrency(settlement.settlementAmount)}. This cannot be undone.`}
        primaryAction={{ label: "Approve Termination", onClick: handleApproveConfirm }}
        secondaryAction={{ label: "Cancel", onClick: () => setApproveStep("idle") }}
      />
      <LoaderModal open={approveStep === "running"} message="Approving early termination..." />

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
