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
import type { TimelineEntryData } from "./TimelineEntry"
import { Button } from "@/components/ui/button"
import { Phone, CalendarClock, FileEdit, ArrowRight } from "lucide-react"

// ── Types ──

type WelfareStatus = "Healthy" | "Needs Attention" | "At Risk" | "Critical"
type ChampionState = "Active" | "Inactive" | "On Leave" | "Suspended"

export interface WelfareChampion {
  id: string
  name: string
  championId: string
  avatarUrl: string
  location: string
  vehicle: string
  welfareStatus: WelfareStatus
  championState: ChampionState
  lastContact: string
  nextFollowUp: string
  issuesLogged: number
  phoneNumber: string
  transferRejection?: {
    date: string
    ownershipType: string
    rejectionReason: string
  }
}

interface WelfareDetailSheetProps {
  champion: WelfareChampion | null
  isOpen: boolean
  onClose: () => void
  onLogNote?: (champion: WelfareChampion) => void
}

// ── Variant maps ──

const welfareStatusVariantMap: Record<WelfareStatus, "success" | "danger" | "warning" | "info"> = {
  Healthy: "success",
  "Needs Attention": "warning",
  "At Risk": "danger",
  Critical: "info",
}

// ── Mock timeline data per champion ──

const mockWelfareTimelines: Record<string, TimelineEntryData[]> = {
  "1": [
    {
      id: "w1-1",
      date: "8 Jun 2026",
      status: "Welfare Check",
      statusVariant: "success",
      description: {
        template: "Routine welfare check completed. {outcome}",
        highlights: { outcome: "Champion reported no issues" },
      },
      actor: { action: "Logged by", name: "Aisha Bello" },
      duration: { range: "1 day ago", total: "" },
    },
    {
      id: "w1-2",
      date: "2 Jun 2026",
      status: "Follow-up Call",
      statusVariant: "info",
      description: {
        template: "Scheduled follow-up call completed. {topic} discussed.",
        highlights: { topic: "Vehicle condition and earnings" },
      },
      actor: { action: "Handled by", name: "Samson Oluwaseun" },
      duration: { range: "7 days ago", total: "" },
    },
  ],
  "2": [
    {
      id: "w2-1",
      date: "5 Jun 2026",
      status: "Issue Reported",
      statusVariant: "warning",
      description: {
        template: "Champion reported {issue}. Escalated to operations.",
        highlights: { issue: "brake pad wear and delayed servicing" },
      },
      actor: { action: "Logged by", name: "Ngozi Umeh" },
      duration: { range: "4 days ago", total: "" },
    },
    {
      id: "w2-2",
      date: "1 Jun 2026",
      status: "Welfare Check",
      statusVariant: "success",
      description: {
        template: "Routine welfare check completed. {outcome}",
        highlights: { outcome: "Minor concerns flagged for review" },
      },
      actor: { action: "Logged by", name: "Aisha Bello" },
      duration: { range: "8 days ago", total: "" },
    },
  ],
  "3": [
    {
      id: "w3-1",
      date: "1 Jun 2026",
      status: "Risk Flagged",
      statusVariant: "danger",
      description: {
        template: "Champion flagged as {risk}. Multiple missed check-ins.",
        highlights: { risk: "At Risk" },
      },
      actor: { action: "Flagged by", name: "System" },
      duration: { range: "8 days ago", total: "" },
    },
    {
      id: "w3-2",
      date: "25 May 2026",
      status: "Welfare Check",
      statusVariant: "warning",
      description: {
        template: "Attempted welfare check. {outcome}",
        highlights: { outcome: "Champion unreachable — voicemail left" },
      },
      actor: { action: "Attempted by", name: "Samson Oluwaseun" },
      duration: { range: "15 days ago", total: "" },
    },
  ],
  "4": [
    {
      id: "w4-0",
      date: "5 Jul 2026",
      status: "Transfer Rejected",
      statusVariant: "danger",
      description: {
        template: "Transfer of ownership request ({type}) was rejected. {reason}",
        highlights: { type: "Outright Payment", reason: "Escalated to welfare for follow-up" },
      },
      actor: { action: "Escalated by", name: "System" },
      duration: { range: "23 days ago", total: "" },
    },
    {
      id: "w4-1",
      date: "28 May 2026",
      status: "Suspension Notice",
      statusVariant: "danger",
      description: {
        template: "Champion suspended due to {reason}.",
        highlights: { reason: "unresolved safety violations and missed welfare reviews" },
      },
      actor: { action: "Actioned by", name: "Ops Manager" },
      duration: { range: "12 days ago", total: "" },
    },
    {
      id: "w4-2",
      date: "20 May 2026",
      status: "Issue Reported",
      statusVariant: "warning",
      description: {
        template: "Champion reported {issue}.",
        highlights: { issue: "persistent engine warning light and earnings dispute" },
      },
      actor: { action: "Logged by", name: "Ngozi Umeh" },
      duration: { range: "20 days ago", total: "" },
    },
    {
      id: "w4-3",
      date: "15 May 2026",
      status: "Welfare Check",
      statusVariant: "info",
      description: {
        template: "Welfare check completed with {outcome}.",
        highlights: { outcome: "multiple concerns documented" },
      },
      actor: { action: "Logged by", name: "Aisha Bello" },
      duration: { range: "25 days ago", total: "" },
    },
  ],
  "6": [
    {
      id: "w6-1",
      date: "4 Jun 2026",
      status: "Leave Approved",
      statusVariant: "info",
      description: {
        template: "Champion placed on {status}. Return date pending.",
        highlights: { status: "approved medical leave" },
      },
      actor: { action: "Approved by", name: "Ops Manager" },
      duration: { range: "5 days ago", total: "" },
    },
  ],
  "7": [
    {
      id: "w7-0",
      date: "1 Jul 2026",
      status: "Transfer Rejected",
      statusVariant: "danger",
      description: {
        template: "Transfer of ownership request ({type}) was rejected. {reason}",
        highlights: { type: "Outright Payment", reason: "Escalated to welfare for follow-up" },
      },
      actor: { action: "Escalated by", name: "System" },
      duration: { range: "27 days ago", total: "" },
    },
    {
      id: "w7-1",
      date: "30 May 2026",
      status: "Risk Flagged",
      statusVariant: "danger",
      description: {
        template: "Champion flagged as {risk} due to inactivity and unresolved tickets.",
        highlights: { risk: "At Risk" },
      },
      actor: { action: "Flagged by", name: "System" },
      duration: { range: "10 days ago", total: "" },
    },
  ],
  "9": [
    {
      id: "w9-1",
      date: "25 May 2026",
      status: "Escalation",
      statusVariant: "danger",
      description: {
        template: "Welfare case escalated. {reason}",
        highlights: { reason: "Champion unresponsive for 2 weeks — critical welfare alert" },
      },
      actor: { action: "Escalated by", name: "Aisha Bello" },
      duration: { range: "15 days ago", total: "" },
    },
    {
      id: "w9-2",
      date: "18 May 2026",
      status: "Follow-up Call",
      statusVariant: "warning",
      description: {
        template: "Follow-up attempted. {outcome}",
        highlights: { outcome: "No answer — 3rd attempt this week" },
      },
      actor: { action: "Attempted by", name: "Samson Oluwaseun" },
      duration: { range: "22 days ago", total: "" },
    },
  ],
}

