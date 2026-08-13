import { useNavigate } from "react-router-dom"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { DistributionChart } from "@/components/max/DistributionChart"
import { HorizontalBarChart, type BarChartSeries } from "@/components/max/HorizontalBarChart"

import { mockTicketRecords } from "@/data/mockTicketRecords"
import { mockDriverRiskRecords } from "@/data/mockDriverSafety"
import { mockMarkedTransfers } from "@/data/mockMarkedTransfers"
import { mockTimeOffApprovals } from "@/data/mockTimeOffApprovals"
import { mockChampionDetails } from "@/data/mockChampionDetails"

// --- Color tokens ---
const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_CLOSED = "var(--color-status-closed)"
const COLOR_DANGER = "var(--color-danger)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

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
      </div>
    </>
  )
}
