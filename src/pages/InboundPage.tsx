import { useState } from "react"
import { useLocation } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export interface InboundBatchRecord {
  id: string
  batchId: string
  oem: string
  vehicleModel: string
  quantity: number
  currentStage: string
  destination: string
  daysInStage: string
  eta: string
}

export interface ManufacturerRecord {
  id: string
  name: string
  brand: string
  country: string
  contact: string
  status: "active" | "inactive"
}

export interface VehicleTypeRecord {
  id: string
  model: string
  manufacturer: string
  trim: string
  category: string
  battery: string
  range: string
}

const COLOR_STATUS_INFO = "#1855FC"
const COLOR_GRAY_500 = "#737373"

const inboundStats = [
  {
    title: "In Production",
    value: 0,
    subtitle: "0 batches, Avg 0d",
    indicatorColor: COLOR_GRAY_500,
  },
  {
    title: "Identifier Upload",
    value: 1400,
    subtitle: "2 batches, Avg 1d",
    indicatorColor: COLOR_STATUS_INFO,
  },
  {
    title: "In Transit",
    value: 2500,
    subtitle: "1 batch, Avg 0d",
    indicatorColor: COLOR_STATUS_INFO,
  },
  {
    title: "At Port",
    value: 0,
    subtitle: "0 batches, Avg 0d",
    indicatorColor: COLOR_GRAY_500,
  },
  {
    title: "Clearing",
    value: 0,
    subtitle: "0 batches, Avg 0d",
    indicatorColor: COLOR_GRAY_500,
  },
  {
    title: "Warehouse QA",
    value: 0,
    subtitle: "0 batches, Avg 0d",
    indicatorColor: COLOR_GRAY_500,
  },
  {
    title: "Ready for Activation",
    value: 0,
    subtitle: "0 batches, Avg 0d",
    indicatorColor: COLOR_GRAY_500,
  },
]

const inboundFilterSections: FilterSection[] = [
  {
    id: "currentStage",
    title: "Current Stage",
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
    title: "OEM / Manufacturer",
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

const defaultInboundFilters: GenericFilterState = {
  currentStage: [],
  oem: [],
  destination: [],
}

const mockInboundBatches: InboundBatchRecord[] = [
  {
    id: "1",
    batchId: "BATCH-2026-003",
    oem: "King",
    vehicleModel: "MAX M4",
    quantity: 2500,
    currentStage: "In Transit",
    destination: "Nigeria / Lagos",
    daysInStage: "0d",
    eta: "81 days",
  },
  {
    id: "2",
    batchId: "BATCH-2026-002",
    oem: "TailG",
    vehicleModel: "Jidi",
    quantity: 400,
    currentStage: "Identifier Upload",
    destination: "Ghana / Accra",
    daysInStage: "1d",
    eta: "71 days",
  },
  {
    id: "3",
    batchId: "BATCH-2026-001",
    oem: "Spiro",
    vehicleModel: "Ekon",
    quantity: 1000,
    currentStage: "Identifier Upload",
    destination: "Nigeria / Lagos",
    daysInStage: "1d",
    eta: "80 days",
  },
]

const mockManufacturers: ManufacturerRecord[] = [
  { id: "1", name: "King", brand: "MAX M4", country: "China", contact: "Kay", status: "active" },
  { id: "2", name: "Spiro", brand: "Ekon", country: "China", contact: "John", status: "active" },
  { id: "3", name: "TailG", brand: "Jidi", country: "China", contact: "James", status: "active" },
]

const mockVehicleTypes: VehicleTypeRecord[] = [
  { id: "1", model: "Ekon", manufacturer: "Spiro", trim: "Ekon V2", category: "eMotorcycle", battery: "3.3kWh", range: "400km" },
  { id: "2", model: "Jidi", manufacturer: "TailG", trim: "V1", category: "eMotorcycle", battery: "3.3kWh", range: "400km" },
  { id: "3", model: "MAX M4", manufacturer: "King", trim: "MM4", category: "eMotorcycle", battery: "60kWh", range: "400km" },
]

const columns: ColumnDef<InboundBatchRecord>[] = [
  {
    accessorKey: "batchId",
    header: "BATCH ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.batchId}
      </span>
    ),
  },
  {
    accessorKey: "oem",
    header: "OEM / MANUFACTURER",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.oem}
      </span>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "VEHICLE MODEL",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.vehicleModel}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.quantity.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "currentStage",
    header: "CURRENT STAGE",
    cell: ({ row }) => (
      <StatusBadge variant="info">{row.original.currentStage}</StatusBadge>
    ),
  },
  {
    accessorKey: "destination",
    header: "DESTINATION",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: "daysInStage",
    header: "DAYS IN STAGE",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.daysInStage}
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

