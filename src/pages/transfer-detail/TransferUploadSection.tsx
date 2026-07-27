import { Download } from "lucide-react"

import { InfoCard, DocUpload } from "@/components/max"

const TEMPLATE_URL = "/templates/ownership-transfer-template.pdf"

interface Props {
  uploadedFile: File | null
  onFileSelect: (f: File) => void
  showCard?: boolean
}

export function TransferUploadSection({ uploadedFile, onFileSelect, showCard = true }: Props) {
  const content = (
    <DocUpload uploadedFile={uploadedFile} onFileSelect={onFileSelect} />
  )

  const downloadAction = (
    <a
      href={TEMPLATE_URL}
      download
      className="inline-flex items-center gap-1.5 text-sm font-medium text-status-warning underline underline-offset-4 hover:opacity-80"
    >
      <Download className="h-4 w-4" />
      Download template sheet
    </a>
  )

  return showCard ? (
    <InfoCard title="UPLOAD TRANSFER DOCUMENT" action={downloadAction}>
      {content}
    </InfoCard>
  ) : content
}
