import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { StatusBadge } from "@/components/max"
import { tamperRecoveryStatusVariantMap, type TamperRecoveryStatus } from "@/data/mockTamperAlerts"

const vehicleMarkerIcon = new L.Icon({
  iconUrl: "/images/2_wheeler_ev.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 38],
  popupAnchor: [0, -38],
})

// Recovery pair marker — a dark circular badge with the agent (person) glyph,
// so it reads as clearly distinct from the vehicle marker.
const recoveryPairIcon = new L.DivIcon({
  className: "tamper-recovery-marker",
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#111827;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff">
    <svg width="16" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.91099 6.33327C3.91099 6.70061 3.99632 7.04861 4.14832 7.35794C3.82165 7.77661 3.61832 8.29594 3.59099 8.86194C2.96365 8.20327 2.57765 7.31261 2.57765 6.33394C2.57765 4.05994 4.65899 2.26261 7.01699 2.74661C8.40499 3.03194 9.52965 4.14994 9.82565 5.53594C9.91499 5.95461 9.93165 6.36461 9.88632 6.75661C9.84765 7.08861 9.55632 7.33394 9.22165 7.33394H9.19165C8.79699 7.33394 8.51965 6.98261 8.56299 6.59061C8.59232 6.32727 8.57699 6.05061 8.50965 5.76861C8.31099 4.93327 7.62965 4.25661 6.79299 4.06394C5.26899 3.71394 3.91099 4.86794 3.91099 6.33327ZM1.31765 5.46994C1.50032 4.40794 2.01965 3.43994 2.82499 2.68461C3.84432 1.72927 5.17899 1.25727 6.57832 1.34394C9.21366 1.51461 11.2743 3.82327 11.2437 6.58727C11.231 7.74461 10.2617 8.66594 9.10499 8.66594H7.50099C7.33832 8.11327 6.83299 7.70661 6.22765 7.70661C5.49099 7.70661 4.89432 8.30327 4.89432 9.03994C4.89432 9.77661 5.49099 10.3733 6.22765 10.3733C6.58632 10.3733 6.91099 10.2299 7.15032 9.99927H9.10499C10.9843 9.99927 12.5503 8.50261 12.577 6.62394C12.6263 3.14327 10.0117 0.22994 6.66432 0.0139398C4.88832 -0.101394 3.20365 0.50194 1.91365 1.71261C0.914321 2.64927 0.249654 3.88927 0.0103209 5.22327C-0.0623458 5.62861 0.258321 6.00061 0.669654 6.00061C0.984321 6.00061 1.26499 5.78061 1.31765 5.46994ZM6.24432 11.3333C3.78099 11.3333 1.64965 12.8613 0.940988 15.1346C0.830988 15.4859 1.02765 15.8599 1.37899 15.9699C1.72965 16.0759 2.10365 15.8826 2.21365 15.5319C2.73965 13.8453 4.39632 12.6666 6.24365 12.6666C8.09099 12.6666 9.74832 13.8453 10.2737 15.5319C10.363 15.8173 10.6257 15.9999 10.9103 15.9999C10.9763 15.9999 11.0423 15.9899 11.109 15.9699C11.4603 15.8599 11.6563 15.4859 11.547 15.1346C10.8383 12.8613 8.70765 11.3333 6.24432 11.3333Z" fill="#ffffff"/></svg>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

interface RecoveryInfo {
  pairNames: string
  emails: string
  location: string
  lat: number
  lng: number
  estimatedTime: string
  estimatedDistance: string
  lastUpdate: string
  status: TamperRecoveryStatus
}

interface VehicleInfo {
  plateNumber: string
  coordinates: string
  lastRecordedTime: string
}

interface TamperLocationMapProps {
  location: { lat: number; lng: number }
  vehicle: VehicleInfo
  recovery: RecoveryInfo
  className?: string
}

function MarkerTooltip({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Tooltip direction="top" offset={[0, -14]} opacity={1} className="tamper-map-tooltip">
      <div className="min-w-[160px]">
        <p className="font-semibold text-gray-950 mb-1" style={{ fontSize: "12px" }}>
          {title}
        </p>
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3" style={{ fontSize: "11px" }}>
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </Tooltip>
  )
}

function RecoveryField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <span
        className="block text-gray-500 mb-0.5"
        style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase" }}
      >
        {label}
      </span>
      <span
        className="block text-gray-950 truncate"
        style={{ fontSize: "13px", fontWeight: 500 }}
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </span>
    </div>
  )
}

type LatLng = [number, number]

// Build a gently curved route from the recovery pair's start toward the vehicle,
// so the animated agent follows a natural-looking path rather than a straight line.
function buildRoute(start: LatLng, end: LatLng, steps = 64): LatLng[] {
  const dLat = end[0] - start[0]
  const dLng = end[1] - start[1]
  const len = Math.hypot(dLat, dLng) || 1
  const perpLat = -dLng / len
  const perpLng = dLat / len
  const route: LatLng[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Subtle curve only — the line runs essentially straight to the vehicle.
    const offset = Math.sin(t * Math.PI) * len * 0.04
    route.push([start[0] + dLat * t + perpLat * offset, start[1] + dLng * t + perpLng * offset])
  }
  return route
}

