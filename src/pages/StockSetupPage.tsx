import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2 } from "lucide-react"

import {
  DataTable,
  StatusBadge,
  Modal,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ManufacturerRecord {
  id: string
  name: string
  brand: string
  country: string
  contact: string
  status: "active" | "inactive"
}

interface VehicleTypeRecord {
  id: string
  model: string
  manufacturer: string
  trim: string
  category: string
  battery: string
  range: string
}

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

const manufacturerColumns: ColumnDef<ManufacturerRecord>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.brand}
      </span>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.country}
      </span>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.contact}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header: "Model",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.model}
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
    accessorKey: "trim",
    header: "Trim",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.trim}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "battery",
    header: "Battery",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.battery}
      </span>
    ),
  },
  {
    accessorKey: "range",
    header: "Range",
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

export default function StockSetupPage() {
  const [stockSetupTab, setStockSetupTab] = useState<"manufacturers" | "vehicle-types">("manufacturers")
  const [showAddManufacturer, setShowAddManufacturer] = useState(false)
  const [showAddVehicleType, setShowAddVehicleType] = useState(false)

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
                {mockManufacturers.length} manufacturers
              </span>
              <Button className="gap-2" onClick={() => setShowAddManufacturer(true)}>
                <Plus className="h-4 w-4" />
                Add Manufacturer
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={manufacturerColumns} data={mockManufacturers} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-types" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {mockVehicleTypes.length} vehicle types
              </span>
              <Button className="gap-2" onClick={() => setShowAddVehicleType(true)}>
                <Plus className="h-4 w-4" />
                Add Vehicle Type
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={vehicleTypeColumns} data={mockVehicleTypes} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        open={showAddManufacturer}
        onOpenChange={setShowAddManufacturer}
        title="Add Manufacturer"
        subtitle="Enter the manufacturer details below."
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Create Manufacturer",
          onClick: () => {
            console.log("Create manufacturer submitted")
            setShowAddManufacturer(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowAddManufacturer(false),
        }}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Manufacturer Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Manufacturer / OEM Name</label>
                <Input placeholder="Enter manufacturer name" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Brand Name</label>
                <Input placeholder="Enter brand name" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Country of Origin</label>
                <Input placeholder="Enter country of origin" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Status</label>
                <Select defaultValue="Active">
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Contact Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Contact Person</label>
                <Input placeholder="Enter contact person" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Contact Email</label>
                <Input placeholder="Enter contact email" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Contact Phone</label>
                <Input placeholder="Enter contact phone" className="h-12 bg-[#F8F8F8]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Additional Notes
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Notes</label>
              <Textarea placeholder="Enter any additional notes" className="min-h-[120px] bg-[#F8F8F8]" />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={showAddVehicleType}
        onOpenChange={setShowAddVehicleType}
        title="Add Vehicle Type"
        subtitle="Enter the vehicle type details below."
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Create Vehicle Type",
          onClick: () => {
            console.log("Create vehicle type submitted")
            setShowAddVehicleType(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowAddVehicleType(false),
        }}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Vehicle Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Manufacturer</label>
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockManufacturers.map((m) => (
                      <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Model</label>
                <Input placeholder="Enter model name" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Trim</label>
                <Input placeholder="Enter trim" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Vehicle Category</label>
                <Input placeholder="e.g. Sedan, SUV, Truck" className="h-12 bg-[#F8F8F8]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Performance & Specifications
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Battery Type / Powertrain</label>
                <Input placeholder="Enter battery type" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Battery Capacity</label>
                <Input placeholder="e.g. 60 kWh" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Motor Power</label>
                <Input placeholder="e.g. 150 kW" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Top Speed</label>
                <Input placeholder="e.g. 180 km/h" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Range</label>
                <Input placeholder="e.g. 400 km" className="h-12 bg-[#F8F8F8]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Seating / Payload</label>
                <Input placeholder="Enter seating or payload" className="h-12 bg-[#F8F8F8]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Additional Notes
              </h3>
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
