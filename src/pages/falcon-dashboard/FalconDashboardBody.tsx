import type { ReactNode } from "react"
import {
  DistributionChart,
  FleetDistributionCard,
  HorizontalBarChart,
  SegmentedStatCard,
  StatCard,
  TimeSeriesStatCard,
} from "@/components/max"
import { widgetsForFalconFullBuild } from "@/data/falconDashboardWidgets"
import {
  mockSwapStations,
  STATION_PROVIDERS,
  totalSwapStations,
  type StationProvider,
} from "@/data/mockStationsData"
import { mockGeofences, totalGeofences } from "@/data/mockGeofences"
import { BatteryDashboardWidgets } from "@/pages/falcon-dashboard/BatteryDashboardWidgets"
import { FleetGeographicalDistributionWidget } from "@/pages/falcon-dashboard/FleetGeographicalDistributionWidget"
import { TotalSwapsDoneWidget } from "@/pages/falcon-dashboard/TotalSwapsDoneWidget"
import {
  distanceDashboardTrend,
  tripDashboardTrend,
} from "@/data/mockSwapDashboardData"

const widgets = widgetsForFalconFullBuild()
const widgetIds = new Set(widgets.map((widget) => widget.id))
const hasWidget = (id: (typeof widgets)[number]["id"]) => widgetIds.has(id)

const PROVIDER_COLORS: Record<StationProvider, string> = {
  MAX: "var(--color-status-info)",
  Siltech: "var(--color-status-warning)",
  Pash: "var(--color-status-purple)",
  Spiro: "var(--color-success)",
}

const stationProviderItems = STATION_PROVIDERS.map((provider) => ({
  label: provider,
  value: mockSwapStations.filter((station) => station.provider === provider).length,
  color: PROVIDER_COLORS[provider],
}))

const geofenceItems = [
  {
    label: "City",
    value: mockGeofences.filter((geofence) => geofence.type === "city").length,
    color: "var(--color-status-info)",
  },
  {
    label: "Swap Stations",
    value: mockGeofences.filter((geofence) => geofence.type === "station").length,
    color: "var(--color-success)",
  },
  {
    label: "Office",
    value: mockGeofences.filter((geofence) => geofence.type === "office").length,
    color: "var(--color-status-warning)",
  },
]

const batteryAlertItems = [
  { label: "Full Charge", value: 40_500, color: "var(--color-success)" },
  { label: "Low Battery", value: 5_470, color: "var(--color-status-warning)" },
  { label: "Critical", value: 594, color: "var(--color-status-danger)" },
]
const batteryAlertTotal = batteryAlertItems.reduce((total, item) => total + item.value, 0)

const vehicleTrackingItems = [
  { label: "Moving", value: 22, color: "var(--color-success)" },
  { label: "Stopped", value: 10, color: "var(--color-status-warning)" },
  { label: "Offline", value: 12, color: "var(--color-status-danger)" },
  { label: "Pending", value: 6, color: "var(--color-gray-400)" },
]

function TotalFleetCard({ className }: { className?: string }) {
  return (
    <SegmentedStatCard
      className={className}
      title="Total Fleet"
      value={400_000}
      items={[
        { label: "ICE", value: 320_000, color: "var(--color-status-info)" },
        { label: "EVs", value: 80_000, color: "var(--color-success)" },
      ]}
    />
  )
}

function TotalCo2Card({ className }: { className?: string }) {
  return (
    <StatCard
      className={className}
      title="Total CO₂ Emitted"
      value={15_950}
      valueSuffix="kg"
      subtitle="2,000 kg less than last year"
      subtitleIndicatorColor="var(--color-status-warning)"
      indicatorColor="var(--color-brand-primary)"
      contentClassName="flex flex-1 flex-col [&>div:first-of-type]:mt-auto"
    />
  )
}

function TotalSwapStationsCard({ className }: { className?: string }) {
  return (
    <SegmentedStatCard
      className={className}
      title="Total Swap Stations"
      value={totalSwapStations}
      items={stationProviderItems}
    />
  )
}

function TotalGeofenceCard({ className }: { className?: string }) {
  return (
    <SegmentedStatCard
      className={className}
      title="Total Geofence Locations"
      value={totalGeofences}
      items={geofenceItems}
    />
  )
}

function IceEvActivityChart({ fill = false }: { fill?: boolean }) {
  return (
    <HorizontalBarChart
      title="ICE & EV Activity"
      categories={["ICE — 320,000", "EV — 80,000"]}
      series={[
        {
          name: "Active",
          data: [104_530, 40_500],
          color: "var(--color-success)",
        },
        {
          name: "Inactive",
          data: [5_470, 9_500],
          color: "var(--color-status-danger)",
        },
        {
          name: "Maintenance",
          data: [210_000, 30_000],
          color: "var(--color-status-warning)",
        },
      ]}
      stacked
      showLegend
      yAxisWidth={110}
      className="h-full"
      fill={fill}
    />
  )
}

function TripsDistributionChart({ fill = false }: { fill?: boolean }) {
  return (
    <TimeSeriesStatCard
      title="Trips Distribution"
      valueLabel="Total Trips"
      data={tripDashboardTrend}
      primaryTooltipLabel="Trips"
      lineColor="var(--color-status-info)"
      valueColorClassName="text-gray-950"
      chartHeight={250}
      fill={fill}
      showPeriodFilter={!fill}
    />
  )
}

function VehicleTrackingCard({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <FleetDistributionCard
      className={className}
      compact={compact}
      title="Vehicle Tracking"
      regions={[
        { region: "EV", data: vehicleTrackingItems },
        { region: "ICE", data: vehicleTrackingItems },
      ]}
    />
  )
}

