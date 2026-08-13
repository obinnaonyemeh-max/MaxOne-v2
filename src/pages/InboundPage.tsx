import { useLocation } from "react-router-dom"

import { TopBar, PageHeader } from "@/components/max"
import StockSetupPage from "@/pages/StockSetupPage"
import BatchesPage from "@/pages/BatchesPage"

const tabLabels: Record<string, string> = {
  "stock-setup": "Vehicle Master Data",
  batches: "Batches",
}

export default function InboundPage() {
  const location = useLocation()
  const pathTab = location.pathname.split("/").pop() || "batches"
  const activeTab = ["stock-setup", "batches"].includes(pathTab)
    ? pathTab
    : "batches"

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/batches" },
          { label: tabLabels[activeTab] },
        ]}
      />
      <PageHeader
        title={tabLabels[activeTab]}
        subtitle="Vehicle pipeline from production to activation"
        className="shrink-0"
      />

      <div className="flex-1 flex flex-col min-h-0 px-6">
        {activeTab === "batches" && <BatchesPage />}
        {activeTab === "stock-setup" && <StockSetupPage />}
      </div>
    </>
  )
}
