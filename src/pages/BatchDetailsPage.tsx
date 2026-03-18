import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowRight, Plus, Upload, Trash2 } from "lucide-react"

import {
  TopBar,
  InfoCard,
  InfoGrid,
  StatusBadge,
  StatusTimeline,
  BackButton,
  DataTable,
  Modal,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getBatchDetails } from "@/data/mockBatchDetails"

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

interface VehicleIdentifier {
  id: string
  chassisVin: string
  engineNo: string
  ignitionNo: string
  batterySn: string
  color: string
  receiver: string
}

const mockIdentifiers: VehicleIdentifier[] = [
  { id: "1", chassisVin: "WE3234777TYT", engineNo: "EV387465", ignitionNo: "TH19009", batterySn: "BAT90909", color: "YELLOW", receiver: "FLEETOPS" },
]

const identifierColumns: ColumnDef<VehicleIdentifier>[] = [
  {
    accessorKey: "chassisVin",
    header: "Chassis (VIN)",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.chassisVin}
      </span>
    ),
  },
  {
    accessorKey: "engineNo",
    header: "Engine No.",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.engineNo}
      </span>
    ),
  },
  {
    accessorKey: "ignitionNo",
    header: "Ignition No.",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.ignitionNo}
      </span>
    ),
  },
  {
    accessorKey: "batterySn",
    header: "Battery S/N",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.batterySn}
      </span>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.color}
      </span>
    ),
  },
  {
    accessorKey: "receiver",
    header: "Receiver",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.receiver}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <button
        type="button"
        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    ),
  },
]

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const batch = getBatchDetails(id || "1")
  const nextStage = getNextStage(batch.stage)
  const [showAddIdentifier, setShowAddIdentifier] = useState(false)

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
            {nextStage && (
              <div className="flex items-center gap-3">
                <Button className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90">
                  Move to {nextStage}
                  <ArrowRight className="h-4 w-4" />
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
                  value="movement-log"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Movement Log
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex-1 min-h-0 overflow-y-auto">
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
                        { label: "Status", value: <StatusBadge variant={batch.stageVariant} withDot>{batch.stage}</StatusBadge> },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="PROGRESS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Identifiers Uploaded", value: "1/400" },
                        { label: "Registration Complete", value: "1/400" },
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

              <TabsContent value="batch-tracker" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={batch.stageHistory} />
                </div>
              </TabsContent>

              <TabsContent value="vehicle-ids" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      {mockIdentifiers.length} identifier{mockIdentifiers.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="h-9 gap-2">
                        <Upload className="h-4 w-4" />
                        Upload CSV
                      </Button>
                      <Button className="h-9 gap-2" onClick={() => setShowAddIdentifier(true)}>
                        <Plus className="h-4 w-4" />
                        Add Identifier
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <DataTable columns={identifierColumns} data={mockIdentifiers} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="registration-prep" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">Registration Prep content coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="movement-log" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">Movement Log content coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">Documents content coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal
        open={showAddIdentifier}
        onOpenChange={setShowAddIdentifier}
        title="Add Vehicle Identifier"
        subtitle="Enter the vehicle identifier details below."
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Add Identifier",
          onClick: () => {
            setShowAddIdentifier(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowAddIdentifier(false),
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
            <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
              Vehicle Identifiers
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Chassis Number (VIN)</label>
              <Input placeholder="Enter chassis number (VIN)" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Engine Number</label>
              <Input placeholder="Enter engine number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Ignition Number</label>
              <Input placeholder="Enter ignition number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Battery Serial Number</label>
              <Input placeholder="Enter battery serial number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Color</label>
              <Input placeholder="Enter color" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Receiver / Destination Unit</label>
              <Input placeholder="Enter receiver / destination unit" className="h-12 bg-[#F8F8F8]" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
