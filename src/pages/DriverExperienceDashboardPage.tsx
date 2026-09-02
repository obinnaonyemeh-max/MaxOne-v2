import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { DistributionChart } from "@/components/max/DistributionChart"
import { HorizontalBarChart, type BarChartSeries } from "@/components/max/HorizontalBarChart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

import { mockTicketRecords } from "@/data/mockTicketRecords"
import { mockDriverRiskRecords } from "@/data/mockDriverSafety"
import { mockMarkedTransfers } from "@/data/mockMarkedTransfers"
import { mockTimeOffApprovals } from "@/data/mockTimeOffApprovals"
import { mockChampionDetails } from "@/data/mockChampionDetails"
import { mockAgentPortfolioRecords } from "@/data/mockAgentPortfolio"
import { CITIES } from "@/data/cities"
import { LAGOS_SUBCITIES, resolveLagosSubCity } from "@/data/cityScope"
import {
  ticketPerformanceMetrics,
  resolverPerformance,
  categoryPerformance,
  maxResolverFalseRate,
} from "@/data/mockTicketPerformance"
import {
  driverExperienceWidgetIdsForModules,
  type DriverExperienceWidgetId,
} from "@/data/dashboardWidgets"
import { getRoleDefinition } from "@/data/rolePermissions"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  championsForSimulationMode,
  ticketsForSimulationMode,
} from "@/data/driverExperienceAssignmentScope"
import {
  mockWelfareRecords,
  WELFARE_REFERENCE_DATE,
} from "@/pages/WelfarePage"

// --- Color tokens ---
const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_CLOSED = "var(--color-status-closed)"
const COLOR_DANGER = "var(--color-danger)"
const COLOR_GRAY_500 = "var(--color-gray-500)"
const COLOR_STATUS_DANGER = "var(--color-status-danger)"

// --- Champion data (mirrors Champion360Page inline mockChampions) ---
interface Champion {
  id: string
  location: string
  state: string
  lastActiveDate: string
}

