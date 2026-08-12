import { Routes, Route, Navigate } from "react-router-dom"
import { Agentation } from "agentation"
import { AppLayout } from "@/components/max/AppLayout"
import DashboardPage from "@/pages/DashboardPage"
import VehiclesPage from "@/pages/VehiclesPage"
import VehicleDetailsPage from "@/pages/VehicleDetailsPage"
import AssetMovementPage from "@/pages/AssetMovementPage"
import GrowthActivationPage from "@/pages/GrowthActivationPage"
import MCPManagementPage from "@/pages/MCPManagementPage"
import InboundPage from "@/pages/InboundPage"
import BatchDetailsPage from "@/pages/BatchDetailsPage"
import RefurbishmentPage from "@/pages/RefurbishmentPage"
import ServiceSchedulePage from "@/pages/ServiceSchedulePage"
import DisposalManagementPage from "@/pages/DisposalManagementPage"
import ConversionRequestPage from "@/pages/ConversionRequestPage"
import ScrapManagementPage from "@/pages/ScrapManagementPage"
import ScrapDetailPage from "@/pages/ScrapDetailPage"
import ClosedAssetsPage from "@/pages/ClosedAssetsPage"
import ClosedAssetDetailPage from "@/pages/ClosedAssetDetailPage"
import AllTransferPage from "@/pages/AllTransferPage"
import TransferDetailPage from "@/pages/TransferDetailPage"
import ActivationReadinessPage from "@/pages/ActivationReadinessPage"
import Champion360Page from "@/pages/Champion360Page"
import ChampionDetailPage from "@/pages/ChampionDetailPage"
import TicketManagementPage from "@/pages/TicketManagementPage"
import CreateTicketPage from "@/pages/CreateTicketPage"
import DriverSafetyScorePage from "@/pages/DriverSafetyScorePage"
import WelfarePage from "@/pages/WelfarePage"
import PerformancePage from "@/pages/PerformancePage"
import ApprovalsPage from "@/pages/ApprovalsPage"
import DriverExperienceDashboardPage from "@/pages/DriverExperienceDashboardPage"

export default function App() {
  return (
    <AppLayout>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fleet-register" element={<VehiclesPage />} />
        <Route path="/fleet-register/:id" element={<VehicleDetailsPage />} />
        <Route path="/asset-movement" element={<AssetMovementPage />} />
        <Route path="/asset-movement/:id" element={<VehicleDetailsPage />} />
        <Route path="/growth-activation" element={<GrowthActivationPage />} />
        <Route path="/mcp-management" element={<MCPManagementPage />} />
        <Route path="/inbound" element={<Navigate to="/inbound/dashboard" replace />} />
        <Route path="/inbound/dashboard" element={<InboundPage />} />
        <Route path="/inbound/stock-setup" element={<InboundPage />} />
        <Route path="/inbound/batches" element={<InboundPage />} />
        <Route path="/inbound/batches/:id" element={<BatchDetailsPage />} />
        <Route path="/refurbishment" element={<RefurbishmentPage />} />
        <Route path="/service-schedule" element={<ServiceSchedulePage />} />
        <Route path="/disposal-management" element={<DisposalManagementPage />} />
        <Route path="/conversion-request" element={<ConversionRequestPage />} />
        <Route path="/scrap-management" element={<ScrapManagementPage />} />
        <Route path="/scrap-management/:id" element={<ScrapDetailPage />} />
        <Route path="/closed-assets" element={<ClosedAssetsPage />} />
        <Route path="/closed-assets/:id" element={<ClosedAssetDetailPage />} />
        <Route path="/transfer/all" element={<AllTransferPage />} />
        <Route path="/transfer/all/:id" element={<TransferDetailPage />} />
        <Route path="/activation/readiness" element={<ActivationReadinessPage />} />
        <Route path="/champion-360" element={<Champion360Page />} />
        <Route path="/champion-360/:id" element={<ChampionDetailPage />} />
        <Route path="/ticket-management" element={<TicketManagementPage />} />
        <Route path="/ticket-management/create" element={<CreateTicketPage />} />
        <Route path="/driver-safety-score" element={<DriverSafetyScorePage />} />
        <Route path="/welfare" element={<WelfarePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/driver-experience/dashboard" element={<DriverExperienceDashboardPage />} />
        <Route path="/driver-experience/approvals" element={<ApprovalsPage />} />
      </Routes>
    </AppLayout>
  )
}
