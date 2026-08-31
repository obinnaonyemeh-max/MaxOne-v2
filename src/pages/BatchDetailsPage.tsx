import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { TopBar, BackButton, Toast, useToast } from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { mockBatches } from "@/data/mockBatches"
import { getBatchDetails } from "@/data/mockBatchDetails"
import {
  createSubBatchFromIdentifiers,
  parseIdentifierCsv,
  useInboundStore,
} from "@/data/inboundStore"
import type { IdentifierInput } from "@/data/mockBatchDetailRows"

import { OverviewTab } from "./batch-details/OverviewTab"
import { SubBatchesTab } from "./batch-details/SubBatchesTab"
import { VehicleIdsTab } from "./batch-details/VehicleIdsTab"
import { RegistrationPrepTab } from "./batch-details/RegistrationPrepTab"
import { DocumentsTab } from "./batch-details/DocumentsTab"
import { AddIdentifierModal } from "./batch-details/AddIdentifierModal"
import { UploadDocumentModal } from "./batch-details/UploadDocumentModal"
import { UploadIdentifiersCsvModal } from "./batch-details/UploadIdentifiersCsvModal"

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { filterByCity } = useRoleSimulation()
  const { identifiers } = useInboundStore()
  const listBatch = mockBatches.find((batch) => batch.id === (id || "1"))
  const batch = getBatchDetails(id || "1")
  const identifiersUploaded = identifiers.filter((row) => row.batchId === batch.batchId).length

  useEffect(() => {
    if (listBatch && !filterByCity(listBatch.destination)) {
      navigate("/inbound/batches", { replace: true })
    }
  }, [filterByCity, listBatch, navigate])

  const [showAddIdentifier, setShowAddIdentifier] = useState(false)
  const [showUploadCsv, setShowUploadCsv] = useState(false)
  const [showUploadDoc, setShowUploadDoc] = useState(false)
  const { message: toast, variant: toastVariant, showToast, showError } = useToast()

  const handleAddIdentifier = (input: IdentifierInput) => {
    const created = createSubBatchFromIdentifiers(batch.batchId, [input])
    if (!created) {
      showError("Enter a chassis number to create a sub-batch.")
      return
    }
    showToast(`Sub-batch ${created.subBatch.subBatchId} created with 1 identifier`)
  }

  const handleUploadCsv = async (file: File) => {
    const text = await file.text()
    const rows = parseIdentifierCsv(text)
    if (rows.length === 0) {
      showError("No valid identifier rows found in the CSV.")
      return
    }
    const created = createSubBatchFromIdentifiers(batch.batchId, rows)
    if (!created) {
      showError("Could not create a sub-batch from this CSV.")
      return
    }
    showToast(
      `Sub-batch ${created.subBatch.subBatchId} created with ${created.identifiers.length} identifier${created.identifiers.length === 1 ? "" : "s"}`,
    )
  }

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
                <OverviewTab batch={batch} identifiersUploaded={identifiersUploaded} />
              </TabsContent>

              <TabsContent value="sub-batches" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <SubBatchesTab batchId={batch.batchId} />
              </TabsContent>

              <TabsContent value="vehicle-ids" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <VehicleIdsTab
                  batchId={batch.batchId}
                  onAddIdentifier={() => setShowAddIdentifier(true)}
                  onUploadCsv={() => setShowUploadCsv(true)}
                />
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

      <AddIdentifierModal
        open={showAddIdentifier}
        onOpenChange={setShowAddIdentifier}
        onSubmit={handleAddIdentifier}
      />
      <UploadIdentifiersCsvModal
        open={showUploadCsv}
        onOpenChange={setShowUploadCsv}
        onSubmit={handleUploadCsv}
      />
      <UploadDocumentModal open={showUploadDoc} onOpenChange={setShowUploadDoc} />
      <Toast message={toast} variant={toastVariant} />
    </>
  )
}
