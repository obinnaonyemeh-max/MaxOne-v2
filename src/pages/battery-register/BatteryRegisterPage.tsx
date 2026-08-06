import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import {
  TopBar,
  PageHeader,
  BatteryStatusFilterChips,
  BatteryListCard,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  mockBatteryRegisterItems,
  batteryStatusCounts,
  totalBatteries,
  type BatteryRegisterItem,
} from "@/data/mockBatteryRegisterData"
import { ChargeInfoCard } from "./ChargeInfoCard"
import { BatteryLocationCard } from "./BatteryLocationCard"
import { BatteryMetricCard } from "./BatteryMetricCard"
import { SOHTrendCard } from "./SOHTrendCard"
import { BatteryAlertsCard } from "./BatteryAlertsCard"
import { CellVoltageCard } from "./CellVoltageCard"

export default function BatteryRegisterPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedBatteryId, setSelectedBatteryId] = useState<string | null>(
    mockBatteryRegisterItems[0]?.id ?? null
  )
  const [expandedBatteryId, setExpandedBatteryId] = useState<string | null>(null)

  const filterChips = batteryStatusCounts.map((item) => ({
    id: item.status,
    label: item.label,
    count: item.count,
    color: item.color,
  }))

  const filteredBatteries = useMemo(() => {
    if (!activeFilter) return mockBatteryRegisterItems
    return mockBatteryRegisterItems.filter((b) => b.status === activeFilter)
  }, [activeFilter])

  const selectedBattery: BatteryRegisterItem | undefined = useMemo(() => {
    return mockBatteryRegisterItems.find((b) => b.id === selectedBatteryId)
  }, [selectedBatteryId])

  const displayCount = activeFilter
    ? filteredBatteries.length
    : totalBatteries

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Batteries" },
          { label: "Register" },
        ]}
      />

      <PageHeader
        title="Battery Register"
        subtitle="View and manage all batteries in your fleet with real-time status and health metrics."
        className="shrink-0"
      />

      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Battery List */}
        <div className="w-[390px] shrink-0 border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="text-gray-950"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {displayCount.toLocaleString()}
                </h2>
                <span
                  className="text-gray-500"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Total Batteries
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  // Refresh action
                }}
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* Status Filter Chips */}
            <BatteryStatusFilterChips
              chips={filterChips}
              activeChipId={activeFilter}
              onChipClick={setActiveFilter}
            />
          </div>

          {/* Battery List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredBatteries.map((battery) => (
              <BatteryListCard
                key={battery.id}
                id={battery.id}
                status={battery.status}
                lastUpdate={battery.lastUpdate}
                chargeLevel={battery.stateOfCharge}
                isCharging={battery.isCharging}
                isPluggedIn={battery.isPluggedIn}
                isSelected={selectedBatteryId === battery.id}
                isExpanded={expandedBatteryId === battery.id}
                simNumber={battery.simNumber}
                assignmentStatus={battery.assignmentStatus}
                assignedTo={battery.assignedTo}
                currentLocation={battery.lastSeen}
                batteryModel={battery.batteryModel}
                lastReportedTime={battery.lastReportedTime}
                lastSwapTime={battery.lastSwapTime}
                onClick={() => setSelectedBatteryId(battery.id)}
                onExpandClick={() => setExpandedBatteryId(
                  expandedBatteryId === battery.id ? null : battery.id
                )}
                onMenuItemClick={(action) => {
                  const tabMap: Record<string, string> = {
                    "telemetry": "telemetry",
                    "alert-history": "alerts",
                    "movement-history": "movement",
                    "command-center": "command",
                  }
                  const tab = tabMap[action]
                  if (tab) {
                    navigate(`/falcon/batteries/${battery.id}?tab=${tab}`)
                  }
                }}
                onViewFullInfo={() => navigate(`/falcon/batteries/${battery.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Battery Details */}
        <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-6">
          {selectedBattery ? (
            <>
              {/* Battery Overview Header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-gray-950"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  Battery Overview
                </h2>
                <button
                  onClick={() => navigate(`/falcon/batteries/${selectedBattery.id}`)}
                  className="hover:underline"
                  style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
                >
                  VIEW FULL INFO
                </button>
              </div>

              {/* Top Section: Charge Info with Metrics (left) + Location (right) */}
              <div className="grid grid-cols-2 gap-4 mb-4 items-stretch">
                {/* Left Column: Charge Info + Metric Cards */}
                <div className="flex flex-col gap-4">
                  <ChargeInfoCard
                    status={selectedBattery.status}
                    stateOfCharge={selectedBattery.stateOfCharge}
                    stateOfHealth={selectedBattery.stateOfHealth}
                    distanceLeft={selectedBattery.distanceLeft}
                    className="flex-1"
                  />
                  {/* Metric Cards - same width as Charge Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <BatteryMetricCard
                      iconSrc="/images/voltage.svg"
                      label="Voltage"
                      value={selectedBattery.voltage}
                      unit="Volts"
                    />
                    <BatteryMetricCard
                      iconSrc="/images/current.svg"
                      label="Current"
                      value={selectedBattery.current}
                      unit="Amps"
                    />
                    <BatteryMetricCard
                      iconSrc="/images/temp.svg"
                      label="Temperature"
                      value={selectedBattery.temperature}
                      unit="°"
                      showAlert={selectedBattery.alerts.some(alert => alert.type === "over-temperature")}
                    />
                  </div>
                </div>
                
                {/* Right Column: Location */}
                <BatteryLocationCard
                  location={selectedBattery.location}
                  lastSeen={selectedBattery.lastSeen}
                  lastPinged={selectedBattery.lastPinged}
                />
              </div>

              {/* Middle Row: SOH Trend (55%) + Alerts (45%) */}
              <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "55% 1fr" }}>
                <SOHTrendCard
                  currentSOH={selectedBattery.stateOfHealth}
                  sohHistory={selectedBattery.sohHistory}
                />
                <BatteryAlertsCard
                  alerts={selectedBattery.alerts}
                />
              </div>

              {/* Bottom Row: Cell Voltage Distribution */}
              <CellVoltageCard
                cellVoltages={selectedBattery.cellVoltages}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500" style={{ fontSize: "14px" }}>
                Select a battery to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
