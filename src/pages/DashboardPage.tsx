import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
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
    title: "Exit",
    value: "4,200",
    subtitle: "13% of fleet",
    trend: { value: 1.5, direction: "up" as const },
    indicatorColor: COLOR_STATUS_CLOSED,
    tab: "exit",
  },
  {
    title: "Active",
    value: "12,800",
    subtitle: "39.5% of fleet",
    trend: { value: 2.1, direction: "up" as const },
    indicatorColor: COLOR_BADGE_ACTIVE,
    tab: "active",
  },
  {
    title: "Inbound",
    value: "3,200",
    subtitle: "9.9% of fleet",
    trend: { value: 1.1, direction: "up" as const },
    indicatorColor: COLOR_STATUS_INFO,
    tab: "inbound",
  },
  {
    title: "Operational Fleet",
    value: "5,600",
    subtitle: "17.3% of fleet",
    trend: { value: 0.8, direction: "up" as const },
    indicatorColor: COLOR_STATUS_SUCCESS,
    tab: "operational",
  },
  {
    title: "3PL Check-in Fleet",
    value: "2,400",
    subtitle: "7.4% of fleet",
    trend: { value: 1.2, direction: "down" as const },
    indicatorColor: COLOR_STATUS_WARNING,
    tab: "3pl-checkin",
  },
  {
    title: "Yard Check-in Fleet",
    value: "4,200",
    subtitle: "13% of fleet",
    trend: { value: 0.5, direction: "down" as const },
    indicatorColor: COLOR_STATUS_OUTRIGHT_SALES,
    tab: "yard-checkin",
  },
]

const DISTRIBUTION_COLORS = {
  exit: "var(--color-status-closed)",
  active: "var(--color-badge-active-text)",
  inbound: "var(--color-status-info)",
  operational: "var(--color-success)",
  threePlCheckin: "var(--color-warning)",
  yardCheckin: "var(--color-status-outright-sales)",
}

const randomValue = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min

const createDistributionData = () => [
  { label: "Exit", value: randomValue(300, 1500), color: DISTRIBUTION_COLORS.exit },
  { label: "Active", value: randomValue(1000, 5000), color: DISTRIBUTION_COLORS.active },
  { label: "Inbound", value: randomValue(200, 1500), color: DISTRIBUTION_COLORS.inbound },
  { label: "Operational Fleet", value: randomValue(500, 3000), color: DISTRIBUTION_COLORS.operational },
  { label: "3PL Check-in Fleet", value: randomValue(200, 1200), color: DISTRIBUTION_COLORS.threePlCheckin },
  { label: "Yard Check-in Fleet", value: randomValue(300, 2000), color: DISTRIBUTION_COLORS.yardCheckin },
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

const checkinFleetSeries: BarChartSeries[] = [
  {
    name: "3PL Check-in Fleet",
    data: [160, 80, 175, 195, 140, 185, 55],
    color: "var(--color-warning)",
  },
  {
    name: "Yard Check-in Fleet",
    data: [40, 25, 35, 30, 45, 25, 20],
    color: "var(--color-status-outright-sales)",
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Home" },
          { label: "Command Center" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Command Center"
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
            title="Check-in Fleet by City"
            categories={fleetByCityCities}
            series={checkinFleetSeries}
            showLegend
            stacked
          />
        </div>
      </div>
    </>
  )
}
