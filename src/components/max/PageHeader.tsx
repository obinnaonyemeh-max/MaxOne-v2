import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
  action?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  className,
  action,
}: PageHeaderProps) {
  return (
    <header className={cn("px-4 py-4 md:px-6 md:py-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
            {title}
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-breadcrumb-root">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  )
}
