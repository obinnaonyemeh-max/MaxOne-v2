import { useState, useMemo, useEffect, useCallback } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, FileEdit, X } from "lucide-react"
import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
  WelfareDetailSheet,
  type WelfareChampion,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CITY_FILTER_OPTIONS } from "@/data/cities"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// ── Types ──

type WelfareStatus = "Healthy" | "Needs Attention" | "At Risk" | "Critical"
type ChampionState = "Active" | "Inactive" | "On Leave" | "Suspended"

// ── Variant maps ──

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "refurb" | "neutral"

const welfareStatusVariantMap: Record<WelfareStatus, BadgeVariant> = {
  Healthy: "success",
  "Needs Attention": "warning",
  "At Risk": "danger",
  Critical: "info",
}

const championStateVariantMap: Record<ChampionState, BadgeVariant> = {
  Active: "success",
  Inactive: "neutral",
  "On Leave": "warning",
  Suspended: "danger",
}

// ── Mock data ──

const mockWelfareRecords: WelfareChampion[] = [
  {
    id: "1",
    name: "Adewale Ogunleye",
    championId: "CHP-001",
    avatarUrl: "/images/champvatar.png",
    location: "Lagos",
    vehicle: "4 Wheelers",
    welfareStatus: "Healthy",
    championState: "Active",
    lastContact: "8 Jun 2026",
    nextFollowUp: "9 Jun 2026",
    issuesLogged: 0,
    phoneNumber: "+234 801 234 5678",
  },
  {
    id: "2",
    name: "Chinedu Okafor",
    championId: "CHP-002",
    avatarUrl: "/images/champvatar.png",
    location: "Lagos",
    vehicle: "4 Wheelers",
    welfareStatus: "Needs Attention",
    championState: "Active",
    lastContact: "5 Jun 2026",
    nextFollowUp: "7 Jun 2026",
    issuesLogged: 2,
    phoneNumber: "+234 802 345 6789",
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    championId: "CHP-003",
    avatarUrl: "/images/champvatar.png",
    location: "Abeokuta",
    vehicle: "4 Wheelers",
    welfareStatus: "At Risk",
    championState: "Active",
    lastContact: "1 Jun 2026",
    nextFollowUp: "5 Jun 2026",
    issuesLogged: 4,
    phoneNumber: "+234 803 456 7890",
  },
  {
    id: "4",
    name: "Funke Adeyemi",
    championId: "CHP-004",
    avatarUrl: "/images/champvatar.png",
    location: "Osogbo",
    vehicle: "3 Wheelers",
    welfareStatus: "Critical",
    championState: "Suspended",
    lastContact: "28 May 2026",
    nextFollowUp: "3 Jun 2026",
    issuesLogged: 7,
    phoneNumber: "+234 804 567 8901",
    transferRejection: {
      date: "5 Jul 2026",
      ownershipType: "Outright Payment",
      rejectionReason: "Outstanding hire-purchase balance of ₦200,000 must be fully settled before outright ownership transfer can be processed.",
    },
  },
  {
    id: "5",
    name: "Gbenga Alabi",
    championId: "CHP-005",
    avatarUrl: "/images/champvatar.png",
    location: "Lagos",
    vehicle: "4 Wheelers",
    welfareStatus: "Healthy",
    championState: "Active",
    lastContact: "9 Jun 2026",
    nextFollowUp: "12 Jun 2026",
    issuesLogged: 0,
    phoneNumber: "+234 805 678 9012",
  },
  {
    id: "6",
    name: "Hassan Musa",
    championId: "CHP-006",
    avatarUrl: "/images/champvatar.png",
    location: "Ibadan",
    vehicle: "2 Wheelers",
    welfareStatus: "Needs Attention",
    championState: "On Leave",
    lastContact: "4 Jun 2026",
    nextFollowUp: "9 Jun 2026",
    issuesLogged: 1,
    phoneNumber: "+234 806 789 0123",
  },
  {
    id: "7",
    name: "Ibrahim Yusuf",
    championId: "CHP-007",
    avatarUrl: "/images/champvatar.png",
    location: "Sango Ota",
    vehicle: "3 Wheelers",
    welfareStatus: "At Risk",
    championState: "Inactive",
    lastContact: "30 May 2026",
    nextFollowUp: "4 Jun 2026",
    issuesLogged: 5,
    phoneNumber: "+234 807 890 1234",
    transferRejection: {
      date: "1 Jul 2026",
      ownershipType: "Outright Payment",
      rejectionReason: "Required documents (NIN verification, proof of final payment, and vehicle inspection report) were not provided. Please resubmit with complete documentation.",
    },
  },
  {
    id: "8",
    name: "Janet Eze",
    championId: "CHP-008",
    avatarUrl: "/images/champvatar.png",
    location: "Lagos",
    vehicle: "4 Wheelers",
    welfareStatus: "Healthy",
    championState: "Active",
    lastContact: "7 Jun 2026",
    nextFollowUp: "10 Jun 2026",
    issuesLogged: 0,
    phoneNumber: "+234 808 901 2345",
  },
  {
    id: "9",
    name: "Kalu Nnamdi",
    championId: "CHP-009",
    avatarUrl: "/images/champvatar.png",
    location: "Abeokuta",
    vehicle: "2 Wheelers",
    welfareStatus: "Critical",
    championState: "Active",
    lastContact: "25 May 2026",
    nextFollowUp: "2 Jun 2026",
    issuesLogged: 6,
    phoneNumber: "+234 809 012 3456",
  },
  {
    id: "10",
    name: "Lateef Bakare",
    championId: "CHP-010",
    avatarUrl: "/images/champvatar.png",
    location: "Lagos",
    vehicle: "4 Wheelers",
    welfareStatus: "Healthy",
    championState: "Active",
    lastContact: "8 Jun 2026",
    nextFollowUp: "11 Jun 2026",
    issuesLogged: 1,
    phoneNumber: "+234 810 123 4567",
  },
]

