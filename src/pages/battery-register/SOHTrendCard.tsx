import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { SOHHistoryPoint } from "@/data/mockBatteryRegisterData"

interface SOHTrendCardProps {
  currentSOH: number
  sohHistory: SOHHistoryPoint[]
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
        {label}
      </span>
      <div style={{ marginTop: "2px" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
          {payload[0].value}% SOH
        </span>
      </div>
    </div>
  )
}

const periodOptions = [
  { value: "30d", label: "30D" },
  { value: "2m", label: "2M" },
  { value: "6m", label: "6M" },
  { value: "custom", label: "Custom" },
]

export function SOHTrendCard({ currentSOH, sohHistory }: SOHTrendCardProps) {
  const [period, setPeriod] = useState("6m")
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>()
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>()
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false)

  const eventPoints = sohHistory.filter((point) => point.hasEvent)

  const handlePeriodClick = (value: string) => {
    if (value === "custom") {
      setCustomPopoverOpen(true)
    } else {
      setPeriod(value)
    }
  }

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setPeriod("custom")
      setCustomPopoverOpen(false)
    }
  }

  const getCustomLabel = () => {
    if (period === "custom" && customStartDate && customEndDate) {
      return `${format(customStartDate, "dd MMM")} - ${format(customEndDate, "dd MMM")}`
    }
    return "Custom"
  }

  return (
    <div className="bg-content-card border border-border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-sidebar-item-active"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          State of Health Trend
        </h3>
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
          {periodOptions.map((opt) => (
            opt.value === "custom" ? (
              <Popover key={opt.value} open={customPopoverOpen} onOpenChange={setCustomPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => handlePeriodClick(opt.value)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      period === opt.value
                        ? "bg-white text-sidebar-item-active shadow-sm"
                        : "text-breadcrumb-root hover:text-sidebar-item-active"
                    }`}
                  >
                    {getCustomLabel()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-sidebar-item-active">
                      Select Date Range
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-breadcrumb-root font-medium">
                          Start Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 h-9 text-sm font-normal"
                            >
                              <CalendarIcon className="h-4 w-4 text-breadcrumb-root" />
                              <span className={customStartDate ? "text-sidebar-item-active" : "text-breadcrumb-root"}>
                                {customStartDate ? format(customStartDate, "dd MMM yyyy") : "Pick date"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={customStartDate}
                              onSelect={setCustomStartDate}
                              disabled={(date) => customEndDate ? date > customEndDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-breadcrumb-root font-medium">
                          End Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2 h-9 text-sm font-normal"
                            >
                              <CalendarIcon className="h-4 w-4 text-breadcrumb-root" />
                              <span className={customEndDate ? "text-sidebar-item-active" : "text-breadcrumb-root"}>
                                {customEndDate ? format(customEndDate, "dd MMM yyyy") : "Pick date"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={customEndDate}
                              onSelect={setCustomEndDate}
                              disabled={(date) => customStartDate ? date < customStartDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <Button
                      onClick={handleApplyCustomRange}
                      disabled={!customStartDate || !customEndDate}
                      className="w-full"
                    >
                      Apply Range
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <button
                key={opt.value}
                onClick={() => handlePeriodClick(opt.value)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  period === opt.value
                    ? "bg-white text-sidebar-item-active shadow-sm"
                    : "text-breadcrumb-root hover:text-sidebar-item-active"
                }`}
              >
                {opt.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Current SOH */}
      <div className="mb-4">
        <span
          className="block text-breadcrumb-root mb-0.5"
          style={{ fontSize: "11px", fontWeight: 500 }}
        >
          Current State of Health
        </span>
        <span
          className="text-success"
          style={{ fontSize: "24px", fontWeight: 600 }}
        >
          {currentSOH}%
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sohHistory}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="var(--color-gray-200)"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 50, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-success)" }}
            />
            {eventPoints.map((point) => (
              <ReferenceDot
                key={point.month}
                x={point.month}
                y={point.value}
                r={8}
                fill="var(--color-status-warning)"
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
