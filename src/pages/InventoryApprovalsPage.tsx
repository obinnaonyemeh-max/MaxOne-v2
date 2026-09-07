import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatusTabs,
  StatusBadge,
  GenericFilterPopover,
  getActiveFilterCount,
  ExpandableSearch,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CITY_HUB_OPTIONS } from "@/data/cities"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import {
  acceptInventoryApproval,
  rejectInventoryApproval,
  useInventoryApprovalHistory,
  usePendingInventoryApprovals,
} from "@/data/inventoryApprovalStore"
import type {
  InventoryApprovalHistoryRow,
  InventoryApprovalRequest,
} from "@/data/mockInventoryApprovals"

const pendingFilterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_HUB_OPTIONS,
  },
  {
    id: "type",
    title: "Type",
    defaultExpanded: true,
    options: [
      { value: "Addition", label: "Addition" },
      { value: "Depletion", label: "Depletion" },
    ],
  },
]

const historyFilterSections: FilterSection[] = [
  ...pendingFilterSections,
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Approved", label: "Approved" },
      { value: "Rejected", label: "Rejected" },
    ],
  },
]

const defaultPendingFilters: GenericFilterState = {
  location: [],
  type: [],
}

const defaultHistoryFilters: GenericFilterState = {
  location: [],
  type: [],
  status: [],
}

function TypeCell({ type }: { type: InventoryApprovalRequest["type"] }) {
  return (
    <StatusBadge variant={type === "Addition" ? "success" : "warning"} size="sm">
      {type}
    </StatusBadge>
  )
}

function TextCell({ value, primary = false }: { value: string | number; primary?: boolean }) {
  return (
    <span
      className={primary ? "font-medium text-table-text-primary" : "font-medium text-table-text"}
      style={{ fontSize: "14px" }}
    >
      {value}
    </span>
  )
}

function getSharedColumns<T extends InventoryApprovalRequest>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <TextCell value={row.original.date} />,
    },
    {
      accessorKey: "skuId",
      header: "SKU ID",
      cell: ({ row }) => <TextCell value={row.original.skuId} primary />,
    },
    {
      accessorKey: "partName",
      header: "Part name",
      cell: ({ row }) => <TextCell value={row.original.partName} />,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <TypeCell type={row.original.type} />,
    },
    {
      accessorKey: "qty",
      header: "Qty",
      cell: ({ row }) => <TextCell value={row.original.qty} />,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <TextCell value={row.original.location} />,
    },
    {
      accessorKey: "requestedBy",
      header: "Requested by",
      cell: ({ row }) => <TextCell value={row.original.requestedBy} />,
    },
  ]
}

function getPendingColumns(
  onAccept: (row: InventoryApprovalRequest) => void,
  onReject: (row: InventoryApprovalRequest) => void,
  canDecide: boolean
): ColumnDef<InventoryApprovalRequest>[] {
  const columns: ColumnDef<InventoryApprovalRequest>[] = [
    ...getSharedColumns<InventoryApprovalRequest>(),
  ]
  if (!canDecide) return columns
  columns.push({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            className="h-8 px-3 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={(e) => {
              e.stopPropagation()
              onAccept(row.original)
            }}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="h-8 px-3 border-status-danger text-status-danger hover:bg-status-danger/10"
            onClick={(e) => {
              e.stopPropagation()
              onReject(row.original)
            }}
          >
            Reject
          </Button>
        </div>
      ),
    })
  return columns
}

const historyColumns: ColumnDef<InventoryApprovalHistoryRow>[] = [
  ...getSharedColumns<InventoryApprovalHistoryRow>(),
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={row.original.status === "Approved" ? "success" : "danger"} size="sm">
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "reviewedBy",
    header: "Reviewed by",
    cell: ({ row }) => <TextCell value={row.original.reviewedBy} />,
  },
  {
    accessorKey: "reviewedDate",
    header: "Reviewed date",
    cell: ({ row }) => <TextCell value={row.original.reviewedDate} />,
  },
  {
    id: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <TextCell value={row.original.status === "Rejected" && row.original.reason ? row.original.reason : "—"} />
    ),
  },
]