const mockChampions: Champion[] = [
  { id: "1",  location: "Ikeja",           state: "Lagos",          lastActiveDate: "28 May 2026" },
  { id: "2",  location: "Lekki",           state: "Lagos",          lastActiveDate: "30 May 2026" },
  { id: "3",  location: "Surulere",        state: "Lagos",          lastActiveDate: "25 May 2026" },
  { id: "4",  location: "Yaba",            state: "Lagos",          lastActiveDate: "20 May 2026" },
  { id: "5",  location: "Victoria Island", state: "Lagos",          lastActiveDate: "31 May 2026" },
  { id: "6",  location: "Ajah",            state: "Lagos",          lastActiveDate: "27 May 2026" },
  { id: "7",  location: "Ikorodu",         state: "Lagos",          lastActiveDate: "15 May 2026" },
  { id: "8",  location: "Ikeja",           state: "Lagos",          lastActiveDate: "29 May 2026" },
  { id: "9",  location: "Oshodi",          state: "Lagos",          lastActiveDate: "22 May 2026" },
  { id: "10", location: "Agege",           state: "Lagos",          lastActiveDate: "18 May 2026" },
  { id: "11", location: "Lekki",           state: "Lagos",          lastActiveDate: "30 May 2026" },
  { id: "12", location: "Surulere",        state: "Lagos",          lastActiveDate: "26 May 2026" },
  { id: "13", location: "Ikeja",           state: "Lagos",          lastActiveDate: "31 May 2026" },
  { id: "14", location: "Wuse",            state: "Abuja",          lastActiveDate: "29 May 2026" },
  { id: "15", location: "Garki",           state: "Abuja",          lastActiveDate: "30 May 2026" },
  { id: "16", location: "Yaba",            state: "Lagos",          lastActiveDate: "24 May 2026" },
  { id: "17", location: "Sabon Gari",      state: "Kano",           lastActiveDate: "20 May 2026" },
  { id: "18", location: "Lekki",           state: "Lagos",          lastActiveDate: "31 May 2026" },
  { id: "19", location: "Ring Road",       state: "Ibadan",         lastActiveDate: "27 May 2026" },
  { id: "20", location: "Agege",           state: "Lagos",          lastActiveDate: "28 May 2026" },
  { id: "21", location: "Victoria Island", state: "Lagos",          lastActiveDate: "15 May 2026" },
  { id: "22", location: "Wuse",            state: "Abuja",          lastActiveDate: "26 May 2026" },
  { id: "23", location: "Oshodi",          state: "Lagos",          lastActiveDate: "30 May 2026" },
  { id: "24", location: "Surulere",        state: "Lagos",          lastActiveDate: "23 May 2026" },
  { id: "25", location: "D-Line",          state: "Port Harcourt",  lastActiveDate: "19 May 2026" },
  { id: "26", location: "Ikorodu",         state: "Lagos",          lastActiveDate: "31 May 2026" },
  { id: "27", location: "Ajah",            state: "Lagos",          lastActiveDate: "21 May 2026" },
  { id: "28", location: "Sabon Gari",      state: "Kano",           lastActiveDate: "29 May 2026" },
  { id: "29", location: "Ikeja",           state: "Lagos",          lastActiveDate: "25 May 2026" },
  { id: "30", location: "Ring Road",       state: "Ibadan",         lastActiveDate: "28 May 2026" },
  { id: "31", location: "Lekki",           state: "Lagos",          lastActiveDate: "17 May 2026" },
  { id: "32", location: "Garki",           state: "Abuja",          lastActiveDate: "30 May 2026" },
  { id: "33", location: "Yaba",            state: "Lagos",          lastActiveDate: "22 May 2026" },
  { id: "34", location: "D-Line",          state: "Port Harcourt",  lastActiveDate: "27 May 2026" },
  { id: "35", location: "Victoria Island", state: "Lagos",          lastActiveDate: "26 May 2026" },
  { id: "36", location: "Oshodi",          state: "Lagos",          lastActiveDate: "31 May 2026" },
  { id: "37", location: "Agege",           state: "Lagos",          lastActiveDate: "16 May 2026" },
  { id: "38", location: "Wuse",            state: "Abuja",          lastActiveDate: "29 May 2026" },
  { id: "39", location: "Ikorodu",         state: "Lagos",          lastActiveDate: "24 May 2026" },
  { id: "40", location: "Ajah",            state: "Lagos",          lastActiveDate: "30 May 2026" },
]

// --- Derived metrics ---

// Row 2
const avgSafetyScore = Math.round(
  mockDriverRiskRecords.reduce((sum, r) => sum + r.safetyScore, 0) /
    mockDriverRiskRecords.length
)

const highRiskDrivers = mockDriverRiskRecords.filter(
  (r) => r.riskLevel === "High" || r.riskLevel === "Critical"
).length

const pendingApprovals =
  mockMarkedTransfers.filter((t) => t.status === "Pending").length +
  mockTimeOffApprovals.filter((t) => t.status === "Pending").length

const welfareFollowUps = Object.values(mockChampionDetails).reduce(
  (count, champion) =>
    count + champion.welfareNotes.filter((n) => n.followUpRequired).length,
  0
)

// --- Driver Risk Distribution (donut) ---
const riskLevelCounts = mockDriverRiskRecords.reduce<Record<string, number>>(
  (acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1
    return acc
  },
  {}
)

const riskDistributionData = [
  { label: "Low", value: riskLevelCounts["Low"] || 0, color: COLOR_STATUS_SUCCESS },
  { label: "Medium", value: riskLevelCounts["Medium"] || 0, color: COLOR_STATUS_WARNING },
  { label: "High", value: riskLevelCounts["High"] || 0, color: COLOR_DANGER },
  { label: "Critical", value: riskLevelCounts["Critical"] || 0, color: COLOR_STATUS_CLOSED },
]

