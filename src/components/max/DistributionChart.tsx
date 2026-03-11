import { useState, useCallback } from "react"
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
  className?: string
}

export function DistributionChart({
  title,
  data,
  className,
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
        "bg-white border border-gray-200 rounded-lg p-4",
        className
      )}
    >
      <h4
        className="text-gray-950 mb-4"
        style={{ fontSize: "16px", fontWeight: 500 }}
      >
        {title}
      </h4>

      <div className="flex items-center" style={{ gap: "100px" }}>
        <div className="shrink-0" style={{ width: "185px", height: "185px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                cornerRadius={8}
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
                        backgroundColor: "#1E1E1E",
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

        <div className="flex-1">
          <p
            className="text-gray-600 mb-2"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Legend
          </p>
          <div className="space-y-1.5">
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
