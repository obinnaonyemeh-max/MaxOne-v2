import { useCallback, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  TopBar,
  BackButton,
  StatusTabs,
  StatusBadge,
  VehicleOverviewCard,
} from "@/components/max"
import { getVehicleById } from "@/data/mockVehicleRegister"
import {
  bearingDegrees,
  compassLabel,
  formatClock,
  formatDuration,
  getVehicleActivity,
  getVehicleTrips,
  interpolateTrip,
  type TripPoint,
} from "@/data/mockVehicleActivity"
import { TrendChartCard } from "@/pages/battery-register/TrendChartCard"
import { LiveTrackingMap } from "@/pages/vehicle-activity/LiveTrackingMap"
import { EventTrackingCard } from "./EventTrackingCard"
import { TripListCard } from "./TripListCard"

const DOT_PRODUCED = "#16B04F"
const DOT_INTERPOLATED = "#EAB308"
const DOT_HEARTBEAT = "#A3A3A3"
const LIVE_START_SECONDS = 14 * 3600 + 27 * 60
const LIVE_TRACE_WINDOW_MS = 45_000

function formatWallClock(ms: number) {
  const date = new Date(ms)
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${Math.floor((ms % 1000) / 100)}`
}

function speedChartData(points: TripPoint[]) {
  if (points.length === 0) return []
  const step = Math.max(1, Math.floor(points.length / 36))
  return points
    .filter((_, index) => index % step === 0 || index === points.length - 1)
    .map((point) => ({
      label: formatDuration(point.elapsedSeconds),
      value: Math.round(point.speed),
    }))
}

function headingFor(points: TripPoint[], sampled: TripPoint): { degrees: number; label: string } {
  if (points.length < 2) return { degrees: 0, label: "N" }
  const scaled = points.findIndex((point) => point.elapsedSeconds >= sampled.elapsedSeconds)
  const index = Math.max(1, scaled === -1 ? points.length - 1 : scaled)
  const degrees = bearingDegrees(points[index - 1], points[index])
  return { degrees: Math.round(degrees), label: compassLabel(degrees) }
}

export default function VehicleTripsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicle = getVehicleById(id || "")
  const activity = getVehicleActivity(id || "")
  const trips = getVehicleTrips(id || "")
  const [activeTab, setActiveTab] = useState("live")
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id ?? "")
  const [sampled, setSampled] = useState<TripPoint | null>(null)
  const [liveSpeed, setLiveSpeed] = useState<number | null>(null)
  const [liveTrace, setLiveTrace] = useState<{ label: string; value: number; t: number }[]>([])
  const isLiveTabRef = useRef(true)

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) ?? trips[0]
  const isLiveTab = activeTab === "live"
  isLiveTabRef.current = isLiveTab
  const activePoints = isLiveTab ? activity?.tripPoints ?? [] : selectedTrip?.tripPoints ?? []
  const activeEvents = isLiveTab ? activity?.tripEvents ?? [] : selectedTrip?.tripEvents ?? []
  const startSeconds = isLiveTab ? LIVE_START_SECONDS : selectedTrip?.startSeconds ?? 0
  const currentSample = sampled ?? (activePoints.length ? interpolateTrip(activePoints, isLiveTab ? 0.42 : 0) : null)

  const heading = currentSample ? headingFor(activePoints, currentSample) : { degrees: 0, label: "N" }
  const isEV = vehicle?.category === "ev"
  const displaySpeed = isLiveTab && liveSpeed != null ? liveSpeed : Math.round(currentSample?.speed ?? 0)
  const moving = displaySpeed > 2
  const tripChartData = useMemo(() => speedChartData(activePoints), [activePoints])
  const chartData = isLiveTab ? liveTrace : tripChartData

  const handleSampledChange = useCallback((point: TripPoint, speed: number) => {
    setSampled(point)
    if (!isLiveTabRef.current) return
    setLiveSpeed(speed)
    const now = Date.now()
    setLiveTrace((prev) => {
      const next = [...prev, { label: formatWallClock(now), value: speed, t: now }]
      const cutoff = now - LIVE_TRACE_WINDOW_MS
      return next.filter((entry) => entry.t >= cutoff)
    })
  }, [])

  const stateDetails = useMemo(() => {
    if (!activity || !currentSample) return []
    const rows = [
      {
        label: "Timestamp",
        value: `${formatClock(startSeconds + currentSample.elapsedSeconds)} WAT`,
        hint: isLiveTab ? "Today - live" : "Today - playback",
        indicator: isLiveTab ? DOT_PRODUCED : DOT_INTERPOLATED,
      },
      {
        label: "GPS position",
        value: `${currentSample.lat.toFixed(6)}, ${currentSample.lng.toFixed(6)}`,
        hint: "Interpolated along track",
        indicator: DOT_INTERPOLATED,
      },
      {
        label: "Speed",
        value: `${displaySpeed} kmh`,
        hint: isLiveTab ? "Live sample" : "Interpolated",
        indicator: isLiveTab ? DOT_PRODUCED : DOT_INTERPOLATED,
      },
      {
        label: "Heading",
        value: `${heading.degrees}° ${heading.label}`,
        hint: "From track bearing",
        indicator: DOT_INTERPOLATED,
      },
      {
        label: "Ignition",
        value: moving || activity.ignition === "ON" ? "ON" : "OFF",
        hint: "Sampled - nearest report",
        indicator: DOT_HEARTBEAT,
      },
      ...(isEV && activity.battery
        ? [{
            label: "Battery SOC",
            value: `${activity.battery.stateOfCharge.toFixed(1)}%`,
            hint: "Sampled - nearest report",
            indicator: DOT_HEARTBEAT,
          }]
        : []),
      {
        label: "Odometer",
        value: `${(activity.odometerKm + currentSample.distanceKm).toFixed(2)} km`,
        hint: "Sampled - nearest report",
        indicator: DOT_HEARTBEAT,
      },
      {
        label: "GPS fix",
        value: "9 sats - HDOP 1.0",
        hint: "Fix ok",
        indicator: DOT_PRODUCED,
      },
      {
        label: "Connection",
        value: "Connected - on battery",
        hint: "Sampled - nearest report",
        indicator: DOT_HEARTBEAT,
      },
      {
        label: "Motion state",
        value: moving ? "Moving" : "Stopped",
        hint: "Derived from speed + ignition",
        indicator: DOT_HEARTBEAT,
      },
    ]
    return rows
  }, [activity, currentSample, displaySpeed, heading.degrees, heading.label, isEV, isLiveTab, moving, startSeconds])

  if (!vehicle || !activity) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Falcon" },
            { label: "Vehicle Register", href: "/falcon/vehicle-register" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Vehicle not found</p>
        </div>
      </>
    )
  }

  const dashboard = (
    <div className="flex-1 min-w-[720px] min-h-0 flex gap-4">
      <div className="flex-1 min-w-[360px] min-h-[480px] flex flex-col gap-4">
        <LiveTrackingMap
          key={isLiveTab ? "live" : selectedTrip?.id}
          className="flex-1 min-h-[480px]"
          vehicleType={vehicle.vehicleType}
          category={vehicle.category}
          trackingStatus={isLiveTab ? vehicle.trackingStatus : "stopped"}
          tripPoints={activePoints}
          tripEvents={activeEvents}
          plateNumber={vehicle.plateNumber}
          address={activity.liveAddress}
          title={isLiveTab ? "Live Tracking" : "Session Replay"}
          mode={isLiveTab ? "live" : "replay"}
          showViewAllTrips={false}
          onSampledChange={handleSampledChange}
        />
        <div className="shrink-0">
          <TrendChartCard
            title={isLiveTab ? "Speed over time (realtime)" : "Speed over time (this trip)"}
            unit=" kmph"
            data={chartData}
            lineColor="#E88E15"
            yAxisDomain={[0, 100]}
            yAxisTicks={[0, 25, 50, 75, 100]}
            showPeriodOptions={false}
            showCurrentValue={false}
            chartType="area"
            chartHeight={160}
            currentValue={displaySpeed}
          />
        </div>
      </div>
      <div className="w-[340px] shrink-0 flex flex-col gap-4 min-h-0 overflow-y-auto">
        <VehicleOverviewCard
          className="shrink-0"
          title="Vehicle State"
          showImage={false}
          subtitle={`Backed by report ${formatClock(startSeconds + Math.max(0, (currentSample?.elapsedSeconds ?? 0) - 12))} - 1.2s before playback. Next report 30s cadence.`}
          headerRight={
            <StatusBadge variant="warning">
              Interpolated
            </StatusBadge>
          }
          details={stateDetails}
          footer={
            <div className="flex items-center gap-4 text-breadcrumb-root" style={{ fontSize: "11px" }}>
              <LegendDot color={DOT_PRODUCED} label="Produced" />
              <LegendDot color={DOT_INTERPOLATED} label="Interpolated" />
              <LegendDot color={DOT_HEARTBEAT} label="Heart beat" />
            </div>
          }
        />
        <EventTrackingCard
          className="min-h-[280px] flex-1"
          events={activeEvents}
          tripPoints={activePoints}
          startSeconds={startSeconds}
        />
      </div>
    </div>
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Vehicle Register", href: "/falcon/vehicle-register" },
          { label: vehicle.plateNumber, href: `/falcon/vehicle-register/${vehicle.id}/activity` },
          { label: "Trips" },
        ]}
      />

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 shrink-0">
          <div className="flex items-center gap-2">
            <BackButton onClick={() => navigate(`/falcon/vehicle-register/${vehicle.id}/activity`)} />
            <h1
              className="flex items-end gap-1 font-semibold text-sidebar-item-active"
              style={{ fontSize: "22px" }}
            >
              {vehicle.plateNumber}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
          </div>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root">
            Live tracking and historical trip playback
          </p>
          <StatusTabs
            className="px-0 mt-4"
            tabs={[
              { id: "live", label: "Live tracking" },
              { id: "trips", label: "Trips", count: trips.length },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setSampled(null)
              setLiveSpeed(null)
              if (tabId === "live") setLiveTrace([])
              setActiveTab(tabId)
            }}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-auto px-6 py-4">
          <div className="flex gap-4 h-full min-h-[760px]">
            {isLiveTab ? (
              dashboard
            ) : (
              <>
                <div className="w-[340px] shrink-0 border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-start justify-between">
                  <div>
                    <p className="text-gray-950" style={{ fontSize: "28px", fontWeight: 600, lineHeight: 1 }}>
                      {trips.length}
                    </p>
                    <p className="text-breadcrumb-root mt-1" style={{ fontSize: "13px" }}>
                      Total Trips
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success("Trip list refreshed")}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                    aria-label="Refresh trips"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {trips.map((trip) => (
                    <TripListCard
                      key={trip.id}
                      trip={trip}
                      isSelected={trip.id === selectedTrip?.id}
                      onClick={() => {
                        setSampled(null)
                        setSelectedTripId(trip.id)
                      }}
                    />
                  ))}
                </div>
              </div>
              {dashboard}
            </>
          )}
          </div>
        </div>
      </div>
    </>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