// ── Color constants ──

const COLOR_BLUE = "var(--color-status-info)"
const COLOR_GREEN = "var(--color-badge-active-text)"
const COLOR_AMBER = "var(--color-status-warning)"
const COLOR_RED = "var(--color-badge-inactive-text)"
const COLOR_PURPLE = "#8b5cf6"

// ── Summary stats ──

const totalAssigned = mockWelfareRecords.length
const contactedToday = mockWelfareRecords.filter(
  (r) => r.lastContact === "9 Jun 2026"
).length
const followUpsDue = mockWelfareRecords.filter((r) => {
  const d = new Date(r.nextFollowUp)
  return d <= new Date("2026-06-09")
}).length
const atRiskCount = mockWelfareRecords.filter(
  (r) => r.welfareStatus === "At Risk" || r.welfareStatus === "Critical"
).length
const overdueCheckIns = mockWelfareRecords.filter((r) => {
  const d = new Date(r.nextFollowUp)
  return d < new Date("2026-06-09")
}).length

const summaryStats = [
  { title: "Total Assigned Champions", value: String(totalAssigned), indicatorColor: COLOR_BLUE },
  { title: "Champions Contacted Today", value: String(contactedToday), indicatorColor: COLOR_GREEN },
  { title: "Follow-ups Due", value: String(followUpsDue), indicatorColor: COLOR_AMBER },
  { title: "At-Risk Champions", value: String(atRiskCount), indicatorColor: COLOR_RED },
  { title: "Overdue Check-Ins", value: String(overdueCheckIns), indicatorColor: COLOR_PURPLE },
]

// ── Follow-up queue buckets ──

const TODAY = new Date("2026-06-09")

function classifyFollowUp(dateStr: string): "overdue" | "today" | "upcoming" {
  const d = new Date(dateStr)
  if (d.toDateString() === TODAY.toDateString()) return "today"
  if (d < TODAY) return "overdue"
  return "upcoming"
}

const overdueQueue = mockWelfareRecords.filter(
  (r) => classifyFollowUp(r.nextFollowUp) === "overdue"
)
const todayQueue = mockWelfareRecords.filter(
  (r) => classifyFollowUp(r.nextFollowUp) === "today"
)
const upcomingQueue = mockWelfareRecords.filter(
  (r) => classifyFollowUp(r.nextFollowUp) === "upcoming"
)

// ── Table columns ──

