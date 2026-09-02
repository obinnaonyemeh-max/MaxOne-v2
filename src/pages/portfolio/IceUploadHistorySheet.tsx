import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { DataTable } from "@/components/max"
import { type IceUploadBatch } from "@/data/mockIceUploadBatches"
import { getIceUploadHistoryColumns } from "./iceUploadHistoryColumns"

interface IceUploadHistorySheetProps {
  open: boolean
  onClose: () => void
  batches: IceUploadBatch[]
  onDownloadLog: (batch: IceUploadBatch) => void
}

export function IceUploadHistorySheet({ open, onClose, batches, onDownloadLog }: IceUploadHistorySheetProps) {
  const columns = getIceUploadHistoryColumns({ onDownloadLog })

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-sidebar-item-active">Upload History</SheetTitle>
          <SheetDescription>All bulk ICE contract upload batches, most recent first.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <DataTable columns={columns} data={batches} emptyMessage="No uploads yet." />
        </div>
      </SheetContent>
    </Sheet>
  )
}
