import { Download } from "lucide-react"
import { toast } from "sonner"

import { Modal, InfoGrid, StatusBadge } from "@/components/max"
import { Button } from "@/components/ui/button"
import { type EarlyTerminationContract, earlyTerminationStatusVariantMap } from "@/data/mockEarlyTermination"
import { formatCurrency, type SettlementQuote } from "./earlyTerminationCalculations"

interface GenerateSettlementQuoteModalProps {
  open: boolean
  onClose: () => void
  contract: EarlyTerminationContract
  quote: SettlementQuote
  settlementDateLabel: string
}

export function GenerateSettlementQuoteModal({
  open,
  onClose,
  contract,
  quote,
  settlementDateLabel,
}: GenerateSettlementQuoteModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Settlement Quote"
      subtitle={`${contract.contractNumber} · Generated ${settlementDateLabel}`}
      className="max-w-2xl"
      secondaryAction={{ label: "Close", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <StatusBadge variant={earlyTerminationStatusVariantMap[contract.status]}>{contract.status}</StatusBadge>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => toast.info("PDF generation isn't available in this preview.")}
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>

        <div className="rounded-lg bg-brand-dark px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Settlement Amount</span>
          <span className="text-2xl font-semibold text-white">{formatCurrency(quote.settlementAmount)}</span>
        </div>

        <InfoGrid
          columns={2}
          showDividers
          items={[
            { label: "Customer", value: contract.customerName },
            { label: "Vehicle", value: `${contract.vehicleManufacturer} ${contract.vehicleModel} (${contract.vehicleTypeLabel})` },
            { label: "Contract Number", value: contract.contractNumber },
            { label: "Pricing Template", value: contract.pricingTemplateName },
            { label: "Months Elapsed", value: quote.monthsElapsed },
            { label: "Remaining Tenor", value: `${quote.remainingTenorMonths} months` },
            { label: "Outstanding Balance", value: formatCurrency(quote.outstandingBalance) },
            { label: "Collection Rate", value: `${quote.collectionRate.toFixed(1)}%` },
            { label: "Remaining Contract Value", value: formatCurrency(quote.remainingContractValue) },
            { label: "Applicable Credits", value: formatCurrency(contract.applicableCredits) },
          ]}
        />
      </div>
    </Modal>
  )
}
