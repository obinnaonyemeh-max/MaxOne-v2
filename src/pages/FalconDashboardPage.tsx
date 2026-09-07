import { useState } from "react"
import { Presentation } from "lucide-react"
import { PageHeader, TopBar } from "@/components/max"
import { Button } from "@/components/ui/button"
import { FalconDashboardBody } from "@/pages/falcon-dashboard/FalconDashboardBody"
import { FalconDashboardSlideshow } from "@/pages/falcon-dashboard/FalconDashboardSlideshow"

export default function FalconDashboardPage() {
  const [slideshowOpen, setSlideshowOpen] = useState(false)

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
            <Button variant="outline" onClick={() => setSlideshowOpen(true)}>
              <Presentation className="h-4 w-4" />
              Slideshow
            </Button>
          }
        />

        <FalconDashboardBody />
      </div>

      {slideshowOpen && (
        <FalconDashboardSlideshow onClose={() => setSlideshowOpen(false)} />
      )}
    </>
  )
}
