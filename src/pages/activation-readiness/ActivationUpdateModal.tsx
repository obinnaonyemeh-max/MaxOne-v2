import { useState } from "react"
import { Modal, Banner } from "@/components/max"
import { Button } from "@/components/ui/button"
import type { ActivationRecord, StageStatus } from "@/data/mockActivationRecords"
import { StageAccordionItem } from "./StageAccordionItem"
import { STAGES, type StageKey } from "./stages"
import type { DraftStages } from "./useUpdateModal"

interface Props {
  record: ActivationRecord | null
  draftStages: DraftStages
  openAccordions: Set<StageKey>
  onClose: () => void
  onToggleAccordion: (key: StageKey) => void
  onStageStatusChange: (key: StageKey, status: StageStatus) => void
  onMarkCompleted: (key: StageKey) => void
}

export function ActivationUpdateModal({
  record,
  draftStages,
  openAccordions,
  onClose,
  onToggleAccordion,
  onStageStatusChange,
  onMarkCompleted,
}: Props) {
  const [flagResolved, setFlagResolved] = useState(false)
  const showFlagBanner = record?.ready === "Flagged" && !flagResolved

  return (
    <Modal
      open={!!record}
      onOpenChange={onClose}
      title={`Update — ${record?.chassis ?? ""}`}
      subtitle={`Sub-Batch: ${record?.subBatch ?? ""}`}
      className="max-w-lg"
      maxHeight="80vh"
    >
      <div className="flex flex-col gap-2">
        {showFlagBanner && (
          <Banner
            variant="danger"
            title="Flagged: QC failure — motor issue"
            action={
              <Button
                size="sm"
                className="h-7 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
                onClick={() => setFlagResolved(true)}
              >
                Resolve
              </Button>
            }
          />
        )}
        {STAGES.map(({ key, label }) => (
          <StageAccordionItem
            key={key}
            stageKey={key}
            label={label}
            status={(draftStages[key] ?? "pending") as StageStatus}
            isOpen={openAccordions.has(key)}
            onToggle={() => onToggleAccordion(key)}
            onStatusChange={(s) => onStageStatusChange(key, s)}
            onMarkCompleted={() => onMarkCompleted(key)}
          />
        ))}
      </div>
    </Modal>
  )
}
