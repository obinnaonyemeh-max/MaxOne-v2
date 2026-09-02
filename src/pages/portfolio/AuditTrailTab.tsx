import { useMemo, useState } from "react"
import { Download, Search } from "lucide-react"
import { toast } from "sonner"

import { DataTable } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockRepricingAuditTrail, type AuditTrailEntry } from "@/data/mockRepricingAuditTrail"
import { getAuditTrailColumns } from "./auditTrailColumns"
import { CalculationHistoryModal } from "./CalculationHistoryModal"

export function AuditTrailTab() {
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
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sidebar-item-active text-sm">Audit Trail</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contract, user, action..."
                  className="h-9 w-72 pl-9"
                />
              </div>
              <Button variant="outline" className="h-9 gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <DataTable columns={columns} data={filteredEntries} emptyMessage="No audit trail entries found." />
        </div>
      </div>

      <CalculationHistoryModal entry={historyEntry} onClose={() => setHistoryEntry(null)} />
    </div>
  )
}
