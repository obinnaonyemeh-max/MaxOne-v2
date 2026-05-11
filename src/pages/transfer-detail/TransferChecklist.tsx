import { InfoCard } from "@/components/max"
import { cn } from "@/lib/utils"
import { checklistItems } from "./data"

interface Props {
  isInProgressMode: boolean
  checkedIds: Set<string>
  onToggle: (id: string) => void
}

function CheckedBox() {
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-status-success mt-0.5">
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function EmptyBox() {
  return <div className="h-5 w-5 shrink-0 rounded border-2 border-gray-300 mt-0.5" />
}

export function TransferChecklist({ isInProgressMode, checkedIds, onToggle }: Props) {
  return (
    <InfoCard title={isInProgressMode ? "TRANSFER CHECKLIST" : "COMPLETED CHECKLIST"}>
      <div className="flex flex-col divide-y divide-border">
        {checklistItems.map((item) => {
          const isChecked = !isInProgressMode || checkedIds.has(item.id)
          return (
            <div
              key={item.id}
              className={cn("flex items-start gap-3 py-3", isInProgressMode && "cursor-pointer")}
              onClick={() => isInProgressMode && onToggle(item.id)}
            >
              {isChecked ? <CheckedBox /> : <EmptyBox />}
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isChecked && !isInProgressMode && "text-foreground line-through decoration-muted-foreground",
                    isInProgressMode && checkedIds.has(item.id) && "text-muted-foreground line-through",
                    !isChecked && "text-foreground"
                  )}
                >
                  {item.text}
                </span>
                {!isInProgressMode && (
                  <span className="text-xs text-muted-foreground">
                    {item.completedBy} · {item.completedAt}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </InfoCard>
  )
}
