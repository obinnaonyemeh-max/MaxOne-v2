import { Eye } from "lucide-react"
import { Modal } from "@/components/max"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  VehicleDocumentRecord,
  ChecklistDocument,
  DocumentStatus,
} from "@/data/mockVehicleDocuments"

interface Props {
  record: VehicleDocumentRecord | null
  onClose: () => void
  onUpload?: () => void
  onReplace?: (doc: ChecklistDocument) => void
}

const dotClass: Record<DocumentStatus, string> = {
  valid: "bg-status-success",
  expiring: "bg-status-warning",
  expired: "bg-status-danger",
}

const expiryColorClass: Record<DocumentStatus, string> = {
  valid: "text-status-success",
  expiring: "text-status-warning",
  expired: "text-status-danger",
}

function ChecklistRow({
  doc,
  onReplace,
}: {
  doc: ChecklistDocument
  onReplace?: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", dotClass[doc.status])} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>
          {doc.name}
        </p>
        <p className="font-medium text-breadcrumb-root" style={{ fontSize: "12px" }}>
          Uploaded by {doc.uploadedBy} · {doc.uploadStatus}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className="font-medium text-gray-500 uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.5px" }}
        >
          {doc.expiry ? "Expiry" : "No Expiry"}
        </p>
        {doc.expiry && (
          <p
            className={cn("font-semibold", expiryColorClass[doc.status])}
            style={{ fontSize: "13px" }}
          >
            {doc.expiry}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        title="View document"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 text-xs px-3 shrink-0"
        onClick={onReplace}
      >
        Replace
      </Button>
    </div>
  )
}

export function DocumentChecklistModal({ record, onClose, onUpload, onReplace }: Props) {
  return (
    <Modal
      open={!!record}
      onOpenChange={onClose}
      title="Document Checklist"
      subtitle={record?.vehicleId}
      className="max-w-2xl"
      maxHeight="85vh"
      primaryAction={{
        label: "Upload Document",
        onClick: () => onUpload?.(),
        icon: true,
      }}
      secondaryAction={{ label: "Close", onClick: onClose }}
    >
      {record && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p
                className="font-medium text-gray-500 uppercase mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Champion
              </p>
              <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>
                {record.champion}
              </p>
            </div>
            <div>
              <p
                className="font-medium text-gray-500 uppercase mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Completion
              </p>
              <p
                className={cn(
                  "font-semibold",
                  record.completion >= 100
                    ? "text-status-success"
                    : record.completion >= 80
                      ? "text-status-warning"
                      : "text-status-danger"
                )}
                style={{ fontSize: "14px" }}
              >
                {record.completion}%
              </p>
            </div>
            <div>
              <p
                className="font-medium text-gray-500 uppercase mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Location
              </p>
              <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>
                {record.location}
              </p>
            </div>
          </div>

          <div>
            <p
              className="font-medium text-gray-500 uppercase mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.5px" }}
            >
              Required Documents (Nigeria)
            </p>
            <div className="flex flex-col gap-2">
              {record.checklist.map((doc) => (
                <ChecklistRow
                  key={doc.name}
                  doc={doc}
                  onReplace={() => onReplace?.(doc)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
