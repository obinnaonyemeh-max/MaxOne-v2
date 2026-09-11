import { useNavigate } from "react-router-dom"
import { TopBar, PageHeader, StatCard } from "@/components/max"
import { FleetDistributionCard } from "@/components/max/FleetDistributionCard"
import { HorizontalBarChart } from "@/components/max/HorizontalBarChart"
import {
  PORTFOLIO_TOP_STATS,
  PORTFOLIO_DISTRIBUTION_REGIONS,
  PORTFOLIO_BAR_CHARTS,
} from "@/data/portfolioDashboardMetrics"

export default function PortfolioDashboardPage() {
  const navigate = useNavigate()

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Dashboard" }]} />

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <PageHeader
          title="Dashboard"
          subtitle="Portfolio overview and performance at a glance."
          className="px-0"
        />

        <div className="grid grid-cols-3 gap-2">
          {PORTFOLIO_TOP_STATS.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              indicatorColor={stat.indicatorColor}
              onClick={() => navigate(stat.href)}
            />
          ))}
        </div>

        <FleetDistributionCard
          title="Portfolio Distribution"
          regions={PORTFOLIO_DISTRIBUTION_REGIONS}
          className="mt-6"
        />

        <div className="grid grid-cols-2 gap-2 mt-6">
          {PORTFOLIO_BAR_CHARTS.map((chart) => (
            <HorizontalBarChart
              key={chart.id}
              title={chart.title}
              categories={chart.categories}
              series={chart.series}
              yAxisWidth={chart.yAxisWidth}
            />
          ))}
        </div>
      </div>
    </>
  )
}
