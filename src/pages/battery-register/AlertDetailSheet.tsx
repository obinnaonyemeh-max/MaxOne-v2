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
import { FormField, InfoCard, InfoGrid, Modal, StatusBadge, StatusTimeline } from "@/components/max"
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
import {
  alertStatusVariantMap,
  alertStatusLabels,
  resolveBatteryAlert,
} from "@/data/mockBatteryRegisterData"

interface AlertDetailSheetProps {
  alert: AlertDetail | null
  isOpen: boolean
  onClose: () => void
  onResolved?: (alert: AlertDetail) => void
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

export function AlertDetailSheet({ alert, isOpen, onClose, onResolved }: AlertDetailSheetProps) {
  const navigate = useNavigate()
  const [showAssign, setShowAssign] = useState(false)
  const [showResolve, setShowResolve] = useState(false)
  const [assignAgent, setAssignAgent] = useState("")
  const [assignReason, setAssignReason] = useState("")
  const [resolveReason, setResolveReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setShowAssign(false)
    setShowResolve(false)
    setAssignAgent("")
    setAssignReason("")
    setResolveReason("")
    setIsSubmitting(false)
  }, [alert?.id])

  if (!alert) return null

  const handleAcknowledge = () => {
    toast.success("Alert acknowledged", {
      description: `${alert.alertType} has been acknowledged.`,
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
        description: `${alert.alertType} has been assigned to ${assignAgent}.`,
      })
    }, 1500)
  }

  const handleResolve = () => {
    const reason = resolveReason.trim()
    if (!reason) return

    const updated = resolveBatteryAlert(alert.id, reason)
    setShowResolve(false)
    setResolveReason("")

    if (updated) {
      onResolved?.(updated)
    }

    toast.success("Alert resolved", {
      description: `${alert.alertType} has been marked as resolved.`,
    })
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
    <>
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex h-full flex-col">
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{alert.alertType}</SheetTitle>
            <StatusBadge variant={alertStatusVariantMap[alert.status]} withDot>
              {alertStatusLabels[alert.status]}
            </StatusBadge>
            <StatusBadge variant={severityVariantMap[alert.severity] || "info"} withDot>
              {alert.severity}
            </StatusBadge>
          </div>
          <SheetDescription>
            {alert.batteryId} &middot; Triggered {alert.triggeredOn}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          <InfoCard title="Description">
            <p className="text-sm leading-relaxed text-sidebar-item-active">
              {alert.description}
            </p>
          </InfoCard>

          <InfoCard title="Alert Lifecycle Timeline">
            <StatusTimeline entries={alert.timeline} />
          </InfoCard>

          {alert.status === "resolved" && alert.resolutionReason && (
            <InfoCard title="Resolution Reason">
              <p className="text-sm leading-relaxed text-sidebar-item-active">
                {alert.resolutionReason}
              </p>
            </InfoCard>
          )}

          <InfoCard title="Alert Metadata">
            <InfoGrid columns={2} items={metadataItems} />
          </InfoCard>
        </div>

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
              onClick={() => setShowResolve(true)}
            >
              Resolve
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>

      <Modal
        open={showResolve}
        onOpenChange={setShowResolve}
        title="Resolve alert"
        subtitle={`${alert.alertType} · ${alert.batteryId}`}
        className="max-w-lg"
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowResolve(false),
        }}
        primaryAction={{
          label: "Resolve",
          disabled: !resolveReason.trim(),
          onClick: handleResolve,
        }}
      >
        <FormField label="Reason for resolution">
          <Textarea
            value={resolveReason}
            onChange={(event) => setResolveReason(event.target.value)}
            placeholder="Explain why this alert is being resolved..."
            className="min-h-[120px] resize-y"
          />
        </FormField>
      </Modal>

      <Dialog open={showAssign} onOpenChange={setShowAssign}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="border-b border-gray-100 px-6 pt-6 pb-4">
            <DialogTitle>Assign Alert</DialogTitle>
            <DialogDescription>
              {alert.alertType} &middot; {alert.batteryId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
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
                    .filter((assignee) => assignee.name !== alert.assignee)
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
                onChange={(event) => setAssignReason(event.target.value)}
                placeholder="Provide notes for this assignment..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-gray-100 px-6 py-4">
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
    </>
  )
}
