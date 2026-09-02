import { useState } from "react"
import { Download } from "lucide-react"

import { DocUpload } from "@/components/max"
import { Button } from "@/components/ui/button"

interface IceUploadWidgetProps {
  onUpload: (file: File, recordCount: number) => void
}

export function IceUploadWidget({ onUpload }: IceUploadWidgetProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileSelect = (selected: File) => {
    if (!/\.(csv|xlsx)$/i.test(selected.name)) {
      setFileError("Unsupported file type — please upload a .csv or .xlsx file.")
      setFile(null)
      return
    }
    setFileError(null)
    setFile(selected)
  }

  const handleProcess = () => {
    if (!file) return
    const recordCount = 20 + Math.floor(Math.random() * 60)
    onUpload(file, recordCount)
    setFile(null)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-sidebar-item-active text-sm">Upload ICE Contracts</h3>
        <p className="text-xs text-breadcrumb-root mt-1">
          Upload excel/CSV sheets containing ICE contract parameters for batch processing.
        </p>
      </div>

      <DocUpload
        uploadedFile={file}
        onFileSelect={handleFileSelect}
        accept=".csv,.xlsx"
        maxSizeLabel="CSV, XLSX up to 10MB"
        label="Drag and drop your ICE contracts sheet"
        minHeightClass="min-h-[180px]"
      />

      {fileError && <p className="text-xs font-medium text-status-danger">{fileError}</p>}

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button variant="outline" className="h-10 gap-2" asChild>
          <a href="#">
            <Download className="h-4 w-4" />
            Download ICE Template
          </a>
        </Button>
        <Button
          className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
          disabled={!file}
          onClick={handleProcess}
        >
          Process Batch Upload
        </Button>
      </div>
    </div>
  )
}
