import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { addPendingVehicleDocument } from "@/data/vehicleDocumentStore"
import { useUpdateModal } from "./activation-readiness/useUpdateModal"
import { ActivationUpdateModal } from "./activation-readiness/ActivationUpdateModal"
import { BulkActivationUploadModal } from "./activation-readiness/BulkActivationUploadModal"
import { STAGE_KEYS } from "./activation-readiness/stages"

import {
  mockActivationRecords,
  stageStatusVariantMap,
  type ActivationRecord,
  type StageStatus,
  type ReadyStatus,
} from "@/data/mockActivationRecords"

const COLOR_STATUS_WARNING = "var(--color-status-warning)"
const COLOR_STATUS_INFO    = "var(--color-status-info)"
const COLOR_STATUS_DANGER  = "var(--color-status-danger)"
const COLOR_STATUS_SUCCESS = "var(--color-status-success)"
const COLOR_GRAY_500       = "var(--color-gray-500)"

const hasStageStatus = (r: ActivationRecord, target: StageStatus) =>
  STAGE_KEYS.some((k) => r[k] === target)

const STATUS_FILTER_SECTION: FilterSection = {
  id: "status",
  title: "Status",
  options: [
    { value: "Pending",     label: "Pending start",    color: COLOR_STATUS_WARNING },
    { value: "In progress", label: "In progress",      color: COLOR_STATUS_INFO    },
    { value: "Ready",       label: "Activation ready", color: COLOR_STATUS_SUCCESS },
    { value: "Flagged",     label: "Flagged",          color: COLOR_STATUS_DANGER  },
  ],
}

function StageCell({ status }: { status: StageStatus }) {
  return (
    <StatusBadge variant={stageStatusVariantMap[status]} withDot size="sm">
      {status}
    </StatusBadge>
  )
}

function ReadyCell({ status }: { status: ReadyStatus }) {
  if (!status) return <span className="text-table-text font-medium" style={{ fontSize: "13px" }}>—</span>
  return (
    <StatusBadge variant={status === "Ready" ? "info" : "danger"} withDot size="sm">
      {status}
    </StatusBadge>
  )
}


function makeColumns(
  onUpdate: (r: ActivationRecord) => void,
  canUpdate: boolean
): ColumnDef<ActivationRecord>[] {
  const cols: ColumnDef<ActivationRecord>[] = [
    {
      accessorKey: "chassis",
      header: "Chassis",
      cell: ({ row }) => (
        <span className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
          {row.original.chassis}
        </span>
      ),
    },
    {
      accessorKey: "subBatch",
      header: "Sub-Batch",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>{row.original.subBatch}</span>
      ),
    },
    {
      accessorKey: "bikeAssembly",
      header: "Bike Assembly",
      cell: ({ row }) => <StageCell status={row.original.bikeAssembly} />,
    },
    {
      accessorKey: "qualityControl",
      header: "Quality Control",
      cell: ({ row }) => <StageCell status={row.original.qualityControl} />,
    },
    {
      accessorKey: "paintingBranding",
      header: "Painting & Branding",
      cell: ({ row }) => <StageCell status={row.original.paintingBranding} />,
    },
    {
      accessorKey: "licensingReg",
      header: "Licensing & Reg.",
      cell: ({ row }) => <StageCell status={row.original.licensingReg} />,
    },
    {
      accessorKey: "tracker",
      header: "Tracker",
      cell: ({ row }) => <StageCell status={row.original.tracker} />,
    },
    {
      accessorKey: "insurance",
      header: "Insurance",
      cell: ({ row }) => <StageCell status={row.original.insurance} />,
    },
    {
      accessorKey: "ready",
      header: "Ready",
      cell: ({ row }) => <ReadyCell status={row.original.ready} />,
    },
  ]

  if (canUpdate) {
    cols.push({
      id: "action",
      header: "",
      cell: ({ row }) =>
        row.original.ready === "Ready" ? (
          <span className="font-semibold text-status-success" style={{ fontSize: "13px" }}>Complete</span>
        ) : (
          <Button variant="outline" className="h-8 text-xs px-3" onClick={(e) => { e.stopPropagation(); onUpdate(row.original) }}>
            Update
          </Button>
        ),
    })
  } else {
    cols.push({
      id: "action",
      header: "",
      cell: ({ row }) =>
        row.original.ready === "Ready" ? (
          <span className="font-semibold text-status-success" style={{ fontSize: "13px" }}>Complete</span>
        ) : null,
    })
  }

  return cols
}

