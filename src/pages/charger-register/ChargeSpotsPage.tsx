import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns"
import { TopBar, BackButton } from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  getChargerById,
  getChargeSpotsByChargerId,
  type ChargeSpot,
  type ChargeSpotDay,
} from "@/data/mockChargerData"
import { ChargeSpotListCard } from "./ChargeSpotListCard"
import { ChargeSpotsMap } from "./ChargeSpotsMap"
import { ChargeSpotHeatMapModal } from "./ChargeSpotHeatMapModal"
import { ShareChargeSpotModal } from "./ShareChargeSpotModal"
import {
  ChargeSpotsFilterPanel,
  defaultChargeSpotsFilterState,
  getChargeSpotsActiveFilterCount,
  type ChargeSpotsFilterState,
} from "./ChargeSpotsFilterPanel"

const WEEKEND_DAYS: ChargeSpotDay[] = ["saturday", "sunday"]
const WEEKDAY_DAYS: ChargeSpotDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
]

function applyChargeSpotFilters(
  spots: ChargeSpot[],
  filterState: ChargeSpotsFilterState
): ChargeSpot[] {
  const categories = filterState.filters.category || []
  const days = filterState.filters.days || []

  let result = spots.filter((spot) => {
    if (categories.length > 0) {
      const matchesCategory = categories.some((category) => {
        if (category === "day") return spot.timeOfDay === "day"
        if (category === "night") return spot.timeOfDay === "night"
        if (category === "weekday") {
          return spot.activeDays.some((day) => WEEKDAY_DAYS.includes(day))
        }
        if (category === "weekend") {
          return spot.activeDays.some((day) => WEEKEND_DAYS.includes(day))
        }
        return false
      })
      if (!matchesCategory) return false
    }

    if (days.length > 0) {
      const matchesDay = spot.activeDays.some((day) => days.includes(day))
      if (!matchesDay) return false
    }

    if (filterState.dateRange?.from) {
      const activityDate = parseISO(spot.activityDate)
      const from = startOfDay(filterState.dateRange.from)
      const to = endOfDay(filterState.dateRange.to ?? filterState.dateRange.from)
      if (!isWithinInterval(activityDate, { start: from, end: to })) {
        return false
      }
    }

    return true
  })

  if (filterState.sort === "duration-longest") {
    result = [...result].sort(
      (a, b) => b.averageStopDurationMinutes - a.averageStopDurationMinutes
    )
  } else if (filterState.sort === "duration-shortest") {
    result = [...result].sort(
      (a, b) => a.averageStopDurationMinutes - b.averageStopDurationMinutes
    )
  } else if (filterState.sort === "frequency-highest") {
    result = [...result].sort((a, b) => b.frequency - a.frequency)
  } else if (filterState.sort === "frequency-lowest") {
    result = [...result].sort((a, b) => a.frequency - b.frequency)
  }

  return result
}

export default function ChargeSpotsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = (location.state as { from?: string } | null)?.from
  const charger = getChargerById(id || "")
  const spots = useMemo(
    () => getChargeSpotsByChargerId(id || ""),
    [id]
  )
  const [filterState, setFilterState] = useState<ChargeSpotsFilterState>(
    defaultChargeSpotsFilterState
  )
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(
    spots[0]?.id ?? null
  )
  const [heatMapSpotId, setHeatMapSpotId] = useState<string | null>(null)
  const [shareSpotId, setShareSpotId] = useState<string | null>(null)

  const heatMapSpot =
    spots.find((spot) => spot.id === heatMapSpotId) ?? null
  const shareSpot =
    spots.find((spot) => spot.id === shareSpotId) ?? null

  const filteredSpots = useMemo(
    () => applyChargeSpotFilters(spots, filterState),
    [spots, filterState]
  )

  const activeFilterCount = getChargeSpotsActiveFilterCount(filterState)

  useEffect(() => {
    if (filteredSpots.length === 0) {
      setSelectedSpotId(null)
      return
    }
    if (
      !selectedSpotId ||
      !filteredSpots.some((spot) => spot.id === selectedSpotId)
    ) {
      setSelectedSpotId(filteredSpots[0].id)
    }
  }, [filteredSpots, selectedSpotId])

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

  const handleBack = () => {
    if (fromPath) {
      navigate(fromPath)
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(`/falcon/ev-chargers/${charger.id}`)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "EV Chargers", href: "/falcon/ev-chargers" },
          ...(fromPath === "/falcon/ev-chargers"
            ? []
            : [{ label: charger.id, href: `/falcon/ev-chargers/${charger.id}` }]),
          { label: "Charge Spots" },
        ]}
      />

      <div className="px-6 py-6 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BackButton onClick={handleBack} />
              <h1
                className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                style={{ fontSize: "22px" }}
              >
                Charge Spots
                <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium text-breadcrumb-root">
              View charge spot clusters and activity for {charger.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 z-[1100]" align="end">
                <ChargeSpotsFilterPanel
                  state={filterState}
                  onChange={setFilterState}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Charge Spot List */}
        <div className="w-[390px] shrink-0 border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-gray-950"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {filteredSpots.length}
                </h2>
                <span
                  className="text-gray-500"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Total Charge Spots
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
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredSpots.map((spot) => (
              <ChargeSpotListCard
                key={spot.id}
                spot={spot}
                isSelected={selectedSpotId === spot.id}
                onClick={() => setSelectedSpotId(spot.id)}
                onViewHeatMap={() => {
                  setSelectedSpotId(spot.id)
                  setHeatMapSpotId(spot.id)
                }}
                onShareLocation={() => {
                  setSelectedSpotId(spot.id)
                  setShareSpotId(spot.id)
                }}
              />
            ))}
            {filteredSpots.length === 0 && (
              <p className="text-gray-500 text-center py-8" style={{ fontSize: "14px" }}>
                No charge spots match the selected filters
              </p>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative z-0 flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          <ChargeSpotsMap
            spots={filteredSpots}
            selectedSpotId={selectedSpotId}
            onSelectSpot={setSelectedSpotId}
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
      </div>

      <ChargeSpotHeatMapModal
        open={!!heatMapSpotId}
        spot={heatMapSpot}
        onOpenChange={(open) => {
          if (!open) setHeatMapSpotId(null)
        }}
      />

      <ShareChargeSpotModal
        open={!!shareSpotId}
        spot={shareSpot}
        onOpenChange={(open) => {
          if (!open) setShareSpotId(null)
        }}
      />
    </>
  )
}
