import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InfoGrid } from "@/components/max/InfoGrid"
import { StatusBadge } from "@/components/max"

export interface PingDetails {
  speed: string
  odometer: string
  ignition: "On" | "Off"
  location: string
  externalVoltage: string
  internalVoltage: string
  shutoff: string
}

interface PingDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: PingDetails
  onResolve: () => void
}

export function PingDetailsModal({ open, onOpenChange, details, onResolve }: PingDetailsModalProps) {
  const items = [
    { label: "Vehicle Current Speed", value: details.speed },
    { label: "Odometer Reading", value: details.odometer },
    {
      label: "Status",
      value: (
        <StatusBadge variant="success" withDot>
          Active
        </StatusBadge>
      ),
    },
    {
      label: "Ignition Status",
      value: (
        <StatusBadge variant={details.ignition === "On" ? "success" : "danger"} withDot>
          {details.ignition === "On" ? "On" : "Off"}
        </StatusBadge>
      ),
    },
    { label: "Location", value: details.location },
    { label: "External Voltage", value: details.externalVoltage },
    { label: "Internal Voltage", value: details.internalVoltage },
    { label: "ShutOff Status", value: details.shutoff },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Ping Details
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <InfoGrid columns={2} items={items} showDividers />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
          <Button variant="outline" className="h-10 px-4" onClick={() => onOpenChange(false)}>
            Close details
          </Button>
          <Button
            className="h-10 px-6 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={onResolve}
          >
            Resolve tamper
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
