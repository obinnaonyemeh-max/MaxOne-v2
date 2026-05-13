import { useState } from "react"
import { CheckboxGrid } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const QC_ITEMS = [
  { id: "chassis",  label: "Chassis check"      },
  { id: "frame",    label: "Frame & welds"      },
  { id: "brakes",   label: "Brakes"             },
  { id: "battery",  label: "Battery pack"       },
  { id: "motor",    label: "Motor & drivetrain" },
  { id: "display",  label: "Display / tech"     },
]

interface Props {
  onMarkCompleted: () => void
  onFlag?: () => void
}

export function QCStageBody({ onMarkCompleted, onFlag }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [notes, setNotes]     = useState("")

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <>
      <CheckboxGrid items={QC_ITEMS} checked={checked} onToggle={toggle} />
      <div>
        <p className="font-semibold text-sidebar-item uppercase tracking-wide mb-1.5" style={{ fontSize: "11px" }}>
          Notes
        </p>
        <Textarea
          placeholder="Describe any issues..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="bg-white"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs text-status-danger border-status-danger hover:bg-status-danger/5"
          onClick={onFlag}
        >
          Flag vehicle
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onMarkCompleted}
        >
          Mark QC complete
        </Button>
      </div>
    </>
  )
}
