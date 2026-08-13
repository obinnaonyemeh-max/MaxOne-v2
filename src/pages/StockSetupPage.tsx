import { useMemo, useState } from "react"

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

import { useCan } from "@/contexts/RoleSimulationContext"
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
  const canAdd = useCan("inbound.stockSetup.add")
  const canEdit = useCan("inbound.stockSetup.edit")

  const manufacturerColumns = useMemo(
    () =>
      getManufacturerColumns({
        onEdit: canEdit
          ? (row) => {
              setEditingManufacturer(row)
              setShowAddManufacturer(true)
            }
          : undefined,
      }),
    [canEdit],
  )

  const vehicleTypeColumns = useMemo(
    () =>
      getVehicleTypeColumns({
        onEdit: canEdit
          ? (row) => {
              setEditingVehicleType(row)
              setShowAddVehicleType(true)
            }
          : undefined,
      }),
    [canEdit],
  )

  const modelColumns = useMemo(
    () =>
      getModelColumns({
        onEdit: canEdit
          ? (row) => {
              setEditingModel(row)
              setShowAddModel(true)
            }
          : undefined,
      }),
    [canEdit],
  )

  const trimColumns = useMemo(
    () =>
      getTrimColumns({
        onEdit: canEdit
          ? (row) => {
              setEditingTrim(row)
              setShowAddTrim(true)
            }
          : undefined,
      }),
    [canEdit],
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
            Vehicle Classification
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
            showAdd={canAdd}
          />
        </TabsContent>

        <TabsContent value="vehicle-types" className="flex-1 flex flex-col min-h-0 mt-4">
          <TabPanel
            count={mockVehicleTypes.length}
            countLabel="vehicle classifications"
            addLabel="Add Vehicle Classification"
            onAdd={() => setShowAddVehicleType(true)}
            columns={vehicleTypeColumns}
            data={mockVehicleTypes}
            showAdd={canAdd}
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
            showAdd={canAdd}
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
            showAdd={canAdd}
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
    </div>
  )
}
