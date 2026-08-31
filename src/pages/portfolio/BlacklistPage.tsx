import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatusBadge,
  ExpandableSearch,
} from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  mockBlacklistedChampions,
  mockBlacklistedGuarantors,
  type BlacklistedChampion,
  type BlacklistedGuarantor,
  type BlacklistStatus,
} from "@/data/mockBlacklist"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const statusVariant: Record<BlacklistStatus, "danger"> = {
  Blacklisted: "danger",
}

const championColumns: ColumnDef<BlacklistedChampion>[] = [
  {
    accessorKey: "name",
    header: "Champion Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src="/images/champvatar.png"
          alt={row.original.name}
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
        <span className="font-medium text-table-text-primary text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "maxId",
    header: "MAX ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.maxId}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariant[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.city}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.phone}</span>
    ),
  },
]

const guarantorColumns: ColumnDef<BlacklistedGuarantor>[] = [
  {
    accessorKey: "name",
    header: "Guarantor Name",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariant[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "lga",
    header: "LGA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.lga}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.phone}</span>
    ),
  },
]

export default function BlacklistPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "champions"
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

  const [championSearch, setChampionSearch] = useState("")
  const [championSearchOpen, setChampionSearchOpen] = useState(false)
  const [championPage, setChampionPage] = useState(1)
  const [championPageSize, setChampionPageSize] = useState(25)

  const [guarantorSearch, setGuarantorSearch] = useState("")
  const [guarantorSearchOpen, setGuarantorSearchOpen] = useState(false)
  const [guarantorPage, setGuarantorPage] = useState(1)
  const [guarantorPageSize, setGuarantorPageSize] = useState(25)

  const filteredChampions = useMemo(() => {
    setChampionPage(1)
    const q = championSearch.trim().toLowerCase()
    if (!q) return mockBlacklistedChampions
    return mockBlacklistedChampions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.maxId.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [championSearch])

  const filteredGuarantors = useMemo(() => {
    setGuarantorPage(1)
    const q = guarantorSearch.trim().toLowerCase()
    if (!q) return mockBlacklistedGuarantors
    return mockBlacklistedGuarantors.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.guarantorId.toLowerCase().includes(q) ||
        g.lga.toLowerCase().includes(q) ||
        g.phone.includes(q)
    )
  }, [guarantorSearch])

  const paginatedChampions = useMemo(() => {
    const start = (championPage - 1) * championPageSize
    return filteredChampions.slice(start, start + championPageSize)
  }, [filteredChampions, championPage, championPageSize])

  const paginatedGuarantors = useMemo(() => {
    const start = (guarantorPage - 1) * guarantorPageSize
    return filteredGuarantors.slice(start, start + guarantorPageSize)
  }, [filteredGuarantors, guarantorPage, guarantorPageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Champions" },
          { label: "Blacklist" },
        ]}
      />
      <PageHeader
        title="Blacklist"
        subtitle="Champions and guarantors barred from use in the system"
        className="shrink-0"
      />

      <div className="px-6 flex flex-col flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1 min-h-0">
          <TabsList variant="line" className="pb-0 gap-0 shrink-0">
            <TabsTrigger value="champions" className={tabTriggerClass}>
              Champions
            </TabsTrigger>
            <TabsTrigger value="guarantors" className={tabTriggerClass}>
              Guarantors
            </TabsTrigger>
          </TabsList>

          {/* Champions Tab */}
          <TabsContent value="champions" className="mt-3 flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <ExpandableSearch
                  open={championSearchOpen}
                  onOpenChange={setChampionSearchOpen}
                  value={championSearch}
                  onValueChange={setChampionSearch}
                  placeholder="Search by name, MAX ID, city or phone..."
                  inputClassName="w-72"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <DataTable columns={championColumns} data={paginatedChampions} />
              </div>
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={championPage}
                totalPages={Math.max(1, Math.ceil(filteredChampions.length / championPageSize))}
                totalItems={filteredChampions.length}
                pageSize={championPageSize}
                onPageChange={setChampionPage}
                onPageSizeChange={setChampionPageSize}
                itemLabel="champions"
              />
            </div>
          </TabsContent>

          {/* Guarantors Tab */}
          <TabsContent value="guarantors" className="mt-3 flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
              <div className="flex items-center gap-2 px-2 py-2">
                <ExpandableSearch
                  open={guarantorSearchOpen}
                  onOpenChange={setGuarantorSearchOpen}
                  value={guarantorSearch}
                  onValueChange={setGuarantorSearch}
                  placeholder="Search by name, ID, LGA or phone..."
                  inputClassName="w-72"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <DataTable columns={guarantorColumns} data={paginatedGuarantors} />
              </div>
            </div>

            <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
              <Pagination
                currentPage={guarantorPage}
                totalPages={Math.max(1, Math.ceil(filteredGuarantors.length / guarantorPageSize))}
                totalItems={filteredGuarantors.length}
                pageSize={guarantorPageSize}
                onPageChange={setGuarantorPage}
                onPageSizeChange={setGuarantorPageSize}
                itemLabel="guarantors"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
