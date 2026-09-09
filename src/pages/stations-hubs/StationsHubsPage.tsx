import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, Map, SlidersHorizontal } from "lucide-react"
import { TopBar, PageHeader, StatusTabs } from "@/components/max"
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
  type StationLocationType,
  type StationProvider,
  type SwapStation,
} from "@/data/mockStationsData"
import type { City } from "@/data/cities"
import { CreateStationCard } from "./CreateStationCard"
import { StationGridCard } from "./StationGridCard"
import { StationListCard } from "./StationListCard"
import { StationsMap } from "./StationsMap"
import {
  useCan,
  useCityScopedRecords,
  useStationScopedRecords,
} from "@/contexts/RoleSimulationContext"
import type { StationMenuAction } from "./StationActionsMenu"
import {
  StationFilterPopover,
  getActiveFilterCount,
  type StationFilters,
} from "./StationFilterPanel"

type ViewMode = "grid" | "map"

export default function StationsHubsPage() {
  const navigate = useNavigate()
  const canCreateStation = useCan("falcon.stations.create")
  const cityScopedStations = useCityScopedRecords(mockSwapStations, "city")
  const scopedStations = useStationScopedRecords(cityScopedStations, "id")
  const [createdStations, setCreatedStations] = useState<SwapStation[]>([])
  const stations = useMemo(() => {
    const byId: Record<string, SwapStation> = {}
    for (const station of scopedStations) {
      byId[station.id] = station
    }
    for (const station of createdStations) {
      byId[station.id] = station
    }
    return Object.values(byId)
  }, [createdStations, scopedStations])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [locationTab, setLocationTab] = useState<StationLocationType>("swap-station")
  const [advancedFilters, setAdvancedFilters] = useState<StationFilters>({
    cities: [],
    providers: [],
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [addBatteriesStation, setAddBatteriesStation] = useState<SwapStation | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)

  const activeFilterCount = getActiveFilterCount(advancedFilters)
  const isHubTab = locationTab === "hub"
  const swapStationCount = stations.filter(
    (station) => station.locationType === "swap-station"
  ).length
  const hubCount = stations.filter((station) => station.locationType === "hub").length

  const filteredStations = useMemo(() => {
    let next = stations.filter((station) => station.locationType === locationTab)

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
  }, [advancedFilters, locationTab, stations])

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
        subtitle="View and manage swap stations and charging hubs across your network."
        className="shrink-0"
      />

      <div className="mb-4 flex shrink-0 items-center justify-between gap-4 px-4 md:px-6">
        <StatusTabs
          tabs={[
            { id: "swap-station", label: "Swap Stations", count: swapStationCount },
            { id: "hub", label: "Hubs", count: hubCount },
          ]}
          activeTab={locationTab}
          onTabChange={(tabId) => setLocationTab(tabId as StationLocationType)}
          className="min-w-0 flex-1 px-0 md:px-0"
        />

        <div className="flex shrink-0 items-center gap-2">
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

      <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6 md:px-6">
        {viewMode === "grid" ? (
          <div className="flex-1 overflow-y-auto">
            {filteredStations.length === 0 ? (
              <EmptyFilterState
                noun={isHubTab ? "hubs" : "stations"}
                onClear={() => setAdvancedFilters({ cities: [], providers: [] })}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {canCreateStation && (
                  <CreateStationCard
                    label={isHubTab ? "Create a hub" : "Create a swap station"}
                    onClick={() => setCreateOpen(true)}
                  />
                )}
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
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
            <div className="relative z-0 min-h-[240px] min-w-0 flex-1 isolate overflow-hidden rounded-lg border border-gray-200 bg-white p-2 order-1 lg:order-2">
              <StationsMap
                stations={filteredStations}
                selectedStationId={selectedStationId}
                onSelectStation={setSelectedStationId}
                className="h-full w-full overflow-hidden rounded-lg"
              />
            </div>
            <div className="flex h-[40vh] max-h-[320px] w-full min-w-0 shrink flex-col overflow-hidden rounded-lg border border-gray-200 bg-white order-2 lg:order-1 lg:h-auto lg:max-h-none lg:w-[390px] lg:max-w-[min(390px,45vw)]">
              <div className="border-b border-gray-100 px-4 py-2">
                <span className="text-gray-500" style={{ fontSize: "12px" }}>
                  Showing {filteredStations.length.toLocaleString()} {isHubTab ? "hubs" : "stations"}
                  {activeFilterCount > 0 && " (filtered)"}
                </span>
              </div>
              <div ref={listContainerRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {filteredStations.length === 0 ? (
                  <EmptyFilterState
                    noun={isHubTab ? "hubs" : "stations"}
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
          </div>
        )}
      </div>

      <CreateSwapStationModal
        open={canCreateStation && createOpen}
        onOpenChange={setCreateOpen}
        locationType={locationTab}
        onCreate={(station) => {
          setCreatedStations((prev) => [station, ...prev])
          setSelectedStationId(station.id)
        }}
        onAddBatteries={(station) => {
          setAddBatteriesStation(station)
        }}
      />

      <AddBatteriesToStationFlow
        open={addBatteriesStation !== null}
        stationName={addBatteriesStation?.name ?? ""}
        locationType={addBatteriesStation?.locationType}
        onClose={() => setAddBatteriesStation(null)}
        onComplete={(importedCount) => {
          if (!addBatteriesStation) return
          const updated: SwapStation = {
            ...addBatteriesStation,
            batteriesAvailable: Math.min(addBatteriesStation.batteriesCapacity, importedCount),
            averageSoc: importedCount > 0 ? 100 : addBatteriesStation.averageSoc,
          }
          setCreatedStations((prev) => {
            const index = prev.findIndex((station) => station.id === updated.id)
            if (index >= 0) {
              const next = [...prev]
              next[index] = updated
              return next
            }
            return [updated, ...prev]
          })
        }}
      />
    </>
  )
}

function EmptyFilterState({
  onClear,
  noun,
}: {
  onClear: () => void
  noun: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-gray-500">No {noun} match your filters</p>
      <Button variant="link" size="sm" className="mt-2" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}
