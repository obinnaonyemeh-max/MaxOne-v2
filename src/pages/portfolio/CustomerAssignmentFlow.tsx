import { useState, useEffect, useMemo } from "react"

import { Modal } from "@/components/max"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockPortfolioChampions } from "@/data/mockPortfolioChampions"
import { type RecoveryPair, type RecoveryAgent } from "@/data/mockRecoveryOfficers"

interface CustomerAssignmentFlowProps {
  open: boolean
  onClose: () => void
  pairs: RecoveryPair[]
  agents: RecoveryAgent[]
  onAssign: (pairId: string, championName: string) => void
}

const eligibleChampions = mockPortfolioChampions.filter(
  (c) => c.retrievalStatus === "Overdue" || c.retrievalStatus === "Due for Retrieval"
)

export function CustomerAssignmentFlow({ open, onClose, pairs, agents, onAssign }: CustomerAssignmentFlowProps) {
  const [championId, setChampionId] = useState("")
  const [pairId, setPairId] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) {
      setChampionId("")
      setPairId("")
      setNotes("")
      setSubmitted(false)
    }
  }, [open])

  const activePairs = useMemo(() => pairs.filter((p) => p.status === "Active"), [pairs])

  const officerNames = (pair: RecoveryPair) => {
    const a = agents.find((ag) => ag.id === pair.officerAId)?.name
    const b = agents.find((ag) => ag.id === pair.officerBId)?.name
    return [a, b].filter(Boolean).join(" & ")
  }

  const selectedChampion = eligibleChampions.find((c) => c.id === championId)
  const selectedPair = activePairs.find((p) => p.id === pairId)

  const handleAssign = () => {
    if (!selectedPair || !selectedChampion) return
    onAssign(pairId, selectedChampion.name)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Modal open={open} onOpenChange={onClose} hideHeader className="max-w-[320px]">
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          <p className="mt-6 text-center font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
            {selectedChampion?.name} assigned to {selectedPair?.pairCode}
          </p>
          <p className="mt-1 text-center text-sm text-breadcrumb-root">
            The recovery pair has been notified of the new case.
          </p>
          <button
            onClick={onClose}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Make Customer Assignment"
      subtitle="Assign an overdue or due-for-retrieval champion to a recovery pair"
      className="max-w-lg"
      primaryAction={{
        label: "Assign Case",
        onClick: handleAssign,
        disabled: !championId || !pairId,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-breadcrumb-root">Champion</label>
          <Select value={championId} onValueChange={setChampionId}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select a champion for recovery" />
            </SelectTrigger>
            <SelectContent>
              {eligibleChampions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} &middot; {c.maxId} &middot; {c.daysOverdue}d overdue &middot; {c.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-breadcrumb-root">Recovery Pair</label>
          <Select value={pairId} onValueChange={setPairId}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select a recovery pair" />
            </SelectTrigger>
            <SelectContent>
              {activePairs.map((pair) => (
                <SelectItem key={pair.id} value={pair.id}>
                  {pair.pairCode} &middot; {officerNames(pair)} &middot; {pair.zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-breadcrumb-root">Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any context the recovery pair should know before pickup..."
            rows={3}
            className="text-sm"
          />
        </div>
      </div>
    </Modal>
  )
}
