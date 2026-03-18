import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, Plus, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import {
  DataTable,
  StatusBadge,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  Modal,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
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

interface BatchRecord {
  id: string
  batchId: string
  oem: string
  model: string
  qty: number
  stage: string
  destination: string
  eta: string
}

const mockBatches: BatchRecord[] = [
  { id: "1", batchId: "BATCH-12-3056", oem: "TailG", model: "Jidi", qty: 20000, stage: "At Port", destination: "Ghana / Accra", eta: "100d" },
  { id: "2", batchId: "BATCH-0990", oem: "Spiro", model: "Ekon", qty: 5000, stage: "Identifier Upload", destination: "Nigeria / Lagos", eta: "105d" },
  { id: "3", batchId: "BATCH-2026-003", oem: "King", model: "MAX M4", qty: 2500, stage: "In Transit", destination: "Nigeria / Lagos", eta: "75d" },
  { id: "4", batchId: "BATCH-2026-002", oem: "TailG", model: "Jidi", qty: 400, stage: "Ready for Activation", destination: "Ghana / Accra", eta: "65d" },
  { id: "5", batchId: "BATCH-2026-001", oem: "Spiro", model: "Ekon", qty: 1000, stage: "Identifier Upload", destination: "Nigeria / Lagos", eta: "74d" },
  { id: "6", batchId: "BATCH-2026-006", oem: "King", model: "MAX M4", qty: 3000, stage: "In Production", destination: "Nigeria / Lagos", eta: "120d" },
  { id: "7", batchId: "BATCH-2026-007", oem: "TailG", model: "Jidi", qty: 1500, stage: "Clearing", destination: "Ghana / Accra", eta: "45d" },
  { id: "8", batchId: "BATCH-2026-008", oem: "Spiro", model: "Ekon", qty: 800, stage: "Warehouse QA", destination: "Nigeria / Lagos", eta: "30d" },
]

const stageVariantMap: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  "At Port": "warning",
  "Identifier Upload": "info",
  "In Transit": "info",
  "In Production": "default",
  "Clearing": "warning",
  "Warehouse QA": "default",
  "Ready for Activation": "success",
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
    header: "Model",
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
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <StatusBadge variant={stageVariantMap[row.original.stage] || "default"}>
        {row.original.stage}
      </StatusBadge>
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
    id: "stage",
    title: "Stage",
    defaultExpanded: true,
    options: [
      { value: "In Production", label: "In Production" },
      { value: "Identifier Upload", label: "Identifier Upload" },
      { value: "In Transit", label: "In Transit" },
      { value: "At Port", label: "At Port" },
      { value: "Clearing", label: "Clearing" },
      { value: "Warehouse QA", label: "Warehouse QA" },
      { value: "Ready for Activation", label: "Ready for Activation" },
    ],
  },
  {
    id: "oem",
    title: "OEM",
    options: [
      { value: "King", label: "King" },
      { value: "TailG", label: "TailG" },
      { value: "Spiro", label: "Spiro" },
    ],
  },
  {
    id: "destination",
    title: "Destination",
    options: [
      { value: "Nigeria / Lagos", label: "Nigeria / Lagos" },
      { value: "Ghana / Accra", label: "Ghana / Accra" },
    ],
  },
]

const defaultBatchFilters: GenericFilterState = {
  stage: [],
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
  const batchFilterCount = getActiveFilterCount(batchFilters)

  return (
    <div className="flex flex-1 flex-col min-h-0 mt-4">
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
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

          <Button className="gap-2" onClick={() => setShowCreateBatch(true)}>
            <Plus className="h-4 w-4" />
            Create Batch
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable columns={batchColumns} data={mockBatches} onRowClick={(row) => navigate(`/inbound/batches/${row.id}`)} />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={batchPage}
          totalPages={Math.ceil(mockBatches.length / batchPageSize)}
          totalItems={mockBatches.length}
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
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Batch ID</label>
                <Input placeholder="e.g. BATCH-2026-001" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Quantity</label>
                <Input placeholder="Enter quantity" className="h-12 bg-[#F8F8F8]" type="number" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Manufacturer / OEM</label>
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
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
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Vehicle Type / Model</label>
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select vehicle type / model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAX M4">MAX M4</SelectItem>
                    <SelectItem value="Ekon">Ekon</SelectItem>
                    <SelectItem value="Jidi">Jidi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Trim</label>
                <Input placeholder="Enter trim" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Destination Country</label>
                <Input placeholder="Enter country" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Destination City</label>
                <Input placeholder="Enter city" className="h-12 bg-[#F8F8F8]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Payment Reference</label>
                <Input placeholder="Enter payment reference" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Expected Delivery Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-[#F8F8F8]"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Stage</label>
                <Select defaultValue="In Production">
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Production">In Production</SelectItem>
                    <SelectItem value="Identifier Upload">Identifier Upload</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="At Port">At Port</SelectItem>
                    <SelectItem value="Clearing">Clearing</SelectItem>
                    <SelectItem value="Warehouse QA">Warehouse QA</SelectItem>
                    <SelectItem value="Ready for Activation">Ready for Activation</SelectItem>
                  </SelectContent>
                </Select>
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
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Container Number</label>
                <Input placeholder="Enter container number" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Shipping Line</label>
                <Input placeholder="Enter shipping line" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Port of Arrival</label>
                <Input placeholder="Enter port of arrival" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Invoice / PO Reference</label>
                <Input placeholder="Enter invoice or PO reference" className="h-12 bg-[#F8F8F8]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Notes</label>
              <Textarea placeholder="Enter any additional notes" className="min-h-[120px] bg-[#F8F8F8]" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
