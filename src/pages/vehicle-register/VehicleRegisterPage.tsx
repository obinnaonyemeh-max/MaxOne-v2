import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import {
  TopBar,
  PageHeader,
  StatusTabs,
  BatteryStatusFilterChips,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockVehicleRegisterItems,
  trackingStatusCounts,
  totalVehicles,
  checkedOutCount,
  checkedInCount,
  type CheckStatus,
  type TrackingStatus,
  type VehicleType,
  type Financier,
  type Brand,
  type LifecycleStatus,
} from "@/data/mockVehicleRegister"
import { getVehicleActivity } from "@/data/mockVehicleActivity"
import { applyEnforcement } from "@/data/mockEnforcement"
import { VehicleListCard } from "./VehicleListCard"
import { VehiclesMap } from "./VehiclesMap"
import { VehicleFilterPopover, getActiveFilterCount, type VehicleFilters } from "./VehicleFilterPanel"
import { EnforcementHistoryModal } from "@/pages/vehicle-activity/EnforcementHistoryModal"
import { EnforcementActionModal } from "@/pages/vehicle-activity/EnforcementActionModal"

export default function VehicleRegisterPage() {
  const navigate = useNavigate()
  const [activeCheckTab, setActiveCheckTab] = useState<CheckStatus>("checked-out")
  const [activeStatusFilter, setActiveStatusFilter] = useState<TrackingStatus | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    mockVehicleRegisterItems[0]?.id ?? null
  )
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null)
  const [enforcementVehicleId, setEnforcementVehicleId] = useState<string | null>(null)
  const [enforcementActionVehicleId, setEnforcementActionVehicleId] = useState<string | null>(null)
  const [advancedFilters, setAdvancedFilters] = useState<VehicleFilters>({
    cities: [],
    vehicleTypes: [],
    financiers: [],
    brands: [],
    lifecycleStatuses: [],
  })
  const listContainerRef = useRef<HTMLDivElement>(null)

  const checkTabs = [
    { id: "checked-out", label: "Checked Out", count: checkedOutCount },
    { id: "checked-in", label: "Checked In", count: checkedInCount },
  ]

  const filterChips = trackingStatusCounts.map((item) => ({
    id: item.status,
    label: item.label,
    count: item.count,
    color: item.color,
  }))

  const activeFilterCount = getActiveFilterCount(advancedFilters)

  const filteredVehicles = useMemo(() => {
    let vehicles = mockVehicleRegisterItems

    if (activeCheckTab) {
      vehicles = vehicles.filter((v) => v.checkStatus === activeCheckTab)
    }

    if (activeStatusFilter) {
      vehicles = vehicles.filter((v) => v.trackingStatus === activeStatusFilter)
    }

    if (advancedFilters.cities.length > 0) {
      vehicles = vehicles.filter((v) => advancedFilters.cities.includes(v.city))
    }

    if (advancedFilters.vehicleTypes.length > 0) {
      vehicles = vehicles.filter((v) =>
        advancedFilters.vehicleTypes.includes(v.vehicleType as VehicleType)
      )
    }

    if (advancedFilters.financiers.length > 0) {
      vehicles = vehicles.filter((v) =>
        advancedFilters.financiers.includes(v.financier as Financier)
      )
    }

    if (advancedFilters.brands.length > 0) {
      vehicles = vehicles.filter((v) =>
        advancedFilters.brands.includes(v.brand as Brand)
      )
    }

    if (advancedFilters.lifecycleStatuses.length > 0) {
      vehicles = vehicles.filter((v) =>
        advancedFilters.lifecycleStatuses.includes(v.lifecycleStatus as LifecycleStatus)
      )
    }

    return vehicles
  }, [activeCheckTab, activeStatusFilter, advancedFilters])

  useEffect(() => {
    if (filteredVehicles.length === 0) {
      setSelectedVehicleId(null)
      return
    }
    if (
      !selectedVehicleId ||
      !filteredVehicles.some((vehicle) => vehicle.id === selectedVehicleId)
    ) {
      setSelectedVehicleId(filteredVehicles[0].id)
    }
  }, [filteredVehicles, selectedVehicleId])

  useEffect(() => {
    if (!selectedVehicleId || !listContainerRef.current) return
    const card = listContainerRef.current.querySelector(
      `[data-vehicle-id="${selectedVehicleId}"]`
    )
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedVehicleId])

  const displayCount = filteredVehicles.length

  const handleStatusFilterClick = (statusId: string | null) => {
    setActiveStatusFilter(statusId as TrackingStatus | null)
  }

  const handleMenuItemClick = (vehicleId: string, action: string) => {
    if (action === "view-vehicle-history") {
      navigate(`/falcon/vehicle-register/${vehicleId}/activity`)
    } else if (action === "view-trips") {
      navigate(`/falcon/vehicle-register/${vehicleId}/trips`)
    } else if (action === "geofence-visit-history") {
      navigate("/falcon/geofences/visit-history")
    } else if (action === "enforcement-history") {
      setEnforcementVehicleId(vehicleId)
    } else if (action === "enforcement-actions") {
      setEnforcementActionVehicleId(vehicleId)
    }
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Vehicle Register" },
        ]}
      />

      <PageHeader
        title="Vehicle Register"
        subtitle="View and track all vehicles in your fleet with real-time status and location."
        className="shrink-0"
      />

      <div className="flex-1 flex min-w-0 overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Vehicle List */}
        <div className="w-[390px] max-w-[min(390px,45vw)] min-w-0 shrink border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="text-gray-950"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {totalVehicles.toLocaleString()}
                </h2>
                <span
                  className="text-gray-500"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Total vehicles
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 relative"
                      aria-label="Filter vehicles"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-dark text-[10px] text-white flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="end">
                    <VehicleFilterPopover
                      filters={advancedFilters}
                      onFiltersChange={setAdvancedFilters}
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Refresh vehicles"
                  onClick={() => {
                    // Refresh action
                  }}
                >
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Check Status Tabs */}
            <StatusTabs
              tabs={checkTabs}
              activeTab={activeCheckTab}
              onTabChange={(tabId) => setActiveCheckTab(tabId as CheckStatus)}
              className="px-0 mb-4 justify-center"
            />

            {/* Status Filter Chips */}
            <BatteryStatusFilterChips
              chips={filterChips}
              activeChipId={activeStatusFilter}
              onChipClick={handleStatusFilterClick}
            />
          </div>

          {/* Showing count */}
          <div className="px-4 py-2 border-b border-gray-100">
            <span
              className="text-gray-500"
              style={{ fontSize: "12px" }}
            >
              Showing {displayCount.toLocaleString()} vehicles
              {activeFilterCount > 0 && " (filtered)"}
            </span>
          </div>

          {/* Vehicle List */}
          <div ref={listContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredVehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-sm">No vehicles match your filters</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setAdvancedFilters({
                      cities: [],
                      vehicleTypes: [],
                      financiers: [],
                      brands: [],
                      lifecycleStatuses: [],
                    })
                    setActiveStatusFilter(null)
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} data-vehicle-id={vehicle.id}>
                  <VehicleListCard
                    id={vehicle.id}
                    plateNumber={vehicle.plateNumber}
                    category={vehicle.category}
                    vehicleType={vehicle.vehicleType}
                    trackingStatus={vehicle.trackingStatus}
                    lastUpdate={vehicle.lastUpdate}
                    vehicleModel={vehicle.vehicleModel}
                    city={vehicle.city}
                    brand={vehicle.brand}
                    financier={vehicle.financier}
                    driverSafetyScore={vehicle.driverSafetyScore}
                    signalStrength={vehicle.signalStrength}
                    lastSeen={vehicle.lastSeen}
                    batterySoC={vehicle.batterySoC}
                    assignedChampion={vehicle.assignedDriver}
                    speed={vehicle.speed}
                    isSelected={selectedVehicleId === vehicle.id}
                    isExpanded={expandedVehicleId === vehicle.id}
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    onExpandClick={() => setExpandedVehicleId(
                      expandedVehicleId === vehicle.id ? null : vehicle.id
                    )}
                    onMenuItemClick={(action) => handleMenuItemClick(vehicle.id, action)}
                    onViewFullInfo={() => navigate(`/falcon/vehicle-register/${vehicle.id}/activity`)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative z-0 flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          <VehiclesMap
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
      </div>

      <EnforcementHistoryModal
        open={!!enforcementVehicleId}
        onOpenChange={(open) => {
          if (!open) setEnforcementVehicleId(null)
        }}
        events={
          enforcementVehicleId
            ? getVehicleActivity(enforcementVehicleId)?.enforcement.history ?? []
            : []
        }
      />

      <EnforcementActionModal
        open={!!enforcementActionVehicleId}
        onOpenChange={(open) => {
          if (!open) setEnforcementActionVehicleId(null)
        }}
        onApply={({ action, actionLabel, reason, comment }) => {
          if (enforcementActionVehicleId) {
            applyEnforcement({
              vehicleId: enforcementActionVehicleId,
              action,
              reason,
              comment,
            })
          }
          setEnforcementActionVehicleId(null)
          toast.success(`${actionLabel} applied`, {
            description: comment ? `${reason} — ${comment}` : reason,
          })
        }}
      />
    </>
  )
}
