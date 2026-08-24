import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DocDropZoneProps {
  file: File | null
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeLabel?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  showClickHint?: boolean
  className?: string
}

export function DocDropZone({
  file,
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  maxSizeLabel = "PDF, DOC up to 10MB",
  label = "Drag and drop your document",
  icon,
  showClickHint = true,
  className,
}: DocDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const f = e.dataTransfer.files[0]
        if (f) onFileSelect(f)
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-5 cursor-pointer transition-colors min-h-[100px]",
        isDragOver
          ? "border-brand-primary bg-brand-primary/5"
          : file
          ? "border-status-success/40 bg-status-success/5"
          : "border-gray-300 bg-gray-50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
        }}
        className="hidden"
      />
      {file ? (
        <div className="text-center">
          <Upload className="mx-auto h-7 w-7 text-status-success mb-2" />
          <p className="font-medium text-status-success text-sm">{file.name}</p>
          <p className="mt-1 text-muted-foreground text-xs">File ready to submit</p>
        </div>
      ) : (
        <div className="text-center">
          {icon ?? <Upload className="mx-auto h-7 w-7 text-gray-400 mb-2" />}
          <p className="font-medium text-sidebar-item text-sm">{label}</p>
          {showClickHint && (
            <p className="mt-1 text-sm">
              <span className="text-sidebar-item">or </span>
              <span className="text-status-info underline">click to upload</span>
            </p>
          )}
          {maxSizeLabel && <p className="mt-2 text-muted-foreground text-xs">{maxSizeLabel}</p>}
        </div>
      )}
    </div>
  )
}
