import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, Map, SlidersHorizontal } from "lucide-react"
import { TopBar, PageHeader } from "@/components/max"
import { AddBatteriesToStationFlow } from "./AddBatteriesToStationFlow"
import { CreateSwapStationModal } from "./CreateSwapStationModal"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  mockSwapStations,
  type StationProvider,
  type SwapStation,
} from "@/data/mockStationsData"
import type { City } from "@/data/cities"
import { CreateStationCard } from "./CreateStationCard"
import { StationGridCard } from "./StationGridCard"
import { StationListCard } from "./StationListCard"
import { StationsMap } from "./StationsMap"
import type { StationMenuAction } from "./StationActionsMenu"
import {
  StationFilterPopover,
  getActiveFilterCount,
  type StationFilters,
} from "./StationFilterPanel"

type ViewMode = "grid" | "map"

export default function StationsHubsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [advancedFilters, setAdvancedFilters] = useState<StationFilters>({
    cities: [],
    providers: [],
  })
  const [stations, setStations] = useState<SwapStation[]>(mockSwapStations)
  const [createOpen, setCreateOpen] = useState(false)
  const [addBatteriesStation, setAddBatteriesStation] = useState<SwapStation | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    mockSwapStations[0]?.id ?? null
  )
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)

  const activeFilterCount = getActiveFilterCount(advancedFilters)

  const filteredStations = useMemo(() => {
    let next = stations

    if (advancedFilters.cities.length > 0) {
      next = next.filter((station) =>
        advancedFilters.cities.includes(station.city as City)
      )
    }

    if (advancedFilters.providers.length > 0) {
      next = next.filter((station) =>
        advancedFilters.providers.includes(station.provider as StationProvider)
      )
    }

    return next
  }, [advancedFilters, stations])

  useEffect(() => {
    if (filteredStations.length === 0) {
      setSelectedStationId(null)
      return
    }
    if (
      !selectedStationId ||
      !filteredStations.some((station) => station.id === selectedStationId)
    ) {
      setSelectedStationId(filteredStations[0].id)
    }
  }, [filteredStations, selectedStationId])

  const handleMenuAction = (station: SwapStation, action: StationMenuAction) => {
    if (action === "add-batteries") {
      setAddBatteriesStation(station)
      return
    }

    if (action === "initiate-transfer") {
      navigate(`/falcon/swap-stations/${station.id}?transfer=1`)
      return
    }

    const tabMap: Partial<Record<StationMenuAction, string>> = {
      "view-details": "info",
      "view-battery-list": "batteries",
      "view-swap-history": "swap-history",
      "view-transfer-log": "transfer-log",
      "manage-operators": "operators",
    }

    const tab = tabMap[action]
    if (!tab) return

    navigate(
      tab === "info"
        ? `/falcon/swap-stations/${station.id}`
        : `/falcon/swap-stations/${station.id}?tab=${tab}`
    )
  }

  useEffect(() => {
    if (viewMode !== "map" || !selectedStationId || !listContainerRef.current) return
    const card = listContainerRef.current.querySelector(
      `[data-station-id="${selectedStationId}"]`
    )
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedStationId, viewMode])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Stations & Hubs" },
        ]}
      />

      <PageHeader
        title="Stations & Hubs"
        subtitle="View and manage swap stations across your network."
        className="shrink-0"
      />

      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
        <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
          <p className="text-gray-500" style={{ fontSize: "13px", fontWeight: 500 }}>
            {filteredStations.length.toLocaleString()} Total Swap Stations
            {activeFilterCount > 0 && (
              <span className="text-gray-400">
                {` of ${stations.length.toLocaleString()}`}
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  aria-label="Filter stations"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-dark text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <StationFilterPopover
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                />
              </PopoverContent>
            </Popover>

            <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={cn(
                  "flex h-9 w-9 items-center justify-center transition-colors",
                  viewMode === "grid"
                    ? "bg-gray-950 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                aria-label="Map view"
                className={cn(
                  "flex h-9 w-9 items-center justify-center transition-colors",
                  viewMode === "map"
                    ? "bg-gray-950 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="flex-1 overflow-y-auto">
            {filteredStations.length === 0 ? (
              <EmptyFilterState
                onClear={() => setAdvancedFilters({ cities: [], providers: [] })}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <CreateStationCard onClick={() => setCreateOpen(true)} />
                {filteredStations.map((station) => (
                  <StationGridCard
                    key={station.id}
                    station={station}
                    onClick={() => handleMenuAction(station, "view-details")}
                    onMenuAction={(action) => handleMenuAction(station, action)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
            <div className="flex w-[390px] max-w-[min(390px,45vw)] min-w-0 shrink flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-4 py-2">
                <span className="text-gray-500" style={{ fontSize: "12px" }}>
                  Showing {filteredStations.length.toLocaleString()} stations
                  {activeFilterCount > 0 && " (filtered)"}
                </span>
              </div>
              <div ref={listContainerRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {filteredStations.length === 0 ? (
                  <EmptyFilterState
                    onClear={() => setAdvancedFilters({ cities: [], providers: [] })}
                  />
                ) : (
                  filteredStations.map((station) => (
                    <div key={station.id} data-station-id={station.id}>
                      <StationListCard
                        station={station}
                        isSelected={selectedStationId === station.id}
                        isExpanded={expandedStationId === station.id}
                        onClick={() => setSelectedStationId(station.id)}
                        onExpandClick={() =>
                          setExpandedStationId(
                            expandedStationId === station.id ? null : station.id
                          )
                        }
                        onMenuAction={(action) => handleMenuAction(station, action)}
                        onViewFullInfo={() => handleMenuAction(station, "view-details")}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="relative z-0 min-h-0 min-w-0 flex-1 isolate overflow-hidden rounded-lg border border-gray-200 bg-white p-2">
              <StationsMap
                stations={filteredStations}
                selectedStationId={selectedStationId}
                onSelectStation={setSelectedStationId}
                className="h-full w-full overflow-hidden rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <CreateSwapStationModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(station) => {
          setStations((prev) => [station, ...prev])
          setSelectedStationId(station.id)
        }}
        onAddBatteries={(station) => {
          setAddBatteriesStation(station)
        }}
      />

      <AddBatteriesToStationFlow
        open={addBatteriesStation !== null}
        stationName={addBatteriesStation?.name ?? ""}
        onClose={() => setAddBatteriesStation(null)}
        onComplete={(importedCount) => {
          if (!addBatteriesStation) return
          setStations((prev) =>
            prev.map((station) =>
              station.id === addBatteriesStation.id
                ? {
                    ...station,
                    batteriesAvailable: Math.min(station.batteriesCapacity, importedCount),
                    averageSoc: importedCount > 0 ? 100 : station.averageSoc,
                  }
                : station
            )
          )
        }}
      />
    </>
  )
}

function EmptyFilterState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-gray-500">No stations match your filters</p>
      <Button variant="link" size="sm" className="mt-2" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}
