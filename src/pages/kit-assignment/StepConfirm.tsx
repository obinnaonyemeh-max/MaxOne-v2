import { InfoCard, InfoGrid } from "@/components/max"
import { type ReassignableVehicle } from "@/data/mockKitAssignment"
import type { NewAssignmentDetails } from "./StepNewAssignment"

interface StepConfirmProps {
  vehicle: ReassignableVehicle
  details: NewAssignmentDetails
}

export function StepConfirm({ vehicle, details }: StepConfirmProps) {
  return (
    <div className="space-y-4">
      <h3
        className="font-semibold uppercase text-sidebar-item-active"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        Confirm Assignment
      </h3>
      <p className="text-sm text-breadcrumb-root">
        Review the details below before assigning. This will move the vehicle/kit to the new champion.
      </p>

      <InfoCard title="Vehicle / Kit">
        <InfoGrid
          columns={2}
          items={[
            { label: "Vehicle Type", value: vehicle.vehicleType },
            { label: "Vehicle Model", value: vehicle.vehicleModel },
            { label: "Current Plate Number", value: vehicle.currentPlateNumber },
            { label: "Current Chassis/Kit ID", value: vehicle.currentChassisId },
            { label: "Current Champion", value: `${vehicle.currentChampion.name} (${vehicle.currentChampion.championId})` },
          ]}
        />
      </InfoCard>

      <InfoCard title="New Assignment">
        <InfoGrid
          columns={2}
          items={[
            { label: "New Plate Number", value: details.newPlateNumber },
            { label: "New Chassis", value: details.newChassisId },
            { label: "New Champion", value: details.newChampion || "—" },
          ]}
        />
      </InfoCard>
    </div>
  )
}
