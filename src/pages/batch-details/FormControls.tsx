import { useRef, useState } from "react"
import { Upload } from "lucide-react"

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
        <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>{label}</label>
      {children}
    </div>
  )
}

export function DocDropZone({
  onFileSelect,
  file,
}: {
  onFileSelect: (file: File) => void
  file: File | null
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      onFileSelect(droppedFile)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors min-h-[200px] ${
        isDragOver
          ? "border-brand-primary bg-brand-primary/5"
          : file
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-gray-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
        onChange={(e) => {
          const selected = e.target.files?.[0]
          if (selected) onFileSelect(selected)
        }}
        className="hidden"
      />

      {file ? (
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-green-500 mb-2" />
          <p className="font-medium text-green-600" style={{ fontSize: "14px" }}>{file.name}</p>
          <p className="mt-1 text-green-500" style={{ fontSize: "12px" }}>File uploaded successfully</p>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="font-medium text-sidebar-item" style={{ fontSize: "14px" }}>
            Drag and drop your document
          </p>
          <p className="mt-1" style={{ fontSize: "14px" }}>
            <span className="text-sidebar-item">or </span>
            <span className="text-status-info underline">click to upload</span>
          </p>
        </div>
      )}
    </div>
  )
}
