import { cn } from "@/lib/utils"

interface InfoItem {
  label: string
  value: string | null | undefined
}

interface InfoGridProps {
  items: InfoItem[]
  columns?: 2 | 3 | 4
  showDividers?: boolean
  className?: string
}

export function InfoGrid({ items, columns = 4, showDividers = false, className }: InfoGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }

  const totalRows = Math.ceil(items.length / columns)

  const isLastColumn = (index: number) => (index + 1) % columns === 0
  const isLastRow = (index: number) => Math.floor(index / columns) === totalRows - 1

  if (!showDividers) {
    return (
      <div className={cn("grid gap-4", gridCols[columns], className)}>
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-breadcrumb-root font-medium">{item.label}</p>
            <p className="font-medium text-sidebar-item-active" style={{ fontSize: '14px' }}>
              {item.value || "-"}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid", gridCols[columns], className)}>
      {items.map((item, index) => {
        const lastCol = isLastColumn(index) || index === items.length - 1
        const lastRow = isLastRow(index)

        return (
          <div
            key={index}
            className={cn(
              "space-y-1",
              !lastCol && "pr-4 mr-4 border-r border-gray-100",
              !lastRow && "pb-4 mb-4 border-b border-gray-100"
            )}
          >
            <p className="text-xs text-breadcrumb-root font-medium">{item.label}</p>
            <p className="font-medium text-sidebar-item-active" style={{ fontSize: '14px' }}>
              {item.value || "-"}
            </p>
          </div>
        )
      })}
    </div>
  )
}
