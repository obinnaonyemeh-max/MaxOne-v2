import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Breadcrumb {
  label: string
  href?: string
}

interface TopBarProps {
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
  showDefaultActions?: boolean
  className?: string
}

export function TopBar({
  breadcrumbs,
  actions,
  showDefaultActions = true,
  className,
}: TopBarProps) {
  return (
    <div className={cn("sticky top-0 z-10 bg-content-card", className)}>
      <div className="flex items-center justify-between px-6 py-[14px]">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isFirst = index === 0
              const isLast = index === breadcrumbs.length - 1
              const isMiddle = !isFirst && !isLast
              
              return (
                <span key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-breadcrumb-separator font-medium">/</span>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className={cn(
                        "font-medium transition-colors hover:opacity-80",
                        isFirst && "text-breadcrumb-root",
                        isMiddle && "text-breadcrumb-parent",
                        isLast && "text-breadcrumb-current"
                      )}
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        "font-medium",
                        isFirst && "text-breadcrumb-root",
                        isMiddle && "text-breadcrumb-parent",
                        isLast && "text-breadcrumb-current"
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}
                </span>
              )
            })}
          </nav>
        )}

        {showDefaultActions && (
          <div className="flex items-center gap-2">
            {actions}
            <button className="rounded-lg p-2 hover:bg-muted transition-colors">
              <img src="/images/global_search.svg" alt="Search" className="h-4 w-4" />
            </button>
            <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
              <img src="/images/notifications_bell.svg" alt="Notifications" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-divider" />
    </div>
  )
}
