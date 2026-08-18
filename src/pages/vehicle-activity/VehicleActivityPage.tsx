import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  TopBar,
  BackButton,
  VehicleOverviewCard,
  AssignmentHistoryCard,
  StatCard,
} from "@/components/max"
import { getVehicleById } from "@/data/mockVehicleRegister"
import {
  getVehicleActivity,
  getVehicleOverviewImage,
} from "@/data/mockVehicleActivity"
import { ChargeStopsCard } from "@/pages/charger-register/ChargeStopsCard"
import { LiveTrackingMap } from "./LiveTrackingMap"
import { BatteryInfoCard } from "./BatteryInfoCard"
import { BatterySwapHistoryModal } from "./BatterySwapHistoryModal"
import { ChargerInfoCard } from "./ChargerInfoCard"
import { ImmobilizationCard } from "./ImmobilizationCard"
import { ImmobilizeVehicleModal } from "./ImmobilizeVehicleModal"
import { DriverScoreCard } from "./DriverScoreCard"
import { EnforcementHistoryCard } from "./EnforcementHistoryCard"
import { EnforcementHistoryModal } from "./EnforcementHistoryModal"

const COLOR_GREEN = "var(--color-success)"
const COLOR_INFO = "var(--color-status-info)"
const COLOR_WARNING = "var(--color-status-warning)"
const COLOR_GRAY = "var(--color-gray-400)"
const COLOR_AMBER = "var(--color-status-amber)"
const COLOR_DANGER = "var(--color-danger)"

