import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/max/AppLayout"
import DashboardPage from "@/pages/DashboardPage"
import VehiclesPage from "@/pages/VehiclesPage"
import VehicleDetailsPage from "@/pages/VehicleDetailsPage"
import AssetMovementPage from "@/pages/AssetMovementPage"
import GrowthActivationPage from "@/pages/GrowthActivationPage"
import MCPManagementPage from "@/pages/MCPManagementPage"
import InboundPage from "@/pages/InboundPage"
import BatchDetailsPage from "@/pages/BatchDetailsPage"

export default function App() {
  return (
    <AppLayout>
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
      </Routes>
    </AppLayout>
  )
}
