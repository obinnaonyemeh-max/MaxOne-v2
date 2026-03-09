import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

interface AssignmentRecord {
  id: string
  duration: string
  assigneeName: string
  assigneeAvatar?: string
  status: "Active" | "Inactive"
  isCurrent: boolean
}

interface AssignmentHistoryCardProps {
  assignments: AssignmentRecord[]
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
  className?: string
}

export function AssignmentHistoryCard({
  assignments,
  currentIndex,
  onPrevious,
  onNext,
  className,
}: AssignmentHistoryCardProps) {
  const currentAssignment = assignments[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < assignments.length - 1

  if (!currentAssignment) {
    return (
      <div className={cn("bg-content-card p-5 rounded-lg border border-border", className)}>
        <h3 className="text-base font-medium text-sidebar-item-active">
          Assignment History
        </h3>
        <p className="mt-4 text-sm font-medium text-breadcrumb-root">No assignment history available</p>
      </div>
    )
  }

  const statusDotColor = currentAssignment.status === "Active" ? "bg-badge-active-text" : "bg-status-warning"

  return (
    <div className={cn("bg-content-card p-5 rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-sidebar-item-active">
          Assignment History
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="p-1.5 bg-gray-50 border border-border rounded-l-lg rounded-r transition-colors disabled:cursor-not-allowed disabled:bg-white disabled:border-gray-100 hover:not-disabled:bg-border"
          >
            <ChevronLeft className={cn("h-4 w-4 text-sidebar-item", !hasPrevious && "opacity-30")} />
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="p-1.5 bg-gray-50 border border-border rounded-l rounded-r-lg transition-colors disabled:cursor-not-allowed disabled:bg-white disabled:border-gray-100 hover:not-disabled:bg-border"
          >
            <ChevronRight className={cn("h-4 w-4 text-sidebar-item", !hasNext && "opacity-30")} />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded p-3">
        <div className="flex items-center gap-2 text-breadcrumb-root mb-3 text-xs">
          <span className={cn("h-1.5 w-1.5 rounded-full", statusDotColor)} />
          <span className="font-medium">Duration</span>
          <span className="ml-auto font-medium text-gray-600">
            {currentAssignment.duration}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentAssignment.assigneeAvatar ? (
            <img
              src={currentAssignment.assigneeAvatar}
              alt={currentAssignment.assigneeName}
              className="shrink-0 rounded-full object-cover"
              style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
            />
          ) : (
            <div 
              className="shrink-0 rounded-full bg-gray-200 flex items-center justify-center" 
              style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
            >
              <span className="text-sm font-medium text-sidebar-item">
                {currentAssignment.assigneeName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-sidebar-item-active" style={{ fontSize: '15px' }}>
              {currentAssignment.assigneeName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge
                variant={currentAssignment.status === "Active" ? "success" : "warning"}
                withDot
                size="sm"
              >
                {currentAssignment.status}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { AssignmentRecord }
