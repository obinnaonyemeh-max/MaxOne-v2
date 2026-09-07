import { cn } from "@/lib/utils"

export interface SegmentedStatCardItem {
  label: string
  value: number
  color: string
}

export interface SegmentedStatCardProps {
  title: string
  value: string | number
  items: SegmentedStatCardItem[]
  className?: string
}

const formatCount = (value: number) => Math.max(0, value).toLocaleString()

export function SegmentedStatCard({
  title,
  value,
  items,
  className,
}: SegmentedStatCardProps) {
  const normalizedItems = items.map((item) => ({
    ...item,
    value: Math.max(0, item.value),
  }))
  const hasSegments = normalizedItems.some((item) => item.value > 0)

  return (
    <section
      className={cn(
        "w-full rounded-lg border border-gray-200 bg-gray-25 px-4 py-4",
        className
      )}
      aria-label={title}
    >
      <p className="text-[13px] font-medium text-gray-600">{title}</p>
      <p className="mt-1 text-[24px] font-medium leading-tight text-gray-950">
        {typeof value === "number" ? formatCount(value) : value}
      </p>

      <div className="my-4 border-t border-dotted border-divider" />

      <div
        className="flex h-8 overflow-hidden rounded-md"
        aria-label={normalizedItems
          .map((item) => `${item.label} ${formatCount(item.value)}`)
          .join(", ")}
      >
        {hasSegments ? (
          normalizedItems.map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: item.color,
                flexBasis: 0,
                flexGrow: item.value,
              }}
            />
          ))
        ) : (
          <div className="flex-1 bg-gray-200" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-gray-600">
        {normalizedItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span>
              {item.label} -{" "}
              <strong className="font-semibold text-gray-700">
                {formatCount(item.value)}
              </strong>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
