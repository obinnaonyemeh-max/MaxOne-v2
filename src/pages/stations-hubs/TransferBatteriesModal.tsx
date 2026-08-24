import { useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import {
  BatteryLevelIcon,
  ConfirmModal,
  InfoCard,
  InfoGrid,
  Modal,
} from "@/components/max"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  STATION_PROVIDERS,
  getTransferableBatteries,
  mockSwapStations,
  type StationBattery,
  type StationProvider,
  type SwapStation,
} from "@/data/mockStationsData"
import { initiateTransfer } from "@/data/mockStationTransfers"

type TransferStep = "select" | "destination" | "preview"

interface TransferBatteriesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  station: SwapStation
  onInitiated?: () => void
}

function stationLabel(station: SwapStation): string {
  return `${station.name} · ${station.city} · ${station.provider}`
}

export function TransferBatteriesModal({
  open,
  onOpenChange,
  station,
  onInitiated,
}: TransferBatteriesModalProps) {
  const [step, setStep] = useState<TransferStep>("select")
  const [search, setSearch] = useState("")
  const [brands, setBrands] = useState<StationProvider[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [destinationId, setDestinationId] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [destinationOpen, setDestinationOpen] = useState(false)
  const [initiated, setInitiated] = useState(false)
  const destinationRef = useRef<HTMLDivElement>(null)

  const batteries = useMemo(
    () => (open ? getTransferableBatteries(station.id) : []),
    [open, station.id]
  )

  const filteredBatteries = useMemo(() => {
    const query = search.trim().toLowerCase()
    return batteries.filter((battery) => {
      const matchesBrand = brands.length === 0 || brands.includes(battery.provider)
      const matchesSearch =
        !query ||
        battery.id.toLowerCase().includes(query) ||
        battery.provider.toLowerCase().includes(query)
      return matchesBrand && matchesSearch
    })
  }, [batteries, brands, search])

  const selectedBatteries = useMemo(
    () => batteries.filter((battery) => selectedIds.includes(battery.id)),
    [batteries, selectedIds]
  )

  const destinations = useMemo(
    () => mockSwapStations.filter((item) => item.id !== station.id),
    [station.id]
  )

  const selectedDestination = destinations.find((item) => item.id === destinationId)

  const destinationOptions = useMemo(() => {
    const query = destinationQuery.trim().toLowerCase()
    if (!query) return destinations.slice(0, 12)
    return destinations
      .filter((item) => stationLabel(item).toLowerCase().includes(query))
      .slice(0, 12)
  }, [destinationQuery, destinations])

  useEffect(() => {
    if (!open) {
      setStep("select")
      setSearch("")
      setBrands([])
      setSelectedIds([])
      setDestinationId("")
      setDestinationQuery("")
      setDestinationOpen(false)
      setInitiated(false)
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target as Node)
      ) {
        setDestinationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleBrand = (brand: StationProvider) => {
    setBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    )
  }

  const toggleBattery = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const handleInitiate = () => {
    if (!selectedDestination || selectedIds.length === 0) return
    const created = initiateTransfer({
      sourceStationId: station.id,
      destinationStationId: selectedDestination.id,
      batteryIds: selectedIds,
    })
    if (!created) return
    onInitiated?.()
    setInitiated(true)
  }

  const titles: Record<TransferStep, string> = {
    select: "Transfer Batteries",
    destination: "Select Destination Station",
    preview: "Preview Transfer",
  }

  const subtitles: Record<TransferStep, string> = {
    select: `Select batteries to transfer from ${station.name}.`,
    destination: "Confirm the source station, then search for where these batteries should go.",
    preview: "Review the transfer details before initiating.",
  }

  const canContinueSelect = selectedIds.length > 0
  const canContinueDestination = Boolean(selectedDestination)

  return (
    <>
      <Modal
        open={open && !initiated}
        onOpenChange={onOpenChange}
        title={titles[step]}
        subtitle={subtitles[step]}
        className={cn("max-w-lg", step === "destination" && "overflow-visible")}
        maxHeight="85vh"
        contentClassName={step === "destination" ? "overflow-visible" : undefined}
        showBackButton={step !== "select"}
        onBack={() => setStep(step === "preview" ? "destination" : "select")}
        secondaryAction={{
          label: "Cancel",
          onClick: () => onOpenChange(false),
        }}
        primaryAction={
          step === "select"
            ? {
                label: "Continue",
                onClick: () => setStep("destination"),
                disabled: !canContinueSelect,
              }
            : step === "destination"
              ? {
                  label: "Continue",
                  onClick: () => setStep("preview"),
                  disabled: !canContinueDestination,
                }
              : {
                  label: "Initiate Transfer",
                  onClick: handleInitiate,
                }
        }
      >
        {step === "select" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search battery ID or brand"
                className="h-11 pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATION_PROVIDERS.map((brand) => {
                const active = brands.includes(brand)
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
                      active
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {brand}
                  </button>
                )
              })}
            </div>

            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
              {filteredBatteries.length === 0 ? (
                <div className="col-span-2 rounded-lg border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
                  {batteries.length === 0
                    ? "No transferable batteries at this station."
                    : "No batteries match your search or brand filter."}
                </div>
              ) : (
                filteredBatteries.map((battery) => (
                  <BatterySelectRow
                    key={battery.id}
                    battery={battery}
                    selected={selectedIds.includes(battery.id)}
                    onToggle={() => toggleBattery(battery.id)}
                  />
                ))
              )}
            </div>

            {selectedIds.length > 0 && (
              <p className="text-xs font-medium text-breadcrumb-root">
                {selectedIds.length} batter{selectedIds.length === 1 ? "y" : "ies"} selected
              </p>
            )}
          </div>
        )}

        {step === "destination" && (
          <div className="relative min-h-[160px]">
            <div className="flex gap-3">
            <div className="flex w-4 shrink-0 flex-col items-center pt-4 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-dark" />
              <span className="my-1 w-px flex-1 bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full border-2 border-brand-primary bg-white" />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
                <p className="text-xs font-medium text-gray-400">From</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-950">{station.name}</p>
                <p className="text-xs text-breadcrumb-root">
                  {station.city} · {station.provider}
                </p>
              </div>

              <div ref={destinationRef} className="relative">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-brand-primary">
                  <p className="text-xs font-medium text-gray-400">To</p>
                  <div className="relative mt-0.5">
                    <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={
                        selectedDestination && !destinationOpen
                          ? stationLabel(selectedDestination)
                          : destinationQuery
                      }
                      onChange={(event) => {
                        setDestinationQuery(event.target.value)
                        setDestinationId("")
                        setDestinationOpen(true)
                      }}
                      onFocus={() => {
                        setDestinationOpen(true)
                        if (selectedDestination) {
                          setDestinationQuery("")
                        }
                      }}
                      placeholder="Search destination station"
                      className="h-9 border-0 bg-transparent px-0 pl-6 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
                {destinationOpen && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
                    {destinationOptions.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-gray-500">No stations found.</p>
                    ) : (
                      destinationOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setDestinationId(item.id)
                            setDestinationQuery("")
                            setDestinationOpen(false)
                          }}
                          className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-gray-50"
                        >
                          <span className="text-sm font-medium text-sidebar-item-active">
                            {item.name}
                          </span>
                          <span className="text-xs text-breadcrumb-root">
                            {item.city} · {item.provider}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        )}

        {step === "preview" && selectedDestination && (
          <div className="space-y-5">
            <InfoCard title="Transfer Details">
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Source station", value: station.name },
                  { label: "Destination station", value: selectedDestination.name },
                  {
                    label: "Destination admin",
                    value: selectedDestination.adminName || "Station Admin",
                  },
                  {
                    label: "Batteries",
                    value: String(selectedBatteries.length),
                  },
                ]}
              />
            </InfoCard>

            <div className="space-y-2">
              <p className="text-xs font-medium text-breadcrumb-root">Selected batteries</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedBatteries.map((battery) => (
                  <BatterySelectRow
                    key={battery.id}
                    battery={battery}
                    selected={false}
                    readOnly
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={open && initiated}
        onOpenChange={(next) => {
          if (!next) onOpenChange(false)
        }}
        variant="success"
        title="Transfer process initiated"
        subtitle={`A notification has been sent to ${selectedDestination?.adminName || "the station admin"} at ${selectedDestination?.name || "the destination station"}. The transfer can be accepted or rejected from the transfer log.`}
        primaryAction={{
          label: "Done",
          onClick: () => onOpenChange(false),
        }}
        className="max-w-md"
      />
    </>
  )
}

function BatterySelectRow({
  battery,
  selected,
  onToggle,
  readOnly = false,
}: {
  battery: StationBattery
  selected: boolean
  onToggle?: () => void
  readOnly?: boolean
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5",
        selected && !readOnly
          ? "border-gray-950 bg-gray-50"
          : "border-gray-200 bg-white",
        readOnly ? "cursor-default" : "cursor-pointer hover:border-gray-300"
      )}
    >
      {!readOnly && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-4 w-4 accent-[var(--color-brand-dark)]"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-950">{battery.id}</span>
          <BatteryLevelIcon
            chargeLevel={battery.stateOfCharge}
            isCharging={battery.isCharging}
            isPluggedIn={battery.isPluggedIn}
          />
        </div>
        <p className="mt-0.5 text-xs text-breadcrumb-root">{battery.provider}</p>
      </div>
    </label>
  )
}
