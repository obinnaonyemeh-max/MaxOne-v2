import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, AlertTriangle, ChevronDown, ChevronUp, Plus } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  Toast,
  useToast,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
  mockVehicleDocuments,
  vehicleDocumentStats,
  complianceAlerts,
  docStatusVariantMap,
  type VehicleDocumentRecord,
  type DocumentStatus,
  type ChecklistDocument,
} from "@/data/mockVehicleDocuments"
import { DocumentChecklistModal } from "./vehicle-documents/DocumentChecklistModal"
import { UploadDocumentModal } from "./vehicle-documents/UploadDocumentModal"
import { UploadDocumentsForVehicleModal } from "./vehicle-documents/UploadDocumentsForVehicleModal"

const COLOR_STATUS_SUCCESS = "var(--color-status-success)"
const COLOR_STATUS_DANGER = "var(--color-status-danger)"
const COLOR_STATUS_WARNING = "var(--color-status-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"

const filterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Complete", label: "Complete", color: COLOR_STATUS_SUCCESS },
      { value: "Expiring Soon", label: "Expiring Soon", color: COLOR_STATUS_WARNING },
      { value: "Expired", label: "Expired", color: COLOR_STATUS_DANGER },
    ],
  },
  {
    id: "type",
    title: "Type",
    options: [
      { value: "2-Wheel", label: "2-Wheel" },
      { value: "3-Wheel", label: "3-Wheel" },
    ],
  },
]

const docColorClass: Record<DocumentStatus, string> = {
  valid: "bg-status-success",
  expiring: "bg-status-warning",
  expired: "bg-status-danger",
}

const statusLabel: Record<DocumentStatus, string> = {
  valid: "Valid",
  expiring: "Expiring Soon",
  expired: "Expired",
}

function DocumentsCell({
  docs,
  checklist,
}: {
  docs: DocumentStatus[]
  checklist: ChecklistDocument[]
}) {
  return (
    <div className="flex items-center gap-1">
      {docs.map((d, i) => {
        const item = checklist[i]
        const name = item?.name ?? `Document ${i + 1}`
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span
                className={`h-3 w-3 rounded-sm ${docColorClass[d]} cursor-pointer`}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="font-semibold">{name}</span>
              <span className="text-muted-foreground"> · {statusLabel[d]}</span>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function CompletionCell({ value }: { value: number }) {
  const color =
    value >= 100 ? "bg-status-success" : value >= 80 ? "bg-status-warning" : "bg-status-danger"
  const textColor =
    value >= 100 ? "text-status-success" : value >= 80 ? "text-status-warning" : "text-status-danger"
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className={`font-medium ${textColor}`} style={{ fontSize: "13px" }}>
        {value}%
      </span>
    </div>
  )
}

function makeColumns(onView: (r: VehicleDocumentRecord) => void): ColumnDef<VehicleDocumentRecord>[] {
  return [
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => (
      <span className="font-medium text-sidebar-item-active" style={{ fontSize: "13px" }}>
        {row.original.vehicleId}
      </span>
    ),
  },
  {
    accessorKey: "champion",
    header: "Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>
        {row.original.champion}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => (
      <DocumentsCell docs={row.original.documents} checklist={row.original.checklist} />
    ),
  },
  {
    accessorKey: "completion",
    header: "Completion",
    cell: ({ row }) => <CompletionCell value={row.original.completion} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={docStatusVariantMap[row.original.status]} withDot size="sm">
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "13px" }}>
        {row.original.lastUpdated}
      </span>
    ),
  },
  {
    id: "action",
    header: "",
    cell: ({ row }) => (
      <Button
        variant="outline"
        className="h-8 text-xs px-3"
        onClick={(e) => {
          e.stopPropagation()
          onView(row.original)
        }}
      >
        View Docs
      </Button>
    ),
  },
  ]
}

