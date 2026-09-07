import { useMemo } from "react"
import {
  HorizontalBarChart,
  PeriodSegmentedControl,
  getPeriodScale,
  usePeriodFilter,
} from "@/components/max"
import { CITIES } from "@/data/cities"
import { BAR_CHART_WIDGET_DATA } from "@/data/dashboardWidgets"

const activeFleetData = BAR_CHART_WIDGET_DATA["chart-active-fleet-by-city"]
const checkedInFleetData = BAR_CHART_WIDGET_DATA["chart-checkin-fleet-by-city"]

const fleetByCity = CITIES.map((city) => {
  const activeCityIndex = activeFleetData.categories.indexOf(city)
  const checkedInCityIndex = checkedInFleetData.categories.indexOf(city)

  return {
    city,
    active: activeFleetData.series.reduce(
      (total, item) => total + (item.data[activeCityIndex] ?? 0),
      0
    ),
    checkedIn: checkedInFleetData.series.reduce(
      (total, item) => total + (item.data[checkedInCityIndex] ?? 0),
      0
    ),
  }
})

export function FleetGeographicalDistributionWidget({
  fill = false,
  showPeriodFilter = true,
}: {
  fill?: boolean
  showPeriodFilter?: boolean
}) {
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
  const scale = getPeriodScale(period, customStartDate, customEndDate)
  const series = useMemo(
    () => [
      {
        name: "Active",
        data: fleetByCity.map(({ active }) => Math.round(active * scale)),
        color: "var(--color-status-info)",
      },
      {
        name: "Checked-In",
        data: fleetByCity.map(({ checkedIn }) => Math.round(checkedIn * scale)),
        color: "var(--color-status-warning)",
      },
    ],
    [scale]
  )
  return (
    <HorizontalBarChart
      title="Fleets Geographical Distribution"
      categories={fleetByCity.map(({ city }) => city)}
      series={series}
      stacked
      showLegend
      yAxisWidth={76}
      className="h-full"
      chartHeight={300}
      fill={fill}
      action={
        showPeriodFilter ? (
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
          maxDate={new Date()}
        />
        ) : undefined
      }
    />
  )
}
