import { useState, useRef, useEffect, useCallback } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { StatusTimeline } from "./StatusTimeline"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mic,
  ExternalLink,
  Image,
  FileText,
  FileSpreadsheet,
  File,
  Plus,
  Send,
  Play,
  Pause,
  Clock,
  Loader2,
  ChevronDown,
  Megaphone,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useCan } from "@/contexts/RoleSimulationContext"
import type { TicketDetail } from "@/data/mockTicketDetail"
import {
  statusVariantMap,
  priorityVariantMap,
  slaVariantMap,
} from "@/data/mockTicketRecords"

interface TicketDetailSheetProps {
  ticket: TicketDetail | null
  isOpen: boolean
  onClose: () => void
}

const attachmentIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  jpg:  { icon: Image,    color: "text-status-warning" },
  jpeg: { icon: Image,    color: "text-status-warning" },
  png:  { icon: Image,    color: "text-status-warning" },
  pdf:  { icon: FileText, color: "text-status-danger" },
  doc:  { icon: FileText, color: "text-status-info" },
  docx: { icon: FileText, color: "text-status-info" },
  xls:  { icon: FileSpreadsheet, color: "text-badge-active-text" },
  xlsx: { icon: FileSpreadsheet, color: "text-badge-active-text" },
  csv:  { icon: FileSpreadsheet, color: "text-badge-active-text" },
}

const defaultAttachmentIcon = { icon: File, color: "text-breadcrumb-root" }

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function parseDuration(dur: string) {
  const [m, s] = dur.split(":").map(Number)
  return m * 60 + s
}

function CallRecordingRow({
  recording,
}: {
  recording: TicketDetail["callRecordings"][number]
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalSeconds = parseDuration(recording.duration)

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsPlaying(false)
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      stop()
    } else {
      if (progress >= 1) setProgress(0)
      setIsPlaying(true)
      const step = 0.25 / totalSeconds // update 4× per second
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p + step >= 1) {
            stop()
            return 1
          }
          return p + step
        })
      }, 250)
    }
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const elapsed = formatDuration(Math.floor(progress * totalSeconds))

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Mic className="h-4 w-4 shrink-0 text-brand-dark" />
          <span className="text-sm font-medium text-sidebar-item-active truncate">
            {recording.fileName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-breadcrumb-root shrink-0">
          <Clock className="h-3 w-3" />
          {recording.recordedAt}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={togglePlay}
          className="h-7 w-7 rounded-full bg-gray-200 text-sidebar-item-active flex items-center justify-center shrink-0 hover:bg-gray-300 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5 ml-0.5" />
          )}
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-dark rounded-full transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-breadcrumb-root tabular-nums w-[72px] text-right">
            {elapsed} / {recording.duration}
          </span>
        </div>
      </div>
    </div>
  )
}

const agentList = [
  { name: "Fatima Bello", department: "Fleet Operations" },
  { name: "Chidi Okafor", department: "Finance & Billing" },
  { name: "Ngozi Eze", department: "Driver Experience" },
  { name: "Tunde Bakare", department: "Fleet Operations" },
  { name: "Samson Oluwaseun", department: "General Support" },
  { name: "Femi Adeyemi", department: "Driver Experience" },
]

const escalationOfficerList = [
  { name: "Adebayo Oladipo", role: "Senior Operations Manager" },
  { name: "Chidinma Onu", role: "Regional Fleet Lead" },
  { name: "Hakeem Balogun", role: "Head of Driver Experience" },
  { name: "Ifeoma Achebe", role: "Escalation Desk Lead" },
  { name: "Kolawole Ajayi", role: "VP Operations" },
]

const sectionKeys = ["incident", "recordings", "callscript", "champion", "agent", "vehicle", "contract", "sla"] as const
type SectionKey = typeof sectionKeys[number]

const changeableStatuses = ["Open", "In Progress", "Pending Feedback"] as const

