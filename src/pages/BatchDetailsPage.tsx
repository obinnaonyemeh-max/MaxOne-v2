import { useParams, useNavigate } from "react-router-dom"
import { Pencil } from "lucide-react"

import {
  TopBar,
  InfoCard,
  InfoGrid,
  StatusBadge,
  StatusTimeline,
  BackButton,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getBatchDetails } from "@/data/mockBatchDetails"

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const batch = getBatchDetails(id || "1")

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
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
                  {batch.batchId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing batch information and stage history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90">
                <Pencil className="h-4 w-4" />
                Edit Batch
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-6 items-start">
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <div className="bg-content-card rounded-lg border border-border p-5">
              <h3 className="text-base font-medium text-sidebar-item-active mb-4">
                Batch Overview
              </h3>

              <div className="flex justify-center mb-4">
                <StatusBadge variant={batch.stageVariant} withDot>
                  {batch.stage}
                </StatusBadge>
              </div>

              <div className="flex justify-center py-4 mb-4">
                <img
                  src="/images/2wheeler_overview.png"
                  alt="Vehicle"
                  className="w-auto object-contain"
                  style={{ height: '141px' }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root font-medium">OEM</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batch.batchInfo.oem}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root font-medium">Model</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batch.batchInfo.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root font-medium">Quantity</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batch.batchInfo.quantity.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root font-medium">Destination</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batch.batchInfo.destinationCity}, {batch.batchInfo.destinationCountry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root font-medium">Expected Delivery</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batch.shipping.expectedDeliveryDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="details" className="flex flex-col flex-1 min-h-0">
              <TabsList variant="line" className="shrink-0 pb-0 gap-0">
                <TabsTrigger
                  value="details"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Batch Details
                </TabsTrigger>
                <TabsTrigger
                  value="stage-history"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Stage History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                  <InfoCard title="BATCH INFORMATION">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Batch ID", value: batch.batchId },
                        { label: "OEM / Manufacturer", value: batch.batchInfo.oem },
                        { label: "Model", value: batch.batchInfo.model },
                        { label: "Trim", value: batch.batchInfo.trim },
                        { label: "Quantity", value: batch.batchInfo.quantity.toLocaleString() },
                        { label: "Destination Country", value: batch.batchInfo.destinationCountry },
                        { label: "Destination City", value: batch.batchInfo.destinationCity },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="SHIPPING DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Container Number", value: batch.shipping.containerNumber },
                        { label: "Shipping Line", value: batch.shipping.shippingLine },
                        { label: "Port of Arrival", value: batch.shipping.portOfArrival },
                        { label: "Expected Delivery Date", value: batch.shipping.expectedDeliveryDate },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="FINANCIAL DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Payment Reference", value: batch.financials.paymentReference },
                        { label: "Invoice / PO Reference", value: batch.financials.invoicePoReference },
                      ]}
                    />
                  </InfoCard>

                  {batch.notes && (
                    <InfoCard title="NOTES">
                      <p className="text-sm text-table-text">{batch.notes}</p>
                    </InfoCard>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stage-history" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={batch.stageHistory} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
