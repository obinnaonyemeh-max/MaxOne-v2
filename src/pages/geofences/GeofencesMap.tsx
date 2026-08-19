import { Fragment, useEffect } from "react"
import { MapContainer, TileLayer, Circle, Polygon, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  geofenceCenter,
  defaultGeofenceCenter,
  type Geofence,
  type GeofenceType,
} from "@/data/mockGeofences"
import { mockVehicleRegisterItems } from "@/data/mockVehicleRegister"
import type { VehicleType, VehicleCategory } from "@/data/mockVehicleRegister"

interface GeofencesMapProps {
  geofences: Geofence[]
  selectedId: string | null
  showVehicles: boolean
  onSelect: (id: string) => void
  onViewVisitHistory: () => void
  className?: string
}

const vehicleIconCache = new Map<string, L.Icon>()

function vehicleIcon(vehicleType: VehicleType, category: VehicleCategory): L.Icon {
  const key = `${vehicleType}-${category}`
  const cached = vehicleIconCache.get(key)
  if (cached) return cached
  const prefix =
    vehicleType === "2 Wheeler" ? "2_wheeler" : vehicleType === "3 Wheeler" ? "3_wheeler" : "4_wheeler"
  const suffix = category === "ev" ? "_ev" : ""
  const icon = new L.Icon({
    iconUrl: `/images/${prefix}${suffix}.svg`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
  vehicleIconCache.set(key, icon)
  return icon
}

// Ring colour follows the geofence type (matching the list badges/chips).
const TYPE_COLOR: Record<GeofenceType, { stroke: string; fill: string }> = {
  city: { stroke: "#2563EB", fill: "#3B82F6" },
  station: { stroke: "#16A34A", fill: "#22C55E" },
  office: { stroke: "#EA580C", fill: "#F97316" },
}

function boundaryStyle(type: GeofenceType, isSelected: boolean) {
  const c = TYPE_COLOR[type]
  return {
    color: c.stroke,
    weight: isSelected ? 3 : 2,
    fillColor: c.fill,
    fillOpacity: isSelected ? 0.08 : 0.05,
  }
}

function GeofenceTooltip({ geofence }: { geofence: Geofence }) {
  const rows: [string, string][] = [
    ["Number of Vehicles", geofence.metrics.vehicleCount.toLocaleString()],
    ["Average Duration", geofence.metrics.avgDuration],
    ["Active Alerts", geofence.metrics.activeAlerts.toLocaleString()],
  ]
  return (
    <Tooltip direction="top" sticky opacity={1} className="geofence-tooltip">
      <div className="min-w-[180px]">
        <p
          className="text-white mb-2"
          style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          {geofence.name}
        </p>
        <div className="flex flex-col gap-1">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-6">
              <span className="text-gray-300" style={{ fontSize: "13px" }}>
                {label}
              </span>
              <span className="text-white font-medium" style={{ fontSize: "13px" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Tooltip>
  )
}

// Bounds that tightly enclose a geofence, so fly-to *fits* (enlarges) it.
function geofenceBounds(gf: Geofence): L.LatLngBounds {
  if (gf.shape.kind === "circle") {
    return L.latLng(gf.shape.center.lat, gf.shape.center.lng).toBounds(gf.shape.radius * 2)
  }
  return L.latLngBounds(gf.shape.points.map((p) => [p.lat, p.lng] as [number, number]))
}

function VehicleTooltip({ plateNumber, duration }: { plateNumber: string; duration: string }) {
  return (
    <Tooltip direction="top" opacity={1} className="geofence-tooltip">
      <div className="min-w-[190px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-300" style={{ fontSize: "13px" }}>Vehicle Id</span>
            <span className="text-white font-medium" style={{ fontSize: "13px" }}>{plateNumber}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-300" style={{ fontSize: "13px" }}>Duration of visit</span>
            <span className="text-white font-medium" style={{ fontSize: "13px" }}>{duration}</span>
          </div>
        </div>
        <div className="mt-2 text-right">
          <span className="text-blue-400 font-medium" style={{ fontSize: "12px" }}>
            View visit history
          </span>
        </div>
      </div>
    </Tooltip>
  )
}

function MapController({ geofences, selectedId }: { geofences: Geofence[]; selectedId: string | null }) {
  const map = useMap()

  useEffect(() => {
    const selected = geofences.find((g) => g.id === selectedId)
    if (selected) {
      // Fit the geofence's extent so it fills the view (gets bigger, not smaller).
      map.flyToBounds(geofenceBounds(selected), { padding: [50, 50], maxZoom: 16, duration: 0.6 })
    }
  }, [map, selectedId, geofences])

  useEffect(() => {
    if (selectedId || geofences.length === 0) return
    const centers = geofences.map(geofenceCenter)
    const lats = centers.map((c) => c.lat)
    const lngs = centers.map((c) => c.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [60, 60] })
  }, [map, geofences, selectedId])

  return null
}

export function GeofencesMap({
  geofences,
  selectedId,
  showVehicles,
  onSelect,
  onViewVisitHistory,
  className,
}: GeofencesMapProps) {
  const first = geofences[0] ? geofenceCenter(geofences[0]) : defaultGeofenceCenter

  return (
    <div className={className}>
      <MapContainer
        center={[first.lat, first.lng]}
        zoom={11}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController geofences={geofences} selectedId={selectedId} />

        {geofences.map((gf) => {
          const isSelected = gf.id === selectedId
          const style = boundaryStyle(gf.type, isSelected)
          const handlers = { click: () => onSelect(gf.id) }

          return (
            <Fragment key={gf.id}>
              {gf.shape.kind === "circle" ? (
                <Circle
                  center={[gf.shape.center.lat, gf.shape.center.lng]}
                  radius={gf.shape.radius}
                  pathOptions={style}
                  eventHandlers={handlers}
                >
                  <GeofenceTooltip geofence={gf} />
                </Circle>
              ) : (
                <Polygon
                  positions={gf.shape.points.map((p) => [p.lat, p.lng] as [number, number])}
                  pathOptions={style}
                  eventHandlers={handlers}
                >
                  <GeofenceTooltip geofence={gf} />
                </Polygon>
              )}
            </Fragment>
          )
        })}

        {/* Vehicle layer — toggled on from the panel control */}
        {showVehicles &&
          mockVehicleRegisterItems.map((v, i) => (
            <Marker
              key={v.id}
              position={[v.coordinates.lat, v.coordinates.lng]}
              icon={vehicleIcon(v.vehicleType, v.category)}
              opacity={0.9}
              eventHandlers={{ click: onViewVisitHistory }}
            >
              <VehicleTooltip plateNumber={v.plateNumber} duration={`${80 + (i % 5) * 20} mins`} />
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
