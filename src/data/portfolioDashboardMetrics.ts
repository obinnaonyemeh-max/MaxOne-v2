// Aggregated at-a-glance metrics for the Portfolio > Home > Dashboard overview page:
// a top-line stat row, a distribution-chart grid, and cross-entity bar charts.

import { mockContracts } from "./mockContracts"
import { portfolioChampionStats } from "./mockPortfolioChampions"
import { collectionsTotal } from "./mockCollections"
import { recoveryCommandCenterStats, recoverySessionStats } from "./mockRecoveries"
import { mockRecoveryPairs } from "./mockRecoveryOfficers"
import { mockFinanciers, FINANCING_PARTNERS } from "./mockFinanciers"
import { mockWriteOffBatches } from "./mockWriteOffBatches"
import type { RegionDistribution } from "@/components/max/FleetDistributionCard"
import type { BarChartSeries } from "@/components/max/HorizontalBarChart"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

const contractStats = {
  all: mockContracts.length,
  active: mockContracts.filter((c) => c.status === "Active").length,
  paused: mockContracts.filter((c) => c.status === "Paused").length,
  completed: mockContracts.filter((c) => c.status === "Completed").length,
}

const financierStats = {
  total: mockFinanciers.length,
  active: mockFinanciers.filter((f) => f.status === "Active").length,
  totalLoanAmount: formatCurrency(mockFinanciers.reduce((sum, f) => sum + f.loanAmount, 0)),
}

const writeOffApprovalStats = {
  pending: mockWriteOffBatches.filter((b) => b.status === "Pending").length,
  approved: mockWriteOffBatches.filter((b) => b.status === "Approved").length,
  rejected: mockWriteOffBatches.filter((b) => b.status === "Rejected").length,
}

// ── Top-line stat row — portfolio-wide headline numbers, one per major module ──

export interface PortfolioTopStat {
  id: string
  title: string
  value: string
  subtitle: string
  indicatorColor: string
  href: string
}

export const PORTFOLIO_TOP_STATS: PortfolioTopStat[] = [
  {
    id: "total-contracts",
    title: "Total Contracts",
    value: contractStats.all.toLocaleString(),
    subtitle: `${contractStats.active.toLocaleString()} active`,
    indicatorColor: "var(--color-brand-primary)",
    href: "/portfolio/contracts/all",
  },
  {
    id: "total-champions",
    title: "Total Champions",
    value: portfolioChampionStats.total.toLocaleString(),
    subtitle: `${Math.round((portfolioChampionStats.active / portfolioChampionStats.total) * 100)}% active`,
    indicatorColor: "var(--color-status-purple)",
    href: "/portfolio/champions/overview",
  },
  {
    id: "total-outstanding",
    title: "Total Outstanding",
    value: formatCurrency(collectionsTotal.amount),
    subtitle: `${collectionsTotal.contracts.toLocaleString()} contracts in PAR`,
    indicatorColor: "var(--color-status-warning)",
    href: "/portfolio/collections/all",
  },
  {
    id: "active-recoveries",
    title: "Active Recoveries",
    value: recoveryCommandCenterStats.activeRecoveries.toLocaleString(),
    subtitle: `${recoveryCommandCenterStats.successRate}% success rate`,
    indicatorColor: "var(--color-status-success)",
    href: "/portfolio/recovery/command-center",
  },
  {
    id: "financier-loan-book",
    title: "Financier Loan Book",
    value: financierStats.totalLoanAmount,
    subtitle: `${financierStats.active} active financiers`,
    indicatorColor: "var(--color-status-info)",
    href: "/portfolio/funding/financiers",
  },
  {
    id: "write-offs-pending",
    title: "Write-Offs Pending",
    value: writeOffApprovalStats.pending.toLocaleString(),
    subtitle: formatCurrency(
      mockWriteOffBatches
        .filter((b) => b.status === "Pending")
        .reduce((sum, b) => sum + b.provisionAmount, 0)
    ),
    indicatorColor: "var(--color-status-danger)",
    href: "/portfolio/ops/write-off-approvals",
  },
]

// ── Distribution charts — status breakdown per module, mirrors Fleet Ops' region grid ──

export const PORTFOLIO_DISTRIBUTION_REGIONS: RegionDistribution[] = [
  {
    region: "Contracts by Status",
    data: [
      { label: "Active", value: contractStats.active, color: "var(--color-status-success)" },
      { label: "Paused", value: contractStats.paused, color: "var(--color-status-warning)" },
      {
        label: "Marked for Closure",
        value: mockContracts.filter((c) => c.status === "Marked for Closure").length,
        color: "var(--color-status-purple)",
      },
      { label: "Completed", value: contractStats.completed, color: "var(--color-gray-400)" },
    ],
  },
  {
    region: "Champions by Status",
    data: [
      { label: "Active", value: portfolioChampionStats.active, color: "var(--color-status-success)" },
      { label: "Inactive", value: portfolioChampionStats.inactive, color: "var(--color-gray-400)" },
      { label: "Contract Complete", value: portfolioChampionStats.contractComplete, color: "var(--color-status-info)" },
    ],
  },
  {
    region: "Recovery Sessions",
    data: [
      { label: "In Session", value: recoverySessionStats.inSession, color: "var(--color-status-info)" },
      { label: "Successful", value: recoverySessionStats.successful, color: "var(--color-status-success)" },
      { label: "Failed", value: recoverySessionStats.failed, color: "var(--color-status-danger)" },
    ],
  },
  {
    region: "Write-Off Batches",
    data: [
      { label: "Approved", value: writeOffApprovalStats.approved, color: "var(--color-status-success)" },
      { label: "Pending", value: writeOffApprovalStats.pending, color: "var(--color-status-warning)" },
      { label: "Rejected", value: writeOffApprovalStats.rejected, color: "var(--color-status-danger)" },
    ],
  },
]

// ── Bar charts — cross-entity comparisons, mirrors Fleet Ops' "by City" row ──

export interface PortfolioBarChart {
  id: string
  title: string
  categories: string[]
  series: BarChartSeries[]
  yAxisWidth?: number
}

const recoveryZones = Array.from(new Set(mockRecoveryPairs.map((p) => p.zone)))
const successfulRecoveriesByZone = recoveryZones.map((zone) =>
  mockRecoveryPairs.filter((p) => p.zone === zone).reduce((sum, p) => sum + p.successfulRecoveries, 0)
)

const loanAmountByPartner = FINANCING_PARTNERS.map((partner) =>
  Math.round(
    mockFinanciers.filter((f) => f.financingPartner === partner).reduce((sum, f) => sum + f.loanAmount, 0) / 1_000_000
  )
)

export const PORTFOLIO_BAR_CHARTS: PortfolioBarChart[] = [
  {
    id: "recoveries-by-zone",
    title: "Successful Recoveries by Zone",
    categories: recoveryZones,
    series: [{ name: "Successful Recoveries", data: successfulRecoveriesByZone, color: "var(--color-status-success)" }],
  },
  {
    id: "loan-amount-by-partner",
    title: "Financier Loan Amount by Partner (₦M)",
    categories: FINANCING_PARTNERS,
    series: [{ name: "Loan Amount (₦M)", data: loanAmountByPartner, color: "var(--color-status-info)" }],
    yAxisWidth: 110,
  },
]