function getColumns(onLogNote: (champion: WelfareChampion) => void): ColumnDef<WelfareChampion>[] {
  return [
    {
      accessorKey: "name",
      header: "Champion",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatarUrl}
            alt={row.original.name}
            className="h-8 w-8 rounded-full object-cover shrink-0"
          />
          <div>
            <span className="text-table-text-primary font-medium block" style={{ fontSize: "13px" }}>
              {row.original.name}
            </span>
            <span className="text-gray-400" style={{ fontSize: "12px" }}>
              {row.original.championId}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-table-text" style={{ fontSize: "13px" }}>
          {row.original.location}
        </span>
      ),
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => (
        <span className="text-table-text" style={{ fontSize: "13px" }}>
          {row.original.vehicle}
        </span>
      ),
    },
    {
      accessorKey: "welfareStatus",
      header: "Welfare Status",
      cell: ({ row }) => (
        <StatusBadge variant={welfareStatusVariantMap[row.original.welfareStatus]} size="sm">
          {row.original.welfareStatus}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "championState",
      header: "Champion State",
      cell: ({ row }) => (
        <StatusBadge variant={championStateVariantMap[row.original.championState]} size="sm">
          {row.original.championState}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "lastContact",
      header: "Last Contact",
      cell: ({ row }) => (
        <span className="text-table-text" style={{ fontSize: "13px" }}>
          {row.original.lastContact}
        </span>
      ),
    },
    {
      accessorKey: "nextFollowUp",
      header: "Next Follow-up",
      cell: ({ row }) => {
        const bucket = classifyFollowUp(row.original.nextFollowUp)
        const labelMap: Record<string, string> = {
          overdue: "Overdue",
          today: "Due Today",
          upcoming: "Upcoming",
        }
        const variantMap: Record<string, BadgeVariant> = {
          overdue: "danger",
          today: "warning",
          upcoming: "success",
        }
        return (
          <div className="flex items-center gap-2">
            <span className="text-table-text font-medium" style={{ fontSize: "13px" }}>
              {row.original.nextFollowUp}
            </span>
            <StatusBadge variant={variantMap[bucket]} size="sm">
              {labelMap[bucket]}
            </StatusBadge>
          </div>
        )
      },
    },
    {
      id: "escalationSource",
      header: "Escalation Source",
      cell: ({ row }) => (
        row.original.transferRejection ? (
          <StatusBadge variant="danger" size="sm">
            Transfer Rejected
          </StatusBadge>
        ) : (
          <span className="text-table-text" style={{ fontSize: "13px" }}>—</span>
        )
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="xs"
          className="h-7 gap-1.5 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onLogNote(row.original)
          }}
        >
          <FileEdit className="h-3 w-3" />
          Log Note
        </Button>
      ),
    },
  ]
}

// ── Filter sections ──

const welfareFilterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_FILTER_OPTIONS,
  },
  {
    id: "vehicle",
    title: "Vehicle Type",
    options: [
      { value: "2 Wheelers", label: "2 Wheelers" },
      { value: "3 Wheelers", label: "3 Wheelers" },
      { value: "4 Wheelers", label: "4 Wheelers" },
    ],
  },
  {
    id: "welfareStatus",
    title: "Welfare Status",
    options: [
      { value: "Healthy", label: "Healthy", color: "var(--color-badge-active-text)" },
      { value: "Needs Attention", label: "Needs Attention", color: "var(--color-status-warning)" },
      { value: "At Risk", label: "At Risk", color: "var(--color-badge-inactive-text)" },
      { value: "Critical", label: "Critical", color: "var(--color-status-info)" },
    ],
  },
  {
    id: "championState",
    title: "Champion State",
    options: [
      { value: "Active", label: "Active", color: "var(--color-badge-active-text)" },
      { value: "Inactive", label: "Inactive" },
      { value: "On Leave", label: "On Leave", color: "var(--color-status-warning)" },
      { value: "Suspended", label: "Suspended", color: "var(--color-badge-inactive-text)" },
    ],
  },
  {
    id: "nextFollowUp",
    title: "Next Follow-up",
    options: [
      { value: "overdue", label: "Overdue", color: "var(--color-badge-inactive-text)" },
      { value: "today", label: "Due Today", color: "var(--color-status-warning)" },
      { value: "upcoming", label: "Upcoming", color: "var(--color-badge-active-text)" },
    ],
  },
  {
    id: "escalationSource",
    title: "Escalation Source",
    options: [
      { value: "Transfer Rejected", label: "Transfer Rejected", color: "var(--color-badge-inactive-text)" },
      { value: "None", label: "None" },
    ],
  },
]

// ── Log Note form ──

interface LogNoteForm {
  channel: string
  interactionType: string
  summary: string
  issuesRaised: string
  actionTaken: string
  followUpRequired: boolean
  incidentStatus: string
}

