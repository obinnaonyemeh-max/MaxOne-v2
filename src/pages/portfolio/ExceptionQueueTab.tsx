import { useMemo, useState } from "react"
import { toast } from "sonner"

import { DataTable, StatCard } from "@/components/max"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const ALL_REASONS = "all"

export function ExceptionQueueTab() {
  const [exceptions, setExceptions] = useState<RepricingException[]>(mockRepricingExceptions)
  const [resolvedThisWeek, setResolvedThisWeek] = useState(mockResolvedExceptionsThisWeek)
  const [reasonFilter, setReasonFilter] = useState(ALL_REASONS)
  const [editInputsException, setEditInputsException] = useState<RepricingException | null>(null)
  const [approveOverrideException, setApproveOverrideException] = useState<RepricingException | null>(null)
  const [rerunException, setRerunException] = useState<RepricingException | null>(null)

  const stats = useMemo(
    () => ({
      open: exceptions.length,
      highSeverity: exceptions.filter((e) => e.severity === "High").length,
      unassigned: exceptions.filter((e) => e.assignee === null).length,
    }),
    [exceptions]
  )

  const filteredExceptions = useMemo(() => {
    if (reasonFilter === ALL_REASONS) return exceptions
    return exceptions.filter((e) => e.reason === reasonFilter)
  }, [exceptions, reasonFilter])

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
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sidebar-item-active text-sm">Exception Queue</h3>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="h-9 w-[260px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_REASONS}>Reason: All</SelectItem>
                {EXCEPTION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    Reason: {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable columns={columns} data={filteredExceptions} emptyMessage="No open exceptions." />
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
