import { useEffect, useState, type ChangeEvent } from "react"

import { Modal, FormField } from "@/components/max"
import { Input } from "@/components/ui/input"
import type { IdentifierInput, VehicleIdentifier } from "@/data/mockBatchDetailRows"

const emptyForm: IdentifierInput = {
  chassisVin: "",
  engineNo: "",
  ignitionNo: "",
  batterySn: "",
  color: "",
  receiver: "",
}

function toForm(identifier: VehicleIdentifier | null | undefined): IdentifierInput {
  if (!identifier) return emptyForm
  return {
    chassisVin: identifier.chassisVin,
    engineNo: identifier.engineNo,
    ignitionNo: identifier.ignitionNo,
    batterySn: identifier.batterySn,
    color: identifier.color,
    receiver: identifier.receiver,
  }
}

export function AddIdentifierModal({
  open,
  onOpenChange,
  onSubmit,
  identifier = null,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: IdentifierInput) => void
  identifier?: VehicleIdentifier | null
}) {
  const isEdit = Boolean(identifier)
  const [form, setForm] = useState<IdentifierInput>(emptyForm)

  useEffect(() => {
    if (open) setForm(toForm(identifier))
  }, [identifier, open])

  const resetAndClose = () => {
    setForm(emptyForm)
    onOpenChange(false)
  }

  const update = (key: keyof IdentifierInput) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setForm(emptyForm)
        onOpenChange(next)
      }}
      title={isEdit ? "Edit Vehicle Identifier" : "Add Vehicle Identifier"}
      subtitle={
        isEdit
          ? "Update the vehicle identifier details below."
          : "This creates a new sub-batch containing this vehicle."
      }
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: isEdit ? "Save Changes" : "Add Identifier",
        onClick: () => {
          onSubmit(form)
          resetAndClose()
        },
        disabled: !form.chassisVin.trim(),
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: resetAndClose,
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
          <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: "11px", letterSpacing: "0.4px" }}>
            Vehicle Identifiers
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Chassis Number (VIN)" htmlFor="identifier-chassis">
            <Input
              placeholder="Enter chassis number (VIN)"
              className="h-12 bg-input-soft"
              value={form.chassisVin}
              onChange={update("chassisVin")}
            />
          </FormField>
          <FormField label="Engine Number" htmlFor="identifier-engine">
            <Input
              placeholder="Enter engine number"
              className="h-12 bg-input-soft"
              value={form.engineNo}
              onChange={update("engineNo")}
            />
          </FormField>
          <FormField label="Ignition Number" htmlFor="identifier-ignition">
            <Input
              placeholder="Enter ignition number"
              className="h-12 bg-input-soft"
              value={form.ignitionNo}
              onChange={update("ignitionNo")}
            />
          </FormField>
          <FormField label="Battery Serial Number" htmlFor="identifier-battery">
            <Input
              placeholder="Enter battery serial number"
              className="h-12 bg-input-soft"
              value={form.batterySn}
              onChange={update("batterySn")}
            />
          </FormField>
          <FormField label="Color" htmlFor="identifier-color">
            <Input
              placeholder="Enter color"
              className="h-12 bg-input-soft"
              value={form.color}
              onChange={update("color")}
            />
          </FormField>
          <FormField label="Receiver / Destination Unit" htmlFor="identifier-receiver">
            <Input
              placeholder="Enter receiver / destination unit"
              className="h-12 bg-input-soft"
              value={form.receiver}
              onChange={update("receiver")}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  )
}
