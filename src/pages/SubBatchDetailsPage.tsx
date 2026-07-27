import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { TopBar, BackButton, StatusTimeline, StatusBadge, InfoCard, InfoGrid, Toast, useToast } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { getSubBatchByIds, stageVariantMap, type SubBatch } from "@/data/mockSubBatches"
import { MoveStageModal } from "./batch-details/MoveStageModal"

const stageOrder = [
  "In Production",
  "Identifier Upload",
  "In Transit",
  "At Port",
  "Clearing",
  "Warehouse QA",
  "Ready for Activation",
]

function getNextStage(currentStage: string): string | null {
  const index = stageOrder.indexOf(currentStage)
  if (index === -1 || index === stageOrder.length - 1) return null
  return stageOrder[index + 1]
}

function SubBatchOverviewTab({ subBatch }: { subBatch: SubBatch }) {
  return (
    <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
      <InfoCard title="SUB-BATCH INFORMATION">
        <InfoGrid
          columns={4}
          showDividers
          items={[
            { label: "Sub-Batch ID", value: subBatch.subBatchId },
            { label: "Parent Batch", value: subBatch.batchId },
            { label: "Quantity", value: subBatch.qty.toLocaleString() },
            { label: "Created Date", value: subBatch.createdDate },
            { label: "Current Stage", value: <StatusBadge variant={subBatch.stageVariant} withDot>{subBatch.stage}</StatusBadge> },
          ]}
        />
      </InfoCard>
    </div>
  )
}

export default function SubBatchDetailsPage() {
  const { batchId, subBatchId } = useParams<{ batchId: string; subBatchId: string }>()
  const navigate = useNavigate()
  
  const baseSubBatch = getSubBatchByIds(batchId || "", subBatchId || "")
  
  const [stage, setStage] = useState(baseSubBatch?.stage || "In Production")
  const nextStage = getNextStage(stage)
  const stageVariant = stageVariantMap[stage] ?? "default"
  
  const subBatch = baseSubBatch ? { ...baseSubBatch, stage, stageVariant } : null

  const [showMoveStage, setShowMoveStage] = useState(false)
  const { message: toast, variant: toastVariant, showToast } = useToast()

  const advanceStage = (target: string) => {
    setStage(target)
    showToast(`Sub-batch moved to ${target}`)
  }

  const handleMoveClick = () => {
    if (!nextStage) return
    if (nextStage === "In Transit") {
      setShowMoveStage(true)
    } else {
      advanceStage(nextStage)
    }
  }

  if (!subBatch) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Deployment" },
            { label: "Inbound", href: "/inbound/dashboard" },
            { label: "Batches", href: "/inbound/batches" },
            { label: "Sub-Batch Not Found" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-breadcrumb-root">Sub-batch not found</p>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/dashboard" },
          { label: "Batches", href: "/inbound/batches" },
          { label: subBatch.batchId, href: `/inbound/batches/${batchId}` },
          { label: subBatch.subBatchId },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate(`/inbound/batches/${batchId}`)} />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
                  {subBatch.subBatchId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing sub-batch information and stage history
              </p>
            </div>
            {nextStage && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleMoveClick}
                  className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90"
                >
                  Move to {nextStage}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0">
              <TabsList variant="line" className="shrink-0 pb-0 gap-0">
                <TabsTrigger
                  value="overview"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="tracker"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Sub-Batch Tracker
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <SubBatchOverviewTab subBatch={subBatch} />
              </TabsContent>

              <TabsContent value="tracker" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={subBatch.stageHistory} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {nextStage && (
        <MoveStageModal
          open={showMoveStage}
          onOpenChange={setShowMoveStage}
          nextStage={nextStage}
          onConfirm={() => advanceStage(nextStage)}
        />
      )}

      <Toast message={toast} variant={toastVariant} />
    </>
  )
}
