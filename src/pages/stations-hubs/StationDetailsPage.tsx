import { useEffect, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Pencil } from "lucide-react"
import {
  TopBar,
  InfoCard,
  InfoGrid,
  BackButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CreateSwapStationModal } from "./CreateSwapStationModal"
import { SetOperatingHoursModal } from "./SetOperatingHoursModal"
import { TransferBatteriesModal } from "./TransferBatteriesModal"
import { TransferLogTab } from "./TransferLogTab"
import { SwapHistoryTab } from "./SwapHistoryTab"
import { SwapOperatorTab } from "./SwapOperatorTab"
import { AddBatteriesToStationFlow } from "./AddBatteriesToStationFlow"
import { StationBatteryListTab } from "./StationBatteryListTab"
import { StationsMap } from "./StationsMap"
import {
  addBatteriesToStation,
  formatStationCollections,
  getStationById,
  updateStation,
} from "@/data/mockStationsData"

const TAB_VALUES = ["info", "batteries", "swap-history", "transfer-log", "operators"] as const

function formatCoordinates(lat: number, lng: number): string {
  return `Lat ${lat.toFixed(6)}, Long ${lng.toFixed(6)}`
}

function formatClock(value: string): string {
  const [hourPart, minutePart] = value.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`
}

function formatOperatingHours(
  openHours?: string | null,
  closeHours?: string | null
): string {
  if (!openHours || !closeHours) return "-"
  return `${formatClock(openHours)} - ${formatClock(closeHours)}`
}

export default function StationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get("tab") || "info"
  const initialTab = TAB_VALUES.includes(requestedTab as (typeof TAB_VALUES)[number])
    ? requestedTab
    : "info"
  const [station, setStation] = useState(() => getStationById(id || ""))
  const [editOpen, setEditOpen] = useState(false)
  const [hoursOpen, setHoursOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [addBatteriesOpen, setAddBatteriesOpen] = useState(false)
  const [logVersion, setLogVersion] = useState(0)

  useEffect(() => {
    setStation(getStationById(id || ""))
  }, [id])

  useEffect(() => {
    if (searchParams.get("transfer") !== "1") return
    setTransferOpen(true)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete("transfer")
    const nextSearch = nextParams.toString()
    navigate(
      {
        pathname: `/falcon/swap-stations/${id}`,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true }
    )
  }, [id, navigate, searchParams])

  const refreshStation = () => {
    const next = getStationById(id || "")
    if (next) setStation(next)
    setLogVersion((current) => current + 1)
  }

  if (!station) {
    return (
      <>
        <TopBar
          breadcrumbs={[
            { label: "Falcon" },
            { label: "Stations & Hubs", href: "/falcon/swap-stations" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Swap station not found</p>
        </div>
      </>
    )
  }

  const isEmpty = station.batteriesAvailable === 0
  const detailItems = [
    { label: "Sub-City", value: station.subCity || "N/A" },
    { label: "City", value: station.city },
    {
      label: "Open hours - Close hours",
      value: formatOperatingHours(station.openHours, station.closeHours),
    },
    {
      label: "Average State of Charge",
      value: isEmpty ? "N/A" : `${station.averageSoc}%`,
    },
    {
      label: "Total Collections",
      value: formatStationCollections(station.totalCollections),
    },
    {
      label: "Total Swaps (Today)",
      value: station.totalSwapsToday.toLocaleString(),
    },
    {
      label: "Current Location",
      value: formatCoordinates(station.coordinates.lat, station.coordinates.lng),
    },
    { label: "Provider", value: station.provider },
    {
      label: "Checked in Batteries",
      value: String(station.batteriesAvailable),
    },
    {
      label: "Photo of Swap Station",
      value: (
        <img
          src={station.photoUrl || "/images/station.svg"}
          alt=""
          className="h-14 w-20 rounded border border-gray-200 bg-amber-50 object-contain"
        />
      ),
    },
    { label: "Forced closure", value: station.forcedClosure ? "Yes" : "No" },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Stations & Hubs", href: "/falcon/swap-stations" },
          { label: station.name },
        ]}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/falcon/swap-stations")} />
                <h1
                  className="flex items-end gap-1 font-semibold text-sidebar-item-active"
                  style={{ fontSize: "22px" }}
                >
                  {station.name}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                View swap station information and activity
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Edit swap station details"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit swap station details</TooltipContent>
              </Tooltip>
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => setHoursOpen(true)}
              >
                <img src="/images/open_hours.svg" alt="" className="h-5 w-5" />
                Set operating hours
              </Button>
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => setTransferOpen(true)}
              >
                <img src="/images/transfer.svg" alt="" className="h-5 w-5" />
                Transfer batteries
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
          <Tabs defaultValue={initialTab} className="flex min-h-0 flex-1 flex-col">
            <TabsList variant="line" className="shrink-0 gap-0 pb-0">
              <TabsTrigger
                value="info"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Swap Station Information
              </TabsTrigger>
              <TabsTrigger
                value="batteries"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Battery list
              </TabsTrigger>
              <TabsTrigger
                value="swap-history"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Battery swap history
              </TabsTrigger>
              <TabsTrigger
                value="transfer-log"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Transfer log
              </TabsTrigger>
              <TabsTrigger
                value="operators"
                className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
              >
                Swap operator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4 min-h-0 flex-1">
              <div className="flex h-full min-h-0 items-stretch gap-4">
                <div className="w-[440px] shrink-0 overflow-y-auto">
                  <InfoCard title="Swap Station Details">
                    <InfoGrid columns={2} showDividers items={detailItems} />
                  </InfoCard>
                </div>

                <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 isolate">
                  <StationsMap
                    stations={[station]}
                    selectedStationId={station.id}
                    onSelectStation={() => {}}
                    className="h-full min-h-[420px] overflow-hidden rounded-lg"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batteries" className="mt-4 min-h-0 flex-1 overflow-hidden">
              <StationBatteryListTab
                station={station}
                refreshKey={logVersion}
                onAddBatteries={() => setAddBatteriesOpen(true)}
                onBatteryClick={(batteryId) =>
                  navigate(`/falcon/batteries/${batteryId}`, {
                    state: { from: `/falcon/swap-stations/${station.id}?tab=batteries` },
                  })
                }
              />
            </TabsContent>
            <TabsContent value="swap-history" className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <SwapHistoryTab stationId={station.id} />
            </TabsContent>
            <TabsContent value="transfer-log" className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <TransferLogTab
                stationId={station.id}
                refreshKey={logVersion}
                onStationChange={refreshStation}
              />
            </TabsContent>
            <TabsContent value="operators" className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <SwapOperatorTab stationId={station.id} stationName={station.name} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateSwapStationModal
        open={editOpen}
        onOpenChange={setEditOpen}
        station={station}
        onSave={(updated) => {
          const next = updateStation(updated.id, updated) ?? updated
          setStation(next)
        }}
      />
      <SetOperatingHoursModal
        open={hoursOpen}
        onOpenChange={setHoursOpen}
        station={station}
        onSave={(hours) => {
          const next = updateStation(station.id, hours)
          if (next) setStation(next)
        }}
      />
      <TransferBatteriesModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        station={station}
        onInitiated={refreshStation}
      />
      <AddBatteriesToStationFlow
        open={addBatteriesOpen}
        stationName={station.name}
        onClose={() => setAddBatteriesOpen(false)}
        onComplete={(importedCount) => {
          const next = addBatteriesToStation(station.id, importedCount)
          if (next) setStation(next)
          setLogVersion((current) => current + 1)
        }}
      />
    </>
  )
}
