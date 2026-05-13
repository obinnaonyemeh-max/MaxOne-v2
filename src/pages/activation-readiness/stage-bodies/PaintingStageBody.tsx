import { useState } from "react"
import { CheckboxGrid } from "@/components/max"
import { Button } from "@/components/ui/button"

const PAINTING_ITEMS = [
  { id: "branding",   label: "MAX branding applied" },
  { id: "colour",     label: "Correct colour"       },
  { id: "defects",    label: "No visible defects"   },
  { id: "reflectors", label: "Reflectors fitted"    },
  { id: "stickers",   label: "Stickers aligned"     },
]

interface Props {
  onMarkCompleted: () => void
}

export function PaintingStageBody({ onMarkCompleted }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <>
      <CheckboxGrid items={PAINTING_ITEMS} checked={checked} onToggle={toggle} />
      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onMarkCompleted}
        >
          Confirm painting &amp; branding
        </Button>
      </div>
    </>
  )
}
