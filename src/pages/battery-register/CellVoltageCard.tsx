import { useMemo } from "react"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface CellVoltageCardProps {
  cellVoltages: number[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "var(--color-gray-900)",
        borderRadius: "8px",
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <span style={{ color: "var(--color-gray-400)", fontSize: "11px", fontWeight: 500 }}>
        Cell {label}
      </span>
      <div style={{ marginTop: "2px" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
          {payload[0].value} mV
        </span>
      </div>
    </div>
  )
}

function getCellColor(voltage: number, avg: number): string {
  if (voltage === 0) return "var(--color-gray-300)"
  if (voltage < avg * 0.5) return "var(--color-status-danger)"
  if (voltage < avg * 0.7) return "var(--color-status-warning)"
  return "var(--color-success)"
}

export function CellVoltageCard({ cellVoltages }: CellVoltageCardProps) {
  const stats = useMemo(() => {
    const validVoltages = cellVoltages.filter((v) => v > 0)
    if (validVoltages.length === 0) {
      return { max: 0, min: 0, avg: 0, diff: 0 }
    }
    const max = Math.max(...validVoltages)
    const min = Math.min(...validVoltages)
    const avg = Math.round(validVoltages.reduce((a, b) => a + b, 0) / validVoltages.length)
    const diff = max - min
    return { max, min, avg, diff }
  }, [cellVoltages])

  const maxValue = 500
  const chartData = cellVoltages.map((voltage, index) => ({
    cell: (index + 1).toString(),
    voltage,
    remaining: maxValue - voltage,
    color: getCellColor(voltage, stats.avg),
  }))

  return (
    <div className="bg-content-card border border-border rounded-lg p-5">
      {/* Header */}
      <h3
        className="text-sidebar-item-active mb-4"
        style={{ fontSize: "16px", fontWeight: 500 }}
      >
        Cell Voltage Distribution
      </h3>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <img src="/images/max_cell_volt.svg" alt="Max" className="h-5 w-5" />
          <span className="text-gray-600" style={{ fontSize: "13px" }}>
            Max Cell Volt - <strong>{stats.max} mV</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/images/min_cell_volt.svg" alt="Min" className="h-5 w-5" />
          <span className="text-gray-600" style={{ fontSize: "13px" }}>
            Min Cell Volt - <strong>{stats.min} mV</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/images/avg_volt.svg" alt="Average" className="h-5 w-5" />
          <span className="text-gray-600" style={{ fontSize: "13px" }}>
            Average Cell Volt - <strong>{stats.avg} mV</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/images/volt_diff.svg" alt="Difference" className="h-5 w-5" />
          <span className="text-gray-600" style={{ fontSize: "13px" }}>
            Cell Volt Difference - <strong>{stats.diff} mV</strong>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="var(--color-gray-200)"
            />
            <XAxis
              dataKey="cell"
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 500]}
              ticks={[0, 250, 500]}
            />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            {/* Voltage fill (bottom) */}
            <Bar
              dataKey="voltage"
              stackId="stack"
              barSize={24}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`voltage-${index}`}
                  fill={entry.color}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Bar>
            {/* Remaining space (top) - gray background */}
            <Bar
              dataKey="remaining"
              stackId="stack"
              fill="var(--color-gray-100)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
