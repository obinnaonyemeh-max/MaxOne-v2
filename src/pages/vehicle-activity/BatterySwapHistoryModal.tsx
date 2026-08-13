import { useMemo, useState } from "react"
import { Search, Triangle } from "lucide-react"
import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"
import type { BatterySwapRecord } from "@/data/mockVehicleActivity"

interface BatterySwapHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plateNumber: string
  batteryId: string
  swaps: BatterySwapRecord[]
}

export function BatterySwapHistoryModal({
  open,
  onOpenChange,
  plateNumber,
  batteryId,
  swaps,
}: BatterySwapHistoryModalProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return swaps
    return swaps.filter((swap) => {
      const haystack = [
        swap.station,
        swap.attendant,
        swap.batteryIn.id,
        swap.batteryOut.id,
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [query, swaps])

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery("")
        onOpenChange(next)
      }}
      title="Battery Swap History"
      subtitle={`${plateNumber} • Current battery ${batteryId}`}
      className="max-w-2xl"
      maxHeight="80vh"
    >
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by battery, attendant or station..."
            className="h-10 rounded-full pl-9"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-200">
            {filtered.map((swap) => (
              <div
                key={swap.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-6 py-4"
              >
                <div className="min-w-0">
                  <p
                    className="truncate text-sidebar-item-active font-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    {swap.station}
                  </p>
                  <p className="text-breadcrumb-root mt-0.5" style={{ fontSize: "12px" }}>
                    {swap.timestamp}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-success">
                    <Triangle className="h-2.5 w-2.5 fill-current" />
                    <span className="font-medium" style={{ fontSize: "13px" }}>
                      {swap.batteryIn.id} • {swap.batteryIn.chargePercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Triangle className="h-2.5 w-2.5 fill-current rotate-180" />
                    <span className="font-medium" style={{ fontSize: "13px" }}>
                      {swap.batteryOut.id} • {swap.batteryOut.chargePercent}%
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className="text-sidebar-item-active font-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    ₦{swap.feeNaira.toLocaleString()}
                  </p>
                  <p className="text-breadcrumb-root mt-0.5" style={{ fontSize: "12px" }}>
                    {swap.attendant}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-breadcrumb-root">
            No swap history matches your search.
          </p>
        )}
      </div>
    </Modal>
  )
}
