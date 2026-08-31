import { SlidersHorizontal, X } from "lucide-react"

import {
  DataTable,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormSection } from "@/pages/vehicles/FormControls"
import { auctionVehicleFilterSections, type AuctionVehicle } from "@/data/mockAuction"
import { getVehicleColumns } from "./vehicleColumns"

interface StepAssignVehiclesProps {
  filteredVehicles: AuctionVehicle[]
  selectedVehicles: AuctionVehicle[]
  selectedVehicleIds: string[]
  allSelected: boolean
  onToggleVehicle: (id: string) => void
  onToggleAll: () => void
  vehicleFilters: GenericFilterState
  onFiltersChange: (filters: GenericFilterState) => void
  vehicleSearch: string
  onSearchChange: (value: string) => void
  vehicleSearchOpen: boolean
  onSearchOpenChange: (open: boolean) => void
  onBulkUpload: () => void
  buyoutPrices: Record<string, string>
  onBuyoutPriceChange: (id: string, value: string) => void
  onRemoveVehicle: (id: string) => void
  bulkPrice: string
  onBulkPriceChange: (value: string) => void
  onApplyPriceToAll: () => void
}

export function StepAssignVehicles(props: StepAssignVehiclesProps) {
  const {
    filteredVehicles,
    selectedVehicles,
    selectedVehicleIds,
    allSelected,
    onToggleVehicle,
    onToggleAll,
    vehicleFilters,
    onFiltersChange,
    vehicleSearch,
    onSearchChange,
    vehicleSearchOpen,
    onSearchOpenChange,
    onBulkUpload,
    buyoutPrices,
    onBuyoutPriceChange,
    onRemoveVehicle,
    bulkPrice,
    onBulkPriceChange,
    onApplyPriceToAll,
  } = props

  const vehicleFilterCount = getActiveFilterCount(vehicleFilters)
  const columns = getVehicleColumns({
    selectedVehicleIds,
    allSelected,
    onToggle: onToggleVehicle,
    onToggleAll,
  })

  return (
    <div className="grid grid-cols-5 gap-6 p-5">
      <div className="col-span-3">
        <FormSection title="Assign Vehicles">
          <p className="text-sm font-medium text-breadcrumb-root -mt-1 mb-3">
            Select the vehicles to include in this auction.
          </p>
          <div className="flex flex-col rounded-lg border border-table-border">
            <div className="flex items-center gap-2 px-2 py-2 shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
                    {vehicleFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                        {vehicleFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <GenericFilterPopover
                    sections={auctionVehicleFilterSections}
                    filters={vehicleFilters}
                    onFiltersChange={onFiltersChange}
                  />
                </PopoverContent>
              </Popover>

              <ExpandableSearch
                open={vehicleSearchOpen}
                onOpenChange={onSearchOpenChange}
                value={vehicleSearch}
                onValueChange={onSearchChange}
                placeholder="Search ID, plate or model..."
                inputClassName="w-56"
              />

              <Button variant="outline" className="h-9 gap-2 ml-auto" onClick={onBulkUpload}>
                <img src="/images/bulk_update.svg" alt="" className="h-4 w-4" />
                <span className="text-sm">Bulk Upload</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <DataTable columns={columns} data={filteredVehicles} />
            </div>
          </div>
        </FormSection>
      </div>

      <div className="col-span-2">
        <FormSection title="Buyout Prices">
          <p className="text-sm font-medium text-breadcrumb-root -mt-1 mb-3">
            Set a buyout price for each selected vehicle.
          </p>
          {selectedVehicles.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center">
              <p className="text-sm font-medium text-breadcrumb-root">No vehicles selected yet.</p>
            </div>
          ) : (
            <>
              {selectedVehicles.length > 1 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-muted-foreground">
                      ₦
                    </span>
                    <Input
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => onBulkPriceChange(e.target.value)}
                      placeholder="Price for all"
                      className="h-8 w-full bg-[#F8F8F8] pl-6 text-[13px]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="h-8 shrink-0 text-[13px]"
                    disabled={!bulkPrice.trim()}
                    onClick={onApplyPriceToAll}
                  >
                    Apply to all
                  </Button>
                </div>
              )}
              <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                {selectedVehicles.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 px-3 py-2">
                    <span
                      className="font-medium text-table-text shrink-0 whitespace-nowrap"
                      style={{ fontSize: "13px" }}
                    >
                      {v.vehicleId}
                    </span>
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-muted-foreground">
                        ₦
                      </span>
                      <Input
                        type="number"
                        value={buyoutPrices[v.id] ?? ""}
                        onChange={(e) => onBuyoutPriceChange(v.id, e.target.value)}
                        placeholder="Buyout price"
                        className="h-8 w-full bg-[#F8F8F8] pl-6 text-[13px]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 ml-auto text-muted-foreground hover:text-status-danger"
                      aria-label={`Remove ${v.vehicleId}`}
                      onClick={() => onRemoveVehicle(v.id)}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </FormSection>
      </div>
    </div>
  )
}
