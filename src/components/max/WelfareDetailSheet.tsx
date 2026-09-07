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
import { Phone, CalendarClock, FileEdit, ArrowRight } from "lucide-react"
import {
  type WelfareChampion,
  type WelfareStatus,
} from "@/data/mockWelfare"
import { getWelfareTimelineSnapshot } from "@/data/welfareStore"

export type { WelfareChampion } from "@/data/mockWelfare"

interface WelfareDetailSheetProps {
  champion: WelfareChampion | null
  isOpen: boolean
  onClose: () => void
  onLogNote?: (champion: WelfareChampion) => void
  onScheduleFollowUp?: (champion: WelfareChampion) => void
  readOnly?: boolean
}

// ── Variant maps ──

const welfareStatusVariantMap: Record<WelfareStatus, "success" | "danger" | "warning" | "info"> = {
  Healthy: "success",
  "Needs Attention": "warning",
  "At Risk": "danger",
  Critical: "info",
}

// ── Component ──

export function WelfareDetailSheet({
  champion,
  isOpen,
  onClose,
  onLogNote,
  onScheduleFollowUp,
  readOnly = false,
}: WelfareDetailSheetProps) {
  if (!champion) return null

  const riskFlags: string[] = []
  if (champion.welfareStatus === "At Risk" || champion.welfareStatus === "Critical") {
    riskFlags.push(champion.welfareStatus)
  }
  if (champion.championState === "Suspended") riskFlags.push("Suspended")
  if (champion.championState === "Inactive") riskFlags.push("Inactive")
  if (champion.issuesLogged >= 5) riskFlags.push("High Issue Count")
  if (champion.transferRejection) riskFlags.push("Transfer Rejected")

  const timelineEntries = getWelfareTimelineSnapshot(champion.id)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full">
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
        {!readOnly && <SheetFooter>
          <Button
            className="h-10 px-4 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
          >
            <Phone className="h-4 w-4" />
            Call Champion
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4 gap-2"
            onClick={() => onScheduleFollowUp?.(champion)}
          >
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
        </SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}
