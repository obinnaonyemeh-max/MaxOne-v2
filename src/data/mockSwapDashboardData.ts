const DAY_MS = 24 * 60 * 60 * 1000
const END_DATE_MS = Date.parse("2026-09-02T12:00:00+01:00")
const DAYS_IN_SIX_MONTHS = 184

export const swapDashboardTrend = Array.from(
  { length: DAYS_IN_SIX_MONTHS },
  (_, index) => {
    const date = new Date(END_DATE_MS - (DAYS_IN_SIX_MONTHS - index - 1) * DAY_MS)
    const shortTrend = Math.sin(index / 12) * 14
    const longTrend = Math.sin(index / 31) * 9
    const swaps = Math.max(
      0,
      Math.round(120 + index * 0.45 + shortTrend + longTrend)
    )
    const averageRevenuePerSwap = index % 3 === 0 ? 1_800 : 1_600

    return {
      date: date.toISOString(),
      value: swaps,
      secondaryValue: swaps * averageRevenuePerSwap,
    }
  }
)

export const tripDashboardTrend = swapDashboardTrend.map((point) => ({
  date: point.date,
  value: Math.round(point.value * 12.6164),
}))

export const distanceDashboardTrend = tripDashboardTrend.map((point) => ({
  date: point.date,
  value: Math.round(point.value * 7.673),
}))
