import { Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  onCommence: () => void
}

export function TransferEmptyState({ onCommence }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Timer className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground text-[15px]">Ready to begin</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Clicking Commence will update the status to Transfer In Progress
        </p>
      </div>
      <Button className="mt-1" onClick={onCommence}>
        Commence Ownership Transfer
      </Button>
    </div>
  )
}