const emptyLogNoteForm: LogNoteForm = {
  channel: "",
  interactionType: "",
  summary: "",
  issuesRaised: "",
  actionTaken: "",
  followUpRequired: false,
  incidentStatus: "",
}

// ── Follow-up queue column component ──

function FollowUpColumn({
  title,
  accent,
  items,
  onCardClick,
  onLogNote,
}: {
  title: string
  accent: string
  items: WelfareChampion[]
  onCardClick: (champion: WelfareChampion) => void
  onLogNote: (champion: WelfareChampion) => void
}) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-25 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        <h4 className="text-gray-950" style={{ fontSize: "14px", fontWeight: 500 }}>
          {title}
        </h4>
        <span
          className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5"
          style={{ fontSize: "11px", fontWeight: 600 }}
        >
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3 min-h-[120px]">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-6" style={{ fontSize: "13px" }}>
            No follow-ups
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white flex items-center gap-3 cursor-pointer transition-colors [border:1px_solid_#EAEAEA] hover:[border-color:#c4c4c4]"
              style={{
                borderRadius: "12px",
                padding: "15px 16px",
              }}
              onClick={() => onCardClick(item)}
            >
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="rounded-full object-cover shrink-0"
                style={{ width: "40px", height: "40px" }}
              />
              <div className="min-w-0 flex-1" style={{ lineHeight: 1.3 }}>
                <span
                  className="font-medium block truncate"
                  style={{
                    fontSize: "14px",
                    color: "#121314",
                    letterSpacing: "-0.14px",
                  }}
                >
                  {item.name}
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: "12px",
                    color: "#AAAAAA",
                    letterSpacing: "-0.12px",
                    marginTop: "1px",
                  }}
                >
                  Due: {item.nextFollowUp}
                </span>
              </div>
              <button
                type="button"
                className="shrink-0 font-medium cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "#F3F3F3",
                  border: "none",
                  borderRadius: "8px",
                  height: "38px",
                  padding: "0 14px",
                  fontSize: "12.5px",
                  color: "#121314",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onLogNote(item)
                }}
              >
                Log Note
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Page component ──

