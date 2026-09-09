import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { MapPin, UserRound } from "lucide-react"

import {
  TopBar,
  BackButton,
  InfoCard,
  StatCard,
  StatusBadge,
  DataTable,
  ConfirmModal,
  Modal,
  StatusTimeline,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  mockRecoveryPairs,
  mockRecoveryAgents,
  mockRecoveryVehicles,
  zoneLocationInfo,
  pairStatusVariantMap,
  vehicleStatusVariantMap,
  type RecoveryPair,
  type RecoveryVehicle,
} from "@/data/mockRecoveryOfficers"
import {
  mockPendingRecoveries,
  mockRecoverySessions,
  sessionStatusVariantMap,
  assignmentStatusVariantMap,
  formatElapsed,
  isPairInSession,
} from "@/data/mockRecoveries"
import { RecoveryActiveMap } from "./RecoveryActiveMap"
import { ManageVehiclesFlow } from "./ManageVehiclesFlow"
import { formatCurrency, pendingRecoveryQueueColumns, sessionTimelineFor, sessionMapOverlayStyle } from "./recoveryDetailShared"

const zones = Object.keys(zoneLocationInfo)

const agentById = new Map(mockRecoveryAgents.map((a) => [a.id, a]))

function officerNamesFor(pair: RecoveryPair): string {
  const a = agentById.get(pair.officerAId)?.name
  const b = agentById.get(pair.officerBId)?.name
  return [a, b].filter(Boolean).join(" & ")
}

