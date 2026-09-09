import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import {
  DataTable,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type RepricingRule } from "@/data/mockRepricingEngine"
import { getRepricingRuleColumns } from "./repricingRuleColumns"

interface RepricingRulesTableProps {
  rules: RepricingRule[]
  onView: (rule: RepricingRule) => void
  onDuplicate: (rule: RepricingRule) => void
  onActivate: (rule: RepricingRule) => void
  onDeactivate: (rule: RepricingRule) => void
}

const defaultFilters: GenericFilterState = { vehicleType: [], country: [], status: [] }

export function RepricingRulesTable({ rules, onView, onDuplicate, onActivate, onDeactivate }: RepricingRulesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  const filterSections: FilterSection[] = useMemo(() => {
    const vehicleTypes = [...new Set(rules.map((rule) => rule.vehicleType))].sort()
    const countries = [...new Set(rules.map((rule) => rule.country))].sort()
    const statuses = [...new Set(rules.map((rule) => rule.status))].sort()

    return [
      { id: "vehicleType", title: "Vehicle Type", defaultExpanded: true, options: vehicleTypes.map((v) => ({ value: v, label: v })) },
      { id: "country", title: "Country", options: countries.map((c) => ({ value: c, label: c })) },
      { id: "status", title: "Status", options: statuses.map((s) => ({ value: s, label: s })) },
    ]
  }, [rules])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      if (filters.vehicleType.length > 0 && !filters.vehicleType.includes(rule.vehicleType)) return false
      if (filters.country.length > 0 && !filters.country.includes(rule.country)) return false
      if (filters.status.length > 0 && !filters.status.includes(rule.status)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !rule.name.toLowerCase().includes(q) &&
          !rule.vehicleModel.toLowerCase().includes(q) &&
          !rule.country.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [rules, filters, searchQuery])

  const columns = getRepricingRuleColumns({ onView, onDuplicate, onActivate, onDeactivate })

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-100">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-2">
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
            <GenericFilterPopover sections={filterSections} filters={filters} onFiltersChange={setFilters} />
          </PopoverContent>
        </Popover>

        <ExpandableSearch
          open={searchOpen}
          onOpenChange={setSearchOpen}
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search by rule name, model, country..."
          inputClassName="w-72"
        />
      </div>

      <DataTable columns={columns} data={filteredRules} onRowClick={onView} emptyMessage="No repricing rules found." />
    </div>
  )
}
