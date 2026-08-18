import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RefreshCw, FileText, UserCog, History } from "lucide-react"
import { toast } from "sonner"
import {
  TopBar,
  BackButton,
  InfoCard,
  InfoGrid,
  StatusBadge,
  ConfirmModal,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  mockTamperAlerts,
  tamperTypeVariantMap,
  tamperStatusVariantMap,
  mockTamperMovementHistory,
} from "@/data/mockTamperAlerts"
import { TamperLocationMap } from "./TamperLocationMap"
import { AssessmentReportModal } from "./AssessmentReportModal"
import { AssessmentSummaryModal } from "./AssessmentSummaryModal"
import { PingResultModal } from "./PingResultModal"
import { PingDetailsModal } from "./PingDetailsModal"
import { MovementHistoryModal } from "./MovementHistoryModal"
import { ReassignTechnicianModal } from "./ReassignTechnicianModal"
import { ViewAssessmentReportModal } from "./ViewAssessmentReportModal"
import {
  ASSESSMENT_QUESTIONS,
  type AssessmentAnswers,
  type AssessmentAnswer,
} from "./assessmentQuestions"

// "In Progress" alerts already have a recorded assessment — opening the report
// jumps straight to the summary with the answers pre-filled.
const RECORDED_ANSWER_LIST: AssessmentAnswer[] = ["yes", "yes", "no", "yes", "no", "yes", "no"]

// Resolved alerts already have a submitted (read-only) assessment. One is
// simulated with an uploaded image and a comment to show that state.
const SIMULATED_SUBMITTED_REPORTS: Record<string, { imageUrl?: string; comment?: string }> = {
  "TMP-2026-0388": {
    imageUrl: "/images/rider.jpeg",
    comment:
      "Tracker was found detached from the wiring harness. Reconnected on site and confirmed heartbeat before closing the ticket.",
  },
}

const buildRecordedAnswers = (): AssessmentAnswers =>
  Object.fromEntries(
    ASSESSMENT_QUESTIONS.map((q, i) => [q, RECORDED_ANSWER_LIST[i]])
  ) as AssessmentAnswers

