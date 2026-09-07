import { useMemo, type ReactNode } from "react"
import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PeriodSegmentedControl } from "./PeriodSegmentedControl"
import { getPeriodBounds, usePeriodFilter } from "./periodFilter"
import { cn } from "@/lib/utils"

export interface TimeSeriesStatPoint {
  date: string
  value: number
  secondaryValue?: number
}

export interface TimeSeriesStatCardProps {
  title: string
  valueLabel: string
  data: TimeSeriesStatPoint[]
  primaryTooltipLabel: string
  secondaryTooltipLabel?: string
  lineColor?: string
  valueColorClassName?: string
  formatValue?: (value: number) => string
  formatSecondaryValue?: (value: number) => string
  valueAggregation?: "sum" | "average"
  chartHeight?: number
  className?: string
  fill?: boolean
  showPeriodFilter?: boolean
  headerAction?: ReactNode
}

const defaultFormat = (value: number) => value.toLocaleString()

function TrendTooltip({
  active,
  payload,
  primaryLabel,
  secondaryLabel,
  formatValue,
  formatSecondaryValue,
}: {
  active?: boolean
  payload?: Array<{ payload: TimeSeriesStatPoint }>
  primaryLabel: string
  secondaryLabel?: string
  formatValue: (value: number) => string
  formatSecondaryValue: (value: number) => string
}) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  return (
    <div className="min-w-40 rounded-lg bg-gray-900 px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium text-gray-400">
        {format(new Date(point.date), "dd MMM yyyy")}
      </p>
      <div className="mt-1.5 space-y-1 text-[12px] font-medium text-white">
        <div className="flex items-center justify-between gap-5">
          <span>{primaryLabel}</span>
          <span>{formatValue(point.value)}</span>
        </div>
        {secondaryLabel && point.secondaryValue !== undefined && (
          <div className="flex items-center justify-between gap-5">
            <span>{secondaryLabel}</span>
            <span>{formatSecondaryValue(point.secondaryValue)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function TimeSeriesStatCard({
  title,
  valueLabel,
  data,
  primaryTooltipLabel,
  secondaryTooltipLabel,
  lineColor = "var(--color-success)",
  valueColorClassName = "text-success",
  formatValue = defaultFormat,
  formatSecondaryValue = defaultFormat,
  valueAggregation = "sum",
  chartHeight = 280,
  className,
  fill = false,
  showPeriodFilter = true,
  headerAction,
}: TimeSeriesStatCardProps) {
  const {
    period,
    setPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    customOpen,
    setCustomOpen,
    applyCustomRange,
  } = usePeriodFilter()

  const latestDate = useMemo(
    () =>
      data.reduce<Date | null>((latest, point) => {
        const date = new Date(point.date)
        return !latest || date > latest ? date : latest
      }, null),
    [data]
  )

  const filteredData = useMemo(() => {
    if (!latestDate) return []

    const { from, to } = getPeriodBounds(
      period,
      latestDate,
      customStartDate,
      customEndDate
    )
    return data.filter((point) => {
      const date = new Date(point.date)
      return date >= from && date <= to
    })
  }, [customEndDate, customStartDate, data, latestDate, period])

  const valueTotal = filteredData.reduce((sum, point) => sum + point.value, 0)
  const totalValue =
    valueAggregation === "average" && filteredData.length > 0
      ? valueTotal / filteredData.length
      : valueTotal
  const chartData = filteredData.map((point) => ({
    ...point,
    label:
      filteredData.length <= 31
        ? format(new Date(point.date), "d")
        : format(new Date(point.date), "dd MMM"),
  }))

  return (
    <section
      className={cn(
        "min-w-0 w-full rounded-lg border border-gray-200 bg-gray-25 p-5",
        fill && "flex h-full min-h-0 flex-col",
        className
      )}
    >
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-medium text-gray-950">{title}</h3>
          <p className="mt-3 text-[11px] font-medium text-gray-500">{valueLabel}</p>
          <p className={`mt-0.5 text-[24px] font-medium ${valueColorClassName}`}>
            {formatValue(totalValue)}
          </p>
        </div>

        {(showPeriodFilter || headerAction) && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {headerAction}
            {showPeriodFilter && (
              <PeriodSegmentedControl
                period={period}
                onPeriodChange={setPeriod}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomStartDateChange={setCustomStartDate}
                onCustomEndDateChange={setCustomEndDate}
                customOpen={customOpen}
                onCustomOpenChange={setCustomOpen}
                onApplyCustomRange={applyCustomRange}
                maxDate={latestDate ?? undefined}
              />
            )}
          </div>
        )}
      </div>

      <div
        className={cn("mt-4", fill && "min-h-0 flex-1")}
        style={fill ? undefined : { height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 12, left: -8, bottom: 5 }}>
            <CartesianGrid horizontal vertical={false} stroke="var(--color-gray-200)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              minTickGap={36}
            />
            <YAxis
              tick={{ fill: "var(--color-gray-400)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-gray-300)", strokeDasharray: "4 4" }}
              content={
                <TrendTooltip
                  primaryLabel={primaryTooltipLabel}
                  secondaryLabel={secondaryTooltipLabel}
                  formatValue={formatValue}
                  formatSecondaryValue={formatSecondaryValue}
                />
              }
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 5, fill: lineColor, stroke: "white", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
