import { useEffect, useMemo } from "react"
import { MapContainer, Marker, Polygon, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  getVehicleMarkerIcon,
  type VehicleStop,
} from "@/data/mockVehicleActivity"
import type { VehicleCategory, VehicleType } from "@/data/mockVehicleRegister"

interface VehicleStopsMapProps {
  stops: VehicleStop[]
  selectedStopId: string | null
  onSelectStop: (stopId: string) => void
  vehicleType: VehicleType
  category: VehicleCategory
  className?: string
}

const HEX_SIZE = 0.0038

interface HexBin {
  key: string
  q: number
  r: number
  count: number
  stopIds: string[]
  vertices: [number, number][]
}

function hexRound(q: number, r: number): { q: number; r: number } {
  const s = -q - r
  let rq = Math.round(q)
  let rr = Math.round(r)
  let rs = Math.round(s)
  const qDiff = Math.abs(rq - q)
  const rDiff = Math.abs(rr - r)
  const sDiff = Math.abs(rs - s)
  if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs
  else if (rDiff > sDiff) rr = -rq - rs
  return { q: rq, r: rr }
}

function latLngToHex(lat: number, lng: number): { q: number; r: number } {
  const q = ((2 / 3) * lng) / HEX_SIZE
  const r = ((-1 / 3) * lng + (Math.sqrt(3) / 3) * lat) / HEX_SIZE
  return hexRound(q, r)
}

function hexCenter(q: number, r: number): { lat: number; lng: number } {
  return {
    lng: HEX_SIZE * (1.5 * q),
    lat: HEX_SIZE * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r),
  }
}

function hexVertices(q: number, r: number): [number, number][] {
  const center = hexCenter(q, r)
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30)
    return [
      center.lat + HEX_SIZE * Math.sin(angle),
      center.lng + HEX_SIZE * Math.cos(angle),
    ] as [number, number]
  })
}

function binStops(stops: VehicleStop[]): HexBin[] {
  const bins = new Map<string, HexBin>()
  for (const stop of stops) {
    const { q, r } = latLngToHex(stop.lat, stop.lng)
    const key = `${q},${r}`
    const existing = bins.get(key)
    if (existing) {
      existing.count += 1
      existing.stopIds.push(stop.id)
    } else {
      bins.set(key, {
        key,
        q,
        r,
        count: 1,
        stopIds: [stop.id],
        vertices: hexVertices(q, r),
      })
    }
  }
  return Array.from(bins.values())
}

function hexColor(count: number, maxCount: number): { color: string; fillOpacity: number } {
  const t = maxCount <= 0 ? 0 : count / maxCount
  if (t > 0.7) return { color: "#3F4A1E", fillOpacity: 0.78 }
  if (t > 0.4) return { color: "#6B7A32", fillOpacity: 0.55 }
  if (t > 0.2) return { color: "#9CA36A", fillOpacity: 0.4 }
  return { color: "#D1D5DB", fillOpacity: 0.32 }
}

function createVehicleIcon(vehicleType: VehicleType, category: VehicleCategory): L.Icon {
  return new L.Icon({
    iconUrl: getVehicleMarkerIcon(vehicleType, category),
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -44],
  })
}

function MapController({
  stops,
  selectedStopId,
}: {
  stops: VehicleStop[]
  selectedStopId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const selected = stops.find((stop) => stop.id === selectedStopId)
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 14, { duration: 0.6 })
    }
  }, [map, selectedStopId, stops])

  useEffect(() => {
    if (stops.length === 0 || selectedStopId) return
    const lats = stops.map((stop) => stop.lat)
    const lngs = stops.map((stop) => stop.lng)
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40] }
    )
  }, [map, stops, selectedStopId])

  return null
}

export function VehicleStopsMap({
  stops,
  selectedStopId,
  onSelectStop,
  vehicleType,
  category,
  className,
}: VehicleStopsMapProps) {
  const bins = useMemo(() => binStops(stops), [stops])
  const maxCount = Math.max(1, ...bins.map((bin) => bin.count))
  const selected = stops.find((stop) => stop.id === selectedStopId) ?? stops[0]
  const center: [number, number] = selected
    ? [selected.lat, selected.lng]
    : [6.5244, 3.3792]
  const vehicleIcon = useMemo(
    () => createVehicleIcon(vehicleType, category),
    [vehicleType, category]
  )

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController stops={stops} selectedStopId={selectedStopId} />
        {bins.map((bin) => {
          const { color, fillOpacity } = hexColor(bin.count, maxCount)
          return (
            <Polygon
              key={bin.key}
              positions={bin.vertices}
              pathOptions={{
                color: "#FFFFFF",
                weight: 1,
                fillColor: color,
                fillOpacity,
              }}
              eventHandlers={{
                click: () => {
                  const nextId = bin.stopIds[0]
                  if (nextId) onSelectStop(nextId)
                },
              }}
            />
          )
        })}
        {selected && (
          <Marker position={[selected.lat, selected.lng]} icon={vehicleIcon} />
        )}
      </MapContainer>
    </div>
  )
}
