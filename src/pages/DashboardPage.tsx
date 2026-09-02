import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { FleetDistributionCard } from "@/components/max/FleetDistributionCard"
import { ActivationQueueCard } from "@/components/max/ActivationQueueCard"
import { HorizontalBarChart } from "@/components/max/HorizontalBarChart"
import { clickableSurfaceProps } from "@/lib/clickableSurface"
import { useDashboardWidgets, useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  ACTIVATION_QUEUE_DATA,
  getDashboardWidgetData,
  widgetDisplayTitle,
  widgetHref,
  type BarChartWidgetData,
  type DashboardWidget,
} from "@/data/dashboardWidgets"

const CHART_GRID_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
}

function ChartWidget({
  widget,
  onNavigate,
  barCharts,
  title,
}: {
  widget: DashboardWidget
  onNavigate: (href: string) => void
  barCharts: Record<string, BarChartWidgetData>
  title: string
}) {
  const href = widgetHref(widget)
  const handleClick = href ? () => onNavigate(href) : undefined

  if (widget.id === "chart-activation-queue") {
    return (
      <div
        className={handleClick ? "cursor-pointer" : undefined}
        {...clickableSurfaceProps(handleClick, title)}
      >
        <ActivationQueueCard data={ACTIVATION_QUEUE_DATA} />
      </div>
    )
  }

  const chart = barCharts[widget.id]
  if (!chart) return null

  return (
    <div
      className={handleClick ? "cursor-pointer" : undefined}
      {...clickableSurfaceProps(handleClick, title)}
    >
      <HorizontalBarChart
        title={title}
        categories={chart.categories}
        series={chart.series}
        showLegend={chart.showLegend}
        stacked={chart.stacked}
      />
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const widgets = useDashboardWidgets()
  const { dataScope } = useRoleSimulation()
  const widgetData = useMemo(() => getDashboardWidgetData(dataScope), [dataScope])

  const statWidgets = useMemo(
    () => widgets.filter((widget) => widget.size === "stat"),
    [widgets]
  )
  const fullWidgets = useMemo(
    () => widgets.filter((widget) => widget.size === "full"),
    [widgets]
  )
  const chartWidgets = useMemo(
    () => widgets.filter((widget) => widget.size === "chart"),
    [widgets]
  )

  const chartGridClass = CHART_GRID_CLASS[Math.min(3, chartWidgets.length)] ?? "grid-cols-1"

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Overview" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Dashboard"
          subtitle={
            dataScope?.type === "subCity"
              ? `See real-time fleet overview for ${dataScope.subCity}`
              : dataScope?.city
                ? `See real-time fleet overview for ${dataScope.city}`
                : "See real-time fleet overview across all regions"
          }
          className="px-0"
        />

        {widgets.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-25 px-6 py-16 text-center">
            <p className="font-medium text-gray-950" style={{ fontSize: "16px" }}>
              No dashboard widgets for this role
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Widgets appear here when this role has access to modules that publish them.
            </p>
          </div>
        ) : (
          <>
            {statWidgets.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {statWidgets.map((widget) => {
                  const data = widgetData.stats[widget.id]
                  if (!data) return null
                  const href = widgetHref(widget)
                  return (
                    <StatCard
                      key={widget.id}
                      title={widget.title}
                      value={data.value}
                      subtitle={data.subtitle}
                      trend={data.trend}
                      indicatorColor={data.indicatorColor}
                      onClick={href ? () => navigate(href) : undefined}
                    />
                  )
                })}
              </div>
            )}

            {fullWidgets.map((widget) =>
              widget.id === "fleet-distribution" ? (
                <FleetDistributionCard
                  key={widget.id}
                  regions={widgetData.fleetDistribution}
                  className="mt-6"
                />
              ) : null
            )}

            {chartWidgets.length > 0 && (
              <div className={`grid ${chartGridClass} gap-2 mt-6`}>
                {chartWidgets.map((widget) => (
                  <ChartWidget
                    key={widget.id}
                    widget={widget}
                    onNavigate={navigate}
                    barCharts={widgetData.barCharts}
                    title={widgetDisplayTitle(widget, dataScope)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
