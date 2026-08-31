import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import { MapPin, Pause, Play } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  formatDuration,
  getVehicleMarkerIcon,
  interpolateTrip,
  type TripEvent,
  type TripPoint,
} from "@/data/mockVehicleActivity"
import type { TrackingStatus, VehicleCategory, VehicleType } from "@/data/mockVehicleRegister"
import { ShareLiveLocationModal } from "./ShareLiveLocationModal"

interface LiveTrackingMapProps {
  vehicleType: VehicleType
  category: VehicleCategory
  trackingStatus: TrackingStatus
  tripPoints: TripPoint[]
  tripEvents: TripEvent[]
  plateNumber: string
  address: string
  title?: string
  mode?: "live" | "replay"
  showViewAllTrips?: boolean
  onViewAllTrips?: () => void
  onSampledChange?: (point: TripPoint, displaySpeed: number) => void
  className?: string
}

const statusLabels: Record<TrackingStatus, string> = {
  moving: "MOVING",
  stopped: "STOPPED",
  offline: "OFFLINE",
  pending: "PENDING",
}

const statusHeaderColor: Record<TrackingStatus, string> = {
  moving: "#22C55E",
  stopped: "#EAB308",
  offline: "#EF4444",
  pending: "#9CA3AF",
}

const frostedStyle: CSSProperties = {
  width: "240px",
  background: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
}

const startLabelIcon = new L.DivIcon({
  className: "live-tracking-start-label",
  html: `<div style="background:#111827;color:#fff;font-size:11px;font-weight:600;padding:4px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">Start</div>`,
  iconSize: [48, 24],
  iconAnchor: [24, 36],
})

function createVehicleIcon(vehicleType: VehicleType, category: VehicleCategory): L.Icon {
  return new L.Icon({
    iconUrl: getVehicleMarkerIcon(vehicleType, category),
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -44],
  })
}

function initialLiveEdge(status: TrackingStatus): number {
  if (status === "moving") return 0.42
  if (status === "stopped") return 0.88
  return 1
}

function KeepVehicleInView({
  position,
  follow,
}: {
  position: [number, number]
  follow: boolean
}) {
  const map = useMap()
  const lastPan = useRef(0)
  const centered = useRef(false)
  const positionRef = useRef(position)
  positionRef.current = position

  useEffect(() => {
    const centerOnVehicle = () => {
      map.invalidateSize()
      map.setView(positionRef.current, Math.max(map.getZoom(), 15), { animate: false })
      centered.current = true
    }

    centerOnVehicle()
    const t1 = window.setTimeout(centerOnVehicle, 80)
    const t2 = window.setTimeout(centerOnVehicle, 320)
    const container = map.getContainer()
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(container)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      observer.disconnect()
    }
  }, [map])

  useEffect(() => {
    if (!centered.current) {
      map.setView(position, Math.max(map.getZoom(), 15), { animate: false })
      centered.current = true
      return
    }

    const latLng = L.latLng(position[0], position[1])
    const padded = map.getBounds().pad(-0.28)
    const outOfView = !padded.contains(latLng)

    if (!follow && !outOfView) return

    const now = Date.now()
    if (follow && !outOfView && now - lastPan.current < 700) return
    lastPan.current = now
    map.panTo(position, { animate: true, duration: 0.45 })
  }, [follow, map, position])

  return null
}

function MovingVehicleMarker({
  position,
  icon,
}: {
  position: [number, number]
  icon: L.Icon
}) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    const marker = L.marker(position, { icon, zIndexOffset: 2000 }).addTo(map)
    markerRef.current = marker
    return () => {
      marker.remove()
      markerRef.current = null
    }
  }, [icon, map])

  useEffect(() => {
    markerRef.current?.setLatLng(position)
  }, [position])

  return null
}

