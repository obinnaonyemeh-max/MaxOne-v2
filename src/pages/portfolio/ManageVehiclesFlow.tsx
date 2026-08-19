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

interface ManageVehiclesFlowProps {
  open: boolean
  onClose: () => void
  vehicles: RecoveryVehicle[]
  pairs: RecoveryPair[]
  onReassign: (vehicleId: string, pairId: string | null) => void
}

export function ManageVehiclesFlow({ open, onClose, vehicles, pairs, onReassign }: ManageVehiclesFlowProps) {
  const pairCode = (pairId: string | null) => pairs.find((p) => p.id === pairId)?.pairCode ?? null

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Manage Operational Vehicles"
      subtitle="Reassign vehicles across recovery pairs or take them out of service"
      className="max-w-2xl"
      primaryAction={{ label: "Done", onClick: onClose }}
    >
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_1fr_100px_1fr] gap-3 px-2 pb-2 text-xs font-medium text-breadcrumb-root">
          <span>Vehicle</span>
          <span>Type</span>
          <span>Status</span>
          <span>Assigned Pair</span>
        </div>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="grid grid-cols-[1fr_1fr_100px_1fr] items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-2 py-2.5"
          >
            <span className="text-sm font-medium text-table-text-primary">{vehicle.plateNumber}</span>
            <span className="text-sm text-table-text">{vehicle.type}</span>
            <StatusBadge variant={vehicleStatusVariantMap[vehicle.status]} size="sm">
              {vehicle.status}
            </StatusBadge>
            <Select
              value={vehicle.pairId ?? UNASSIGNED}
              onValueChange={(value) => onReassign(vehicle.id, value === UNASSIGNED ? null : value)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Unassigned">
                  {vehicle.pairId ? pairCode(vehicle.pairId) : "Unassigned"}
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
          </div>
        ))}
      </div>
    </Modal>
  )
}
