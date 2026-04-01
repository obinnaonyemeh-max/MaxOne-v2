import { useState, type ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { PageLayout } from "./PageLayout"
import { Sidebar, type SidebarItem, type SidebarSection } from "./Sidebar"
import { sidebarSections, driverGrowthSidebarSections, sidebarUser } from "@/data/sidebarConfig"

function markActiveSections(sections: SidebarSection[], pathname: string): SidebarSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => markActiveItem(item, pathname)),
  }))
}

function markActiveItem(item: SidebarItem, pathname: string): SidebarItem {
  const isActive = item.href ? pathname.startsWith(item.href) : false
  return {
    ...item,
    isActive,
    children: item.children?.map((child) => markActiveItem(child, pathname)),
  }
}

const appDefaultRoutes: Record<string, string> = {
  "fleet-operations": "/dashboard",
  "driver-growth": "/growth-activation",
}

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedAppId, setSelectedAppId] = useState("fleet-operations")

  const sections = selectedAppId === "driver-growth"
    ? driverGrowthSidebarSections
    : sidebarSections

  const activeSections = markActiveSections(sections, location.pathname)

  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.href) {
      navigate(item.href)
    }
  }

  const handleAppChange = (appId: string) => {
    setSelectedAppId(appId)
    const defaultRoute = appDefaultRoutes[appId]
    if (defaultRoute) {
      navigate(defaultRoute)
    }
  }

  return (
    <PageLayout
      sidebar={({ isCollapsed, onToggleCollapse }) => (
        <Sidebar
          sections={activeSections}
          user={sidebarUser}
          onItemClick={handleSidebarItemClick}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onAppChange={handleAppChange}
        />
      )}
    >
      {children}
    </PageLayout>
  )
}
