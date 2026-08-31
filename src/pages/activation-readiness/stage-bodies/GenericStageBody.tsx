import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StageStatus } from "@/data/mockActivationRecords"

interface Props {
  status: StageStatus
  onClose: () => void
  onStatusChange: (s: StageStatus) => void
  onMarkCompleted: () => void
}

export function GenericStageBody({ status, onClose, onStatusChange, onMarkCompleted }: Props) {
  const [draft, setDraft] = useState<StageStatus>(status)
  useEffect(() => { setDraft(status) }, [status])

  const handleSave = () => {
    if (draft !== "completed") onStatusChange(draft)
    onClose()
  }

  return (
    <>
      <div>
        <label className="text-gray-600 font-medium block mb-2" style={{ fontSize: "12px" }}>
          Update status
        </label>
        <Select value={draft} onValueChange={(v) => setDraft(v as StageStatus)}>
          <SelectTrigger className="h-9 w-full bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90" onClick={onMarkCompleted}>
          Mark completed
        </Button>
      </div>
    </>
  )
}
