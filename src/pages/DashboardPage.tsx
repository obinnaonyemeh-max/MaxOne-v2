import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { LifecycleFlowCard, type LifecycleStage } from "@/components/max/LifecycleFlowCard"
import { FleetDistributionCard, type RegionDistribution } from "@/components/max/FleetDistributionCard"
import { ActivationQueueCard, type ActivationQueueItem } from "@/components/max/ActivationQueueCard"
import { HorizontalBarChart, type BarChartSeries } from "@/components/max/HorizontalBarChart"


const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_GRAY_500 = "var(--color-gray-500)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_CLOSED = "var(--color-status-closed)"
const COLOR_STATUS_OUTRIGHT_SALES = "var(--color-status-outright-sales)"

const dashboardStats = [
  {
    title: "Total Fleet",
    value: "32,400",
    subtitle: "100% of fleet",
    trend: { value: 2.5, direction: "up" as const },
    indicatorColor: COLOR_BRAND_PRIMARY,
    tab: "all",
  },
  {
    title: "Active",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "up" as const },
    indicatorColor: COLOR_BADGE_ACTIVE,
    tab: "active",
  },
  {
    title: "Temporarily Inactive",
    value: "1,805",
    subtitle: "4.4% of fleet",
    trend: { value: 2.5, direction: "up" as const },
    indicatorColor: COLOR_STATUS_WARNING,
    tab: "portfolio-inactive",
  },
  {
    title: "Inactive",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "down" as const },
    indicatorColor: COLOR_GRAY_500,
    tab: "inactive",
  },
  {
    title: "Inbound",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "down" as const },
    indicatorColor: COLOR_STATUS_INFO,
    tab: "inbound",
  },
  {
    title: "HP Complete",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "up" as const },
    indicatorColor: COLOR_STATUS_SUCCESS,
  },
  {
    title: "Closed",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "down" as const },
    indicatorColor: COLOR_STATUS_CLOSED,
  },
  {
    title: "Outright Sales",
    value: "3,200",
    subtitle: "7.8 of fleet",
    trend: { value: 1.1, direction: "down" as const },
    indicatorColor: COLOR_STATUS_OUTRIGHT_SALES,
  },
]

const lifecycleStages: LifecycleStage[] = [
  {
    title: "Inbound",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
  {
    title: "Ready",
    value: "894",
    subtitle: "Average of 5 days",
    showSla: true,
    titleVariant: "warning",
  },
  {
    title: "Active",
    value: "1,240",
    subtitle: "Average of 5 days",
    showSla: true,
    titleVariant: "warning",
  },
  {
    title: "Temporarily Inactive",
    value: "1,240",
    subtitle: "Average of 5 days",
    showSla: true,
    titleVariant: "warning",
  },
  {
    title: "Inactive",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
  {
    title: "Refurb",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
  {
    title: "Disposal",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
  {
    title: "Scrap",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
  {
    title: "Closed",
    value: "1,240",
    subtitle: "Average of 5 days",
  },
]

const DISTRIBUTION_COLORS = {
  active: "var(--color-badge-active-text)",
  portfolioInactive: "var(--color-warning)",
  inactive: "var(--color-gray-500)",
  inbound: "var(--color-status-info)",
  hpComplete: "var(--color-success)",
  closed: "var(--color-status-closed)",
  readyForActivation: "var(--color-status-outright-sales)",
}

const randomValue = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min

const createDistributionData = () => [
  { label: "Active", value: randomValue(1000, 5000), color: DISTRIBUTION_COLORS.active },
  { label: "Temporarily Inactive", value: randomValue(500, 3000), color: DISTRIBUTION_COLORS.portfolioInactive },
  { label: "Inactive", value: randomValue(300, 2000), color: DISTRIBUTION_COLORS.inactive },
  { label: "Inbound", value: randomValue(200, 1500), color: DISTRIBUTION_COLORS.inbound },
  { label: "HP Complete", value: randomValue(400, 2500), color: DISTRIBUTION_COLORS.hpComplete },
  { label: "Closed", value: randomValue(100, 1000), color: DISTRIBUTION_COLORS.closed },
  { label: "Ready for Activation", value: randomValue(300, 2000), color: DISTRIBUTION_COLORS.readyForActivation },
]

const fleetDistributionData: RegionDistribution[] = [
  { region: "Global", data: createDistributionData() },
  { region: "Nigeria", data: createDistributionData() },
  { region: "Ghana", data: createDistributionData() },
  { region: "Cameroon", data: createDistributionData() },
]

const activationQueueData: ActivationQueueItem[] = [
  { activationType: "Easy Retail", count: 245, overdue: 12 },
  { activationType: "Easy MCP", count: 245, overdue: 12 },
  { activationType: "Easy Enterprise", count: 245, overdue: 12 },
  { activationType: "Easy Enterprise", count: 245, overdue: 12 },
]

const fleetByCityCities = ["Riyadh", "Jeddah", "Dubai", "Cairo", "Abu Dhabi", "Doha", "Muscat"]

const activeFleetSeries: BarChartSeries[] = [
  {
    name: "Active",
    data: [180, 95, 165, 210, 120, 240, 45],
    color: "var(--color-badge-active-text)",
  },
]

const inactiveFleetSeries: BarChartSeries[] = [
  {
    name: "Temporarily Inactive",
    data: [160, 80, 175, 195, 140, 185, 55],
    color: "var(--color-warning)",
  },
  {
    name: "Inactive",
    data: [40, 25, 35, 30, 45, 25, 20],
    color: "var(--color-gray-500)",
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Dashboard"
          subtitle="See real-time fleet overview across all regions"
          className="px-0"
        />
        <div className="grid grid-cols-4 gap-2">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
              indicatorColor={stat.indicatorColor}
              onClick={stat.tab ? () => navigate(`/fleet-register?tab=${stat.tab}`) : undefined}
            />
          ))}
        </div>

        <LifecycleFlowCard
          stages={lifecycleStages}
          className="mt-6"
        />

        <FleetDistributionCard
          regions={fleetDistributionData}
          className="mt-6"
        />

        <div className="grid grid-cols-3 gap-2 mt-6">
          <ActivationQueueCard data={activationQueueData} />
          <HorizontalBarChart
            title="Active Fleet by City"
            categories={fleetByCityCities}
            series={activeFleetSeries}
          />
          <HorizontalBarChart
            title="Inactive Fleet by City"
            categories={fleetByCityCities}
            series={inactiveFleetSeries}
            showLegend
            stacked
          />
        </div>
      </div>
    </>
  )
}
