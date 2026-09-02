import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  Modal,
  InfoCard,
  InfoGrid,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  mockRefurbishmentRecords,
  mockRefurbishmentPartsMap,
  mockRefurbishmentAdditionalPartsMap,
  type RefurbishmentRecord,
  type RequiredPart,
} from "@/data/mockRefurbishment"
import { CITY_HUB_OPTIONS } from "@/data/cities"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"

const stageStats = [
  { title: "Awaiting Supply", value: 2, subtitle: "avg 6d", indicatorColor: "var(--color-status-warning)" },
  { title: "In Progress", value: 4, subtitle: "avg 5d", indicatorColor: "var(--color-status-info)" },
  { title: "Quality Check", value: 2, subtitle: "avg 2d", indicatorColor: "var(--color-badge-active-text)" },
  { title: "Tracking IoT", value: 2, subtitle: "avg 2d", indicatorColor: "var(--color-status-cyan)" },
  { title: "Activation Ready", value: 2, subtitle: "avg 1d", indicatorColor: "var(--color-status-purple)" },
]

const filterSections: FilterSection[] = [
  {
    id: "stage",
    title: "Refurbishment Stage",
    defaultExpanded: true,
    options: [
      { value: "Awaiting Supply", label: "Awaiting Supply" },
      { value: "In Progress", label: "In Progress" },
      { value: "Quality Check", label: "Quality Check" },
      { value: "Tracking IoT", label: "Tracking IoT" },
      { value: "Activation Ready", label: "Activation Ready" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_HUB_OPTIONS,
  },
  {
    id: "manufacturer",
    title: "Manufacturer",
    options: [
      { value: "Spiro", label: "Spiro" },
      { value: "M Auto", label: "M Auto" },
      { value: "Horwin", label: "Horwin" },
    ],
  },
  {
    id: "model",
    title: "Vehicle Model",
    options: [
      { value: "AF-80", label: "AF-80" },
      { value: "M3", label: "M3" },
      { value: "EK3", label: "EK3" },
    ],
  },
  {
    id: "status",
    title: "Status",
    options: [
      { value: "Pending Parts", label: "Pending Parts" },
      { value: "In Repair", label: "In Repair" },
      { value: "QC Passed", label: "QC Passed" },
      { value: "Tracking Setup", label: "Tracking Setup" },
      { value: "Ready", label: "Ready" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  stage: [],
  location: [],
  manufacturer: [],
  model: [],
  status: [],
}

const stageVariantMap: Record<string, "warning" | "info" | "success" | "refurb" | "default"> = {
  "Awaiting Supply": "warning",
  "In Progress": "info",
  "Quality Check": "success",
  "Tracking IoT": "refurb",
  "Activation Ready": "default",
}

const columns: ColumnDef<RefurbishmentRecord>[] = [
  {
    accessorKey: "assetId",
    header: "Asset / ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.assetId}
      </span>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle Model",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.vehicleModel}
      </span>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.manufacturer}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
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
    accessorKey: "refurbishmentStage",
    header: "Refurbishment Stage",
    cell: ({ row }) => {
      const stage = row.original.refurbishmentStage
      return <StatusBadge variant={stageVariantMap[stage] || "default"}>{stage}</StatusBadge>
    },
  },
  {
    accessorKey: "daysInStage",
    header: "Days in Stage",
    cell: ({ row }) => {
      const days = parseInt(row.original.daysInStage)
      return (
        <span
          className={`font-medium ${days >= 6 ? "text-danger" : "text-table-text"}`}
          style={{ fontSize: "14px" }}
        >
          {row.original.daysInStage}
        </span>
      )
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedTo}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.status}
      </span>
    ),
  },
]

const partStatusVariantMap: Record<string, "warning" | "info" | "success"> = {
  Ordered: "info",
  "Awaiting Supply": "warning",
  Received: "success",
}

function formatPartCost(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

const partsColumns: ColumnDef<RequiredPart>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.partName}
      </span>
    ),
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.qty}
      </span>
    ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.cost != null ? formatPartCost(row.original.cost) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={partStatusVariantMap[row.original.status] || "default"}>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
        <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

