import { useMemo, useState } from "react"
import { Presentation } from "lucide-react"
import { PageHeader, TopBar } from "@/components/max"
import { Button } from "@/components/ui/button"
import { useRoleSimulation } from "@/contexts/RoleSimulationContext"
import { falconWidgetModuleIdsFromNav } from "@/data/falconDashboardWidgets"
import { getRoleDefinition } from "@/data/rolePermissions"
import { FalconDashboardBody } from "@/pages/falcon-dashboard/FalconDashboardBody"
import { FalconDashboardSlideshow } from "@/pages/falcon-dashboard/FalconDashboardSlideshow"

export default function FalconDashboardPage() {
  const { isFullBuild, mode } = useRoleSimulation()
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const allowedModuleIds = useMemo(() => {
    if (isFullBuild) return undefined
    const role = getRoleDefinition(mode)
    if (!role) return undefined
    return falconWidgetModuleIdsFromNav(role.navItemIds)
  }, [isFullBuild, mode])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-4 pb-6 md:px-6">
        <PageHeader
          title="Dashboard"
          subtitle="Monitor connected vehicles, energy, and alerts across your fleet"
          className="px-0"
          action={
            isFullBuild ? (
              <Button variant="outline" onClick={() => setSlideshowOpen(true)}>
                <Presentation className="h-4 w-4" />
                Slideshow
              </Button>
            ) : undefined
          }
        />

        <FalconDashboardBody allowedModuleIds={allowedModuleIds} />
      </div>

      {isFullBuild && slideshowOpen && (
        <FalconDashboardSlideshow onClose={() => setSlideshowOpen(false)} />
      )}
    </>
  )
}
