import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"
import { TopBar, BackButton } from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getVehicleById } from "@/data/mockVehicleRegister"
import {
  getVehiclePrimeStopHeatMap,
  getVehiclePrimeStops,
  getVehicleStops,
  type VehiclePrimeStop,
  type VehicleStop,
} from "@/data/mockVehicleActivity"
import type { ChargeSpotDay } from "@/data/mockChargerData"
import { ChargeSpotListCard } from "@/pages/charger-register/ChargeSpotListCard"
import { ChargeSpotsMap } from "@/pages/charger-register/ChargeSpotsMap"
import { ChargeSpotHeatMapModal } from "@/pages/charger-register/ChargeSpotHeatMapModal"
import {
  ChargeSpotsFilterPanel,
  defaultChargeSpotsFilterState,
  getChargeSpotsActiveFilterCount,
  type ChargeSpotsFilterState,
} from "@/pages/charger-register/ChargeSpotsFilterPanel"
import { StopListCard } from "./StopListCard"
import { VehicleStopsMap } from "./VehicleStopsMap"
import {
  defaultVehicleStopsFilterState,
  getVehicleStopsActiveFilterCount,
  VehicleStopsFilterPanel,
  type VehicleStopsFilterState,
} from "./VehicleStopsFilterPanel"

const WEEKEND_DAYS: ChargeSpotDay[] = ["saturday", "sunday"]
const WEEKDAY_DAYS: ChargeSpotDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
]

function applyStopFilters(
  stops: VehicleStop[],
  filterState: VehicleStopsFilterState
): VehicleStop[] {
  return stops.filter((stop) => {
    if (filterState.duration === "under-12" && stop.durationMinutes >= 12) return false
    if (
      filterState.duration === "12-60" &&
      (stop.durationMinutes < 12 || stop.durationMinutes > 60)
    ) {
      return false
    }
    if (filterState.duration === "over-60" && stop.durationMinutes <= 60) return false

    if (filterState.dateRange?.from) {
      const startedAt = parseISO(stop.startedAt)
      const from = startOfDay(filterState.dateRange.from)
      const to = endOfDay(filterState.dateRange.to ?? filterState.dateRange.from)
      if (!isWithinInterval(startedAt, { start: from, end: to })) return false
    }

    return true
  })
}