export default function WelfarePage() {
  const [period, setPeriod] = useState("30")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<GenericFilterState>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedChampion, setSelectedChampion] = useState<WelfareChampion | null>(null)
  const [logNoteChampion, setLogNoteChampion] = useState<WelfareChampion | null>(null)
  const [logNoteForm, setLogNoteForm] = useState<LogNoteForm>(emptyLogNoteForm)

  const activeFilterCount = getActiveFilterCount(filters)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredData = useMemo(() => {
    let data = mockWelfareRecords.filter((record) => {
      const locations = filters.location || []
      if (locations.length > 0 && !locations.includes(record.location)) return false

      const vehicles = filters.vehicle || []
      if (vehicles.length > 0 && !vehicles.includes(record.vehicle)) return false

      const statuses = filters.welfareStatus || []
      if (statuses.length > 0 && !statuses.includes(record.welfareStatus)) return false

      const states = filters.championState || []
      if (states.length > 0 && !states.includes(record.championState)) return false

      const followUpBuckets = filters.nextFollowUp || []
      if (followUpBuckets.length > 0 && !followUpBuckets.includes(classifyFollowUp(record.nextFollowUp))) return false

      const escalationSources = filters.escalationSource || []
      if (escalationSources.length > 0) {
        const hasRejection = !!record.transferRejection
        const matchesTransferRejected = escalationSources.includes("Transfer Rejected") && hasRejection
        const matchesNone = escalationSources.includes("None") && !hasRejection
        if (!matchesTransferRejected && !matchesNone) return false
      }

      return true
    })

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      data = data.filter(
        (record) =>
          record.name.toLowerCase().includes(q) ||
          record.championId.toLowerCase().includes(q)
      )
    }

    return data
  }, [filters, searchQuery])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const openLogNote = useCallback((champion: WelfareChampion) => {
    setLogNoteChampion(champion)
    setLogNoteForm(emptyLogNoteForm)
  }, [])

  const closeLogNote = useCallback(() => {
    setLogNoteChampion(null)
    setLogNoteForm(emptyLogNoteForm)
  }, [])

  const handleLogInteraction = useCallback(() => {
    closeLogNote()
  }, [closeLogNote])

  const columns = useMemo(() => getColumns(openLogNote), [openLogNote])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Welfare" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Welfare"
            subtitle="Track driver welfare programs"
            className="px-0"
          />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-5 gap-2">
          {summaryStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        {/* Follow-up Queue */}
        <div className="mt-6">
          <h3
            className="text-gray-950 mb-3"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Follow-up Queue
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <FollowUpColumn
              title="Overdue"
              accent={COLOR_RED}
              items={overdueQueue}
              onCardClick={setSelectedChampion}
              onLogNote={openLogNote}
            />
            <FollowUpColumn
              title="Due Today"
              accent={COLOR_AMBER}
              items={todayQueue}
              onCardClick={setSelectedChampion}
              onLogNote={openLogNote}
            />
            <FollowUpColumn
              title="Upcoming"
              accent={COLOR_GREEN}
              items={upcomingQueue}
              onCardClick={setSelectedChampion}
              onLogNote={openLogNote}
            />
          </div>
        </div>

        {/* Champions Directory Table */}
        <div className="mt-6 flex flex-col">
          <h3
            className="text-gray-950 mb-3 shrink-0"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Champions Directory
          </h3>
          <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={welfareFilterSections}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </PopoverContent>
                </Popover>

                {searchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or ID..."
                      className="h-9 w-48"
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
                      <span className="sr-only">Close search</span>
                      ×
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DataTable columns={columns} data={paginatedData} onRowClick={setSelectedChampion} />
            </div>
          </div>
          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / pageSize)}
              totalItems={filteredData.length}
              pageSize={pageSize}
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              itemLabel="champions"
            />
          </div>
        </div>
      </div>

      <WelfareDetailSheet
        champion={selectedChampion}
        isOpen={selectedChampion !== null}
        onClose={() => setSelectedChampion(null)}
        onLogNote={openLogNote}
      />

      {/* Log Note Modal */}
      <Dialog
        open={logNoteChampion !== null}
        onOpenChange={(open) => { if (!open) closeLogNote() }}
      >
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 relative">
            <DialogTitle>Log Welfare Interaction</DialogTitle>
            {logNoteChampion && (
              <DialogDescription>
                {logNoteChampion.name} &middot; {logNoteChampion.championId}
              </DialogDescription>
            )}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Channel + Interaction Type (side by side) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">
                  Channel of Communication
                </label>
                <Select
                  value={logNoteForm.channel}
                  onValueChange={(v) => setLogNoteForm((f) => ({ ...f, channel: v }))}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">
                  Interaction Type
                </label>
                <Select
                  value={logNoteForm.interactionType}
                  onValueChange={(v) => setLogNoteForm((f) => ({ ...f, interactionType: v }))}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Check-In">Routine Check-In</SelectItem>
                    <SelectItem value="Incident Follow-up">Incident Follow-up</SelectItem>
                    <SelectItem value="Welfare Complaint">Welfare Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conversation Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Conversation Summary
              </label>
              <Textarea
                value={logNoteForm.summary}
                onChange={(e) => setLogNoteForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="Summarize the conversation..."
                rows={3}
                className="text-sm"
              />
            </div>

            {/* Issues Raised */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Issues Raised
              </label>
              <Textarea
                value={logNoteForm.issuesRaised}
                onChange={(e) => setLogNoteForm((f) => ({ ...f, issuesRaised: e.target.value }))}
                placeholder="List any issues raised..."
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Action Taken */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">
                Action Taken
              </label>
              <Textarea
                value={logNoteForm.actionTaken}
                onChange={(e) => setLogNoteForm((f) => ({ ...f, actionTaken: e.target.value }))}
                placeholder="Describe action taken..."
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Incident Status + Follow-up Required (side by side) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">
                  Incident Status
                </label>
                <Select
                  value={logNoteForm.incidentStatus}
                  onValueChange={(v) => setLogNoteForm((f) => ({ ...f, incidentStatus: v }))}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">
                  Follow-up Required?
                </label>
                <div className="flex items-center h-9 px-3 rounded-md border border-gray-200">
                  <Switch
                    checked={logNoteForm.followUpRequired}
                    onCheckedChange={(checked) =>
                      setLogNoteForm((f) => ({ ...f, followUpRequired: checked }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-950">
                    {logNoteForm.followUpRequired ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={closeLogNote}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!logNoteForm.channel || !logNoteForm.interactionType || !logNoteForm.summary.trim()}
              onClick={handleLogInteraction}
            >
              Log Interaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
