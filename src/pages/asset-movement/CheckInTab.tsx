import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  DataTable,
  Pagination,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { mockCheckInRecords } from "@/data/mockAssetMovement"

import { checkInColumns } from "./columns"
import { checkInFilterSections, defaultCheckInFilters } from "./filters"
import { TabToolbar } from "./TabToolbar"

const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

export function CheckInTab() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultCheckInFilters)
  const records = useCityScopedRecords(mockCheckInRecords, "location")

  const stats = useMemo(
    () => [
      { title: "Total Check-In", value: records.length, indicatorColor: COLOR_BRAND_PRIMARY },
      { title: "Yard Check-In", value: records.filter((r) => r.checkInType === "Yard Check-In").length, indicatorColor: COLOR_BADGE_ACTIVE },
      { title: "3PL Check-In", value: records.filter((r) => r.checkInType === "3PL Check-In").length, indicatorColor: COLOR_STATUS_INFO },
      { title: "Inbound – Ready", value: records.filter((r) => r.checkInType === "Inbound").length, indicatorColor: COLOR_STATUS_WARNING },
      { title: "In Breach", value: records.filter((r) => r.breachStatus === "Breached").length, indicatorColor: COLOR_STATUS_DANGER },
      { title: "Due for Deactivation", value: records.filter((r) => r.nextAction === "Deactivate").length, indicatorColor: COLOR_GRAY_500 },
    ],
    [records]
  )

  return (
    <>
      <div className="grid grid-cols-6 gap-2 shrink-0">
        {stats.map((stat) => (
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
