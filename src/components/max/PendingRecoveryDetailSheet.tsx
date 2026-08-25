import { useEffect, useMemo, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { assignmentStatusVariantMap, type PendingRecovery } from "@/data/mockRecoveries"
import { mockRecoveryPairs, mockRecoveryAgents, type RecoveryPair } from "@/data/mockRecoveryOfficers"

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const agentById = new Map(mockRecoveryAgents.map((a) => [a.id, a]))

function officerNames(pair: RecoveryPair): string {
  const a = agentById.get(pair.officerAId)?.name
  const b = agentById.get(pair.officerBId)?.name
  return [a, b].filter(Boolean).join(" & ")
}

interface PendingRecoveryDetailSheetProps {
  recovery: PendingRecovery | null
  isOpen: boolean
  onClose: () => void
  onAssignPair: (recoveryId: string, pairId: string) => void
}

export function PendingRecoveryDetailSheet({
  recovery,
  isOpen,
  onClose,
  onAssignPair,
}: PendingRecoveryDetailSheetProps) {
  const [showAssign, setShowAssign] = useState(false)
  const [pairId, setPairId] = useState("")

  useEffect(() => {
    setShowAssign(false)
    setPairId("")
  }, [recovery?.id])

  const eligiblePairs = useMemo(
    () => mockRecoveryPairs.filter((p) => p.status === "Active"),
    []
  )

  if (!recovery) return null

  const handleAssign = () => {
    if (!pairId) return
    onAssignPair(recovery.id, pairId)
    setShowAssign(false)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[36vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{recovery.championName}</SheetTitle>
            <StatusBadge variant={assignmentStatusVariantMap[recovery.assignmentStatus]}>
              {recovery.assignmentStatus}
            </StatusBadge>
          </div>
          <SheetDescription>
            {recovery.maxId} &middot; {recovery.caseId} &middot; {recovery.vehiclePlate}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <InfoGrid
              columns={2}
              items={[
                { label: "Champion", value: recovery.championName },
                { label: "MAX ID", value: recovery.maxId },
                { label: "Case ID", value: recovery.caseId },
                { label: "Zone", value: recovery.zone },
                { label: "Vehicle", value: `${recovery.vehiclePlate} (${recovery.vehicleType})` },
                { label: "Outstanding Balance", value: formatCurrency(recovery.outstandingBalance) },
                { label: "Days Overdue", value: `${recovery.daysOverdue} days` },
                { label: "Date Flagged", value: recovery.dateFlagged },
                { label: "Assigned Pair", value: recovery.pairCode ?? "—" },
              ]}
            />
          </div>
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          <Button
            className="h-9 px-3 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => setShowAssign(true)}
          >
            {recovery.assignmentStatus === "Assigned" ? "Reassign to New Pair" : "Assign to Pair"}
          </Button>
        </SheetFooter>
      </SheetContent>

      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Assign to Recovery Pair</DialogTitle>
            <DialogDescription>
              {recovery.championName} &middot; {recovery.caseId}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">Recovery Pair</label>
              <Select value={pairId} onValueChange={setPairId}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select a recovery pair" />
                </SelectTrigger>
                <SelectContent>
                  {eligiblePairs.map((pair) => (
                    <SelectItem key={pair.id} value={pair.id}>
                      {pair.pairCode} &middot; {officerNames(pair)} &middot; {pair.zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowAssign(false)}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!pairId}
              onClick={handleAssign}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
