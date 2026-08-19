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
import SubBatchDetailsPage from "@/pages/SubBatchDetailsPage"
import RefurbishmentPage from "@/pages/RefurbishmentPage"
import ServiceSchedulePage from "@/pages/ServiceSchedulePage"
import DisposalManagementPage from "@/pages/DisposalManagementPage"
import AuctionPage from "@/pages/AuctionPage"
import CreateAuctionPage from "@/pages/create-auction/CreateAuctionPage"
import AuctionDetailPage from "@/pages/AuctionDetailPage"
import AuctionVehicleDetailPage from "@/pages/AuctionVehicleDetailPage"
import ConversionRequestPage from "@/pages/ConversionRequestPage"
import ScrapManagementPage from "@/pages/ScrapManagementPage"
import ScrapDetailPage from "@/pages/ScrapDetailPage"
import ClosedAssetsPage from "@/pages/ClosedAssetsPage"
import ClosedAssetDetailPage from "@/pages/ClosedAssetDetailPage"
import AllTransferPage from "@/pages/AllTransferPage"
import TransferDetailPage from "@/pages/TransferDetailPage"
import KitReportsPage from "@/pages/KitReportsPage"
import KitAssignmentPage from "@/pages/kit-assignment/KitAssignmentPage"
import ActivationReadinessPage from "@/pages/ActivationReadinessPage"
import VehicleDocumentsPage from "@/pages/VehicleDocumentsPage"
import Champion360Page from "@/pages/Champion360Page"
import ChampionDetailPage from "@/pages/ChampionDetailPage"
import TicketManagementPage from "@/pages/TicketManagementPage"
import CreateTicketPage from "@/pages/CreateTicketPage"
import DriverSafetyScorePage from "@/pages/DriverSafetyScorePage"
import WelfarePage from "@/pages/WelfarePage"
import PerformancePage from "@/pages/PerformancePage"
import BatteriesDashboardPage from "@/pages/BatteriesDashboardPage"
import BatteryRegisterPage from "@/pages/battery-register/BatteryRegisterPage"
import BatteryDetailsPage from "@/pages/battery-register/BatteryDetailsPage"
import ChargerRegisterPage from "@/pages/charger-register/ChargerRegisterPage"
import ChargerDetailsPage from "@/pages/charger-register/ChargerDetailsPage"
import ChargeSpotsPage from "@/pages/charger-register/ChargeSpotsPage"
import PortfolioDashboardPage from "@/pages/PortfolioDashboardPage"
import ChampionsOverviewPage from "@/pages/portfolio/ChampionsOverviewPage"
import ReferralManagementPage from "@/pages/portfolio/ReferralManagementPage"
import BlacklistPage from "@/pages/portfolio/BlacklistPage"
import AllCollectionsPage from "@/pages/portfolio/AllCollectionsPage"
import VehicleRegisterPage from "@/pages/vehicle-register/VehicleRegisterPage"
import VehicleActivityPage from "@/pages/vehicle-activity/VehicleActivityPage"
import VehicleTripsPage from "@/pages/vehicle-trips/VehicleTripsPage"
import VehicleStopsPage from "@/pages/vehicle-stops/VehicleStopsPage"
import TamperAlertsPage from "@/pages/falcon-alerts/TamperAlertsPage"
import TamperAlertDetailPage from "@/pages/falcon-alerts/TamperAlertDetailPage"
import GeofencesPage from "@/pages/geofences/GeofencesPage"
import VisitHistoryPage from "@/pages/geofences/VisitHistoryPage"
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
        <Route path="/inbound" element={<Navigate to="/inbound/batches" replace />} />
        <Route path="/inbound/dashboard" element={<Navigate to="/inbound/batches" replace />} />
        <Route path="/inbound/stock-setup" element={<InboundPage />} />
        <Route path="/inbound/batches" element={<InboundPage />} />
        <Route path="/inbound/batches/:id" element={<BatchDetailsPage />} />
        <Route path="/inbound/batches/:batchId/sub-batches/:subBatchId" element={<SubBatchDetailsPage />} />
        <Route path="/refurbishment" element={<RefurbishmentPage />} />
        <Route path="/service-schedule" element={<ServiceSchedulePage />} />
        <Route path="/disposal-management" element={<DisposalManagementPage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/auction/create" element={<CreateAuctionPage />} />
        <Route path="/auction/:id" element={<AuctionDetailPage />} />
        <Route path="/auction/:id/vehicle/:vehicleId" element={<AuctionVehicleDetailPage />} />
        <Route path="/conversion-request" element={<ConversionRequestPage />} />
        <Route path="/scrap-management" element={<ScrapManagementPage />} />
        <Route path="/scrap-management/:id" element={<ScrapDetailPage />} />
        <Route path="/closed-assets" element={<ClosedAssetsPage />} />
        <Route path="/closed-assets/:id" element={<ClosedAssetDetailPage />} />
        <Route path="/transfer/all" element={<AllTransferPage />} />
        <Route path="/transfer/all/:id" element={<TransferDetailPage />} />
        <Route path="/activation-assignment/asset-reassignment/kit" element={<KitReportsPage />} />
        <Route path="/activation-assignment/asset-reassignment/kit/assign" element={<KitAssignmentPage />} />
        <Route path="/activation/readiness" element={<ActivationReadinessPage />} />
        <Route path="/vehicle-document" element={<VehicleDocumentsPage />} />
        <Route path="/champion-360" element={<Champion360Page />} />
        <Route path="/champion-360/:id" element={<ChampionDetailPage />} />
        <Route path="/ticket-management" element={<TicketManagementPage />} />
        <Route path="/ticket-management/create" element={<CreateTicketPage />} />
        <Route path="/driver-safety-score" element={<DriverSafetyScorePage />} />
        <Route path="/welfare" element={<WelfarePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/falcon/batteries/dashboard" element={<BatteriesDashboardPage />} />
        <Route path="/falcon/batteries/register" element={<BatteryRegisterPage />} />
        <Route path="/falcon/batteries/:id" element={<BatteryDetailsPage />} />
        <Route path="/falcon/ev-chargers" element={<ChargerRegisterPage />} />
        <Route path="/falcon/ev-chargers/:id/charge-spots" element={<ChargeSpotsPage />} />
        <Route path="/falcon/ev-chargers/:id" element={<ChargerDetailsPage />} />
        <Route path="/falcon/alerts/tamper" element={<TamperAlertsPage />} />
        <Route path="/falcon/alerts/tamper/:id" element={<TamperAlertDetailPage />} />
        <Route path="/falcon/geofences" element={<GeofencesPage />} />
        <Route path="/falcon/geofences/visit-history" element={<VisitHistoryPage />} />
        <Route path="/falcon/vehicle-register" element={<VehicleRegisterPage />} />
        <Route path="/falcon/vehicle-register/:id/activity" element={<VehicleActivityPage />} />
        <Route path="/falcon/vehicle-register/:id/trips" element={<VehicleTripsPage />} />
        <Route path="/falcon/vehicle-register/:id/stops" element={<VehicleStopsPage />} />
        <Route path="/portfolio" element={<Navigate to="/portfolio/dashboard" replace />} />
        <Route path="/portfolio/dashboard" element={<PortfolioDashboardPage />} />
        <Route path="/portfolio/champions/overview" element={<ChampionsOverviewPage />} />
        <Route path="/portfolio/champions/overview/:id" element={<ChampionDetailPage />} />
        <Route path="/portfolio/champions/referrals" element={<ReferralManagementPage />} />
        <Route path="/portfolio/champions/blacklist" element={<BlacklistPage />} />
        <Route path="/portfolio/collections/all" element={<AllCollectionsPage />} />
        <Route path="/driver-experience/dashboard" element={<DriverExperienceDashboardPage />} />
        <Route path="/driver-experience/approvals" element={<ApprovalsPage />} />
      </Routes>
    </AppLayout>
  )
}
