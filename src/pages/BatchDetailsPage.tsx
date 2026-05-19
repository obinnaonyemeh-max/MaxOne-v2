import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { TopBar, BackButton, StatusTimeline } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getBatchDetails } from "@/data/mockBatchDetails"

import { getNextStage } from "./batch-details/options"
import { OverviewTab } from "./batch-details/OverviewTab"
import { VehicleIdsTab } from "./batch-details/VehicleIdsTab"
import { RegistrationPrepTab } from "./batch-details/RegistrationPrepTab"
import { DocumentsTab } from "./batch-details/DocumentsTab"
import { AddIdentifierModal } from "./batch-details/AddIdentifierModal"
import { UploadDocumentModal } from "./batch-details/UploadDocumentModal"

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const batch = getBatchDetails(id || "1")
  const nextStage = getNextStage(batch.stage)

  const [showAddIdentifier, setShowAddIdentifier] = useState(false)
  const [showUploadDoc, setShowUploadDoc] = useState(false)

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/dashboard" },
          { label: "Batches", href: "/inbound/batches" },
          { label: batch.batchId },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/inbound/batches")} />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
                  {batch.batchId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing batch information and stage history
              </p>
            </div>
            {nextStage && (
              <div className="flex items-center gap-3">
                <Button className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90">
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
                  value="batch-tracker"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Batch Tracker
                </TabsTrigger>
                <TabsTrigger
                  value="vehicle-ids"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Vehicle IDs
                </TabsTrigger>
                <TabsTrigger
                  value="registration-prep"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Registration Prep
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <OverviewTab batch={batch} />
              </TabsContent>

              <TabsContent value="batch-tracker" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={batch.stageHistory} />
                </div>
              </TabsContent>

              <TabsContent value="vehicle-ids" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <VehicleIdsTab onAddIdentifier={() => setShowAddIdentifier(true)} />
              </TabsContent>

              <TabsContent value="registration-prep" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <RegistrationPrepTab />
              </TabsContent>

              <TabsContent value="documents" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <DocumentsTab onUpload={() => setShowUploadDoc(true)} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AddIdentifierModal open={showAddIdentifier} onOpenChange={setShowAddIdentifier} />
      <UploadDocumentModal open={showUploadDoc} onOpenChange={setShowUploadDoc} />
    </>
  )
}
