import { useState, useId } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

interface TrendDataPoint {
  label: string
  value: number
}

interface TrendChartCardProps {
  title: string
  currentValue?: number
  currentValueLabel?: string
  unit: string
  data: TrendDataPoint[]
  lineColor?: string
  periodOptions?: { value: string; label: string }[]
  defaultPeriod?: string
  valueColor?: string
  yAxisDomain?: [number, number]
  yAxisTicks?: number[]
  onPeriodChange?: (period: string) => void
  showPeriodOptions?: boolean
  showCurrentValue?: boolean
  chartType?: "line" | "area"
  chartHeight?: number
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  unit: string
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
          {payload[0].value}{unit}
        </span>
      </div>
    </div>
  )
}

const defaultPeriodOptions = [
  { value: "1h", label: "1H" },
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "custom", label: "Custom" },
]

export function TrendChartCard({
  title,
  currentValue,
  currentValueLabel,
  unit,
  data,
  lineColor = "var(--color-success)",
  periodOptions = defaultPeriodOptions,
  defaultPeriod = "24h",
  valueColor = "text-success",
  yAxisDomain = [0, 100],
  yAxisTicks,
  onPeriodChange,
  showPeriodOptions = true,
  showCurrentValue = true,
  chartType = "line",
  chartHeight = 180,
}: TrendChartCardProps) {
  const fillId = `trendAreaFill-${useId().replace(/:/g, "")}`
  const [period, setPeriod] = useState(defaultPeriod)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>()
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>()
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false)

  const handlePeriodClick = (value: string) => {
    if (value === "custom") {
      setCustomPopoverOpen(true)
    } else {
      setPeriod(value)
      onPeriodChange?.(value)
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
          {title}
        </h3>
        {showPeriodOptions && (
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
        )}
      </div>

      {/* Current Value */}
      {showCurrentValue && (
        <div className="mb-4">
          <span
            className="block text-breadcrumb-root mb-0.5"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            {currentValueLabel}
          </span>
          <span
            className={valueColor}
            style={{ fontSize: "24px", fontWeight: 600 }}
          >
            {currentValue}
            <span
              className="text-breadcrumb-root"
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              {unit}
            </span>
          </span>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal
                vertical={false}
                stroke="var(--color-gray-200)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                ticks={yAxisTicks}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#${fillId})`}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 4, fill: lineColor }}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                horizontal
                vertical={false}
                stroke="var(--color-gray-200)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                ticks={yAxisTicks}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 4, fill: lineColor }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
