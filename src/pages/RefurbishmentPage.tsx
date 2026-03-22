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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface RefurbishmentRecord {
  id: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  location: string
  refurbishmentStage: string
  daysInStage: string
  assignedTo: string
  status: string
}

const stageStats = [
  { title: "Awaiting Supply", value: 3, subtitle: "avg 6d", indicatorColor: "var(--color-status-warning)" },
  { title: "In Progress", value: 3, subtitle: "avg 4d", indicatorColor: "var(--color-status-info)" },
  { title: "Quality Check", value: 2, subtitle: "avg 2d", indicatorColor: "var(--color-badge-active-text)" },
  { title: "Tracking IoT", value: 2, subtitle: "avg 2d", indicatorColor: "#06B6D4" },
  { title: "Activation Ready", value: 2, subtitle: "avg 1d", indicatorColor: "#8B5CF6" },
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
    options: [
      { value: "Lagos Hub", label: "Lagos Hub" },
      { value: "Accra Hub", label: "Accra Hub" },
    ],
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

const mockRefurbishmentRecords: RefurbishmentRecord[] = [
  { id: "1", assetId: "AST-4201", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-201-XY", location: "Lagos Hub", refurbishmentStage: "Awaiting Supply", daysInStage: "6d", assignedTo: "Emeka O.", status: "Pending Parts" },
  { id: "2", assetId: "AST-4202", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-305-AB", location: "Lagos Hub", refurbishmentStage: "Awaiting Supply", daysInStage: "3d", assignedTo: "Emeka O.", status: "Pending Parts" },
  { id: "3", assetId: "AST-4210", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "AC-112-GH", location: "Accra Hub", refurbishmentStage: "In Progress", daysInStage: "8d", assignedTo: "Kwame A.", status: "In Repair" },
  { id: "4", assetId: "AST-4215", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-410-CD", location: "Lagos Hub", refurbishmentStage: "In Progress", daysInStage: "10d", assignedTo: "Chidi N.", status: "In Repair" },
  { id: "5", assetId: "AST-4220", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "LG-502-EF", location: "Lagos Hub", refurbishmentStage: "In Progress", daysInStage: "1d", assignedTo: "Emeka O.", status: "In Repair" },
  { id: "6", assetId: "AST-4225", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-220-KL", location: "Accra Hub", refurbishmentStage: "Quality Check", daysInStage: "2d", assignedTo: "Kwame A.", status: "QC Passed" },
  { id: "7", assetId: "AST-4230", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-615-MN", location: "Lagos Hub", refurbishmentStage: "Quality Check", daysInStage: "1d", assignedTo: "Chidi N.", status: "QC Passed" },
  { id: "8", assetId: "AST-4235", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-710-PQ", location: "Lagos Hub", refurbishmentStage: "Tracking IoT", daysInStage: "2d", assignedTo: "Emeka O.", status: "Tracking Setup" },
  { id: "9", assetId: "AST-4240", vehicleModel: "M3", manufacturer: "M Auto", plateNumber: "AC-330-RS", location: "Accra Hub", refurbishmentStage: "Tracking IoT", daysInStage: "1d", assignedTo: "Kwame A.", status: "Tracking Setup" },
  { id: "10", assetId: "AST-4245", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "LG-820-TU", location: "Lagos Hub", refurbishmentStage: "Activation Ready", daysInStage: "1d", assignedTo: "Chidi N.", status: "Ready" },
  { id: "11", assetId: "AST-4250", vehicleModel: "EK3", manufacturer: "Horwin", plateNumber: "LG-905-VW", location: "Lagos Hub", refurbishmentStage: "Activation Ready", daysInStage: "0d", assignedTo: "Emeka O.", status: "Ready" },
  { id: "12", assetId: "AST-4255", vehicleModel: "AF-80", manufacturer: "Spiro", plateNumber: "AC-440-XZ", location: "Accra Hub", refurbishmentStage: "Awaiting Supply", daysInStage: "5d", assignedTo: "Kwame A.", status: "Pending Parts" },
]

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

interface RequiredPart {
  id: string
  partName: string
  qty: number
  status: "Ordered" | "Awaiting Supply" | "Received"
}

const partStatusOptions = ["Ordered", "Awaiting Supply", "Received"]

const mockPartsMap: Record<string, RequiredPart[]> = {
  "AST-4201": [
    { id: "1", partName: "Battery Pack", qty: 1, status: "Ordered" },
    { id: "2", partName: "Controller Unit", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-4202": [
    { id: "1", partName: "Brake Pads", qty: 2, status: "Received" },
  ],
  "AST-4210": [
    { id: "1", partName: "Motor Assembly", qty: 1, status: "Ordered" },
    { id: "2", partName: "Wiring Harness", qty: 1, status: "Awaiting Supply" },
  ],
  "AST-4215": [
    { id: "1", partName: "Display Panel", qty: 1, status: "Ordered" },
  ],
}

function getPartsColumns(
  onStatusChange: (partId: string, status: string) => void
): ColumnDef<RequiredPart>[] {
  return [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(val) => onStatusChange(row.original.id, val)}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {partStatusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ]
}

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
  const [parts, setParts] = useState<RequiredPart[]>([])
  const [newPartName, setNewPartName] = useState("")
  const [newPartQty, setNewPartQty] = useState("1")
  const [searchOpen, setSearchOpen] = useState(false)
  const [breachFilter, setBreachFilter] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const handleRowClick = (row: RefurbishmentRecord) => {
    setSelectedRecord(row)
    setParts(mockPartsMap[row.assetId] || [])
    setNewPartName("")
    setNewPartQty("1")
  }

  const handlePartStatusChange = (partId: string, status: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, status: status as RequiredPart["status"] } : p))
    )
  }

  const handleAddPart = () => {
    if (!newPartName.trim()) return
    const newPart: RequiredPart = {
      id: String(Date.now()),
      partName: newPartName.trim(),
      qty: parseInt(newPartQty) || 1,
      status: "Awaiting Supply",
    }
    setParts((prev) => [...prev, newPart])
    setNewPartName("")
    setNewPartQty("1")
  }

  const partsColumns = getPartsColumns(handlePartStatusChange)
  const allPartsReceived = parts.length > 0 && parts.every((p) => p.status === "Received")

  const stageFlow: Record<string, { label: string; nextStage: string }> = {
    "Awaiting Supply": { label: "Start Refurbishment", nextStage: "In Progress" },
    "In Progress": { label: "Move to Quality Check", nextStage: "Quality Check" },
    "Quality Check": { label: "Move to Tracking IoT", nextStage: "Tracking IoT" },
    "Tracking IoT": { label: "Mark Activation Ready", nextStage: "Activation Ready" },
    "Activation Ready": { label: "Complete Refurbishment", nextStage: "Completed" },
  }

  const currentStageAction = selectedRecord ? stageFlow[selectedRecord.refurbishmentStage] : null

  const filteredRecords = useMemo(() => {
    let result = mockRefurbishmentRecords

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
  }, [filters, searchQuery, breachFilter])

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
            value={mockRefurbishmentRecords.length}
            indicatorColor="var(--color-status-warning)"
            onClick={() => setBreachFilter(false)}
            className={!breachFilter ? "border-gray-950" : ""}
          />
          <StatCard
            title="Breach / SLA"
            value={mockRefurbishmentRecords.filter((r) => parseInt(r.daysInStage) >= 6).length}
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
        primaryAction={selectedRecord?.refurbishmentStage !== "Activation Ready" ? {
          label: currentStageAction?.label || "Start Refurbishment",
          onClick: () => setSelectedRecord(null),
          disabled: selectedRecord?.refurbishmentStage === "Awaiting Supply" && !allPartsReceived,
        } : undefined}
        secondaryAction={{
          label: "Cancel",
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
                <DataTable columns={partsColumns} data={parts} emptyMessage="No parts added yet." />
              </div>
            </FormSection>

            {selectedRecord.refurbishmentStage === "Awaiting Supply" && (
              <p className="text-left text-sm text-muted-foreground">
                <span className="text-danger">*</span> All parts must be marked as Received before starting.
              </p>
            )}

            <FormSection title="Add New Part">
              <div className="flex items-end gap-2">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Part Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Battery Pack"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    className="h-12 bg-gray-50"
                    onKeyDown={(e) => e.key === "Enter" && handleAddPart()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Qty</label>
                  <Input
                    type="number"
                    min="1"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(e.target.value)}
                    className="h-12 w-16 bg-gray-50"
                  />
                </div>
                <Button variant="outline" className="h-12" onClick={handleAddPart}>
                  Add
                </Button>
              </div>
            </FormSection>
          </div>
        )}
      </Modal>
    </>
  )
}
