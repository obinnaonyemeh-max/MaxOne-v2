import { useState } from "react"
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
import { mockVehicleTypes } from "@/data/mockStockSetup"

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
    options: [
      { value: "Nigeria / Lagos", label: "Nigeria / Lagos" },
      { value: "Ghana / Accra", label: "Ghana / Accra" },
    ],
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
