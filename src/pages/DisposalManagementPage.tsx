import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, AlertTriangle } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  Modal,
  InfoCard,
  InfoGrid,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DisposalRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  assessmentId: string
  location: string
  disposalStage: string
  duration: string
  sla: string
  costRatio: string
}

const stageStats = [
  { title: "Pending Auction", value: 3, indicatorColor: "var(--color-status-warning)" },
  { title: "Auctioned – Awaiting Pickup", value: 2, indicatorColor: "var(--color-status-info)" },
  { title: "Disposed", value: 1, indicatorColor: "var(--color-badge-active-text)" },
  { title: "Disposed – Pending Write-Off", value: 2, indicatorColor: "#8B5CF6" },
]

const filterSections: FilterSection[] = [
  {
    id: "stage",
    title: "Stage",
    defaultExpanded: true,
    options: [
      { value: "Pending Auction", label: "Pending Auction" },
      { value: "Auctioned – Awaiting Pickup", label: "Auctioned – Awaiting Pickup" },
      { value: "Disposed", label: "Disposed" },
      { value: "Disposed – Pending Write-Off", label: "Disposed – Pending Write-Off" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: [
      { value: "Nairobi", label: "Nairobi" },
      { value: "Mombasa", label: "Mombasa" },
      { value: "Kisumu", label: "Kisumu" },
    ],
  },
  {
    id: "sla",
    title: "SLA",
    options: [
      { value: "Within SLA", label: "Within SLA" },
      { value: "Breached", label: "Breached" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  stage: [],
  location: [],
  sla: [],
}

const stageVariantMap: Record<string, "warning" | "info" | "success" | "refurb" | "default"> = {
  "Pending Auction": "default",
  "Auctioned – Awaiting Pickup": "info",
  "Disposed": "success",
  "Disposed – Pending Write-Off": "refurb",
}

const slaVariantMap: Record<string, "danger" | "success" | "warning"> = {
  "Breached": "danger",
  "Within SLA": "success",
}

const mockDisposalRecords: DisposalRecord[] = [
  { id: "1", assetId: "DSP-001", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KBZ 001A", assessmentId: "ASM-4401", location: "Nairobi", disposalStage: "Pending Auction", duration: "18d", sla: "Breached", costRatio: "82%" },
  { id: "2", assetId: "DSP-002", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KCA 220B", assessmentId: "ASM-4402", location: "Mombasa", disposalStage: "Pending Auction", duration: "5d", sla: "Within SLA", costRatio: "65%" },
  { id: "3", assetId: "DSP-003", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 112C", assessmentId: "ASM-4403", location: "Nairobi", disposalStage: "Auctioned – Awaiting Pickup", duration: "3d", sla: "Within SLA", costRatio: "91%" },
  { id: "4", assetId: "DSP-004", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 430D", assessmentId: "ASM-4404", location: "Kisumu", disposalStage: "Auctioned – Awaiting Pickup", duration: "9d", sla: "Breached", costRatio: "78%" },
  { id: "5", assetId: "DSP-005", vehicleModel: "ET5", manufacturer: "NIO", plateNumber: "KBZ 550E", assessmentId: "ASM-4405", location: "Nairobi", disposalStage: "Pending Auction", duration: "12d", sla: "Breached", costRatio: "70%" },
  { id: "6", assetId: "DSP-006", vehicleModel: "Model S", manufacturer: "BYD", plateNumber: "KCA 660F", assessmentId: "ASM-4406", location: "Mombasa", disposalStage: "Disposed", duration: "2d", sla: "Within SLA", costRatio: "95%" },
  { id: "7", assetId: "DSP-007", vehicleModel: "Dolphin", manufacturer: "BYD", plateNumber: "KDA 770G", assessmentId: "ASM-4407", location: "Nairobi", disposalStage: "Disposed – Pending Write-Off", duration: "4d", sla: "Within SLA", costRatio: "88%" },
  { id: "8", assetId: "DSP-008", vehicleModel: "Model 3", manufacturer: "Tesla", plateNumber: "KBB 880H", assessmentId: "ASM-4408", location: "Kisumu", disposalStage: "Disposed – Pending Write-Off", duration: "6d", sla: "Within SLA", costRatio: "75%" },
]

const columns: ColumnDef<DisposalRecord>[] = [
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
    accessorKey: "assessmentId",
    header: "Assessment ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assessmentId}
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
    accessorKey: "disposalStage",
    header: "Disposal Stage",
    cell: ({ row }) => (
      <StatusBadge variant={stageVariantMap[row.original.disposalStage] || "default"}>
        {row.original.disposalStage}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "duration",
    header: "Status Duration",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.duration}
      </span>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <StatusBadge variant={slaVariantMap[row.original.sla] || "default"}>
        {row.original.sla}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "costRatio",
    header: "Cost Ratio",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.costRatio}
      </span>
    ),
  },
]

export default function DisposalManagementPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<DisposalRecord | null>(null)
  const [conversionOpen, setConversionOpen] = useState(false)
  const [conversionReason, setConversionReason] = useState("")
  const [expectedUse, setExpectedUse] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [breachFilter, setBreachFilter] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const breachCount = mockDisposalRecords.filter((r) => r.sla === "Breached").length

  const handleRowClick = (row: DisposalRecord) => {
    setSelectedRecord(row)
  }

  const filteredRecords = useMemo(() => {
    let result = mockDisposalRecords

    if (breachFilter) {
      result = result.filter((r) => r.sla === "Breached")
    }

    if (filters.stage?.length) {
      result = result.filter((r) => filters.stage!.includes(r.disposalStage))
    }
    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }
    if (filters.sla?.length) {
      result = result.filter((r) => filters.sla!.includes(r.sla))
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
  }, [filters, searchQuery, breachFilter])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Disposal Management" }]}
      />
      <PageHeader
        title="Disposal Management"
        subtitle="Manage end-of-life vehicles through disposal and auction workflows"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-5 gap-2 shrink-0">
          <StatCard
            title="Total in Disposal"
            value={mockDisposalRecords.length}
            indicatorColor="var(--color-gray-400)"
          />
          {stageStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBreachFilter(!breachFilter)}
          className={`mt-3 shrink-0 flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left transition-colors ${
            breachFilter
              ? "border-danger bg-danger/5"
              : "border-danger/30 bg-danger/5 hover:border-danger"
          }`}
        >
          <AlertTriangle className="h-5 w-5 text-danger shrink-0" />
          <div>
            <p className="font-semibold text-sm text-foreground">{breachCount} Vehicles in SLA Breach</p>
            <p className="text-xs text-muted-foreground">Click to filter breached vehicles</p>
          </div>
        </button>

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

              {searchOpen ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search asset or plate..."
                    className="h-9 w-48"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="sr-only">Close search</span>
                    ×
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
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
        title={selectedRecord ? `${selectedRecord.assetId} – ${selectedRecord.plateNumber}` : ""}
        subtitle={selectedRecord ? `${selectedRecord.vehicleModel} · ${selectedRecord.manufacturer} · ${selectedRecord.location}` : ""}
        maxHeight="85vh"
        className="max-w-lg"
        primaryAction={selectedRecord?.disposalStage === "Pending Auction" ? {
          label: "Convert to Operational Vehicle",
          onClick: () => {
            setConversionOpen(true)
            setConversionReason("")
            setExpectedUse("")
          },
        } : undefined}
        secondaryAction={selectedRecord?.disposalStage === "Pending Auction" ? {
          label: "Cancel",
          onClick: () => setSelectedRecord(null),
        } : undefined}
      >
        {selectedRecord && (
          <div className="space-y-6">
            <InfoCard title="Disposal Details">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Model", value: selectedRecord.vehicleModel },
                  { label: "Manufacturer", value: selectedRecord.manufacturer },
                  { label: "Plate", value: selectedRecord.plateNumber },
                  { label: "Assessment", value: selectedRecord.assessmentId },
                  { label: "Location", value: selectedRecord.location },
                  {
                    label: "Stage",
                    value: (
                      <StatusBadge variant={stageVariantMap[selectedRecord.disposalStage] || "default"}>
                        {selectedRecord.disposalStage}
                      </StatusBadge>
                    ),
                  },
                  { label: "Days in Stage", value: selectedRecord.duration },
                  {
                    label: "SLA",
                    value: (
                      <StatusBadge variant={slaVariantMap[selectedRecord.sla] || "default"}>
                        {selectedRecord.sla}
                      </StatusBadge>
                    ),
                  },
                  { label: "Cost Ratio", value: selectedRecord.costRatio },
                  { label: "Status", value: "Active" },
                ]}
              />
            </InfoCard>
          </div>
        )}
      </Modal>
      <Modal
        open={conversionOpen}
        onOpenChange={(open) => { if (!open) setConversionOpen(false) }}
        title="Convert to Operational Vehicle"
        subtitle="Submit a conversion request for this vehicle. This requires approval before the vehicle is moved to the Operational Vehicle pool."
        maxHeight="85vh"
        className="max-w-lg"
        primaryAction={{
          label: "Submit Request",
          onClick: () => {
            setConversionOpen(false)
            setSelectedRecord(null)
          },
          disabled: !conversionReason.trim() || !expectedUse.trim(),
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setConversionOpen(false),
        }}
      >
        {selectedRecord && (
          <div className="space-y-6">
            <InfoCard title="Vehicle Summary">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Vehicle ID", value: selectedRecord.assetId },
                  {
                    label: "Current Stage",
                    value: (
                      <StatusBadge variant={stageVariantMap[selectedRecord.disposalStage] || "default"}>
                        {selectedRecord.disposalStage}
                      </StatusBadge>
                    ),
                  },
                  { label: "Estimated Repair Cost", value: "$1,800" },
                  { label: "Cost Ratio", value: selectedRecord.costRatio },
                ]}
              />
            </InfoCard>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-foreground">
                Reason for Conversion <span className="text-danger">*</span>
              </label>
              <Textarea
                placeholder="Explain why this vehicle should be converted to operational use"
                value={conversionReason}
                onChange={(e) => setConversionReason(e.target.value)}
                className="min-h-[120px] bg-gray-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-foreground">
                Expected Operational Use <span className="text-danger">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. MCP Fleet, Enterprise Pool"
                value={expectedUse}
                onChange={(e) => setExpectedUse(e.target.value)}
                className="h-12 bg-gray-50"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
