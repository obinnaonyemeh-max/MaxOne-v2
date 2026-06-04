import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  Modal,
  LoaderModal,
  DocUpload,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUpdateModal } from "./activation-readiness/useUpdateModal"
import { ActivationUpdateModal } from "./activation-readiness/ActivationUpdateModal"
import { STAGE_KEYS } from "./activation-readiness/stages"

import {
  mockActivationRecords,
  stageStatusVariantMap,
  uniqueBatches,
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

const stats = [
  { title: "Pending start",    value: mockActivationRecords.filter((r) => r.bikeAssembly === "pending").length,  indicatorColor: COLOR_STATUS_WARNING },
  { title: "In progress",      value: mockActivationRecords.filter((r) => hasStageStatus(r, "in-progress")).length, indicatorColor: COLOR_STATUS_INFO    },
  { title: "Activation ready", value: mockActivationRecords.filter((r) => r.ready === "Ready").length,           indicatorColor: COLOR_STATUS_SUCCESS },
  { title: "Flagged",          value: mockActivationRecords.filter((r) => r.ready === "Flagged").length,         indicatorColor: COLOR_STATUS_DANGER  },
  { title: "Remaining",        value: mockActivationRecords.filter((r) => r.ready !== "Ready").length,           indicatorColor: COLOR_GRAY_500       },
]

const filterSections: FilterSection[] = [
  {
    id: "batch",
    title: "Batch",
    defaultExpanded: true,
    options: uniqueBatches.map((b) => ({ value: b, label: b })),
  },
  {
    id: "status",
    title: "Status",
    options: [
      { value: "Pending",     label: "Pending start",    color: COLOR_STATUS_WARNING },
      { value: "In progress", label: "In progress",      color: COLOR_STATUS_INFO    },
      { value: "Ready",       label: "Activation ready", color: COLOR_STATUS_SUCCESS },
      { value: "Flagged",     label: "Flagged",          color: COLOR_STATUS_DANGER  },
    ],
  },
]

const BULK_STATS = { totalRows: 11, validEntries: 11, rowsWithErrors: 0 }

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


function makeColumns(onUpdate: (r: ActivationRecord) => void): ColumnDef<ActivationRecord>[] {
  return [
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
      accessorKey: "batch",
      header: "Batch",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>{row.original.batch}</span>
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
    {
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
    },
  ]
}

type BulkStep = "upload" | "validating" | "validated" | "importing" | "imported"

export default function ActivationReadinessPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen]   = useState(false)
  const [filters, setFilters]         = useState<GenericFilterState>({ batch: [], status: [] })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize]       = useState(25)

  const activeFilterCount = getActiveFilterCount(filters)

  const [bulkStep, setBulkStep]     = useState<BulkStep>("upload")
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkFile, setBulkFile]     = useState<File | null>(null)

  const openBulk  = () => { setBulkStep("upload"); setBulkFile(null); setShowBulkModal(true) }
  const closeBulk = () => { setShowBulkModal(false); setBulkStep("upload"); setBulkFile(null) }

  const updateModal = useUpdateModal()
  const columns = useMemo(() => makeColumns(updateModal.open), [])

  const filtered = useMemo(() =>
    mockActivationRecords.filter((r) => {
      if (filters.batch.length > 0 && !filters.batch.includes(r.batch)) return false
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
        if (!r.chassis.toLowerCase().includes(q) && !r.batch.toLowerCase().includes(q)) return false
      }
      return true
    }),
    [filters, searchQuery]
  )

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Activation" }, { label: "Activation Readiness" }]} />

      <div className="flex items-start justify-between px-6 pt-6 pb-2 shrink-0">
        <PageHeader
          title="Activation Readiness Tracker"
          subtitle="Phase B — Vehicle Activation Readiness"
          className="p-0"
        />
        <div className="pt-6">
          <Button className="h-9 gap-2 text-sm" onClick={openBulk}>
            <img src="/images/bulk_update.svg" alt="" className="h-4 w-4 brightness-0 invert" />
            Bulk Activation Upload
          </Button>
        </div>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <div className="grid grid-cols-5 gap-2">
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

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  placeholder="Search chassis or batch number..."
                  className="h-9 w-56"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery("") } }}
                />
                <Button variant="ghost" size="icon" className="h-9 w-9"
                  onClick={() => { setSearchOpen(false); setSearchQuery("") }}>×</Button>
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

      {/* Bulk Activation Upload — Step 1: Upload */}
      <Modal
        open={showBulkModal && bulkStep === "upload"}
        onOpenChange={closeBulk}
        title="Bulk Activation Upload"
        subtitle="Update multiple vehicle activation statuses at once"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setBulkStep("validating")
            setTimeout(() => setBulkStep("validated"), 2000)
          },
          disabled: !bulkFile,
        }}
        secondaryAction={{ label: "Cancel", onClick: closeBulk }}
      >
        <div className="flex gap-8">
          <div className="w-[280px] shrink-0">
            <DocUpload
              uploadedFile={bulkFile}
              onFileSelect={setBulkFile}
              accept=".xlsx,.xls,.csv"
              maxSizeLabel=""
              label="Drag and drop filled template sheet"
              icon={<img src="/images/xls.svg" alt="XLS" className="mx-auto h-12 w-auto mb-2" />}
              minHeightClass="min-h-[280px]"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
              Upload activation data for multiple vehicles
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
              Download the template, fill in the activation stage details for each vehicle, and upload the completed file to apply updates across all records.
            </p>
            <a href="#" className="mt-4 inline-block underline font-medium text-status-warning" style={{ fontSize: "14px" }}
              onClick={(e) => e.preventDefault()}>
              Download template sheet
            </a>
            <div className="pt-2">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Step 2: Validating */}
      <LoaderModal open={showBulkModal && bulkStep === "validating"} message="Validating file..." />

      {/* Step 3: Validated */}
      <Modal
        open={showBulkModal && bulkStep === "validated"}
        onOpenChange={closeBulk}
        title="Bulk Activation Upload"
        subtitle="Update multiple vehicle activation statuses at once"
        showBackButton
        onBack={() => setBulkStep("upload")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: () => {
            setBulkStep("importing")
            setTimeout(() => setBulkStep("imported"), 2000)
          },
          icon: true,
        }}
        secondaryAction={{ label: "Cancel", onClick: closeBulk }}
      >
        <div className="flex flex-col items-center py-6">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Activation data ready to import
          </h3>
          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>
            All entries have been successfully validated. You can proceed with importing the activation updates into the system.
          </p>
          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>{BULK_STATS.totalRows}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Valid Entries</p>
                <p className="mt-2 font-semibold text-status-success" style={{ fontSize: "28px" }}>{BULK_STATS.validEntries}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: "13px" }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: "28px" }}>{BULK_STATS.rowsWithErrors}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Step 4: Importing */}
      <LoaderModal open={showBulkModal && bulkStep === "importing"} message="Importing activation data..." />

      {/* Step 5: Imported */}
      <Modal
        open={showBulkModal && bulkStep === "imported"}
        onOpenChange={closeBulk}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
            Import successful!
          </p>
          <button
            onClick={closeBulk}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>

      <ActivationUpdateModal
        record={updateModal.record}
        draftStages={updateModal.draftStages}
        openAccordions={updateModal.openAccordions}
        onClose={updateModal.close}
        onToggleAccordion={updateModal.toggleAccordion}
        onStageStatusChange={updateModal.setStageStatus}
        onMarkCompleted={updateModal.markCompleted}
      />
    </>
  )
}
