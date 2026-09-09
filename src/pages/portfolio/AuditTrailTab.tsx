import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"

import { DataTable, ExpandableSearch } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockRepricingAuditTrail, type AuditTrailEntry } from "@/data/mockRepricingAuditTrail"
import { getAuditTrailColumns } from "./auditTrailColumns"
import { CalculationHistoryModal } from "./CalculationHistoryModal"

export function AuditTrailTab() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [historyEntry, setHistoryEntry] = useState<AuditTrailEntry | null>(null)

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return mockRepricingAuditTrail
    const q = searchQuery.toLowerCase()
    return mockRepricingAuditTrail.filter(
      (entry) =>
        (entry.contractId?.toLowerCase().includes(q) ?? false) ||
        entry.user.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleExport = () => {
    toast.success("Audit log exported", {
      description: `${filteredEntries.length} entr${filteredEntries.length === 1 ? "y" : "ies"} exported as CSV.`,
    })
  }

  const columns = getAuditTrailColumns({ onViewHistory: setHistoryEntry })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 px-2 py-2 border-b border-gray-100">
            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search contract, user, action..."
              inputClassName="w-72"
            />

            <Button variant="outline" className="ml-auto h-9 gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filteredEntries} emptyMessage="No audit trail entries found." />
          </div>
        </div>
      </div>

      <CalculationHistoryModal entry={historyEntry} onClose={() => setHistoryEntry(null)} />
    </div>
  )
}
