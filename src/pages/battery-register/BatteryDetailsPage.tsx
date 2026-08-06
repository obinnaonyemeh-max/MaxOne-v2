import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { TopBar, InfoCard, InfoGrid, BackButton, StatusBadge } from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getBatteryById, mockTrendData } from "@/data/mockBatteryRegisterData"
import { ChargeInfoCard } from "./ChargeInfoCard"
import { BatteryMetricCard } from "./BatteryMetricCard"
import { TrendChartCard } from "./TrendChartCard"
import { SOHTrendCard } from "./SOHTrendCard"
import { CellVoltageCard } from "./CellVoltageCard"
import { AlertHistoryTab } from "./AlertHistoryTab"
import { MovementHistoryTab } from "./MovementHistoryTab"
import { CommandCenterTab } from "./CommandCenterTab"

const assignmentStatusToVariant: Record<string, "success" | "default" | "warning"> = {
  assigned: "success",
  unassigned: "default",
  maintenance: "warning",
}

const assignmentStatusLabels: Record<string, string> = {
  assigned: "Assigned",
  unassigned: "Unassigned",
  maintenance: "Maintenance",
}

export default function BatteryDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") || "info"
  const fromPath = (location.state as { from?: string } | null)?.from
  const battery = getBatteryById(id || "")

  if (!battery) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Falcon" },
            { label: "Batteries" },
            { label: "Register", href: "/falcon/batteries/register" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Battery not found</p>
        </div>
      </>
    )
  }

  const batteryDetailsItems = [
    { label: "State of Charge", value: `${battery.stateOfCharge}%` },
    { label: "SIM Number", value: battery.simNumber },
    { label: "Unique ID", value: battery.uniqueId },
    { label: "IMEI Number", value: battery.imeiNumber },
    { label: "Model", value: battery.batteryModel },
    { label: "Capacity", value: `${battery.capacity} Ah` },
    { label: "Owner", value: battery.owner },
    {
      label: "Assignment Status",
      value: (
        <StatusBadge
          variant={assignmentStatusToVariant[battery.assignmentStatus] || "default"}
        >
          {assignmentStatusLabels[battery.assignmentStatus] || battery.assignmentStatus}
        </StatusBadge>
      ),
    },
    { label: "Current Location", value: `Lat ${battery.location.lat}, Long ${battery.location.lng}` },
    { label: "Current Station", value: battery.currentStation },
    { label: "Battery Management System Number", value: battery.bmsNumber },
    { label: "Registration Date", value: battery.registrationDate },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Batteries" },
          { label: "Register", href: "/falcon/batteries/register" },
          { label: battery.id },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-2">
            <BackButton
              onClick={() =>
                navigate(fromPath || "/falcon/batteries/register")
              }
            />
            <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
              {battery.id}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
          </div>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root">
            Showing battery information and telemetry data
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-6">
          <Tabs defaultValue={initialTab} className="flex flex-col">
            <TabsList variant="line" className="shrink-0 pb-0 gap-0">
              <TabsTrigger
                value="info"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Battery Information
              </TabsTrigger>
              <TabsTrigger
                value="telemetry"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Telemetry
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Alert History
              </TabsTrigger>
              <TabsTrigger
                value="movement"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Movement History
              </TabsTrigger>
              <TabsTrigger
                value="command"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Command Center
              </TabsTrigger>
            </TabsList>

            {/* Battery Information Tab */}
            <TabsContent value="info" className="mt-0">
              <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                <InfoCard title="BATTERY DETAILS">
                  <InfoGrid columns={2} showDividers items={batteryDetailsItems} />
                </InfoCard>
              </div>
            </TabsContent>

            {/* Telemetry Tab */}
            <TabsContent value="telemetry" className="mt-0">
              <div className="flex flex-col gap-4">
                {/* Row 1: Charge Info + Metric Cards (40%) | SOC Trend (60%) */}
                <div className="grid gap-4" style={{ gridTemplateColumns: "40% 1fr" }}>
                  {/* Left Column: Charge Info + Metric Cards */}
                  <div className="flex flex-col gap-4">
                    <ChargeInfoCard
                      status={battery.status}
                      stateOfCharge={battery.stateOfCharge}
                      stateOfHealth={battery.stateOfHealth}
                      distanceLeft={battery.distanceLeft}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <BatteryMetricCard
                        iconSrc="/images/voltage.svg"
                        label="Voltage"
                        value={battery.voltage}
                        unit="Volts"
                      />
                      <BatteryMetricCard
                        iconSrc="/images/current.svg"
                        label="Current"
                        value={battery.current}
                        unit="Amps"
                      />
                      <BatteryMetricCard
                        iconSrc="/images/temp.svg"
                        label="Temperature"
                        value={battery.temperature}
                        unit="°"
                        showAlert={battery.alerts.some(alert => alert.type === "over-temperature")}
                      />
                    </div>
                  </div>
                  {/* Right Column: SOC Trend (60%) */}
                  <TrendChartCard
                    title="State of Charge Trend"
                    currentValue={battery.stateOfCharge}
                    currentValueLabel="Current State of Charge"
                    unit="%"
                    data={mockTrendData.socTrend}
                    lineColor="var(--color-success)"
                    valueColor="text-success"
                    periodOptions={[
                      { value: "1h", label: "1H" },
                      { value: "24h", label: "24H" },
                      { value: "7d", label: "7D" },
                    ]}
                  />
                </div>

                {/* Row 2: SOH Trend + Temperature Trend */}
                <div className="grid grid-cols-2 gap-4">
                  <SOHTrendCard
                    currentSOH={battery.stateOfHealth}
                    sohHistory={battery.sohHistory}
                  />
                  <TrendChartCard
                    title="Temperature Trend"
                    currentValue={battery.temperature}
                    currentValueLabel="Current Temperature"
                    unit="° Celsius"
                    data={mockTrendData.temperatureTrend}
                    lineColor="var(--color-status-danger)"
                    valueColor="text-status-danger"
                    yAxisDomain={[0, 120]}
                    yAxisTicks={[0, 50, 100]}
                  />
                </div>

                {/* Row 3: Voltage Trend + Current Trend */}
                <div className="grid grid-cols-2 gap-4">
                  <TrendChartCard
                    title="Voltage Trend"
                    currentValue={battery.voltage}
                    currentValueLabel="Current Voltage"
                    unit=" Volts"
                    data={mockTrendData.voltageTrend}
                    lineColor="var(--color-status-info)"
                    valueColor="text-status-info"
                    yAxisDomain={[0, 120]}
                    yAxisTicks={[0, 50, 100]}
                  />
                  <TrendChartCard
                    title="Current Trend"
                    currentValue={battery.current}
                    currentValueLabel="Current Temperature"
                    unit=" Amps"
                    data={mockTrendData.currentTrend}
                    lineColor="var(--color-status-info)"
                    valueColor="text-status-info"
                    yAxisDomain={[0, 120]}
                    yAxisTicks={[0, 50, 100]}
                  />
                </div>

                {/* Row 4: Cell Voltage Distribution */}
                <CellVoltageCard cellVoltages={battery.cellVoltages} />
              </div>
            </TabsContent>

            {/* Alert History Tab */}
            <TabsContent value="alerts" className="mt-0">
              <AlertHistoryTab />
            </TabsContent>

            {/* Movement History Tab */}
            <TabsContent value="movement" className="mt-0">
              <MovementHistoryTab />
            </TabsContent>

            {/* Command Center Tab */}
            <TabsContent value="command" className="mt-0">
              <CommandCenterTab 
                batteryId={battery.id} 
                batteryInfo={{
                  id: battery.id,
                  status: battery.status,
                  currentRider: battery.assignedTo || "Temilade Osuji",
                  currentVehicle: "MAX-38849",
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
