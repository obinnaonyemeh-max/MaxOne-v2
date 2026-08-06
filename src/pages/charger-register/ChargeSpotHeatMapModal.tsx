import { Modal } from "@/components/max"
import {
  formatHeatMapHour,
  getChargeSpotHeatMap,
  HEAT_MAP_DAY_SHORT,
  type ChargeSpot,
} from "@/data/mockChargerData"

interface ChargeSpotHeatMapModalProps {
  open: boolean
  spot: ChargeSpot | null
  onOpenChange: (open: boolean) => void
}

const MIN_OPACITY = 0.25
const LEGEND_OPACITIES = [0.25, 0.4, 0.55, 0.75, 1]

function cellOpacity(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) return 1
  return MIN_OPACITY + (count / maxCount) * (1 - MIN_OPACITY)
}

export function ChargeSpotHeatMapModal({
  open,
  spot,
  onOpenChange,
}: ChargeSpotHeatMapModalProps) {
  const heatMap = spot ? getChargeSpotHeatMap(spot.id) : undefined

  const countByKey = new Map<string, number>()
  if (heatMap) {
    for (const cell of heatMap.cells) {
      countByKey.set(`${cell.day}-${cell.hour}`, cell.count)
    }
  }

  const maxCount = heatMap?.maxCount ?? 1

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Heat Map"
      className="max-w-3xl w-[calc(100%-2rem)] max-h-[90vh]"
      maxHeight="90vh"
    >
      {heatMap ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Days with most spots →{" "}
              <span className="font-medium text-sidebar-item-active">
                {heatMap.peakDayLabel}
              </span>
            </p>
            <p className="text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Time with most spots →{" "}
              <span className="font-medium text-sidebar-item-active">
                {heatMap.peakTimeLabel}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <div
              className="grid gap-1 min-w-[520px]"
              style={{
                gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))",
              }}
            >
              <div />
              {HEAT_MAP_DAY_SHORT.map((day) => (
                <div
                  key={day}
                  className="text-center text-breadcrumb-root font-medium pb-1"
                  style={{ fontSize: "12px" }}
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="contents">
                  <div
                    className="flex items-center text-breadcrumb-root pr-1"
                    style={{ fontSize: "11px" }}
                  >
                    {formatHeatMapHour(hour)}
                  </div>
                  {Array.from({ length: 7 }, (_, day) => {
                    const count = countByKey.get(`${day}-${hour}`) ?? 0
                    const isEmpty = count === 0
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="flex h-7 items-center justify-center rounded-md text-brand-dark font-medium"
                        style={{
                          fontSize: "11px",
                          backgroundColor: isEmpty
                            ? "var(--color-gray-100)"
                            : "var(--color-brand-primary)",
                          opacity: isEmpty
                            ? 1
                            : cellOpacity(count, maxCount),
                        }}
                      >
                        {isEmpty ? "" : count}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <span className="text-breadcrumb-root" style={{ fontSize: "12px" }}>
              Low
            </span>
            <div className="flex items-center gap-1">
              {LEGEND_OPACITIES.map((opacity) => (
                <div
                  key={opacity}
                  className="h-3 w-5 rounded-sm"
                  style={{
                    backgroundColor: "var(--color-brand-primary)",
                    opacity,
                  }}
                />
              ))}
            </div>
            <span className="text-breadcrumb-root" style={{ fontSize: "12px" }}>
              High
            </span>
          </div>
        </div>
      ) : (
        <p className="text-breadcrumb-root" style={{ fontSize: "14px" }}>
          No heat map data available for this charge spot.
        </p>
      )}
    </Modal>
  )
}
