import { PauseCircle } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { StatusBadge } from "./StatusBadge"

export interface ContractPauseRecord {
  id: string
  reason: string
  pausedBy: string
  pausedAt: string
  resumedAt: string | null
}

interface PauseHistorySheetProps {
  open: boolean
  onClose: () => void
  championName: string
  contractId: string
  records: ContractPauseRecord[]
}

export function PauseHistorySheet({ open, onClose, championName, contractId, records }: PauseHistorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent size="md" className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-sidebar-item-active">Pause History</SheetTitle>
          <SheetDescription>
            {championName} &middot; {contractId}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16 text-center">
              <PauseCircle className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-breadcrumb-root">
                This contract has never been paused.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map((record) => (
                <div key={record.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-table-text-primary">{record.pausedAt}</span>
                    <StatusBadge variant={record.resumedAt ? "default" : "warning"}>
                      {record.resumedAt ? "Resumed" : "Active Pause"}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-table-text leading-relaxed">{record.reason}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Paused by {record.pausedBy}</span>
                    {record.resumedAt && <span>Resumed {record.resumedAt}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
