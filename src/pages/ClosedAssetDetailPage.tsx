import { useParams, useNavigate } from "react-router-dom"

import {
  TopBar,
  BackButton,
  StatusBadge,
  InfoCard,
  InfoGrid,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { mockClosedAssets, methodVariantMap } from "@/pages/ClosedAssetsPage"

export default function ClosedAssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const record = mockClosedAssets.find((r) => r.assetId === id)

  if (!record) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Closed Assets" }]} />
        <div className="px-6 py-12 text-center text-muted-foreground">Record not found.</div>
      </>
    )
  }

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Closed Assets" }, { label: record.assetId }]}
      />
      <header className="px-6 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate("/closed-assets")} />
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
            {record.assetId}
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
        </div>
        <p className="mt-1 text-sm font-medium text-breadcrumb-root">
          Closed asset detail
        </p>
      </header>

      <div className="px-6 flex flex-col flex-1 min-h-0 overflow-y-auto pb-8">
        <div className="grid grid-cols-2 gap-2">
          <StatCard title="Recovery Value" value={record.recoveryValue} indicatorColor="var(--color-gray-400)" />
          <StatCard title="Write-Off Amount" value={record.writeOffAmount} indicatorColor="var(--color-gray-400)" />
        </div>

        <InfoCard title="Vehicle Details" className="mt-6">
          <InfoGrid
            columns={2}
            showDividers
            items={[
              { label: "Vehicle Model", value: record.vehicleModel },
              { label: "Manufacturer", value: record.manufacturer },
              { label: "Plate Number", value: record.plateNumber },
              { label: "Location", value: record.location },
              {
                label: "Disposal Method",
                value: (
                  <StatusBadge variant={methodVariantMap[record.disposalMethod] || "default"}>
                    {record.disposalMethod}
                  </StatusBadge>
                ),
              },
              { label: "Disposal Date", value: record.disposalDate },
              { label: "Closed By", value: record.closedBy },
            ]}
          />
        </InfoCard>
      </div>
    </>
  )
}
