import { useEffect, useState, type ReactNode } from "react"
import { ConfirmModal, Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { SwapStation } from "@/data/mockStationsData"

interface SetOperatingHoursModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  station: SwapStation
  onSave: (hours: {
    openHours: string
    closeHours: string
    forcedClosure: boolean
  }) => void
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-medium text-gray-600"
        style={{ fontSize: "13px" }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function SetOperatingHoursModal({
  open,
  onOpenChange,
  station,
  onSave,
}: SetOperatingHoursModalProps) {
  const [openHours, setOpenHours] = useState("")
  const [closeHours, setCloseHours] = useState("")
  const [forcedClosure, setForcedClosure] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!open) {
      setSaved(false)
      return
    }
    setOpenHours(station.openHours ?? "")
    setCloseHours(station.closeHours ?? "")
    setForcedClosure(Boolean(station.forcedClosure))
  }, [open, station])

  const isValid = openHours.length > 0 && closeHours.length > 0

  const handleSave = () => {
    if (!isValid) return
    onSave({
      openHours,
      closeHours,
      forcedClosure,
    })
    setSaved(true)
  }

  return (
    <>
      <Modal
        open={open && !saved}
        onOpenChange={onOpenChange}
        title="Set Operating Hours"
        subtitle="Set when this swap station is open. Force closure overrides these hours and keeps the station closed."
        className="max-w-md"
        secondaryAction={{
          label: "Cancel",
          onClick: () => onOpenChange(false),
        }}
        primaryAction={{
          label: "Save",
          onClick: handleSave,
          disabled: !isValid,
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Opening time" htmlFor="station-open-hours">
              <Input
                id="station-open-hours"
                type="time"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="h-12"
              />
            </FormField>
            <FormField label="Closing time" htmlFor="station-close-hours">
              <Input
                id="station-close-hours"
                type="time"
                value={closeHours}
                onChange={(e) => setCloseHours(e.target.value)}
                className="h-12"
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-950" style={{ fontSize: "13px" }}>
                  Force swap station closure
                </p>
                <p className="mt-1 text-gray-500" style={{ fontSize: "12px" }}>
                  Overrides operating hours and keeps the station closed.
                </p>
              </div>
              <Switch
                checked={forcedClosure}
                onCheckedChange={setForcedClosure}
                aria-label="Force swap station closure"
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={open && saved}
        onOpenChange={(next) => {
          if (!next) onOpenChange(false)
        }}
        variant="success"
        title="Operating hours updated"
        subtitle={
          forcedClosure
            ? `${station.name} is force-closed and will stay closed until this is turned off.`
            : `${station.name} will open at the times you set.`
        }
        primaryAction={{
          label: "Done",
          onClick: () => onOpenChange(false),
        }}
        className="max-w-md"
      />
    </>
  )
}
