import { useEffect, useState } from "react"

import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { type RepricingException } from "@/data/mockRepricingExceptions"

export interface ExceptionInputOverrides {
  vehicleCost: number
  dailyRemittance: number
  marginPercent: number
}

interface EditExceptionInputsModalProps {
  exception: RepricingException | null
  onClose: () => void
  onSave: (exception: RepricingException, values: ExceptionInputOverrides) => void
}

export function EditExceptionInputsModal({ exception, onClose, onSave }: EditExceptionInputsModalProps) {
  const [vehicleCost, setVehicleCost] = useState(0)
  const [dailyRemittance, setDailyRemittance] = useState(0)
  const [marginPercent, setMarginPercent] = useState(0)

  useEffect(() => {
    if (!exception) {
      setVehicleCost(0)
      setDailyRemittance(0)
      setMarginPercent(0)
    }
  }, [exception])

  const handleSave = () => {
    if (!exception) return
    onSave(exception, { vehicleCost, dailyRemittance, marginPercent })
  }

  return (
    <Modal
      open={exception !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Calculation Inputs"
      subtitle={exception ? `Manually override the inputs used to reprice ${exception.contractId}.` : undefined}
      primaryAction={{ label: "Save Inputs", onClick: handleSave }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
            Vehicle Cost Override
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
              ₦
            </span>
            <Input
              type="number"
              value={vehicleCost || ""}
              onChange={(e) => setVehicleCost(Number(e.target.value) || 0)}
              placeholder="Enter vehicle cost"
              className="h-12 bg-input-soft pl-7"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
            Daily Remittance Override
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
              ₦
            </span>
            <Input
              type="number"
              value={dailyRemittance || ""}
              onChange={(e) => setDailyRemittance(Number(e.target.value) || 0)}
              placeholder="Enter daily remittance"
              className="h-12 bg-input-soft pl-7"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>
            Margin Override (%)
          </label>
          <Input
            type="number"
            value={marginPercent || ""}
            onChange={(e) => setMarginPercent(Number(e.target.value) || 0)}
            placeholder="Enter margin percentage"
            className="h-12 bg-input-soft"
          />
        </div>
      </div>
    </Modal>
  )
}
