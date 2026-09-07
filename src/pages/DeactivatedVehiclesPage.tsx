import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  ExpandableSearch,
  VehicleIcon,
  AssignQAModal,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import {
  mockDeactivatedVehicles,
  type DeactivatedVehicle,
} from "@/data/mockDeactivatedVehicles"
import { getQAStaffById } from "@/data/mockQAStaff"
import { assignVehicleToAssessment, useAssessmentRecords } from "@/data/assessmentStore"
import { CITY_HUB_OPTIONS } from "@/data/cities"

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_HUB_OPTIONS,
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
}

const columns: ColumnDef<DeactivatedVehicle>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
            {row.original.assetType}
          </p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>
            {row.original.assetId}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.plateNumber}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "daysInState",
    header: "Days in State",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.daysInState}d
      </span>
    ),
  },
  {
    accessorKey: "dateAdded",
    header: "Date Added",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.dateAdded}
      </span>
    ),
  },
]

export default function DeactivatedVehiclesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<DeactivatedVehicle | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)
  const assessmentRecords = useAssessmentRecords()
  const scopedRecords = useCityScopedRecords(mockDeactivatedVehicles, "location")

  const remainingRecords = useMemo(
    () =>
      scopedRecords.filter(
        (r) => !assessmentRecords.some((record) => record.vehicleId === r.id)
      ),
    [scopedRecords, assessmentRecords]
  )

  const filteredRecords = useMemo(() => {
    let result = remainingRecords

    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.assetId.toLowerCase().includes(q) ||
          r.plateNumber.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery, remainingRecords])

  const handleAssign = (qaId: string) => {
    if (!selectedVehicle) return
    const qa = getQAStaffById(qaId)
    assignVehicleToAssessment(selectedVehicle, qaId)
    toast.success(`${selectedVehicle.assetId} assigned to ${qa?.name ?? "QA"}`)
    setSelectedVehicle(null)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Deactivated Vehicles" }]}
      />
      <PageHeader
        title="Deactivated Vehicles"
        subtitle="Vehicles waiting to be assigned to a Quality Assurance officer"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="mt-0 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <GenericFilterPopover
                    sections={filterSections}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </PopoverContent>
              </Popover>

              <ExpandableSearch
                open={searchOpen}
                onOpenChange={setSearchOpen}
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Search asset or plate..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredRecords}
              emptyMessage="No vehicles awaiting QA assignment"
              onRowClick={(row) => setSelectedVehicle(row)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredRecords.length / pageSize))}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="vehicles"
          />
        </div>
      </div>

      {selectedVehicle && (
        <AssignQAModal
          open={!!selectedVehicle}
          onOpenChange={(open) => {
            if (!open) setSelectedVehicle(null)
          }}
          assetId={selectedVehicle.assetId}
          location={selectedVehicle.location}
          onConfirm={handleAssign}
        />
      )}
    </>
  )
}
