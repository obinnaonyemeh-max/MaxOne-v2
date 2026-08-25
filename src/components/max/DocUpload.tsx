import { useState, useEffect, useRef } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { cn } from "@/lib/utils"
import { DocDropZone } from "./DocDropZone"

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

type UploadState = "idle" | "uploading" | "uploaded"

export interface DocUploadProps {
  uploadedFile: File | null
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeLabel?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  showClickHint?: boolean
  /** Tailwind min-height class applied to every state so the box keeps a stable size. */
  minHeightClass?: string
}

export function DocUpload({
  uploadedFile,
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  maxSizeLabel = "PDF, DOC up to 10MB",
  label,
  icon,
  showClickHint,
  minHeightClass = "min-h-[100px]",
}: DocUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>(
    uploadedFile ? "uploaded" : "idle"
  )
  const [progress, setProgress] = useState(0)
  const [pendingFile, setPendingFile] = useState<File | null>(uploadedFile)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Hold onFileSelect in a ref so the progress interval doesn't restart when the parent
  // passes a fresh closure on every render.
  const onFileSelectRef = useRef(onFileSelect)
  useEffect(() => { onFileSelectRef.current = onFileSelect }, [onFileSelect])

  const handleFileSelect = (file: File) => {
    setPendingFile(file)
    setPreviewUrl(null)
    setUploadState("uploading")
    setProgress(0)
  }

  useEffect(() => {
    if (uploadState !== "uploading") return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3 + Math.random() * 4
        if (next >= 100) {
          clearInterval(interval)
          setUploadState("uploaded")
          if (pendingFile) onFileSelectRef.current(pendingFile)
          return 100
        }
        return next
      })
    }, 60)

    return () => clearInterval(interval)
  }, [uploadState, pendingFile])

  useEffect(() => {
    if (uploadState !== "uploaded" || !pendingFile) return

    let cancelled = false

    const generate = async () => {
      if (pendingFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(pendingFile)
        if (cancelled) { URL.revokeObjectURL(url); return }
        setPreviewUrl(url)
        return
      }

      if (pendingFile.type === "application/pdf") {
        const arrayBuffer = await pendingFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1 })

        const scale = Math.min(80 / viewport.width, 104 / viewport.height)
        const scaled = page.getViewport({ scale })

        const canvas = document.createElement("canvas")
        canvas.width = scaled.width
        canvas.height = scaled.height
        const ctx = canvas.getContext("2d")!
        await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise

        if (!cancelled) setPreviewUrl(canvas.toDataURL())
      }
    }

    generate()
    return () => { cancelled = true }
  }, [uploadState, pendingFile])

  const replaceInputRef = useRef<HTMLInputElement>(null)

  const prevUrlRef = useRef<string | null>(null)
  useEffect(() => {
    const prev = prevUrlRef.current
    prevUrlRef.current = previewUrl
    if (prev && prev.startsWith("blob:") && prev !== previewUrl) {
      URL.revokeObjectURL(prev)
    }
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <>
      {uploadState === "idle" && (
        <DocDropZone
          file={null}
          onFileSelect={handleFileSelect}
          accept={accept}
          maxSizeLabel={maxSizeLabel}
          label={label}
          icon={icon}
          showClickHint={showClickHint}
          className={minHeightClass}
        />
      )}

      {uploadState === "uploading" && (
        <div className={cn("flex flex-col justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-5", minHeightClass)}>
          <p className="text-[13px] text-gray-500">
            Uploading{" "}
            <span className="font-semibold text-gray-950">{pendingFile?.name}</span>
            ...
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-status-warning transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {uploadState === "uploaded" && (
        <div className={cn("flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-4", minHeightClass)}>
          <div className="group relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={pendingFile?.name}
                className="h-14 w-12 rounded object-cover shadow-md"
              />
            ) : (
              <DocumentThumbnail />
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity bg-gray-950/50">
              <button
                onClick={() => replaceInputRef.current?.click()}
                className="rounded bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-900 hover:bg-white transition-colors"
              >
                Replace
              </button>
            </div>
            <input
              ref={replaceInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileSelect(f)
                e.target.value = ""
              }}
            />
          </div>
          <p className="text-[12px] font-medium text-gray-600 max-w-[200px] truncate">
            {pendingFile?.name}
          </p>
        </div>
      )}
    </>
  )
}

function DocumentThumbnail() {
  const FOLD = 14

  return (
    <div className="relative drop-shadow-md" style={{ width: 48, height: 62 }}>
      <div
        className="absolute inset-0 bg-white"
        style={{
          clipPath: `polygon(0 0, calc(100% - ${FOLD}px) 0, 100% ${FOLD}px, 100% 100%, 0 100%)`,
        }}
      >
        <div className="flex flex-col gap-[5px] px-3" style={{ paddingTop: FOLD + 8 }}>
          {[100, 100, 100, 85, 100, 100, 70].map((w, i) => (
            <div
              key={i}
              className="h-[4px] rounded-full bg-gray-200"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute top-0 right-0 bg-gray-200"
        style={{
          width: FOLD,
          height: FOLD,
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />
    </div>
  )
}
