import { useState, useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, Eye } from "lucide-react"
import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  StatusTabs,
  GenericFilterPopover,
  getActiveFilterCount,
  TransferRequestSheet,
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
  mockMarkedTransfers,
  statusVariantMap,
  type MarkedTransferRecord,
} from "@/data/mockMarkedTransfers"
import {
  mockTimeOffApprovals,
  timeOffStatusVariantMap,
  leaveTypeVariantMap,
  type TimeOffApprovalRecord,
} from "@/data/mockTimeOffApprovals"

// ── Transfer columns ──

const transferColumns: ColumnDef<MarkedTransferRecord>[] = [
  {
    accessorKey: "championName",
    header: "Champion Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.championName}</p>
        <p className="text-xs text-muted-foreground">{row.original.championId}</p>
      </div>
    ),
  },
  {
    accessorKey: "contractEndDate",
    header: "Contract End Date",
    cell: ({ row }) => (
      <span className="text-table-text text-sm">{row.original.contractEndDate}</span>
    ),
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.vehicle.type}</p>
        <p className="text-xs text-muted-foreground">{row.original.vehicle.plateNumber}</p>
      </div>
    ),
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
    cell: ({ row }) => (
      <span className="text-table-text text-sm">{row.original.requestDate}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status]} size="sm">
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => (
      <span className="text-table-text text-sm">
        {row.original.status === "Approved" && row.original.approvedBy
          ? row.original.approvedBy
          : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>
    ),
  },
]

// ── Time-off columns ──

const timeOffColumns: ColumnDef<TimeOffApprovalRecord>[] = [
  {
    accessorKey: "championName",
    header: "Champion Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.championName}</p>
        <p className="text-xs text-muted-foreground">{row.original.championId}</p>
      </div>
    ),
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
    cell: ({ row }) => (
      <StatusBadge variant={leaveTypeVariantMap[row.original.leaveType]} size="sm">
        {row.original.leaveType}
      </StatusBadge>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-table-text text-sm">
        {row.original.startDate} — {row.original.endDate}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={timeOffStatusVariantMap[row.original.status]} size="sm">
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => (
      <span className="text-table-text text-sm">
        {row.original.status === "Approved" ? row.original.approvedBy : "—"}
      </span>
    ),
  },
]

// ── Filter sections ──

const transferFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Pending", label: "Pending", color: "var(--color-status-warning)" },
      { value: "Approved", label: "Approved", color: "var(--color-status-success)" },
      { value: "Rejected", label: "Rejected", color: "var(--color-status-danger)" },
    ],
  },
]

const timeOffFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    defaultExpanded: true,
    options: [
      { value: "Approved", label: "Approved", color: "var(--color-status-success)" },
      { value: "Pending", label: "Pending", color: "var(--color-status-warning)" },
      { value: "Declined", label: "Declined", color: "var(--color-status-danger)" },
    ],
  },
  {
    id: "leaveType",
    title: "Leave Type",
    options: [
      { value: "Annual", label: "Annual", color: "var(--color-status-info)" },
      { value: "Emergency", label: "Emergency", color: "var(--color-status-danger)" },
      { value: "Sick", label: "Sick", color: "var(--color-status-warning)" },
    ],
  },
]

// ── Page ──