function interpolateRoute(route: LatLng[], progress: number): LatLng {
  const steps = route.length - 1
  const scaled = Math.max(0, Math.min(progress, 1)) * steps
  const i = Math.min(Math.floor(scaled), steps - 1)
  const frac = scaled - i
  const a = route[i]
  const b = route[i + 1]
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]
}

export function TamperLocationMap({
  location,
  vehicle,
  recovery,
  className,
}: TamperLocationMapProps) {
  const isRecovering = recovery.status === "Recovery In Progress"
  const recoveryRoute = useMemo(
    () => buildRoute([recovery.lat, recovery.lng], [location.lat, location.lng]),
    [recovery.lat, recovery.lng, location.lat, location.lng]
  )

  const [progress, setProgress] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRecovering) return
    const durationMs = 180000 // ~3 minutes to travel to the vehicle
    let raf = 0
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const t = Math.min((ts - startRef.current) / durationMs, 1)
      setProgress(t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isRecovering])

  const steps = recoveryRoute.length - 1
  const idx = Math.min(Math.floor(progress * steps), steps - 1)
  const agentPos = interpolateRoute(recoveryRoute, progress)
  const traveled: LatLng[] = [...recoveryRoute.slice(0, idx + 1), agentPos]

  // Derived from animation progress. While the pair is en route the recovery
  // panel below updates live with the agent's moving position.
  const speed = Math.round(28 + 14 * Math.abs(Math.sin(progress * Math.PI * 3)))
  const liveRecoveryLocation = isRecovering
    ? `Long ${agentPos[1].toFixed(6)}, Lat ${agentPos[0].toFixed(6)}`
    : recovery.location
  const liveLastUpdate = isRecovering ? "Just now" : recovery.lastUpdate

  const recoveryTooltip = (
    <MarkerTooltip
      title="Recovery Pair"
      rows={[
        ["Team", recovery.pairNames],
        ["Status", recovery.status],
        ["ETA", recovery.estimatedTime],
        ["Distance", recovery.estimatedDistance],
      ]}
    />
  )
  return (
    <div className={className}>
      <div className="relative rounded-lg overflow-hidden h-full min-h-[420px]">
        {/* Map */}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%", borderRadius: "8px", minHeight: "420px" }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]} icon={vehicleMarkerIcon}>
            <MarkerTooltip
              title={vehicle.plateNumber}
              rows={[
                ["Coordinates", vehicle.coordinates],
                ["Last seen", vehicle.lastRecordedTime],
              ]}
            />
          </Marker>
          {isRecovering ? (
            <>
              {/* Planned route */}
              <Polyline
                positions={recoveryRoute}
                pathOptions={{ color: "#9CA3AF", weight: 3, opacity: 0.7, dashArray: "6 8" }}
              />
              {/* Path travelled so far */}
              <Polyline positions={traveled} pathOptions={{ color: "#111827", weight: 4 }} />
              <Marker position={agentPos} icon={recoveryPairIcon} zIndexOffset={2000}>
                {recoveryTooltip}
              </Marker>
            </>
          ) : (
            <Marker position={[recovery.lat, recovery.lng]} icon={recoveryPairIcon}>
              {recoveryTooltip}
            </Marker>
          )}
        </MapContainer>

        {/* Moving card — shown while the recovery pair is en route */}
        {isRecovering && (
          <>
            {/* Speed badge */}
            <div
              className="absolute top-4 right-4 z-[1000] w-[112px] rounded-xl overflow-hidden"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="text-white text-center py-1.5"
                style={{ background: "#22C55E", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px" }}
              >
                MOVING
              </div>
              <div className="bg-white text-center py-2">
                <div className="text-gray-950" style={{ fontSize: "34px", fontWeight: 700, lineHeight: 1 }}>
                  {speed}
                </div>
                <div className="text-gray-400" style={{ fontSize: "12px" }}>
                  kmph
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recovery pair dispatch panel */}
        <div
          className="absolute left-4 right-4 bottom-4 z-[1000] rounded-lg p-4"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          {/* Line 1 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <RecoveryField label="Recovery Pair" value={recovery.pairNames} />
            <RecoveryField label="Recovery Pairs Email" value={recovery.emails} />
          </div>
          {/* Line 2 */}
          <div className="grid grid-cols-3 gap-x-6 mt-3">
            <RecoveryField label="Recovery Pairs Location" value={liveRecoveryLocation} />
            <RecoveryField label="Estimated Travelled Time" value={recovery.estimatedTime} />
            <RecoveryField label="Estimated Distance" value={recovery.estimatedDistance} />
          </div>
          {/* Line 3 */}
          <div className="grid grid-cols-3 gap-x-6 mt-3">
            <RecoveryField label="Last Update" value={liveLastUpdate} />
            <RecoveryField
              label="Recovery Status"
              value={
                <StatusBadge variant={tamperRecoveryStatusVariantMap[recovery.status]} withDot>
                  {recovery.status}
                </StatusBadge>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
