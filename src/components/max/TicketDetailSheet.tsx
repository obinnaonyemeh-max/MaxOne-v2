import { useState, useRef, useEffect, useCallback } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { InfoCard } from "./InfoCard"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import { StatusTimeline } from "./StatusTimeline"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  type LucideIcon,
} from "lucide-react"
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
          <Mic className="h-4 w-4 shrink-0 text-brand-primary" />
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

export function TicketDetailSheet({ ticket, isOpen, onClose }: TicketDetailSheetProps) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState<
    { id: string; author: string; text: string; timestamp: string }[]
  >([])

  // Reset local state when ticket changes
  useEffect(() => {
    setShowCommentInput(false)
    setCommentText("")
    setLocalComments([])
  }, [ticket?.id])

  if (!ticket) return null

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
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Section 1: Incident Details */}
          <InfoCard title="Incident Details">
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
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-sidebar-item-active"
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
                {!showCommentInput && (
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

              {showCommentInput && (
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
          </InfoCard>

          {/* Section 2: Call Recordings */}
          <InfoCard title={`Call Recordings${ticket.callRecordings.length > 0 ? ` (${ticket.callRecordings.length})` : ""}`}>
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
          </InfoCard>

          {/* Section 3: Champion Details */}
          <InfoCard title="Champion Details">
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
          </InfoCard>

          {/* Section 4: Assigned Agent */}
          <InfoCard title="Assigned Agent">
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
          </InfoCard>

          {/* Section 5: Vehicle Details */}
          <InfoCard title="Vehicle Details">
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
          </InfoCard>

          {/* Section 6: Contract Details */}
          <InfoCard title="Contract Details">
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
          </InfoCard>

          {/* Section 7: SLA Tracking */}
          <InfoCard title="SLA Tracking">
            <StatusTimeline entries={ticket.slaTimeline} />
          </InfoCard>
        </div>

        {/* Sticky Footer */}
        <SheetFooter>
          <Button variant="outline" className="h-10 px-4">
            Assign / Reassign
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 border-status-warning text-status-warning hover:bg-status-warning/10"
          >
            Escalate
          </Button>
          <Button variant="destructive" className="h-10 px-4">
            Close Ticket
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