export default function RecoveryPairDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [pair, setPair] = useState<RecoveryPair | undefined>(() =>
    mockRecoveryPairs.find((p) => p.id === id)
  )
  const [vehicles, setVehicles] = useState<RecoveryVehicle[]>(mockRecoveryVehicles)
  const [editingLocation, setEditingLocation] = useState(false)
  const [showManageVehicle, setShowManageVehicle] = useState(false)
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false)
  const [showSessionTimeline, setShowSessionTimeline] = useState(false)

  if (!pair) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Officers" }, { label: "Pair not found" }]} />
        <div className="px-6 py-6">
          <p className="text-sm text-muted-foreground">This recovery pair could not be found.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate("/portfolio/recovery/officers")}>
            Back to Recovery Officers
          </Button>
        </div>
      </>
    )
  }

  const agentA = agentById.get(pair.officerAId)
  const agentB = agentById.get(pair.officerBId)
  const vehicle = vehicles.find((v) => v.pairId === pair.id) ?? null
  const activeSession = mockRecoverySessions.find(
    (s) => s.pairCode === pair.pairCode && s.status === "In Session"
  )
  const pairInSession = isPairInSession(pair)
  const assignedPending = mockPendingRecoveries.filter((r) => r.pairCode === pair.pairCode)

  const handleReassignVehicle = (vehicleId: string, pairId: string | null) => {
    // Guard against detaching this pair's own vehicle mid-session — ManageVehiclesFlow
    // already excludes in-session pairs from its assignment dropdown, this is the backstop.
    if (vehicle && vehicleId === vehicle.id && pairInSession) return
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, pairId, status: pairId ? "In Use" : "Available" } : v))
    )
  }

  const handleUpdateZone = (zone: string) => {
    if (pairInSession) return
    const location = zoneLocationInfo[zone]
    setPair((prev) => (prev ? { ...prev, zone, assignedLocation: location.state, deployedZone: location.areas[0] } : prev))
    setEditingLocation(false)
  }

  const handleUnlinkPair = () => {
    if (pairInSession) return
    if (vehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, pairId: null, status: "Available" } : v))
      )
    }
    setShowUnlinkConfirm(false)
    toast.success(`${pair.pairCode} has been unlinked`, {
      description: `${officerNamesFor(pair)} are now available for reassignment.`,
    })
    navigate("/portfolio/recovery/officers")
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Recovery" }, { label: "Recovery Officers" }, { label: pair.pairCode }]} />

      <div className="px-6 flex items-center justify-between gap-3 py-6 shrink-0">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate("/portfolio/recovery/officers")} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-table-text-primary">{pair.pairCode}</h1>
              <StatusBadge variant={pairStatusVariantMap[pair.status]}>{pair.status}</StatusBadge>
              {activeSession && (
                <StatusBadge variant={sessionStatusVariantMap["In Session"]}>In Session</StatusBadge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {officerNamesFor(pair)} · {pair.zone} Zone · Formed {pair.dateFormed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pairInSession ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    variant="outline"
                    className="text-status-danger border-status-danger/30 hover:bg-status-danger/10 hover:text-status-danger"
                    disabled
                  >
                    Unlink Pair
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Cannot unlink pair while a recovery session is in progress.</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              className="text-status-danger border-status-danger/30 hover:bg-status-danger/10 hover:text-status-danger"
              onClick={() => setShowUnlinkConfirm(true)}
            >
              Unlink Pair
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/portfolio/recovery/sessions/successful")}
          >
            View Recovery History
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 shrink-0 mb-4">
        <StatCard
          title="Completed Retrieval"
          value={pair.successfulRecoveries.toLocaleString()}
          subtitle="Recoveries successfully closed"
          indicatorColor="var(--color-status-success)"
        />
        <StatCard
          title="Avg Time to Recover"
          value={formatElapsed(pair.avgRecoveryMinutes)}
          subtitle="Per completed session"
          indicatorColor="var(--color-status-info)"
        />
        <StatCard
          title="Ending in Payment"
          value={pair.paymentRecoveries.toLocaleString()}
          subtitle="Champion settled on the spot"
          indicatorColor="var(--color-brand-primary)"
        />
        <StatCard
          title="Ending in Check-Ins"
          value={pair.checkInRecoveries.toLocaleString()}
          subtitle="Vehicle repossessed"
          indicatorColor="var(--color-status-warning)"
        />
        <StatCard
          title="Bonus Accrued"
          value={formatCurrency(pair.bonusAccrued)}
          subtitle="Cumulative field bonus"
          indicatorColor="var(--color-status-success)"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex gap-4 items-start">
          {/* Section 1 — Information */}
          <div className="w-[320px] shrink-0 flex flex-col gap-4">
            <InfoCard title="Pair Location">
              {editingLocation ? (
                <Select value={pair.zone} onValueChange={handleUpdateZone}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z} value={z}>
                        {z}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-table-text-primary">{pair.assignedLocation}</span>
                </div>
              )}
              {pairInSession ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="block mt-3">
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Update Location
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Location cannot be modified during an active session.</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setEditingLocation((v) => !v)}
                >
                  {editingLocation ? "Cancel" : "Update Location"}
                </Button>
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
              {pairInSession ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="block mt-3">
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Manage Vehicle
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Operational vehicle cannot be changed while session is active.</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setShowManageVehicle(true)}
                >
                  Manage Vehicle
                </Button>
              )}
            </InfoCard>

            <InfoCard title="Deployed Zone">
              <p className="text-sm font-medium text-table-text-primary">{pair.deployedZone}</p>
              <p className="text-xs text-muted-foreground mt-1">Active operational area within {pair.assignedLocation}</p>
            </InfoCard>
          </div>

          {/* Section 2 — Pair Activities */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {activeSession && (
              <InfoCard title="Active Session">
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

                <div className="relative h-56 rounded-md overflow-hidden border border-gray-100">
                  <RecoveryActiveMap
                    sessions={[activeSession]}
                    selectedSessionId={activeSession.id}
                    onSelectSession={() => {}}
                    className="h-full w-full"
                  />

                  <div className="absolute right-3 bottom-3 z-[1000] rounded-lg p-3" style={sessionMapOverlayStyle}>
                    <div className="mb-2">
                      <span className="block text-gray-500 mb-0.5" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}>
                        CASE
                      </span>
                      <span className="block text-gray-950" style={{ fontSize: "12px", fontWeight: 500 }}>
                        {activeSession.caseId}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="block text-gray-500 mb-0.5" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}>
                        TIME ELAPSED
                      </span>
                      <span className="flex items-center justify-end gap-1.5 text-gray-950" style={{ fontSize: "12px", fontWeight: 500 }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-status-info animate-pulse" aria-hidden />
                        {formatElapsed(activeSession.elapsedMinutes)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500 mb-0.5" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em" }}>
                        STARTED
                      </span>
                      <span className="block text-gray-950" style={{ fontSize: "12px", fontWeight: 500 }}>
                        {activeSession.startedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <Button
                    variant="secondary"
                    size="xs"
                    className="shrink-0"
                    onClick={() => setShowSessionTimeline(true)}
                  >
                    View Session Timeline
                  </Button>
                </div>
              </InfoCard>
            )}

            {pairInSession ? (
              <InfoCard title="Pending Recoveries Queue">
                <DataTable
                  columns={pendingRecoveryQueueColumns}
                  data={assignedPending}
                  emptyMessage="No pending recoveries assigned to this pair."
                />
              </InfoCard>
            ) : (
              <InfoCard title="Assigned Recoveries">
                {assignedPending.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recoveries assigned to this pair yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-100">
                    {assignedPending.slice(0, 2).map((recovery) => (
                      <div key={recovery.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src="/images/champvatar.png"
                            alt={recovery.championName}
                            className="h-9 w-9 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-table-text-primary truncate">
                              {recovery.championName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {recovery.vehiclePlate} · {recovery.zone}
                            </p>
                          </div>
                        </div>
                        <StatusBadge variant={assignmentStatusVariantMap[recovery.assignmentStatus]} size="sm">
                          {recovery.assignmentStatus}
                        </StatusBadge>
                      </div>
                    ))}
                    {assignedPending.length > 2 && (
                      <p className="pt-3 text-xs text-muted-foreground">
                        +{assignedPending.length - 2} more assigned
                      </p>
                    )}
                  </div>
                )}
              </InfoCard>
            )}
          </div>
        </div>
      </div>

      <ManageVehiclesFlow
        open={showManageVehicle}
        onClose={() => setShowManageVehicle(false)}
        vehicles={vehicles}
        pairs={mockRecoveryPairs}
        onReassign={handleReassignVehicle}
        getOfficerNames={officerNamesFor}
      />

      <ConfirmModal
        open={showUnlinkConfirm}
        onOpenChange={setShowUnlinkConfirm}
        title="Unlink this recovery pair?"
        subtitle={`${officerNamesFor(pair)} will be separated and ${pair.pairCode} will be freed up for reassignment.`}
        variant="destructive"
        primaryAction={{ label: "Unlink Pair", onClick: handleUnlinkPair }}
        secondaryAction={{ label: "Cancel", onClick: () => setShowUnlinkConfirm(false) }}
      />

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
