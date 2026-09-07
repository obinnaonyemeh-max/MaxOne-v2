import { useState } from "react"
import {
  differenceInCalendarMonths,
  endOfDay,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns"

export type Period = "30d" | "2m" | "6m" | "custom"

const PERIOD_SCALE: Record<Exclude<Period, "custom">, number> = {
  "30d": 0.72,
  "2m": 0.82,
  "6m": 1,
}

export interface PeriodFilterState {
  period: Period
  setPeriod: (period: Period) => void
  customStartDate?: Date
  setCustomStartDate: (date: Date | undefined) => void
  customEndDate?: Date
  setCustomEndDate: (date: Date | undefined) => void
  customOpen: boolean
  setCustomOpen: (open: boolean) => void
  applyCustomRange: () => void
}

export function usePeriodFilter(defaultPeriod: Period = "6m"): PeriodFilterState {
  const [period, setPeriod] = useState<Period>(defaultPeriod)
  const [customStartDate, setCustomStartDate] = useState<Date>()
  const [customEndDate, setCustomEndDate] = useState<Date>()
  const [customOpen, setCustomOpen] = useState(false)

  const applyCustomRange = () => {
    if (!customStartDate || !customEndDate) return
    setPeriod("custom")
    setCustomOpen(false)
  }

  return {
    period,
    setPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    customOpen,
    setCustomOpen,
    applyCustomRange,
  }
}

export function getPeriodBounds(
  period: Period,
  latestDate: Date,
  customStartDate?: Date,
  customEndDate?: Date
): { from: Date; to: Date } {
  let from = subMonths(latestDate, 6)
  let to = latestDate
  if (period === "30d") from = subDays(latestDate, 29)
  if (period === "2m") from = subMonths(latestDate, 2)
  if (period === "custom" && customStartDate && customEndDate) {
    from = customStartDate
    to = customEndDate
  }

  return { from: startOfDay(from), to: endOfDay(to) }
}

export function getPeriodScale(
  period: Period,
  customStartDate?: Date,
  customEndDate?: Date
): number {
  if (period !== "custom") return PERIOD_SCALE[period]
  if (!customStartDate || !customEndDate) return PERIOD_SCALE["6m"]

  const months = Math.max(1, differenceInCalendarMonths(customEndDate, customStartDate))
  return Math.max(0.5, months / 6)
}
