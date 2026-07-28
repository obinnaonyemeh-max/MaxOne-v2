import { Input } from "@/components/ui/input"

export interface NewAssignmentDetails {
  newPlateNumber: string
  newChassisId: string
  newClient: string
}

interface StepNewAssignmentProps {
  details: NewAssignmentDetails
  onUpdateField: (field: keyof NewAssignmentDetails, value: string) => void
}

export function StepNewAssignment({ details, onUpdateField }: StepNewAssignmentProps) {
  return (
    <div className="space-y-5">
      <h3
        className="font-semibold uppercase text-sidebar-item-active"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        New Assignment Details
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New plate number</label>
        <Input
          value={details.newPlateNumber}
          onChange={(e) => onUpdateField("newPlateNumber", e.target.value)}
          placeholder="Enter new plate number"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New chassis</label>
        <Input
          value={details.newChassisId}
          onChange={(e) => onUpdateField("newChassisId", e.target.value)}
          placeholder="Enter new chassis"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New client</label>
        <Input
          value={details.newClient}
          onChange={(e) => onUpdateField("newClient", e.target.value)}
          placeholder="Enter new client"
          className="h-10"
        />
      </div>
    </div>
  )
}