export default function VehicleDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filters, setFilters] = useState<GenericFilterState>({ status: [], type: [] })
  const [alertsExpanded, setAlertsExpanded] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<VehicleDocumentRecord | null>(null)
  const [replaceOpen, setReplaceOpen] = useState(false)
  const [replaceVehicleId, setReplaceVehicleId] = useState<string>("")
  const [replaceDefaults, setReplaceDefaults] = useState<{
    documentType?: string
    expiryDate?: Date
  }>({})

  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [bulkUploadVehicleId, setBulkUploadVehicleId] = useState<string | undefined>(undefined)

  const vehicleOptions = useMemo(
    () =>
      mockVehicleDocuments.map((r) => ({
        value: r.vehicleId,
        label: `${r.vehicleId} — ${r.champion}`,
      })),
    []
  )

  const openUpload = (vehicleId?: string) => {
    setBulkUploadVehicleId(vehicleId)
    setBulkUploadOpen(true)
  }

  const openReplace = (vehicleId: string, doc: ChecklistDocument) => {
    setReplaceVehicleId(vehicleId)
    const parsed = doc.expiry ? new Date(doc.expiry) : undefined
    setReplaceDefaults({
      documentType: doc.name,
      expiryDate: parsed && !isNaN(parsed.getTime()) ? parsed : undefined,
    })
    setReplaceOpen(true)
  }

  const columns = useMemo(() => makeColumns(setSelectedRecord), [])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const activeFilterCount = getActiveFilterCount(filters)
  const { message: toastMessage, variant: toastVariant, showToast } = useToast()

  const filtered = useMemo(
    () =>
      mockVehicleDocuments.filter((r) => {
        if (filters.status.length > 0 && !filters.status.includes(r.status)) return false
        if (filters.type.length > 0 && !filters.type.includes(r.type)) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          if (
            !r.vehicleId.toLowerCase().includes(q) &&
            !r.champion.toLowerCase().includes(q)
          )
            return false
        }
        return true
      }),
    [filters, searchQuery]
  )

  const s = vehicleDocumentStats

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Deployment" }, { label: "Vehicle Document" }]} />

      <div className="flex items-start justify-between px-6 pt-6 pb-2 shrink-0">
        <PageHeader
          title="Vehicle Documents"
          subtitle="Fleet compliance & document tracking"
          className="p-0"
        />
      </div>

      <div className="px-6 pb-4 shrink-0">
        <div className="rounded-lg border border-status-danger/20 bg-status-danger/[0.08] px-5 py-4 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-status-danger shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-sm text-status-danger">
                {complianceAlerts.length} urgent compliance alerts require action
              </p>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setAlertsExpanded((v) => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-status-danger hover:opacity-80 transition-opacity"
                >
                  {alertsExpanded ? (
                    <>
                      Hide <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Show <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
                {alertsExpanded && (
                  <button
                    type="button"
                    className="text-sm font-medium text-status-danger hover:opacity-80 transition-opacity"
                  >
                    View All Alerts
                  </button>
                )}
              </div>
            </div>
            {alertsExpanded && (
              <ul className="mt-2 space-y-1">
                {complianceAlerts.map((a) => (
                  <li key={a.vehicleId} className="text-sm">
                    <span className="font-medium text-foreground">{a.vehicleId}</span>
                    <span className="text-muted-foreground"> — {a.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            title="Documentation Coverage"
            value={`${s.coveragePct}%`}
            subtitle={`${s.coverageComplete} of ${s.coverageTotal} vehicles complete`}
            trend={{ value: s.coverageTrend, direction: "up" }}
            indicatorColor={COLOR_STATUS_SUCCESS}
          />
          <StatCard
            title="Expired Documents"
            value={s.expiredCount}
            subtitle={`Across ${s.expiredVehicles} vehicles · ${s.expiredFleetPct}% of fleet`}
            indicatorColor={COLOR_STATUS_DANGER}
          />
          <StatCard
            title="Expiring in 7 Days"
            value={s.expiringSoonCount}
            subtitle={`Documents due for renewal · ${s.expiringVehicles} vehicles affected`}
            indicatorColor={COLOR_STATUS_WARNING}
          />
          <StatCard
            title="Total Fleet Vehicles"
            value={s.totalFleet}
            subtitle={`Active · ${s.region} · 2-wheel & 3-wheel fleet`}
            indicatorColor={COLOR_STATUS_INFO}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pt-2">
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
                  onFiltersChange={(f) => {
                    setFilters(f)
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search vehicle or champion..."
                  className="h-9 w-56"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
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

            <div className="flex items-center gap-2">
              <Button
                className="h-9 gap-2 text-sm"
                onClick={() => openUpload()}
              >
                <Plus className="h-4 w-4" />
                Upload Doc
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DataTable columns={columns} data={filtered} onRowClick={setSelectedRecord} />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filtered.length / pageSize) || 1}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="vehicles"
          />
        </div>
      </div>

      <DocumentChecklistModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onUpload={() => {
          if (selectedRecord) openUpload(selectedRecord.vehicleId)
        }}
        onReplace={(doc) => {
          if (selectedRecord) openReplace(selectedRecord.vehicleId, doc)
        }}
      />

      <UploadDocumentsForVehicleModal
        open={bulkUploadOpen}
        vehicleOptions={vehicleOptions}
        defaultVehicleId={bulkUploadVehicleId}
        onClose={() => setBulkUploadOpen(false)}
        onSubmit={({ vehicleId, documents }) => {
          showToast(
            documents.length === 1
              ? `${documents[0].name} uploaded for ${vehicleId}`
              : `${documents.length} documents uploaded for ${vehicleId}`
          )
        }}
      />

      <UploadDocumentModal
        open={replaceOpen}
        vehicleId={replaceVehicleId}
        mode="replace"
        defaultDocumentType={replaceDefaults.documentType}
        defaultExpiryDate={replaceDefaults.expiryDate}
        onClose={() => setReplaceOpen(false)}
        onSubmit={({ documentType, vehicleId }) => {
          const label = documentType || "Document"
          showToast(`${label} replaced for ${vehicleId}`)
        }}
      />

      <Toast message={toastMessage} variant={toastVariant} />
    </>
  )
}
