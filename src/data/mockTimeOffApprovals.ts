import { getChampionByCode } from "./mockChampions"
import { listChampionDetails } from "./mockChampionDetails"

export interface TimeOffApprovalRecord {
  id: string
  championName: string
  championId: string
  city: string
  subcity: string
  leaveType: "Annual" | "Emergency" | "Sick"
  startDate: string
  endDate: string
  status: "Approved" | "Pending" | "Declined"
  approvedBy: string
}

export const mockTimeOffApprovals: TimeOffApprovalRecord[] = listChampionDetails().flatMap(
  (champion) =>
    champion.timeOff.history.map((leave) => {
      const seed = getChampionByCode(champion.championId)
      return {
        id: `to-${champion.championId}-${leave.id}`,
        championName: champion.name,
        championId: champion.championId,
        city: seed?.city ?? champion.city,
        subcity: seed?.subcity ?? champion.subcity,
        leaveType: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
        approvedBy: leave.approvedBy,
      }
    })
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
