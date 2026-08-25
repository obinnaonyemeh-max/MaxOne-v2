import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStationBatteries, type SwapStation } from "@/data/mockStationsData"
import { CreateStationCard } from "./CreateStationCard"
import {
  getStationBatteryChargeStatus,
  StationBatteryGridCard,
  type StationBatteryChargeStatus,
} from "./StationBatteryGridCard"

const STATUS_OPTIONS: { value: StationBatteryChargeStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "charging", label: "Charging" },
  { value: "plugged-in", label: "Plugged in" },
  { value: "idle", label: "Idle" },
]

interface StationBatteryListTabProps {
  station: SwapStation
  refreshKey?: number
  onAddBatteries?: () => void
  onBatteryClick?: (batteryId: string) => void
}

export function StationBatteryListTab({
  station,
  refreshKey = 0,
  onAddBatteries,
  onBatteryClick,
}: StationBatteryListTabProps) {
  const [statusFilter, setStatusFilter] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const batteries = useMemo(
    () => getStationBatteries(station.id),
    [station.id, refreshKey]
  )

  const filteredBatteries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return batteries.filter((battery) => {
      const status = getStationBatteryChargeStatus(battery)
      if (statusFilter && status !== statusFilter) return false
      if (!query) return true
      return (
        battery.id.toLowerCase().includes(query) ||
        battery.provider.toLowerCase().includes(query)
      )
    })
  }, [batteries, searchQuery, statusFilter])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          {batteries.length} Total Batter{batteries.length === 1 ? "y" : "ies"}
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter || undefined}
            onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-9 min-w-[160px] [&_svg]:text-brand-primary [&_svg]:opacity-100">
              <SelectValue placeholder="- Select status -" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search battery ID or brand"
                className="h-9 w-56"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false)
                    setSearchQuery("")
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery("")
                }}
              >
                ×
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <CreateStationCard label="Add new batteries" onClick={onAddBatteries} />
          {filteredBatteries.map((battery) => (
            <StationBatteryGridCard
              key={battery.id}
              battery={battery}
              onClick={() => onBatteryClick?.(battery.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
