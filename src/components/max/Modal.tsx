import { type ReactNode } from "react"
import { X, Plus } from "lucide-react"
import { BackButton } from "./BackButton"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ModalAction {
  label: string
  onClick: () => void
  disabled?: boolean
  icon?: boolean
}

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
  children: ReactNode
  primaryAction?: ModalAction
  secondaryAction?: ModalAction
  leftAction?: ReactNode
  className?: string
  maxHeight?: string
  hideHeader?: boolean
}

export function Modal({
  open,
  onOpenChange,
  title,
  subtitle,
  showBackButton = false,
  onBack,
  children,
  primaryAction,
  secondaryAction,
  leftAction,
  className,
  maxHeight,
  hideHeader = false,
}: ModalProps) {
  const hasActions = primaryAction || secondaryAction || leftAction

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn("p-0 gap-0 overflow-hidden flex flex-col", className)}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {!hideHeader && (
          <>
            {/* Modal Header */}
            <div className="shrink-0 px-6 pt-6 pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {showBackButton && (
                    <BackButton onClick={onBack} />
                  )}
                  <div className="flex flex-col gap-1">
                    <DialogTitle className="font-semibold text-sidebar-item-active" style={{ fontSize: '16px' }}>
                      {title}
                    </DialogTitle>
                    {subtitle && (
                      <DialogDescription className="font-medium text-breadcrumb-root" style={{ fontSize: '13px' }}>
                        {subtitle}
                      </DialogDescription>
                    )}
                  </div>
                </div>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                </DialogClose>
              </div>
            </div>

            {/* Header Divider */}
            <div className="shrink-0 mx-6 border-t border-gray-200" />
          </>
        )}

        {/* Modal Content */}
        <div className={cn("flex-1 overflow-y-auto", hideHeader ? "p-6" : "px-6 py-6")}>
          {children}
        </div>

        {/* Actions Section */}
        {hasActions && (
          <>
            {/* Actions Divider */}
            <div className="shrink-0 mx-6 border-t border-gray-200" />

            <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-6">
              <div>{leftAction}</div>
              <div className="flex items-center gap-3">
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
                {primaryAction && (
                  <Button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className={cn(
                      "h-10 bg-brand-dark text-white hover:bg-brand-dark/90",
                      primaryAction.icon ? "gap-2 pl-3 pr-[14px]" : "px-4"
                    )}
                  >
                    {primaryAction.icon && <Plus className="h-4 w-4" />}
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
