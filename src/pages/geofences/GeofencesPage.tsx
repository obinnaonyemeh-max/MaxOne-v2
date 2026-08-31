import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  TopBar,
  PageHeader,
  BatteryStatusFilterChips,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { mockGeofences, totalGeofences } from "@/data/mockGeofences"
import { GeofenceListCard } from "./GeofenceListCard"
import { GeofencesMap } from "./GeofencesMap"

const typeChips = [
  { id: "city", label: "City", count: 180, color: "#3B82F6" },
  { id: "station", label: "Swap Station", count: 60, color: "#22C55E" },
  { id: "office", label: "Office", count: 40, color: "#F97316" },
]

const AREAS = Array.from(new Set(mockGeofences.map((g) => g.area.replace(/\.$/, ""))))

const filterSections: FilterSection[] = [
  {
    id: "type",
    title: "Type",
    defaultExpanded: true,
    options: [
      { value: "city", label: "City", color: "#3B82F6" },
      { value: "station", label: "Swap Station", color: "#22C55E" },
      { value: "office", label: "Office", color: "#F97316" },
    ],
  },
  {
    id: "area",
    title: "Location",
    options: AREAS.map((a) => ({ value: a, label: a })),
  },
]

const defaultFilters: GenericFilterState = { type: [], area: [] }

export default function GeofencesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [showVehicles, setShowVehicles] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const listRef = useRef<HTMLDivElement>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const geofences = useMemo(
    () =>
      mockGeofences.filter((g) => {
        if (activeType && g.type !== activeType) return false
        if (filters.type.length > 0 && !filters.type.includes(g.type)) return false
        if (filters.area.length > 0 && !filters.area.includes(g.area.replace(/\.$/, ""))) return false
        return true
      }),
    [activeType, filters]
  )

  // Nothing is preselected. If the current selection is filtered out, drop it.
  const effectiveSelectedId =
    selectedId && geofences.some((g) => g.id === selectedId) ? selectedId : null

  // When a geofence is selected the map shows only that ring; otherwise all.
  const mapGeofences = effectiveSelectedId
    ? geofences.filter((g) => g.id === effectiveSelectedId)
    : geofences

  useEffect(() => {
    if (!effectiveSelectedId || !listRef.current) return
    const card = listRef.current.querySelector(`[data-geofence-id="${effectiveSelectedId}"]`)
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [effectiveSelectedId])

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Falcon" }, { label: "Geofencing" }]} />

      <PageHeader
        title="Geofencing"
        subtitle="View and manage all geofenced locations across your operating regions."
        className="shrink-0"
      />

      <div className="flex-1 flex min-w-0 overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Geofence List */}
        <div className="w-[390px] max-w-[min(390px,45vw)] min-w-0 shrink border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-950" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {totalGeofences.toLocaleString()}
                </h2>
                <span className="text-gray-500" style={{ fontSize: "12px", fontWeight: 500 }}>
                  Total Geofenced Locations
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Filter geofences">
                      <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-dark text-[10px] text-white flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="end">
                    <GenericFilterPopover
                      sections={filterSections}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Refresh geofences">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Type chips + distribution */}
            <BatteryStatusFilterChips
              chips={typeChips}
              activeChipId={activeType}
              onChipClick={setActiveType}
            />
          </div>

          {/* List */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {geofences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-sm">No geofences match your filters</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setActiveType(null)
                    setFilters(defaultFilters)
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              geofences.map((geofence) => (
                <GeofenceListCard
                  key={geofence.id}
                  geofence={geofence}
                  isSelected={effectiveSelectedId === geofence.id}
                  isExpanded={expandedId === geofence.id}
                  onSelect={() =>
                    setSelectedId((prev) => (prev === geofence.id ? null : geofence.id))
                  }
                  onToggleExpand={() =>
                    setExpandedId((prev) => (prev === geofence.id ? null : geofence.id))
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative z-0 flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          <GeofencesMap
            geofences={mapGeofences}
            selectedId={effectiveSelectedId}
            showVehicles={showVehicles}
            onSelect={setSelectedId}
            onViewVisitHistory={() => navigate("/falcon/geofences/visit-history")}
            className="h-full w-full rounded-lg overflow-hidden"
          />

          {/* Vehicle layer toggle */}
          <div
            className="absolute bottom-5 left-5 z-[1000] flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-2 shadow-md"
            style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            <Switch id="show-vehicles" checked={showVehicles} onCheckedChange={setShowVehicles} />
            <label htmlFor="show-vehicles" className="cursor-pointer text-sm font-medium text-gray-700">
              Show vehicles
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
