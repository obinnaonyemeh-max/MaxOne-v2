import { useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import { ConfirmModal } from "@/components/max"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  mockManufacturers,
  mockVehicleTypes,
  mockModels,
  mockTrims,
  type ManufacturerRecord,
  type VehicleTypeRecord,
  type ModelRecord,
  type TrimRecord,
} from "@/data/mockStockSetup"

import {
  getManufacturerColumns,
  getVehicleTypeColumns,
  getModelColumns,
  getTrimColumns,
} from "./stock-setup/columns"
import { TabPanel } from "./stock-setup/TabPanel"
import { ManufacturerModal } from "./stock-setup/ManufacturerModal"
import { VehicleTypeModal } from "./stock-setup/VehicleTypeModal"
import { ModelModal } from "./stock-setup/ModelModal"
import { TrimModal } from "./stock-setup/TrimModal"

type StockSetupTab = "manufacturers" | "vehicle-types" | "models" | "trims"

type DeleteTarget =
  | { kind: "manufacturer" | "vehicle-type" | "model" | "trim"; id: string; label: string }
  | null

const deleteTitle: Record<NonNullable<DeleteTarget>["kind"], string> = {
  manufacturer: "Delete Manufacturer",
  "vehicle-type": "Delete Vehicle Type",
  model: "Delete Model",
  trim: "Delete Trim",
}

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
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

  const manufacturerColumns = useMemo(
    () =>
      getManufacturerColumns({
        onEdit: (row) => {
          setEditingManufacturer(row)
          setShowAddManufacturer(true)
        },
        onDelete: (row) => setDeleteTarget({ kind: "manufacturer", id: row.id, label: row.name }),
      }),
    [],
  )

  const vehicleTypeColumns = useMemo(
    () =>
      getVehicleTypeColumns({
        onEdit: (row) => {
          setEditingVehicleType(row)
          setShowAddVehicleType(true)
        },
        onDelete: (row) =>
          setDeleteTarget({
            kind: "vehicle-type",
            id: row.id,
            label: `${row.manufacturer} ${row.model} ${row.trim}`,
          }),
      }),
    [],
  )

  const modelColumns = useMemo(
    () =>
      getModelColumns({
        onEdit: (row) => {
          setEditingModel(row)
          setShowAddModel(true)
        },
        onDelete: (row) => setDeleteTarget({ kind: "model", id: row.id, label: row.modelName }),
      }),
    [],
  )

  const trimColumns = useMemo(
    () =>
      getTrimColumns({
        onEdit: (row) => {
          setEditingTrim(row)
          setShowAddTrim(true)
        },
        onDelete: (row) => setDeleteTarget({ kind: "trim", id: row.id, label: row.trimName }),
      }),
    [],
  )

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
          <TabPanel
            count={mockManufacturers.length}
            countLabel="manufacturers"
            addLabel="Add Manufacturer"
            onAdd={() => setShowAddManufacturer(true)}
            columns={manufacturerColumns}
            data={mockManufacturers}
          />
        </TabsContent>

        <TabsContent value="vehicle-types" className="flex-1 flex flex-col min-h-0 mt-4">
          <TabPanel
            count={mockVehicleTypes.length}
            countLabel="vehicle types"
            addLabel="Add Vehicle Type"
            onAdd={() => setShowAddVehicleType(true)}
            columns={vehicleTypeColumns}
            data={mockVehicleTypes}
          />
        </TabsContent>

        <TabsContent value="models" className="flex-1 flex flex-col min-h-0 mt-4">
          <TabPanel
            count={mockModels.length}
            countLabel="models"
            addLabel="Add Model"
            onAdd={() => setShowAddModel(true)}
            columns={modelColumns}
            data={mockModels}
          />
        </TabsContent>

        <TabsContent value="trims" className="flex-1 flex flex-col min-h-0 mt-4">
          <TabPanel
            count={mockTrims.length}
            countLabel="trims"
            addLabel="Add Trim"
            onAdd={() => setShowAddTrim(true)}
            columns={trimColumns}
            data={mockTrims}
          />
        </TabsContent>
      </Tabs>

      <ManufacturerModal
        open={showAddManufacturer}
        onOpenChange={handleManufacturerOpenChange}
        editing={editingManufacturer}
      />
      <VehicleTypeModal
        open={showAddVehicleType}
        onOpenChange={handleVehicleTypeOpenChange}
        editing={editingVehicleType}
      />
      <ModelModal open={showAddModel} onOpenChange={handleModelOpenChange} editing={editingModel} />
      <TrimModal open={showAddTrim} onOpenChange={handleTrimOpenChange} editing={editingTrim} />

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        variant="destructive"
        icon={Trash2}
        title={deleteTarget ? deleteTitle[deleteTarget.kind] : "Confirm Delete"}
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
