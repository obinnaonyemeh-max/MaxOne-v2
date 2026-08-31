import { useState } from "react"
import { CheckboxGrid, DatePickerField } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TRACKER_ITEMS = [
  { id: "fitted",       label: "Device fitted"     },
  { id: "transmitting", label: "Transmitting"       },
  { id: "location",     label: "Location verified" },
]

interface Props {
  onMarkCompleted: () => void
}

export function TrackerStageBody({ onMarkCompleted }: Props) {
  const [deviceId, setDeviceId]       = useState("")
  const [installDate, setInstallDate] = useState<Date | undefined>(undefined)
  const [checked, setChecked]         = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-gray-600 font-medium block mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px" }}>
            Device ID / IMEI
          </label>
          <Input
            placeholder="Tracker IMEI or ref"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="h-9 bg-white"
          />
        </div>
        <div>
          <label className="text-gray-600 font-medium block mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px" }}>
            Installation Date
          </label>
          <DatePickerField
            value={installDate}
            onChange={setInstallDate}
            placeholder="dd/mm/yyyy"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <CheckboxGrid items={TRACKER_ITEMS} checked={checked} onToggle={toggle} />

      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onMarkCompleted}
        >
          Confirm tracker installation
        </Button>
      </div>
    </>
  )
}
