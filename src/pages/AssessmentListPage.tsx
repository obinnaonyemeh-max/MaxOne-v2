import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  ExpandableSearch,
  VehicleIcon,
  StatusBadge,
  Modal,
  InfoCard,
  InfoGrid,
  StatusTimeline,
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
import { useAssessmentRecords } from "@/data/assessmentStore"
import { type AssessmentRecord, type AssessmentStatus } from "@/data/mockAssessmentList"
import { getQAStaffById } from "@/data/mockQAStaff"
import { CITY_HUB_OPTIONS } from "@/data/cities"

const statusVariantMap: Record<AssessmentStatus, "warning" | "info"> = {
  "Awaiting Assessment": "warning",
  "Assessment Ongoing": "info",
}

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Awaiting Assessment", label: "Awaiting Assessment" },
      { value: "Assessment Ongoing", label: "Assessment Ongoing" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_HUB_OPTIONS,
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
  location: [],
}

const columns: ColumnDef<AssessmentRecord>[] = [
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
    accessorKey: "assignedQaId",
    header: "Assigned QA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {getQAStaffById(row.original.assignedQaId)?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status]}>
        {row.original.status}
      </StatusBadge>
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
]

export default function AssessmentListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)
  const assessmentRecords = useAssessmentRecords()
  const scopedRecords = useCityScopedRecords(assessmentRecords, "location")

  const filteredRecords = useMemo(() => {
    let result = scopedRecords

    if (filters.status?.length) {
      result = result.filter((r) => filters.status!.includes(r.status))
    }
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
  }, [filters, searchQuery, scopedRecords])

  const assignedQaName = selectedRecord
    ? getQAStaffById(selectedRecord.assignedQaId)?.name ?? "—"
    : "—"

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Assessment List" }]}
      />
      <PageHeader
        title="Assessment List"
        subtitle="Vehicles assigned to a Quality Assurance officer, awaiting or undergoing assessment"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
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
              emptyMessage="No vehicles in assessment"
              onRowClick={(row) => setSelectedRecord(row)}
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

      <Modal
        open={!!selectedRecord}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null)
        }}
        title={selectedRecord ? `Work Order – ${selectedRecord.assetId}` : ""}
        subtitle={
          selectedRecord
            ? `${selectedRecord.plateNumber} • ${selectedRecord.assetType}`
            : ""
        }
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
                  { label: "Assigned To", value: assignedQaName },
                  {
                    label: "Status",
                    value: (
                      <StatusBadge variant={statusVariantMap[selectedRecord.status]} withDot>
                        {selectedRecord.status}
                      </StatusBadge>
                    ),
                  },
                  { label: "Days in State", value: `${selectedRecord.daysInState}d` },
                ]}
              />
            </InfoCard>

            <InfoCard title="Activity History">
              {selectedRecord.activityHistory.length > 0 ? (
                <StatusTimeline entries={selectedRecord.activityHistory} />
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No activity history yet.
                </p>
              )}
            </InfoCard>
          </div>
        )}
      </Modal>
    </>
  )
}