// --- Ticket Aging by Agent and SLA (stacked bar chart) ---
function buildTicketAgingData(tickets: typeof mockTicketRecords) {
  const agingByAgent = Array.from(
    new Set(tickets.map((ticket) => ticket.assignedAgent))
  )
    .map((agent) => {
      const assignedTickets = tickets.filter(
        (ticket) => ticket.assignedAgent === agent
      )
      const atRisk = assignedTickets.filter((ticket) => ticket.sla === "At Risk").length
      const breached = assignedTickets.filter((ticket) => ticket.sla === "Breached").length
      return { agent, atRisk, breached, agingTotal: atRisk + breached }
    })
    .filter((agent) => agent.agingTotal > 0)
    .sort(
      (left, right) =>
        right.agingTotal - left.agingTotal || right.breached - left.breached
    )

  return {
    agents: agingByAgent.map((agent) => agent.agent),
    series: [
      {
        name: "At Risk",
        data: agingByAgent.map((agent) => agent.atRisk),
        color: COLOR_STATUS_WARNING,
      },
      {
        name: "Breached",
        data: agingByAgent.map((agent) => agent.breached),
        color: COLOR_DANGER,
      },
    ] satisfies BarChartSeries[],
  }
}

const agentDistributionColors = [
  COLOR_BRAND_PRIMARY,
  COLOR_STATUS_SUCCESS,
  COLOR_STATUS_INFO,
  COLOR_STATUS_WARNING,
  COLOR_STATUS_CLOSED,
]

function buildAgentDashboardData(agents: typeof mockAgentPortfolioRecords) {
  const cityCounts = agents.reduce<Record<string, number>>((counts, agent) => {
    counts[agent.city] = (counts[agent.city] || 0) + 1
    return counts
  }, {})
  const distribution = Object.entries(cityCounts)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .map(([city, count], index) => ({
      label: city,
      value: count,
      color: agentDistributionColors[index % agentDistributionColors.length],
    }))

  const topAgents = [...agents]
    .sort((left, right) => right.total - left.total)
    .slice(0, 8)

  return {
    distribution,
    workloadCategories: topAgents.map((agent) => agent.agent),
    workloadSeries: [
      {
        name: "Active",
        data: topAgents.map((agent) => agent.active),
        color: COLOR_STATUS_SUCCESS,
      },
      {
        name: "At Risk",
        data: topAgents.map((agent) => agent.atRisk),
        color: COLOR_STATUS_WARNING,
      },
      {
        name: "Delinquent",
        data: topAgents.map((agent) => agent.delinquent),
        color: COLOR_STATUS_DANGER,
      },
      {
        name: "Inactive",
        data: topAgents.map((agent) => agent.inactive),
        color: COLOR_GRAY_500,
      },
    ] satisfies BarChartSeries[],
  }
}

