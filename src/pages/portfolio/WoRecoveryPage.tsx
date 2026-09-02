import { useCallback, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { TopBar, PageHeader } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockWriteOffBatches, type WriteOffBatch } from "@/data/mockWriteOffBatches"
import { WriteOffTable } from "./WriteOffTable"
import { NewWriteOffModal, type NewWriteOffInput } from "./NewWriteOffModal"

let nextWriteOffSeq = mockWriteOffBatches.length + 1

function buildReferenceId(): string {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("")
  return `WO-MASTERWALLET-${datePart}-${String(nextWriteOffSeq++).padStart(3, "0")}`
}

export default function WoRecoveryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [batches, setBatches] = useState<WriteOffBatch[]>(mockWriteOffBatches)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [])

  const handleCreate = (input: NewWriteOffInput) => {
    const newBatch: WriteOffBatch = {
      id: crypto.randomUUID(),
      referenceId: buildReferenceId(),
      submittedBy: "Desmond Nsogbuwa",
      provisionAmount: input.writeOffAmount,
      numberOfContracts: input.numberOfContracts,
      dateAdded: new Date().toISOString(),
      status: "Pending",
      fileName: input.file.name,
    }

    setBatches((prev) => [newBatch, ...prev])
    setShowCreate(false)
    toast.success("Write-off batch submitted", {
      description: `${newBatch.referenceId} has been submitted for approval.`,
    })
  }

  const handleAction = useCallback((action: "approve" | "reject", row: WriteOffBatch) => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === row.id ? { ...batch, status: action === "approve" ? "Approved" : "Rejected" } : batch
      )
    )
    toast.success(action === "approve" ? "Write-off batch approved" : "Write-off batch rejected", {
      description: `${row.referenceId} has been ${action === "approve" ? "approved" : "rejected"}.`,
    })
  }, [])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Portfolio Ops" }, { label: "WO Recovery" }]} />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="WO Recovery"
          subtitle="Master-wallet write-off batches submitted for provisioning and approval."
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" />
            Create New Write-Off
          </Button>
        </div>
      </div>

      <WriteOffTable batches={batches} isLoading={isLoading} onAction={handleAction} />

      <NewWriteOffModal open={showCreate} onOpenChange={setShowCreate} onSubmit={handleCreate} />
    </>
  )
}
