import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  DataTable,
  Pagination,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { mockCheckInRecords } from "@/data/mockAssetMovement"

import { checkInColumns } from "./columns"
import { checkInFilterSections, checkInStats, defaultCheckInFilters } from "./filters"
import { TabToolbar } from "./TabToolbar"

export function CheckInTab() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultCheckInFilters)

  return (
    <>
      <div className="grid grid-cols-6 gap-2 shrink-0">
        {checkInStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <TabToolbar
          filterSections={checkInFilterSections}
          filters={filters}
          onFiltersChange={setFilters}
          onSearchSubmit={(q) => console.log("Search:", q)}
        />

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={checkInColumns}
            data={mockCheckInRecords}
            onRowClick={(row) => navigate(`/asset-movement/${row.id}`)}
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(mockCheckInRecords.length / pageSize)}
          totalItems={mockCheckInRecords.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="records"
        />
      </div>
    </>
  )
}
