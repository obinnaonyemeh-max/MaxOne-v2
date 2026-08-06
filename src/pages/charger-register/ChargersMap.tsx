import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ChargerRegisterItem } from "@/data/mockChargerData"

interface ChargersMapProps {
  chargers: ChargerRegisterItem[]
  selectedChargerId: string | null
  onSelectCharger: (chargerId: string) => void
  className?: string
}

const defaultChargerIcon = new L.Icon({
  iconUrl: "/images/falcon_charger.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "charger-marker-default",
})

const selectedChargerIcon = new L.Icon({
  iconUrl: "/images/falcon_charger.svg",
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
  className: "charger-marker-selected",
})

function MapController({
  chargers,
  selectedChargerId,
}: {
  chargers: ChargerRegisterItem[]
  selectedChargerId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const selected = chargers.find((charger) => charger.id === selectedChargerId)
    if (selected) {
      map.flyTo([selected.location.lat, selected.location.lng], 14, {
        duration: 0.6,
      })
    }
  }, [map, selectedChargerId, chargers])

  useEffect(() => {
    if (chargers.length === 0) return
    if (selectedChargerId) return

    const lats = chargers.map((c) => c.location.lat)
    const lngs = chargers.map((c) => c.location.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, chargers, selectedChargerId])

  return null
}

export function ChargersMap({
  chargers,
  selectedChargerId,
  onSelectCharger,
  className,
}: ChargersMapProps) {
  const center = chargers[0]
    ? ([chargers[0].location.lat, chargers[0].location.lng] as [number, number])
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
          chargers={chargers}
          selectedChargerId={selectedChargerId}
        />

        {chargers.map((charger) => {
          const isSelected = selectedChargerId === charger.id
          return (
            <Marker
              key={charger.id}
              position={[charger.location.lat, charger.location.lng]}
              icon={isSelected ? selectedChargerIcon : defaultChargerIcon}
              opacity={isSelected ? 1 : 0.75}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => onSelectCharger(charger.id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
