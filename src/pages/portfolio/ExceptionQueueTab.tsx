import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  ExpandableSearch,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  mockRepricingExceptions,
  mockResolvedExceptionsThisWeek,
  EXCEPTION_REASONS,
  type RepricingException,
} from "@/data/mockRepricingExceptions"
import { getRepricingExceptionColumns } from "./repricingExceptionColumns"
import { EditExceptionInputsModal, type ExceptionInputOverrides } from "./EditExceptionInputsModal"
import { ApproveOverrideModal } from "./ApproveOverrideModal"
import { RerunContractModal } from "./RerunContractModal"

const defaultFilters: GenericFilterState = {
  reason: [],
}

const filterSections: FilterSection[] = [
  {
    id: "reason",
    title: "Reason",
    defaultExpanded: true,
    options: EXCEPTION_REASONS.map((reason) => ({ value: reason, label: reason })),
  },
]

export function ExceptionQueueTab() {
  const [exceptions, setExceptions] = useState<RepricingException[]>(mockRepricingExceptions)
  const [resolvedThisWeek, setResolvedThisWeek] = useState(mockResolvedExceptionsThisWeek)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [editInputsException, setEditInputsException] = useState<RepricingException | null>(null)
  const [approveOverrideException, setApproveOverrideException] = useState<RepricingException | null>(null)
  const [rerunException, setRerunException] = useState<RepricingException | null>(null)

  const activeFilterCount = getActiveFilterCount(filters)

  const stats = useMemo(
    () => ({
      open: exceptions.length,
      highSeverity: exceptions.filter((e) => e.severity === "High").length,
      unassigned: exceptions.filter((e) => e.assignee === null).length,
    }),
    [exceptions]
  )

  const filteredExceptions = useMemo(() => {
    return exceptions.filter((e) => {
      if (filters.reason.length > 0 && !filters.reason.includes(e.reason)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !e.exceptionId.toLowerCase().includes(q) &&
          !e.contractId.toLowerCase().includes(q) &&
          !e.championName.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [exceptions, filters, searchQuery])

  const resolveException = (exception: RepricingException) => {
    setExceptions((prev) => prev.filter((e) => e.id !== exception.id))
    setResolvedThisWeek((prev) => prev + 1)
  }

  const handleSaveInputs = (exception: RepricingException, values: ExceptionInputOverrides) => {
    toast.success("Calculation inputs updated", {
      description: `${exception.contractId} will use vehicle cost ₦${values.vehicleCost.toLocaleString()}, remittance ₦${values.dailyRemittance.toLocaleString()}, and margin ${values.marginPercent}% on its next repricing run.`,
    })
    setEditInputsException(null)
  }

  const handleApproveOverride = (exception: RepricingException, notes: string) => {
    resolveException(exception)
    toast.success("Override approved", {
      description: `${exception.exceptionId} resolved for ${exception.contractId}. Notes: "${notes}"`,
    })
    setApproveOverrideException(null)
  }

  const handleRerunComplete = (exception: RepricingException) => {
    resolveException(exception)
    toast.success("Repricing re-run complete", {
      description: `${exception.contractId} was re-evaluated and the exception is now resolved.`,
    })
  }

  const columns = getRepricingExceptionColumns({
    onEditInputs: setEditInputsException,
    onApproveOverride: setApproveOverrideException,
    onRerun: setRerunException,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6 grid grid-cols-4 gap-2">
        <StatCard
          title="Open Exceptions"
          value={stats.open}
          subtitle="Awaiting triage"
          indicatorColor="var(--color-brand-primary)"
          className="border-brand-primary"
        />
        <StatCard
          title="High Severity"
          value={stats.highSeverity}
          subtitle="Needs urgent review"
          indicatorColor="var(--color-status-danger)"
        />
        <StatCard
          title="Unassigned"
          value={stats.unassigned}
          subtitle="No owner yet"
          indicatorColor="var(--color-gray-400)"
        />
        <StatCard
          title="Resolved This Week"
          value={resolvedThisWeek}
          subtitle="Overridden or re-run"
          indicatorColor="var(--color-status-success)"
        />
      </div>

      <div className="px-6">
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
              placeholder="Search by exception ID, contract, champion..."
              inputClassName="w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filteredExceptions} emptyMessage="No open exceptions." />
          </div>
        </div>
      </div>

      <EditExceptionInputsModal
        exception={editInputsException}
        onClose={() => setEditInputsException(null)}
        onSave={handleSaveInputs}
      />

      <ApproveOverrideModal
        exception={approveOverrideException}
        onClose={() => setApproveOverrideException(null)}
        onApprove={handleApproveOverride}
      />

      <RerunContractModal
        contract={rerunException}
        onClose={() => setRerunException(null)}
        onComplete={handleRerunComplete}
      />
    </div>
  )
}
