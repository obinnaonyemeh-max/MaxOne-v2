import React, { useRef, useState } from "react"

export function AddVehicleOptionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-gray-50 p-6 text-center transition-all hover:border-gray-300"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        <img src={icon} alt="" className="h-12 w-auto" />
      </div>
      <div>
        <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>{title}</p>
        <p className="mt-1 font-medium text-breadcrumb-root" style={{ fontSize: "12px" }}>{description}</p>
      </div>
    </button>
  )
}

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

export function FileDropZone({
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

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors h-full min-h-[280px] ${
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
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <img src="/images/xls.svg" alt="XLS" className="h-12 w-auto" />
      </div>

      {file ? (
        <div className="text-center">
          <p className="font-medium text-green-600" style={{ fontSize: "14px" }}>{file.name}</p>
          <p className="mt-1 text-green-500" style={{ fontSize: "12px" }}>File uploaded successfully</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-medium text-sidebar-item" style={{ fontSize: "14px" }}>
            Drag and drop filled template sheet
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
