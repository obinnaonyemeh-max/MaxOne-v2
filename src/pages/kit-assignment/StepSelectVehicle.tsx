import { Search } from "lucide-react"

import { InfoCard, InfoGrid } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  mockReassignableVehicles,
  type ReassignableVehicle,
} from "@/data/mockKitAssignment"

interface StepSelectVehicleProps {
  searchQuery: string
  selectedVehicle: ReassignableVehicle | null
  onSearchChange: (query: string) => void
  onSelectVehicle: (vehicle: ReassignableVehicle) => void
  onClearVehicle: () => void
}

export function StepSelectVehicle({
  searchQuery,
  selectedVehicle,
  onSearchChange,
  onSelectVehicle,
  onClearVehicle,
}: StepSelectVehicleProps) {
  const filtered = searchQuery.trim()
    ? mockReassignableVehicles.filter((v) => {
        const q = searchQuery.toLowerCase()
        return (
          v.searchLabel.toLowerCase().includes(q) ||
          v.currentPlateNumber.toLowerCase().includes(q) ||
          v.currentChassisId.toLowerCase().includes(q)
        )
      })
    : []

  return (
    <div className="space-y-5">
      <h3
        className="font-semibold uppercase text-sidebar-item-active"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        Vehicle / Kit to Reassign
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">
          Search by Kit ID, chassis number, or plate number
        </label>

        {selectedVehicle ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-content-card px-4 py-2.5 text-sm font-medium text-sidebar-item-active">
              {selectedVehicle.searchLabel}
            </div>
            <Button variant="outline" size="sm" onClick={onClearVehicle}>
              Change
            </Button>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by Kit ID, chassis number, or plate number"
                className="h-10 pl-9"
              />
              {searchQuery.trim() && filtered.length > 0 && (
                <div className="absolute z-20 mt-1 w-full divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200 bg-content-card shadow-md max-h-72">
                  {filtered.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => onSelectVehicle(vehicle)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-sidebar-item-active">
                          {vehicle.searchLabel}
                        </p>
                        <p className="text-xs text-breadcrumb-root">
                          {vehicle.vehicleType} &middot; {vehicle.currentChassisId}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {searchQuery.trim() && filtered.length === 0 && (
              <p className="mt-2 text-sm text-breadcrumb-root">
                No vehicles found matching "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {selectedVehicle && (
        <div className="space-y-4">
          <InfoCard title="Vehicle Details">
            <InfoGrid
              columns={2}
              items={[
                { label: "Vehicle Type", value: selectedVehicle.vehicleType },
                { label: "Vehicle Model", value: selectedVehicle.vehicleModel },
                { label: "Current Plate Number", value: selectedVehicle.currentPlateNumber },
                { label: "Current Chassis/Kit ID", value: selectedVehicle.currentChassisId },
              ]}
            />
          </InfoCard>

          <div className="space-y-2">
            <p className="text-sm text-breadcrumb-root">Client currently attached to this vehicle/kit:</p>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-gray-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <span className="text-sm font-medium text-sidebar-item">
                  {selectedVehicle.currentClient.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>
                  {selectedVehicle.currentClient.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-breadcrumb-root">
                  {selectedVehicle.currentClient.clientId} &middot; {selectedVehicle.currentClient.phoneNumber} &middot; {selectedVehicle.currentClient.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
