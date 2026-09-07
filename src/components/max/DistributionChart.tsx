import { useState, useCallback, type ReactNode } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export interface DistributionDataItem {
  label: string
  value: number
  color: string
}

interface DistributionChartProps {
  title: string
  data: DistributionDataItem[]
  legendTitle?: string
  className?: string
  action?: ReactNode
  summaryValue?: string | number
  centerContent?: boolean
  compact?: boolean
}

export function DistributionChart({
  title,
  data,
  legendTitle = "Legend",
  className,
  action,
  summaryValue,
  centerContent = false,
  compact = false,
}: DistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  const onPieLeave = useCallback(() => {
    setActiveIndex(null)
  }, [])

  return (
    <div
      className={cn(
        "min-w-0 w-full bg-white border border-gray-200 rounded-lg p-4",
        compact && "flex h-full min-h-0 flex-col overflow-hidden p-3",
        className
      )}
    >
      <div className={cn("mb-4 flex items-center justify-between gap-3", compact && "mb-2 shrink-0")}>
        <h4
          className="text-gray-950"
          style={{ fontSize: compact ? "14px" : "16px", fontWeight: 500 }}
        >
          {title}
        </h4>
        {action}
      </div>

      {summaryValue !== undefined && (
        <p className="mb-3 text-[24px] font-medium text-gray-950">
          {typeof summaryValue === "number" ? summaryValue.toLocaleString() : summaryValue}
        </p>
      )}

      <div
        className={cn(
          "flex min-w-0 w-full flex-col items-center gap-4 sm:flex-row sm:items-center",
          compact ? "gap-4 sm:gap-4" : "sm:gap-10",
          centerContent && "justify-center",
          compact && "min-h-0 flex-1"
        )}
      >
        <div
          className={cn(
            "shrink-0",
            compact
              ? "h-[108px] w-[108px]"
              : "h-[160px] w-[160px] sm:h-[185px] sm:w-[185px]"
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={compact ? 26 : 45}
                outerRadius={compact ? 44 : 75}
                cornerRadius={compact ? 6 : 8}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
                strokeWidth={0}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.label}
                    fill={item.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                    style={{
                      transition: "opacity 0.2s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const entry = payload[0]
                  const value = entry.value as number
                  return (
                    <div
                      style={{
                        backgroundColor: "var(--color-gray-900)",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: entry.payload?.color || entry.payload?.fill,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
                        {entry.name}: {value.toLocaleString()}
                      </span>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="min-w-0 w-full flex-1">
          <p
            className="text-gray-600 mb-2"
            style={{ fontSize: compact ? "11px" : "13px", fontWeight: 500 }}
          >
            {legendTitle}
          </p>
          <div className={cn("space-y-1.5", compact && "space-y-1")}>
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="shrink-0 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="text-gray-400"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  {item.label}
                </span>
                <span
                  className="text-gray-950"
                  style={{ fontSize: "12px", fontWeight: 500, marginLeft: "-4px" }}
                >
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