const manufacturerColumns: ColumnDef<ManufacturerRecord>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "brand",
    header: "BRAND",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.brand}
      </span>
    ),
  },
  {
    accessorKey: "country",
    header: "COUNTRY",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.country}
      </span>
    ),
  },
  {
    accessorKey: "contact",
    header: "CONTACT",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.contact}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <StatusBadge variant="success">{row.original.status}</StatusBadge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Edit manufacturer:", row.original.id)
          }}
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Delete manufacturer:", row.original.id)
          }}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

const vehicleTypeColumns: ColumnDef<VehicleTypeRecord>[] = [
  {
    accessorKey: "model",
    header: "MODEL",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.model}
      </span>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "MANUFACTURER",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.manufacturer}
      </span>
    ),
  },
  {
    accessorKey: "trim",
    header: "TRIM",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.trim}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "battery",
    header: "BATTERY",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.battery}
      </span>
    ),
  },
  {
    accessorKey: "range",
    header: "RANGE",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.range}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Edit vehicle type:", row.original.id)
          }}
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Delete vehicle type:", row.original.id)
          }}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
]

function StockSetupContent({
  manufacturers,
  vehicleTypes,
}: {
  manufacturers: ManufacturerRecord[]
  vehicleTypes: VehicleTypeRecord[]
}) {
  const [stockSetupTab, setStockSetupTab] = useState<"manufacturers" | "vehicle-types">("manufacturers")

  return (
    <div className="flex flex-1 flex flex-col min-h-0 mt-4">
      <Tabs
        value={stockSetupTab}
        onValueChange={(v) => setStockSetupTab(v as "manufacturers" | "vehicle-types")}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList variant="line" className="shrink-0 pb-0 gap-0 w-fit">
          <TabsTrigger value="manufacturers" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Manufacturers
          </TabsTrigger>
          <TabsTrigger value="vehicle-types" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Vehicle Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manufacturers" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {manufacturers.length} manufacturers
              </span>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Manufacturer
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={manufacturerColumns} data={manufacturers} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-types" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {vehicleTypes.length} vehicle types
              </span>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vehicle Type
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={vehicleTypeColumns} data={vehicleTypes} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function InboundPage() {
  const location = useLocation()
  const pathTab = location.pathname.split("/").pop() || "dashboard"
  const activeTab = ["dashboard", "stock-setup", "batches"].includes(pathTab)
    ? pathTab
    : "dashboard"

  const tabLabels: Record<string, string> = {
    dashboard: "Dashboard",
    "stock-setup": "Stock Setup",
    batches: "Batches",
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultInboundFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/dashboard" },
          { label: tabLabels[activeTab] },
        ]}
      />
      <PageHeader
        title={tabLabels[activeTab]}
        subtitle="Vehicle pipeline from production to activation"
        className="shrink-0"
      />

      <div className="flex-1 flex flex-col min-h-0 px-6">
        {activeTab === "dashboard" && (
          <>
          <div className="grid grid-cols-7 gap-2 shrink-0 mt-4">
            {inboundStats.map((stat) => (
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
                      sections={inboundFilterSections}
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
                      placeholder="Search batches, OEMs, VIN"
                      className="h-9 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Search:", searchQuery)
                        }
                      }}
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
              <DataTable columns={columns} data={mockInboundBatches} />
            </div>
          </div>

          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(mockInboundBatches.length / pageSize)}
              totalItems={mockInboundBatches.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemLabel="records"
            />
          </div>
          </>
        )}

        {activeTab === "stock-setup" && (
          <StockSetupContent
            manufacturers={mockManufacturers}
            vehicleTypes={mockVehicleTypes}
          />
        )}

        {activeTab === "batches" && (
          <div className="flex flex-1 flex flex-col min-h-0 mt-4">
            <div className="flex flex-1 items-center justify-center rounded-lg border border-table-border bg-content-card">
              <p className="text-sm text-muted-foreground">Batches — Coming soon</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