export function TicketDetailSheet({ ticket, isOpen, onClose }: TicketDetailSheetProps) {
  const canReassignTicket = useCan("ticketManagement.reassign")
  const canChangeTicketStatus = useCan("ticketManagement.changeStatus")
  const canEscalateTicket = useCan("ticketManagement.escalate")
  const canCloseTicket = useCan("ticketManagement.close")
  const canAddComment = useCan("ticketManagement.addComment")
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState<
    { id: string; author: string; text: string; timestamp: string }[]
  >([])
  const [showReassign, setShowReassign] = useState(false)
  const [reassignAgent, setReassignAgent] = useState("")
  const [reassignReason, setReassignReason] = useState("")
  const [showEscalate, setShowEscalate] = useState(false)
  const [escalateOfficer, setEscalateOfficer] = useState("")
  const [escalateReason, setEscalateReason] = useState("")
  const [showCloseTicket, setShowCloseTicket] = useState(false)
  const [showChangeStatus, setShowChangeStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSection, setOpenSection] = useState<SectionKey>("incident")

  const toggleSection = (key: SectionKey) => {
    setOpenSection((prev) => (prev === key ? key : key))
  }

  // Reset local state when ticket changes
  useEffect(() => {
    setShowCommentInput(false)
    setCommentText("")
    setLocalComments([])
    setShowReassign(false)
    setReassignAgent("")
    setReassignReason("")
    setShowEscalate(false)
    setEscalateOfficer("")
    setEscalateReason("")
    setShowCloseTicket(false)
    setShowChangeStatus(false)
    setNewStatus("")
    setIsSubmitting(false)
    setOpenSection("incident")
  }, [ticket?.id])

  if (!ticket) return null

  const handleReassign = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowReassign(false)
      onClose()
      toast.success("Ticket reassigned successfully", {
        description: `${ticket.ticketId} has been reassigned to ${reassignAgent}.`,
      })
    }, 1500)
  }

  const handleEscalate = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowEscalate(false)
      onClose()
      toast.success("Ticket escalated successfully", {
        description: `${ticket.ticketId} has been escalated to ${escalateOfficer}.`,
      })
    }, 1500)
  }

  const handleCloseTicket = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowCloseTicket(false)
      onClose()
      toast.success("Ticket closed successfully", {
        description: `${ticket.ticketId} has been marked as Resolved.`,
      })
    }, 1500)
  }

  const handleChangeStatus = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowChangeStatus(false)
      onClose()
      toast.success("Ticket status updated", {
        description: `${ticket.ticketId} status changed to ${newStatus}.`,
      })
    }, 1500)
  }

  const allComments = [...ticket.incident.comments, ...localComments]

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const now = new Date()
    const formatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    setLocalComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        author: "You",
        text: commentText.trim(),
        timestamp: `${formatted}, ${time}`,
      },
    ])
    setCommentText("")
    setShowCommentInput(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        {/* Sticky Header */}
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{ticket.ticketId}</SheetTitle>
            <StatusBadge variant={statusVariantMap[ticket.status]} withDot>
              {ticket.status}
            </StatusBadge>
            <StatusBadge variant={priorityVariantMap[ticket.priority]} withDot>
              {ticket.priority}
            </StatusBadge>
            <StatusBadge variant={slaVariantMap[ticket.sla]} withDot>
              {ticket.sla}
            </StatusBadge>
          </div>
          <SheetDescription>
            {ticket.category} &middot; Created {ticket.dateCreated}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* Section 1: Incident Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("incident")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Incident Details</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "incident" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "incident" && (
              <div className="px-4 pb-4 space-y-0">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Location", value: ticket.incident.location },
                    { label: "Reporter", value: ticket.incident.reporter },
                    { label: "Date of Incident", value: ticket.incident.dateOfIncident },
                    { label: "Time of Incident", value: ticket.incident.timeOfIncident },
                    { label: "Vehicle Plate", value: ticket.incident.vehiclePlate },
                    { label: "Ticket Creator", value: ticket.incident.ticketCreator },
                  ]}
                />
                {ticket.incident.creatorComment && (
                  <div className="mt-4 space-y-1">
                    <p className="text-xs text-breadcrumb-root font-medium">Creator Comment</p>
                    <p className="text-sm text-sidebar-item-active leading-relaxed">
                      {ticket.incident.creatorComment}
                    </p>
                  </div>
                )}
                {ticket.incident.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-breadcrumb-root font-medium">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.incident.attachments.map((att) => {
                        const { icon: Icon, color } = attachmentIconMap[att.type] || defaultAttachmentIcon
                        return (
                          <span
                            key={att.name}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-sidebar-item-active"
                          >
                            <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
                            {att.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-breadcrumb-root font-medium">
                      Comments{allComments.length > 0 && ` (${allComments.length})`}
                    </p>
                    {canAddComment && !showCommentInput && (
                      <button
                        type="button"
                        onClick={() => setShowCommentInput(true)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-dark hover:text-brand-dark/80 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add new comment
                      </button>
                    )}
                  </div>

                  {allComments.length > 0 && (
                    <div className="space-y-2">
                      {allComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-md border border-gray-200 bg-white px-3 py-2.5 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-sidebar-item-active">
                              {comment.author}
                            </span>
                            <span className="text-[11px] text-breadcrumb-root">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-sidebar-item-active leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {canAddComment && showCommentInput && (
                    <div className="space-y-2">
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                        className="text-sm"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCommentInput(false)
                            setCommentText("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-brand-dark text-white hover:bg-brand-dark/90 gap-1.5"
                          disabled={!commentText.trim()}
                          onClick={handleAddComment}
                        >
                          <Send className="h-3.5 w-3.5" />
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Call Recordings */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("recordings")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Call Recordings{ticket.callRecordings.length > 0 ? ` (${ticket.callRecordings.length})` : ""}
              </span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "recordings" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "recordings" && (
              <div className="px-4 pb-4">
                {ticket.callRecordings.length > 0 ? (
                  <div className="space-y-2">
                    {ticket.callRecordings.map((rec) => (
                      <CallRecordingRow key={rec.id} recording={rec} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-4 text-breadcrumb-root">
                    <Mic className="h-5 w-5" />
                    <span className="text-sm font-medium">No call recordings available</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Call Script */}
          {ticket.callScript && ticket.callScript.entries.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("callscript")}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                  Incident Call Script
                </span>
                <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "callscript" ? "rotate-180" : ""}`} />
              </button>
              {openSection === "callscript" && (
                <div className="px-4 pb-4 space-y-2.5">
                  {ticket.callScript.entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-gray-200 bg-white px-3.5 py-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <Megaphone className="h-3.5 w-3.5 text-breadcrumb-root shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-breadcrumb-root leading-relaxed">
                          {entry.question}
                        </p>
                      </div>
                      {entry.fieldType === "radio" ? (
                        <div className="ml-[22px]">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-sidebar-item-active">
                            {entry.answer}
                          </span>
                        </div>
                      ) : (
                        <p className="ml-[22px] text-sm font-medium text-sidebar-item-active leading-relaxed">
                          {entry.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 4: Champion Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("champion")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Champion Details</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "champion" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "champion" && (
              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <InfoGrid
                    columns={2}
                    items={[
                      { label: "Champion Name", value: ticket.champion.name },
                      { label: "Champion ID", value: ticket.champion.id },
                    ]}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Champion
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Assigned Agent */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("agent")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Assigned Agent</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "agent" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "agent" && (
              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <InfoGrid
                    columns={2}
                    items={[
                      { label: "Agent Name", value: ticket.agent.name },
                      { label: "Department", value: ticket.agent.department },
                    ]}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Agent
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Vehicle Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("vehicle")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Vehicle Details</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "vehicle" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "vehicle" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "MAX Vehicle ID", value: ticket.vehicle.maxVehicleId },
                    { label: "Plate Number", value: ticket.vehicle.plateNumber },
                    { label: "Vehicle Type", value: ticket.vehicle.type },
                    { label: "Model", value: ticket.vehicle.model },
                    { label: "Brand", value: ticket.vehicle.brand },
                    { label: "Current Status", value: ticket.vehicle.currentStatus },
                    { label: "Last Known Location", value: ticket.vehicle.lastKnownLocation },
                    { label: "Utilization", value: ticket.vehicle.utilization },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Section 6: Contract Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("contract")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Contract Details</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "contract" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "contract" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Contract ID", value: ticket.contract.contractId },
                    { label: "Contract Type", value: ticket.contract.type },
                    { label: "Start Date", value: ticket.contract.startDate },
                    { label: "End Date", value: ticket.contract.endDate },
                    { label: "Status", value: ticket.contract.status },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Section 7: SLA Tracking */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("sla")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">SLA Tracking</span>
              <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "sla" ? "rotate-180" : ""}`} />
            </button>
            {openSection === "sla" && (
              <div className="px-4 pb-4">
                <StatusTimeline entries={ticket.slaTimeline} />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <SheetFooter>
          {canReassignTicket && (
            <Button
              variant="outline"
              className="h-10 px-4"
              onClick={() => {
                setReassignAgent("")
                setReassignReason("")
                setShowReassign(true)
              }}
            >
              Reassign Ticket
            </Button>
          )}
          {canChangeTicketStatus && (
            <Button
              variant="outline"
              className="h-10 px-4"
              onClick={() => {
                setNewStatus("")
                setShowChangeStatus(true)
              }}
            >
              Change Status
            </Button>
          )}
          {canEscalateTicket && (
            <Button
              variant="outline"
              className="h-10 px-4 border-status-warning text-status-warning hover:bg-status-warning/10"
              onClick={() => {
                setEscalateOfficer("")
                setEscalateReason("")
                setShowEscalate(true)
              }}
            >
              Escalate
            </Button>
          )}
          {canCloseTicket && (
            <Button
              variant="destructive"
              className="h-10 px-4"
              onClick={() => setShowCloseTicket(true)}
            >
              Close Ticket
            </Button>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Reassign Ticket Modal */}
      <Dialog open={showReassign} onOpenChange={setShowReassign}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Reassign Ticket</DialogTitle>
            <DialogDescription>
              {ticket.ticketId} &middot; Currently assigned to {ticket.agent.name}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Select Agent
              </label>
              <Select value={reassignAgent} onValueChange={setReassignAgent}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agentList
                    .filter((a) => a.name !== ticket.agent.name)
                    .map((agent) => (
                      <SelectItem key={agent.name} value={agent.name}>
                        {agent.name} — {agent.department}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Reason for Reassignment
              </label>
              <Textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Provide a reason for reassigning this ticket..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowReassign(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!reassignAgent || !reassignReason.trim() || isSubmitting}
              onClick={handleReassign}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Reassigning..." : "Reassign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate Ticket Modal */}
      <Dialog open={showEscalate} onOpenChange={setShowEscalate}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Escalate Ticket</DialogTitle>
            <DialogDescription>
              {ticket.ticketId} &middot; {ticket.category}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-md border border-status-warning/30 bg-status-warning/5 px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                This ticket is about to be escalated. Once escalated, it will be assigned to a senior officer for priority resolution.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Escalation Officer
              </label>
              <Select value={escalateOfficer} onValueChange={setEscalateOfficer}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select an officer" />
                </SelectTrigger>
                <SelectContent>
                  {escalationOfficerList.map((officer) => (
                    <SelectItem key={officer.name} value={officer.name}>
                      {officer.name} — {officer.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Reason for Escalation
              </label>
              <Textarea
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                placeholder="Provide a reason for escalating this ticket..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowEscalate(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-status-warning text-white hover:bg-status-warning/90"
              disabled={!escalateOfficer || !escalateReason.trim() || isSubmitting}
              onClick={handleEscalate}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Escalating..." : "Escalate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog open={showChangeStatus} onOpenChange={setShowChangeStatus}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Change Ticket Status</DialogTitle>
            <DialogDescription>
              {ticket.ticketId} &middot; Current status: {ticket.status}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                New Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {changeableStatuses
                    .filter((s) => s !== ticket.status)
                    .map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowChangeStatus(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!newStatus || isSubmitting}
              onClick={handleChangeStatus}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Ticket Modal */}
      <Dialog open={showCloseTicket} onOpenChange={setShowCloseTicket}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Close Ticket</DialogTitle>
            <DialogDescription>
              {ticket.ticketId} &middot; {ticket.category}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                Closing this ticket will mark it as <span className="font-semibold">Resolved</span> and it will no longer be tracked. This action cannot be undone.
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowCloseTicket(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={isSubmitting}
              onClick={handleCloseTicket}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Closing..." : "Close Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
