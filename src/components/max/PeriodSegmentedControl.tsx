import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Period } from "./periodFilter"

const PERIODS: Array<{ value: Exclude<Period, "custom">; label: string }> = [
  { value: "30d", label: "30D" },
  { value: "2m", label: "2M" },
  { value: "6m", label: "6M" },
]

interface PeriodSegmentedControlProps {
  period: Period
  onPeriodChange: (period: Period) => void
  customStartDate?: Date
  customEndDate?: Date
  onCustomStartDateChange: (date: Date | undefined) => void
  onCustomEndDateChange: (date: Date | undefined) => void
  customOpen: boolean
  onCustomOpenChange: (open: boolean) => void
  onApplyCustomRange: () => void
  maxDate?: Date
  className?: string
}

export function PeriodSegmentedControl({
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  customOpen,
  onCustomOpenChange,
  onApplyCustomRange,
  maxDate,
  className,
}: PeriodSegmentedControlProps) {
  const customLabel =
    period === "custom" && customStartDate && customEndDate
      ? `${format(customStartDate, "dd MMM")} – ${format(customEndDate, "dd MMM")}`
      : "Custom"

  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-1 rounded-md bg-gray-100 p-0.5", className)}>
      {PERIODS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            "rounded px-3 py-1 text-xs font-medium transition-colors",
            period === option.value
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500 hover:text-gray-950"
          )}
        >
          {option.label}
        </button>
      ))}

      <Popover open={customOpen} onOpenChange={onCustomOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "rounded px-3 py-1 text-xs font-medium transition-colors",
              period === "custom"
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-950"
            )}
          >
            {customLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <p className="mb-3 text-sm font-medium text-gray-950">Select Date Range</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateField
              label="Start Date"
              value={customStartDate}
              onChange={onCustomStartDateChange}
              disabled={(date) =>
                (customEndDate ? date > customEndDate : false) ||
                (maxDate ? date > maxDate : false)
              }
            />
            <DateField
              label="End Date"
              value={customEndDate}
              onChange={onCustomEndDateChange}
              disabled={(date) =>
                (customStartDate ? date < customStartDate : false) ||
                (maxDate ? date > maxDate : false)
              }
            />
          </div>
          <Button
            type="button"
            onClick={onApplyCustomRange}
            disabled={!customStartDate || !customEndDate}
            className="mt-4 w-full"
          >
            Apply Range
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function DateField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
  disabled: (date: Date) => boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start gap-2 font-normal">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className={value ? "text-gray-950" : "text-gray-500"}>
              {value ? format(value, "dd MMM yyyy") : "Pick date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
