import { useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "leaflet/dist/leaflet.css"
import type { ChargeStop } from "@/data/mockChargerData"

interface ChargeStopsCardProps {
  chargeStops: ChargeStop[]
  onViewAllClick?: () => void
  className?: string
}

function HexagonPattern() {
  const rows = 8
  const cols = 12
  const hexSize = 18
  const hexHeight = hexSize * Math.sqrt(3)
  
  const hexagons: { x: number; y: number; opacity: number }[] = []
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5
      const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0)
      const distFromCenter = Math.sqrt(
        Math.pow(col - cols / 2, 2) + Math.pow(row - rows / 2, 2)
      )
      const maxDist = Math.sqrt(Math.pow(cols / 2, 2) + Math.pow(rows / 2, 2))
      const opacity = Math.max(0.1, 1 - distFromCenter / maxDist) * 0.7
      
      hexagons.push({ x, y, opacity })
    }
  }
  
  return (
    <svg 
      viewBox={`0 0 ${cols * hexSize * 1.5 + hexSize} ${rows * hexHeight + hexHeight}`}
      className="w-full h-full"
      style={{ minHeight: "180px" }}
    >
      {hexagons.map((hex, i) => (
        <polygon
          key={i}
          points={getHexPoints(hex.x + hexSize / 2, hex.y + hexHeight / 2, hexSize * 0.45)}
          fill="var(--color-brand-primary)"
          opacity={hex.opacity}
          stroke="white"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

function getHexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return points.join(" ")
}

export function ChargeStopsCard({
  chargeStops,
  onViewAllClick,
  className,
}: ChargeStopsCardProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  
  const hasStops = chargeStops.length > 0
  const currentStop = chargeStops[currentStopIndex]
  
  const center = hasStops 
    ? { lat: chargeStops[0].coordinates.lat, lng: chargeStops[0].coordinates.lng }
    : { lat: 6.5244, lng: 3.3792 }

  const handlePrevStop = () => {
    setCurrentStopIndex((prev) => (prev === 0 ? chargeStops.length - 1 : prev - 1))
  }

  const handleNextStop = () => {
    setCurrentStopIndex((prev) => (prev === chargeStops.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={className}>
      <div className="bg-gray-25 border border-gray-200 rounded-lg overflow-hidden p-2">
        <div className="relative rounded-lg overflow-hidden" style={{ height: "320px" }}>
          {/* Top-Left Title Panel with Frosted Glass Effect */}
          <div
            className="absolute left-4 top-4 z-[1000] rounded-lg p-4"
            style={{
              minWidth: "160px",
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <h3
              className="text-gray-950"
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              Charge Stops
            </h3>
          </div>

          {/* Top-Right View All Button with Frosted Glass Effect */}
          <div
            className="absolute right-4 top-4 z-[1000] rounded-lg px-4 py-3"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <button
              onClick={onViewAllClick}
              className="hover:underline"
              style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
            >
              VIEW ALL CHARGE STOPS
            </button>
          </div>

          {/* Bottom-Right Location Panel with Frosted Glass Effect */}
          <div
            className="absolute right-4 bottom-4 z-[1000] rounded-lg p-4"
            style={{
              width: "280px",
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            {/* Count Header - matching BatteryMap alerts style */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-gray-700"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                {chargeStops.length} Charge stop{chargeStops.length !== 1 ? "s" : ""}
              </span>
              <img
                src="/images/alert_icon.svg"
                alt="Charge Stops"
                className="h-5 w-5"
              />
            </div>

            {currentStop ? (
              <div className="border-t pt-3" style={{ borderColor: "#d8d8d8" }}>
                <h4
                  className="text-gray-950 mb-1"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  {currentStop.address.split(",")[0]}
                </h4>
                <p
                  className="text-gray-500 mb-2"
                  style={{ fontSize: "12px", lineHeight: 1.4 }}
                >
                  {currentStop.address.split(",").slice(1).join(",").trim()}
                </p>
                <div className="flex items-end justify-between gap-2">
                  <p
                    style={{ fontSize: "11px", color: "#E88E15" }}
                  >
                    {currentStop.coordinates.lat.toFixed(6)}, {currentStop.coordinates.lng.toFixed(6)}
                  </p>
                  {chargeStops.length > 1 && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handlePrevStop}
                        className="p-1 rounded hover:bg-gray-100/50 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={handleNextStop}
                        className="p-1 rounded hover:bg-gray-100/50 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t pt-3" style={{ borderColor: "#d8d8d8" }}>
                <p className="text-gray-500" style={{ fontSize: "13px" }}>
                  No charge stops recorded
                </p>
              </div>
            )}
          </div>

          {/* Hexagonal Pattern Overlay */}
          <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center">
            <div className="w-3/4 h-3/4">
              <HexagonPattern />
            </div>
          </div>

          {/* Map */}
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%", borderRadius: "8px" }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {chargeStops.map((stop) => (
              <CircleMarker
                key={stop.id}
                center={[stop.coordinates.lat, stop.coordinates.lng]}
                radius={8}
                fillColor="var(--color-brand-primary)"
                fillOpacity={0.8}
                stroke={true}
                color="white"
                weight={2}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{stop.address}</p>
                    <p className="text-gray-500 text-xs mt-1">{stop.timestamp}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
