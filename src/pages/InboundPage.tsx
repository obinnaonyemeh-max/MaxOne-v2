import { useLocation } from "react-router-dom"

import { TopBar, PageHeader } from "@/components/max"
import InboundDashboardPage from "@/pages/InboundDashboardPage"
import StockSetupPage from "@/pages/StockSetupPage"
import BatchesPage from "@/pages/BatchesPage"

const tabLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "stock-setup": "Stock Setup",
  batches: "Batches",
}

export default function InboundPage() {
  const location = useLocation()
  const pathTab = location.pathname.split("/").pop() || "dashboard"
  const activeTab = ["dashboard", "stock-setup", "batches"].includes(pathTab)
    ? pathTab
    : "dashboard"

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/dashboard" },
          { label: tabLabels[activeTab] },
        ]}
      />
      <PageHeader
        title={tabLabels[activeTab]}
        subtitle="Vehicle pipeline from production to activation"
        className="shrink-0"
      />

      <div className="flex-1 flex flex-col min-h-0 px-6">
        {activeTab === "dashboard" && <InboundDashboardPage />}
        {activeTab === "stock-setup" && <StockSetupPage />}
        {activeTab === "batches" && <BatchesPage />}
      </div>
    </>
  )
}