export function LiveTrackingMap({
  vehicleType,
  category,
  trackingStatus,
  tripPoints,
  tripEvents,
  plateNumber,
  address,
  title = "Live Tracking",
  mode = "live",
  showViewAllTrips = true,
  onViewAllTrips,
  onSampledChange,
  className,
}: LiveTrackingMapProps) {
  const isReplayMode = mode === "replay"
  const canAnimate = !isReplayMode && (trackingStatus === "moving" || trackingStatus === "stopped")
  const [liveEdge, setLiveEdge] = useState(() => (isReplayMode ? 1 : initialLiveEdge(trackingStatus)))
  const [viewOffset, setViewOffset] = useState(() => (isReplayMode ? 0 : 1))
  const [isLive, setIsLive] = useState(() => (isReplayMode ? false : canAnimate))
  const [isPaused, setIsPaused] = useState(() => isReplayMode)
  const [shareOpen, setShareOpen] = useState(false)
  const [holdSeconds, setHoldSeconds] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const scrubRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const liveEdgeRef = useRef(liveEdge)

  const vehicleIcon = useMemo(
    () => createVehicleIcon(vehicleType, category),
    [vehicleType, category]
  )

  liveEdgeRef.current = liveEdge

  const isPlayback = !isLive
  const viewProgress = isLive ? liveEdge : viewOffset * liveEdge

  const livePointCount = Math.max(2, Math.floor(liveEdge * (tripPoints.length - 1)) + 1)
  const visiblePoints = tripPoints.slice(0, livePointCount)
  const liveTrail = visiblePoints.map((point) => [point.lat, point.lng] as [number, number])
  const viewPointCount = Math.max(2, Math.floor(viewProgress * (tripPoints.length - 1)) + 1)
  const playbackTrail = tripPoints
    .slice(0, Math.min(viewPointCount, livePointCount))
    .map((point) => [point.lat, point.lng] as [number, number])

  const waypoints = visiblePoints.filter(
    (_, index) => index > 0 && index % 8 === 0 && index < visiblePoints.length - 1
  )

  useEffect(() => {
    if (!isLive) return
    let frame = 0
    const tick = () => {
      setNowMs(Date.now())
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isLive])

  useEffect(() => {
    if (!isLive || trackingStatus !== "moving" || tripPoints.length < 2) return

    let frame = 0
    let last = performance.now()

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      setLiveEdge((current) => Math.min(1, current + dt / 55))
      if (liveEdgeRef.current >= 1) {
        setHoldSeconds((current) => current + dt)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isLive, trackingStatus, tripPoints.length])

  useEffect(() => {
    if (!isPlayback || isPaused || tripPoints.length < 2) return

    let frame = 0
    let last = performance.now()

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      setNowMs(Date.now())
      setViewOffset((current) => {
        const next = current + dt / 18
        if (next >= 1) {
          if (isReplayMode) {
            setIsPaused(true)
            return 1
          }
          setIsLive(true)
          setIsPaused(false)
          return 1
        }
        return next
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isPaused, isPlayback, tripPoints.length, isReplayMode])

  const sampled = interpolateTrip(tripPoints, viewProgress)
  const sampledRef = useRef(onSampledChange)
  sampledRef.current = onSampledChange
  const lastEmitRef = useRef(0)

  const wobble =
    isLive && sampled.speed > 0
      ? Math.sin(nowMs / 700) * 5 + Math.sin(nowMs / 1100) * 3
      : 0
  const displaySpeed = Math.max(0, Math.round(sampled.speed + wobble))

  useEffect(() => {
    if (isLive) return
    sampledRef.current?.(sampled, Math.round(sampled.speed))
  }, [isLive, sampled.lat, sampled.lng, sampled.speed, sampled.distanceKm, sampled.elapsedSeconds])

  useEffect(() => {
    if (!isLive) return
    const now = performance.now()
    if (now - lastEmitRef.current < 280) return
    lastEmitRef.current = now
    sampledRef.current?.(sampled, displaySpeed)
  }, [
    isLive,
    displaySpeed,
    nowMs,
    sampled.lat,
    sampled.lng,
    sampled.speed,
    sampled.distanceKm,
    sampled.elapsedSeconds,
  ])
  const displayDuration = formatDuration(
    sampled.elapsedSeconds + (isLive && liveEdge >= 1 ? holdSeconds : 0)
  )
  const position: [number, number] = [sampled.lat, sampled.lng]
  const startPoint = tripPoints[0]
  const displayStatus: TrackingStatus =
    isPlayback
      ? sampled.speed > 2
        ? "moving"
        : "stopped"
      : trackingStatus

  const enterPlayback = useCallback((offset: number) => {
    setIsLive(false)
    setIsPaused(true)
    setViewOffset(Math.min(1, Math.max(0, offset)))
    setHoldSeconds(0)
  }, [])

  const seekFromClientX = useCallback((clientX: number) => {
    const el = scrubRef.current
    if (!el || tripPoints.length === 0) return
    const rect = el.getBoundingClientRect()
    enterPlayback((clientX - rect.left) / rect.width)
  }, [enterPlayback, tripPoints.length])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      seekFromClientX(event.clientX)
    }
    const onUp = () => {
      dragging.current = false
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [seekFromClientX])

  const handleResumeLive = () => {
    if (!canAnimate) return
    setIsLive(true)
    setIsPaused(false)
    setViewOffset(1)
    setHoldSeconds(0)
  }

  const visibleEvents = tripEvents.filter(
    (event) => event.pointIndex / Math.max(1, tripPoints.length - 1) <= liveEdge
  )

  return (
    <div className={cn("h-full min-w-0", className)}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center" style={{ gap: "11px" }}>
            {!isReplayMode && (
              <span className={cn("live-pulse", !isLive && "is-idle")} aria-hidden>
                <span className="live-pulse-halo" />
                <span className="live-pulse-halo is-delayed" />
                <span className="live-pulse-core" />
              </span>
            )}
            <h3 className="text-gray-950" style={{ fontSize: "16px", fontWeight: 500 }}>
              {title}
            </h3>
            {!isReplayMode && (
              <span
                className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                {isLive ? "LIVE" : "IDLE"}
              </span>
            )}
            {isPlayback && !isReplayMode && (
              <span
                className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-500"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                PLAYBACK
              </span>
            )}
          </div>
          {showViewAllTrips && onViewAllTrips && (
            <button
              onClick={onViewAllTrips}
              className="hover:underline"
              style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
            >
              VIEW ALL TRIPS
            </button>
          )}
        </div>

        <div
          className="relative z-0 isolate rounded-lg overflow-hidden bg-gray-100 flex-1 min-h-[320px]"
        >
          {tripPoints.length > 0 && (
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <KeepVehicleInView position={position} follow={isLive || (isReplayMode && !isPaused)} />
              {isPlayback && liveTrail.length > 1 && (
                <Polyline
                  positions={liveTrail}
                  pathOptions={{ color: "#D1D5DB", weight: 5, opacity: 0.95 }}
                />
              )}
              {playbackTrail.length > 1 && (
                <Polyline
                  positions={playbackTrail}
                  pathOptions={{ color: "#4B5563", weight: 5, opacity: 1 }}
                />
              )}
              {waypoints.map((point, index) => (
                <CircleMarker
                  key={`wp-${index}`}
                  center={[point.lat, point.lng]}
                  radius={4}
                  pathOptions={{
                    fillColor: "#4B5563",
                    fillOpacity: 1,
                    color: "#4B5563",
                    weight: 1,
                  }}
                />
              ))}
              {startPoint && (
                <>
                  <CircleMarker
                    center={[startPoint.lat, startPoint.lng]}
                    radius={8}
                    pathOptions={{
                      fillColor: "#22C55E",
                      fillOpacity: 1,
                      color: "white",
                      weight: 3,
                    }}
                  />
                  <Marker position={[startPoint.lat, startPoint.lng]} icon={startLabelIcon} />
                </>
              )}
              <MovingVehicleMarker position={position} icon={vehicleIcon} />
            </MapContainer>
          )}

          <div
            className="absolute right-4 top-4 z-[1000] overflow-hidden rounded-lg border border-gray-950 bg-white shadow-md"
            style={{ minWidth: "84px" }}
          >
            <div
              className="text-center font-semibold text-gray-950 border-b border-gray-950"
              style={{
                backgroundColor: statusHeaderColor[displayStatus],
                fontSize: "14px",
                padding: "4px 6px",
                letterSpacing: "0.05em",
              }}
            >
              {statusLabels[displayStatus]}
            </div>
            <div className="py-2 text-center" style={{ fontVariantNumeric: "tabular-nums" }}>
              <div className="text-gray-950" style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
                {displaySpeed}
              </div>
              <div className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>
                kmph
              </div>
            </div>
          </div>

          <div
            className="absolute right-4 bottom-4 z-[1000] rounded-lg p-4"
            style={frostedStyle}
          >
            <div className="mb-3">
              <span
                className="block text-gray-500 mb-0.5"
                style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}
              >
                DISTANCE COVERED
              </span>
              <span className="block text-gray-950" style={{ fontSize: "12px", fontWeight: 500 }}>
                {sampled.distanceKm.toFixed(2)} km
              </span>
            </div>
            <div className="mb-3">
              <span
                className="block text-gray-500 mb-0.5"
                style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}
              >
                DURATION
              </span>
              <span className="block text-gray-950" style={{ fontSize: "12px", fontWeight: 500 }}>
                {displayDuration}
              </span>
            </div>
            <div>
              <span
                className="block text-gray-500 mb-0.5"
                style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}
              >
                {isLive ? "LIVE LOCATION" : "LOCATION"}
              </span>
              <span className="block text-gray-950 whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 500 }}>
                Lat {sampled.lat.toFixed(6)}, Long {sampled.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={scrubRef}
          className="relative h-8 mt-2 cursor-pointer shrink-0"
          onPointerDown={(event) => {
            dragging.current = true
            seekFromClientX(event.clientX)
          }}
        >
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-gray-200" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-gray-700"
            style={{ width: `${viewOffset * 100}%` }}
          />
          {visibleEvents.map((event) => (
            <Tooltip key={event.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-white shadow-sm"
                  style={{
                    left: `${(event.pointIndex / Math.max(1, livePointCount - 1)) * 100}%`,
                    backgroundColor: event.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    enterPlayback(event.pointIndex / Math.max(1, livePointCount - 1))
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>{event.label}</TooltipContent>
            </Tooltip>
          ))}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm",
              isLive ? "bg-status-danger" : "bg-gray-950"
            )}
            style={{ left: `${viewOffset * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 shrink-0">
          <div className="flex items-center gap-2">
            {!isReplayMode && (
              <button
                onClick={handleResumeLive}
                disabled={!canAnimate}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-white disabled:opacity-40"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: isLive ? "#EF4444" : "#9CA3AF",
                }}
              >
                <span className={cn("live-pulse is-white", !isLive && "is-idle")} aria-hidden>
                  <span className="live-pulse-halo" />
                  <span className="live-pulse-halo is-delayed" />
                  <span className="live-pulse-core" />
                </span>
                Live
              </button>
            )}
            {isPlayback && (
              <button
                type="button"
                onClick={() => setIsPaused((current) => !current)}
                className="inline-flex h-8 w-8 items-center justify-center text-gray-800 hover:text-gray-950"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? (
                  <Play className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ) : (
                  <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                )}
              </button>
            )}
            <span className="text-gray-400" style={{ fontSize: "13px" }}>
              {isReplayMode
                ? isPaused
                  ? "Playback paused"
                  : "Playing back this trip"
                : isLive
                  ? "Watching live"
                  : isPaused
                    ? "Playback paused"
                    : "Playing back this trip"}
            </span>
          </div>
          {!isReplayMode && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-50"
              style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
            >
              <MapPin className="h-4 w-4" style={{ color: "#E88E15" }} />
              Share live location
            </button>
          )}
        </div>
      </div>

      <ShareLiveLocationModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        plateNumber={plateNumber}
        address={address}
        latitude={sampled.lat}
        longitude={sampled.lng}
      />
    </div>
  )
}