export default function InventoryApprovalsPage() {
  const pending = useCityScopedRecords(usePendingInventoryApprovals(), "location")
  const history = useCityScopedRecords(useInventoryApprovalHistory(), "location")
  const canDecide = useCan("inventory.approvals.decide")

  const [activeTab, setActiveTab] = useState("pending")

  const [pendingPage, setPendingPage] = useState(1)
  const [pendingPageSize, setPendingPageSize] = useState(25)
  const [pendingFilters, setPendingFilters] = useState<GenericFilterState>(defaultPendingFilters)
  const [pendingSearch, setPendingSearch] = useState("")
  const [pendingSearchOpen, setPendingSearchOpen] = useState(false)

  const [historyPage, setHistoryPage] = useState(1)
  const [historyPageSize, setHistoryPageSize] = useState(25)
  const [historyFilters, setHistoryFilters] = useState<GenericFilterState>(defaultHistoryFilters)
  const [historySearch, setHistorySearch] = useState("")
  const [historySearchOpen, setHistorySearchOpen] = useState(false)

  const [rejecting, setRejecting] = useState<InventoryApprovalRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const pendingFilterCount = getActiveFilterCount(pendingFilters)
  const historyFilterCount = getActiveFilterCount(historyFilters)

  const filteredPending = useMemo(() => {
    let result = pending

    if (pendingFilters.location?.length) {
      result = result.filter((row) => pendingFilters.location!.includes(row.location))
    }

    if (pendingFilters.type?.length) {
      result = result.filter((row) => pendingFilters.type!.includes(row.type))
    }

    if (pendingSearch.trim()) {
      const query = pendingSearch.toLowerCase()
      result = result.filter(
        (row) =>
          row.skuId.toLowerCase().includes(query) ||
          row.partName.toLowerCase().includes(query)
      )
    }

    return result
  }, [pending, pendingFilters, pendingSearch])

  const filteredHistory = useMemo(() => {
    let result = history

    if (historyFilters.location?.length) {
      result = result.filter((row) => historyFilters.location!.includes(row.location))
    }

    if (historyFilters.type?.length) {
      result = result.filter((row) => historyFilters.type!.includes(row.type))
    }

    if (historyFilters.status?.length) {
      result = result.filter((row) => historyFilters.status!.includes(row.status))
    }

    if (historySearch.trim()) {
      const query = historySearch.toLowerCase()
      result = result.filter(
        (row) =>
          row.skuId.toLowerCase().includes(query) ||
          row.partName.toLowerCase().includes(query)
      )
    }

    return result
  }, [history, historyFilters, historySearch])

  const paginatedPending = useMemo(() => {
    const start = (pendingPage - 1) * pendingPageSize
    return filteredPending.slice(start, start + pendingPageSize)
  }, [filteredPending, pendingPage, pendingPageSize])

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * historyPageSize
    return filteredHistory.slice(start, start + historyPageSize)
  }, [filteredHistory, historyPage, historyPageSize])

  const handleAccept = (row: InventoryApprovalRequest) => {
    const result = acceptInventoryApproval(row.id)
    if (!result) return
    toast.success(`${row.skuId} ${row.type.toLowerCase()} approved`)
  }

  const handleRejectConfirm = () => {
    if (!rejecting || !rejectionReason.trim()) return
    const result = rejectInventoryApproval(rejecting.id, rejectionReason)
    if (!result) return
    toast.success(`${rejecting.skuId} request rejected`)
    setRejecting(null)
    setRejectionReason("")
  }

  const pendingColumns = useMemo(
    () =>
      getPendingColumns(
        handleAccept,
        (row) => {
          setRejectionReason("")
          setRejecting(row)
        },
        canDecide
      ),
    [canDecide]
  )

  const isPending = activeTab === "pending"
  const filterCount = isPending ? pendingFilterCount : historyFilterCount
  const filterSections = isPending ? pendingFilterSections : historyFilterSections
  const filters = isPending ? pendingFilters : historyFilters
  const searchOpen = isPending ? pendingSearchOpen : historySearchOpen
  const searchValue = isPending ? pendingSearch : historySearch

  const tabs = [
    { id: "pending", label: "Pending Approvals", count: filteredPending.length },
    { id: "history", label: "Approval History", count: filteredHistory.length },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Lifecycle" },
          { label: "Inventory" },
          { label: "Approvals" },
        ]}
      />
      <PageHeader
        title="Approvals"
        subtitle="Review inventory requests waiting for approval"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <StatusTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="px-0 mb-4 shrink-0"
        />

        <div className="mt-0 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center gap-2 px-2 py-2 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-sm">Filters</span>
                  {filterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                      {filterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <GenericFilterPopover
                  sections={filterSections}
                  filters={filters}
                  onFiltersChange={(next) => {
                    if (isPending) {
                      setPendingFilters(next)
                      setPendingPage(1)
                    } else {
                      setHistoryFilters(next)
                      setHistoryPage(1)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={isPending ? setPendingSearchOpen : setHistorySearchOpen}
              value={searchValue}
              onValueChange={(value) => {
                if (isPending) {
                  setPendingSearch(value)
                  setPendingPage(1)
                } else {
                  setHistorySearch(value)
                  setHistoryPage(1)
                }
              }}
              placeholder="Search SKU or part name..."
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isPending ? (
              <DataTable
                columns={pendingColumns}
                data={paginatedPending}
                emptyMessage="No pending approvals"
              />
            ) : (
              <DataTable
                columns={historyColumns}
                data={paginatedHistory}
                emptyMessage="No approval history"
              />
            )}
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          {isPending ? (
            <Pagination
              currentPage={pendingPage}
              totalPages={Math.max(1, Math.ceil(filteredPending.length / pendingPageSize))}
              totalItems={filteredPending.length}
              pageSize={pendingPageSize}
              onPageChange={setPendingPage}
              onPageSizeChange={setPendingPageSize}
              itemLabel="requests"
            />
          ) : (
            <Pagination
              currentPage={historyPage}
              totalPages={Math.max(1, Math.ceil(filteredHistory.length / historyPageSize))}
              totalItems={filteredHistory.length}
              pageSize={historyPageSize}
              onPageChange={setHistoryPage}
              onPageSizeChange={setHistoryPageSize}
              itemLabel="requests"
            />
          )}
        </div>
      </div>

      {canDecide && (
      <Dialog
        open={!!rejecting}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(null)
            setRejectionReason("")
          }
        }}
      >
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Reject stock request</DialogTitle>
            <DialogDescription>
              {rejecting ? `${rejecting.skuId} · ${rejecting.partName}` : undefined}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-sidebar-item-active leading-relaxed">
                This request will be rejected and will not change on-hand stock.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Rejection Reason <span className="text-status-danger">*</span>
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejecting this request..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="h-9"
              onClick={() => {
                setRejecting(null)
                setRejectionReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={!rejectionReason.trim()}
              onClick={handleRejectConfirm}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </>
  )
}
