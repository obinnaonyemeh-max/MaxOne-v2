import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts"
import type { DriverRadarMetric } from "@/data/mockVehicleActivity"

interface DriverScoreCardProps {
  score: number
  trendPercent: number
  trendDirection: "up" | "down"
  radar: DriverRadarMetric[]
  className?: string
}

function getScoreColor(score: number): string {
  if (score >= 70) return "var(--color-success)"
  if (score >= 50) return "var(--color-status-warning)"
  return "var(--color-status-danger)"
}

export function DriverScoreCard({
  score,
  trendPercent,
  trendDirection,
  radar,
  className,
}: DriverScoreCardProps) {
  const scoreColor = getScoreColor(score)
  const chartData = radar.map((item) => ({
    metric: item.metric,
    value: item.value,
  }))

  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      <h3 className="text-sidebar-item-active mb-3" style={{ fontSize: "16px", fontWeight: 500 }}>
        Driver Score
      </h3>

      <div className="flex items-end gap-3 mb-2">
        <span className="text-sidebar-item-active" style={{ fontSize: "36px", fontWeight: 600, lineHeight: 1 }}>
          {score}
        </span>
        <span
          className={trendDirection === "up" ? "text-status-success" : "text-status-danger"}
          style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}
        >
          {trendPercent}% {trendDirection === "up" ? "increase" : "decrease"}
        </span>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--color-gray-200)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 10, fill: "var(--color-gray-500)" }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke={scoreColor}
              fill={scoreColor}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
