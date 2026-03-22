import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ServiceRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  location: string
  provider: string
  type: string
  stage: string
  days: string
  assignedTo: string
  sla: string
}

const stageStats = [
  { title: "Awaiting Supply", value: 3, subtitle: "avg 5d", indicatorColor: "var(--color-status-warning)" },
  { title: "In Progress", value: 3, subtitle: "avg 4d", indicatorColor: "var(--color-status-info)" },
  { title: "Quality Check", value: 2, subtitle: "avg 2d", indicatorColor: "var(--color-badge-active-text)" },
  { title: "Tel. Revalidation", value: 2, subtitle: "avg 2d", indicatorColor: "#06B6D4" },
  { title: "Completed", value: 2, subtitle: "avg 1d", indicatorColor: "#8B5CF6" },
]

const filterSections: FilterSection[] = [
  {
    id: "stage",
    title: "Stage",
    defaultExpanded: true,
    options: [
      { value: "Awaiting Supply", label: "Awaiting Supply" },
      { value: "In Progress", label: "In Progress" },
      { value: "Quality Check", label: "Quality Check" },
      { value: "Tel. Revalidation", label: "Tel. Revalidation" },
      { value: "Completed", label: "Completed" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: [
      { value: "Lagos Hub", label: "Lagos Hub" },
      { value: "Accra Hub", label: "Accra Hub" },
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
    id: "provider",
    title: "Provider",
    options: [
      { value: "In-House", label: "In-House" },
      { value: "3PL", label: "3PL" },
    ],
  },
  {
    id: "type",
    title: "Type",
    options: [
      { value: "Scheduled", label: "Scheduled" },
      { value: "Unscheduled", label: "Unscheduled" },
    ],
  },
  {
    id: "sla",
    title: "SLA",
    options: [
      { value: "Within SLA", label: "Within SLA" },
      { value: "Near SLA", label: "Near SLA" },
      { value: "Breached", label: "Breached" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  stage: [],
  location: [],
  model: [],
  provider: [],
  type: [],
  sla: [],
}

const stageVariantMap: Record<string, "warning" | "info" | "success" | "refurb" | "default"> = {
  "Awaiting Supply": "warning",
  "In Progress": "info",
  "Quality Check": "success",
  "Tel. Revalidation": "refurb",
  "Completed": "default",
}

const providerVariantMap: Record<string, "info" | "success"> = {
  "In-House": "info",
  "3PL": "success",
}

const typeVariantMap: Record<string, "success" | "warning"> = {
  "Scheduled": "success",
  "Unscheduled": "warning",
}

const slaVariantMap: Record<string, "danger" | "success" | "warning"> = {
  "Breached": "danger",
  "Within SLA": "success",
  "Near SLA": "warning",
}

const mockServiceRecords: ServiceRecord[] = [
  { id: "1", assetId: "AST-5001", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-701-AA", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "Awaiting Supply", days: "6d", assignedTo: "Emeka O.", sla: "Breached" },
  { id: "2", assetId: "AST-5002", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-702-BB", location: "Lagos Hub", provider: "3PL", type: "Unscheduled", stage: "Awaiting Supply", days: "3d", assignedTo: "External – MotoFix Ltd", sla: "Within SLA" },
  { id: "3", assetId: "AST-5010", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "AC-201-CC", location: "Accra Hub", provider: "In-House", type: "Scheduled", stage: "In Progress", days: "4d", assignedTo: "Kwame A.", sla: "Near SLA" },
  { id: "4", assetId: "AST-5015", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-410-DD", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "In Progress", days: "8d", assignedTo: "Chidi N.", sla: "Breached" },
  { id: "5", assetId: "AST-5020", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-502-EE", location: "Lagos Hub", provider: "3PL", type: "Unscheduled", stage: "In Progress", days: "2d", assignedTo: "External – AutoCare", sla: "Within SLA" },
  { id: "6", assetId: "AST-5025", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-220-FF", location: "Accra Hub", provider: "In-House", type: "Scheduled", stage: "Awaiting Supply", days: "7d", assignedTo: "Kwame A.", sla: "Breached" },
  { id: "7", assetId: "AST-5030", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-615-GG", location: "Lagos Hub", provider: "In-House", type: "Unscheduled", stage: "Quality Check", days: "2d", assignedTo: "Chidi N.", sla: "Within SLA" },
  { id: "8", assetId: "AST-5035", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-710-HH", location: "Lagos Hub", provider: "3PL", type: "Scheduled", stage: "Quality Check", days: "1d", assignedTo: "External – MotoFix Ltd", sla: "Within SLA" },
  { id: "9", assetId: "AST-5040", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "AC-330-JJ", location: "Accra Hub", provider: "In-House", type: "Scheduled", stage: "Tel. Revalidation", days: "2d", assignedTo: "Kwame A.", sla: "Near SLA" },
  { id: "10", assetId: "AST-5045", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-820-KK", location: "Lagos Hub", provider: "In-House", type: "Unscheduled", stage: "Tel. Revalidation", days: "1d", assignedTo: "Emeka O.", sla: "Within SLA" },
  { id: "11", assetId: "AST-5050", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-905-LL", location: "Lagos Hub", provider: "In-House", type: "Scheduled", stage: "Completed", days: "1d", assignedTo: "Chidi N.", sla: "Within SLA" },
  { id: "12", assetId: "AST-5055", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-440-MM", location: "Accra Hub", provider: "3PL", type: "Scheduled", stage: "Completed", days: "0d", assignedTo: "External – AutoCare", sla: "Within SLA" },
]

const columns: ColumnDef<ServiceRecord>[] = [
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
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <StatusBadge variant={providerVariantMap[row.original.provider] || "default"}>
        {row.original.provider}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge variant={typeVariantMap[row.original.type] || "default"}>
        {row.original.type}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <StatusBadge variant={stageVariantMap[row.original.stage] || "default"}>
        {row.original.stage}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "days",
    header: "Days",
    cell: ({ row }) => {
      const days = parseInt(row.original.days)
      return (
        <span
          className={`font-medium ${days >= 6 ? "text-danger" : "text-table-text"}`}
          style={{ fontSize: "14px" }}
        >
          {row.original.days}
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
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <StatusBadge variant={slaVariantMap[row.original.sla] || "default"}>
        {row.original.sla}
      </StatusBadge>
    ),
  },
]

interface RequiredPart {
  id: string
  partName: string
  qty: number
  status: "Ordered" | "Awaiting Supply" | "Received"
}

const mockPartsMap: Record<string, RequiredPart[]> = {
  "AST-5001": [
    { id: "1", partName: "Battery Pack", qty: 1, status: "Ordered" },
    { id: "2", partName: "Controller Unit", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-5002": [
    { id: "1", partName: "Brake Pads", qty: 2, status: "Received" },
  ],
  "AST-5010": [
    { id: "1", partName: "Motor Assembly", qty: 1, status: "Ordered" },
    { id: "2", partName: "Wiring Harness", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-5015": [
    { id: "1", partName: "Display Panel", qty: 1, status: "Ordered" },
  ],
}

const partStatusVariantMap: Record<string, "warning" | "info" | "success"> = {
  "Ordered": "info",
  "Awaiting Supply": "warning",
  "Received": "success",
}

const partsColumns: ColumnDef<RequiredPart>[] = [
  {
    accessorKey: "partName",
    header: "Part",
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

export default function ServiceSchedulePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null)
  const [parts, setParts] = useState<RequiredPart[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [breachFilter, setBreachFilter] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const handleRowClick = (row: ServiceRecord) => {
    setSelectedRecord(row)
    setParts(mockPartsMap[row.assetId] || [])
  }

  const filteredRecords = useMemo(() => {
    let result = mockServiceRecords

    if (breachFilter) {
      result = result.filter((r) => parseInt(r.days) >= 6)
    }

    if (filters.stage?.length) {
      result = result.filter((r) => filters.stage!.includes(r.stage))
    }
    if (filters.location?.length) {
      result = result.filter((r) => filters.location!.includes(r.location))
    }
    if (filters.model?.length) {
      result = result.filter((r) => filters.model!.includes(r.vehicleModel))
    }
    if (filters.provider?.length) {
      result = result.filter((r) => filters.provider!.includes(r.provider))
    }
    if (filters.type?.length) {
      result = result.filter((r) => filters.type!.includes(r.type))
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
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Maintenance" }, { label: "Service Schedule" }]}
      />
      <PageHeader
        title="Service Schedule"
        subtitle="Manage vehicles in scheduled and unscheduled maintenance workflows"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-7 gap-2 shrink-0">
          <StatCard
            title="All"
            value={mockServiceRecords.length}
            indicatorColor="var(--color-status-warning)"
            onClick={() => setBreachFilter(false)}
            className={!breachFilter ? "border-gray-950" : ""}
          />
          <StatCard
            title="Breach / SLA"
            value={mockServiceRecords.filter((r) => r.sla === "Breached").length}
            indicatorColor="var(--color-danger)"
            onClick={() => setBreachFilter(!breachFilter)}
            className={breachFilter ? "border-danger" : ""}
          />
          {stageStats.map((stat) => (
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

              {searchOpen ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plate or asset ID..."
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
        title={selectedRecord ? `Work Order – ${selectedRecord.assetId}` : ""}
        subtitle={selectedRecord ? `${selectedRecord.plateNumber} • ${selectedRecord.vehicleModel} • ${selectedRecord.manufacturer}` : ""}
        maxHeight="85vh"
        className="max-w-lg"
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
                    label: "Provider",
                    value: (
                      <StatusBadge variant={providerVariantMap[selectedRecord.provider] || "default"}>
                        {selectedRecord.provider}
                      </StatusBadge>
                    ),
                  },
                  {
                    label: "Type",
                    value: (
                      <StatusBadge variant={typeVariantMap[selectedRecord.type] || "default"}>
                        {selectedRecord.type}
                      </StatusBadge>
                    ),
                  },
                  {
                    label: "Current Stage",
                    value: (
                      <StatusBadge variant={stageVariantMap[selectedRecord.stage] || "default"} withDot>
                        {selectedRecord.stage}
                      </StatusBadge>
                    ),
                  },
                  { label: "Days", value: selectedRecord.days },
                  {
                    label: "SLA",
                    value: (
                      <StatusBadge variant={slaVariantMap[selectedRecord.sla] || "default"}>
                        {selectedRecord.sla}
                      </StatusBadge>
                    ),
                  },
                ]}
              />
            </InfoCard>

            <FormSection title="Required Parts">
              <div className="rounded-lg border border-table-border pt-2">
                <DataTable columns={partsColumns} data={parts} emptyMessage="No parts added yet." />
              </div>
            </FormSection>
          </div>
        )}
      </Modal>
    </>
  )
}
