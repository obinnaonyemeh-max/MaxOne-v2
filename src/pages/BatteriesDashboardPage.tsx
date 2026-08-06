import { useState, useCallback } from "react"
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
import {
  TopBar,
  PageHeader,
  StatCard,
} from "@/components/max"
import { BatteryMap } from "@/components/max/BatteryMap"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  batteryStats,
  sohDistributionData,
  batteryStateData,
  batteryLocations,
  batteryAlerts,
} from "@/data/mockBatteryData"

const COLOR_SUCCESS = "var(--color-success)"
const COLOR_WARNING = "var(--color-status-warning)"
const COLOR_DANGER = "var(--color-status-danger)"
const COLOR_INFO = "var(--color-status-info)"
const COLOR_GRAY = "var(--color-gray-400)"

const stats = [
  {
    title: "Active Batteries",
    value: batteryStats.activeBatteries.toLocaleString(),
    indicatorColor: COLOR_SUCCESS,
  },
  {
    title: "Offline Batteries",
    value: batteryStats.offlineBatteries.toLocaleString(),
    indicatorColor: COLOR_GRAY,
  },
  {
    title: "Critical Alerts",
    value: batteryStats.criticalAlerts.total.toString(),
    indicatorColor: COLOR_DANGER,
  },
  {
    title: "Avg Battery SOH",
    value: `${batteryStats.avgSOH}%`,
    indicatorColor: COLOR_INFO,
  },
  {
    title: "At-Risk Batteries",
    value: batteryStats.atRiskBatteries.total.toLocaleString(),
    indicatorColor: COLOR_WARNING,
  },
  {
    title: "Pending Commands",
    value: batteryStats.pendingRemoteCommands.toString(),
    indicatorColor: COLOR_GRAY,
  },
]

function DarkTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "var(--color-gray-900)",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <span style={{ color: "var(--color-gray-400)", fontSize: "12px", fontWeight: 500 }}>
        {label}
      </span>
      <div style={{ marginTop: "4px" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
          {payload[0].value.toLocaleString()} batteries
        </span>
      </div>
    </div>
  )
}

export default function BatteriesDashboardPage() {
  const [period, setPeriod] = useState("6")
  const [hoveredSOHIndex, setHoveredSOHIndex] = useState<number | null>(null)
  const [hoveredStateIndex, setHoveredStateIndex] = useState<number | null>(null)

  const onSOHBarEnter = useCallback((_: unknown, index: number) => {
    setHoveredSOHIndex(index)
  }, [])

  const onSOHBarLeave = useCallback(() => {
    setHoveredSOHIndex(null)
  }, [])

  const onStateBarEnter = useCallback((_: unknown, index: number) => {
    setHoveredStateIndex(index)
  }, [])

  const onStateBarLeave = useCallback(() => {
    setHoveredStateIndex(null)
  }, [])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Batteries" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Batteries Dashboard"
          subtitle="Monitor battery health, status, and alerts across your fleet"
          className="px-0"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-6 gap-2">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Average State of Health Distribution */}
          <div className="bg-gray-25 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <h3
                className="text-gray-950"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Average State of Health Distribution
              </h3>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last month</SelectItem>
                  <SelectItem value="3">Last 3 months</SelectItem>
                  <SelectItem value="6">Last 6 months</SelectItem>
                  <SelectItem value="12">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-5 pb-2">
              <span
                className="text-gray-500"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                Total Batteries
              </span>
              <p
                className="text-gray-950"
                style={{ fontSize: "24px", fontWeight: 600 }}
              >
                {batteryStats.activeBatteries.toLocaleString()}
              </p>
            </div>
            <div className="px-3 pb-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={sohDistributionData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    horizontal
                    vertical={false}
                    stroke="var(--color-gray-200)"
                  />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "var(--color-gray-400)", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-gray-400)", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip cursor={false} content={<DarkTooltipContent />} />
                  <Bar
                    dataKey="count"
                    name="Batteries"
                    radius={[4, 4, 0, 0]}
                    barSize={48}
                    onMouseEnter={onSOHBarEnter}
                    onMouseLeave={onSOHBarLeave}
                  >
                    {sohDistributionData.map((entry, index) => (
                      <Cell
                        key={entry.range}
                        fill={entry.color}
                        opacity={
                          hoveredSOHIndex === null || hoveredSOHIndex === index
                            ? 1
                            : 0.35
                        }
                        style={{ transition: "opacity 0.2s ease", cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battery State Distribution */}
          <div className="bg-gray-25 border border-gray-200 rounded-lg">
            <div className="px-5 pt-5 pb-2">
              <h3
                className="text-gray-950"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Battery State Distribution
              </h3>
            </div>
            <div className="px-5 pb-2">
              <span
                className="text-gray-500"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                Total Batteries
              </span>
              <p
                className="text-gray-950"
                style={{ fontSize: "24px", fontWeight: 600 }}
              >
                {batteryStats.activeBatteries.toLocaleString()}
              </p>
            </div>
            <div className="px-3 pb-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={batteryStateData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    horizontal
                    vertical={false}
                    stroke="var(--color-gray-200)"
                  />
                  <XAxis
                    dataKey="state"
                    tick={{ fill: "var(--color-gray-400)", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-gray-400)", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip cursor={false} content={<DarkTooltipContent />} />
                  <Bar
                    dataKey="count"
                    name="Batteries"
                    radius={[4, 4, 0, 0]}
                    barSize={48}
                    onMouseEnter={onStateBarEnter}
                    onMouseLeave={onStateBarLeave}
                  >
                    {batteryStateData.map((entry, index) => (
                      <Cell
                        key={entry.state}
                        fill={entry.color}
                        opacity={
                          hoveredStateIndex === null || hoveredStateIndex === index
                            ? 1
                            : 0.35
                        }
                        style={{ transition: "opacity 0.2s ease", cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Battery Map */}
        <BatteryMap
          locations={batteryLocations}
          alerts={batteryAlerts}
          avgSOH={batteryStats.avgSOH}
          activeBatteries={batteryStats.activeBatteries}
          className="mt-6"
        />
      </div>
    </>
  )
}
