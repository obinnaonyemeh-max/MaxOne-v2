import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { VehicleRegisterItem, VehicleType, VehicleCategory } from "@/data/mockVehicleRegister"

interface VehiclesMapProps {
  vehicles: VehicleRegisterItem[]
  selectedVehicleId: string | null
  onSelectVehicle: (vehicleId: string) => void
  className?: string
}

function getIconUrl(vehicleType: VehicleType, category: VehicleCategory): string {
  const typePrefix = vehicleType === "2 Wheeler" ? "2_wheeler" 
    : vehicleType === "3 Wheeler" ? "3_wheeler" 
    : "4_wheeler"
  const suffix = category === "ev" ? "_ev" : ""
  return `/images/${typePrefix}${suffix}.svg`
}

function createIcon(vehicleType: VehicleType, category: VehicleCategory, isSelected: boolean): L.Icon {
  const iconUrl = getIconUrl(vehicleType, category)
  const size = isSelected ? 44 : 32
  const anchor = size / 2
  
  return new L.Icon({
    iconUrl,
    iconSize: [size, size],
    iconAnchor: [anchor, size],
    popupAnchor: [0, -size],
    className: isSelected ? "vehicle-marker-selected" : "vehicle-marker-default",
  })
}

const iconCache = new Map<string, L.Icon>()

function MapController({
  vehicles,
  selectedVehicleId,
}: {
  vehicles: VehicleRegisterItem[]
  selectedVehicleId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const selected = vehicles.find((vehicle) => vehicle.id === selectedVehicleId)
    if (selected) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 14, {
        duration: 0.6,
      })
    }
  }, [map, selectedVehicleId, vehicles])

  useEffect(() => {
    if (vehicles.length === 0) return
    if (selectedVehicleId) return

    const lats = vehicles.map((v) => v.coordinates.lat)
    const lngs = vehicles.map((v) => v.coordinates.lng)
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ]
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, vehicles, selectedVehicleId])

  return null
}

export function VehiclesMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  className,
}: VehiclesMapProps) {
  const center = vehicles[0]
    ? ([vehicles[0].coordinates.lat, vehicles[0].coordinates.lng] as [number, number])
    : ([6.5244, 3.3792] as [number, number])

  const getMarkerIcon = (vehicle: VehicleRegisterItem, isSelected: boolean): L.Icon => {
    const cacheKey = `${vehicle.vehicleType}-${vehicle.category}-${isSelected}`
    
    if (!iconCache.has(cacheKey)) {
      iconCache.set(cacheKey, createIcon(vehicle.vehicleType, vehicle.category, isSelected))
    }
    
    return iconCache.get(cacheKey)!
  }

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
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
        />

        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id
          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.coordinates.lat, vehicle.coordinates.lng]}
              icon={getMarkerIcon(vehicle, isSelected)}
              opacity={isSelected ? 1 : 0.75}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: () => onSelectVehicle(vehicle.id),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
