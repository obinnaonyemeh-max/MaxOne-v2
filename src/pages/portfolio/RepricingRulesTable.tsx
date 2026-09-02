import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { DataTable } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type RepricingRule } from "@/data/mockRepricingEngine"
import { getRepricingRuleColumns } from "./repricingRuleColumns"

interface RepricingRulesTableProps {
  rules: RepricingRule[]
  onView: (rule: RepricingRule) => void
  onDuplicate: (rule: RepricingRule) => void
  onDeactivate: (rule: RepricingRule) => void
}

export function RepricingRulesTable({ rules, onView, onDuplicate, onDeactivate }: RepricingRulesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const filteredRules = useMemo(() => {
    if (!searchQuery) return rules
    const q = searchQuery.toLowerCase()
    return rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(q) ||
        rule.vehicleModel.toLowerCase().includes(q) ||
        rule.country.toLowerCase().includes(q)
    )
  }, [rules, searchQuery])

  const columns = getRepricingRuleColumns({ onView, onDuplicate, onDeactivate })

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-sidebar-item-active text-sm">Repricing Rule Register</h3>
          <p className="text-xs text-breadcrumb-root mt-0.5">All EV and ICE repricing rules created for this workspace</p>
        </div>

        {searchOpen ? (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by rule name, model, country..."
              className="h-9 w-72"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchOpen(false)
                  setSearchQuery("")
                }
              }}
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
              ×
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={filteredRules} emptyMessage="No repricing rules found." />
    </div>
  )
}
