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

import { mockConversionRecords, type ConversionRecord } from "@/data/mockConversion"
import { useCityScopedRecords } from "@/contexts/RoleSimulationContext"

const statusVariantMap: Record<string, "warning" | "success" | "danger" | "default"> = {
  "Pending": "warning",
  "Approved": "success",
  "Rejected": "danger",
}

const disposalStageVariantMap: Record<string, "warning" | "info" | "success" | "refurb" | "default"> = {
  "Pending Auction": "default",
  "Auctioned – Awaiting Pickup": "info",
  "Disposed": "success",
  "Disposed – Pending Write-Off": "refurb",
}

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Pending", label: "Pending" },
      { value: "Approved", label: "Approved" },
      { value: "Rejected", label: "Rejected" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  status: [],
}

const columns: ColumnDef<ConversionRecord>[] = [
  {
    accessorKey: "assetId",
    header: "Asset ID",
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
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason for Conversion",
    cell: ({ row }) => (
      <span className="font-medium text-muted-foreground truncate max-w-[200px] block" style={{ fontSize: "14px" }}>
        {row.original.reason.length > 25 ? `${row.original.reason.slice(0, 25)}...` : row.original.reason}
      </span>
    ),
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.requestedBy}
      </span>
    ),
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.requestDate}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status] || "default"} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

export default function ConversionRequestPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<ConversionRecord | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)
  const scopedRecords = useCityScopedRecords(mockConversionRecords, "location")

  const handleRowClick = (row: ConversionRecord) => {
    setSelectedRecord(row)
  }

  const filteredRecords = useMemo(() => {
    let result = scopedRecords

    if (filters.status?.length) {
      result = result.filter((r) => filters.status!.includes(r.status))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.assetId.toLowerCase().includes(q) ||
          r.vehicleModel.toLowerCase().includes(q) ||
          r.requestedBy.toLowerCase().includes(q)
      )
    }

    return result
  }, [filters, searchQuery, scopedRecords])

  const pendingCount = scopedRecords.filter((r) => r.status === "Pending").length
  const approvedCount = scopedRecords.filter((r) => r.status === "Approved").length
  const rejectedCount = scopedRecords.filter((r) => r.status === "Rejected").length

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Conversion Request" }]}
      />
      <PageHeader
        title="Conversion Requests"
        subtitle="Review and approve requests to convert disposal vehicles back to operational use"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-4 gap-2 shrink-0">
          <StatCard
            title="Total Requests"
            value={scopedRecords.length}
            indicatorColor="var(--color-gray-400)"
          />
          <StatCard
            title="Pending Review"
            value={pendingCount}
            indicatorColor="var(--color-status-warning)"
          />
          <StatCard
            title="Approved"
            value={approvedCount}
            indicatorColor="var(--color-badge-active-text)"
          />
          <StatCard
            title="Rejected"
            value={rejectedCount}
            indicatorColor="var(--color-danger)"
          />
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
                placeholder="Search asset, plate, or request..."
                inputClassName="w-56"
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
            itemLabel="requests"
          />
        </div>
      </div>

      <Modal
        open={!!selectedRecord}
        onOpenChange={(open) => { if (!open) setSelectedRecord(null) }}
        title={selectedRecord ? `Conversion Request – ${selectedRecord.assetId}` : ""}
        subtitle={selectedRecord ? `${selectedRecord.vehicleModel} · ${selectedRecord.location}` : ""}
        maxHeight="85vh"
        className="max-w-lg"
        primaryAction={selectedRecord?.status === "Pending" ? {
          label: "Approve",
          onClick: () => setSelectedRecord(null),
        } : undefined}
        secondaryAction={selectedRecord?.status === "Pending" ? {
          label: "Reject",
          onClick: () => setSelectedRecord(null),
        } : undefined}
      >
        {selectedRecord && (
          <div className="space-y-6">
            <InfoCard title="Vehicle Details">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Vehicle ID", value: selectedRecord.assetId },
                  { label: "Vehicle Model", value: `${selectedRecord.vehicleModel} (${selectedRecord.manufacturer})` },
                  { label: "Plate Number", value: selectedRecord.plateNumber },
                  { label: "Location", value: selectedRecord.location },
                  { label: "Assessment ID", value: selectedRecord.assessmentId },
                  { label: "Cost Ratio", value: selectedRecord.costRatio },
                  { label: "Repair Estimate", value: selectedRecord.repairEstimate },
                  {
                    label: "Disposal Stage",
                    value: (
                      <StatusBadge variant={disposalStageVariantMap[selectedRecord.disposalStage] || "default"}>
                        {selectedRecord.disposalStage}
                      </StatusBadge>
                    ),
                  },
                ]}
              />
            </InfoCard>

            <InfoCard title="Request Details">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Requested By", value: selectedRecord.requestedBy },
                  { label: "Request Date", value: selectedRecord.requestDate },
                  {
                    label: "Status",
                    value: (
                      <StatusBadge variant={statusVariantMap[selectedRecord.status] || "default"} withDot>
                        {selectedRecord.status}
                      </StatusBadge>
                    ),
                  },
                  { label: "Reason for Conversion", value: selectedRecord.reason },
                ]}
              />
            </InfoCard>
          </div>
        )}
      </Modal>
    </>
  )
}
