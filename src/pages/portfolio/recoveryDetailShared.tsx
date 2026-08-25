// Shared helpers for Recovery Pair and Recovery Agent detail pages.

import { type ColumnDef } from "@tanstack/react-table"
import { type TimelineEntryData } from "@/components/max"
import { formatElapsed, type PendingRecovery, type RecoverySession } from "@/data/mockRecoveries"

export function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

export const pendingRecoveryQueueColumns: ColumnDef<PendingRecovery>[] = [
  {
    accessorKey: "championName",
    header: "Champion",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src="/images/champvatar.png"
          alt={row.original.championName}
          className="h-7 w-7 rounded-full object-cover shrink-0"
        />
        <span className="font-medium text-table-text-primary text-sm">{row.original.championName}</span>
      </div>
    ),
  },
  {
    accessorKey: "maxId",
    header: "Champion ID",
    cell: ({ row }) => <span className="font-medium text-table-text text-sm">{row.original.maxId}</span>,
  },
  {
    accessorKey: "outstandingBalance",
    header: "Amount Owed",
    cell: ({ row }) => (
      <span className="font-medium text-status-danger text-sm">
        {formatCurrency(row.original.outstandingBalance)}
      </span>
    ),
  },
]

export function sessionTimelineFor(session: RecoverySession): TimelineEntryData[] {
  const [datePart, timePart] = session.startedAt.split(", ")
  const isActive = session.status === "In Session"

  const entries: TimelineEntryData[] = [
    {
      id: "assigned",
      date: datePart,
      status: "Assigned",
      statusVariant: "info",
      description: {
        template: "Case {case} assigned to recovery pair {pair}",
        highlights: { case: session.caseId, pair: session.pairCode },
      },
    },
    {
      id: "started",
      date: datePart,
      status: "Started",
      statusVariant: "info",
      description: {
        template: "Recovery session started at {time}",
        highlights: { time: timePart ?? session.startedAt },
      },
      actor: {
        action: "Dispatched by",
        name: session.officers,
      },
      duration: {
        range: timePart ?? session.startedAt,
        total: "",
      },
    },
    {
      id: "in-progress",
      date: datePart,
      status: "In Progress",
      statusVariant: "warning",
      description: {
        template: "Pair is actively working case {case} in {zone}",
        highlights: { case: session.caseId, zone: session.zone },
      },
      actor: {
        action: isActive ? "Elapsed" : "Duration",
        name: session.officers,
      },
      duration: {
        range: isActive ? "Ongoing" : "Total",
        total: formatElapsed(session.elapsedMinutes),
      },
    },
  ]

  if (!isActive) {
    entries.push({
      id: "outcome",
      date: session.completedAt ?? datePart,
      status: session.status,
      statusVariant: session.status === "Successful" ? "success" : "danger",
      description:
        session.status === "Successful"
          ? {
              template: "Case {case} successfully recovered",
              highlights: { case: session.caseId },
            }
          : {
              template: "Case {case} closed without recovery: {reason}",
              highlights: { case: session.caseId, reason: session.outcomeNotes ?? "No reason recorded" },
            },
      actor: {
        action: "Closed by",
        name: session.officers,
      },
      duration: {
        range: session.completedAt ?? "",
        total: "",
      },
    })
  }

  return entries
}
