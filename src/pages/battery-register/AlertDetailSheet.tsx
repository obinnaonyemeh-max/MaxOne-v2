import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { InfoCard } from "@/components/max/InfoCard"
import { InfoGrid } from "@/components/max/InfoGrid"
import { StatusBadge } from "@/components/max/StatusBadge"
import { StatusTimeline } from "@/components/max/StatusTimeline"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AlertDetail } from "@/data/mockBatteryRegisterData"
import { alertStatusVariantMap, alertStatusLabels } from "@/data/mockBatteryRegisterData"

interface AlertDetailSheetProps {
  alert: AlertDetail | null
  isOpen: boolean
  onClose: () => void
}

const severityVariantMap: Record<string, "danger" | "warning" | "info" | "success"> = {
  "Level 1": "info",
  "Level 2": "warning",
  "Level 3": "danger",
  "Level 4": "danger",
}

const assigneeList = [
  { name: "Daniel Amokachi", department: "Battery Operations" },
  { name: "Sarah Johnson", department: "Field Operations" },
  { name: "Michael Chen", department: "Engineering" },
  { name: "Fatima Bello", department: "Technical Support" },
  { name: "Chidi Okafor", department: "Maintenance" },
]

export function AlertDetailSheet({ alert, isOpen, onClose }: AlertDetailSheetProps) {
  const navigate = useNavigate()
  const [showAssign, setShowAssign] = useState(false)
  const [assignAgent, setAssignAgent] = useState("")
  const [assignReason, setAssignReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setShowAssign(false)
    setAssignAgent("")
    setAssignReason("")
    setIsSubmitting(false)
  }, [alert?.id])

  if (!alert) return null

  const handleAcknowledge = () => {
    toast.success("Alert acknowledged", {
      description: `${alert.id} has been acknowledged.`,
    })
    onClose()
  }

  const handleAssign = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowAssign(false)
      onClose()
      toast.success("Alert assigned successfully", {
        description: `${alert.id} has been assigned to ${assignAgent}.`,
      })
    }, 1500)
  }

  const handleResolve = () => {
    toast.success("Alert resolved", {
      description: `${alert.id} has been marked as resolved.`,
    })
    onClose()
  }

  const metadataItems = [
    {
      label: "Battery ID",
      value: (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-dark hover:text-brand-dark/80"
          onClick={() => navigate(`/falcon/batteries/${alert.batteryId}`)}
        >
          {alert.batteryId}
          <ExternalLink className="h-3 w-3" />
        </button>
      ),
    },
    { label: "Alarm Code", value: alert.alarmCode },
    { label: "Age", value: alert.age },
    { label: "Severity", value: alert.severity },
    { label: "Location", value: alert.location },
    { label: "Assignee", value: alert.assignee },
    {
      label: "Assign to",
      value: alert.assignedTo ? (
        <span className="text-sm font-medium text-sidebar-item-active">
          {alert.assignedTo}
        </span>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-dark hover:text-brand-dark/80"
          onClick={() => {
            setAssignAgent("")
            setAssignReason("")
            setShowAssign(true)
          }}
        >
          Assign
          <ExternalLink className="h-3 w-3" />
        </button>
      ),
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        {/* Sticky Header */}
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{alert.id}</SheetTitle>
            <StatusBadge variant={alertStatusVariantMap[alert.status]} withDot>
              {alertStatusLabels[alert.status]}
            </StatusBadge>
            <StatusBadge variant={severityVariantMap[alert.severity] || "info"} withDot>
              {alert.severity}
            </StatusBadge>
          </div>
          <SheetDescription>
            {alert.alertType} &middot; Triggered {alert.triggeredOn}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Section 1: Description */}
          <InfoCard title="Description">
            <p className="text-sm text-sidebar-item-active leading-relaxed">
              {alert.description}
            </p>
          </InfoCard>

          {/* Section 2: Alert Lifecycle Timeline */}
          <InfoCard title="Alert Lifecycle Timeline">
            <StatusTimeline entries={alert.timeline} />
          </InfoCard>

          {/* Section 3: Alert Metadata */}
          <InfoCard title="Alert Metadata">
            <InfoGrid columns={2} items={metadataItems} />
          </InfoCard>
        </div>

        {/* Sticky Footer */}
        <SheetFooter>
          {alert.status === "triggered" && (
            <Button
              variant="outline"
              className="h-10 px-4"
              onClick={handleAcknowledge}
            >
              Acknowledge
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 px-4"
            onClick={() => {
              setAssignAgent("")
              setAssignReason("")
              setShowAssign(true)
            }}
          >
            Assign
          </Button>
          {alert.status !== "resolved" && (
            <Button
              className="h-10 px-4 bg-brand-dark text-white hover:bg-brand-dark/90"
              onClick={handleResolve}
            >
              Resolve
            </Button>
          )}
        </SheetFooter>
      </SheetContent>

      {/* Assign Alert Modal */}
      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Assign Alert</DialogTitle>
            <DialogDescription>
              {alert.id} &middot; {alert.alertType}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Select Assignee
              </label>
              <Select value={assignAgent} onValueChange={setAssignAgent}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Choose an assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assigneeList
                    .filter((a) => a.name !== alert.assignee)
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
                Assignment Notes
              </label>
              <Textarea
                value={assignReason}
                onChange={(e) => setAssignReason(e.target.value)}
                placeholder="Provide notes for this assignment..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowAssign(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!assignAgent || isSubmitting}
              onClick={handleAssign}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
