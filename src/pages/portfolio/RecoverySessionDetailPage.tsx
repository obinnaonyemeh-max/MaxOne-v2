import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  TopBar,
  InfoCard,
  StatCard,
  StatusBadge,
  DataTable,
  Modal,
  StatusTimeline,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  mockRecoveryPairs,
  mockRecoveryAgents,
  mockRecoveryVehicles,
  vehicleStatusVariantMap,
} from "@/data/mockRecoveryOfficers"
import {
  mockRecoverySessions,
  mockPendingRecoveries,
  sessionStatusVariantMap,
  formatElapsed,
} from "@/data/mockRecoveries"
import { RecoveryActiveMap } from "./RecoveryActiveMap"
import { formatCurrency, pendingRecoveryQueueColumns, sessionTimelineFor } from "./recoveryDetailShared"

const agentById = new Map(mockRecoveryAgents.map((a) => [a.id, a]))

const tabByStatus = {
  "In Session": "in-session",
  Successful: "successful",
  Failed: "failed",
} as const

const breadcrumbByStatus = {
  "In Session": "Recoveries in Session",
  Successful: "Successful Recoveries",
  Failed: "Failed Recoveries",
} as const

export default function RecoverySessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const session = mockRecoverySessions.find((s) => s.id === id)
  const [showSessionTimeline, setShowSessionTimeline] = useState(false)

  if (!session) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recoveries in Session" }, { label: "Session not found" }]} />
        <div className="px-6 py-6">
          <p className="text-sm text-muted-foreground">This recovery session could not be found.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate("/portfolio/recovery/sessions/in-session")}>
            Back to Recoveries in Session
          </Button>
        </div>
      </>
    )
  }

  const isActive = session.status === "In Session"
  const isSuccessful = session.status === "Successful"
  const backPath = `/portfolio/recovery/sessions/${tabByStatus[session.status]}`

  const pair = mockRecoveryPairs.find((p) => p.pairCode === session.pairCode) ?? null
  const agentA = pair ? agentById.get(pair.officerAId) : undefined
  const agentB = pair ? agentById.get(pair.officerBId) : undefined
  const vehicle = pair ? mockRecoveryVehicles.find((v) => v.pairId === pair.id) ?? null : null
  const assignedPending = pair ? mockPendingRecoveries.filter((r) => r.pairCode === pair.pairCode) : []

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: breadcrumbByStatus[session.status] }, { label: session.caseId }]} />

      <div className="px-6 flex items-center justify-between gap-3 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-table-text-primary">{session.championName}</h1>
              <StatusBadge variant={sessionStatusVariantMap[session.status]}>{session.status}</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              {session.caseId} · {session.pairCode} · {session.zone} Zone
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate(`/portfolio/champions/overview/${session.id}`)}>
          View Champion Profile
        </Button>
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title={isActive ? "Session Timer" : "Total Duration"}
          value={formatElapsed(session.elapsedMinutes)}
          subtitle={isActive ? "Time elapsed on this session" : "Total time this session took"}
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title={isSuccessful ? "Amount Recovered" : "Amount Owed"}
          value={formatCurrency(session.outstandingBalance)}
          subtitle={isSuccessful ? "Outstanding balance recovered" : "Outstanding balance on this case"}
          indicatorColor={isSuccessful ? "var(--color-status-success)" : "var(--color-status-danger)"}
        />
        <StatCard
          title={isActive ? "Started" : "Completed"}
          value={isActive ? session.startedAt : session.completedAt ?? "—"}
          subtitle={isActive ? "When the pair began this session" : "When this session was closed"}
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Zone"
          value={session.zone}
          subtitle="Where this recovery took place"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex gap-4 items-start">
          {/* Section 1 — Information */}
          <div className="w-[320px] shrink-0 flex flex-col gap-4">
            <InfoCard title="Pair Location">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-table-text-primary">
                  {pair?.assignedLocation ?? "—"}
                </span>
              </div>
              {isActive && (
                <p className="text-xs text-muted-foreground mt-2">
                  Location can't be changed while a session is active.
                </p>
              )}
            </InfoCard>

            <InfoCard title="Agent Pair">
              <div className="flex flex-col gap-4">
                {[agentA, agentB].map(
                  (agent) =>
                    agent && (
                      <div key={agent.id} className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-brand-dark/10 flex items-center justify-center shrink-0">
                          <UserRound className="h-5 w-5 text-brand-dark" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-table-text-primary truncate">{agent.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {agent.staffId} · {agent.phone}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </InfoCard>

            <InfoCard title="Operational Vehicle">
              {vehicle ? (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-table-text-primary">{vehicle.plateNumber}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                  </div>
                  <StatusBadge variant={vehicleStatusVariantMap[vehicle.status]} size="sm">
                    {vehicle.status}
                  </StatusBadge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vehicle assigned</p>
              )}
            </InfoCard>

            <InfoCard title="Deployed Zone">
              <p className="text-sm font-medium text-table-text-primary">{pair?.deployedZone ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Active operational area within {pair?.assignedLocation ?? "—"}
              </p>
            </InfoCard>
          </div>

          {/* Section 2 — Session Activities */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <InfoCard title={isActive ? "Active Session" : "Recovery Outcome"}>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/images/champvatar.png"
                  alt={session.championName}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-table-text-primary truncate">{session.championName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.maxId} · {session.vehiclePlate} · {session.vehicleType}
                  </p>
                </div>
              </div>

              {!isActive && (
                <div
                  className={cn(
                    "rounded-md border p-3 mb-3",
                    isSuccessful ? "border-status-success/30 bg-status-success/5" : "border-status-danger/30 bg-status-danger/5"
                  )}
                >
                  <p className={cn("text-sm font-medium", isSuccessful ? "text-status-success" : "text-status-danger")}>
                    {isSuccessful ? "Vehicle recovered successfully." : "Recovery unsuccessful."}
                  </p>
                  {!isSuccessful && session.outcomeNotes && (
                    <p className="text-xs text-status-danger/80 mt-1">{session.outcomeNotes}</p>
                  )}
                </div>
              )}

              <div className="h-56 rounded-md overflow-hidden border border-gray-100">
                <RecoveryActiveMap
                  sessions={[session]}
                  selectedSessionId={session.id}
                  onSelectSession={() => {}}
                  className="h-full w-full"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Case {session.caseId}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isActive ? "bg-status-info animate-pulse" : isSuccessful ? "bg-status-success" : "bg-status-danger"
                      )}
                    />
                    {formatElapsed(session.elapsedMinutes)} {isActive ? "elapsed" : "total"}
                  </span>
                  <Button
                    variant="secondary"
                    size="xs"
                    className="shrink-0"
                    onClick={() => setShowSessionTimeline(true)}
                  >
                    View Session Timeline
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Started {session.startedAt}</div>
              {session.completedAt && (
                <div className="mt-1 text-xs text-muted-foreground">Completed {session.completedAt}</div>
              )}
            </InfoCard>

            <InfoCard title="Pending Recoveries Queue">
              <DataTable
                columns={pendingRecoveryQueueColumns}
                data={assignedPending}
                emptyMessage="No other pending recoveries assigned to this pair."
              />
            </InfoCard>
          </div>
        </div>
      </div>

      <Modal
        open={showSessionTimeline}
        onOpenChange={setShowSessionTimeline}
        title="Session Timeline"
        subtitle={`Case ${session.caseId} · ${session.championName}`}
        className="max-w-lg"
        primaryAction={{ label: "Close", onClick: () => setShowSessionTimeline(false) }}
      >
        <StatusTimeline entries={sessionTimelineFor(session)} />
      </Modal>
    </>
  )
}
