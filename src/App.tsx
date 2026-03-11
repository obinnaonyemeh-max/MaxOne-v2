import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import VehiclesPage from "@/pages/VehiclesPage"
import VehicleDetailsPage from "@/pages/VehicleDetailsPage"
import AssetMovementPage from "@/pages/AssetMovementPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fleet-register" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/fleet-register" element={<VehiclesPage />} />
      <Route path="/fleet-register/:id" element={<VehicleDetailsPage />} />
      <Route path="/asset-movement" element={<AssetMovementPage />} />
      <Route path="/asset-movement/:id" element={<VehicleDetailsPage />} />
    </Routes>
  )
}
