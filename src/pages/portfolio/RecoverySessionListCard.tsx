import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/max/StatusBadge"
import { sessionStatusVariantMap, type RecoverySession } from "@/data/mockRecoveries"

interface RecoverySessionListCardProps {
  session: RecoverySession
  isSelected?: boolean
  isExpanded?: boolean
  onClick?: () => void
  onExpandClick?: () => void
  className?: string
}

export function RecoverySessionListCard({
  session,
  isSelected = false,
  isExpanded = false,
  onClick,
  onExpandClick,
  className,
}: RecoverySessionListCardProps) {
  return (
    <div
      className={cn(
        "bg-white border rounded-lg transition-all cursor-pointer relative",
        isSelected ? "border-gray-950 shadow-sm" : "border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 pr-6">
          <img
            src="/images/champvatar.png"
            alt={session.championName}
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-950 font-semibold" style={{ fontSize: "14px" }}>
                {session.championName}
              </span>
              <StatusBadge
                variant={sessionStatusVariantMap[session.status]}
                size="sm"
                style={{ fontSize: "10px", letterSpacing: "0.05em" }}
              >
                {session.status.toUpperCase()}
              </StatusBadge>
            </div>
            <div className="mt-1">
              <span className="text-gray-500" style={{ fontSize: "12px" }}>
                {session.caseId} · {session.vehiclePlate} · {session.zone}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      MAX ID
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.maxId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Vehicle Type
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.vehicleType}
                    </span>
                  </div>

                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Recovery Pair
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.pairCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Officers
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.officers}
                    </span>
                  </div>

                  <div>
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Started
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.startedAt}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                      Completed
                    </span>
                    <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                      {session.completedAt ?? "—"}
                    </span>
                  </div>

                  {session.status === "Failed" && session.outcomeNotes && (
                    <div className="col-span-2">
                      <span className="block text-gray-500" style={{ fontSize: "11px" }}>
                        Outcome Notes
                      </span>
                      <span className="text-gray-950 font-medium" style={{ fontSize: "13px" }}>
                        {session.outcomeNotes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          onExpandClick?.()
        }}
        className={cn(
          "absolute right-4 p-1 rounded hover:bg-gray-100",
          isExpanded ? "top-4" : "top-1/2 -translate-y-1/2"
        )}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </motion.button>
    </div>
  )
}
