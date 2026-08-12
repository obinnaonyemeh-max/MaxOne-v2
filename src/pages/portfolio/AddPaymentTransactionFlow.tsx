import { useEffect, useState } from "react"

import { Modal, LoaderModal, ConfirmModal } from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const paymentChannels = ["Woven", "Paystack", "Monnify", "Flutterwave"]

// The lookup simulation "finds" this amount on the second attempt
const FOUND_AMOUNT = "₦5,000"

type Step = "form" | "checking" | "not-found" | "rechecking" | "confirm"

interface AddPaymentTransactionFlowProps {
  open: boolean
  onClose: () => void
  onConfirm: (payload: { referenceId: string; channel: string; amount: string }) => void
}

export function AddPaymentTransactionFlow({ open, onClose, onConfirm }: AddPaymentTransactionFlowProps) {
  const [step, setStep] = useState<Step>("form")
  const [referenceId, setReferenceId] = useState("")
  const [channel, setChannel] = useState("")

  useEffect(() => {
    if (!open) {
      setStep("form")
      setReferenceId("")
      setChannel("")
    }
  }, [open])

  return (
    <>
      {/* Form: reference ID + payment channel */}
      <Modal
        open={open && step === "form"}
        onOpenChange={onClose}
        title="Add Payment Transaction"
        subtitle="Verify a payment by reference ID and record it"
        className="max-w-md"
        primaryAction={{
          label: "Add Transaction",
          onClick: () => {
            setStep("checking")
            setTimeout(() => setStep("not-found"), 2000)
          },
          disabled: !referenceId.trim() || !channel,
          className: "bg-brand-primary text-brand-dark hover:bg-brand-primary/90",
        }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-breadcrumb-root">Reference ID</label>
            <Input
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="TXN-20260601-001"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-breadcrumb-root">Select payment channel</label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="- Select payment channel -" />
              </SelectTrigger>
              <SelectContent>
                {paymentChannels.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>

      <LoaderModal
        open={open && (step === "checking" || step === "rechecking")}
        message="Verifying reference ID..."
      />

      {/* First attempt — not found */}
      <ConfirmModal
        open={open && step === "not-found"}
        onOpenChange={(o) => {
          if (!o) onClose()
        }}
        variant="destructive"
        title="Reference ID not found"
        subtitle={`We couldn't find a payment matching "${referenceId}". Please check the reference and try again.`}
        primaryAction={{
          label: "Try Again",
          onClick: () => {
            setStep("rechecking")
            setTimeout(() => setStep("confirm"), 2000)
          },
        }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      />

      {/* Second attempt — found, confirm with price */}
      <ConfirmModal
        open={open && step === "confirm"}
        onOpenChange={(o) => {
          if (!o) onClose()
        }}
        variant="success"
        title="Payment found"
        subtitle={`A payment of ${FOUND_AMOUNT} was found for "${referenceId}" via ${channel}. Confirm to record this transaction.`}
        primaryAction={{
          label: "Confirm Payment",
          onClick: () => {
            onConfirm({ referenceId, channel, amount: FOUND_AMOUNT })
            onClose()
          },
        }}
        secondaryAction={{ label: "Cancel", onClick: onClose }}
      />
    </>
  )
}
