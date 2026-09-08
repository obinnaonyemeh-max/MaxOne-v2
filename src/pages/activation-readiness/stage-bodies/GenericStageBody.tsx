import { Button } from "@/components/ui/button"

interface Props {
  onMarkCompleted: () => void
}

export function GenericStageBody({ onMarkCompleted }: Props) {
  return (
    <div className="flex justify-end">
      <Button
        size="sm"
        className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
        onClick={onMarkCompleted}
      >
        Mark as Completed
      </Button>
    </div>
  )
}
