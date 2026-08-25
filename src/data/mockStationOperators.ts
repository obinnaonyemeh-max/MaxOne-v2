import { mockSwapStations } from "./mockStationsData"
import { mockTechnicians, type Technician } from "./mockTechnicians"

export type SwapOperatorStatus = "Active" | "Inactive"

export interface StationSwapOperator {
  id: string
  stationId: string
  technicianId: string
  name: string
  maxId: string
  status: SwapOperatorStatus
  dateAssigned: string
}

export const swapOperatorStatusVariantMap: Record<
  SwapOperatorStatus,
  "success" | "default"
> = {
  Active: "success",
  Inactive: "default",
}

const ASSIGNMENT_DATES = [
  "12 Jan 2024",
  "28 Jan 2024",
  "04 Feb 2024",
  "15 Feb 2024",
  "22 Feb 2024",
]

function padMaxId(stationId: string, index: number): string {
  return `MAX-OP-${stationId.replace("STN-", "")}-${String(index).padStart(3, "0")}`
}

function formatAssignedToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const stationOperators: StationSwapOperator[] = mockSwapStations.flatMap(
  (station, stationIndex) => {
    const count = stationIndex === 0 ? 3 : (stationIndex % 3) + 1
    return Array.from({ length: count }, (_, index) => {
      const technician =
        mockTechnicians[(stationIndex + index) % mockTechnicians.length]
      return {
        id: `${station.id}-OP-${String(index + 1).padStart(3, "0")}`,
        stationId: station.id,
        technicianId: technician.id,
        name: technician.name,
        maxId: padMaxId(station.id, index + 1),
        status:
          stationIndex !== 0 && index === count - 1 && stationIndex % 5 === 0
            ? "Inactive"
            : "Active",
        dateAssigned: ASSIGNMENT_DATES[(stationIndex + index) % ASSIGNMENT_DATES.length],
      }
    })
  }
)

export function getOperatorsForStation(stationId: string): StationSwapOperator[] {
  return stationOperators.filter((operator) => operator.stationId === stationId)
}

export function assignOperatorToStation(
  stationId: string,
  technician: Technician
): StationSwapOperator | undefined {
  const existing = getOperatorsForStation(stationId)
  if (existing.some((operator) => operator.technicianId === technician.id)) {
    return existing.find((operator) => operator.technicianId === technician.id)
  }

  const nextIndex =
    existing.reduce((max, operator) => {
      const parsed = Number(operator.maxId.split("-").pop())
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max
    }, 0) + 1

  const assigned: StationSwapOperator = {
    id: `${stationId}-OP-${String(nextIndex).padStart(3, "0")}`,
    stationId,
    technicianId: technician.id,
    name: technician.name,
    maxId: padMaxId(stationId, nextIndex),
    status: "Active",
    dateAssigned: formatAssignedToday(),
  }
  stationOperators.push(assigned)
  return assigned
}

export function revokeOperatorAccess(operatorId: string): void {
  const index = stationOperators.findIndex((operator) => operator.id === operatorId)
  if (index >= 0) stationOperators.splice(index, 1)
}
