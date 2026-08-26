import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { DistributionChart } from "@/components/max/DistributionChart"
import { HorizontalBarChart, type BarChartSeries } from "@/components/max/HorizontalBarChart"
import { Badge } from "@/components/ui/badge"
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
import {
  ticketPerformanceMetrics,
  resolverPerformance,
  categoryPerformance,
  maxResolverFalseRate,
} from "@/data/mockTicketPerformance"

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

// Row 1
const totalChampions = mockChampions.length

const activeChampionCount = mockChampions.filter((c) => {
  const lastActive = new Date(c.lastActiveDate)
  const sevenDaysAgo = new Date("2026-05-24")
  return lastActive > sevenDaysAgo
}).length

const openTickets = mockTicketRecords.filter((t) => t.status !== "Closed").length

const slaBreached = mockTicketRecords.filter((t) => t.sla === "Breached").length

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

// --- Ticket Status Breakdown (donut) ---
const ticketStatusCounts = mockTicketRecords.reduce<Record<string, number>>(
  (acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  },
  {}
)

const ticketStatusData = [
  { label: "Open", value: ticketStatusCounts["Open"] || 0, color: COLOR_STATUS_WARNING },
  { label: "In Progress", value: ticketStatusCounts["In Progress"] || 0, color: COLOR_STATUS_INFO },
  { label: "Pending Feedback", value: ticketStatusCounts["Pending Feedback"] || 0, color: COLOR_BADGE_ACTIVE },
  { label: "Closed", value: ticketStatusCounts["Closed"] || 0, color: COLOR_STATUS_SUCCESS },
]

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

// --- Tickets by Category (bar chart) ---
const ticketCategoryCounts = mockTicketRecords.reduce<Record<string, number>>(
  (acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  },
  {}
)

const ticketCategories = Object.keys(ticketCategoryCounts).sort(
  (a, b) => ticketCategoryCounts[b] - ticketCategoryCounts[a]
)

const ticketCategorySeries: BarChartSeries[] = [
  {
    name: "Tickets",
    data: ticketCategories.map((cat) => ticketCategoryCounts[cat]),
    color: COLOR_STATUS_INFO,
  },
]

// --- Champions by Location (bar chart) ---
const locationCounts = mockChampions.reduce<Record<string, number>>(
  (acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1
    return acc
  },
  {}
)

const championLocations = Object.keys(locationCounts).sort(
  (a, b) => locationCounts[b] - locationCounts[a]
)

const championLocationSeries: BarChartSeries[] = [
  {
    name: "Champions",
    data: championLocations.map((loc) => locationCounts[loc]),
    color: COLOR_BRAND_PRIMARY,
  },
]

export default function DriverExperienceDashboardPage() {
  const navigate = useNavigate()

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
          subtitle="Overview of driver experience metrics across all modules"
          className="px-0"
        />

        {/* Row 1 — Stat Cards */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            title="Total Champions"
            value={totalChampions}
            indicatorColor={COLOR_BRAND_PRIMARY}
            onClick={() => navigate("/champion-360")}
          />
          <StatCard
            title="Active Champions"
            value={activeChampionCount}
            indicatorColor={COLOR_BADGE_ACTIVE}
            onClick={() => navigate("/champion-360")}
          />
          <StatCard
            title="Open Tickets"
            value={openTickets}
            indicatorColor={COLOR_STATUS_WARNING}
            onClick={() => navigate("/ticket-management")}
          />
          <StatCard
            title="SLA Breached"
            value={slaBreached}
            indicatorColor={COLOR_DANGER}
            onClick={() => navigate("/ticket-management")}
          />
        </div>

        {/* Row 2 — Stat Cards */}
        <div className="grid grid-cols-4 gap-2 mt-2">
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
        </div>

        {/* Row 3 — Donut Charts */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <DistributionChart
            title="Ticket Status Breakdown"
            data={ticketStatusData}
          />
          <DistributionChart
            title="Driver Risk Distribution"
            data={riskDistributionData}
          />
        </div>

        {/* Row 4 — Bar Charts */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <HorizontalBarChart
            title="Tickets by Category"
            categories={ticketCategories}
            series={ticketCategorySeries}
          />
          <HorizontalBarChart
            title="Champions by Location"
            categories={championLocations}
            series={championLocationSeries}
          />
        </div>

        {/* Row 5 — Ticket resolution quality (moved from the Performance page) */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <StatCard
            title="Total Tickets"
            value={ticketPerformanceMetrics.total.toLocaleString()}
            indicatorColor={COLOR_BRAND_PRIMARY}
            onClick={() => navigate("/ticket-management")}
          />
          <StatCard
            title="Resolved"
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
          <StatCard
            title="False Resolution Rate"
            value={`${ticketPerformanceMetrics.falseResolutionRate.toFixed(1)}%`}
            subtitle="Reopened / Resolved"
            indicatorColor={COLOR_STATUS_DANGER}
          />
        </div>

        {/* Row 6 — False Resolution Rate by Resolver */}
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

        {/* Row 7 — Reopen Rate by Ticket Category */}
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
      </div>
    </>
  )
}
