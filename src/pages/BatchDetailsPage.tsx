import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { TopBar, BackButton } from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { mockBatches } from "@/data/mockBatches"
import { getBatchDetails } from "@/data/mockBatchDetails"

import { OverviewTab } from "./batch-details/OverviewTab"
import { SubBatchesTab } from "./batch-details/SubBatchesTab"
import { VehicleIdsTab } from "./batch-details/VehicleIdsTab"
import { RegistrationPrepTab } from "./batch-details/RegistrationPrepTab"
import { DocumentsTab } from "./batch-details/DocumentsTab"
import { AddIdentifierModal } from "./batch-details/AddIdentifierModal"
import { UploadDocumentModal } from "./batch-details/UploadDocumentModal"

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { filterByCity } = useRoleSimulation()
  const listBatch = mockBatches.find((batch) => batch.id === (id || "1"))
  const batch = getBatchDetails(id || "1")

  useEffect(() => {
    if (listBatch && !filterByCity(listBatch.destination)) {
      navigate("/inbound/batches", { replace: true })
    }
  }, [filterByCity, listBatch, navigate])

  const [showAddIdentifier, setShowAddIdentifier] = useState(false)
  const [showUploadDoc, setShowUploadDoc] = useState(false)

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/batches" },
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
                Showing batch information and sub-batches
              </p>
            </div>
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
                  value="sub-batches"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Sub-Batches
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

              <TabsContent value="sub-batches" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <SubBatchesTab batchId={batch.batchId} />
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
