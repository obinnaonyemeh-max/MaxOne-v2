import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { SwapStation } from "@/data/mockStationsData"

interface StationsMapProps {
  stations: SwapStation[]
  selectedStationId: string | null
  onSelectStation: (stationId: string) => void
  className?: string
}

const defaultStationIcon = new L.Icon({
  iconUrl: "/images/station.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "station-marker-default",
})

const selectedStationIcon = new L.Icon({
  iconUrl: "/images/station.svg",
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
  className: "station-marker-selected",
})

function MapController({
  stations,
  selectedStationId,
}: {
  stations: SwapStation[]
  selectedStationId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const timeout = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(timeout)
  }, [map])

  useEffect(() => {
    const selected = stations.find((station) => station.id === selectedStationId)
    if (selected) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 14, {
        duration: 0.6,
      })
    }
  }, [map, selectedStationId, stations])

  useEffect(() => {
    if (stations.length === 0) return
    if (selectedStationId) return

    const lats = stations.map((station) => station.coordinates.lat)
    const lngs = stations.map((station) => station.coordinates.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, stations, selectedStationId])

  return null
}

export function StationsMap({
  stations,
  selectedStationId,
  onSelectStation,
  className,
}: StationsMapProps) {
  const center = stations[0]
    ? ([stations[0].coordinates.lat, stations[0].coordinates.lng] as [number, number])
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

        <MapController
          stations={stations}
          selectedStationId={selectedStationId}
        />

        {stations.map((station) => {
          const isSelected = selectedStationId === station.id
          return (
            <Marker
              key={station.id}
              position={[station.coordinates.lat, station.coordinates.lng]}
              icon={isSelected ? selectedStationIcon : defaultStationIcon}
              opacity={isSelected ? 1 : 0.75}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => onSelectStation(station.id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
