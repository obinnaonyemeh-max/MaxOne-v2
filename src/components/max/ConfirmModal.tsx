import { type ComponentType, type SVGProps } from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ConfirmModalVariant = "destructive" | "default" | "warning" | "success"

export interface ConfirmModalAction {
  label: string
  onClick: () => void
  disabled?: boolean
}

export interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  variant?: ConfirmModalVariant
  primaryAction: ConfirmModalAction
  secondaryAction?: ConfirmModalAction
  className?: string
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon = AlertTriangle,
  variant = "destructive",
  primaryAction,
  secondaryAction,
  className,
}: ConfirmModalProps) {
  const iconClass =
    variant === "destructive"
      ? "bg-status-danger/10 text-status-danger"
      : variant === "warning"
      ? "bg-status-warning/10 text-status-warning"
      : variant === "success"
      ? "bg-status-success/10 text-status-success"
      : "bg-status-info/10 text-status-info"

  const primaryClass =
    variant === "destructive"
      ? "bg-status-danger hover:bg-status-danger/90"
      : variant === "warning"
      ? "bg-status-warning hover:bg-status-warning/90"
      : "bg-brand-dark hover:bg-brand-dark/90"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0 gap-0 overflow-hidden flex flex-col max-w-sm", className)}>
        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center">
          {variant === "success" ? (
            <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          ) : variant === "destructive" ? (
            <img src="/images/rejected.png" alt="Rejected" className="h-16 w-16" />
          ) : (
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", iconClass)}>
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div className="flex flex-col items-center gap-3">
            <DialogTitle className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
              {title}
            </DialogTitle>
            {subtitle && (
              <DialogDescription className="font-medium text-breadcrumb-root" style={{ fontSize: "13px" }}>
                {subtitle}
              </DialogDescription>
            )}
          </div>
        </div>

        <div className="shrink-0 mx-6 border-t border-gray-200" />

        <div className="flex items-center justify-end gap-3 px-6 py-6">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="h-10 px-4"
            >
              {secondaryAction.label}
            </Button>
          )}
          <Button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className={cn("h-10 px-4 text-white", primaryClass)}
          >
            {primaryAction.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
