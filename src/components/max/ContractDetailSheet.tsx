import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { format, parse, addMonths } from "date-fns"
import { ChevronDown, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { ContractInformation } from "./ContractInformation"
import {
  type Contract,
  statusVariantMap,
  categoryVariantMap,
  disputeStatusVariantMap,
} from "@/data/mockContracts"

interface ContractDetailSheetProps {
  contract: Contract | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (id: string, updates: Partial<Contract>) => void
}

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const CURRENT_OFFICER = "Desmond Nsogbuwa"

type SectionKey = "details" | "payment" | "schedule" | "asset"

interface AmortisationRow {
  trancheNumber: number
  dueDate: string
  amount: number
  status: "Paid" | "Pending"
}

// Splits the hire-purchase amount evenly across tranches (one per month from the
// amortisation start date) and marks tranches "Paid" up to the contract's recorded
// totalAmountRemitted, so the schedule always reconciles with Payment Details. A
// "Completed" contract is always shown as fully paid, matching its table status.
function buildAmortisationSchedule(contract: Contract): AmortisationRow[] {
  const { tranches, hpAmount, totalAmountRemitted, amortisationStartDate } = contract.metrics
  if (tranches <= 0) return []

  const baseAmount = Math.floor(hpAmount / tranches)
  const start = parse(amortisationStartDate, "dd MMM yyyy", new Date())
  let remaining = contract.status === "Completed" ? hpAmount : totalAmountRemitted

  return Array.from({ length: tranches }, (_, i) => {
    const isLast = i === tranches - 1
    const amount = isLast ? hpAmount - baseAmount * (tranches - 1) : baseAmount
    const paid = remaining >= amount
    if (paid) remaining -= amount
    return {
      trancheNumber: i + 1,
      dueDate: format(addMonths(start, i + 1), "dd MMM yyyy"),
      amount,
      status: paid ? "Paid" : "Pending",
    }
  })
}

export function ContractDetailSheet({ contract, isOpen, onClose, onUpdate }: ContractDetailSheetProps) {
  const navigate = useNavigate()
  const [showApprove, setShowApprove] = useState(false)
  const [showDispute, setShowDispute] = useState(false)
  const [showResolve, setShowResolve] = useState(false)
  const [showMarkToMarket, setShowMarkToMarket] = useState(false)
  const [disputeRationale, setDisputeRationale] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSection, setOpenSection] = useState<SectionKey>("details")

  useEffect(() => {
    setShowApprove(false)
    setShowDispute(false)
    setShowResolve(false)
    setShowMarkToMarket(false)
    setDisputeRationale("")
    setIsSubmitting(false)
    setOpenSection("details")
  }, [contract?.id])

  if (!contract) return null

  const isPendingApproval = contract.category === "Pending Approval"
  const isDisputed = contract.category === "Disputed"
  const isDisputePending = isDisputed && contract.disputeStatus === "Pending Resolve"
  const isUndergoingRestructuring =
    contract.category === "Restructured" && contract.restructureStage === "Undergoing Restructuring"

  const metricsItems = [
    { label: "HP Amount", value: formatCurrency(contract.metrics.hpAmount) },
    { label: "Total Duration", value: `${contract.metrics.totalDurationDays} days` },
    { label: "Daily Remittance Amount", value: formatCurrency(contract.metrics.dailyRemittanceAmount) },
    { label: "Excess Payments", value: contract.metrics.excessPayments > 0 ? formatCurrency(contract.metrics.excessPayments) : "None" },
    {
      label: "Total Amount Remitted",
      value: formatCurrency(
        contract.status === "Completed" ? contract.metrics.hpAmount : contract.metrics.totalAmountRemitted
      ),
    },
    { label: "Amortisation Start Date", value: contract.metrics.amortisationStartDate },
    { label: "Amortisation End Date", value: contract.metrics.amortisationEndDate },
    { label: "Tranches", value: contract.metrics.tranches },
  ]

  // Mirrors elapsed time off the contract's own payment progress (totalAmountRemitted
  // vs. hpAmount) rather than the real wall-clock date, since the mock date ranges
  // don't track "today" — this keeps the widget in bounds and varies per contract.
  // A "Completed" contract is always shown as fully elapsed, matching its table status.
  const totalDays = contract.metrics.totalDurationDays
  const paymentProgress = contract.metrics.hpAmount > 0
    ? contract.metrics.totalAmountRemitted / contract.metrics.hpAmount
    : 0
  const percentageElapsed = contract.status === "Completed" ? 100 : Math.min(100, Math.round(paymentProgress * 100))
  const daysElapsed = contract.status === "Completed" ? totalDays : Math.min(totalDays, Math.round(paymentProgress * totalDays))

  const schedule = buildAmortisationSchedule(contract)

  const toggleSection = (key: SectionKey) => setOpenSection(key)

  const handleViewChampion = () => {
    onClose()
    navigate(`/portfolio/champions/overview/${contract.id}`)
  }

  const handleApprove = () => {
    setShowApprove(false)
    onUpdate?.(contract.id, { category: "Standard", status: "Active" })
    onClose()
    toast.success("Contract approved.", {
      description: `${contract.contractId} has moved out of Pending Approval and is now active.`,
    })
  }

  const handleDispute = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowDispute(false)
      onUpdate?.(contract.id, {
        category: "Disputed",
        status: "Paused",
        disputeStatus: "Pending Resolve",
        disputeComment: {
          rationale: disputeRationale,
          reporter: CURRENT_OFFICER,
          timestamp: format(new Date(), "d MMM yyyy, h:mm a"),
        },
      })
      onClose()
      toast.success("Contract disputed.", {
        description: `${contract.contractId} has been flagged and moved to Disputed Contracts.`,
      })
    }, 1200)
  }

  const handleResolve = () => {
    setShowResolve(false)
    onUpdate?.(contract.id, { status: "Active", disputeStatus: "Resolved" })
    onClose()
    toast.success("Dispute resolved.", {
      description: `${contract.contractId} has been marked as resolved.`,
    })
  }

  const handleMarkToMarket = () => {
    setShowMarkToMarket(false)
    onUpdate?.(contract.id, { restructureStage: "Awaiting Checkout" })
    onClose()
    toast.success("Contract marked to market.", {
      description: `${contract.contractId} has been revalued and moved to Awaiting Checkout.`,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{contract.championName}</SheetTitle>
            <StatusBadge variant={statusVariantMap[contract.status]}>{contract.status}</StatusBadge>
            <StatusBadge variant={categoryVariantMap[contract.category]}>{contract.category}</StatusBadge>
            {isDisputed && contract.disputeStatus && (
              <StatusBadge variant={disputeStatusVariantMap[contract.disputeStatus]} withDot>
                {contract.disputeStatus}
              </StatusBadge>
            )}
          </div>
          <SheetDescription>
            {contract.maxId} &middot; {contract.contractId} &middot; {contract.vehiclePlate}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <ContractInformation
            percentage={percentageElapsed}
            totalDays={totalDays}
            daysElapsed={daysElapsed}
            startDate={contract.metrics.amortisationStartDate}
            endDate={contract.metrics.amortisationEndDate}
            animate={false}
          />

          {isDisputed && contract.disputeComment && (
            <div className="rounded-md border border-status-danger/30 bg-status-danger/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-status-danger">
                  Dispute Comment
                </p>
                <p className="text-xs text-breadcrumb-root">{contract.disputeComment.timestamp}</p>
              </div>
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                {contract.disputeComment.rationale}
              </p>
              <p className="text-xs font-medium text-breadcrumb-root">
                Reported by {contract.disputeComment.reporter}
              </p>
            </div>
          )}

          {/* Contract Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Contract Details
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "details" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "details" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Champion", value: contract.championName },
                    { label: "MAX ID", value: contract.maxId },
                    { label: "Location", value: contract.location },
                    { label: "Vehicle", value: `${contract.vehiclePlate} (${contract.vehicleType})` },
                    { label: "Monthly Amount", value: formatCurrency(contract.monthlyAmount) },
                    { label: "Outstanding Balance", value: formatCurrency(contract.outstandingBalance) },
                    { label: "Start Date", value: contract.startDate },
                    { label: "End Date", value: contract.endDate },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("payment")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Payment Details
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "payment" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "payment" && (
              <div className="px-4 pb-4">
                <InfoGrid columns={2} items={metricsItems} />
              </div>
            )}
          </div>

          {/* Asset Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("asset")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Asset Details
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "asset" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "asset" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Vehicle Type", value: contract.vehicleType },
                    { label: "Model", value: contract.asset.model },
                    { label: "Plate Number", value: contract.vehiclePlate },
                    { label: "OEM Vendor", value: contract.asset.oemVendor },
                    { label: "Chassis Number (VIN)", value: contract.asset.chassisNumber },
                    { label: "Engine Number", value: contract.asset.engineNumber },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Amortisation Schedule */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("schedule")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Amortisation Schedule
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "schedule" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "schedule" && (
              <div className="px-4 pb-4">
                <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                  <div className="grid grid-cols-4 gap-2 bg-gray-100 px-3 py-2 text-xs font-medium text-breadcrumb-root">
                    <span>Tranche</span>
                    <span>Due Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {schedule.map((row) => (
                      <div key={row.trancheNumber} className="grid grid-cols-4 items-center gap-2 px-3 py-2">
                        <span className="text-sm font-medium text-table-text-primary">#{row.trancheNumber}</span>
                        <span className="text-sm text-table-text">{row.dueDate}</span>
                        <span className="text-sm text-table-text">{formatCurrency(row.amount)}</span>
                        <StatusBadge variant={row.status === "Paid" ? "success" : "default"} size="sm">
                          {row.status}
                        </StatusBadge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          <Button variant="secondary" className="h-9 px-3 gap-1.5" onClick={handleViewChampion}>
            See Champion Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          {(isPendingApproval || isDisputePending || isUndergoingRestructuring) && (
            <div className="flex flex-wrap items-center gap-2">
              {isPendingApproval && (
                <>
                  <Button
                    variant="outline"
                    className="h-9 px-3 border-status-danger text-status-danger hover:bg-status-danger/10"
                    onClick={() => {
                      setDisputeRationale("")
                      setShowDispute(true)
                    }}
                  >
                    Dispute Contract
                  </Button>
                  <Button
                    className="h-9 px-3 bg-brand-dark text-white hover:bg-brand-dark/90"
                    onClick={() => setShowApprove(true)}
                  >
                    Approve Contract
                  </Button>
                </>
              )}
              {isDisputePending && (
                <Button
                  className="h-9 px-3 bg-brand-dark text-white hover:bg-brand-dark/90"
                  onClick={() => setShowResolve(true)}
                >
                  Resolve
                </Button>
              )}
              {isUndergoingRestructuring && (
                <Button
                  className="h-9 px-3 bg-brand-dark text-white hover:bg-brand-dark/90"
                  onClick={() => setShowMarkToMarket(true)}
                >
                  Mark to Market
                </Button>
              )}
            </div>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Approve confirmation */}
      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Approve Contract</DialogTitle>
            <DialogDescription>
              {contract.championName} &middot; {contract.contractId}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="rounded-md border border-badge-active-text/30 bg-badge-active-bg px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                Approving will move this contract out of Pending Approval and activate it.
              </p>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowApprove(false)}>
              Cancel
            </Button>
            <Button className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90" onClick={handleApprove}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute — requires rationale */}
      <Dialog open={showDispute} onOpenChange={setShowDispute}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Dispute Contract</DialogTitle>
            <DialogDescription>
              {contract.championName} &middot; {contract.contractId}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                This contract will move to Disputed Contracts and be flagged for resolution.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Dispute Rationale <span className="text-status-danger">*</span>
              </label>
              <Textarea
                value={disputeRationale}
                onChange={(e) => setDisputeRationale(e.target.value)}
                placeholder="Describe the reason for disputing this contract..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowDispute(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={!disputeRationale.trim() || isSubmitting}
              onClick={handleDispute}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Disputing..." : "Dispute Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve confirmation */}
      <Dialog open={showResolve} onOpenChange={setShowResolve}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              {contract.championName} &middot; {contract.contractId}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="rounded-md border border-badge-active-text/30 bg-badge-active-bg px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                Marking this dispute as resolved will reactivate the contract.
              </p>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowResolve(false)}>
              Cancel
            </Button>
            <Button className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90" onClick={handleResolve}>
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark to Market confirmation */}
      <Dialog open={showMarkToMarket} onOpenChange={setShowMarkToMarket}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Mark to Market</DialogTitle>
            <DialogDescription>
              {contract.championName} &middot; {contract.contractId}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="rounded-md border border-badge-active-text/30 bg-badge-active-bg px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                This will revalue the contract to current market terms and move it to Awaiting Checkout.
              </p>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowMarkToMarket(false)}>
              Cancel
            </Button>
            <Button className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90" onClick={handleMarkToMarket}>
              Mark to Market
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
