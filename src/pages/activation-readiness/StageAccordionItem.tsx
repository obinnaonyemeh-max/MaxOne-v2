import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { StatusBadge, Tooltip, TooltipContent, TooltipTrigger } from "@/components/max"
import { Button } from "@/components/ui/button"
import { stageStatusVariantMap, type StageSlaTimes, type StageStatus } from "@/data/mockActivationRecords"
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
  sla?: StageSlaTimes
  isOpen: boolean
  onToggle: () => void
  onStart: () => void
  onMarkCompleted: () => void
  onFlag?: () => void
}

function formatSlaTime(iso: string) {
  return format(new Date(iso), "d MMM yyyy, HH:mm")
}

function renderBody({ stageKey, onMarkCompleted, onFlag }: Props) {
  switch (stageKey) {
    case "qualityControl":   return <QCStageBody onMarkCompleted={onMarkCompleted} onFlag={onFlag} />
    case "paintingBranding": return <PaintingStageBody onMarkCompleted={onMarkCompleted} />
    case "tracker":          return <TrackerStageBody onMarkCompleted={onMarkCompleted} />
    case "licensingReg":     return <LicensingStageBody onMarkCompleted={onMarkCompleted} />
    case "insurance":        return <InsuranceStageBody onMarkCompleted={onMarkCompleted} />
    default:                 return <GenericStageBody onMarkCompleted={onMarkCompleted} />
  }
}

function StageStartGate({ label, onStart }: { label: string; onStart: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
        Start {label} to begin work. The start time is recorded for SLA tracking.
      </p>
      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </div>
  )
}

export function StageAccordionItem(props: Props) {
  const { label, status, sla, isOpen, onToggle } = props
  const isBlocked   = status === "blocked"
  const isCompleted = status === "completed"
  const hasStarted  = status === "in-progress"

  const slaCaption = [
    hasStarted && sla?.startedAt ? `Started ${formatSlaTime(sla.startedAt)}` : null,
    isCompleted && sla?.completedAt ? `Completed ${formatSlaTime(sla.completedAt)}` : null,
  ].filter(Boolean).join(" · ") || null

  const headerContent = (
    <div className="w-full flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info shrink-0" />
        <div className="flex flex-col items-start min-w-0">
          <span className="font-semibold text-sidebar-item-active uppercase tracking-wide" style={{ fontSize: "11px" }}>
            {label}
          </span>
          {slaCaption && (
            <span className="text-gray-400 font-medium" style={{ fontSize: "11px" }}>
              {slaCaption}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
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
          {hasStarted ? renderBody(props) : <StageStartGate label={label} onStart={props.onStart} />}
        </div>
      )}
    </div>
  )
}
