import { useEffect, useState } from "react"
import { ArrowUpDown, Battery, Lock } from "lucide-react"
import { Modal } from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type EnforcementActionType = "swap-block" | "vehicle-lock" | "battery-lock"

const ENFORCEMENT_REASONS = [
  "2 DPD",
  "3 DPD",
  "Overdue payment",
  "Vehicle tampered",
  "Theft / suspected theft",
  "Geofence breach",
  "Safety incident",
  "Other",
]

const ACTIONS: {
  id: EnforcementActionType
  title: string
  description: string
  iconBg: string
  icon: typeof Lock
  evOnly?: boolean
}[] = [
  {
    id: "swap-block",
    title: "Swap Block",
    description: "Prevent the champion from swapping batteries.",
    iconBg: "var(--color-success)",
    icon: ArrowUpDown,
  },
  {
    id: "vehicle-lock",
    title: "Vehicle Lock",
    description: "Immobilise the vehicle until it is reversed.",
    iconBg: "var(--color-warning)",
    icon: Lock,
  },
  {
    id: "battery-lock",
    title: "Battery Charge & Discharge Lock",
    description: "Restrict battery charge and discharge access.",
    iconBg: "var(--color-danger)",
    icon: Battery,
  },
]

interface EnforcementActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (payload: {
    action: EnforcementActionType
    actionLabel: string
    reason: string
    comment: string
  }) => void
}

export function EnforcementActionModal({
  open,
  onOpenChange,
  onApply,
}: EnforcementActionModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedAction, setSelectedAction] = useState<EnforcementActionType | null>(null)
  const [reason, setReason] = useState("")
  const [comment, setComment] = useState("")

  const options = ACTIONS
  const selected = ACTIONS.find((action) => action.id === selectedAction)

  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedAction(null)
      setReason("")
      setComment("")
    }
  }, [open])

  const close = () => onOpenChange(false)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={step === 1 ? "Enforcement Action" : "Confirm Enforcement Action"}
      className="max-w-lg"
      showBackButton={step === 2}
      onBack={() => setStep(1)}
      secondaryAction={{
        label: "Cancel",
        onClick: close,
      }}
      primaryAction={
        step === 2
          ? {
              label: "Apply enforcement",
              disabled: !reason,
              onClick: () => {
                if (!selected || !reason) return
                onApply({
                  action: selected.id,
                  actionLabel: selected.title,
                  reason,
                  comment: comment.trim(),
                })
              },
            }
          : undefined
      }
    >
      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sidebar-item-active" style={{ fontSize: "14px" }}>
            Choose the enforcement action you want to apply to this vehicle.
          </p>
          <div className="flex flex-col gap-3">
            {options.map((action) => {
              const Icon = action.icon
              const isSelected = selectedAction === action.id
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    setSelectedAction(action.id)
                    setStep(2)
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full text-left rounded-lg border p-4 transition-all",
                    isSelected
                      ? "border-gray-950 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: action.iconBg }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block text-sidebar-item-active font-semibold"
                      style={{ fontSize: "14px" }}
                    >
                      {action.title}
                    </span>
                    <span
                      className="block text-breadcrumb-root mt-0.5"
                      style={{ fontSize: "12px" }}
                    >
                      {action.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sidebar-item-active" style={{ fontSize: "14px" }}>
            Provide a reason before applying{" "}
            <span className="font-semibold">{selected?.title}.</span>
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
              Reason for enforcement
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-12 w-full bg-white border border-gray-200">
                <SelectValue placeholder="Select reason for enforcement." />
              </SelectTrigger>
              <SelectContent>
                {ENFORCEMENT_REASONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
              Comment
            </label>
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="min-h-[120px] resize-y bg-white border-gray-200"
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
