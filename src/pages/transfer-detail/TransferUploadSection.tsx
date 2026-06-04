import { InfoCard, DocUpload } from "@/components/max"

interface Props {
  uploadedFile: File | null
  onFileSelect: (f: File) => void
  showCard?: boolean
}

export function TransferUploadSection({ uploadedFile, onFileSelect, showCard = true }: Props) {
  const content = (
    <DocUpload uploadedFile={uploadedFile} onFileSelect={onFileSelect} />
  )

  return showCard ? (
    <InfoCard title="UPLOAD TRANSFER DOCUMENT">{content}</InfoCard>
  ) : content
}