function buildScopedDashboardData(
  champions: Champion[],
  tickets: typeof mockTicketRecords
) {
  const totalChampions = champions.length
  const activeChampionCount = champions.filter((champion) => {
    const lastActive = new Date(champion.lastActiveDate)
    const sevenDaysAgo = new Date("2026-05-24")
    return lastActive > sevenDaysAgo
  }).length
  const inactiveChampionCount = totalChampions - activeChampionCount
  const openTickets = tickets.filter((ticket) => ticket.status !== "Closed").length
  const slaBreached = tickets.filter((ticket) => ticket.sla === "Breached").length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "Closed").length

  const ticketStatusCounts = tickets.reduce<Record<string, number>>((counts, ticket) => {
    counts[ticket.status] = (counts[ticket.status] || 0) + 1
    return counts
  }, {})
  const ticketStatusData = [
    { label: "Open", value: ticketStatusCounts["Open"] || 0, color: COLOR_STATUS_WARNING },
    { label: "In Progress", value: ticketStatusCounts["In Progress"] || 0, color: COLOR_STATUS_INFO },
    { label: "Pending Feedback", value: ticketStatusCounts["Pending Feedback"] || 0, color: COLOR_BADGE_ACTIVE },
    { label: "Closed", value: ticketStatusCounts["Closed"] || 0, color: COLOR_STATUS_SUCCESS },
  ]

  const ticketCategoryCounts = tickets.reduce<Record<string, number>>((counts, ticket) => {
    counts[ticket.category] = (counts[ticket.category] || 0) + 1
    return counts
  }, {})
  const ticketCategories = Object.keys(ticketCategoryCounts).sort(
    (left, right) => ticketCategoryCounts[right] - ticketCategoryCounts[left]
  )
  const ticketCategorySeries: BarChartSeries[] = [
    {
      name: "Tickets",
      data: ticketCategories.map((category) => ticketCategoryCounts[category]),
      color: COLOR_STATUS_INFO,
    },
  ]

  const cityCounts = champions.reduce<Record<string, number>>((counts, champion) => {
    counts[champion.state] = (counts[champion.state] || 0) + 1
    return counts
  }, {})
  const classifiedCities = CITIES.filter((city) => cityCounts[city] > 0)
  const additionalCities = Object.keys(cityCounts).filter(
    (city) => !CITIES.includes(city as (typeof CITIES)[number])
  )
  const championCities = [...classifiedCities, ...additionalCities].sort(
    (left, right) => cityCounts[right] - cityCounts[left]
  )
  const championCitySeries: BarChartSeries[] = [
    {
      name: "Champions",
      data: championCities.map((city) => cityCounts[city]),
      color: COLOR_BRAND_PRIMARY,
    },
  ]

  const subcityCounts = champions.reduce<Record<string, number>>((counts, champion) => {
    const subcity = resolveLagosSubCity(champion.location)
    if (subcity) counts[subcity] = (counts[subcity] || 0) + 1
    return counts
  }, {})
  const championSubcities = LAGOS_SUBCITIES.filter(
    (subcity) => subcityCounts[subcity] > 0
  ).sort((left, right) => subcityCounts[right] - subcityCounts[left])
  const championSubcitySeries: BarChartSeries[] = [
    {
      name: "Champions",
      data: championSubcities.map((subcity) => subcityCounts[subcity]),
      color: COLOR_BRAND_PRIMARY,
    },
  ]

  return {
    totalChampions,
    activeChampionCount,
    inactiveChampionCount,
    openTickets,
    slaBreached,
    resolvedTickets,
    ticketStatusData,
    ticketCategories,
    ticketCategorySeries,
    championCities,
    championCitySeries,
    championSubcities,
    championSubcitySeries,
  }
}

