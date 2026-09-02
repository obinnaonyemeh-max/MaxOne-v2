import { useState, useEffect } from "react"

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
import { InfoCard } from "./InfoCard"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  type MarkedTransferRecord,
  statusVariantMap,
} from "@/data/mockMarkedTransfers"
import { Loader2, Eye } from "lucide-react"

interface TransferRequestSheetProps {
  transfer: MarkedTransferRecord | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (id: string, status: MarkedTransferRecord["status"], rejectionReason?: string) => void
  readOnly?: boolean
}

export function TransferRequestSheet({ transfer, isOpen, onClose, onStatusChange, readOnly = false }: TransferRequestSheetProps) {
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [showContractPreview, setShowContractPreview] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setShowApprove(false)
    setShowReject(false)
    setShowContractPreview(false)
    setConfirmed(false)
    setRejectionReason("")
    setIsSubmitting(false)
  }, [transfer?.id])

  if (!transfer) return null

  const isPending = transfer.status === "Pending"
  const isRejected = transfer.status === "Rejected"

  const handleApprove = () => {
    setShowApprove(false)
    onStatusChange?.(transfer.id, "Approved")
    onClose()
    toast.success("Ownership transfer approved.", {
      description: `${transfer.championName}'s contract completion transfer has been approved. Vehicle handover can proceed.`,
    })
  }

  const handleReject = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowReject(false)
      onStatusChange?.(transfer.id, "Rejected", rejectionReason)
      onClose()
      toast.success("Transfer request rejected", {
        description: `${transfer.championName}'s ownership transfer has been rejected and assigned to a welfare officer for follow-up.`,
      })
    }, 1500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{transfer.championName}</SheetTitle>
            <StatusBadge variant={statusVariantMap[transfer.status]} withDot>
              {transfer.status}
            </StatusBadge>
          </div>
          <SheetDescription>
            {transfer.championId} &middot; Requested {transfer.requestDate}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Rejection Reason — only for Rejected records */}
          {isRejected && transfer.rejectionReason && (
            <div className="rounded-md border border-status-danger/30 bg-status-danger/5 px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-status-danger">Rejection Reason</p>
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                {transfer.rejectionReason}
              </p>
            </div>
          )}

          {/* Contract Documentation */}
          <div className="flex items-start justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5">
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-5">
                <img src="/images/contract-icon.png" alt="Contract document" className="h-16 w-16" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-brand-dark">
                    MAX-HP-{transfer.contractId}.pdf
                  </p>
                  <p className="text-xs font-medium text-brand-dark/50 capitalize">
                    Contract Completed {transfer.contractEndDate}
                  </p>
                </div>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-brand-dark">
                Request Generated on {transfer.requestDate}
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-9 gap-2 rounded-lg bg-gray-100 px-3 text-xs font-medium text-brand-dark hover:bg-gray-200"
              onClick={() => setShowContractPreview(true)}
            >
              <Eye className="h-4 w-4" />
              Preview Contract
            </Button>
          </div>

          <InfoCard title="Transfer Request Details">
            <InfoGrid
              columns={2}
              items={[
                { label: "Contract ID", value: transfer.contractId },
                { label: "Contract End Date", value: transfer.contractEndDate },
                { label: "Final Payment Date", value: transfer.finalPaymentDate },
                { label: "Outstanding Balance", value: transfer.outstandingBalance },
                { label: "Vehicle Condition", value: transfer.vehicleCondition },
                { label: "Handover Status", value: transfer.handoverStatus },
                { label: "Trigger Type", value: transfer.triggerType },
              ]}
            />
          </InfoCard>

          <InfoCard title="Current Vehicle Details">
            <InfoGrid
              columns={2}
              items={[
                { label: "MAX Vehicle ID", value: transfer.vehicle.maxVehicleId },
                { label: "Plate Number", value: transfer.vehicle.plateNumber },
                { label: "Vehicle Type", value: transfer.vehicle.type },
                { label: "Model", value: transfer.vehicle.model },
                { label: "Brand", value: transfer.vehicle.brand },
                { label: "Current Status", value: transfer.vehicle.currentStatus },
                { label: "Last Known Location", value: transfer.vehicle.lastKnownLocation },
                { label: "Utilization", value: transfer.vehicle.utilization },
              ]}
            />
          </InfoCard>

        </div>

        {/* Footer — only show actions for Pending status */}
        {isPending && !readOnly && (
          <>
            <div className="px-6 py-3 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand-dark cursor-pointer"
                />
                <span className="text-sm text-sidebar-item-active leading-snug">
                  I confirm that I have reviewed the champion's contract documentation and verified all details are correct.
                </span>
              </label>
            </div>
            <SheetFooter>
              <Button
                variant="outline"
                className="h-10 px-4 border-status-danger text-status-danger hover:bg-status-danger/10"
                onClick={() => {
                  setRejectionReason("")
                  setShowReject(true)
                }}
              >
                Reject
              </Button>
              <Button
                className="h-10 px-4 bg-brand-dark text-white hover:bg-brand-dark/90"
                disabled={!confirmed}
                onClick={() => setShowApprove(true)}
              >
                Approve
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>

      {/* Approve Confirmation */}
      <Dialog open={showApprove} onOpenChange={setShowApprove}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Approve Transfer Request</DialogTitle>
            <DialogDescription>
              {transfer.championName} &middot; {transfer.championId}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <div className="rounded-md border border-badge-active-text/30 bg-badge-active-bg px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                Approving will complete the ownership transfer and initiate the vehicle handover process.
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowApprove(false)}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              onClick={handleApprove}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Preview Modal */}
      <Dialog open={showContractPreview} onOpenChange={setShowContractPreview}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Handover Contract</DialogTitle>
            <DialogDescription>
              MAX-HP-{transfer.contractId}.pdf
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Document Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                  <svg className="h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-breadcrumb-root">
                    MAX Fleet Operations
                  </p>
                  <h3 className="text-lg font-bold text-brand-dark">
                    Vehicle Handover &amp; Ownership Transfer Agreement
                  </h3>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
            </div>

            {/* Parties */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Parties
              </p>
              <div className="text-sm text-sidebar-item-active leading-relaxed space-y-1">
                <p>
                  <span className="font-medium">Transferor:</span> MAX Fleet Operations Ltd. ("MAX")
                </p>
                <p>
                  <span className="font-medium">Transferee:</span> {transfer.championName} ({transfer.championId})
                </p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Vehicle Details
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <p><span className="text-breadcrumb-root">Vehicle ID:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicle.maxVehicleId}</span></p>
                <p><span className="text-breadcrumb-root">Plate Number:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicle.plateNumber}</span></p>
                <p><span className="text-breadcrumb-root">Type:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicle.type}</span></p>
                <p><span className="text-breadcrumb-root">Model:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicle.brand} {transfer.vehicle.model}</span></p>
                <p><span className="text-breadcrumb-root">Condition:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicleCondition}</span></p>
                <p><span className="text-breadcrumb-root">Location:</span>{" "}<span className="text-sidebar-item-active">{transfer.vehicle.lastKnownLocation}</span></p>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Contract Terms
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <p><span className="text-breadcrumb-root">Contract ID:</span>{" "}<span className="text-sidebar-item-active">{transfer.contractId}</span></p>
                <p><span className="text-breadcrumb-root">Contract End Date:</span>{" "}<span className="text-sidebar-item-active">{transfer.contractEndDate}</span></p>
                <p><span className="text-breadcrumb-root">Final Payment:</span>{" "}<span className="text-sidebar-item-active">{transfer.finalPaymentDate}</span></p>
                <p><span className="text-breadcrumb-root">Outstanding Balance:</span>{" "}<span className="text-sidebar-item-active">{transfer.outstandingBalance}</span></p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Terms &amp; Conditions
              </p>
              <ol className="list-decimal list-inside text-sm text-sidebar-item-active leading-relaxed space-y-1.5">
                <li>Upon approval of this transfer, full ownership of the vehicle described above shall pass from MAX to the Transferee.</li>
                <li>The Transferee acknowledges receipt of the vehicle in its current condition (<span className="font-medium">{transfer.vehicleCondition}</span>) and accepts it as-is.</li>
                <li>All outstanding financial obligations must be settled prior to the completion of the handover process.</li>
                <li>MAX shall not be liable for any damages, defects, or issues arising after the handover date.</li>
                <li>The Transferee is responsible for all re-registration, insurance, and licensing costs post-transfer.</li>
              </ol>
            </div>

            {/* Signatures */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Signatures
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-2">
                  <div className="h-px border-t border-dashed border-gray-300" />
                  <p className="text-xs text-breadcrumb-root">
                    MAX Fleet Operations (Authorised Signatory)
                  </p>
                </div>
                <div className="space-y-6 pt-2">
                  <div className="h-px border-t border-dashed border-gray-300" />
                  <p className="text-xs text-breadcrumb-root">
                    {transfer.championName} (Transferee)
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200" />
            <p className="text-[10px] text-center text-breadcrumb-root">
              Document generated on {transfer.requestDate} &middot; {transfer.contractId} &middot; MAX Fleet Operations Ltd.
            </p>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowContractPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal — custom Dialog with required reason */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Reject Transfer Request</DialogTitle>
            <DialogDescription>
              {transfer.championName} &middot; {transfer.championId}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                This transfer request will be rejected and assigned to a welfare officer for follow-up with the champion.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Rejection Reason <span className="text-status-danger">*</span>
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejecting this transfer request..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowReject(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={!rejectionReason.trim() || isSubmitting}
              onClick={handleReject}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
