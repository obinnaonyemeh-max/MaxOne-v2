import { InfoCard, InfoGrid } from "@/components/max"
import {
  mockKitClients,
  type ReassignableVehicle,
} from "@/data/mockKitAssignment"
import type { NewAssignmentDetails } from "./StepNewAssignment"

interface StepConfirmProps {
  vehicle: ReassignableVehicle
  details: NewAssignmentDetails
}

export function StepConfirm({ vehicle, details }: StepConfirmProps) {
  const newClient = mockKitClients.find((c) => c.id === details.newClientId)

  return (
    <div className="space-y-4">
      <h3
        className="font-semibold uppercase text-sidebar-item-active"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        Confirm Assignment
      </h3>
      <p className="text-sm text-breadcrumb-root">
        Review the details below before assigning. This will move the vehicle/kit to the new client.
      </p>

      <InfoCard title="Vehicle / Kit">
        <InfoGrid
          columns={2}
          items={[
            { label: "Vehicle Type", value: vehicle.vehicleType },
            { label: "Vehicle Model", value: vehicle.vehicleModel },
            { label: "Current Plate Number", value: vehicle.currentPlateNumber },
            { label: "Current Chassis/Kit ID", value: vehicle.currentChassisId },
            { label: "Current Client", value: `${vehicle.currentClient.name} (${vehicle.currentClient.clientId})` },
          ]}
        />
      </InfoCard>

      <InfoCard title="New Assignment">
        <InfoGrid
          columns={2}
          items={[
            { label: "New Plate Number", value: details.newPlateNumber },
            { label: "New Chassis/Kit ID", value: details.newChassisId },
            {
              label: "New Client",
              value: newClient ? `${newClient.name} (${newClient.clientId})` : "—",
            },
          ]}
        />
      </InfoCard>
    </div>
  )
}
