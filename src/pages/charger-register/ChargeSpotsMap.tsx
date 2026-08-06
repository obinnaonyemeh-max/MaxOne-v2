import { Fragment, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  useMap,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import type { ChargeSpot } from "@/data/mockChargerData"

interface ChargeSpotsMapProps {
  spots: ChargeSpot[]
  selectedSpotId: string | null
  onSelectSpot: (spotId: string) => void
  className?: string
}

function MapController({
  spots,
  selectedSpotId,
}: {
  spots: ChargeSpot[]
  selectedSpotId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const selected = spots.find((spot) => spot.id === selectedSpotId)
    if (selected) {
      map.flyTo([selected.location.lat, selected.location.lng], 14, {
        duration: 0.6,
      })
    }
  }, [map, selectedSpotId, spots])

  useEffect(() => {
    if (spots.length === 0) return
    if (selectedSpotId) return

    const lats = spots.map((s) => s.location.lat)
    const lngs = spots.map((s) => s.location.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, spots, selectedSpotId])

  return null
}

export function ChargeSpotsMap({
  spots,
  selectedSpotId,
  onSelectSpot,
  className,
}: ChargeSpotsMapProps) {
  const center = spots[0]
    ? ([spots[0].location.lat, spots[0].location.lng] as [number, number])
    : ([6.5244, 3.3792] as [number, number])

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController spots={spots} selectedSpotId={selectedSpotId} />

        {spots.map((spot) => {
          const isSelected = selectedSpotId === spot.id
          return (
            <Fragment key={spot.id}>
              <Circle
                center={[spot.location.lat, spot.location.lng]}
                radius={spot.radiusMeters}
                pathOptions={{
                  color: isSelected ? "#2563EB" : "#60A5FA",
                  weight: isSelected ? 3 : 2,
                  fillColor: "#93C5FD",
                  fillOpacity: isSelected ? 0.35 : 0.2,
                }}
                eventHandlers={{
                  click: () => onSelectSpot(spot.id),
                }}
              />
              {spot.points.map((point, index) => (
                <CircleMarker
                  key={`${spot.id}-p-${index}`}
                  center={[point.lat, point.lng]}
                  radius={isSelected ? 6 : 5}
                  pathOptions={{
                    fillColor: "var(--color-brand-primary)",
                    fillOpacity: 0.95,
                    color: isSelected ? "#1F2937" : "#FFFFFF",
                    weight: isSelected ? 2 : 1,
                  }}
                  eventHandlers={{
                    click: () => onSelectSpot(spot.id),
                  }}
                />
              ))}
            </Fragment>
          )
        })}
      </MapContainer>
    </div>
  )
}
