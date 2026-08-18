import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  DataTable,
  Pagination,
  type GenericFilterState,
} from "@/components/max"
import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { mockMovementLogRecords } from "@/data/mockAssetMovement"

import { movementLogColumns } from "./columns"
import {
  defaultMovementLogFilters,
  movementLogFilterSections,
} from "./filters"
import { TabToolbar } from "./TabToolbar"

export function MovementLogTab() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultMovementLogFilters)
  const records = useCityScopedRecords(mockMovementLogRecords, "location")

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <TabToolbar
          filterSections={movementLogFilterSections}
          filters={filters}
          onFiltersChange={setFilters}
          searchPlaceholder="Search plate..."
          onSearchSubmit={(q) => console.log("Search:", q)}
        />

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={movementLogColumns}
            data={records}
            onRowClick={(row) => navigate(`/asset-movement/${row.id}`)}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(records.length / pageSize) || 1}
          totalItems={records.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="records"
        />
      </div>
    </>
  )
}
