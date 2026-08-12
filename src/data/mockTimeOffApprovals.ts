import { mockChampionDetails } from "./mockChampionDetails"

export interface TimeOffApprovalRecord {
  id: string
  championName: string
  championId: string
  leaveType: "Annual" | "Emergency" | "Sick"
  startDate: string
  endDate: string
  status: "Approved" | "Pending" | "Declined"
  approvedBy: string
}

export const mockTimeOffApprovals: TimeOffApprovalRecord[] = Object.values(
  mockChampionDetails
).flatMap((champion) =>
  champion.timeOff.history.map((leave) => ({
    id: `to-${champion.championId}-${leave.id}`,
    championName: champion.name,
    championId: champion.championId,
    leaveType: leave.type,
    startDate: leave.startDate,
    endDate: leave.endDate,
    status: leave.status,
    approvedBy: leave.approvedBy,
  }))
)

export const timeOffStatusVariantMap: Record<
  TimeOffApprovalRecord["status"],
  "success" | "warning" | "danger"
> = {
  Approved: "success",
  Pending: "warning",
  Declined: "danger",
}

export const leaveTypeVariantMap: Record<
  TimeOffApprovalRecord["leaveType"],
  "info" | "danger" | "warning"
> = {
  Annual: "info",
  Emergency: "danger",
  Sick: "warning",
}
