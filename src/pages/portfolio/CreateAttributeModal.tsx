import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "@/pages/vehicles/FormControls"
import type { ScorecardAttribute, ScorecardAttributeOption } from "@/data/mockRetailScorecardAttributes"

export interface CreateAttributeInput {
  name: string
  options: Omit<ScorecardAttributeOption, "id">[]
}

interface DraftOption {
  key: string
  label: string
  marks: string
}

let draftSeq = 1
function emptyOption(): DraftOption {
  return { key: `draft-${draftSeq++}`, label: "", marks: "" }
}

interface CreateAttributeModalProps {
  open: boolean
  onClose: () => void
  onSave: (input: CreateAttributeInput) => void
  attribute?: ScorecardAttribute | null
}

export function CreateAttributeModal({ open, onClose, onSave, attribute }: CreateAttributeModalProps) {
  const [name, setName] = useState("")
  const [options, setOptions] = useState<DraftOption[]>([emptyOption(), emptyOption()])

  useEffect(() => {
    if (!open) return
    if (attribute) {
      setName(attribute.name)
      setOptions(
        attribute.options.map((o) => ({ key: o.id, label: o.label, marks: String(o.marks) }))
      )
    } else {
      setName("")
      setOptions([emptyOption(), emptyOption()])
    }
  }, [open, attribute])

  const updateOption = (key: string, field: "label" | "marks", value: string) => {
    setOptions((prev) => prev.map((o) => (o.key === key ? { ...o, [field]: value } : o)))
  }

  const addOption = () => setOptions((prev) => [...prev, emptyOption()])
  const removeOption = (key: string) => setOptions((prev) => prev.filter((o) => o.key !== key))

  const validOptions = options.filter((o) => o.label.trim().length > 0 && o.marks.trim().length > 0)
  const isValid = name.trim().length > 0 && validOptions.length >= 2

  const handleSave = () => {
    if (!isValid) return
    onSave({
      name: name.trim(),
      options: validOptions.map((o) => ({ label: o.label.trim(), marks: Number(o.marks) || 0 })),
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={attribute ? "Edit Attribute" : "Create a new Attribute"}
      subtitle="Define the option categories for this attribute and assign a weighting mark to each"
      className="max-w-2xl"
      primaryAction={{
        label: attribute ? "Save Changes" : "Create Attribute",
        onClick: handleSave,
        disabled: !isValid,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <FormField label="Attribute Name *">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Highest Level Of Education"
            className="h-9 bg-input-soft"
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-400" style={{ fontSize: "13px" }}>
              Option Categories & Marks *
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="h-8 gap-1.5 px-2.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Option
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={option.key} className="flex items-center gap-2">
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(option.key, "label", e.target.value)}
                  placeholder="Option label"
                  className="h-9 flex-1 bg-input-soft"
                />
                <Input
                  type="number"
                  value={option.marks}
                  onChange={(e) => updateOption(option.key, "marks", e.target.value)}
                  placeholder="Marks"
                  className="h-9 w-24 bg-input-soft"
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.key)}
                  disabled={options.length <= 1}
                  className="rounded p-2 text-gray-400 transition-colors hover:bg-status-danger/10 hover:text-status-danger disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <p className="font-medium text-breadcrumb-root" style={{ fontSize: "12px" }}>
            Add at least 2 options with a label and a mark. The attribute's priority mark is the highest mark
            among its options.
          </p>
        </div>
      </div>
    </Modal>
  )
}
