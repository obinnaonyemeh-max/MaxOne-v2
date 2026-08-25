import { useState } from "react"
import { Check } from "lucide-react"

import { Modal } from "./Modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  mockAgentPortfolioRecords,
  reassignmentReasons,
} from "@/data/mockAgentPortfolio"

export interface ReassignChampionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** How many champions are being moved — drives the subtitle copy. */
  championCount: number
  /** Who they're moving from, shown in the subtitle. */
  fromLabel?: string
  /** Agent to leave out of the list, usually the current owner. */
  excludeAgentId?: string
  onConfirm: (agentIds: string[], reason: string) => void
}

export function ReassignChampionsModal({
  open,
  onOpenChange,
  championCount,
  fromLabel,
  excludeAgentId,
  onConfirm,
}: ReassignChampionsModalProps) {
  const [targetAgentIds, setTargetAgentIds] = useState<string[]>([])
  const [reason, setReason] = useState<string>("")

  // Clear the form on close so it never reopens half-filled.
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTargetAgentIds([])
      setReason("")
    }
    onOpenChange(next)
  }

  const agents = mockAgentPortfolioRecords.filter((agent) => agent.id !== excludeAgentId)

  const allSelected =
    agents.length > 0 && agents.every((agent) => targetAgentIds.includes(agent.id))

  const toggleAgent = (id: string) =>
    setTargetAgentIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    )

  const toggleAll = () =>
    setTargetAgentIds(allSelected ? [] : agents.map((agent) => agent.id))

  const plural = championCount === 1 ? "" : "s"

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Reassign champions"
      subtitle={
        fromLabel
          ? `Move ${championCount} champion${plural} from ${fromLabel} to another agent`
          : `Move ${championCount} champion${plural} to another agent`
      }
      className="max-w-lg"
      primaryAction={{
        label: "Reassign",
        onClick: () => onConfirm(targetAgentIds, reason),
        disabled: targetAgentIds.length === 0 || !reason,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => handleOpenChange(false),
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-table-text-primary">Reason</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {reassignmentReasons.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select all */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={toggleAll}
            disabled={agents.length === 0}
            className="text-sm font-medium text-status-info hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <span className="text-xs text-muted-foreground">
            {targetAgentIds.length} of {agents.length} selected
          </span>
        </div>

        {/* Agent list */}
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {agents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No other agents available.
            </p>
          ) : (
            agents.map((agent) => {
              const isSelected = targetAgentIds.includes(agent.id)
              return (
                <button
                  type="button"
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-brand-dark bg-gray-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-table-text-primary">
                    {agent.agent.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-table-text-primary">
                      {agent.agent}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent.department} &middot; {agent.total} champions
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}
