import { useEffect, useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format, parse, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon, SlidersHorizontal, Wallet } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { MakePaymentFlow } from "./MakePaymentFlow"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  StatusBadge,
  StatusTabs,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type StatusTab,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  mockReferrals,
  mockAwaitingPayments,
  mockCompletedPayouts,
  type Referral,
  type AwaitingPayment,
  type CompletedPayout,
  type PaymentStatus,
} from "@/data/mockReferrals"

const paymentStatusVariant: Record<PaymentStatus, "info" | "success" | "warning" | "yard"> = {
  "Eligible for First Reward": "info", // blue
  "First Reward Paid": "success", // green
  "Eligible for Second Reward": "warning", // amber
  "Final Reward Paid": "yard", // purple
}

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const referralStats = [
  {
    title: "Total Referrals",
    value: (1428).toLocaleString(),
    subtitle: "All referral records",
    indicatorColor: "var(--color-brand-primary)",
  },
  {
    title: "Total Referrals Converted",
    value: (340).toLocaleString(),
    subtitle: "Onboarded as Champions",
    indicatorColor: "var(--color-status-success)",
  },
  {
    title: "Conversion Rate",
    value: "23.8%",
    subtitle: "Prospects → Champions",
    indicatorColor: "var(--color-status-info)",
  },
  {
    title: "Total Bonuses Paid",
    value: "₦1,700,000",
    subtitle: "Rewards disbursed",
    indicatorColor: "var(--color-status-warning)",
  },
]

const statusTabs: StatusTab[] = [
  { id: "referred", label: "Referred", count: mockReferrals.length },
  { id: "awaiting", label: "Awaiting Payment", count: mockAwaitingPayments.length },
  { id: "completed", label: "Completed Payouts", count: mockCompletedPayouts.length },
]

// ---- Filter sections (tab-specific) ----

const referredFilterSections: FilterSection[] = [
  {
    id: "profile",
    title: "Profile",
    defaultExpanded: true,
    options: [...new Set(mockReferrals.map((r) => r.referrerProfile))].map((p) => ({ value: p, label: p })),
  },
  {
    id: "location",
    title: "Location",
    options: [...new Set(mockReferrals.map((r) => r.location))].sort().map((l) => ({ value: l, label: l })),
  },
  {
    id: "status",
    title: "Status",
    options: [...new Set(mockReferrals.map((r) => r.status))].map((s) => ({ value: s, label: s })),
  },
]

const awaitingFilterSections: FilterSection[] = [
  {
    id: "profile",
    title: "Profile",
    defaultExpanded: true,
    options: [...new Set(mockAwaitingPayments.map((r) => r.referrerProfile))].map((p) => ({ value: p, label: p })),
  },
  {
    id: "location",
    title: "Location",
    options: [...new Set(mockAwaitingPayments.map((r) => r.location))].sort().map((l) => ({ value: l, label: l })),
  },
  {
    id: "status",
    title: "Status",
    options: [...new Set(mockAwaitingPayments.map((r) => r.status))].map((s) => ({ value: s, label: s })),
  },
]

// Completed Payouts has no Status filter (every row is "Final Payment")
const completedFilterSections: FilterSection[] = [
  {
    id: "profile",
    title: "Profile",
    defaultExpanded: true,
    options: [...new Set(mockCompletedPayouts.map((r) => r.referrerProfile))].map((p) => ({ value: p, label: p })),
  },
  {
    id: "location",
    title: "Location",
    options: [...new Set(mockCompletedPayouts.map((r) => r.location))].sort().map((l) => ({ value: l, label: l })),
  },
]

const defaultFilters: GenericFilterState = {
  profile: [],
  location: [],
  status: [],
}

// ---- Columns (tab-specific) ----

const referredColumns: ColumnDef<Referral>[] = [
  {
    accessorKey: "id",
    header: "Referral ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "prospectName",
    header: "Prospect Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-table-text-primary text-sm">{row.original.prospectName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.contact}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={paymentStatusVariant[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "referredBy",
    header: "Referred By",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.referredBy}</span>
    ),
  },
  {
    accessorKey: "referrerProfile",
    header: "Referrer Profile",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.referrerProfile}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "dateReferred",
    header: "Date Referred",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateReferred}</span>
    ),
  },
]

const awaitingColumns: ColumnDef<AwaitingPayment>[] = [
  {
    accessorKey: "referrer",
    header: "Referrer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.referrer}</span>
    ),
  },
  {
    accessorKey: "referrerProfile",
    header: "Referrer Profile",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.referrerProfile}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={paymentStatusVariant[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "dateReferred",
    header: "Date Referred",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateReferred}</span>
    ),
  },
]

const completedColumns: ColumnDef<CompletedPayout>[] = [
  {
    accessorKey: "referrer",
    header: "Referrer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.referrer}</span>
    ),
  },
  {
    accessorKey: "referrerProfile",
    header: "Referrer Profile",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.referrerProfile}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant="success" withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.location}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "dateReferred",
    header: "Date Referred",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.dateReferred}</span>
    ),
  },
]

