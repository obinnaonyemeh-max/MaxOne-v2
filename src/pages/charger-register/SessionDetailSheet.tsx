import { useEffect, useMemo, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { StatusBadge, StatusTimeline } from "@/components/max"
import { BatteryMetricCard } from "@/pages/battery-register/BatteryMetricCard"
import { TrendChartCard } from "@/pages/battery-register/TrendChartCard"
import type { ChargingSessionDetail, ChargingSessionStatus } from "@/data/mockChargerData"

interface SessionDetailSheetProps {
  session: ChargingSessionDetail | null
  isOpen: boolean
  onClose: () => void
}

const statusToVariant: Record<ChargingSessionStatus, "success" | "danger" | "warning"> = {
  COMPLETED: "success",
  FAULTED: "danger",
  "IN PROGRESS": "warning",
}

const statusLabels: Record<ChargingSessionStatus, string> = {
  COMPLETED: "Completed",
  FAULTED: "Faulted",
  "IN PROGRESS": "In Progress",
}

const chartTabs = [
  { value: "soc", label: "SOC" },
  { value: "power", label: "Power" },
  { value: "temperature", label: "Temperature" },
]

export function SessionDetailSheet({ session, isOpen, onClose }: SessionDetailSheetProps) {
  const [chartTab, setChartTab] = useState("soc")

  useEffect(() => {
    setChartTab("soc")
  }, [session?.id])

  const chartConfig = useMemo(() => {
    if (!session) return null

    if (chartTab === "power") {
      return {
        title: "Performance Charts",
        currentValueLabel: "Peak Power",
        currentValue: session.peakCurrent,
        unit: " Amps",
        data: session.powerChart,
        lineColor: "var(--color-status-info)",
        valueColor: "text-status-info",
        yAxisDomain: [0, 50] as [number, number],
        yAxisTicks: [0, 25, 50],
      }
    }

    if (chartTab === "temperature") {
      return {
        title: "Performance Charts",
        currentValueLabel: "Peak Temperature",
        currentValue: session.peakTemperature,
        unit: "°C",
        data: session.temperatureChart,
        lineColor: "var(--color-status-warning)",
        valueColor: "text-status-warning",
        yAxisDomain: [0, 60] as [number, number],
        yAxisTicks: [0, 30, 60],
      }
    }

    return {
      title: "Performance Charts",
      currentValueLabel: "State of Charge",
      currentValue: session.socEnd,
      unit: "%",
      data: session.socChart,
      lineColor: "var(--color-success)",
      valueColor: "text-success",
      yAxisDomain: [0, 100] as [number, number],
      yAxisTicks: [0, 50, 100],
    }
  }, [chartTab, session])

  if (!session || !chartConfig) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">
              {session.sessionId}
            </SheetTitle>
            <StatusBadge variant={statusToVariant[session.status]}>
              {statusLabels[session.status]}
            </StatusBadge>
          </div>
          <SheetDescription>
            {session.timeRange}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <BatteryMetricCard
              iconSrc="/images/charge_fet.svg"
              label="Energy Delivered"
              value={session.energyDelivered}
              unit="kWh"
            />
            <BatteryMetricCard
              iconSrc="/images/voltage.svg"
              label="Peak Voltage"
              value={session.peakVoltage}
              unit="Volts"
            />
            <BatteryMetricCard
              iconSrc="/images/current.svg"
              label="Peak Current"
              value={session.peakCurrent}
              unit="Amps"
            />
            <BatteryMetricCard
              iconSrc="/images/temp.svg"
              label="Peak Temperature"
              value={session.peakTemperature}
              unit="° Celsius"
              valueColor="text-status-danger"
              showAlert
            />
            <BatteryMetricCard
              iconSrc="/images/soh_low.svg"
              label="SOC Start"
              value={session.socStart}
              unit="percent"
              valueColor="text-status-danger"
            />
            <BatteryMetricCard
              iconSrc="/images/charge_fet.svg"
              label="SOC End"
              value={session.socEnd}
              unit="percent"
              valueColor="text-success"
            />
          </div>

          {/* Performance Charts */}
          <TrendChartCard
            key={`${session.id}-${chartTab}`}
            title={chartConfig.title}
            currentValue={chartConfig.currentValue}
            currentValueLabel={
              chartTab === "soc"
                ? `State of Charge - ${session.socStart}% → ${session.socEnd}%`
                : chartConfig.currentValueLabel
            }
            unit={chartConfig.unit}
            data={chartConfig.data}
            lineColor={chartConfig.lineColor}
            valueColor={chartConfig.valueColor}
            yAxisDomain={chartConfig.yAxisDomain}
            yAxisTicks={chartConfig.yAxisTicks}
            periodOptions={chartTabs}
            defaultPeriod={chartTab}
            onPeriodChange={setChartTab}
          />

          {/* Session Timeline */}
          <div className="bg-content-card border border-border rounded-lg p-5">
            <h3
              className="text-sidebar-item-active mb-4"
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              Session Timeline
            </h3>
            <StatusTimeline entries={session.timeline} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