export default function ActivationReadinessPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen]   = useState(false)
  const [filters, setFilters]         = useState<GenericFilterState>({ subBatch: [], status: [] })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize]       = useState(25)

  const activeFilterCount = getActiveFilterCount(filters)

  const [showBulkModal, setShowBulkModal] = useState(false)

  const openBulk  = () => { setShowBulkModal(true) }

  const canUpdate = useCan("activationReadiness.update")
  const canBulkUpload = useCan("activationReadiness.bulkUpload")
  const [records, setRecords] = useState(mockActivationRecords)
  const scopedRecords = useCityScopedRecords(records, "location")

  const stats = useMemo(
    () => [
      { title: "Pending start",    value: scopedRecords.filter((r) => r.bikeAssembly === "pending").length,  indicatorColor: COLOR_STATUS_WARNING },
      { title: "In progress",      value: scopedRecords.filter((r) => hasStageStatus(r, "in-progress")).length, indicatorColor: COLOR_STATUS_INFO    },
      { title: "Activation ready", value: scopedRecords.filter((r) => r.ready === "Ready").length,           indicatorColor: COLOR_STATUS_SUCCESS },
      { title: "Flagged",          value: scopedRecords.filter((r) => r.ready === "Flagged").length,         indicatorColor: COLOR_STATUS_DANGER  },
      { title: "Remaining",        value: scopedRecords.filter((r) => r.ready !== "Ready").length,           indicatorColor: COLOR_GRAY_500       },
    ],
    [scopedRecords]
  )

  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        id: "subBatch",
        title: "Sub-Batch",
        defaultExpanded: true,
        options: [...new Set(scopedRecords.map((r) => r.subBatch))].map((b) => ({ value: b, label: b })),
      },
      STATUS_FILTER_SECTION,
    ],
    [scopedRecords]
  )

  const updateModal = useUpdateModal((updated) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    if (updated.ready === "Ready") {
      addPendingVehicleDocument({
        vehicleId: updated.chassis,
        location: updated.location,
      })
    }
  })
  const columns = useMemo(
    () => makeColumns(updateModal.open, canUpdate),
    [updateModal.open, canUpdate]
  )

  const filtered = useMemo(() =>
    scopedRecords.filter((r) => {
      if (filters.subBatch.length > 0 && !filters.subBatch.includes(r.subBatch)) return false
      if (filters.status.length > 0) {
        const match = filters.status.some((s) => {
          if (s === "Ready")       return r.ready === "Ready"
          if (s === "Flagged")     return r.ready === "Flagged"
          if (s === "In progress") return hasStageStatus(r, "in-progress")
          if (s === "Pending")     return r.bikeAssembly === "pending"
          return false
        })
        if (!match) return false
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!r.chassis.toLowerCase().includes(q) && !r.subBatch.toLowerCase().includes(q)) return false
      }
      return true
    }),
    [filters, searchQuery, scopedRecords]
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Activation" }, { label: "Activation Readiness" }]} />

      <PageHeader
        title="Activation Readiness Tracker"
        subtitle="Phase B — Vehicle Activation Readiness"
        className="shrink-0"
        action={
          canBulkUpload ? (
            <Button className="h-9 gap-2 text-sm" onClick={openBulk}>
              <img src="/images/bulk_update.svg" alt="" className="h-4 w-4 brightness-0 invert" />
              Bulk Activation Upload
            </Button>
          ) : undefined
        }
      />

      <div className="px-6 pb-4 shrink-0">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} indicatorColor={stat.indicatorColor} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pt-2">
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
                  onFiltersChange={(f) => { setFilters(f); setCurrentPage(1) }}
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
              placeholder="Search chassis or sub-batch number..."
              inputClassName="w-56"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filtered}
              onRowClick={updateModal.open}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / pageSize)}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="vehicles"
          />
        </div>
      </div>

      <BulkActivationUploadModal
        open={showBulkModal}
        onOpenChange={setShowBulkModal}
        records={scopedRecords}
        onApply={(next) => {
          const byId = new Map(next.map((r) => [r.id, r]))
          setRecords((prev) => prev.map((r) => byId.get(r.id) ?? r))
          next.forEach((record) => {
            if (STAGE_KEYS.every((key) => record[key] === "completed")) {
              addPendingVehicleDocument({
                vehicleId: record.chassis,
                location: record.location,
              })
            }
          })
        }}
      />

      <ActivationUpdateModal
        record={updateModal.record}
        draftStages={updateModal.draftStages}
        stageSla={updateModal.stageSla}
        openAccordions={updateModal.openAccordions}
        onClose={updateModal.close}
        onToggleAccordion={updateModal.toggleAccordion}
        onStartStage={updateModal.startStage}
        onMarkCompleted={updateModal.markCompleted}
      />
    </>
  )
}