export default function ReferralManagementPage() {
  const [activeTab, setActiveTab] = useState("referred")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [showMakePayment, setShowMakePayment] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  // Reset paging when the view or any filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, filters, dateRange, searchQuery])

  const dateRangeLabel = !dateRange?.from
    ? "Select date range"
    : !dateRange.to
      ? format(dateRange.from, "dd MMM yyyy")
      : `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`

  const dateBounds = useMemo(() => {
    if (!dateRange?.from) return null
    return { from: startOfDay(dateRange.from), to: endOfDay(dateRange.to ?? dateRange.from) }
  }, [dateRange])

  const withinDate = (dateReferred: string) => {
    if (!dateBounds) return true
    const d = parse(dateReferred, "dd MMM yyyy", new Date())
    return d >= dateBounds.from && d <= dateBounds.to
  }

  const filteredReferred = useMemo(() => {
    if (activeTab !== "referred") return []
    const q = searchQuery.toLowerCase()
    return mockReferrals.filter((r) => {
      if (filters.profile.length > 0 && !filters.profile.includes(r.referrerProfile)) return false
      if (filters.location.length > 0 && !filters.location.includes(r.location)) return false
      if (filters.status.length > 0 && !filters.status.includes(r.status)) return false
      if (!withinDate(r.dateReferred)) return false
      if (
        q &&
        !r.prospectName.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.location.toLowerCase().includes(q) &&
        !r.status.toLowerCase().includes(q) &&
        !r.referredBy.toLowerCase().includes(q)
      )
        return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters, dateBounds, searchQuery])

  const filteredAwaiting = useMemo(() => {
    if (activeTab !== "awaiting") return []
    const q = searchQuery.toLowerCase()
    return mockAwaitingPayments.filter((r) => {
      if (filters.profile.length > 0 && !filters.profile.includes(r.referrerProfile)) return false
      if (filters.location.length > 0 && !filters.location.includes(r.location)) return false
      if (filters.status.length > 0 && !filters.status.includes(r.status)) return false
      if (!withinDate(r.dateReferred)) return false
      if (
        q &&
        !r.referrer.toLowerCase().includes(q) &&
        !r.location.toLowerCase().includes(q) &&
        !r.status.toLowerCase().includes(q) &&
        !r.referrerProfile.toLowerCase().includes(q)
      )
        return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters, dateBounds, searchQuery])

  const filteredCompleted = useMemo(() => {
    if (activeTab !== "completed") return []
    const q = searchQuery.toLowerCase()
    return mockCompletedPayouts.filter((r) => {
      if (filters.profile.length > 0 && !filters.profile.includes(r.referrerProfile)) return false
      if (filters.location.length > 0 && !filters.location.includes(r.location)) return false
      if (!withinDate(r.dateReferred)) return false
      if (
        q &&
        !r.referrer.toLowerCase().includes(q) &&
        !r.location.toLowerCase().includes(q) &&
        !r.referrerProfile.toLowerCase().includes(q)
      )
        return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters, dateBounds, searchQuery])

  const totalItems =
    activeTab === "referred"
      ? filteredReferred.length
      : activeTab === "awaiting"
        ? filteredAwaiting.length
        : filteredCompleted.length

  const start = (currentPage - 1) * pageSize
  const paginatedReferred = filteredReferred.slice(start, start + pageSize)
  const paginatedAwaiting = filteredAwaiting.slice(start, start + pageSize)
  const paginatedCompleted = filteredCompleted.slice(start, start + pageSize)

  const activeFilterSections =
    activeTab === "awaiting"
      ? awaitingFilterSections
      : activeTab === "completed"
        ? completedFilterSections
        : referredFilterSections

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setFilters(defaultFilters)
    setDateRange(undefined)
    setSearchQuery("")
    setSearchOpen(false)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Champions" },
          { label: "Referral Management" },
        ]}
      />
      <PageHeader
        title="Referral Management"
        subtitle="Track referrals, conversions and bonus payouts"
        className="shrink-0"
      />

      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        {referralStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <StatusTabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="shrink-0"
      />

      <div className="mx-6 mt-2 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        {/* Table toolbar — filters live on the table (Fleet Register pattern) */}
        <div className="flex flex-wrap items-center gap-2 px-2 py-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">{dateRangeLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
              >
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
                sections={activeFilterSections}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </PopoverContent>
          </Popover>

          <ExpandableSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search by profile, location, status or date..."
            inputClassName="w-72"
          />

          {activeTab === "awaiting" && (
            <Button
              className="ml-auto h-9 gap-2 bg-brand-dark px-3 text-white hover:bg-brand-dark/90"
              onClick={() => setShowMakePayment(true)}
            >
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Make Payment</span>
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "awaiting" ? (
            <DataTable
              columns={awaitingColumns}
              data={paginatedAwaiting}
              emptyMessage="No awaiting payments found."
            />
          ) : activeTab === "referred" ? (
            <DataTable
              columns={referredColumns}
              data={paginatedReferred}
              emptyMessage="No referrals found."
            />
          ) : (
            <DataTable
              columns={completedColumns}
              data={paginatedCompleted}
              emptyMessage="No completed payouts found."
            />
          )}
        </div>
      </div>

      <div className="shrink-0 mx-6 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(totalItems / pageSize))}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel={activeTab === "referred" ? "referrals" : activeTab === "awaiting" ? "referrers" : "payouts"}
        />
      </div>

      <MakePaymentFlow open={showMakePayment} onClose={() => setShowMakePayment(false)} />
    </>
  )
}
