import { Search } from "lucide-react"
import {
  ShieldAlert,
  Phone,
  FileText,
  Briefcase,
  Radio,
  UserPlus,
  Car,
  ScanSearch,
  CalendarOff,
  MoreHorizontal,
  RefreshCw,
  HeartPulse,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ticketCategories } from "@/data/mockTicketCategories"
import type { TicketCategory } from "./types"

const iconMap: Record<string, LucideIcon> = {
  ShieldAlert,
  Phone,
  FileText,
  Briefcase,
  Radio,
  UserPlus,
  Car,
  ScanSearch,
  CalendarOff,
  MoreHorizontal,
  RefreshCw,
  HeartPulse,
}

interface StepSelectCategoryProps {
  searchQuery: string
  selectedCategory: TicketCategory | null
  onSearchChange: (query: string) => void
  onSelectCategory: (category: TicketCategory) => void
}

export function StepSelectCategory({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onSelectCategory,
}: StepSelectCategoryProps) {
  const filteredCategories = searchQuery.trim()
    ? ticketCategories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ticketCategories

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "15px" }}>
        Select a Category
      </h3>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search categories..."
          className="pl-9 h-10"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredCategories.map((category) => {
          const Icon = iconMap[category.icon]
          const isSelected = selectedCategory?.id === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg border p-5 text-center transition-all hover:border-gray-300",
                isSelected
                  ? "border-brand-dark bg-brand-dark/5"
                  : "border-gray-200 bg-gray-50"
              )}
            >
              {Icon && (
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isSelected ? "text-brand-dark" : "text-breadcrumb-root"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "13px" }}>
                  {category.name}
                </p>
                <p className="mt-0.5 text-breadcrumb-root" style={{ fontSize: "12px" }}>
                  {category.subcategoryCount} subcategories
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <p className="text-sm text-breadcrumb-root py-4 text-center">
          No categories found matching "{searchQuery}"
        </p>
      )}
    </div>
  )
}
