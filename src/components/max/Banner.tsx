import type { ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type BannerVariant = "info" | "warning" | "danger" | "success"

export interface BannerProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  variant?: BannerVariant
  className?: string
}

const variantStyles: Record<
  BannerVariant,
  { wrapper: string; title: string; defaultIcon: ReactNode }
> = {
  info: {
    wrapper: "border-status-info/20 bg-status-info/[0.08]",
    title: "text-status-info",
    defaultIcon: <Info className="h-5 w-5 text-status-info" />,
  },
  warning: {
    wrapper: "border-status-warning/20 bg-status-warning/[0.08]",
    title: "text-status-warning",
    defaultIcon: <AlertTriangle className="h-5 w-5 text-status-warning" />,
  },
  danger: {
    wrapper: "border-status-danger/20 bg-status-danger/[0.08]",
    title: "text-status-danger",
    defaultIcon: <XCircle className="h-5 w-5 text-status-danger" />,
  },
  success: {
    wrapper: "border-status-success/20 bg-status-success/[0.08]",
    title: "text-status-success",
    defaultIcon: <CheckCircle2 className="h-5 w-5 text-status-success" />,
  },
}

export function Banner({ icon, title, description, variant = "info", className }: BannerProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn("rounded-lg border px-5 py-4 flex items-start gap-4", styles.wrapper, className)}>
      <span className="shrink-0 mt-0.5">{icon ?? styles.defaultIcon}</span>
      <div>
        <p className={cn("font-bold text-sm", styles.title)}>{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}