const defaultTimeline: TimelineEntryData[] = [
  {
    id: "w-default",
    date: "9 Jun 2026",
    status: "No Interactions",
    statusVariant: "default",
    description: {
      template: "No welfare interactions have been recorded for this champion yet.",
      highlights: {},
    },
    actor: { action: "System", name: "Auto" },
    duration: { range: "—", total: "" },
  },
]

// ── Component ──

export function WelfareDetailSheet({ champion, isOpen, onClose, onLogNote }: WelfareDetailSheetProps) {
  if (!champion) return null

  const riskFlags: string[] = []
  if (champion.welfareStatus === "At Risk" || champion.welfareStatus === "Critical") {
    riskFlags.push(champion.welfareStatus)
  }
  if (champion.championState === "Suspended") riskFlags.push("Suspended")
  if (champion.championState === "Inactive") riskFlags.push("Inactive")
  if (champion.issuesLogged >= 5) riskFlags.push("High Issue Count")
  if (champion.transferRejection) riskFlags.push("Transfer Rejected")

  const timelineEntries = mockWelfareTimelines[champion.id] || defaultTimeline

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{champion.name}</SheetTitle>
            <StatusBadge variant={welfareStatusVariantMap[champion.welfareStatus]} withDot>
              {champion.welfareStatus}
            </StatusBadge>
          </div>
          <SheetDescription>
            {champion.championId} &middot; {champion.location}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Transfer Rejection Callout */}
          {champion.transferRejection && (
            <div className="rounded-md border border-status-danger/30 bg-status-danger/5 px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-status-danger">Transfer of Ownership Rejected</p>
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                {champion.transferRejection.rejectionReason}
              </p>
              <p className="text-xs text-breadcrumb-root mt-1">
                {champion.transferRejection.ownershipType} &middot; {champion.transferRejection.date}
              </p>
            </div>
          )}

          {/* Champion Profile */}
          <InfoCard title="Champion Profile">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={champion.avatarUrl}
                alt={champion.name}
                className="w-[54px] h-[54px] rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-medium text-sidebar-item-active text-[15px] tracking-[-0.15px]">
                  {champion.name}
                </p>
                <p className="text-breadcrumb-root text-xs mt-0.5">{champion.championId}</p>
              </div>
            </div>
            <InfoGrid
              columns={2}
              items={[
                { label: "Location", value: champion.location },
                { label: "Phone Number", value: champion.phoneNumber },
                { label: "Vehicle", value: champion.vehicle },
                { label: "Champion State", value: champion.championState },
              ]}
            />
          </InfoCard>

          {/* Welfare Overview */}
          <InfoCard title="Welfare Overview">
            <InfoGrid
              columns={2}
              items={[
                { label: "Last Contact", value: champion.lastContact },
                { label: "Next Follow-up", value: champion.nextFollowUp },
                { label: "Total Open Issues", value: String(champion.issuesLogged) },
                {
                  label: "Risk Flags",
                  value: riskFlags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {riskFlags.map((flag) => (
                        <StatusBadge key={flag} variant="danger" size="sm">
                          {flag}
                        </StatusBadge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-badge-active-text font-medium">None</span>
                  ),
                },
              ]}
            />
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-sidebar-item-active hover:bg-gray-50 transition-colors"
            >
              View All Raised Tickets
              <ArrowRight className="h-4 w-4 text-breadcrumb-root" />
            </button>
          </InfoCard>

          {/* Welfare Interaction Timeline */}
          <InfoCard title="Welfare Interaction Timeline">
            <StatusTimeline entries={timelineEntries} />
          </InfoCard>
        </div>

        {/* Footer CTAs */}
        <SheetFooter>
          <Button
            className="h-10 px-4 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
          >
            <Phone className="h-4 w-4" />
            Call Champion
          </Button>
          <Button variant="outline" className="h-10 px-4 gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 gap-2"
            onClick={() => onLogNote?.(champion)}
          >
            <FileEdit className="h-4 w-4" />
            Log Note
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