function applyPrimeStopFilters(
  spots: VehiclePrimeStop[],
  filterState: ChargeSpotsFilterState
): VehiclePrimeStop[] {
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
      if (!isWithinInterval(activityDate, { start: from, end: to })) return false
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

export default function VehicleStopsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicle = getVehicleById(id || "")
  const stops = useMemo(() => getVehicleStops(id || ""), [id])
  const primeStops = useMemo(() => getVehiclePrimeStops(id || ""), [id])

  const [mode, setMode] = useState<"all" | "prime">("all")
  const [stopFilters, setStopFilters] = useState<VehicleStopsFilterState>(
    defaultVehicleStopsFilterState
  )
  const [primeFilters, setPrimeFilters] = useState<ChargeSpotsFilterState>(
    defaultChargeSpotsFilterState
  )
  const [selectedStopId, setSelectedStopId] = useState<string | null>(stops[0]?.id ?? null)
  const [selectedPrimeId, setSelectedPrimeId] = useState<string | null>(
    primeStops[0]?.id ?? null
  )
  const [heatMapSpotId, setHeatMapSpotId] = useState<string | null>(null)

  const filteredStops = useMemo(
    () => applyStopFilters(stops, stopFilters),
    [stops, stopFilters]
  )
  const filteredPrimeStops = useMemo(
    () => applyPrimeStopFilters(primeStops, primeFilters),
    [primeStops, primeFilters]
  )

  const isPrime = mode === "prime"
  const activeFilterCount = isPrime
    ? getChargeSpotsActiveFilterCount(primeFilters)
    : getVehicleStopsActiveFilterCount(stopFilters)

  useEffect(() => {
    if (filteredStops.length === 0) {
      setSelectedStopId(null)
      return
    }
    if (!selectedStopId || !filteredStops.some((stop) => stop.id === selectedStopId)) {
      setSelectedStopId(filteredStops[0].id)
    }
  }, [filteredStops, selectedStopId])

  useEffect(() => {
    if (filteredPrimeStops.length === 0) {
      setSelectedPrimeId(null)
      return
    }
    if (
      !selectedPrimeId ||
      !filteredPrimeStops.some((spot) => spot.id === selectedPrimeId)
    ) {
      setSelectedPrimeId(filteredPrimeStops[0].id)
    }
  }, [filteredPrimeStops, selectedPrimeId])

  if (!vehicle) {
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

  const heatMap = heatMapSpotId ? getVehiclePrimeStopHeatMap(heatMapSpotId) : undefined

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Vehicle Register", href: "/falcon/vehicle-register" },
          { label: vehicle.plateNumber, href: `/falcon/vehicle-register/${vehicle.id}/activity` },
          { label: "Stops" },
        ]}
      />

      <div className="px-6 py-6 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BackButton onClick={() => navigate(`/falcon/vehicle-register/${vehicle.id}/activity`)} />
              <h1
                className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                style={{ fontSize: "22px" }}
              >
                {isPrime ? "Prime Stops" : "Stops"}
                <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium text-breadcrumb-root">
              Stop history and prime locations for {vehicle.plateNumber}
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
                {isPrime ? (
                  <ChargeSpotsFilterPanel
                    state={primeFilters}
                    onChange={setPrimeFilters}
                    entityLabel="stop"
                  />
                ) : (
                  <VehicleStopsFilterPanel
                    state={stopFilters}
                    onChange={setStopFilters}
                  />
                )}
              </PopoverContent>
            </Popover>
            <Button
              className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90"
              onClick={() => setMode(isPrime ? "all" : "prime")}
            >
              <img src="/images/charge_spot.svg" alt="" className="h-5 w-5" />
              {isPrime ? "View All Stops" : "View Prime Stops"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-w-0 overflow-hidden px-6 pb-6 gap-4">
        <div className="w-[390px] max-w-[min(390px,45vw)] min-w-0 shrink border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-950" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {isPrime ? filteredPrimeStops.length : filteredStops.length}
                </h2>
                <span className="text-gray-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                  {isPrime ? "Total Prime Stops" : "Total Stops"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => toast.success("Stop list refreshed")}
                aria-label="Refresh stops"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isPrime
              ? filteredPrimeStops.map((spot) => (
                  <ChargeSpotListCard
                    key={spot.id}
                    spot={spot}
                    isSelected={selectedPrimeId === spot.id}
                    onClick={() => setSelectedPrimeId(spot.id)}
                    onViewHeatMap={() => {
                      setSelectedPrimeId(spot.id)
                      setHeatMapSpotId(spot.id)
                    }}
                  />
                ))
              : filteredStops.map((stop) => (
                  <StopListCard
                    key={stop.id}
                    stop={stop}
                    isSelected={selectedStopId === stop.id}
                    onClick={() => setSelectedStopId(stop.id)}
                  />
                ))}
            {(isPrime ? filteredPrimeStops.length : filteredStops.length) === 0 && (
              <p className="text-gray-500 text-center py-8" style={{ fontSize: "14px" }}>
                No stops match the selected filters
              </p>
            )}
          </div>
        </div>

        <div className="relative z-0 flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          {isPrime ? (
            <ChargeSpotsMap
              spots={filteredPrimeStops}
              selectedSpotId={selectedPrimeId}
              onSelectSpot={setSelectedPrimeId}
              className="h-full w-full rounded-lg overflow-hidden"
            />
          ) : (
            <VehicleStopsMap
              stops={filteredStops}
              selectedStopId={selectedStopId}
              onSelectStop={setSelectedStopId}
              vehicleType={vehicle.vehicleType}
              category={vehicle.category}
              className="h-full w-full rounded-lg overflow-hidden"
            />
          )}
        </div>
      </div>

      <ChargeSpotHeatMapModal
        open={!!heatMapSpotId}
        spotId={heatMapSpotId}
        heatMap={heatMap}
        countNoun="stops"
        emptyLabel="No heat map data available for this stop."
        onOpenChange={(open) => {
          if (!open) setHeatMapSpotId(null)
        }}
      />
    </>
  )
}