export default function VehicleActivityPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicle = getVehicleById(id || "")
  const activity = getVehicleActivity(id || "")
  const [immobilized, setImmobilized] = useState(activity?.immobilized ?? false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [swapHistoryOpen, setSwapHistoryOpen] = useState(false)
  const [enforcementOpen, setEnforcementOpen] = useState(false)

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

  const isEV = vehicle.category === "ev"

  const overviewDetails = [
    { label: "Vehicle type", value: vehicle.vehicleType },
    { label: "Vehicle model", value: vehicle.vehicleModel },
    { label: "Odometer", value: `${activity.odometerKm.toLocaleString()} km` },
    { label: "Trip", value: `${activity.tripPoints[activity.tripPoints.length - 1]?.distanceKm.toFixed(3) ?? "0"} km` },
    {
      label: "Geofence",
      value: activity.geofence === "inside" ? "Inside Zone" : "Outside Zone",
      isStatus: true,
      statusVariant: activity.geofence === "inside" ? ("success" as const) : ("danger" as const),
    },
    {
      label: "Contract status",
      value: activity.contractStatus,
      isStatus: true,
      statusVariant: activity.contractStatus === "Active" ? ("success" as const) : ("warning" as const),
    },
    {
      label: "Ignition",
      value: activity.ignition === "ON" ? "On" : "Off",
      isStatus: true,
      statusVariant: activity.ignition === "ON" ? ("success" as const) : ("danger" as const),
    },
    {
      label: "Shutoff status",
      value: immobilized ? "Immobilised" : "Mobilised",
      isStatus: true,
      statusVariant: immobilized ? ("danger" as const) : ("success" as const),
    },
    { label: "IMEI", value: activity.imei },
    { label: "Last updated by", value: activity.lastUpdatedBy },
    { label: "Last pinged on", value: activity.lastPingedOn },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Vehicle Register", href: "/falcon/vehicle-register" },
          { label: vehicle.plateNumber },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-center gap-2">
            <BackButton onClick={() => navigate("/falcon/vehicle-register")} />
            <h1
              className="flex items-end gap-1 font-semibold text-sidebar-item-active"
              style={{ fontSize: "22px" }}
            >
              {vehicle.plateNumber}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
          </div>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root">
            Live tracking, vehicle health, and trip activity
          </p>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex gap-4 items-stretch">
            <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
              <LiveTrackingMap
                className="flex-1 min-h-0"
                vehicleType={vehicle.vehicleType}
                category={vehicle.category}
                trackingStatus={vehicle.trackingStatus}
                tripPoints={activity.tripPoints}
                tripEvents={activity.tripEvents}
                plateNumber={vehicle.plateNumber}
                address={activity.liveAddress}
                onViewAllTrips={() => navigate(`/falcon/vehicle-register/${vehicle.id}/trips`)}
              />
              {isEV && activity.battery && activity.charger && (
                <div className="grid grid-cols-2 gap-4 shrink-0 items-stretch">
                  <BatteryInfoCard
                    className="h-full"
                    stateOfCharge={activity.battery.stateOfCharge}
                    batteryId={activity.battery.batteryId}
                    stateOfHealth={activity.battery.stateOfHealth}
                    estimatedRangeKm={activity.battery.estimatedRangeKm}
                    chargeCycle={activity.battery.chargeCycle}
                    onSwapHistoryClick={() => setSwapHistoryOpen(true)}
                  />
                  <ChargerInfoCard
                    className="h-full"
                    chargerId={activity.charger.chargerId}
                    status={activity.charger.status}
                    chargeSessions={activity.charger.chargeSessions}
                    topChargingSpot={activity.charger.topChargingSpot}
                  />
                </div>
              )}
              {!isEV && (
                <div className="grid grid-cols-2 gap-4 shrink-0 items-stretch">
                  <DriverScoreCard
                    className="h-full"
                    score={activity.driverScore.score}
                    trendPercent={activity.driverScore.trendPercent}
                    trendDirection={activity.driverScore.trendDirection}
                    radar={activity.driverScore.radar}
                  />
                  <EnforcementHistoryCard
                    className="h-full"
                    count={activity.enforcement.count}
                    latest={activity.enforcement.latest}
                    onViewAllClick={() => setEnforcementOpen(true)}
                  />
                </div>
              )}
            </div>
            <div className="w-[340px] shrink-0 flex flex-col gap-4">
              <VehicleOverviewCard
                status={vehicle.lifecycleStatus}
                statusVariant={
                  vehicle.lifecycleStatus === "Active" || vehicle.lifecycleStatus === "Operational Fleet"
                    ? "success"
                    : vehicle.lifecycleStatus === "Exit"
                      ? "danger"
                      : "info"
                }
                imageUrl={getVehicleOverviewImage(vehicle.vehicleType, vehicle.category)}
                details={overviewDetails}
              />
              <AssignmentHistoryCard
                title="Current Assignment"
                assignments={activity.assignments.filter((assignment) => assignment.isCurrent)}
                currentIndex={0}
                onPrevious={() => {}}
                onNext={() => {}}
                showNavigation={false}
              />
            </div>
          </div>

          {isEV ? (
            <>
              <div className="grid grid-cols-3 gap-4 items-stretch">
                <DriverScoreCard
                  className="h-full"
                  score={activity.driverScore.score}
                  trendPercent={activity.driverScore.trendPercent}
                  trendDirection={activity.driverScore.trendDirection}
                  radar={activity.driverScore.radar}
                />
                <EnforcementHistoryCard
                  className="h-full"
                  count={activity.enforcement.count}
                  latest={activity.enforcement.latest}
                  onViewAllClick={() => setEnforcementOpen(true)}
                />
                <ImmobilizationCard
                  className="h-full"
                  immobilized={immobilized}
                  onImmobiliseClick={() => setConfirmOpen(true)}
                  onDiagnosticsClick={() => toast.success("Diagnostics request sent")}
                />
              </div>
              <ChargeStopsCard
                chargeStops={activity.primeStops}
                title="Prime Stops"
                viewAllLabel="VIEW ALL STOPS"
                countNoun="Prime stop"
                emptyLabel="No prime stops recorded"
                onViewAllClick={() => navigate(`/falcon/vehicle-register/${vehicle.id}/stops`)}
              />
            </>
          ) : (
            <div className="grid gap-4 items-stretch" style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,7fr)" }}>
              <ImmobilizationCard
                className="h-full"
                immobilized={immobilized}
                onImmobiliseClick={() => setConfirmOpen(true)}
                onDiagnosticsClick={() => toast.success("Diagnostics request sent")}
              />
              <ChargeStopsCard
                className="h-full"
                chargeStops={activity.primeStops}
                title="Prime Stops"
                viewAllLabel="VIEW ALL STOPS"
                countNoun="Prime stop"
                emptyLabel="No prime stops recorded"
                onViewAllClick={() => navigate(`/falcon/vehicle-register/${vehicle.id}/stops`)}
              />
            </div>
          )}

          <div className="bg-content-card border border-border rounded-lg p-5">
            <h3 className="text-sidebar-item-active mb-4" style={{ fontSize: "16px", fontWeight: 500 }}>
              Reports
            </h3>
            <div className="grid grid-cols-6 gap-4">
              <StatCard
                title="Total trips"
                value={activity.reports.totalTrips.toLocaleString()}
                indicatorColor={COLOR_GREEN}
              />
              <StatCard
                title="Total distance"
                value={`${activity.reports.totalDistanceKm.toLocaleString()} KM`}
                indicatorColor={COLOR_INFO}
              />
              <StatCard
                title="Average speed"
                value={`${activity.reports.averageSpeedKmph} KMPH`}
                indicatorColor={COLOR_WARNING}
              />
              <StatCard
                title="Total trip duration"
                value={`${activity.reports.totalDurationHours.toLocaleString()} hrs`}
                indicatorColor={COLOR_GRAY}
              />
              <StatCard
                title="Total stop duration"
                value={`${activity.reports.totalStopDurationHours.toLocaleString()} hrs`}
                indicatorColor={COLOR_AMBER}
              />
              <StatCard
                title="Alert count"
                value={activity.reports.alertCount.toLocaleString()}
                indicatorColor={COLOR_DANGER}
              />
            </div>
          </div>
        </div>
      </div>

      <EnforcementHistoryModal
        open={enforcementOpen}
        onOpenChange={setEnforcementOpen}
        events={activity.enforcement.history}
      />

      <BatterySwapHistoryModal
        open={swapHistoryOpen}
        onOpenChange={setSwapHistoryOpen}
        plateNumber={vehicle.plateNumber}
        batteryId={activity.battery?.batteryId ?? ""}
        swaps={activity.battery?.swapHistory ?? []}
      />

      <ImmobilizeVehicleModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        immobilized={immobilized}
        plateNumber={vehicle.plateNumber}
        championName={vehicle.assignedDriver ?? "Unassigned"}
        imei={activity.imei}
        vehicleType={vehicle.vehicleType}
        category={vehicle.category}
        currentSpeed={vehicle.speed ?? 0}
        onConfirm={({ reason }) => {
          const nextImmobilized = !immobilized
          setImmobilized(nextImmobilized)
          setConfirmOpen(false)
          toast.success(
            nextImmobilized ? "Vehicle immobilised" : "Vehicle mobilised",
            { description: reason }
          )
        }}
      />
    </>
  )
}
