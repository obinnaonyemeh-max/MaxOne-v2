import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { PageLayout } from "./PageLayout"
import { Sidebar, type SidebarItem, type SidebarSection } from "./Sidebar"
import {
  sidebarSections,
  driverGrowthSidebarSections,
  driverExperienceSidebarSections,
  falconSidebarSections,
  portfolioSidebarSections,
  sidebarUser,
} from "@/data/sidebarConfig"
import { mockVehicles } from "@/data/mockVehicles"
import { SIMULATED_DRIVER_EXPERIENCE_AGENTS } from "@/data/driverExperienceAssignmentScope"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import {
  getFallbackPathForDenied,
  isPathAllowedForMode,
} from "@/data/rolePermissions"

function withFleetRegisterCount(
  sections: SidebarSection[],
  count: number
): SidebarSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.id === "fleet-register" ? { ...item, badge: count } : item
    ),
  }))
}

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
  "driver-experience": "/champion-360",
  "falcon": "/falcon/dashboard",
  "portfolio": "/portfolio/dashboard",
}

const driverGrowthPrefixes = ["/growth-activation", "/mcp-management"]
const driverExperiencePrefixes = [
  "/driver-experience",
  "/champion-360",
  "/ticket-management",
  "/driver-safety-score",
  "/welfare",
]

function getAppIdFromPathname(pathname: string): string {
  if (pathname.startsWith("/falcon")) return "falcon"
  if (pathname.startsWith("/portfolio")) return "portfolio"
  if (driverGrowthPrefixes.some((prefix) => pathname.startsWith(prefix))) return "driver-growth"
  if (driverExperiencePrefixes.some((prefix) => pathname.startsWith(prefix))) return "driver-experience"
  return "fleet-operations"
}

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, isFullBuild, roleLabel, roleSidebarSections, filterByCity } =
    useRoleSimulation()
  const selectedAppId = getAppIdFromPathname(location.pathname)
  const fleetRegisterCount = useMemo(
    () => mockVehicles.filter((vehicle) => filterByCity(vehicle.location)).length,
    [filterByCity]
  )

  useEffect(() => {
    if (isFullBuild) return
    if (!isPathAllowedForMode(location.pathname, mode)) {
      navigate(getFallbackPathForDenied(location.pathname, mode), { replace: true })
    }
  }, [isFullBuild, location.pathname, mode, navigate])

  const sections = isFullBuild
    ? selectedAppId === "driver-growth"
      ? driverGrowthSidebarSections
      : selectedAppId === "driver-experience"
        ? driverExperienceSidebarSections
        : selectedAppId === "falcon"
          ? falconSidebarSections
          : selectedAppId === "portfolio"
            ? portfolioSidebarSections
            : sidebarSections
    : roleSidebarSections

  const activeSections = markActiveSections(
    withFleetRegisterCount(sections, fleetRegisterCount),
    location.pathname
  )

  const displayUser = {
    ...sidebarUser,
    name:
      mode === "call-centre-agent"
        ? SIMULATED_DRIVER_EXPERIENCE_AGENTS["call-centre-agent"].name
        : mode === "welfare-agent"
          ? SIMULATED_DRIVER_EXPERIENCE_AGENTS["welfare-agent"].name
          : sidebarUser.name,
    role: roleLabel,
  }

  const handleSidebarItemClick = (item: SidebarItem) => {
    if (item.href) {
      navigate(item.href)
    }
  }

  const handleAppChange = (appId: string) => {
    const defaultRoute = appDefaultRoutes[appId]
    if (defaultRoute) {
      navigate(defaultRoute)
    }
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        closeButton={false}
        style={{ "--width": "min(420px, calc(100vw - 32px))" } as CSSProperties}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "max-toast",
            title: "max-toast-title",
            description: "max-toast-description",
            icon: "max-toast-icon",
            content: "max-toast-content",
          },
        }}
      />
      <PageLayout
        sidebar={({ isCollapsed, onToggleCollapse }) => (
          <Sidebar
            sections={activeSections}
            user={displayUser}
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            selectedAppId={selectedAppId}
            onAppChange={handleAppChange}
            showAppSwitcher={isFullBuild}
          />
        )}
      >
        {children}
      </PageLayout>
    </>
  )
}
