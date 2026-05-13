import { cn } from "@/lib/utils"

export interface CheckboxGridItem {
  id: string
  label: string
}

export interface CheckboxGridProps {
  items: CheckboxGridItem[]
  checked: Set<string>
  onToggle: (id: string) => void
  columns?: 1 | 2 | 3
  className?: string
}

const columnClasses: Record<NonNullable<CheckboxGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
}

export function CheckboxGrid({ items, checked, onToggle, columns = 2, className }: CheckboxGridProps) {
  return (
    <div className={cn("grid gap-2", columnClasses[columns], className)}>
      {items.map((item) => {
        const isChecked = checked.has(item.id)
        return (
          <label
            key={item.id}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
              isChecked
                ? "border-brand-primary bg-brand-primary/10"
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 rounded accent-gray-950 shrink-0"
            />
            <span className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
              {item.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
