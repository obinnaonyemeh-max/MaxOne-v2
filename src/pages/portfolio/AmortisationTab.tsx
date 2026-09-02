import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { DataTable } from "@/components/max"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"
import { type SettlementQuote, type AmortisationStatus, buildAmortisationSchedule } from "./earlyTerminationCalculations"
import { amortisationColumns } from "./amortisationColumns"

interface AmortisationTabProps {
  contract: EarlyTerminationContract | null
  quote: SettlementQuote | null
}

const filterOptions: Array<AmortisationStatus | "All"> = ["All", "Paid", "Outstanding", "Overdue"]

export function AmortisationTab({ contract, quote }: AmortisationTabProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [statusFilter, setStatusFilter] = useState<AmortisationStatus | "All">("All")

  const schedule = useMemo(() => (contract && quote ? buildAmortisationSchedule(contract, quote) : null), [contract, quote])

  const filteredSchedule = useMemo(() => {
    if (!schedule) return []
    if (statusFilter === "All") return schedule
    return schedule.filter((period) => period.status === statusFilter)
  }, [schedule, statusFilter])

  if (!schedule) {
    return (
      <div className="px-6">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
          <p className="text-sm font-medium text-breadcrumb-root">
            Select a country, customer and contract to generate an amortisation schedule.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-breadcrumb-root"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`} />
            Amortisation Schedule
          </button>

          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === option
                    ? "bg-white text-sidebar-item-active shadow-sm"
                    : "text-breadcrumb-root hover:text-sidebar-item-active"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {!collapsed && (
          <div className="max-h-[560px] overflow-y-auto">
            <DataTable
              columns={amortisationColumns}
              data={filteredSchedule}
              emptyMessage="No periods match this filter."
              getRowClassName={(row) => (row.status === "Current" ? "bg-brand-primary/5 hover:bg-brand-primary/5" : "")}
            />
          </div>
        )}
      </div>
    </div>
  )
}
