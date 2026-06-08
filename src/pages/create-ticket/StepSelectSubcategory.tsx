import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/max/StatusBadge"
import { getSubcategoriesByCategoryId } from "@/data/mockTicketCategories"
import { priorityVariantMap } from "@/data/mockTicketRecords"
import type { TicketCategory, TicketSubcategory } from "./types"

interface StepSelectSubcategoryProps {
  category: TicketCategory
  selectedSubcategory: TicketSubcategory | null
  onSelectSubcategory: (subcategory: TicketSubcategory) => void
}

export function StepSelectSubcategory({
  category,
  selectedSubcategory,
  onSelectSubcategory,
}: StepSelectSubcategoryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const subcategories = getSubcategoriesByCategoryId(category.id)
  const filteredSubcategories = searchQuery.trim()
    ? subcategories.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subcategories

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "15px" }}>
        Select a subcategory under {category.name}
      </h3>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subcategories..."
          className="pl-9 h-10"
        />
      </div>

      <div className="space-y-2">
        {filteredSubcategories.map((sub) => {
          const isSelected = selectedSubcategory?.id === sub.id

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubcategory(sub)}
              className={cn(
                "flex items-center justify-between w-full border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors text-left",
                isSelected
                  ? "border-brand-dark bg-brand-dark/5"
                  : "border-gray-200"
              )}
            >
              <span className="font-medium text-sidebar-item-active text-sm">
                {sub.name}
              </span>

              <div className="flex items-center gap-4 text-xs text-breadcrumb-root shrink-0">
                <span>Team: {sub.concernedTeam}</span>
                <span>SLA: {sub.slaTime}</span>
                <StatusBadge variant={priorityVariantMap[sub.priorityLevel]} withDot size="sm">
                  {sub.priorityLevel}
                </StatusBadge>
              </div>
            </button>
          )
        })}
      </div>

      {filteredSubcategories.length === 0 && (
        <p className="text-sm text-breadcrumb-root py-4 text-center">
          No subcategories found matching "{searchQuery}"
        </p>
      )}
    </div>
  )
}