export default function ApprovalsPage() {
  // Transfer state
  const [transferData, setTransferData] = useState(mockMarkedTransfers)
  const [transferPage, setTransferPage] = useState(1)
  const [transferPageSize, setTransferPageSize] = useState(10)
  const [transferFilters, setTransferFilters] = useState<GenericFilterState>({})
  const [transferSearch, setTransferSearch] = useState("")
  const [transferSearchOpen, setTransferSearchOpen] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<MarkedTransferRecord | null>(null)

  // Time-off state
  const [timeOffPage, setTimeOffPage] = useState(1)
  const [timeOffPageSize, setTimeOffPageSize] = useState(10)
  const [timeOffFilters, setTimeOffFilters] = useState<GenericFilterState>({})
  const [timeOffSearch, setTimeOffSearch] = useState("")
  const [timeOffSearchOpen, setTimeOffSearchOpen] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState("transfers")

  const transferFilterCount = getActiveFilterCount(transferFilters)
  const timeOffFilterCount = getActiveFilterCount(timeOffFilters)

  // ── Transfer filtering ──

  const filteredTransfers = useMemo(() => {
    return transferData.filter((record) => {
      const statuses = transferFilters.status || []
      if (statuses.length > 0 && !statuses.includes(record.status)) return false

      if (transferSearch.trim()) {
        const q = transferSearch.trim().toLowerCase()
        if (
          !record.championName.toLowerCase().includes(q) &&
          !record.championId.toLowerCase().includes(q) &&
          !record.vehicle.plateNumber.toLowerCase().includes(q)
        ) return false
      }

      return true
    })
  }, [transferData, transferFilters, transferSearch])

  const paginatedTransfers = useMemo(() => {
    const start = (transferPage - 1) * transferPageSize
    return filteredTransfers.slice(start, start + transferPageSize)
  }, [filteredTransfers, transferPage, transferPageSize])

  // ── Time-off filtering ──

  const filteredTimeOffs = useMemo(() => {
    return mockTimeOffApprovals.filter((record) => {
      const statuses = timeOffFilters.status || []
      if (statuses.length > 0 && !statuses.includes(record.status)) return false

      const types = timeOffFilters.leaveType || []
      if (types.length > 0 && !types.includes(record.leaveType)) return false

      if (timeOffSearch.trim()) {
        const q = timeOffSearch.trim().toLowerCase()
        if (
          !record.championName.toLowerCase().includes(q) &&
          !record.championId.toLowerCase().includes(q)
        ) return false
      }

      return true
    })
  }, [timeOffFilters, timeOffSearch])

  const paginatedTimeOffs = useMemo(() => {
    const start = (timeOffPage - 1) * timeOffPageSize
    return filteredTimeOffs.slice(start, start + timeOffPageSize)
  }, [filteredTimeOffs, timeOffPage, timeOffPageSize])

  // ── Stat counts ──

  const pendingTransfers = transferData.filter((r) => r.status === "Pending").length
  const pendingTimeOffs = mockTimeOffApprovals.filter((r) => r.status === "Pending").length
  const totalPending = pendingTransfers + pendingTimeOffs

  // ── Handlers ──

  const handleTransferStatusChange = (
    id: string,
    status: MarkedTransferRecord["status"],
    rejectionReason?: string
  ) => {
    setTransferData((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(rejectionReason ? { rejectionReason } : {}),
              ...(status === "Approved" ? { approvedBy: "Desmond Nsogbuwa" } : {}),
            }
          : r
      )
    )
  }

  const tabs = [
    { id: "transfers", label: "Ownership Transfer", count: filteredTransfers.length },
    { id: "timeoffs", label: "Time Offs", count: filteredTimeOffs.length },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Approvals" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Approvals"
          subtitle="Review and process pending approval requests"
          className="px-0"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCard
            title="Total Pending"
            value={totalPending}
            indicatorColor="var(--color-status-warning)"
          />
          <StatCard
            title="Pending Transfers"
            value={pendingTransfers}
            indicatorColor="var(--color-status-info)"
          />
          <StatCard
            title="Pending Time Offs"
            value={pendingTimeOffs}
            indicatorColor="var(--color-brand-primary)"
          />
        </div>

        {/* Status Tabs */}
        <StatusTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
          }}
          className="px-0 mb-4"
        />

        {/* Ownership Transfer Tab */}
        {activeTab === "transfers" && (
          <div className="flex flex-col">
            <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {transferFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {transferFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={transferFilterSections}
                      filters={transferFilters}
                      onFiltersChange={(f) => {
                        setTransferFilters(f)
                        setTransferPage(1)
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {transferSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={transferSearch}
                      onChange={(e) => {
                        setTransferSearch(e.target.value)
                        setTransferPage(1)
                      }}
                      placeholder="Search name, ID, or plate..."
                      className="h-9 w-56"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setTransferSearchOpen(false)
                          setTransferSearch("")
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setTransferSearchOpen(false)
                        setTransferSearch("")
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setTransferSearchOpen(true)}>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <DataTable
                columns={transferColumns}
                data={paginatedTransfers}
                onRowClick={(row) => setSelectedTransfer(row)}
              />
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={transferPage}
                totalPages={Math.max(1, Math.ceil(filteredTransfers.length / transferPageSize))}
                totalItems={filteredTransfers.length}
                pageSize={transferPageSize}
                onPageChange={setTransferPage}
                onPageSizeChange={(size) => {
                  setTransferPageSize(size)
                  setTransferPage(1)
                }}
                itemLabel="transfers"
              />
            </div>
          </div>
        )}

        {/* Time Offs Tab */}
        {activeTab === "timeoffs" && (
          <div className="flex flex-col">
            <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {timeOffFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {timeOffFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={timeOffFilterSections}
                      filters={timeOffFilters}
                      onFiltersChange={(f) => {
                        setTimeOffFilters(f)
                        setTimeOffPage(1)
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {timeOffSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={timeOffSearch}
                      onChange={(e) => {
                        setTimeOffSearch(e.target.value)
                        setTimeOffPage(1)
                      }}
                      placeholder="Search name or ID..."
                      className="h-9 w-56"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setTimeOffSearchOpen(false)
                          setTimeOffSearch("")
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setTimeOffSearchOpen(false)
                        setTimeOffSearch("")
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setTimeOffSearchOpen(true)}>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>

              <DataTable
                columns={timeOffColumns}
                data={paginatedTimeOffs}
              />
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={timeOffPage}
                totalPages={Math.max(1, Math.ceil(filteredTimeOffs.length / timeOffPageSize))}
                totalItems={filteredTimeOffs.length}
                pageSize={timeOffPageSize}
                onPageChange={setTimeOffPage}
                onPageSizeChange={(size) => {
                  setTimeOffPageSize(size)
                  setTimeOffPage(1)
                }}
                itemLabel="records"
              />
            </div>
          </div>
        )}
      </div>

      <TransferRequestSheet
        transfer={selectedTransfer}
        isOpen={selectedTransfer !== null}
        onClose={() => setSelectedTransfer(null)}
        onStatusChange={handleTransferStatusChange}
      />
    </>
  )
}
