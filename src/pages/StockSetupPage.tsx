import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Pencil, Trash2 } from "lucide-react"

import {
  DataTable,
  StatusBadge,
  Modal,
  ConfirmModal,
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

interface ModelRecord {
  id: string
  manufacturer: string
  modelName: string
}

interface TrimRecord {
  id: string
  model: string
  trimName: string
}

const mockManufacturers: ManufacturerRecord[] = [
  { id: "1", name: "King", brand: "MAX M4", country: "China", contact: "Kay", status: "active" },
  { id: "2", name: "Spiro", brand: "Ekon", country: "China", contact: "John", status: "active" },
  { id: "3", name: "TailG", brand: "Jidi", country: "China", contact: "James", status: "active" },
]

const mockVehicleTypes: VehicleTypeRecord[] = [
  { id: "1", model: "Ekon", manufacturer: "Spiro", trim: "Ekon V2", category: "Electric Vehicle", battery: "3.3kWh", range: "400km" },
  { id: "2", model: "Jidi", manufacturer: "TailG", trim: "V1", category: "Electric Vehicle", battery: "3.3kWh", range: "400km" },
  { id: "3", model: "MAX M4", manufacturer: "King", trim: "MM4", category: "Internal Combustion Engine", battery: "60kWh", range: "400km" },
]

const mockModels: ModelRecord[] = [
  { id: "1", manufacturer: "Spiro", modelName: "Ekon" },
  { id: "2", manufacturer: "TailG", modelName: "Jidi" },
  { id: "3", manufacturer: "King", modelName: "MAX M4" },
]

const mockTrims: TrimRecord[] = [
  { id: "1", model: "Ekon", trimName: "Ekon V2" },
  { id: "2", model: "Jidi", trimName: "V1" },
  { id: "3", model: "MAX M4", trimName: "MM4" },
]


type StockSetupTab = "manufacturers" | "vehicle-types" | "models" | "trims"

export default function StockSetupPage() {
  const [stockSetupTab, setStockSetupTab] = useState<StockSetupTab>("manufacturers")
  const [showAddManufacturer, setShowAddManufacturer] = useState(false)
  const [showAddVehicleType, setShowAddVehicleType] = useState(false)
  const [showAddModel, setShowAddModel] = useState(false)
  const [showAddTrim, setShowAddTrim] = useState(false)
  const [editingManufacturer, setEditingManufacturer] = useState<ManufacturerRecord | null>(null)
  const [editingModel, setEditingModel] = useState<ModelRecord | null>(null)
  const [editingTrim, setEditingTrim] = useState<TrimRecord | null>(null)
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleTypeRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "manufacturer" | "vehicle-type" | "model" | "trim"; id: string; label: string }
    | null
  >(null)

  const vehicleTypeColumns = useMemo<ColumnDef<VehicleTypeRecord>[]>(() => [
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
              setEditingVehicleType(row.original)
              setShowAddVehicleType(true)
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
              setDeleteTarget({ kind: "vehicle-type", id: row.original.id, label: `${row.original.manufacturer} ${row.original.model} ${row.original.trim}` })
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], [])

  const manufacturerColumns = useMemo<ColumnDef<ManufacturerRecord>[]>(() => [
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
        <StatusBadge variant="success">{row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}</StatusBadge>
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
              setEditingManufacturer(row.original)
              setShowAddManufacturer(true)
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
              setDeleteTarget({ kind: "manufacturer", id: row.original.id, label: row.original.name })
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], [])

  const modelColumns = useMemo<ColumnDef<ModelRecord>[]>(() => [
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.manufacturer}
        </span>
      ),
    },
    {
      accessorKey: "modelName",
      header: "Model Name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.modelName}
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
              setEditingModel(row.original)
              setShowAddModel(true)
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
              setDeleteTarget({ kind: "model", id: row.original.id, label: row.original.modelName })
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], [])

  const trimColumns = useMemo<ColumnDef<TrimRecord>[]>(() => [
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
      accessorKey: "trimName",
      header: "Trim Name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.trimName}
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
              setEditingTrim(row.original)
              setShowAddTrim(true)
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
              setDeleteTarget({ kind: "trim", id: row.original.id, label: row.original.trimName })
            }}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], [])

  const handleManufacturerOpenChange = (open: boolean) => {
    setShowAddManufacturer(open)
    if (!open) setEditingManufacturer(null)
  }
  const handleModelOpenChange = (open: boolean) => {
    setShowAddModel(open)
    if (!open) setEditingModel(null)
  }
  const handleTrimOpenChange = (open: boolean) => {
    setShowAddTrim(open)
    if (!open) setEditingTrim(null)
  }
  const handleVehicleTypeOpenChange = (open: boolean) => {
    setShowAddVehicleType(open)
    if (!open) setEditingVehicleType(null)
  }

  return (
    <div className="flex flex-1 flex flex-col min-h-0 mt-4">
      <Tabs
        value={stockSetupTab}
        onValueChange={(v) => setStockSetupTab(v as StockSetupTab)}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList variant="line" className="shrink-0 pb-0 gap-0 w-fit">
          <TabsTrigger value="manufacturers" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Manufacturers
          </TabsTrigger>
          <TabsTrigger value="vehicle-types" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Vehicle Types
          </TabsTrigger>
          <TabsTrigger value="models" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Models
          </TabsTrigger>
          <TabsTrigger value="trims" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Trims
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

        <TabsContent value="models" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {mockModels.length} models
              </span>
              <Button className="gap-2" onClick={() => setShowAddModel(true)}>
                <Plus className="h-4 w-4" />
                Add Model
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={modelColumns} data={mockModels} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trims" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
              <span className="text-sm font-medium text-muted-foreground">
                {mockTrims.length} trims
              </span>
              <Button className="gap-2" onClick={() => setShowAddTrim(true)}>
                <Plus className="h-4 w-4" />
                Add Trim
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={trimColumns} data={mockTrims} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        open={showAddManufacturer}
        onOpenChange={handleManufacturerOpenChange}
        title={editingManufacturer ? "Edit Manufacturer" : "Add Manufacturer"}
        subtitle={editingManufacturer ? "Update the manufacturer details below." : "Enter the manufacturer details below."}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: editingManufacturer ? "Update Manufacturer" : "Create Manufacturer",
          onClick: () => {
            console.log(editingManufacturer ? "Update manufacturer submitted" : "Create manufacturer submitted")
            handleManufacturerOpenChange(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => handleManufacturerOpenChange(false),
        }}
      >
        <div key={editingManufacturer?.id ?? "new"} className="space-y-8">
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
                <Input placeholder="Enter manufacturer name" className="h-12 bg-[#F8F8F8]" defaultValue={editingManufacturer?.name ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Brand Name</label>
                <Input placeholder="Enter brand name" className="h-12 bg-[#F8F8F8]" defaultValue={editingManufacturer?.brand ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Country of Origin</label>
                <Input placeholder="Enter country of origin" className="h-12 bg-[#F8F8F8]" defaultValue={editingManufacturer?.country ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Status</label>
                <Select defaultValue={editingManufacturer ? (editingManufacturer.status === "active" ? "Active" : "Inactive") : "Active"}>
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
                <Input placeholder="Enter contact person" className="h-12 bg-[#F8F8F8]" defaultValue={editingManufacturer?.contact ?? ""} />
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
        onOpenChange={handleVehicleTypeOpenChange}
        title={editingVehicleType ? "Edit Vehicle Type" : "Add Vehicle Type"}
        subtitle={editingVehicleType ? "Update the vehicle type details below." : "Enter the vehicle type details below."}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: editingVehicleType ? "Update Vehicle Type" : "Create Vehicle Type",
          onClick: () => {
            console.log(editingVehicleType ? "Update vehicle type submitted" : "Create vehicle type submitted")
            handleVehicleTypeOpenChange(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => handleVehicleTypeOpenChange(false),
        }}
      >
        <div key={editingVehicleType?.id ?? "new"} className="space-y-8">
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
                <Select defaultValue={editingVehicleType?.manufacturer ?? ""}>
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
                <Select defaultValue={editingVehicleType?.model ?? ""}>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockModels.map((m) => (
                      <SelectItem key={m.id} value={m.modelName}>{m.modelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Trim</label>
                <Select defaultValue={editingVehicleType?.trim ?? ""}>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select trim" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTrims.map((t) => (
                      <SelectItem key={t.id} value={t.trimName}>{t.trimName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Vehicle Category</label>
                <Select defaultValue={editingVehicleType?.category ?? ""}>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select vehicle category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal Combustion Engine">Internal Combustion Engine</SelectItem>
                    <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input placeholder="Enter battery type" className="h-12 bg-[#F8F8F8]" defaultValue={editingVehicleType?.battery ?? ""} />
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
                <Input placeholder="e.g. 400 km" className="h-12 bg-[#F8F8F8]" defaultValue={editingVehicleType?.range ?? ""} />
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

      <Modal
        open={showAddModel}
        onOpenChange={handleModelOpenChange}
        title={editingModel ? "Edit Model" : "Add Model"}
        subtitle={editingModel ? "Update the model details below." : "Enter the model details below."}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: editingModel ? "Update Model" : "Create Model",
          onClick: () => {
            console.log(editingModel ? "Update model submitted" : "Create model submitted")
            handleModelOpenChange(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => handleModelOpenChange(false),
        }}
      >
        <div key={editingModel?.id ?? "new"} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Model Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Manufacturer</label>
                <Select defaultValue={editingModel?.manufacturer ?? ""}>
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
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Model Name</label>
                <Input placeholder="Enter model name" className="h-12 bg-[#F8F8F8]" defaultValue={editingModel?.modelName ?? ""} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={showAddTrim}
        onOpenChange={handleTrimOpenChange}
        title={editingTrim ? "Edit Trim" : "Add Trim"}
        subtitle={editingTrim ? "Update the trim details below." : "Enter the trim details below."}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: editingTrim ? "Update Trim" : "Create Trim",
          onClick: () => {
            console.log(editingTrim ? "Update trim submitted" : "Create trim submitted")
            handleTrimOpenChange(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => handleTrimOpenChange(false),
        }}
      >
        <div key={editingTrim?.id ?? "new"} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
              <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                Trim Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Model</label>
                <Select defaultValue={editingTrim?.model ?? ""}>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockModels.map((m) => (
                      <SelectItem key={m.id} value={m.modelName}>{m.modelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Trim Name</label>
                <Input placeholder="Enter trim name" className="h-12 bg-[#F8F8F8]" defaultValue={editingTrim?.trimName ?? ""} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        variant="destructive"
        icon={Trash2}
        title={
          deleteTarget?.kind === "manufacturer" ? "Delete Manufacturer"
          : deleteTarget?.kind === "vehicle-type" ? "Delete Vehicle Type"
          : deleteTarget?.kind === "model" ? "Delete Model"
          : deleteTarget?.kind === "trim" ? "Delete Trim"
          : "Confirm Delete"
        }
        subtitle={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.label}"? This action cannot be undone.`
            : undefined
        }
        primaryAction={{
          label: "Delete",
          onClick: () => {
            if (deleteTarget) console.log(`Delete ${deleteTarget.kind}:`, deleteTarget.id)
            setDeleteTarget(null)
          },
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setDeleteTarget(null),
        }}
      />
    </div>
  )
}
