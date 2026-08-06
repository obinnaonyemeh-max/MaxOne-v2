import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const batteryMarkerIcon = new L.Icon({
  iconUrl: "/images/falcon_battery.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface BatteryLocationCardProps {
  location: { lat: number; lng: number }
  lastSeen: string
  lastPinged: string
}

export function BatteryLocationCard({
  location,
  lastSeen,
  lastPinged,
}: BatteryLocationCardProps) {
  return (
    <div className="bg-gray-25 border border-gray-200 rounded-lg overflow-hidden p-2">
      <div className="relative rounded-lg overflow-hidden h-full">
        {/* Frosted Glass Info Panel */}
        <div
          className="absolute left-4 top-4 z-[1000] rounded-lg p-4"
          style={{
            minWidth: "200px",
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
            Battery location
          </h3>
          <div className="mb-3">
            <span
              className="block text-gray-500 mb-0.5"
              style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase" }}
            >
              Last Seen
            </span>
            <span
              className="text-gray-950"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {lastSeen}
            </span>
          </div>
          <div>
            <span
              className="block text-gray-500 mb-0.5"
              style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase" }}
            >
              Last Pinged On
            </span>
            <span
              className="text-gray-950"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {lastPinged}
            </span>
          </div>
        </div>

        {/* Map */}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%", borderRadius: "8px", minHeight: "320px" }}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]} icon={batteryMarkerIcon} />
        </MapContainer>
      </div>
    </div>
  )
}
