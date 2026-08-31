import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin, Phone, UserRound } from "lucide-react"

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
  mockRecoveryAgents,
  mockRecoveryPairs,
  mockRecoveryVehicles,
  officerStatusVariantMap,
  pairStatusVariantMap,
  vehicleStatusVariantMap,
} from "@/data/mockRecoveryOfficers"
import {
  mockPendingRecoveries,
  mockRecoverySessions,
  sessionStatusVariantMap,
  formatElapsed,
} from "@/data/mockRecoveries"
import { RecoveryActiveMap } from "./RecoveryActiveMap"
import { formatCurrency, pendingRecoveryQueueColumns, sessionTimelineFor } from "./recoveryDetailShared"

export default function RecoveryAgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const agent = mockRecoveryAgents.find((a) => a.id === id)
  const [showSessionTimeline, setShowSessionTimeline] = useState(false)

  if (!agent) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Officers" }, { label: "Agent not found" }]} />
        <div className="px-6 py-6">
          <p className="text-sm text-muted-foreground">This recovery agent could not be found.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate("/portfolio/recovery/officers?tab=agents")}>
            Back to Recovery Officers
          </Button>
        </div>
      </>
    )
  }

  const pair = mockRecoveryPairs.find((p) => p.id === agent.pairId) ?? null
  const partner = pair
    ? mockRecoveryAgents.find((a) => a.id === (pair.officerAId === agent.id ? pair.officerBId : pair.officerAId))
    : null
  const vehicle = pair ? mockRecoveryVehicles.find((v) => v.pairId === pair.id) ?? null : null
  const activeSession = pair
    ? mockRecoverySessions.find((s) => s.pairCode === pair.pairCode && s.status === "In Session")
    : undefined
  const assignedPending = pair ? mockPendingRecoveries.filter((r) => r.pairCode === pair.pairCode) : []

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Officers" }, { label: agent.name }]} />

      <div className="px-6 flex items-center justify-between gap-3 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Back"
            onClick={() => navigate("/portfolio/recovery/officers?tab=agents")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-table-text-primary">{agent.name}</h1>
              <StatusBadge variant={officerStatusVariantMap[agent.status]}>{agent.status}</StatusBadge>
              {activeSession && (
                <StatusBadge variant={sessionStatusVariantMap["In Session"]}>In Session</StatusBadge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {agent.staffId} · {agent.location} · Enlisted {agent.dateEnlisted}
            </p>
          </div>
        </div>

        {pair && (
          <Button variant="outline" onClick={() => navigate(`/portfolio/recovery/pairs/${pair.id}`)}>
            View Pair
          </Button>
        )}
      </div>

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="Cases Handled"
          value={agent.casesHandled.toLocaleString()}
          subtitle="Lifetime recovery cases"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Recovery Pair"
          value={pair?.pairCode ?? "Unassigned"}
          subtitle={pair ? `With ${partner?.name ?? "—"}` : "Not currently paired"}
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Pair's Completed Retrievals"
          value={(pair?.successfulRecoveries ?? 0).toLocaleString()}
          subtitle="Recoveries successfully closed"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Pair's Bonus Accrued"
          value={formatCurrency(pair?.bonusAccrued ?? 0)}
          subtitle="Cumulative field bonus"
          indicatorColor="var(--color-status-warning)"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex gap-4 items-start">
          {/* Section 1 — Information */}
          <div className="w-[320px] shrink-0 flex flex-col gap-4">
            <InfoCard title="Contact Details">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-table-text-primary">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-table-text-primary">{agent.location}</span>
              </div>
            </InfoCard>

            <InfoCard title="Recovery Pair">
              {pair ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-brand-dark/10 flex items-center justify-center shrink-0">
                    <UserRound className="h-5 w-5 text-brand-dark" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-table-text-primary truncate">
                      {partner?.name ?? "Unassigned partner"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {pair.pairCode} · {pair.zone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not currently part of a recovery pair</p>
              )}
              {pair && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => navigate(`/portfolio/recovery/pairs/${pair.id}`)}
                >
                  View Pair
                </Button>
              )}
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

            {pair && (
              <InfoCard title="Pair Status">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-table-text-primary">{pair.zone} Zone</p>
                    <p className="text-xs text-muted-foreground">Formed {pair.dateFormed}</p>
                  </div>
                  <StatusBadge variant={pairStatusVariantMap[pair.status]}>{pair.status}</StatusBadge>
                </div>
              </InfoCard>
            )}
          </div>

          {/* Section 2 — Agent Activities */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <InfoCard title="Active Session">
              {activeSession ? (
                <>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src="/images/champvatar.png"
                        alt={activeSession.championName}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-table-text-primary truncate">
                          {activeSession.championName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activeSession.maxId} · {activeSession.vehiclePlate} · {activeSession.vehicleType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-status-danger">
                        {formatCurrency(activeSession.outstandingBalance)}
                      </p>
                      <p className="text-xs text-muted-foreground">Amount Owed</p>
                    </div>
                  </div>

                  <div className="h-56 rounded-md overflow-hidden border border-gray-100">
                    <RecoveryActiveMap
                      sessions={[activeSession]}
                      selectedSessionId={activeSession.id}
                      onSelectSession={() => {}}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Case {activeSession.caseId}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-status-info animate-pulse" aria-hidden />
                        Active · {formatElapsed(activeSession.elapsedMinutes)} elapsed
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
                  <div className="mt-1 text-xs text-muted-foreground">Started {activeSession.startedAt}</div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <MapPin className="h-6 w-6 text-gray-300" />
                  <p className="text-sm text-muted-foreground">
                    {pair ? "This agent's pair is not currently in an active session." : "This agent is not part of a recovery pair."}
                  </p>
                </div>
              )}
            </InfoCard>

            <InfoCard title="Pending Recoveries Queue">
              <DataTable
                columns={pendingRecoveryQueueColumns}
                data={assignedPending}
                emptyMessage="No pending recoveries assigned to this agent's pair."
              />
            </InfoCard>
          </div>
        </div>
      </div>

      {activeSession && (
        <Modal
          open={showSessionTimeline}
          onOpenChange={setShowSessionTimeline}
          title="Session Timeline"
          subtitle={`Case ${activeSession.caseId} · ${activeSession.championName}`}
          className="max-w-lg"
          primaryAction={{ label: "Close", onClick: () => setShowSessionTimeline(false) }}
        >
          <StatusTimeline entries={sessionTimelineFor(activeSession)} />
        </Modal>
      )}
    </>
  )
}
