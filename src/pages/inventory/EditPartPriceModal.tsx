import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { updatePartCost } from "@/data/inventoryStore"
import type { InventoryPart } from "@/data/mockInventoryParts"
import { FormField } from "@/pages/vehicles/FormControls"

interface EditPartPriceModalProps {
  part: InventoryPart | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPartPriceModal({ part, open, onOpenChange }: EditPartPriceModalProps) {
  const [costPriceInput, setCostPriceInput] = useState("")

  useEffect(() => {
    if (open && part) {
      setCostPriceInput(part.costPrice == null ? "" : String(part.costPrice))
    }
  }, [open, part])

  const handleSave = () => {
    if (!part) return
    const parsed = costPriceInput.trim() === "" ? undefined : Number(costPriceInput)
    updatePartCost(part.id, typeof parsed === "number" && Number.isFinite(parsed) ? parsed : undefined)
    toast.success(`Cost price updated for ${part.skuId}`)
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit cost price"
      subtitle={part ? `${part.skuId} • ${part.partName}` : undefined}
      className="max-w-md"
      primaryAction={{
        label: "Save",
        onClick: handleSave,
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <FormField label="Cost price" hint="Leave blank to clear the price">
        <Input
          type="number"
          min={0}
          placeholder="Enter cost price"
          className="h-12 bg-input-soft"
          value={costPriceInput}
          onChange={(e) => setCostPriceInput(e.target.value)}
        />
      </FormField>
    </Modal>
  )
}
