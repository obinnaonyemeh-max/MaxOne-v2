import { FileText } from "lucide-react"
import { InfoCard, DocDropZone } from "@/components/max"
import { Button } from "@/components/ui/button"
import type { TransferRecord } from "@/data/mockTransferRecords"
import { isReturnedForCorrection } from "@/data/mockTransferRecords"

interface Props {
  record: TransferRecord
  isInProgressMode: boolean
  reuploadMode: boolean
  onReupload: () => void
  uploadedFile: File | null
  onFileSelect: (f: File) => void
}

export function TransferDocumentSection({
  record,
  isInProgressMode,
  reuploadMode,
  onReupload,
  uploadedFile,
  onFileSelect,
}: Props) {
  const documentName = `Ownership_Transfer_${record.vehicleId}_signed.pdf`
  const showDropZone = reuploadMode || (isInProgressMode && !isReturnedForCorrection(record))

  return (
    <InfoCard title={showDropZone ? "UPLOAD TRANSFER DOCUMENT" : "UPLOADED DOCUMENT"}>
      {showDropZone ? (
        <DocDropZone file={uploadedFile} onFileSelect={onFileSelect} />
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{documentName}</p>
              <p className="text-xs text-muted-foreground">Uploaded Today 11:31 · 1.2 MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Button variant="outline" className="h-8 text-xs">View</Button>
            {isReturnedForCorrection(record) && (
              <Button className="h-8 text-xs" onClick={onReupload}>
                Re-upload
              </Button>
            )}
          </div>
        </div>
      )}
    </InfoCard>
  )
}