export default function TamperAlertDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const alert = mockTamperAlerts.find((a) => a.id === id)
  const hasRecordedAssessment = !!alert && alert.status === "In Progress"
  const isResolved = !!alert && alert.status === "Resolved"
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [assessmentOpen, setAssessmentOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pingOpen, setPingOpen] = useState(false)
  const [pingKey, setPingKey] = useState(0)
  const [pingDetailsOpen, setPingDetailsOpen] = useState(false)
  const [resolvedOpen, setResolvedOpen] = useState(false)
  const [movementOpen, setMovementOpen] = useState(false)
  const [reassignOpen, setReassignOpen] = useState(false)
  const [viewReportOpen, setViewReportOpen] = useState(false)

  const handleResolveTamper = () => {
    setPingDetailsOpen(false)
    setPingOpen(false)
    setResolvedOpen(true)
  }
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswers>({})
  const [assessmentKey, setAssessmentKey] = useState(0)

  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Parameters updated", {
        description: "Latest values pulled from the tracker.",
      })
    }, 1200)
  }

  const handleAssessmentReport = () => {
    if (hasRecordedAssessment) {
      // Assessment already recorded — jump straight to the summary; the user can
      // hit "Edit" there to step back through the questions.
      setAssessmentAnswers(buildRecordedAnswers())
      setSummaryOpen(true)
      return
    }
    setAssessmentAnswers({})
    setAssessmentKey((k) => k + 1)
    setAssessmentOpen(true)
  }

  const handleReassignTechnician = () => {
    setReassignOpen(true)
  }

  const backToList = () => navigate("/falcon/alerts/tamper")

  if (!alert) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Falcon" },
            { label: "Alerts" },
            { label: "Tamper Alerts", href: "/falcon/alerts/tamper" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Tamper alert not found</p>
        </div>
      </>
    )
  }

  const p = alert.parameters

  const parameterItems = [
    { label: "Champion ID", value: p.championId },
    { label: "Champion Name", value: p.championName },
    { label: "Vehicle's current speed", value: p.speed },
    { label: "Odometer reading", value: p.odometer },
    {
      label: "Status",
      value: (
        <StatusBadge variant={tamperStatusVariantMap[alert.status]} withDot>
          {alert.status}
        </StatusBadge>
      ),
    },
    {
      label: "Ignition status",
      value: (
        <StatusBadge variant={p.ignition === "On" ? "success" : "danger"} withDot>
          {p.ignition}
        </StatusBadge>
      ),
    },
    { label: "IMEI", value: p.imei },
    { label: "Location (lat, long)", value: p.location },
    { label: "External Voltage", value: p.externalVoltage },
    { label: "Internal Voltage", value: p.internalVoltage },
    { label: "Last recorded time", value: p.lastRecordedTime },
    { label: "Plate number", value: alert.plateNumber },
    { label: "Shutoff status", value: p.shutoff },
    { label: "City", value: p.city },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Alerts" },
          { label: "Tamper Alerts", href: "/falcon/alerts/tamper" },
          { label: alert.plateNumber },
        ]}
      />

      <div className="px-6 py-6 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BackButton onClick={backToList} />
            <h1
              className="flex items-end gap-1 font-semibold text-sidebar-item-active"
              style={{ fontSize: "22px" }}
            >
              {alert.plateNumber}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
            <div className="flex items-center gap-2 ml-1">
              <StatusBadge variant={tamperTypeVariantMap[alert.type]} withDot>
                {alert.type}
              </StatusBadge>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="h-10 gap-2" onClick={() => setMovementOpen(true)}>
              <History className="h-4 w-4" />
              View Movement History
            </Button>
            {!isResolved && (
              <Button variant="outline" className="h-10 gap-2" onClick={handleReassignTechnician}>
                <UserCog className="h-4 w-4" />
                Reassign Technician
              </Button>
            )}
            {!isResolved && (alert.recovery.status === "Recovery Completed" || hasRecordedAssessment) && (
              <Button
                className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
                onClick={handleAssessmentReport}
              >
                <FileText className="h-4 w-4" />
                Assessment Report
              </Button>
            )}
            {isResolved && (
              <Button
                className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
                onClick={() => setViewReportOpen(true)}
              >
                <FileText className="h-4 w-4" />
                View Assessment Report
              </Button>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm font-medium text-breadcrumb-root">
          {alert.id} &middot; Last reported parameters from the tracker
        </p>
      </div>

      <div className="flex-1 min-h-0 px-6 pb-6">
        <div className="flex gap-4 items-stretch h-full min-h-0">
          {/* Left — Last reported parameters */}
          <div className="w-[440px] shrink-0 overflow-y-auto">
            <InfoCard
              title="Last Reported Parameters"
              className="h-full"
              action={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh parameters"
                >
                  <RefreshCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              }
            >
              <InfoGrid columns={2} items={parameterItems} showDividers />
            </InfoCard>
          </div>

          {/* Right — Map */}
          <div className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 isolate">
            <TamperLocationMap
              className="h-full"
              location={{ lat: p.lat, lng: p.lng }}
              vehicle={{
                plateNumber: alert.plateNumber,
                coordinates: p.location,
                lastRecordedTime: p.lastRecordedTime,
              }}
              recovery={alert.recovery}
            />
          </div>
        </div>
      </div>

      <MovementHistoryModal
        open={movementOpen}
        onOpenChange={setMovementOpen}
        events={mockTamperMovementHistory}
      />

      <ReassignTechnicianModal
        open={reassignOpen}
        onOpenChange={setReassignOpen}
        currentTechnician={alert.assignedTechnician}
        onReassign={(tech) => {
          toast.success("Technician reassigned", {
            description: `${alert.id} reassigned to ${tech.name}.`,
          })
        }}
      />

      <ViewAssessmentReportModal
        open={viewReportOpen}
        onOpenChange={setViewReportOpen}
        alertId={alert.id}
        answers={buildRecordedAnswers()}
        imageUrl={SIMULATED_SUBMITTED_REPORTS[alert.id]?.imageUrl}
        comment={SIMULATED_SUBMITTED_REPORTS[alert.id]?.comment}
      />

      <AssessmentReportModal
        key={assessmentKey}
        open={assessmentOpen}
        onOpenChange={setAssessmentOpen}
        initialAnswers={assessmentAnswers}
        onComplete={(answers) => {
          setAssessmentAnswers(answers)
          setSummaryOpen(true)
        }}
      />

      <AssessmentSummaryModal
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        alertId={alert.id}
        answers={assessmentAnswers}
        onEdit={() => {
          setSummaryOpen(false)
          setAssessmentKey((k) => k + 1)
          setAssessmentOpen(true)
        }}
        onSubmit={() => {
          setSummaryOpen(false)
          setConfirmOpen(true)
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="success"
        title="Report submitted successfully"
        subtitle="Ping device to verify IOT connection"
        primaryAction={{
          label: "Ping device",
          onClick: () => {
            setConfirmOpen(false)
            setPingKey((k) => k + 1)
            setPingOpen(true)
          },
        }}
      />

      <PingResultModal
        key={pingKey}
        open={pingOpen}
        onOpenChange={setPingOpen}
        onViewDetails={() => {
          // Keep the ping modal open behind so "Close details" returns to it.
          setPingDetailsOpen(true)
        }}
        onResolve={handleResolveTamper}
      />

      <PingDetailsModal
        open={pingDetailsOpen}
        onOpenChange={setPingDetailsOpen}
        details={{
          speed: p.speed,
          odometer: p.odometer,
          ignition: p.ignition,
          location: p.location,
          externalVoltage: p.externalVoltage,
          internalVoltage: p.internalVoltage,
          shutoff: p.shutoff,
        }}
        onResolve={handleResolveTamper}
      />

      <ConfirmModal
        open={resolvedOpen}
        onOpenChange={setResolvedOpen}
        variant="success"
        title="Tamper issue resolved successfully"
        primaryAction={{ label: "Done", onClick: () => setResolvedOpen(false) }}
      />
    </>
  )
}
