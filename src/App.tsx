import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/max/AppLayout"
import DashboardPage from "@/pages/DashboardPage"
import VehiclesPage from "@/pages/VehiclesPage"
import VehicleDetailsPage from "@/pages/VehicleDetailsPage"
import AssetMovementPage from "@/pages/AssetMovementPage"
import GrowthActivationPage from "@/pages/GrowthActivationPage"
import MCPManagementPage from "@/pages/MCPManagementPage"

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
      </Routes>
    </AppLayout>
  )
}
