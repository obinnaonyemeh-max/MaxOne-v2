import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Download } from "lucide-react"

import { StatusBadge } from "@/components/max"
import { type IceUploadBatch, iceUploadStatusVariantMap } from "@/data/mockIceUploadBatches"

interface IceUploadHistoryColumnsOptions {
  onDownloadLog: (batch: IceUploadBatch) => void
}

export function getIceUploadHistoryColumns({
  onDownloadLog,
}: IceUploadHistoryColumnsOptions): ColumnDef<IceUploadBatch>[] {
  return [
    {
      accessorKey: "batchId",
      header: "Batch ID",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-sidebar-item-active">
          {row.original.batchId}
        </span>
      ),
    },
    {
      accessorKey: "uploadedAt",
      header: "Date & Time",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">
          {format(new Date(row.original.uploadedAt), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
      cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.uploadedBy}</span>,
    },
    {
      accessorKey: "records",
      header: "Records",
      cell: ({ row }) => (
        <span className="font-medium text-table-text text-sm">{row.original.records.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={iceUploadStatusVariantMap[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          disabled={row.original.status !== "Completed"}
          onClick={(e) => {
            e.stopPropagation()
            onDownloadLog(row.original)
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
        >
          <Download className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Download log</span>
        </button>
      ),
    },
  ]
}
