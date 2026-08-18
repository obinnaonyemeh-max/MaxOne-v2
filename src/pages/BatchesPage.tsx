import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, Plus, Calendar as CalendarIcon, Info } from "lucide-react"
import { format } from "date-fns"

import {
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  Modal,
  TagInput,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"

import { mockBatches, type BatchRecord } from "@/data/mockBatches"
import { CITY_DESTINATION_OPTIONS } from "@/data/cities"
import { mockSubBatches } from "@/data/mockSubBatches"
import { mockVehicleTypes } from "@/data/mockStockSetup"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"

const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_WARNING = "var(--color-status-warning)"
const COLOR_STATUS_SUCCESS = "var(--color-status-success)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

const SUB_BATCH_STAGES = [
  { title: "In Production", indicatorColor: COLOR_GRAY_500 },
  { title: "Identifier Upload", indicatorColor: COLOR_STATUS_INFO },
  { title: "In Transit", indicatorColor: COLOR_STATUS_INFO },
  { title: "At Port", indicatorColor: COLOR_STATUS_WARNING },
  { title: "Clearing", indicatorColor: COLOR_STATUS_WARNING },
  { title: "Warehouse QA", indicatorColor: COLOR_GRAY_500 },
  { title: "Ready for Activation", indicatorColor: COLOR_STATUS_SUCCESS },
] as const

function buildSubBatchStageStats(subBatches: typeof mockSubBatches) {
  return SUB_BATCH_STAGES.map(({ title, indicatorColor }) => {
    const stageSubBatches = subBatches.filter((sb) => sb.stage === title)
    const subBatchCount = stageSubBatches.length
    const batchCount = new Set(stageSubBatches.map((sb) => sb.batchId)).size
    const vehicleQty = stageSubBatches.reduce((sum, sb) => sum + sb.qty, 0)

    return {
      title,
      value: vehicleQty.toLocaleString(),
      subtitle:
        subBatchCount === 0
          ? "0 sub-batches"
          : `${subBatchCount} sub-batch${subBatchCount === 1 ? "" : "es"} · ${batchCount} batch${batchCount === 1 ? "" : "es"}`,
      indicatorColor: vehicleQty > 0 ? indicatorColor : COLOR_GRAY_500,
    }
  })
}

const batchColumns: ColumnDef<BatchRecord>[] = [
  {
    accessorKey: "batchId",
    header: "Batch ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.batchId}
      </span>
    ),
  },
  {
    accessorKey: "oem",
    header: "OEM",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.oem}
      </span>
    ),
  },
  {
    accessorKey: "model",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.model}
      </span>
    ),
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.qty.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "subBatchCount",
    header: "Sub-Batches",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.subBatchCount}
      </span>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.eta}
      </span>
    ),
  },
]

const batchFilterSections: FilterSection[] = [
  {
    id: "oem",
    title: "OEM",
    defaultExpanded: true,
    options: [
      { value: "King", label: "King" },
      { value: "TailG", label: "TailG" },
      { value: "Spiro", label: "Spiro" },
    ],
  },
  {
    id: "destination",
    title: "Destination",
    options: CITY_DESTINATION_OPTIONS,
  },
]

const defaultBatchFilters: GenericFilterState = {
  oem: [],
  destination: [],
}

