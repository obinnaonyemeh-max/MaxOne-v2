import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import "leaflet/dist/leaflet.css"

import type { BatteryLocation, BatteryAlert } from "@/data/mockBatteryData"

const falconBatteryIcon = new L.Icon({
  iconUrl: "/images/falcon_battery.svg",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

interface BatteryMapProps {
  locations: BatteryLocation[]
  alerts: BatteryAlert[]
  avgSOH: number
  activeBatteries: number
  className?: string
}

export function BatteryMap({
  locations,
  alerts,
  avgSOH,
  activeBatteries,
  className,
}: BatteryMapProps) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0)

  const center: [number, number] = [6.5244, 3.3792]

  const handlePrevAlert = () => {
    setCurrentAlertIndex((prev) => (prev === 0 ? alerts.length - 1 : prev - 1))
  }

  const handleNextAlert = () => {
    setCurrentAlertIndex((prev) => (prev === alerts.length - 1 ? 0 : prev + 1))
  }

  const currentAlert = alerts[currentAlertIndex]

  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg overflow-hidden p-2",
        className
      )}
    >
      <div className="relative rounded-lg overflow-hidden" style={{ height: "400px" }}>
        {/* Left Stats Panel with Frosted Glass Effect */}
        <div
          className="absolute left-4 top-4 z-[1000] rounded-lg p-4"
          style={{
            minWidth: "240px",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <h3
            className="text-gray-950 mb-3"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Battery Map
          </h3>
          <div className="mb-3">
            <span
              className="block text-gray-500 mb-0.5"
              style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase" }}
            >
              AVG SOH
            </span>
            <span
              className="text-gray-950"
              style={{ fontSize: "15px", fontWeight: 500 }}
            >
              {avgSOH}%
            </span>
          </div>
          <div>
            <span
              className="block text-gray-500 mb-0.5"
              style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase" }}
            >
              ACTIVE BATTERIES
            </span>
            <span
              className="text-gray-950"
              style={{ fontSize: "15px", fontWeight: 500 }}
            >
              {activeBatteries.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bottom Right Alerts Panel */}
        <div
          className="absolute right-4 bottom-4 z-[1000] rounded-lg p-4"
          style={{
            width: "356px",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-gray-700"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {alerts.length} alerts detected
            </span>
            <img
              src="/images/alert_icon.svg"
              alt="Alert"
              className="h-5 w-5"
            />
          </div>

          {currentAlert && (
            <div className="border-t pt-3" style={{ borderColor: "#d8d8d8" }}>
              <h4
                className="text-gray-950 mb-1"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                {currentAlert.title}
              </h4>
              <div className="flex items-end justify-between gap-2">
                <p
                  className="text-gray-500 flex-1"
                  style={{ fontSize: "12px", lineHeight: 1.5 }}
                >
                  {currentAlert.description}
                </p>
                {alerts.length > 1 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handlePrevAlert}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={handleNextAlert}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={falconBatteryIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">{location.id}</p>
                  <p>SOH: {location.soh}%</p>
                  <p>State: {location.state}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
