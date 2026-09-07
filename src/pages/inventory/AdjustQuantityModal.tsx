import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Modal, StatusBadge } from "@/components/max"
import { Input } from "@/components/ui/input"
import { submitExistingAdjustment } from "@/data/inventoryApprovalStore"
import {
  availableQuantity,
  type InventoryPart,
} from "@/data/mockInventoryParts"
import type { InventoryApprovalType } from "@/data/mockInventoryApprovals"
import { FormField } from "@/pages/vehicles/FormControls"

interface AdjustQuantityModalProps {
  part: InventoryPart | null
  type: InventoryApprovalType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdjustQuantityModal({
  part,
  type,
  open,
  onOpenChange,
}: AdjustQuantityModalProps) {
  const [qtyInput, setQtyInput] = useState("")
  const [error, setError] = useState("")

  const available = part ? availableQuantity(part) : 0

  useEffect(() => {
    if (open) {
      setQtyInput("")
      setError("")
    }
  }, [open, part?.id, type])

  const handleSubmit = () => {
    if (!part || !type) return
    const qty = Number.parseInt(qtyInput, 10)
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Enter a quantity greater than 0")
      return
    }
    if (type === "Depletion" && qty > available) {
      setError(`Cannot deplete more than ${available} available`)
      return
    }

    submitExistingAdjustment(part, type, qty)
    toast.success(`${part.skuId} ${type.toLowerCase()} submitted for approval`)
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={type === "Depletion" ? "Request depletion" : "Request addition"}
      subtitle={part ? `${part.skuId} • ${part.partName}` : undefined}
      className="max-w-md"
      primaryAction={{
        label: "Submit for approval",
        onClick: handleSubmit,
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-sm font-medium text-breadcrumb-root">Type</span>
          {type && (
            <StatusBadge variant={type === "Addition" ? "success" : "warning"} size="sm">
              {type}
            </StatusBadge>
          )}
        </div>

        {type === "Depletion" && (
          <p className="text-sm font-medium text-breadcrumb-root">
            Available quantity: {available}
          </p>
        )}

        <FormField label="Quantity" error={error}>
          <Input
            type="number"
            min={1}
            max={type === "Depletion" ? available : undefined}
            placeholder="Enter quantity"
            className="h-12 bg-input-soft"
            value={qtyInput}
            onChange={(e) => {
              setQtyInput(e.target.value)
              setError("")
            }}
          />
        </FormField>
      </div>
    </Modal>
  )
}
