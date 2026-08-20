import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { RecoverySession, RecoveryVehicleType } from "@/data/mockRecoveries"

interface RecoveryActiveMapProps {
  sessions: RecoverySession[]
  selectedSessionId: string | null
  onSelectSession: (sessionId: string) => void
  className?: string
}

function getIconUrl(vehicleType: RecoveryVehicleType): string {
  const prefix =
    vehicleType === "Two-Wheeler" ? "2_wheeler" : vehicleType === "Three-Wheeler" ? "3_wheeler" : "4_wheeler"
  return `/images/${prefix}.svg`
}

function createIcon(vehicleType: RecoveryVehicleType, isSelected: boolean): L.Icon {
  const size = isSelected ? 44 : 32
  const anchor = size / 2
  return new L.Icon({
    iconUrl: getIconUrl(vehicleType),
    iconSize: [size, size],
    iconAnchor: [anchor, size],
    popupAnchor: [0, -size],
    className: isSelected ? "vehicle-marker-selected" : "vehicle-marker-default",
  })
}

const iconCache = new Map<string, L.Icon>()

function getMarkerIcon(vehicleType: RecoveryVehicleType, isSelected: boolean): L.Icon {
  const cacheKey = `${vehicleType}-${isSelected}`
  if (!iconCache.has(cacheKey)) {
    iconCache.set(cacheKey, createIcon(vehicleType, isSelected))
  }
  return iconCache.get(cacheKey)!
}

function MapController({
  sessions,
  selectedSessionId,
}: {
  sessions: RecoverySession[]
  selectedSessionId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const selected = sessions.find((s) => s.id === selectedSessionId)
    if (selected) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 14, { duration: 0.6 })
    }
  }, [map, selectedSessionId, sessions])

  useEffect(() => {
    if (sessions.length === 0) return
    if (selectedSessionId) return

    const lats = sessions.map((s) => s.coordinates.lat)
    const lngs = sessions.map((s) => s.coordinates.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, sessions, selectedSessionId])

  return null
}

export function RecoveryActiveMap({
  sessions,
  selectedSessionId,
  onSelectSession,
  className,
}: RecoveryActiveMapProps) {
  const center = sessions[0]
    ? ([sessions[0].coordinates.lat, sessions[0].coordinates.lng] as [number, number])
    : ([9.0765, 7.3986] as [number, number])

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController sessions={sessions} selectedSessionId={selectedSessionId} />

        {sessions.map((session) => {
          const isSelected = selectedSessionId === session.id
          return (
            <Marker
              key={session.id}
              position={[session.coordinates.lat, session.coordinates.lng]}
              icon={getMarkerIcon(session.vehicleType, isSelected)}
              opacity={isSelected ? 1 : 0.85}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => onSelectSession(session.id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
