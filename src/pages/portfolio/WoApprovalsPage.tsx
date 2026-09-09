import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { TopBar, PageHeader, StatCard } from "@/components/max"
import { mockWriteOffBatches, setWriteOffBatchStatus, type WriteOffBatch } from "@/data/mockWriteOffBatches"
import { WriteOffTable } from "./WriteOffTable"
import { formatProvisionAmount } from "./writeOffColumns"

export default function WoApprovalsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [batches, setBatches] = useState<WriteOffBatch[]>(mockWriteOffBatches)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const pendingBatches = useMemo(() => batches.filter((b) => b.status === "Pending"), [batches])

  const stats = useMemo(
    () => ({
      count: pendingBatches.length,
      totalAmount: pendingBatches.reduce((sum, b) => sum + b.provisionAmount, 0),
      totalContracts: pendingBatches.reduce((sum, b) => sum + b.numberOfContracts, 0),
    }),
    [pendingBatches]
  )

  const handleAction = useCallback((action: "approve" | "reject", row: WriteOffBatch) => {
    setWriteOffBatchStatus(row.id, action === "approve" ? "Approved" : "Rejected")
    setBatches([...mockWriteOffBatches])
    toast.success(action === "approve" ? "Write-off batch approved" : "Write-off batch rejected", {
      description: `${row.referenceId} has been ${action === "approve" ? "approved" : "rejected"}.`,
    })
  }, [])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Portfolio Ops" }, { label: "WO Approvals" }]} />

      <div className="px-6">
        <PageHeader
          title="WO Approvals"
          subtitle="Review and approve master-wallet write-off batches submitted for provisioning."
          className="px-0"
        />
      </div>

      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        <StatCard
          title="Pending Approvals"
          value={stats.count.toLocaleString()}
          subtitle="Write-off batches awaiting review"
          indicatorColor="var(--color-status-warning)"
        />
        <StatCard
          title="Total Amount Pending"
          value={formatProvisionAmount(stats.totalAmount)}
          subtitle="Combined provision across pending batches"
          indicatorColor="var(--color-status-danger)"
        />
        <StatCard
          title="Contracts Affected"
          value={stats.totalContracts.toLocaleString()}
          subtitle="Contracts covered by pending batches"
          indicatorColor="var(--color-status-info)"
        />
      </div>

      <WriteOffTable batches={pendingBatches} isLoading={isLoading} onAction={handleAction} actionsVariant="buttons" />
    </>
  )
}
