import { useState } from "react"
import { ChevronsUpDown, Check, TrendingUp, Briefcase, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface App {
  id: string
  name: string
  logo?: string
  icon?: React.ComponentType<{ className?: string }>
}

const apps: App[] = [
  { id: "fleet-operations", name: "Fleet Operations", logo: "/images/fleet_op.svg" },
  { id: "driver-growth", name: "Driver Growth", icon: TrendingUp },
  { id: "portfolio", name: "Portfolio", icon: Briefcase },
  { id: "driver-experience", name: "Driver Experience", icon: UserCircle },
]

interface AppSwitcherProps {
  isCollapsed?: boolean
}

function AppLogo({ app, size = "default" }: { app: App; size?: "default" | "small" }) {
  const sizeClasses = size === "small" ? "h-8 w-8" : "h-9 w-9"
  const iconSizeClasses = size === "small" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg shrink-0",
        sizeClasses
      )}
      style={{ backgroundColor: "#FAF3C7" }}
    >
      {app.logo ? (
        <img src={app.logo} alt={app.name} className={iconSizeClasses} />
      ) : app.icon ? (
        <app.icon className={cn(iconSizeClasses, "text-gray-700")} />
      ) : null}
    </div>
  )
}

export function AppSwitcher({ isCollapsed = false }: AppSwitcherProps) {
  const [selectedApp, setSelectedApp] = useState<App>(apps[0])
  const [open, setOpen] = useState(false)

  const handleSelectApp = (app: App) => {
    setSelectedApp(app)
    setOpen(false)
  }

  if (isCollapsed) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center justify-center rounded-lg p-1 hover:bg-sidebar-hover transition-colors"
            title={selectedApp.name}
          >
            <AppLogo app={selectedApp} size="small" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-2"
          side="right"
          align="start"
          sideOffset={8}
        >
          <div className="space-y-1">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleSelectApp(app)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                  "hover:bg-gray-100",
                  selectedApp.id === app.id && "bg-gray-100"
                )}
              >
                <AppLogo app={app} size="small" />
                <span className="flex-1 text-left font-medium text-gray-900" style={{ fontSize: "13px" }}>
                  {app.name}
                </span>
                {selectedApp.id === app.id && (
                  <Check className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors",
            "hover:bg-sidebar-hover"
          )}
          style={{ backgroundColor: "#F9F9F9" }}
        >
          <AppLogo app={selectedApp} />
          <span className="flex-1 text-left font-semibold text-gray-900 truncate" style={{ fontSize: "13px" }}>
            {selectedApp.name}
          </span>
          <ChevronsUpDown className="h-5 w-5 text-gray-500 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
        sideOffset={4}
      >
        <div className="space-y-1">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleSelectApp(app)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                "hover:bg-gray-100",
                selectedApp.id === app.id && "bg-gray-100"
              )}
            >
              <AppLogo app={app} />
              <span className="flex-1 text-left font-medium text-gray-900" style={{ fontSize: "13px" }}>
                {app.name}
              </span>
              {selectedApp.id === app.id && (
                <Check className="h-4 w-4 text-gray-600" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
