import type { ReactNode } from "react"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobileNav } from "./PageLayout"

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
  const mobileNav = useMobileNav()
  const lastCrumbIndex = breadcrumbs ? breadcrumbs.length - 1 : -1

  return (
    <div className={cn("sticky top-0 z-10 bg-content-card", className)}>
      <div className="flex items-center justify-between gap-2 px-4 py-[14px] md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {mobileNav?.hasSidebar && (
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 hover:bg-muted transition-colors lg:hidden"
              aria-label="Open navigation"
              onClick={() => mobileNav.setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5 text-sidebar-item-active" />
            </button>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-sm">
              {breadcrumbs.map((crumb, index) => {
                const isFirst = index === 0
                const isLast = index === lastCrumbIndex
                const isMiddle = !isFirst && !isLast

                return (
                  <span
                    key={index}
                    className={cn(
                      "flex min-w-0 items-center gap-2",
                      !isLast && "hidden md:flex"
                    )}
                  >
                    {index > 0 && (
                      <span
                        className={cn(
                          "text-breadcrumb-separator font-medium",
                          isLast && "hidden md:inline"
                        )}
                      >
                        /
                      </span>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className={cn(
                          "truncate font-medium transition-colors hover:opacity-80",
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
                          "truncate font-medium",
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
        </div>

        {showDefaultActions && (
          <div className="flex shrink-0 items-center gap-2">
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
