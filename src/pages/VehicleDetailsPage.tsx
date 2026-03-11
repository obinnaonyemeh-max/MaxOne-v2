import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { RotateCcw, Pencil } from "lucide-react"

import {
  TopBar,
  InfoCard,
  InfoGrid,
  VehicleOverviewCard,
  AssignmentHistoryCard,
  StatusTimeline,
  BackButton,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getVehicleDetails } from "@/data/mockVehicleDetails"

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isFromAssetMovement = location.pathname.startsWith("/asset-movement")
  const vehicle = getVehicleDetails(id || "1")
  const [assignmentIndex, setAssignmentIndex] = useState(0)

  const overviewDetails = [
    { label: "Asset type", value: vehicle.assetType },
    { label: "Vehicle Manufacturer", value: vehicle.manufacturer },
    {
      label: "Contract status",
      value: vehicle.contractStatus,
      isStatus: true,
      statusVariant: vehicle.contractStatus === "Active" ? "success" as const : "warning" as const,
    },
    { label: "Last updated by", value: vehicle.lastUpdatedBy },
    { label: "Last pinged on", value: vehicle.lastPingedOn },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Operations" },
          {
            label: isFromAssetMovement ? "Asset Movement" : "Fleet Register",
            href: isFromAssetMovement ? "/asset-movement" : "/fleet-register",
          },
          { label: vehicle.vehicleStatus },
          { label: vehicle.assetId },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton
                  onClick={() =>
                    isFromAssetMovement
                      ? navigate("/asset-movement")
                      : navigate(-1)
                  }
                />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
                  {vehicle.assetId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing vehicle information and possible champion assignment history
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 gap-2">
                <RotateCcw className="h-4 w-4" />
                Reverse Assignment
              </Button>
              <Button className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90">
                <Pencil className="h-4 w-4" />
                Edit Vehicle Info
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-6 items-start">
          {/* Left Column */}
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <VehicleOverviewCard
              status={vehicle.vehicleStatus}
              statusVariant={vehicle.vehicleStatusVariant}
              imageUrl={vehicle.imageUrl}
              details={overviewDetails}
            />
            <AssignmentHistoryCard
              assignments={vehicle.assignmentHistory}
              currentIndex={assignmentIndex}
              onPrevious={() => setAssignmentIndex((prev) => Math.max(0, prev - 1))}
              onNext={() =>
                setAssignmentIndex((prev) =>
                  Math.min(vehicle.assignmentHistory.length - 1, prev + 1)
                )
              }
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="basic" className="flex flex-col flex-1 min-h-0">
              <TabsList variant="line" className="shrink-0 pb-0 gap-0">
                <TabsTrigger
                  value="basic"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="telematics"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Telematics Information
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Status History
                </TabsTrigger>
                <TabsTrigger
                  value="movement"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Movement History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-0 flex-1 min-h-0 overflow-y-auto">
              <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                <InfoCard title="BASIC VEHICLE INFORMATION">
                  <InfoGrid
                    columns={4}
                    showDividers
                    items={[
                      { label: "Vehicle type", value: vehicle.basicInfo.vehicleType },
                      { label: "Model", value: vehicle.basicInfo.model },
                      { label: "Trim", value: vehicle.basicInfo.trim },
                      { label: "Platform Type", value: vehicle.basicInfo.platformType },
                    ]}
                  />
                </InfoCard>

                <InfoCard title="VEHICLE IDENTIFICATION">
                  <InfoGrid
                    columns={4}
                    showDividers
                    items={[
                      { label: "Chassis Number (VIN)", value: vehicle.identification.chassisNumber },
                      { label: "Engine Number", value: vehicle.identification.engineNumber },
                      { label: "Ignition Number", value: vehicle.identification.ignitionNumber },
                      { label: "Plate Number", value: vehicle.identification.plateNumber },
                    ]}
                  />
                </InfoCard>

                <InfoCard title="VENDOR & FINANCIAL DETAILS">
                  <InfoGrid
                    columns={4}
                    showDividers
                    items={[
                      { label: "OEM/Vendor Name", value: vehicle.vendor.oemVendorName },
                      { label: "Financial Partner", value: vehicle.vendor.financialPartner },
                    ]}
                  />
                </InfoCard>

                <InfoCard title="ASSIGNMENT, LOCATION & DATES">
                  <InfoGrid
                    columns={4}
                    showDividers
                    items={[
                      { label: "Location", value: vehicle.assignment.location },
                      { label: "Receiver", value: vehicle.assignment.receiver },
                      { label: "Delivery Date", value: vehicle.assignment.deliveryDate },
                      { label: "License Expiration Date", value: vehicle.assignment.licenseExpiration },
                    ]}
                  />
                </InfoCard>
              </div>
            </TabsContent>

              <TabsContent value="telematics" className="mt-0 flex-1 min-h-0 overflow-y-auto">
              <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                <InfoCard title="TELEMATICS DETAILS">
                  <InfoGrid
                    columns={4}
                    showDividers
                    items={[
                      { label: "Sim Serial Number", value: vehicle.telematics.simSerialNumber },
                      { label: "Device IMEI", value: vehicle.telematics.deviceImei },
                      { label: "Phone Number", value: vehicle.telematics.phoneNumber },
                      { label: "Helmet Number", value: vehicle.telematics.helmetNumber },
                    ]}
                  />
                </InfoCard>
              </div>
            </TabsContent>

              <TabsContent value="status" className="mt-0 flex-1 min-h-0 overflow-y-auto">
              <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                <StatusTimeline entries={vehicle.statusHistory} />
              </div>
            </TabsContent>

              <TabsContent value="movement" className="mt-0 flex-1 min-h-0 overflow-y-auto">
              <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                <p className="text-sm text-breadcrumb-root">
                  Movement history will be displayed here.
                </p>
              </div>
            </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
