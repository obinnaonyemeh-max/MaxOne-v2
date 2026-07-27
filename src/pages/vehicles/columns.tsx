import { type ColumnDef } from "@tanstack/react-table"
import { StatusBadge, type StatusTab } from "@/components/max"
import type { Vehicle } from "@/data/mockVehicles"

export const vehicleStatusToTabId: Record<string, string> = {
  "Exit": "exit",
  "Active": "active",
  "Inbound": "inbound",
  "Operational Fleet": "operational",
  "3PL Check-in Fleet": "3pl-checkin",
  "Yard check-in Fleet": "yard-checkin",
}

export function getStatusTabs(vehicles: Vehicle[]): StatusTab[] {
  const counts = vehicles.reduce((acc, vehicle) => {
    const tabId = vehicleStatusToTabId[vehicle.vehicleStatus] || "other"
    acc[tabId] = (acc[tabId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return [
    { id: "all", label: "All", count: vehicles.length },
    { id: "exit", label: "Exit", count: counts["exit"] || 0 },
    { id: "active", label: "Active", count: counts["active"] || 0 },
    { id: "inbound", label: "Inbound", count: counts["inbound"] || 0 },
    { id: "operational", label: "Operational Fleet", count: counts["operational"] || 0 },
    { id: "3pl-checkin", label: "3PL Check-in Fleet", count: counts["3pl-checkin"] || 0 },
    { id: "yard-checkin", label: "Yard check-in Fleet", count: counts["yard-checkin"] || 0 },
  ]
}

function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

function VehicleIcon({ assetType }: { assetType: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
      <img src={getVehicleIcon(assetType)} alt={assetType} className="h-5 w-5" />
    </div>
  )
}

function getSafetyScoreColor(score: number): string {
  if (score >= 70) return "var(--color-success)"
  if (score >= 50) return "var(--color-warning)"
  return "var(--color-danger)"
}

function SafetyScoreRing({ score }: { score: number }) {
  const color = getSafetyScoreColor(score)
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--color-gray-200)"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="font-medium text-table-text" style={{ fontSize: "12px" }}>{score}</span>
    </div>
  )
}

function CollectionBar({ percent }: { percent: number }) {
  const color = percent >= 70 ? "var(--color-success)" : percent >= 50 ? "var(--color-warning)" : "var(--color-danger)"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-medium text-table-text" style={{ fontSize: "12px" }}>{percent}%</span>
    </div>
  )
}

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => {
      const plateNumber = row.original.plateNumber
      if (!plateNumber || row.original.vehicleStatus === "Inbound") {
        return <span className="text-muted-foreground">-</span>
      }
      return (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{plateNumber}</span>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "driverSafetyScore",
    header: "Driver Safety Performance",
    cell: ({ row }) => {
      const score = row.original.driverSafetyScore
      if (score === null) return <span className="text-muted-foreground">-</span>
      return <SafetyScoreRing score={score} />
    },
  },
  {
    accessorKey: "contractRisk",
    header: "Contract Risk",
    cell: ({ row }) => {
      const risk = row.original.contractRisk
      if (!risk) return <span className="text-muted-foreground">-</span>
      const variant = risk === "Low" ? "success" : risk === "Medium" ? "warning" : "danger"
      return <StatusBadge variant={variant}>{risk}</StatusBadge>
    },
  },
  {
    accessorKey: "collectionPercent",
    header: "Collection %",
    cell: ({ row }) => {
      const percent = row.original.collectionPercent
      if (percent === null) return <span className="text-muted-foreground">-</span>
      return <CollectionBar percent={percent} />
    },
  },
  {
    accessorKey: "daysInState",
    header: "Days in State",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.daysInState}d</span>
    ),
  },
  {
    accessorKey: "vehicleStatus",
    header: "Vehicle Status",
    cell: ({ row }) => {
      const status = row.original.vehicleStatus
      const variantMap: Record<string, "success" | "exit" | "info" | "operational" | "checkin" | "yard"> = {
        "Exit": "exit",
        "Active": "success",
        "Inbound": "info",
        "Operational Fleet": "operational",
        "3PL Check-in Fleet": "checkin",
        "Yard check-in Fleet": "yard",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "subStatus",
    header: "Sub-Status",
    cell: ({ row }) => {
      const subStatus = row.original.subStatus
      return <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{subStatus}</span>
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>{row.original.dateCreated}</span>
    ),
  },
]
