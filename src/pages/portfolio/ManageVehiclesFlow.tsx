import { useState } from "react"
import { Pencil, X } from "lucide-react"
import { Modal, StatusBadge } from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type RecoveryVehicle,
  type RecoveryPair,
  vehicleStatusVariantMap,
} from "@/data/mockRecoveryOfficers"

const UNASSIGNED = "unassigned"

function vehicleIconFor(type: RecoveryVehicle["type"]): string {
  return type === "Two-Wheeler" ? "/images/2_wheeler.svg" : "/images/4_wheeler.svg"
}

interface ManageVehiclesFlowProps {
  open: boolean
  onClose: () => void
  vehicles: RecoveryVehicle[]
  pairs: RecoveryPair[]
  onReassign: (vehicleId: string, pairId: string | null) => void
  getOfficerNames: (pair: RecoveryPair) => string
}

export function ManageVehiclesFlow({
  open,
  onClose,
  vehicles,
  pairs,
  onReassign,
  getOfficerNames,
}: ManageVehiclesFlowProps) {
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)

  const pairFor = (pairId: string | null) => pairs.find((p) => p.id === pairId) ?? null

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setEditingVehicleId(null)
        onClose()
      }}
      title="Manage Operational Vehicles"
      subtitle="Reassign vehicles across recovery pairs or take them out of service"
      className="max-w-2xl"
      primaryAction={{ label: "Done", onClick: onClose }}
    >
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1.4fr_100px_1.6fr] gap-3 px-2 pb-2 text-xs font-medium text-breadcrumb-root">
          <span>Vehicle</span>
          <span>Status</span>
          <span>Assigned Pair</span>
        </div>
        {vehicles.map((vehicle) => {
          const isEditing = editingVehicleId === vehicle.id
          const assignedPair = pairFor(vehicle.pairId)

          return (
            <div
              key={vehicle.id}
              className="grid grid-cols-[1.4fr_100px_1.6fr] items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-2 py-2.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0">
                  <img src={vehicleIconFor(vehicle.type)} alt={vehicle.type} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-table-text-primary truncate">{vehicle.plateNumber}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                </div>
              </div>

              <StatusBadge variant={vehicleStatusVariantMap[vehicle.status]} size="sm">
                {vehicle.status}
              </StatusBadge>

              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Select
                    value={vehicle.pairId ?? UNASSIGNED}
                    onValueChange={(value) => {
                      onReassign(vehicle.id, value === UNASSIGNED ? null : value)
                      setEditingVehicleId(null)
                    }}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Unassigned">
                        {assignedPair ? assignedPair.pairCode : "Unassigned"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {pairs.map((pair) => (
                        <SelectItem key={pair.id} value={pair.id}>
                          {pair.pairCode} &middot; {pair.zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => setEditingVehicleId(null)}
                    className="shrink-0 p-1.5 rounded hover:bg-gray-100 text-gray-400"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-table-text-primary truncate">
                      {assignedPair ? assignedPair.pairCode : "Unassigned"}
                    </p>
                    {assignedPair && (
                      <p className="text-xs text-muted-foreground truncate">{getOfficerNames(assignedPair)}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingVehicleId(vehicle.id)}
                    className="flex items-center gap-1 shrink-0 text-xs font-medium text-status-info hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    Change
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