export default function DriverExperienceDashboardPage() {
  const navigate = useNavigate()
  const { isFullBuild, mode, filterByCity } = useRoleSimulation()
  const hasFullDriverExperienceAccess =
    isFullBuild ||
    mode === "welfare-manager" ||
    mode === "dxp-product-manager"
  const showsSafetyDashboard = isFullBuild
  const role = getRoleDefinition(mode)
  const scopedChampions = useMemo(
    () => championsForSimulationMode(mockChampions, mode),
    [mode]
  )
  const scopedTickets = useMemo(
    () => ticketsForSimulationMode(mockTicketRecords, mode),
    [mode]
  )
  const ticketAgingData = useMemo(
    () => buildTicketAgingData(scopedTickets),
    [scopedTickets]
  )
  const scopedAgents = useMemo(
    () => mockAgentPortfolioRecords.filter((agent) => filterByCity(agent.city)),
    [filterByCity]
  )
  const agentDashboardData = useMemo(
    () => buildAgentDashboardData(scopedAgents),
    [scopedAgents]
  )
  const scopedWelfareRecords = useMemo(
    () => championsForSimulationMode(mockWelfareRecords, mode),
    [mode]
  )
  const welfareFollowUpsOverdue = useMemo(
    () => scopedWelfareRecords.filter(
      (record) => new Date(record.nextFollowUp) < WELFARE_REFERENCE_DATE
    ).length,
    [scopedWelfareRecords]
  )
  const welfareCases = useMemo(
    () => scopedWelfareRecords.filter((record) => record.issuesLogged > 0).length,
    [scopedWelfareRecords]
  )
  const dashboardData = useMemo(
    () => buildScopedDashboardData(scopedChampions, scopedTickets),
    [scopedChampions, scopedTickets]
  )
  const visibleWidgetIds = driverExperienceWidgetIdsForModules(
    role?.navItemIds ?? []
  )
  if (mode === "field-ops-manager" || mode === "operations-manager") {
    visibleWidgetIds.add("chart-ticket-aging-sla")
  }
  if (mode === "welfare-agent") {
    visibleWidgetIds.delete("chart-champions-by-location")
    visibleWidgetIds.add("chart-champions-by-subcity")
  }
  if (mode === "field-ops-manager") {
    visibleWidgetIds.delete("chart-champions-by-location")
    visibleWidgetIds.add("chart-champions-by-subcity")
  }
  if (mode === "welfare-manager") {
    visibleWidgetIds.delete("chart-champions-by-location")
    visibleWidgetIds.add("chart-champions-by-subcity")
  }
  if (mode === "executive" || mode === "operations-manager") {
    visibleWidgetIds.add("stat-false-resolution-rate")
    visibleWidgetIds.add("chart-false-resolution-rate-by-resolver")
  }
  const showsWidget = (widgetId: DriverExperienceWidgetId) => {
    if (isFullBuild) return true
    if (
      mode === "welfare-manager" &&
      widgetId === "chart-champions-by-location"
    ) {
      return visibleWidgetIds.has(widgetId)
    }
    return widgetId === "chart-champions-by-subcity"
      ? visibleWidgetIds.has(widgetId)
      : hasFullDriverExperienceAccess || visibleWidgetIds.has(widgetId)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Dashboard"
          subtitle={
            mode === "call-centre-agent"
              ? "Global overview of all champions and tickets"
              : mode === "welfare-agent"
                ? "Overview of champions and tickets assigned to you in Lagos"
              : mode === "field-ops-manager"
                ? "Overview of all champions and tickets across Lagos"
              : mode === "welfare-manager"
                ? "Overview of all driver experience activity across Lagos"
              : "Overview of driver experience metrics across all modules"
          }
          className="px-0"
        />

        {/* Row 1 — Stat Cards */}
        <div
          className={`grid gap-2 ${
            isFullBuild
              ? "grid-cols-12 [&>*]:col-span-3 [&>*:nth-last-child(-n+3)]:col-span-4"
              : mode === "welfare-manager" || mode === "dxp-product-manager"
                ? "grid-cols-5"
              : mode === "executive"
                ? "grid-cols-4"
              : mode === "welfare-agent"
                ? "grid-cols-12 [&>*]:col-span-3"
                : "grid-cols-12 [&>*]:col-span-4"
          }`}
        >
          {showsWidget("stat-total-champions") && (
            <StatCard
              title="Total Champions"
              value={dashboardData.totalChampions}
              indicatorColor={COLOR_BRAND_PRIMARY}
              onClick={() => navigate("/champion-360")}
            />
          )}
          {showsWidget("stat-active-champions") && (
            <StatCard
              title="Active Champions"
              value={dashboardData.activeChampionCount}
              indicatorColor={COLOR_BADGE_ACTIVE}
              onClick={() => navigate("/champion-360")}
            />
          )}
          {showsWidget("stat-inactive-champions") && (
            <StatCard
              title="Inactive Champions"
              value={dashboardData.inactiveChampionCount}
              indicatorColor={COLOR_GRAY_500}
              onClick={() => navigate("/champion-360")}
            />
          )}
          {showsWidget("stat-open-tickets") && (
            <StatCard
              title="Open Tickets"
              value={dashboardData.openTickets}
              indicatorColor={COLOR_STATUS_WARNING}
              onClick={() => navigate("/ticket-management")}
            />
          )}
          {showsWidget("stat-sla-breached") && (
            <StatCard
              title="SLA Breached"
              value={dashboardData.slaBreached}
              indicatorColor={COLOR_DANGER}
              onClick={() => navigate("/ticket-management")}
            />
          )}
          {!hasFullDriverExperienceAccess && showsWidget("stat-resolved-tickets") && (
            <StatCard
              title="Resolved Tickets"
              value={dashboardData.resolvedTickets}
              indicatorColor={COLOR_STATUS_SUCCESS}
              onClick={() => navigate("/ticket-management")}
            />
          )}
          {!hasFullDriverExperienceAccess && showsWidget("stat-welfare-follow-ups-overdue") && (
            <StatCard
              title="Welfare Follow-Ups Overdue"
              value={welfareFollowUpsOverdue}
              indicatorColor={COLOR_STATUS_WARNING}
              onClick={() => navigate("/welfare")}
            />
          )}
          {!hasFullDriverExperienceAccess && showsWidget("stat-welfare-cases") && (
            <StatCard
              title="Welfare Cases"
              value={welfareCases}
              indicatorColor={COLOR_STATUS_INFO}
              onClick={() => navigate("/welfare")}
            />
          )}
          {hasFullDriverExperienceAccess && (
            <>
            {showsSafetyDashboard && (
              <>
                <StatCard
                  title="Avg Safety Score"
                  value={avgSafetyScore}
                  indicatorColor={COLOR_STATUS_SUCCESS}
                  onClick={() => navigate("/driver-safety-score")}
                />
                <StatCard
                  title="High Risk Drivers"
                  value={highRiskDrivers}
                  indicatorColor={COLOR_DANGER}
                  onClick={() => navigate("/driver-safety-score")}
                />
              </>
            )}
            <StatCard
              title="Pending Approvals"
              value={pendingApprovals}
              indicatorColor={COLOR_STATUS_INFO}
              onClick={() => navigate("/driver-experience/approvals")}
            />
            <StatCard
              title="Welfare Follow-ups"
              value={welfareFollowUps}
              indicatorColor={COLOR_GRAY_500}
              onClick={() => navigate("/welfare")}
            />
            <StatCard
              title="Welfare Follow-Ups Overdue"
              value={welfareFollowUpsOverdue}
              indicatorColor={COLOR_STATUS_WARNING}
              onClick={() => navigate("/welfare")}
            />
            <StatCard
              title="Welfare Cases"
              value={welfareCases}
              indicatorColor={COLOR_STATUS_INFO}
              onClick={() => navigate("/welfare")}
            />
            </>
          )}
          {hasFullDriverExperienceAccess && (
            <>
            <StatCard
              title="Total Tickets"
              value={ticketPerformanceMetrics.total.toLocaleString()}
              indicatorColor={COLOR_BRAND_PRIMARY}
              onClick={() => navigate("/ticket-management")}
            />
            <StatCard
              title="Resolved Tickets"
              value={ticketPerformanceMetrics.resolved.toLocaleString()}
              subtitle={`${((ticketPerformanceMetrics.resolved / ticketPerformanceMetrics.total) * 100).toFixed(1)}% of total`}
              indicatorColor={COLOR_STATUS_SUCCESS}
            />
            <StatCard
              title="Reopened"
              value={ticketPerformanceMetrics.reopened.toLocaleString()}
              subtitle={`${((ticketPerformanceMetrics.reopened / ticketPerformanceMetrics.total) * 100).toFixed(1)}% of total`}
              indicatorColor={COLOR_STATUS_WARNING}
            />
            </>
          )}
          {showsWidget("stat-false-resolution-rate") && (
            <StatCard
              title="False Resolution Rate"
              value={`${ticketPerformanceMetrics.falseResolutionRate.toFixed(1)}%`}
              subtitle="Reopened / Resolved"
              indicatorColor={COLOR_STATUS_DANGER}
            />
          )}
        </div>

        {/* Ticket charts always stay side by side. */}
        {(showsWidget("chart-ticket-status-breakdown") ||
          showsWidget("chart-tickets-by-category")) && (
          <div className="grid grid-cols-2 gap-2 mt-6">
            {showsWidget("chart-ticket-status-breakdown") && (
              <DistributionChart
                title="Ticket Status Breakdown"
                data={dashboardData.ticketStatusData}
              />
            )}
            {showsWidget("chart-tickets-by-category") && (
              <HorizontalBarChart
                title="Tickets by Category"
                categories={dashboardData.ticketCategories}
                series={dashboardData.ticketCategorySeries}
              />
            )}
          </div>
        )}

        {showsSafetyDashboard && (
          <div className="mt-6">
            <DistributionChart
              title="Driver Risk Distribution"
              data={riskDistributionData}
            />
          </div>
        )}

        {/* The role's primary geography widget stays beside Ticket Aging. */}
        {(showsWidget("chart-champions-by-location") ||
          (!isFullBuild && showsWidget("chart-champions-by-subcity")) ||
          showsWidget("chart-ticket-aging-sla")) && (
          <div
            className={`grid gap-2 mt-6 ${
              showsWidget("chart-ticket-aging-sla") &&
              (showsWidget("chart-champions-by-location") ||
                (!isFullBuild && showsWidget("chart-champions-by-subcity")))
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {showsWidget("chart-champions-by-location") && (
              <HorizontalBarChart
                title="Champions by City"
                categories={dashboardData.championCities}
                series={dashboardData.championCitySeries}
              />
            )}
            {!isFullBuild && showsWidget("chart-champions-by-subcity") && (
              <HorizontalBarChart
                title="Champions by Subcity"
                categories={[...dashboardData.championSubcities]}
                series={dashboardData.championSubcitySeries}
              />
            )}
            {showsWidget("chart-ticket-aging-sla") && (
              <HorizontalBarChart
              title="Ticket Aging (SLA) by Agent"
              categories={ticketAgingData.agents}
              series={ticketAgingData.series}
                showLegend
                stacked
              />
            )}
          </div>
        )}

        {isFullBuild && showsWidget("chart-champions-by-subcity") && (
          <div className="mt-6">
            <HorizontalBarChart
              title="Champions by Subcity"
              categories={[...dashboardData.championSubcities]}
              series={dashboardData.championSubcitySeries}
            />
          </div>
        )}

        {(showsWidget("chart-agent-distribution") ||
          showsWidget("chart-agent-workload")) && (
          <div className="grid grid-cols-2 gap-2 mt-6">
            {showsWidget("chart-agent-distribution") && (
              <DistributionChart
                title="Agent Distribution"
                data={agentDashboardData.distribution}
                legendTitle="City"
              />
            )}
            {showsWidget("chart-agent-workload") && (
              <HorizontalBarChart
                title="Agent Workload"
                categories={agentDashboardData.workloadCategories}
                series={agentDashboardData.workloadSeries}
                showLegend
                stacked
                yAxisWidth={120}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => navigate("/driver-experience/agents/portfolio")}
                  >
                    View All
                  </Button>
                }
              />
            )}
          </div>
        )}

        {/* Row 6 — False Resolution Rate by Resolver */}
        {showsWidget("chart-false-resolution-rate-by-resolver") && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-25">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-[13px] font-medium text-gray-600">
              False Resolution Rate by Resolver
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {resolverPerformance.map((resolver, idx) => (
              <div key={resolver.name} className="flex items-center gap-4 px-4 py-2.5">
                <span className="w-5 text-[12px] font-medium text-gray-400 text-right">
                  {idx + 1}
                </span>
                <span className="w-36 truncate text-[13px] font-medium text-gray-950">
                  {resolver.name}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(resolver.falseRate / maxResolverFalseRate) * 100}%`,
                        backgroundColor:
                          resolver.falseRate >= 50
                            ? COLOR_STATUS_DANGER
                            : resolver.falseRate >= 30
                              ? COLOR_STATUS_WARNING
                              : COLOR_STATUS_SUCCESS,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-[13px] font-medium text-gray-950">
                    {resolver.falseRate.toFixed(1)}%
                  </span>
                </div>
                <Badge variant="outline" className="text-[11px] text-gray-500 font-normal">
                  {resolver.reopened}/{resolver.resolved} reopened
                </Badge>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* Row 7 — Reopen Rate by Ticket Category */}
        {isFullBuild && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-25">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-[13px] font-medium text-gray-600">
              Reopen Rate by Ticket Category
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[12px] text-gray-500 font-medium">Category</TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">Total</TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">Reopened</TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">Reopen Rate</TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium">Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPerformance.map((cat) => (
                <TableRow key={cat.category}>
                  <TableCell className="text-[13px] font-medium text-gray-950">
                    {cat.category}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-700 text-right">{cat.total}</TableCell>
                  <TableCell className="text-[13px] text-gray-700 text-right">{cat.reopened}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium"
                      style={{
                        color:
                          cat.reopenRate >= 40
                            ? COLOR_STATUS_DANGER
                            : cat.reopenRate >= 25
                              ? COLOR_STATUS_WARNING
                              : COLOR_STATUS_SUCCESS,
                      }}
                    >
                      {cat.reopenRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${cat.distribution}%`,
                            backgroundColor: COLOR_BRAND_PRIMARY,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-[12px] text-gray-500">
                        {cat.distribution.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </div>
    </>
  )
}
