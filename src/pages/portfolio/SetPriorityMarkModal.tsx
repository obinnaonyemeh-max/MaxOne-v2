import { useEffect, useState } from "react"

import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { FormField } from "@/pages/vehicles/FormControls"
import type { PriorityMarkThreshold } from "@/data/mockRetailScorecardAttributes"

interface DraftThreshold {
  id: string
  label: string
  minScore: string
  maxScore: string
}

interface SetPriorityMarkModalProps {
  open: boolean
  onClose: () => void
  onSave: (thresholds: PriorityMarkThreshold[]) => void
  thresholds: PriorityMarkThreshold[]
  totalMarks: number
}

export function SetPriorityMarkModal({ open, onClose, onSave, thresholds, totalMarks }: SetPriorityMarkModalProps) {
  const [drafts, setDrafts] = useState<DraftThreshold[]>([])

  useEffect(() => {
    if (!open) return
    setDrafts(
      thresholds.map((t) => ({
        id: t.id,
        label: t.label,
        minScore: String(t.minScore),
        maxScore: String(t.maxScore),
      }))
    )
  }, [open, thresholds])

  const update = (id: string, field: "minScore" | "maxScore", value: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  const isValid = drafts.every(
    (d) => d.minScore.trim().length > 0 && d.maxScore.trim().length > 0 && Number(d.minScore) <= Number(d.maxScore)
  )

  const handleSave = () => {
    if (!isValid) return
    onSave(
      drafts.map((d) => ({
        id: d.id,
        label: d.label,
        minScore: Number(d.minScore) || 0,
        maxScore: Number(d.maxScore) || 0,
      }))
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Set Priority Mark"
      subtitle={`Configure the total score ranges that determine a champion's priority band (0 – ${totalMarks} marks)`}
      className="max-w-lg"
      primaryAction={{
        label: "Save Priority Marks",
        onClick: handleSave,
        disabled: !isValid,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        {drafts.map((draft) => (
          <div key={draft.id} className="rounded-lg border border-gray-200 p-4">
            <p className="mb-3 font-semibold text-sidebar-item-active" style={{ fontSize: "13px" }}>
              {draft.label}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Minimum Score">
                <Input
                  type="number"
                  value={draft.minScore}
                  onChange={(e) => update(draft.id, "minScore", e.target.value)}
                  className="h-9 bg-input-soft"
                />
              </FormField>
              <FormField label="Maximum Score">
                <Input
                  type="number"
                  value={draft.maxScore}
                  onChange={(e) => update(draft.id, "maxScore", e.target.value)}
                  className="h-9 bg-input-soft"
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