function DistanceTravelledChart({ fill = false }: { fill?: boolean }) {
  return (
    <TimeSeriesStatCard
      title="Distance Travelled"
      valueLabel="Total Distance"
      data={distanceDashboardTrend}
      primaryTooltipLabel="Distance"
      lineColor="var(--color-status-info)"
      valueColorClassName="text-gray-950"
      formatValue={(value) => `${value.toLocaleString()} Km`}
      chartHeight={300}
      fill={fill}
      showPeriodFilter={!fill}
    />
  )
}

function BatteryAlertSummaryChart({ className }: { className?: string }) {
  return (
    <DistributionChart
      title="Battery Alert Summary"
      data={batteryAlertItems}
      summaryValue={batteryAlertTotal}
      centerContent
      className={className ?? "h-full"}
    />
  )
}

function StatGrid({ children, count }: { children: ReactNode; count: number }) {
  const columns =
    count >= 4
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      : count === 3
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : count === 2
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1"
  return <div className={`mb-6 grid ${columns} gap-2`}>{children}</div>
}

function PageLayout() {
  const topStats = [
    hasWidget("total-fleet") ? <TotalFleetCard key="total-fleet" /> : null,
    hasWidget("total-co2-emitted") ? <TotalCo2Card key="total-co2-emitted" /> : null,
    hasWidget("total-swap-stations") ? <TotalSwapStationsCard key="total-swap-stations" /> : null,
    hasWidget("total-geofence-locations") ? <TotalGeofenceCard key="total-geofence-locations" /> : null,
  ].filter(Boolean)

  return (
    <>
      {topStats.length > 0 && <StatGrid count={topStats.length}>{topStats}</StatGrid>}

      {hasWidget("battery-overview") && (
        <div className="mb-6">
          <BatteryDashboardWidgets statsOnly />
        </div>
      )}

      {(hasWidget("ice-ev-activity") || hasWidget("trips-distribution")) && (
        <div
          className={`mb-6 grid gap-2 ${
            hasWidget("ice-ev-activity") && hasWidget("trips-distribution")
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {hasWidget("ice-ev-activity") && <IceEvActivityChart />}
          {hasWidget("trips-distribution") && <TripsDistributionChart />}
        </div>
      )}

      {hasWidget("fleet-geographical-distribution") && (
        <div className="mb-6">
          <FleetGeographicalDistributionWidget />
        </div>
      )}

      {hasWidget("vehicle-tracking") && (
        <div className="mb-6">
          <VehicleTrackingCard />
        </div>
      )}

      {(hasWidget("distance-travelled") || hasWidget("battery-alert-summary")) && (
        <div
          className={`mb-6 grid gap-2 ${
            hasWidget("distance-travelled") && hasWidget("battery-alert-summary")
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {hasWidget("distance-travelled") && <DistanceTravelledChart />}
          {hasWidget("battery-alert-summary") && <BatteryAlertSummaryChart />}
        </div>
      )}

      {hasWidget("total-swaps-done") && (
        <div className="mb-6">
          <TotalSwapsDoneWidget />
        </div>
      )}

      {hasWidget("battery-overview") && (
        <BatteryDashboardWidgets showStats={false} />
      )}
    </>
  )
}

function VehicleTrackingScreen() {
  return (
    <div className="grid h-full min-h-0 grid-cols-2 grid-rows-[auto_1fr_1fr_1fr] gap-3">
      {hasWidget("total-fleet") && <TotalFleetCard className="h-full" />}
      {hasWidget("total-co2-emitted") && <TotalCo2Card className="h-full" />}
      {hasWidget("ice-ev-activity") && <IceEvActivityChart fill />}
      {hasWidget("trips-distribution") && <TripsDistributionChart fill />}
      {hasWidget("fleet-geographical-distribution") && (
        <FleetGeographicalDistributionWidget fill showPeriodFilter={false} />
      )}
      {hasWidget("vehicle-tracking") && <VehicleTrackingCard className="h-full" compact />}
      {hasWidget("distance-travelled") && <DistanceTravelledChart fill />}
      {hasWidget("total-swaps-done") && <TotalSwapsDoneWidget fill />}
    </div>
  )
}

function BatteriesScreen() {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1.15fr)_minmax(0,1fr)] gap-3">
      {hasWidget("battery-overview") && <BatteryDashboardWidgets statsOnly />}
      {hasWidget("battery-overview") && (
        <BatteryDashboardWidgets
          fill
          showPeriodFilter={false}
          showStats={false}
          showSoc={false}
          showMap={false}
        />
      )}
      <div className="grid min-h-0 grid-cols-3 gap-3">
        {hasWidget("average-battery-soc") && (
          <BatteryDashboardWidgets
            fill
            showPeriodFilter={false}
            showStats={false}
            showCharts={false}
            showMap={false}
          />
        )}
        {hasWidget("battery-alert-summary") && (
          <BatteryAlertSummaryChart className="h-full min-h-0" />
        )}
        {hasWidget("battery-overview") && (
          <BatteryDashboardWidgets
            fill
            showStats={false}
            showCharts={false}
            showSoc={false}
          />
        )}
      </div>
    </div>
  )
}

export function FalconDashboardBody({
  moduleId,
}: {
  moduleId?: string
}) {
  if (!moduleId) return <PageLayout />

  if (moduleId === "vehicle-register") return <VehicleTrackingScreen />
  if (moduleId === "battery-register") return <BatteriesScreen />

  return <PageLayout />
}