export default function RefurbishmentPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<RefurbishmentRecord | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [breachFilter, setBreachFilter] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)
  const canSeePartCost = useCan("refurbishment.column.partCost")
  const scopedRecords = useCityScopedRecords(mockRefurbishmentRecords, "location")
  const visiblePartsColumns = useMemo(
    () =>
      partsColumns.filter((col) => {
        const key = "accessorKey" in col ? col.accessorKey : undefined
        if (key === "cost") return canSeePartCost
        return true
      }),
    [canSeePartCost]
  )
  const scopedStageStats = useMemo(
    () =>
      stageStats.map((stat) => ({
        ...stat,
        value: scopedRecords.filter((r) => r.refurbishmentStage === stat.title).length,
      })),
    [scopedRecords]
  )

  const handleRowClick = (row: RefurbishmentRecord) => {
    setSelectedRecord(row)
  }

  const requiredParts = selectedRecord
    ? mockRefurbishmentPartsMap[selectedRecord.assetId] || []
    : []
  const additionalParts = selectedRecord
    ? mockRefurbishmentAdditionalPartsMap[selectedRecord.assetId] || []
    : []

  const filteredRecords = useMemo(() => {
    let result = scopedRecords

    if (breachFilter) {
      result = result.filter((r) => parseInt(r.daysInStage) >= 6)
    }

    if (filters.stage?.length) {
      result = result.filter((r) => filters.stage!.includes(r.refurbishmentStage))
    }
    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }
    if (filters.manufacturer?.length) {
      result = result.filter((r) => filters.manufacturer!.includes(r.manufacturer))
    }
    if (filters.model?.length) {
      result = result.filter((r) => filters.model!.includes(r.vehicleModel))
    }
    if (filters.status?.length) {
      result = result.filter((r) => filters.status!.includes(r.status))
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
  }, [filters, searchQuery, breachFilter, scopedRecords])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Refurbishment" }]}
      />
      <PageHeader
        title="Refurbishment"
        subtitle="Track vehicles through the refurbishment pipeline and monitor stage progress"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-7 gap-2 shrink-0">
          <StatCard
            title="All"
            value={scopedRecords.length}
            indicatorColor="var(--color-status-warning)"
            onClick={() => setBreachFilter(false)}
            className={!breachFilter ? "border-gray-950" : ""}
          />
          <StatCard
            title="Breach / SLA"
            value={scopedRecords.filter((r) => parseInt(r.daysInStage) >= 6).length}
            indicatorColor="var(--color-danger)"
            onClick={() => setBreachFilter(!breachFilter)}
            className={breachFilter ? "border-danger" : ""}
          />
          {scopedStageStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
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
                placeholder="Search plate or asset ID..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable columns={columns} data={filteredRecords} onRowClick={handleRowClick} />
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

      <Modal
        open={!!selectedRecord}
        onOpenChange={(open) => { if (!open) setSelectedRecord(null) }}
        title={selectedRecord ? `Work Order – ${selectedRecord.assetId}` : ""}
        subtitle={selectedRecord ? `${selectedRecord.plateNumber} • ${selectedRecord.vehicleModel} • ${selectedRecord.manufacturer}` : ""}
        maxHeight="85vh"
        className="max-w-xl"
        secondaryAction={{
          label: "Close",
          onClick: () => setSelectedRecord(null),
        }}
      >
        {selectedRecord && (
          <div className="space-y-6">
            <InfoCard title="Vehicle Details">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Location", value: selectedRecord.location },
                  { label: "Assigned To", value: selectedRecord.assignedTo },
                  {
                    label: "Current Stage",
                    value: (
                      <StatusBadge variant={stageVariantMap[selectedRecord.refurbishmentStage] || "default"} withDot>
                        {selectedRecord.refurbishmentStage}
                      </StatusBadge>
                    ),
                  },
                  { label: "Days in Stage", value: selectedRecord.daysInStage },
                ]}
              />
            </InfoCard>

            <FormSection title="Required Parts">
              <div className="rounded-lg border border-table-border pt-2">
                <DataTable
                  columns={visiblePartsColumns}
                  data={requiredParts}
                  emptyMessage="No required parts."
                />
              </div>
            </FormSection>

            {additionalParts.length > 0 && (
              <FormSection title="Additional Parts">
                <div className="rounded-lg border border-table-border pt-2">
                  <DataTable columns={visiblePartsColumns} data={additionalParts} />
                </div>
              </FormSection>
            )}

            {selectedRecord.refurbishmentStage === "Awaiting Supply" ? (
              <p className="text-left text-sm text-muted-foreground">
                Refurbishment starts automatically once all required parts are received.
              </p>
            ) : selectedRecord.refurbishmentStage !== "Activation Ready" ? (
              <p className="text-left text-sm text-muted-foreground">
                This stage updates automatically when the technician marks the work order complete on the mobile app.
              </p>
            ) : null}
          </div>
        )}
      </Modal>
    </>
  )
}
