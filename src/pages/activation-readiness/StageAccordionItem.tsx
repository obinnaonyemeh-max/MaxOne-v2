import { ChevronDown } from "lucide-react"
import { StatusBadge, Tooltip, TooltipContent, TooltipTrigger } from "@/components/max"
import { stageStatusVariantMap, type StageStatus } from "@/data/mockActivationRecords"
import type { StageKey } from "./stages"
import { QCStageBody } from "./stage-bodies/QCStageBody"
import { PaintingStageBody } from "./stage-bodies/PaintingStageBody"
import { LicensingStageBody } from "./stage-bodies/LicensingStageBody"
import { TrackerStageBody } from "./stage-bodies/TrackerStageBody"
import { InsuranceStageBody } from "./stage-bodies/InsuranceStageBody"
import { GenericStageBody } from "./stage-bodies/GenericStageBody"

interface Props {
  stageKey: StageKey
  label: string
  status: StageStatus
  isOpen: boolean
  onToggle: () => void
  onStatusChange: (s: StageStatus) => void
  onMarkCompleted: () => void
  onFlag?: () => void
}

function renderBody({ stageKey, status, onToggle, onStatusChange, onMarkCompleted, onFlag }: Props) {
  switch (stageKey) {
    case "qualityControl":   return <QCStageBody onMarkCompleted={onMarkCompleted} onFlag={onFlag} />
    case "paintingBranding": return <PaintingStageBody onMarkCompleted={onMarkCompleted} />
    case "tracker":          return <TrackerStageBody onMarkCompleted={onMarkCompleted} />
    case "licensingReg":     return <LicensingStageBody onMarkCompleted={onMarkCompleted} />
    case "insurance":        return <InsuranceStageBody onMarkCompleted={onMarkCompleted} />
    default:                 return <GenericStageBody status={status} onClose={onToggle} onStatusChange={onStatusChange} onMarkCompleted={onMarkCompleted} />
  }
}

export function StageAccordionItem(props: Props) {
  const { label, status, isOpen, onToggle } = props
  const isBlocked   = status === "blocked"
  const isCompleted = status === "completed"

  const headerContent = (
    <div className="w-full flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info shrink-0" />
        <span className="font-semibold text-sidebar-item-active uppercase tracking-wide" style={{ fontSize: "11px" }}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge variant={stageStatusVariantMap[status]} withDot size="sm">{status}</StatusBadge>
        {!isCompleted && (
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
    </div>
  )

  const header = isBlocked ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-not-allowed">{headerContent}</div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Complete the previous stage before updating this one
      </TooltipContent>
    </Tooltip>
  ) : isCompleted ? (
    headerContent
  ) : (
    <button type="button" className="w-full hover:bg-gray-100 transition-colors" onClick={onToggle}>
      {headerContent}
    </button>
  )

  return (
    <div className={`rounded-lg border border-gray-200 overflow-hidden bg-gray-50 transition-opacity ${isBlocked ? "opacity-50" : "opacity-100"}`}>
      {header}
      {isOpen && !isCompleted && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-6">
          {renderBody(props)}
        </div>
      )}
    </div>
  )
}
