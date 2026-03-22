import { useParams, useNavigate } from "react-router-dom"

import {
  TopBar,
  BackButton,
  StatusBadge,
  InfoCard,
  InfoGrid,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { mockScrapRecords, stageVariantMap } from "@/pages/ScrapManagementPage"

export default function ScrapDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const record = mockScrapRecords.find((r) => r.assetId === id)

  if (!record) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Scrap Management" }]} />
        <div className="px-6 py-12 text-center text-muted-foreground">Record not found.</div>
      </>
    )
  }

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Scrap Management" }, { label: record.assetId }]}
      />
      <header className="px-6 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate("/scrap-management")} />
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
            Scrap Detail – {record.assetId}
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
        </div>
        <p className="mt-1 text-sm font-medium text-breadcrumb-root">
          Vehicle scrap summary, salvaged parts, and recovery tracking
        </p>
      </header>

      <div className="px-6 flex flex-col flex-1 min-h-0 overflow-y-auto pb-8">
        <div className="grid grid-cols-3 gap-2">
          <StatCard title="Salvaged Parts Value" value="$0" indicatorColor="var(--color-gray-400)" />
          <StatCard title="Reusable Parts" value="0" indicatorColor="var(--color-gray-400)" />
          <StatCard title="Added to Inventory" value="0" indicatorColor="var(--color-gray-400)" />
          <StatCard title="Scrap Residual Value" value={record.estScrapValue} indicatorColor="var(--color-gray-400)" />
          <StatCard title="Total Recovered Value" value={record.estScrapValue} indicatorColor="var(--color-gray-400)" />
          <StatCard title="Recovery Ratio" value="4.9%" subtitle="vs $8,500 book value" indicatorColor="var(--color-gray-400)" />
        </div>

        <InfoCard title="Vehicle Scrap Summary" className="mt-6">
          <InfoGrid
            columns={2}
            showDividers
            items={[
              { label: "Asset / ID", value: record.assetId },
              { label: "Plate Number", value: record.plateNumber },
              { label: "Vehicle Model", value: record.vehicleModel },
              { label: "Manufacturer", value: record.manufacturer },
              {
                label: "Scrap Stage",
                value: (
                  <StatusBadge variant={stageVariantMap[record.scrapStage] || "default"}>
                    {record.scrapStage}
                  </StatusBadge>
                ),
              },
              { label: "Location", value: record.location },
              { label: "Date Assigned", value: "2026-02-28" },
              { label: "Assigned Officer", value: "James Mwangi" },
            ]}
          />
        </InfoCard>

        <InfoCard title="Salvaged Parts" className="mt-6">
          <div className="rounded-lg border border-table-border bg-gray-50 py-6 text-center">
            <p className="text-sm text-muted-foreground">No parts salvaged yet for this vehicle.</p>
          </div>
        </InfoCard>
      </div>
    </>
  )
}
