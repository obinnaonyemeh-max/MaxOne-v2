import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InfoItem {
  label: string
  value: ReactNode
}

interface InfoGridProps {
  items: InfoItem[]
  columns?: 2 | 3 | 4
  showDividers?: boolean
  className?: string
}

export function InfoGrid({ items, columns = 4, showDividers = false, className }: InfoGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  const totalRows = Math.ceil(items.length / columns)

  const isLastColumn = (index: number) => (index + 1) % columns === 0
  const isLastRow = (index: number) => Math.floor(index / columns) === totalRows - 1

  if (!showDividers) {
    return (
      <div className={cn("grid gap-4", gridCols[columns], className)}>
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-xs text-breadcrumb-root font-medium">{item.label}</p>
            <p className="font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>
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
            key={item.label}
            className={cn(
              "space-y-1",
              index < items.length - 1 &&
                "max-lg:border-b max-lg:border-gray-100 max-lg:pb-4 max-lg:mb-4",
              !lastCol && "lg:pr-4 lg:mr-4 lg:border-r lg:border-gray-100",
              !lastRow && "lg:pb-4 lg:mb-4 lg:border-b lg:border-gray-100"
            )}
          >
            <p className="text-xs text-breadcrumb-root font-medium">{item.label}</p>
            <p className="font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>
              {item.value || "-"}
            </p>
          </div>
        )
      })}
    </div>
  )
}