export default function BatchesPage() {
  const navigate = useNavigate()
  const [batchPage, setBatchPage] = useState(1)
  const [batchPageSize, setBatchPageSize] = useState(25)
  const [batchFilters, setBatchFilters] = useState<GenericFilterState>(defaultBatchFilters)
  const [batchSearchQuery, setBatchSearchQuery] = useState("")
  const [batchSearchOpen, setBatchSearchOpen] = useState(false)
  const [showCreateBatch, setShowCreateBatch] = useState(false)
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date | undefined>(undefined)
  const [containerNumbers, setContainerNumbers] = useState<string[]>([])
  const batchFilterCount = getActiveFilterCount(batchFilters)
  const canCreateBatch = useCan("inbound.batches.create")
  const scopedBatches = useCityScopedRecords(mockBatches, "destination")
  const allowedBatchIds = useMemo(
    () => new Set(scopedBatches.map((batch) => batch.batchId)),
    [scopedBatches]
  )
  const scopedSubBatches = useMemo(
    () => mockSubBatches.filter((sb) => allowedBatchIds.has(sb.batchId)),
    [allowedBatchIds]
  )
  const subBatchStageStats = useMemo(
    () => buildSubBatchStageStats(scopedSubBatches),
    [scopedSubBatches]
  )

  return (
    <div className="flex flex-1 flex-col min-h-0 mt-4">
      <div className="grid grid-cols-7 gap-2 shrink-0">
        {subBatchStageStats.map((stat) => (
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
                  {batchFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                      {batchFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <GenericFilterPopover
                  sections={batchFilterSections}
                  filters={batchFilters}
                  onFiltersChange={setBatchFilters}
                />
              </PopoverContent>
            </Popover>

            {batchSearchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={batchSearchQuery}
                  onChange={(e) => setBatchSearchQuery(e.target.value)}
                  placeholder="Search batches..."
                  className="h-9 w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("Search:", batchSearchQuery)
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => {
                    setBatchSearchOpen(false)
                    setBatchSearchQuery("")
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
                onClick={() => setBatchSearchOpen(true)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          {canCreateBatch && (
            <Button className="gap-2" onClick={() => setShowCreateBatch(true)}>
              <Plus className="h-4 w-4" />
              Create Batch
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable columns={batchColumns} data={scopedBatches} onRowClick={(row) => navigate(`/inbound/batches/${row.id}`)} />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={batchPage}
          totalPages={Math.ceil(scopedBatches.length / batchPageSize) || 1}
          totalItems={scopedBatches.length}
          pageSize={batchPageSize}
          onPageChange={setBatchPage}
          onPageSizeChange={setBatchPageSize}
          itemLabel="batches"
        />
      </div>

      <Modal
        open={showCreateBatch}
        onOpenChange={setShowCreateBatch}
        title="Create Inbound Batch"
        subtitle="Enter the batch details below."
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Create Batch",
          onClick: () => {
            console.log("Create batch submitted")
            setShowCreateBatch(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowCreateBatch(false),
        }}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Required
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Batch ID</label>
                <Input placeholder="e.g. BATCH-2026-001" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Quantity</label>
                <Input placeholder="Enter quantity" className="h-12 bg-input-soft" type="number" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Manufacturer / OEM</label>
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select manufacturer / OEM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="King">King</SelectItem>
                    <SelectItem value="Spiro">Spiro</SelectItem>
                    <SelectItem value="TailG">TailG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Name</label>
                <Select>
                  <SelectTrigger className="h-12 w-full bg-input-soft">
                    <SelectValue placeholder="Select name" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVehicleTypes.map((vt) => (
                      <SelectItem key={vt.id} value={vt.name}>{vt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Trim</label>
                <Input placeholder="Enter trim" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Destination Country</label>
                <Input placeholder="Enter country" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Destination City</label>
                <Input placeholder="Enter city" className="h-12 bg-input-soft" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Payment Reference</label>
                <Input placeholder="Enter payment reference" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Expected Delivery Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-input-soft"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedDeliveryDate ? format(expectedDeliveryDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expectedDeliveryDate}
                      onSelect={setExpectedDeliveryDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Optional
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Container Number</label>
                <TagInput
                  value={containerNumbers}
                  onChange={setContainerNumbers}
                  placeholder="Enter container number"
                />
                <span className="flex items-center gap-1 text-gray-950" style={{ fontSize: "11px" }}>
                  <Info className="h-3 w-3 shrink-0" />
                  Separate multiple container numbers with a comma.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Shipping Line</label>
                <Input placeholder="Enter shipping line" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Port of Arrival</label>
                <Input placeholder="Enter port of arrival" className="h-12 bg-input-soft" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Invoice / PO Reference</label>
                <Input placeholder="Enter invoice or PO reference" className="h-12 bg-input-soft" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Notes</label>
              <Textarea placeholder="Enter any additional notes" className="min-h-[120px] bg-input-soft" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
