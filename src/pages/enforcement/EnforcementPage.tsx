import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  ConfirmModal,
  StatusBadge,
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
  ENFORCEMENT_ACTION_LABELS,
  ENFORCEMENT_ACTION_VARIANTS,
  getActiveEnforcements,
  reverseEnforcement,
  type EnforcementRecord,
} from "@/data/mockEnforcement"
import { getVehicleActivity } from "@/data/mockVehicleActivity"
import { EnforcementHistoryModal } from "@/pages/vehicle-activity/EnforcementHistoryModal"
import { ReverseEnforcementModal } from "./ReverseEnforcementModal"

const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_STATUS_INFO = "var(--color-info)"

const filterSections: FilterSection[] = [
  {
    id: "action",
    title: "Enforcement type",
    defaultExpanded: true,
    options: [
      { value: "swap-block", label: "Swap Block", color: COLOR_STATUS_INFO },
      { value: "vehicle-lock", label: "Vehicle Lock", color: COLOR_STATUS_WARNING },
      { value: "battery-lock", label: "Battery Lock", color: COLOR_STATUS_DANGER },
    ],
  },
  {
    id: "triggerType",
    title: "Trigger type",
    options: [
      { value: "Automated", label: "Automated" },
      { value: "Manual", label: "Manual" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  action: [],
  triggerType: [],
}

function getColumns(handlers: {
  onVehicleClick: (vehicleId: string) => void
  onReverse: (record: EnforcementRecord) => void
}): ColumnDef<EnforcementRecord>[] {
  return [
    {
      accessorKey: "championId",
      header: "Champion ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
              {row.original.championName}
            </p>
            <p className="font-medium text-table-text-warning" style={{ fontSize: "11px" }}>
              {row.original.championId}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "plateNumber",
      header: "Vehicle ID",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            handlers.onVehicleClick(row.original.vehicleId)
          }}
          className="font-medium text-table-text-primary hover:text-table-text-warning hover:underline"
          style={{ fontSize: "14px" }}
        >
          {row.original.plateNumber}
        </button>
      ),
    },
    {
      accessorKey: "currentDpd",
      header: "Current DPD",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.currentDpd} {row.original.currentDpd === 1 ? "day" : "days"}
        </span>
      ),
    },
    {
      accessorKey: "action",
      header: "Enforcement",
      cell: ({ row }) => (
        <StatusBadge variant={ENFORCEMENT_ACTION_VARIANTS[row.original.action]} withDot>
          {ENFORCEMENT_ACTION_LABELS[row.original.action]}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "triggerType",
      header: "Trigger Type",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.triggerType}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.reason}
        </span>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.lastUpdated}
        </span>
      ),
    },
    {
      id: "reverse",
      header: "Reverse action",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={(event) => {
            event.stopPropagation()
            handlers.onReverse(row.original)
          }}
        >
          Reverse
        </Button>
      ),
    },
  ]
}

export default function EnforcementPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState(getActiveEnforcements)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [reverseTarget, setReverseTarget] = useState<EnforcementRecord | null>(null)
  const [successTarget, setSuccessTarget] = useState<EnforcementRecord | null>(null)
  const [historyVehicleId, setHistoryVehicleId] = useState<string | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        if (filters.action.length > 0 && !filters.action.includes(record.action)) return false
        if (filters.triggerType.length > 0 && !filters.triggerType.includes(record.triggerType)) {
          return false
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          if (
            !record.plateNumber.toLowerCase().includes(query) &&
            !record.championName.toLowerCase().includes(query) &&
            !record.championId.toLowerCase().includes(query) &&
            !record.vehicleId.toLowerCase().includes(query)
          ) {
            return false
          }
        }
        return true
      }),
    [records, filters, searchQuery]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedRecords = useMemo(
    () => filteredRecords.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredRecords, safePage, pageSize]
  )

  const columns = useMemo(
    () =>
      getColumns({
        onVehicleClick: (vehicleId) => navigate(`/falcon/vehicle-register/${vehicleId}/activity`),
        onReverse: setReverseTarget,
      }),
    [navigate]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "Monitoring" },
          { label: "Enforcement" },
        ]}
      />

      <PageHeader
        title="Enforcement"
        subtitle="Review active enforcement actions and reverse them when the issue is resolved."
        className="shrink-0"
      />

      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4">
        <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex items-center gap-2 px-2 py-2 shrink-0">
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
                  onFiltersChange={(next) => {
                    setFilters(next)
                    setCurrentPage(1)
                  }}
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
                  placeholder="Search vehicle ID, champion name or ID..."
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
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={pagedRecords}
              emptyMessage="No active enforcement actions."
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            itemLabel="enforcements"
          />
        </div>
      </div>

      <ReverseEnforcementModal
        open={!!reverseTarget}
        record={reverseTarget}
        onOpenChange={(open) => {
          if (!open) setReverseTarget(null)
        }}
        onConfirm={(reason) => {
          if (!reverseTarget) return
          reverseEnforcement(reverseTarget.id, reason)
          setRecords(getActiveEnforcements())
          setSuccessTarget(reverseTarget)
          setReverseTarget(null)
        }}
      />

      <ConfirmModal
        open={!!successTarget}
        onOpenChange={(open) => {
          if (!open) setSuccessTarget(null)
        }}
        variant="success"
        title="Enforcement reversed successfully"
        subtitle="This action has been logged in the vehicle’s enforcement history."
        secondaryAction={{
          label: "View history",
          onClick: () => {
            if (!successTarget) return
            setHistoryVehicleId(successTarget.vehicleId)
            setSuccessTarget(null)
          },
        }}
        primaryAction={{
          label: "Done",
          onClick: () => setSuccessTarget(null),
        }}
      />

      <EnforcementHistoryModal
        open={!!historyVehicleId}
        onOpenChange={(open) => {
          if (!open) setHistoryVehicleId(null)
        }}
        events={
          historyVehicleId
            ? getVehicleActivity(historyVehicleId)?.enforcement.history ?? []
            : []
        }
      />
    </>
  )
}
