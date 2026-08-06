import { useState, useMemo } from "react"
import { AlertTriangle } from "lucide-react"
import { Banner, StatusBadge, InfoCard, StatusTimeline, type TimelineEntryData } from "@/components/max"

import chargeFetIcon from "/images/charge_fet.svg"
import dischargeFetIcon from "/images/discharge_fet.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  mockBatteryControlStatus,
  mockCommandAuditLog,
  commandStatusVariantMap,
  commandStatusLabels,
  type BatteryControlStatus,
  type CommandAuditEntry,
  type BatteryStatus,
} from "@/data/mockBatteryRegisterData"

const statusToVariant: Record<BatteryStatus, "success" | "danger" | "warning" | "info" | "default" | "neutral" | "checkin"> = {
  "riding": "success",
  "in-transit": "default",
  "idle": "warning",
  "checked-in": "checkin",
  "retired": "danger",
  "unknown": "neutral",
}

const statusLabels: Record<BatteryStatus, string> = {
  "riding": "Riding",
  "in-transit": "In Transit",
  "idle": "Idle",
  "checked-in": "Checked-In",
  "retired": "Retired",
  "unknown": "Unknown",
}

interface FETStatusBoxProps {
  title: string
  icon: string
  enabled: boolean
  statusOn: boolean
  description: string
}

function FETStatusBox({ title, icon, enabled, statusOn, description }: FETStatusBoxProps) {
  return (
    <div className="flex-1 border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <img src={icon} alt={title} className="h-8 w-8" />
      </div>
      <p className="text-xs font-medium text-breadcrumb-root tracking-wide mb-2">
        {title}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <StatusBadge variant={enabled ? "success" : "danger"} withDot={false}>
          {enabled ? "Enabled" : "Disabled"}
        </StatusBadge>
        <StatusBadge variant={statusOn ? "success" : "danger"} withDot={false}>
          Status - {statusOn ? "On" : "Off"}
        </StatusBadge>
      </div>
      <p className="text-xs text-breadcrumb-root">{description}</p>
    </div>
  )
}

interface CommandRowProps {
  title: string
  description: string
  buttonLabel: string
  buttonVariant: "warning" | "danger" | "success"
  onAction: () => void
  isLast?: boolean
}

