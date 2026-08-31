import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  DataTable,
  Pagination,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Contract } from "@/data/mockContracts"

interface ContractsTableProps {
  contracts: Contract[]
  columns: ColumnDef<Contract>[]
  isLoading?: boolean
  onRowClick?: (row: Contract) => void
  searchPlaceholder?: string
  itemLabel?: string
  emptyMessage?: string
}

const defaultFilters: GenericFilterState = { location: [], status: [], vehicleType: [] }

export function ContractsTable({
  contracts,
  columns,
  isLoading = false,
  onRowClick,
  searchPlaceholder = "Search by contract, champion, MAX ID or plate...",
  itemLabel = "contracts",
  emptyMessage = "No contracts found.",
}: ContractsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)

  // Filter option sets are derived from whatever slice of contracts this table was
  // handed, so a single-category page only ever offers the locations/statuses/vehicle
  // types that actually occur within it.
  const filterSections: FilterSection[] = useMemo(() => {
    const locations = [...new Set(contracts.map((c) => c.location))].sort()
    const statuses = [...new Set(contracts.map((c) => c.status))]
    const vehicleTypes = [...new Set(contracts.map((c) => c.vehicleType))]
    return [
      {
        id: "location",
        title: "Location",
        defaultExpanded: true,
        options: locations.map((loc) => ({ value: loc, label: loc })),
      },
      { id: "status", title: "Status", options: statuses.map((s) => ({ value: s, label: s })) },
      { id: "vehicleType", title: "Vehicle Type", options: vehicleTypes.map((v) => ({ value: v, label: v })) },
    ]
  }, [contracts])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredContracts = useMemo(() => {
    setCurrentPage(1)
    return contracts.filter((contract) => {
      if (filters.location.length > 0 && !filters.location.includes(contract.location)) return false
      if (filters.status.length > 0 && !filters.status.includes(contract.status)) return false
      if (filters.vehicleType.length > 0 && !filters.vehicleType.includes(contract.vehicleType)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !contract.contractId.toLowerCase().includes(q) &&
          !contract.championName.toLowerCase().includes(q) &&
          !contract.maxId.toLowerCase().includes(q) &&
          !contract.vehiclePlate.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [contracts, filters, searchQuery])

  const paginatedContracts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredContracts.slice(start, start + pageSize)
  }, [filteredContracts, currentPage, pageSize])

  return (
    <div className="px-6 mt-2 flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <GenericFilterPopover sections={filterSections} filters={filters} onFiltersChange={setFilters} />
            </PopoverContent>
          </Popover>

          <ExpandableSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder={searchPlaceholder}
            inputClassName="w-72"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={paginatedContracts}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            onRowClick={onRowClick}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredContracts.length / pageSize))}
          totalItems={filteredContracts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel={itemLabel}
        />
      </div>
    </div>
  )
}
