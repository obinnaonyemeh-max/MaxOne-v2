import { BatteryLevelIcon } from "@/components/max/BatteryLevelIcon"
import {
  formatStationCollections,
  type SwapStation,
} from "@/data/mockStationsData"
import {
  StationActionsMenu,
  type StationMenuAction,
} from "./StationActionsMenu"

interface StationGridCardProps {
  station: SwapStation
  onClick?: () => void
  onMenuAction?: (action: StationMenuAction) => void
}

export function StationGridCard({ station, onClick, onMenuAction }: StationGridCardProps) {
  const isEmpty = station.batteriesAvailable === 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-950"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
          <img
            src="/images/station.svg"
            alt=""
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="truncate text-gray-950"
              style={{ fontSize: "14px", fontWeight: 600 }}
            >
              {station.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              <BatteryLevelIcon
                chargeLevel={station.averageSoc}
                tooltip={`Average SOC: ${station.averageSoc}%`}
                className="mt-0.5"
              />
              <StationActionsMenu onAction={onMenuAction} />
            </div>
          </div>
          <p
            className="mt-1 text-gray-500"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            <span style={{ color: isEmpty ? "#B5A018" : "inherit", fontWeight: 600 }}>
              {station.batteriesAvailable}
            </span>
            {` of ${station.batteriesCapacity} batteries available`}
          </p>
        </div>
      </div>

      <div className="relative mt-auto grid grid-cols-2 gap-3 rounded-lg bg-gray-50 px-3 py-3">
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-gray-300 opacity-60"
        />
        <div>
          <p className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>
            Total Collections
          </p>
          <p className="mt-0.5 text-gray-950" style={{ fontSize: "12px", fontWeight: 600 }}>
            {formatStationCollections(station.totalCollections)}
          </p>
        </div>
        <div className="pl-1.5">
          <p className="text-gray-500" style={{ fontSize: "11px", fontWeight: 500 }}>
            Swaps (Today)
          </p>
          <p className="mt-0.5 text-gray-950" style={{ fontSize: "12px", fontWeight: 600 }}>
            {station.totalSwapsToday.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
