import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SidebarRenderProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

interface PageLayoutProps {
  children: ReactNode
  sidebar?: ReactNode | ((props: SidebarRenderProps) => ReactNode)
  className?: string
}

export function PageLayout({ children, sidebar, className }: PageLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  const renderSidebar = () => {
    if (!sidebar) return null
    if (typeof sidebar === "function") {
      return sidebar({ isCollapsed, onToggleCollapse: handleToggleCollapse })
    }
    return sidebar
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-content-bg">
      {/* Sidebar - sits directly on the app background as part of the frame */}
      {sidebar && (
        <aside
          className={cn(
            "shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-60"
          )}
        >
          <div className="h-full overflow-y-auto">
            {renderSidebar()}
          </div>
        </aside>
      )}

      {/* Content area with padding to create visual gap around the card */}
      <main className="flex-1 overflow-hidden py-4 pr-4 pl-0">
        <div
          className={cn(
            "h-full rounded-lg border border-content-card-border bg-content-card flex flex-col overflow-hidden",
            className
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
