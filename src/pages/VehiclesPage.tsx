import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Plus } from "lucide-react"
import type { DateRange } from "react-day-picker"

import {
  TopBar,
  PageHeader,
  StatusTabs,
  FilterBar,
  DataTable,
  Pagination,
  type FilterState,
} from "@/components/max"
import { mockVehicles } from "@/data/mockVehicles"

import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { columns, getStatusTabs, vehicleStatusToTabId } from "./vehicles/columns"
import { AddVehicleFlow } from "./vehicles/AddVehicleFlow"
import { BulkUpdateFlow } from "./vehicles/BulkUpdateFlow"

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabFromUrl || "all")
  const canAddVehicles = useCan("fleetRegister.addVehicles")
  const canBulkUpdate = useCan("fleetRegister.bulkUpdate")
  const canSeeContractRisk = useCan("fleetRegister.column.contractRisk")
  const canSeeCollectionPercent = useCan("fleetRegister.column.collectionPercent")
  const scopedVehicles = useCityScopedRecords(mockVehicles, "location")

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) => {
        const key = "accessorKey" in col ? col.accessorKey : col.id
        if (key === "contractRisk") return canSeeContractRisk
        if (key === "collectionPercent") return canSeeCollectionPercent
        return true
      }),
    [canSeeContractRisk, canSeeCollectionPercent]
  )

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<FilterState>({
    championStatus: [],
    contractStatus: [],
    locations: [],
  })
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false)

  const filteredVehicles = useMemo(() => {
    if (activeTab === "all") {
      return scopedVehicles
    }
    return scopedVehicles.filter((vehicle) => {
      const vehicleTabId = vehicleStatusToTabId[vehicle.vehicleStatus]
      return vehicleTabId === activeTab
    })
  }, [activeTab, scopedVehicles])

  const statusTabs = useMemo(() => getStatusTabs(scopedVehicles), [scopedVehicles])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Operations" }, { label: "Fleet Register" }]}
      />
      <PageHeader
        title="Fleet Register"
        subtitle="Keep full visibility and control over your vehicle fleet in one place."
        className="shrink-0"
      />

      <StatusTabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setCurrentPage(1)
        }}
        className="shrink-0"
      />

      <div className="mx-6 mt-2 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={(query) => console.log("Search:", query)}
          secondaryAction={
            canBulkUpdate
              ? {
                  label: "Bulk Update Vehicles",
                  onClick: () => setShowBulkUpdateModal(true),
                  icon: "/images/bulk_update.svg",
                }
              : undefined
          }
          primaryAction={
            canAddVehicles
              ? {
                  label: "Add Vehicles",
                  onClick: () => setShowAddVehicleModal(true),
                  icon: Plus,
                }
              : undefined
          }
          className="shrink-0"
        />

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={visibleColumns}
            data={filteredVehicles}
            onRowClick={(row) => navigate(`/fleet-register/${row.id}`)}
          />
        </div>
      </div>

      <div className="shrink-0 mx-6 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVehicles.length / pageSize)}
          totalItems={filteredVehicles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="vehicles"
        />
      </div>

      <AddVehicleFlow
        open={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
      />

      <BulkUpdateFlow
        open={showBulkUpdateModal}
        onClose={() => setShowBulkUpdateModal(false)}
      />
    </>
  )
}
