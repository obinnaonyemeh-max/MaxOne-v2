import { BatteryLevelIcon, StatusBadge } from "@/components/max"
import type { StationBattery, StationBatteryEventType } from "@/data/mockStationsData"

export type StationBatteryChargeStatus = "charging" | "plugged-in" | "idle"

const statusLabel: Record<StationBatteryChargeStatus, string> = {
  charging: "CHARGING",
  "plugged-in": "PLUGGED IN",
  idle: "IDLE",
}

const statusVariant: Record<
  StationBatteryChargeStatus,
  "info" | "danger" | "warning"
> = {
  charging: "info",
  "plugged-in": "danger",
  idle: "warning",
}

const eventTypeLabel: Record<StationBatteryEventType, string> = {
  "battery-swap": "BATTERY SWAP",
  "checked-in": "CHECKED IN",
  "assigned-to-vehicle": "ASSIGNED TO VEHICLE",
  transfer: "TRANSFER",
  "recovery-action": "RECOVERY ACTION",
}

const eventTypeVariant: Record<
  StationBatteryEventType,
  "success" | "default" | "yard" | "warning" | "danger"
> = {
  "battery-swap": "success",
  "checked-in": "default",
  "assigned-to-vehicle": "yard",
  transfer: "warning",
  "recovery-action": "danger",
}

const pillStyle = { fontSize: "9px", letterSpacing: "0.05em", padding: "2px 6px" } as const

export function getStationBatteryChargeStatus(
  battery: StationBattery
): StationBatteryChargeStatus {
  if (battery.isCharging) return "charging"
  if (battery.isPluggedIn) return "plugged-in"
  return "idle"
}

interface StationBatteryGridCardProps {
  battery: StationBattery
  onClick?: () => void
}

export function StationBatteryGridCard({
  battery,
  onClick,
}: StationBatteryGridCardProps) {
  const status = getStationBatteryChargeStatus(battery)
  const clickable = Boolean(onClick)

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={
        clickable
          ? "flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-950"
          : "flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4"
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
          <img
            src="/images/falcon_battery.svg"
            alt=""
            className="h-6 w-6 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="truncate text-gray-950"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              {battery.id}
            </h3>
            <BatteryLevelIcon
              chargeLevel={battery.stateOfCharge}
              isCharging={battery.isCharging}
              isPluggedIn={battery.isPluggedIn}
              className="mt-0.5 shrink-0"
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <StatusBadge
              variant={statusVariant[status]}
              withDot={false}
              size="sm"
              className="uppercase"
              style={pillStyle}
            >
              {statusLabel[status]}
            </StatusBadge>
            <StatusBadge
              variant={eventTypeVariant[battery.lastEventType]}
              withDot={false}
              size="sm"
              className="uppercase"
              style={pillStyle}
            >
              {eventTypeLabel[battery.lastEventType]}
            </StatusBadge>
          </div>
        </div>
      </div>

      <div className="relative mt-auto grid grid-cols-2 gap-3 rounded-lg bg-gray-50 px-3 py-3">
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-gray-300 opacity-60"
        />
        <div>
          <p className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>
            State of Charge
          </p>
          <p className="mt-0.5 text-gray-950" style={{ fontSize: "12px", fontWeight: 600 }}>
            {battery.stateOfCharge}%
          </p>
        </div>
        <div className="pl-1.5">
          <p className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>
            Battery Model
          </p>
          <p className="mt-0.5 text-gray-950" style={{ fontSize: "12px", fontWeight: 600 }}>
            {battery.provider}
          </p>
        </div>
      </div>
    </div>
  )
}
