import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  StatusBadge,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
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
  mockCollectionContracts,
  collectionsTotal,
  parBuckets,
  type CollectionContract,
  type DpdBucket,
} from "@/data/mockCollections"

function formatNairaCompact(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return `₦${n.toLocaleString()}`
}

// The mock DPD figures are relative to this reference "today".
// A contract's payment due date is that many days in the past.
const TODAY = new Date(2026, 7, 17)

function dueDateFromDpd(dpd: number): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - dpd)
  return d
}

const bucketVariant: Record<DpdBucket, "success" | "warning" | "danger"> = {
  "Early Arrears · 1–2 DPD": "success",
  "3–15 DPD": "warning",
  "Watchlist · 16–30 DPD": "warning",
  "31–60 DPD": "warning",
  "61–90 DPD": "danger",
  "91–180 DPD": "danger",
  "180+ DPD": "danger",
}

const variantColor: Record<"success" | "warning" | "danger", string> = {
  success: "var(--color-status-success)",
  warning: "var(--color-status-warning)",
  danger: "var(--color-status-danger)",
}

const columns: ColumnDef<CollectionContract>[] = [
  {
    accessorKey: "contract",
    header: "Contract",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.contract}</span>
    ),
  },
  {
    accessorKey: "champion",
    header: "Champion",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.champion}</span>
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
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">
        {row.original.vehicle === "EV" ? "Electric Vehicle" : "ICE Vehicle"}
      </span>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.vehicleType}</span>
    ),
  },
  {
    accessorKey: "dpd",
    header: "DPD",
    cell: ({ row }) => (
      <span
        className={`font-semibold text-sm ${row.original.dpd > 0 ? "text-status-danger" : "text-muted-foreground"}`}
      >
        {row.original.dpd}
      </span>
    ),
  },
  {
    accessorKey: "bucket",
    header: "Bucket",
    cell: ({ row }) => (
      <StatusBadge variant={bucketVariant[row.original.bucket]} withDot>
        {row.original.bucket}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "outstanding",
    header: "Outstanding",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">
        {formatNairaCompact(row.original.outstanding)}
      </span>
    ),
  },
]

const uniqueLocations = [...new Set(mockCollectionContracts.map((c) => c.location))].sort()
const uniqueVehicleTypes = [...new Set(mockCollectionContracts.map((c) => c.vehicleType))]
const bucketOptions: DpdBucket[] = [
  "Early Arrears · 1–2 DPD",
  "3–15 DPD",
  "Watchlist · 16–30 DPD",
  "31–60 DPD",
  "61–90 DPD",
  "91–180 DPD",
  "180+ DPD",
]

const filterSections: FilterSection[] = [
  {
    id: "bucket",
    title: "DPD Bucket",
    defaultExpanded: true,
    options: bucketOptions.map((b) => ({ value: b, label: b })),
  },
  {
    id: "location",
    title: "Location",
    options: uniqueLocations.map((loc) => ({ value: loc, label: loc })),
  },
  {
    id: "vehicleType",
    title: "Vehicle Type",
    options: uniqueVehicleTypes.map((vt) => ({ value: vt, label: vt })),
  },
  {
    id: "vehicle",
    title: "Vehicle",
    options: [
      { value: "EV", label: "Electric Vehicle" },
      { value: "ICE", label: "ICE Vehicle" },
    ],
  },
]

const defaultFilters: GenericFilterState = {
  bucket: [],
  location: [],
  vehicleType: [],
  vehicle: [],
}

export default function AllCollectionsPage() {
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const activeFilterCount = getActiveFilterCount(filters)

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range"
    if (!dateRange.to) return format(dateRange.from, "dd MMM yyyy")
    return `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
  }

  const filtered = useMemo(() => {
    setCurrentPage(1)
    const q = search.trim().toLowerCase()
    return mockCollectionContracts.filter((c) => {
      if (filters.bucket.length && !filters.bucket.includes(c.bucket)) return false
      if (filters.location.length && !filters.location.includes(c.location)) return false
      if (filters.vehicleType.length && !filters.vehicleType.includes(c.vehicleType)) return false
      if (filters.vehicle.length && !filters.vehicle.includes(c.vehicle)) return false
      if (dateRange?.from || dateRange?.to) {
        const due = dueDateFromDpd(c.dpd)
        if (dateRange.from && due < dateRange.from) return false
        if (dateRange.to && due > dateRange.to) return false
      }
      if (q && !c.contract.toLowerCase().includes(q) && !c.champion.toLowerCase().includes(q))
        return false
      return true
    })
  }, [filters, dateRange, search])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Collections" },
          { label: "All Collections" },
        ]}
      />
      <PageHeader
        title="All Collections"
        subtitle="Portfolio-at-risk view of contracts by days-past-due bucket"
        className="shrink-0"
      />

      <div className="flex-1 overflow-y-auto">
      {/* PAR stat cards — one per DPD bucket, wrapping onto multiple rows */}
      <div className="px-6 grid grid-cols-4 gap-2 shrink-0 mb-4">
        <StatCard
          title="TOTAL CONTRACTS"
          value={formatNairaCompact(collectionsTotal.amount)}
          subtitle={`${collectionsTotal.contracts} contracts`}
          indicatorColor="var(--color-brand-primary)"
        />
        {parBuckets.map((b) => (
          <StatCard
            key={b.label}
            title={b.label}
            value={b.count.toLocaleString()}
            subtitle={`${formatNairaCompact(b.amount)} · ${b.share}%`}
            indicatorColor={variantColor[bucketVariant[b.label]]}
          />
        ))}
      </div>

      <div className="px-6 flex flex-col">
        <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-2 py-2 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">{formatDateRange()}</span>
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
                  onFiltersChange={setFilters}
                />
              </PopoverContent>
            </Popover>

            <ExpandableSearch
              open={searchOpen}
              onOpenChange={setSearchOpen}
              value={search}
              onValueChange={setSearch}
              placeholder="Search contract or champion..."
              inputClassName="w-72"
            />
          </div>

          <div>
            <DataTable columns={columns} data={paginated} />
          </div>
        </div>

        <div className="mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="contracts"
          />
        </div>
      </div>
      </div>
    </>
  )
}