function CommandRow({ title, description, buttonLabel, buttonVariant, onAction, isLast }: CommandRowProps) {
  const getButtonProps = () => {
    switch (buttonVariant) {
      case "danger":
        return { variant: "destructive" as const }
      case "warning":
        return { className: "bg-status-warning hover:bg-status-warning/90 text-white" }
      case "success":
        return { className: "bg-status-success hover:bg-status-success/90 text-white" }
    }
  }

  const buttonProps = getButtonProps()

  return (
    <div className={`py-4 ${!isLast ? "border-b border-dashed border-border" : ""}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-sidebar-item-active mb-1">{title}</h4>
          <p className="text-xs text-breadcrumb-root">{description}</p>
        </div>
        <Button
          {...buttonProps}
          onClick={onAction}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

function convertAuditToTimeline(entries: CommandAuditEntry[]): TimelineEntryData[] {
  return entries.map((entry) => ({
    id: entry.id,
    date: entry.timestamp.split(" ").slice(0, 3).join(" "),
    status: commandStatusLabels[entry.commandStatus],
    statusVariant: commandStatusVariantMap[entry.commandStatus],
    description: {
      template: `{command} command {status}. {result}`,
      highlights: {
        command: entry.commandName,
        status: entry.deliveryStatus.toLowerCase(),
        result: entry.resultMessage,
      },
    },
    actor: {
      action: "Issued by",
      name: entry.issuedBy,
    },
    duration: {
      range: entry.timestamp.split(" ").slice(3).join(" "),
      total: "",
    },
  }))
}

interface BatteryInfo {
  id: string
  status: BatteryStatus
  currentRider: string | null
  currentVehicle: string | null
}

interface CommandCenterTabProps {
  batteryId: string
  batteryInfo: BatteryInfo
}

export function CommandCenterTab({ batteryId, batteryInfo }: CommandCenterTabProps) {
  const [controlStatus] = useState<BatteryControlStatus>(mockBatteryControlStatus)
  const [auditLog] = useState<CommandAuditEntry[]>(mockCommandAuditLog)
  
  const timelineEntries = useMemo(() => convertAuditToTimeline(auditLog), [auditLog])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    secondaryDescription: string
    action: string
    variant: "warning" | "danger" | "success"
    currentState: { charge: boolean; discharge: boolean }
    afterState: { charge: boolean; discharge: boolean }
  }>({
    open: false,
    title: "",
    description: "",
    secondaryDescription: "",
    action: "",
    variant: "warning",
    currentState: { charge: true, discharge: true },
    afterState: { charge: true, discharge: true },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [idConfirmDialog, setIdConfirmDialog] = useState<{
    open: boolean
    inputValue: string
  }>({
    open: false,
    inputValue: "",
  })

  const handleCommand = (command: string, variant: "warning" | "danger" | "success") => {
    const commandInfo: Record<string, { 
      description: string
      secondaryDescription: string
      afterState: { charge: boolean; discharge: boolean } 
    }> = {
      "Disable Charging": {
        description: "This action prevents the battery from receiving charge from a charging station.",
        secondaryDescription: "Battery discharge functionality will remain enabled.",
        afterState: { charge: false, discharge: controlStatus.dischargeFET.enabled },
      },
      "Disable Discharging": {
        description: "This action prevents the battery from powering a vehicle.",
        secondaryDescription: "Battery charging functionality will remain enabled.",
        afterState: { charge: controlStatus.chargeFET.enabled, discharge: false },
      },
      "Full Disable": {
        description: "This action will completely disable the battery.",
        secondaryDescription: "Both charging and discharging will be disabled.",
        afterState: { charge: false, discharge: false },
      },
      "Re-enable": {
        description: "This action will restore the battery to normal operation.",
        secondaryDescription: "Both charging and discharging will be enabled.",
        afterState: { charge: true, discharge: true },
      },
    }

    const info = commandInfo[command] || {
      description: "Are you sure you want to execute this command?",
      secondaryDescription: "",
      afterState: { charge: controlStatus.chargeFET.enabled, discharge: controlStatus.dischargeFET.enabled },
    }

    setConfirmDialog({
      open: true,
      title: `Confirm ${command}`,
      description: info.description,
      secondaryDescription: info.secondaryDescription,
      action: command,
      variant,
      currentState: { 
        charge: controlStatus.chargeFET.enabled, 
        discharge: controlStatus.dischargeFET.enabled 
      },
      afterState: info.afterState,
    })
  }

  const handleContinue = () => {
    setConfirmDialog({ ...confirmDialog, open: false })
    setIdConfirmDialog({ open: true, inputValue: "" })
  }

  const executeCommand = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIdConfirmDialog({ open: false, inputValue: "" })
      toast.success("Command sent successfully", {
        description: `${confirmDialog.action} command has been queued for execution.`,
      })
    }, 1500)
  }

  const isIdValid = idConfirmDialog.inputValue === batteryId

  return (
    <div className="flex flex-col gap-4">
      {/* Warning Banner */}
      <Banner
        variant="warning"
        icon={<AlertTriangle className="h-5 w-5 text-status-warning" />}
        title="Remote battery commands directly affect charging and discharging behavior."
        description="All actions are audit logged and may impact active riders or recovery operations."
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Controls */}
        <div className="flex flex-col gap-4">
          {/* Battery Control Status */}
          <div className="bg-content-card border border-border rounded-lg p-5">
            <h3 className="text-base font-medium text-sidebar-item-active mb-4">
              Battery Control Status
            </h3>
            <div className="flex gap-4">
              <FETStatusBox
                title="Charge FET"
                icon={chargeFetIcon}
                enabled={controlStatus.chargeFET.enabled}
                statusOn={controlStatus.chargeFET.statusOn}
                description="Battery can currently receive charge."
              />
              <FETStatusBox
                title="Discharge FET"
                icon={dischargeFetIcon}
                enabled={controlStatus.dischargeFET.enabled}
                statusOn={controlStatus.dischargeFET.statusOn}
                description="Battery can currently discharge power."
              />
            </div>
          </div>

          {/* Available Commands */}
          <div className="bg-content-card border border-border rounded-lg p-5">
            <h3 className="text-base font-medium text-sidebar-item-active mb-2">
              Available Commands
            </h3>
            <CommandRow
              title="Disable Charging"
              description="Blocks the battery from receiving charge."
              buttonLabel="Disable Charging"
              buttonVariant="warning"
              onAction={() => handleCommand("Disable Charging", "warning")}
            />
            <CommandRow
              title="Disable Discharge"
              description="Blocks the battery from powering a vehicle."
              buttonLabel="Disable Discharging"
              buttonVariant="warning"
              onAction={() => handleCommand("Disable Discharging", "warning")}
            />
            <CommandRow
              title="Full Disable"
              description="Disables both charge and discharge functionality."
              buttonLabel="Disable"
              buttonVariant="danger"
              onAction={() => handleCommand("Full Disable", "danger")}
            />
            <CommandRow
              title="Re-enable Battery"
              description="Restores both charge and discharge functionality."
              buttonLabel="Re-enable"
              buttonVariant="success"
              onAction={() => handleCommand("Re-enable", "success")}
              isLast
            />
          </div>
        </div>

        {/* Right Column - Audit Log */}
        <div className="bg-content-card border border-border rounded-lg p-5">
          <h3 className="text-base font-medium text-sidebar-item-active mb-4">
            Audit Log
          </h3>
          <StatusTimeline entries={timelineEntries} />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>
              This action will be sent to the battery management system.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            {/* Description */}
            <div className={`rounded-md border px-4 py-3 ${
              confirmDialog.variant === "danger" 
                ? "border-status-danger/30 bg-status-danger/5" 
                : confirmDialog.variant === "warning"
                ? "border-status-warning/30 bg-status-warning/5"
                : "border-status-success/30 bg-status-success/5"
            }`}>
              <p className="text-sm font-medium text-sidebar-item-active leading-relaxed">
                {confirmDialog.description}
              </p>
              {confirmDialog.secondaryDescription && (
                <p className="text-sm text-breadcrumb-root leading-relaxed mt-1">
                  {confirmDialog.secondaryDescription}
                </p>
              )}
            </div>

            {/* Battery Information */}
            <InfoCard title="Battery Information">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root">Battery ID</span>
                  <span className="text-sm font-medium text-sidebar-item-active">{batteryInfo.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root">Current State</span>
                  <StatusBadge variant={statusToVariant[batteryInfo.status]} withDot>
                    {statusLabels[batteryInfo.status]}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root">Current Rider</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-sidebar-item-active">
                      {batteryInfo.currentRider || "—"}
                    </span>
                    {batteryInfo.currentRider && (
                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        <span className="text-xs font-medium text-sidebar-item-active">
                          {batteryInfo.currentRider.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-breadcrumb-root">Current Vehicle</span>
                  <span className="text-sm font-medium text-sidebar-item-active">
                    {batteryInfo.currentVehicle || "—"}
                  </span>
                </div>
              </div>
            </InfoCard>

            {/* Charge/Discharge State Preview */}
            <InfoCard title="Charge/Discharge State">
              {/* Current State */}
              <div className="mb-3">
                <p className="text-xs text-breadcrumb-root mb-2">Current State</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-sidebar-item-active">Charge:</span>
                  <StatusBadge 
                    variant={confirmDialog.currentState.charge ? "success" : "danger"} 
                    withDot={false}
                  >
                    {confirmDialog.currentState.charge ? "Enabled" : "Disabled"}
                  </StatusBadge>
                  <span className="text-breadcrumb-root">•</span>
                  <span className="text-sm text-sidebar-item-active">Discharge:</span>
                  <StatusBadge 
                    variant={confirmDialog.currentState.discharge ? "success" : "danger"} 
                    withDot={false}
                  >
                    {confirmDialog.currentState.discharge ? "Enabled" : "Disabled"}
                  </StatusBadge>
                </div>
              </div>

              {/* After Command */}
              <div>
                <p className="text-xs text-breadcrumb-root mb-2">After Command</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-sidebar-item-active">Charge:</span>
                  <StatusBadge 
                    variant={confirmDialog.afterState.charge ? "success" : "danger"} 
                    withDot={false}
                  >
                    {confirmDialog.afterState.charge ? "Enabled" : "Disabled"}
                  </StatusBadge>
                  <span className="text-breadcrumb-root">•</span>
                  <span className="text-sm text-sidebar-item-active">Discharge:</span>
                  <StatusBadge 
                    variant={confirmDialog.afterState.discharge ? "success" : "danger"} 
                    withDot={false}
                  >
                    {confirmDialog.afterState.discharge ? "Enabled" : "Disabled"}
                  </StatusBadge>
                </div>
              </div>
            </InfoCard>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleContinue}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ID Confirmation Dialog */}
      <Dialog open={idConfirmDialog.open} onOpenChange={(open) => setIdConfirmDialog({ ...idConfirmDialog, open })}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Confirm {confirmDialog.action}</DialogTitle>
            <DialogDescription>
              This action will be sent to the battery management system.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-sm text-sidebar-item-active">
                Type <span className="font-bold">{batteryId}</span> to confirm this action.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-breadcrumb-root">
                Enter the Battery ID above.
              </label>
              <Input
                value={idConfirmDialog.inputValue}
                onChange={(e) => setIdConfirmDialog({ ...idConfirmDialog, inputValue: e.target.value })}
                placeholder=""
                className="h-11"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setIdConfirmDialog({ open: false, inputValue: "" })} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!isIdValid || isSubmitting}
              onClick={executeCommand}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Sending..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
