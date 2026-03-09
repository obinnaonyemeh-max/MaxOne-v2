import { Routes, Route, Navigate } from "react-router-dom"
import VehiclesPage from "@/pages/VehiclesPage"
import VehicleDetailsPage from "@/pages/VehicleDetailsPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehicles" replace />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
    </Routes>
  )
}
