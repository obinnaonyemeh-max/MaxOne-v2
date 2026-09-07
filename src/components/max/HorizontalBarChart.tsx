import { useState, useCallback, type ReactNode } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

export interface BarChartSeries {
  name: string
  data: number[]
  color: string
}

interface HorizontalBarChartProps {
  title: string
  categories: string[]
  series: BarChartSeries[]
  showLegend?: boolean
  stacked?: boolean
  className?: string
  action?: ReactNode
  yAxisWidth?: number
  summaryLabel?: string
  summaryValue?: string | number
  chartHeight?: number
  fill?: boolean
}

export function HorizontalBarChart({
  title,
  categories,
  series,
  showLegend = false,
  stacked = false,
  className,
  action,
  yAxisWidth = 70,
  summaryLabel,
  summaryValue,
  chartHeight = 250,
  fill = false,
}: HorizontalBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onBarEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  const onBarLeave = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const chartData = categories.map((category, i) => {
    const entry: Record<string, string | number> = { name: category }
    series.forEach((s) => {
      entry[s.name] = s.data[i] ?? 0
    })
    return entry
  })

  return (
    <div
      className={cn(
        "min-w-0 w-full bg-gray-25 border border-gray-200 rounded-lg",
        fill && "flex h-full min-h-0 flex-col",
        className
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-2">
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
        {action}
      </div>

      {summaryLabel && (
        <div className="px-5 pb-2">
          <p className="text-[12px] font-medium text-gray-500">{summaryLabel}</p>
          {summaryValue !== undefined && (
            <p className="mt-0.5 text-[24px] font-semibold text-gray-950">
              {typeof summaryValue === "number"
                ? summaryValue.toLocaleString()
                : summaryValue}
            </p>
          )}
        </div>
      )}

      <div className={cn("px-3 pb-4", fill && "min-h-0 flex-1")}>
        <ResponsiveContainer width="100%" height={fill ? "100%" : chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--color-gray-200)"
            />
            <XAxis
              type="number"
              tick={{ fill: "var(--color-gray-400)", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--color-gray-600)", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={yAxisWidth}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div
                    style={{
                      backgroundColor: "var(--color-gray-900)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <span style={{ color: "var(--color-gray-400)", fontSize: "12px", fontWeight: 500 }}>
                      {label}
                    </span>
                    {payload.map((entry) => (
                      <div
                        key={entry.name}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: entry.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
                          {entry.name}: {Number(entry.value).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: "var(--color-gray-600)" }}
              />
            )}
            {series.map((s, seriesIndex) => (
              <Bar
                key={s.name}
                dataKey={s.name}
                fill={s.color}
                stackId={stacked ? "stack" : undefined}
                radius={
                  stacked && seriesIndex < series.length - 1
                    ? [0, 0, 0, 0]
                    : [0, 4, 4, 0]
                }
                barSize={stacked ? 16 : 12}
                onMouseEnter={onBarEnter}
                onMouseLeave={onBarLeave}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${s.name}-${entry.name}`}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                    style={{ transition: "opacity 0.2s ease", cursor: "pointer" }}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
