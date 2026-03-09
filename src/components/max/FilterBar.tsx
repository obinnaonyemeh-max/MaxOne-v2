import { useState, type ReactNode } from "react"
import { format } from "date-fns"
import {
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Search,
  Plus,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { FilterPopover, type FilterState } from "./FilterPopover"

export interface FilterBarAction {
  label: string
  onClick: () => void
  icon?: LucideIcon | string
  variant?: "default" | "outline"
}

interface FilterBarProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  filters?: FilterState
  onFiltersChange?: (filters: FilterState) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  primaryAction?: FilterBarAction
  secondaryAction?: FilterBarAction
  className?: string
  children?: ReactNode
}

const defaultFilters: FilterState = {
  championStatus: [],
  contractStatus: [],
  locations: [],
}

export function FilterBar({
  dateRange,
  onDateRangeChange,
  filters = defaultFilters,
  onFiltersChange,
  onSearch,
  searchPlaceholder = "Search...",
  primaryAction,
  secondaryAction,
  className,
  children,
}: FilterBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const activeFilterCount =
    filters.championStatus.length +
    filters.contractStatus.length +
    filters.locations.length

  const handleSearchSubmit = () => {
    onSearch?.(searchQuery)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range"
    if (!dateRange.to) return format(dateRange.from, "dd MMM yyyy")
    return `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-2 py-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-2 border-border bg-white text-foreground hover:bg-gray-50"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-2 border-border bg-white text-foreground hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <FilterPopover
              filters={filters}
              onFiltersChange={(newFilters) => onFiltersChange?.(newFilters)}
            />
          </PopoverContent>
        </Popover>

        {searchOpen ? (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="h-9 w-48"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery("")
              }}
            >
              <span className="sr-only">Close search</span>
              ×
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border bg-white hover:bg-gray-50"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        {children}
      </div>

      <div className="flex items-center gap-2">
        {secondaryAction && (
          <Button
            variant="outline"
            className={cn(
              "h-9 gap-2 border-border bg-white text-foreground hover:bg-gray-50",
              secondaryAction.icon ? "px-3" : "px-4"
            )}
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.icon && (
              typeof secondaryAction.icon === "string" ? (
                <img src={secondaryAction.icon} alt="" className="h-4 w-4" />
              ) : (
                <secondaryAction.icon className="h-4 w-4" />
              )
            )}
            <span className="text-sm">{secondaryAction.label}</span>
          </Button>
        )}

        {primaryAction && (
          <Button
            className={cn(
              "h-9 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90",
              primaryAction.icon ? "px-3" : "px-4"
            )}
            onClick={primaryAction.onClick}
          >
            {primaryAction.icon && (
              typeof primaryAction.icon === "string" ? (
                <img src={primaryAction.icon} alt="" className="h-4 w-4" />
              ) : (
                <primaryAction.icon className="h-4 w-4" />
              )
            )}
            <span className="text-sm">{primaryAction.label}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
