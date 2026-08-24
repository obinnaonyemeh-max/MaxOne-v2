import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"
import {
  BatteryLevelIcon,
  ConfirmModal,
  DataTable,
  GenericFilterPopover,
  InfoCard,
  InfoGrid,
  Modal,
  Pagination,
  StatusBadge,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  acceptTransfer,
  getTransferDirection,
  getTransfersForStation,
  rejectTransfer,
  transferStatusLabels,
  transferStatusVariantMap,
  type BatteryTransfer,
  type TransferBatterySnapshot,
  type TransferStatus,
} from "@/data/mockStationTransfers"

const filterSections: FilterSection[] = [
  {
    id: "direction",
    title: "Direction",
    defaultExpanded: true,
    options: [
      { value: "incoming", label: "Incoming" },
      { value: "outgoing", label: "Outgoing" },
    ],
  },
  {
    id: "status",
    title: "Status",
    options: [
      { value: "pending", label: "Pending", color: "var(--color-warning)" },
      { value: "accepted", label: "Accepted", color: "var(--color-success)" },
      { value: "rejected", label: "Rejected", color: "var(--color-danger)" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  direction: [],
  status: [],
}

interface TransferLogTabProps {
  stationId: string
  refreshKey?: number
  onStationChange?: () => void
}

export function TransferLogTab({
  stationId,
  refreshKey = 0,
  onStationChange,
}: TransferLogTabProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [version, setVersion] = useState(0)
  const [selectedTransfer, setSelectedTransfer] = useState<BatteryTransfer | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "accept" | "reject"
    transfer: BatteryTransfer
  } | null>(null)
  const [result, setResult] = useState<{
    variant: "success" | "default"
    title: string
    subtitle: string
  } | null>(null)

  const transfers = useMemo(
    () => getTransfersForStation(stationId),
    [stationId, refreshKey, version]
  )

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const directionFilters = filters.direction ?? []
    const statusFilters = filters.status ?? []

    return transfers.filter((transfer) => {
      const direction = getTransferDirection(transfer, stationId)
      if (directionFilters.length > 0 && !directionFilters.includes(direction)) {
        return false
      }
      if (statusFilters.length > 0 && !statusFilters.includes(transfer.status)) {
        return false
      }
      if (!query) return true
      const batteryIds = transfer.batteries.map((battery) => battery.id).join(" ")
      return (
        transfer.id.toLowerCase().includes(query) ||
        transfer.sourceStationName.toLowerCase().includes(query) ||
        transfer.destinationStationName.toLowerCase().includes(query) ||
        transfer.status.toLowerCase().includes(query) ||
        direction.includes(query) ||
        batteryIds.toLowerCase().includes(query)
      )
    })
  }, [filters, searchQuery, stationId, transfers])

  const activeFilterCount = getActiveFilterCount(filters)

  const handleFiltersChange = (next: GenericFilterState) => {
    setFilters(next)
    setCurrentPage(1)
  }

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [currentPage, filtered, pageSize])

  const totalPages = Math.ceil(filtered.length / pageSize)

  const handleConfirm = () => {
    if (!confirmAction) return
    const updated =
      confirmAction.type === "accept"
        ? acceptTransfer(confirmAction.transfer.id)
        : rejectTransfer(confirmAction.transfer.id)

    setConfirmAction(null)
    setSelectedTransfer(null)
    setVersion((current) => current + 1)
    onStationChange?.()

    if (!updated) {
      setResult({
        variant: "default",
        title: "Transfer could not be updated",
        subtitle: "This transfer is no longer pending.",
      })
      return
    }

    if (confirmAction.type === "accept") {
      setResult({
        variant: "success",
        title: "Transfer accepted",
        subtitle: `${updated.batteries.length} batter${updated.batteries.length === 1 ? "y has" : "ies have"} been moved to this station.`,
      })
      return
    }

    setResult({
      variant: "default",
      title: "Transfer rejected",
      subtitle: "The batteries will remain at the source station.",
    })
  }

  const columns: ColumnDef<BatteryTransfer>[] = [
    {
      accessorKey: "id",
      header: "Transfer ID",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.id}
        </span>
      ),
    },
    {
      id: "direction",
      header: "Direction",
      cell: ({ row }) => {
        const direction = getTransferDirection(row.original, stationId)
        return (
          <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
            {direction === "incoming" ? "Incoming" : "Outgoing"}
          </span>
        )
      },
    },
    {
      id: "batteries",
      header: "Batteries",
      cell: ({ row }) => {
        const ids = row.original.batteries.map((battery) => battery.id)
        const preview = ids.slice(0, 2).join(", ")
        const extra = ids.length > 2 ? ` +${ids.length - 2}` : ""
        return (
          <span
            className="font-medium text-table-text"
            style={{ fontSize: "14px" }}
            title={ids.join(", ")}
          >
            {ids.length} · {preview}
            {extra}
          </span>
        )
      },
    },
    {
      id: "counterparty",
      header: "Counterparty station",
      cell: ({ row }) => {
        const incoming = getTransferDirection(row.original, stationId) === "incoming"
        return (
          <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
            {incoming ? row.original.sourceStationName : row.original.destinationStationName}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as TransferStatus
        return (
          <StatusBadge variant={transferStatusVariantMap[status]} withDot>
            {transferStatusLabels[status]}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "initiatedAt",
      header: "Initiated on",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.initiatedAt}
        </span>
      ),
    },
  ]

  const canAct =
    selectedTransfer &&
    getTransferDirection(selectedTransfer, stationId) === "incoming" &&
    selectedTransfer.status === "pending"

  const detailsOpen = Boolean(selectedTransfer) && !confirmAction && !result
  const directionLabel =
    selectedTransfer && getTransferDirection(selectedTransfer, stationId) === "incoming"
      ? "Incoming"
      : "Outgoing"

  return (
    <>
      <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <GenericFilterPopover
                sections={filterSections}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </PopoverContent>
          </Popover>

          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search transfer ID, station, or battery..."
                className="h-9 w-72"
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

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginated}
            emptyMessage="No transfers to show yet."
            onRowClick={setSelectedTransfer}
          />
        </div>
      </div>

      <div className="mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="transfers"
        />
      </div>

      <Modal
        open={detailsOpen}
        onOpenChange={(next) => {
          if (!next) setSelectedTransfer(null)
        }}
        title={selectedTransfer?.id ?? "Transfer details"}
        subtitle={
          selectedTransfer
            ? `${directionLabel} transfer ${
                directionLabel === "Incoming" ? "from" : "to"
              } ${
                directionLabel === "Incoming"
                  ? selectedTransfer.sourceStationName
                  : selectedTransfer.destinationStationName
              }.`
            : undefined
        }
        className="max-w-lg"
        maxHeight="85vh"
        secondaryAction={
          canAct
            ? {
                label: "Reject",
                onClick: () =>
                  selectedTransfer &&
                  setConfirmAction({ type: "reject", transfer: selectedTransfer }),
              }
            : undefined
        }
        primaryAction={
          canAct
            ? {
                label: "Accept",
                onClick: () =>
                  selectedTransfer &&
                  setConfirmAction({ type: "accept", transfer: selectedTransfer }),
              }
            : {
                label: "Close",
                onClick: () => setSelectedTransfer(null),
              }
        }
      >
        {selectedTransfer && (
          <div className="space-y-5">
            <InfoCard
              title="Transfer Details"
              action={
                <StatusBadge
                  variant={transferStatusVariantMap[selectedTransfer.status]}
                  withDot
                >
                  {transferStatusLabels[selectedTransfer.status]}
                </StatusBadge>
              }
            >
              <InfoGrid
                columns={2}
                showDividers
                items={[
                  { label: "Source station", value: selectedTransfer.sourceStationName },
                  {
                    label: "Destination station",
                    value: selectedTransfer.destinationStationName,
                  },
                  {
                    label: "Destination admin",
                    value: selectedTransfer.destinationAdminName || "Station Admin",
                  },
                  {
                    label: "Batteries",
                    value: String(selectedTransfer.batteries.length),
                  },
                  { label: "Initiated on", value: selectedTransfer.initiatedAt },
                  {
                    label: "Resolved on",
                    value: selectedTransfer.resolvedAt || "—",
                  },
                ]}
              />
            </InfoCard>

            <div className="space-y-2">
              <p className="text-xs font-medium text-breadcrumb-root">Batteries</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedTransfer.batteries.map((battery) => (
                  <TransferBatteryCard key={battery.id} battery={battery} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(confirmAction)}
        onOpenChange={(next) => {
          if (!next) setConfirmAction(null)
        }}
        variant={confirmAction?.type === "reject" ? "destructive" : "default"}
        title={
          confirmAction?.type === "reject"
            ? "Reject this battery transfer?"
            : "Accept this battery transfer?"
        }
        subtitle={
          confirmAction?.type === "reject"
            ? `${confirmAction.transfer.batteries.length} batter${confirmAction.transfer.batteries.length === 1 ? "y" : "ies"} will remain at ${confirmAction.transfer.sourceStationName}.`
            : `${confirmAction?.transfer.batteries.length} batter${confirmAction?.transfer.batteries.length === 1 ? "y" : "ies"} will be moved from ${confirmAction?.transfer.sourceStationName} to this station.`
        }
        secondaryAction={{
          label: "Cancel",
          onClick: () => setConfirmAction(null),
        }}
        primaryAction={{
          label: confirmAction?.type === "reject" ? "Reject transfer" : "Accept transfer",
          onClick: handleConfirm,
        }}
      />

      <ConfirmModal
        open={Boolean(result)}
        onOpenChange={(next) => {
          if (!next) setResult(null)
        }}
        variant={result?.variant ?? "success"}
        title={result?.title ?? ""}
        subtitle={result?.subtitle}
        primaryAction={{
          label: "Done",
          onClick: () => setResult(null),
        }}
      />
    </>
  )
}

function TransferBatteryCard({ battery }: { battery: TransferBatterySnapshot }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
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
    </div>
  )
}
