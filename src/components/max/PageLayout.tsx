import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"

interface SidebarRenderProps {
  isCollapsed: boolean
  onToggleCollapse?: () => void
}

interface PageLayoutProps {
  children: ReactNode
  sidebar?: ReactNode | ((props: SidebarRenderProps) => ReactNode)
  className?: string
}

interface MobileNavContextValue {
  isMobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  hasSidebar: boolean
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null)

export function useMobileNav() {
  return useContext(MobileNavContext)
}

export function PageLayout({ children, sidebar, className }: PageLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const location = useLocation()

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (media.matches) setIsMobileNavOpen(false)
    }
    media.addEventListener("change", closeOnDesktop)
    return () => media.removeEventListener("change", closeOnDesktop)
  }, [])

  const renderSidebar = (props: SidebarRenderProps) => {
    if (!sidebar) return null
    if (typeof sidebar === "function") {
      return sidebar(props)
    }
    return sidebar
  }

  return (
    <MobileNavContext.Provider
      value={{
        isMobileNavOpen,
        setMobileNavOpen: setIsMobileNavOpen,
        hasSidebar: Boolean(sidebar),
      }}
    >
      <div className="flex h-screen w-full overflow-hidden bg-content-bg">
        {sidebar && (
          <aside
            className={cn(
              "hidden shrink-0 overflow-hidden transition-all duration-300 ease-in-out lg:block",
              isCollapsed ? "w-16" : "w-60"
            )}
          >
            <div className="h-full overflow-y-auto">
              {renderSidebar({
                isCollapsed,
                onToggleCollapse: handleToggleCollapse,
              })}
            </div>
          </aside>
        )}

        {sidebar && (
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetContent
              side="left"
              size="full"
              hideCloseButton
              className="w-60 max-w-[min(240px,100vw)] border-0 bg-content-bg p-0"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Application navigation menu
              </SheetDescription>
              <div className="h-full overflow-y-auto">
                {renderSidebar({ isCollapsed: false })}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <main className="min-w-0 flex-1 overflow-hidden py-0 pr-0 lg:py-4 lg:pr-4">
          <div
            className={cn(
              "flex h-full min-w-0 flex-col overflow-hidden bg-content-card lg:rounded-lg lg:border lg:border-content-card-border",
              className
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </MobileNavContext.Provider>
  )
}
