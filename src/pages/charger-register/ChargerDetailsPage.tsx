import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import {
  TopBar,
  InfoCard,
  InfoGrid,
  BackButton,
  StatusBadge,
  StatCard,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getChargerById, type ChargerStatus, type LifecycleStatus } from "@/data/mockChargerData"
import { ChargingSessionsTab } from "./ChargingSessionsTab"

const COLOR_SUCCESS = "var(--color-success)"
const COLOR_INFO = "var(--color-status-info)"
const COLOR_WARNING = "var(--color-status-warning)"
const COLOR_GRAY = "var(--color-gray-400)"

const statusToVariant: Record<ChargerStatus, "success" | "danger" | "warning" | "info" | "neutral"> = {
  online: "success",
  charging: "info",
  pending: "warning",
  offline: "neutral",
}

const statusLabels: Record<ChargerStatus, string> = {
  online: "Online",
  charging: "Charging",
  pending: "Pending",
  offline: "Offline",
}

const lifecycleToVariant: Record<LifecycleStatus, "success" | "danger" | "warning"> = {
  active: "success",
  inactive: "danger",
  maintenance: "warning",
}

const lifecycleLabels: Record<LifecycleStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  maintenance: "Maintenance",
}

export default function ChargerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") || "info"
  const charger = getChargerById(id || "")

  if (!charger) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Falcon" },
            { label: "EV Chargers", href: "/falcon/ev-chargers" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Charger not found</p>
        </div>
      </>
    )
  }

  const stats = [
    {
      title: "Total sessions",
      value: charger.totalSessions.toLocaleString(),
      indicatorColor: COLOR_SUCCESS,
    },
    {
      title: "Total charging time",
      value: charger.totalChargingTime,
      indicatorColor: COLOR_INFO,
    },
    {
      title: "Days online",
      value: `${charger.daysOnline} Days`,
      indicatorColor: COLOR_WARNING,
    },
    {
      title: "Average session duration",
      value: charger.averageSessionDuration,
      indicatorColor: COLOR_GRAY,
    },
  ]

  const chargerDetailsItems = [
    { label: "Charger ID", value: charger.id },
    { label: "IMEI", value: charger.imei },
    { label: "Manufacturer", value: charger.manufacturer },
    { label: "Charger Model", value: charger.chargerModel },
    { label: "Charger Type", value: charger.chargerType },
    { label: "State Deployed", value: charger.stateDeployed },
    { label: "Location", value: charger.currentLocation },
  ]

  const statusAssignmentItems = [
    {
      label: "Assigned to",
      value: charger.assignedTo ? (
        <span className="inline-flex items-center gap-2">
          {charger.assignedToAvatar && (
            <img
              src={charger.assignedToAvatar}
              alt={charger.assignedTo}
              className="h-6 w-6 rounded-full object-cover"
            />
          )}
          {charger.assignedTo}
        </span>
      ) : (
        "-"
      ),
    },
    { label: "Assigned Date", value: charger.assignedDate || "-" },
    {
      label: "Current Battery Assigned",
      value: charger.currentBatteryAssigned ? (
        <button
          type="button"
          onClick={() =>
            navigate(`/falcon/batteries/${charger.currentBatteryAssigned}?tab=info`, {
              state: { from: `/falcon/ev-chargers/${charger.id}` },
            })
          }
          className="hover:underline"
          style={{ fontSize: "inherit", fontWeight: 600, color: "#E88E15" }}
        >
          {charger.currentBatteryAssigned}
        </button>
      ) : (
        "-"
      ),
    },
    {
      label: "Telemetry Status",
      value: (
        <StatusBadge variant={statusToVariant[charger.status]}>
          {statusLabels[charger.status]}
        </StatusBadge>
      ),
    },
    {
      label: "Lifecycle Status",
      value: (
        <StatusBadge variant={lifecycleToVariant[charger.lifecycleStatus]}>
          {lifecycleLabels[charger.lifecycleStatus]}
        </StatusBadge>
      ),
    },
    { label: "Last Transmission", value: charger.lastTransmission },
    { label: "Last Reported Time", value: charger.lastReportedTime },
    { label: "Firmware", value: charger.firmware },
    { label: "Hardware Version", value: charger.hardwareVersion },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "EV Chargers", href: "/falcon/ev-chargers" },
          { label: charger.id },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/falcon/ev-chargers")} />
                <h1
                  className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                  style={{ fontSize: "22px" }}
                >
                  {charger.id}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing charger information and charging session data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90"
                onClick={() =>
                  navigate(`/falcon/ev-chargers/${charger.id}/charge-spots`, {
                    state: { from: `/falcon/ev-chargers/${charger.id}` },
                  })
                }
              >
                <img
                  src="/images/charge_spot.svg"
                  alt=""
                  className="h-5 w-5"
                />
                View Charge Spots
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-6">
          <Tabs defaultValue={initialTab} className="flex flex-col">
            <TabsList variant="line" className="shrink-0 pb-0 gap-0">
              <TabsTrigger
                value="info"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Charger Information
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Charging Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4 flex-1 min-h-0">
              {/* Combined sections — same pattern as Vehicle Details Basic Information */}
              <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                <InfoCard title="CHARGER DETAILS">
                  <InfoGrid
                    columns={2}
                    showDividers
                    items={chargerDetailsItems}
                  />
                </InfoCard>

                <InfoCard title="CURRENT STATUS AND ASSIGNMENT">
                  <InfoGrid
                    columns={2}
                    showDividers
                    items={statusAssignmentItems}
                  />
                </InfoCard>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="mt-4 flex-1 min-h-0">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    indicatorColor={stat.indicatorColor}
                  />
                ))}
              </div>
              <ChargingSessionsTab chargerId={charger.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
