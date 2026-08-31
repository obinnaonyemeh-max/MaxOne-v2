import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  DataTable,
  StatusBadge,
  Pagination,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  mockKitReports,
  kitStatusVariantMap,
  type KitReport,
} from "@/data/mockKitReports"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { KitMovementHistoryModal } from "./KitMovementHistoryModal"

const COLOR_STATUS_SUCCESS = "var(--color-status-success)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

const STATUS_FILTER_SECTION: FilterSection = {
  id: "status",
  title: "Status",
  defaultExpanded: true,
  options: [
    { value: "Assigned", label: "Assigned", color: COLOR_STATUS_SUCCESS },
    { value: "New", label: "New", color: COLOR_GRAY_500 },
  ],
}

const REASSIGNED_FILTER_SECTION: FilterSection = {
  id: "reassigned",
  title: "Reassigned?",
  defaultExpanded: true,
  options: [
    { value: "Yes", label: "Yes", color: COLOR_STATUS_INFO },
    { value: "No",  label: "No",  color: COLOR_GRAY_500 },
  ],
}

const defaultFilters: GenericFilterState = {
  status: [],
  reassigned: [],
  champion: [],
}

const columns: ColumnDef<KitReport>[] = [
  {
    accessorKey: "id",
    header: "Kit ID (Chassis/Kit ID)",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={kitStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "reassigned",
    header: "Reassigned?",
    cell: ({ row }) => (
      <StatusBadge variant={row.original.reassigned ? "info" : "default"} withDot>
        {row.original.reassigned ? "Yes" : "No"}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "champion",
    header: "Current Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.champion ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.plateNumber ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "assignmentDate",
    header: "Assignment Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignmentDate ?? "—"}
      </span>
    ),
  },
]

export default function KitReportsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedKit, setSelectedKit] = useState<KitReport | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)
  const canKitReassignment = useCan("kit.reassignment")
  const scopedKits = useCityScopedRecords(mockKitReports, "location")

  const filterSections: FilterSection[] = useMemo(() => {
    const championOptions = Array.from(
      new Set(scopedKits.map((k) => k.champion).filter((c): c is string => !!c))
    ).sort()
    return [
      STATUS_FILTER_SECTION,
      REASSIGNED_FILTER_SECTION,
      {
        id: "champion",
        title: "Champion",
        options: championOptions.map((champion) => ({ value: champion, label: champion })),
      },
    ]
  }, [scopedKits])

  const filteredKits = useMemo(
    () =>
      scopedKits.filter((kit) => {
        if (filters.status.length > 0 && !filters.status.includes(kit.status)) return false
        if (filters.reassigned.length > 0) {
          const reassignedLabel = kit.reassigned ? "Yes" : "No"
          if (!filters.reassigned.includes(reassignedLabel)) return false
        }
        if (filters.champion.length > 0 && (kit.champion === null || !filters.champion.includes(kit.champion))) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          const matchesId = kit.id.toLowerCase().includes(q)
          const matchesPlate = kit.plateNumber?.toLowerCase().includes(q) ?? false
          if (!matchesId && !matchesPlate) return false
        }
        return true
      }),
    [filters, searchQuery, scopedKits]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Activation & Assignment" },
          { label: "Asset Reassignment" },
          { label: "Kit" },
        ]}
      />

      <div className="px-6 pt-6 pb-2 shrink-0">
        <h1 className="text-foreground font-semibold" style={{ fontSize: "22px" }}>
          Kit Reports
        </h1>
        <p className="text-muted-foreground mt-1" style={{ fontSize: "14px" }}>
          Track every E-tricycle Conversion Kit&apos;s current status, or drill into a single
          kit&apos;s full assignment and reassignment history.
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pt-4">
        <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex items-center justify-between gap-2 px-2 py-2 shrink-0">
            <div className="flex items-center gap-2">
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

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              placeholder="Search Kit ID or plate number"
              inputClassName="w-64"
            />
            </div>

            {canKitReassignment && (
              <Button
                className="h-9 gap-2"
                onClick={() => navigate("/activation-assignment/asset-reassignment/kit/assign")}
              >
                <Plus className="h-4 w-4" />
                Kit Reassignment
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredKits}
              emptyMessage="No kits found."
              onRowClick={(row) => setSelectedKit(row)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredKits.length / pageSize) || 1}
            totalItems={filteredKits.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="kits"
          />
        </div>
      </div>

      <KitMovementHistoryModal
        kit={selectedKit}
        open={selectedKit !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKit(null)
        }}
      />
    </>
  )
}
