import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal, ArrowLeftRight } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
  Banner,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { mockMarkedTransfers } from "@/data/mockMarkedTransfers"

interface Champion {
  id: string
  name: string
  championId: string
  avatarUrl: string
  contactNumber: string
  location: string
  state: string
  plateNumber: string
  outstandingBalance: number
  lastActiveDate: string
}

const mockChampions: Champion[] = [
  {
    id: "1",
    name: "Adewale Ogunleye",
    championId: "CHP-001",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 801 234 5678",
    location: "Ikeja",
    state: "Lagos",
    plateNumber: "LAG-234-XY",
    outstandingBalance: 125000,
    lastActiveDate: "28 May 2026",
  },
  {
    id: "2",
    name: "Chinedu Okafor",
    championId: "CHP-002",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 802 345 6789",
    location: "Lekki",
    state: "Lagos",
    plateNumber: "LAG-891-AB",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    championId: "CHP-003",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 803 456 7890",
    location: "Surulere",
    state: "Lagos",
    plateNumber: "LAG-456-CD",
    outstandingBalance: 45000,
    lastActiveDate: "25 May 2026",
  },
  {
    id: "4",
    name: "Funke Adeyemi",
    championId: "CHP-004",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 804 567 8901",
    location: "Yaba",
    state: "Lagos",
    plateNumber: "LAG-112-EF",
    outstandingBalance: 200000,
    lastActiveDate: "20 May 2026",
  },
  {
    id: "5",
    name: "Gbenga Alabi",
    championId: "CHP-005",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 805 678 9012",
    location: "Victoria Island",
    state: "Lagos",
    plateNumber: "LAG-778-GH",
    outstandingBalance: 0,
    lastActiveDate: "31 May 2026",
  },
  {
    id: "6",
    name: "Hassan Musa",
    championId: "CHP-006",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 806 789 0123",
    location: "Ajah",
    state: "Lagos",
    plateNumber: "LAG-334-IJ",
    outstandingBalance: 87500,
    lastActiveDate: "27 May 2026",
  },
  {
    id: "7",
    name: "Ibrahim Yusuf",
    championId: "CHP-007",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 807 890 1234",
    location: "Ikorodu",
    state: "Lagos",
    plateNumber: "LAG-556-KL",
    outstandingBalance: 310000,
    lastActiveDate: "15 May 2026",
  },
  {
    id: "8",
    name: "Janet Eze",
    championId: "CHP-008",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 808 901 2345",
    location: "Ikeja",
    state: "Lagos",
    plateNumber: "LAG-990-MN",
    outstandingBalance: 0,
    lastActiveDate: "29 May 2026",
  },
  {
    id: "9",
    name: "Kalu Nnamdi",
    championId: "CHP-009",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 809 012 3456",
    location: "Oshodi",
    state: "Lagos",
    plateNumber: "LAG-221-OP",
    outstandingBalance: 62000,
    lastActiveDate: "22 May 2026",
  },
  {
    id: "10",
    name: "Lateef Bakare",
    championId: "CHP-010",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 810 123 4567",
    location: "Agege",
    state: "Lagos",
    plateNumber: "LAG-443-QR",
    outstandingBalance: 155000,
    lastActiveDate: "18 May 2026",
  },
  {
    id: "11",
    name: "Maryam Abdullahi",
    championId: "CHP-011",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 811 234 5678",
    location: "Lekki",
    state: "Lagos",
    plateNumber: "LAG-667-ST",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
  {
    id: "12",
    name: "Ngozi Umeh",
    championId: "CHP-012",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 812 345 6789",
    location: "Surulere",
    state: "Lagos",
    plateNumber: "LAG-889-UV",
    outstandingBalance: 29000,
    lastActiveDate: "26 May 2026",
  },
  {
    id: "13",
    name: "Olumide Fashola",
    championId: "CHP-013",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 813 456 7890",
    location: "Ikeja",
    state: "Lagos",
    plateNumber: "LAG-101-WX",
    outstandingBalance: 0,
    lastActiveDate: "31 May 2026",
  },
  {
    id: "14",
    name: "Patricia Obi",
    championId: "CHP-014",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 814 567 8901",
    location: "Wuse",
    state: "Abuja",
    plateNumber: "ABJ-201-AA",
    outstandingBalance: 178000,
    lastActiveDate: "29 May 2026",
  },
  {
    id: "15",
    name: "Rasheed Balogun",
    championId: "CHP-015",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 815 678 9012",
    location: "Garki",
    state: "Abuja",
    plateNumber: "ABJ-302-BB",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
  {
    id: "16",
    name: "Sade Ogundimu",
    championId: "CHP-016",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 816 789 0123",
    location: "Yaba",
    state: "Lagos",
    plateNumber: "LAG-402-YZ",
    outstandingBalance: 95000,
    lastActiveDate: "24 May 2026",
  },
  {
    id: "17",
    name: "Tochukwu Ibe",
    championId: "CHP-017",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 817 890 1234",
    location: "Sabon Gari",
    state: "Kano",
    plateNumber: "KAN-501-CC",
    outstandingBalance: 240000,
    lastActiveDate: "20 May 2026",
  },
  {
    id: "18",
    name: "Uche Onyekachi",
    championId: "CHP-018",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 818 901 2345",
    location: "Lekki",
    state: "Lagos",
    plateNumber: "LAG-603-DD",
    outstandingBalance: 0,
    lastActiveDate: "31 May 2026",
  },
  {
    id: "19",
    name: "Victor Ajayi",
    championId: "CHP-019",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 819 012 3456",
    location: "Ring Road",
    state: "Ibadan",
    plateNumber: "IBD-701-EE",
    outstandingBalance: 52000,
    lastActiveDate: "27 May 2026",
  },
  {
    id: "20",
    name: "Wumi Ayodele",
    championId: "CHP-020",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 820 123 4567",
    location: "Agege",
    state: "Lagos",
    plateNumber: "LAG-804-FF",
    outstandingBalance: 0,
    lastActiveDate: "28 May 2026",
  },
  {
    id: "21",
    name: "Yinka Olawale",
    championId: "CHP-021",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 821 234 5678",
    location: "Victoria Island",
    state: "Lagos",
    plateNumber: "LAG-905-GG",
    outstandingBalance: 410000,
    lastActiveDate: "15 May 2026",
  },
  {
    id: "22",
    name: "Zainab Mohammed",
    championId: "CHP-022",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 822 345 6789",
    location: "Wuse",
    state: "Abuja",
    plateNumber: "ABJ-106-HH",
    outstandingBalance: 33000,
    lastActiveDate: "26 May 2026",
  },
  {
    id: "23",
    name: "Abdulrahman Sule",
    championId: "CHP-023",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 823 456 7890",
    location: "Oshodi",
    state: "Lagos",
    plateNumber: "LAG-207-JJ",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
  {
    id: "24",
    name: "Bimpe Afolabi",
    championId: "CHP-024",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 824 567 8901",
    location: "Surulere",
    state: "Lagos",
    plateNumber: "LAG-308-KK",
    outstandingBalance: 67500,
    lastActiveDate: "23 May 2026",
  },
  {
    id: "25",
    name: "Chidera Anyanwu",
    championId: "CHP-025",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 825 678 9012",
    location: "D-Line",
    state: "Port Harcourt",
    plateNumber: "PHC-409-LL",
    outstandingBalance: 190000,
    lastActiveDate: "19 May 2026",
  },
  {
    id: "26",
    name: "Dele Ogundare",
    championId: "CHP-026",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 826 789 0123",
    location: "Ikorodu",
    state: "Lagos",
    plateNumber: "LAG-510-MM",
    outstandingBalance: 0,
    lastActiveDate: "31 May 2026",
  },
  {
    id: "27",
    name: "Esther Nwankwo",
    championId: "CHP-027",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 827 890 1234",
    location: "Ajah",
    state: "Lagos",
    plateNumber: "LAG-611-NN",
    outstandingBalance: 145000,
    lastActiveDate: "21 May 2026",
  },
  {
    id: "28",
    name: "Femi Adegoke",
    championId: "CHP-028",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 828 901 2345",
    location: "Sabon Gari",
    state: "Kano",
    plateNumber: "KAN-712-PP",
    outstandingBalance: 0,
    lastActiveDate: "29 May 2026",
  },
  {
    id: "29",
    name: "Gloria Adekunle",
    championId: "CHP-029",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 829 012 3456",
    location: "Ikeja",
    state: "Lagos",
    plateNumber: "LAG-813-QQ",
    outstandingBalance: 82000,
    lastActiveDate: "25 May 2026",
  },
  {
    id: "30",
    name: "Henry Okoro",
    championId: "CHP-030",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 830 123 4567",
    location: "Ring Road",
    state: "Ibadan",
    plateNumber: "IBD-914-RR",
    outstandingBalance: 0,
    lastActiveDate: "28 May 2026",
  },
  {
    id: "31",
    name: "Ifeoma Chukwu",
    championId: "CHP-031",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 831 234 5678",
    location: "Lekki",
    state: "Lagos",
    plateNumber: "LAG-015-SS",
    outstandingBalance: 275000,
    lastActiveDate: "17 May 2026",
  },
  {
    id: "32",
    name: "James Okechukwu",
    championId: "CHP-032",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 832 345 6789",
    location: "Garki",
    state: "Abuja",
    plateNumber: "ABJ-116-TT",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
  {
    id: "33",
    name: "Kemi Solanke",
    championId: "CHP-033",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 833 456 7890",
    location: "Yaba",
    state: "Lagos",
    plateNumber: "LAG-217-UU",
    outstandingBalance: 118000,
    lastActiveDate: "22 May 2026",
  },
  {
    id: "34",
    name: "Lukman Garba",
    championId: "CHP-034",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 834 567 8901",
    location: "D-Line",
    state: "Port Harcourt",
    plateNumber: "PHC-318-VV",
    outstandingBalance: 0,
    lastActiveDate: "27 May 2026",
  },
  {
    id: "35",
    name: "Morenike Taiwo",
    championId: "CHP-035",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 835 678 9012",
    location: "Victoria Island",
    state: "Lagos",
    plateNumber: "LAG-419-WW",
    outstandingBalance: 56000,
    lastActiveDate: "26 May 2026",
  },
  {
    id: "36",
    name: "Nonso Emelife",
    championId: "CHP-036",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 836 789 0123",
    location: "Oshodi",
    state: "Lagos",
    plateNumber: "LAG-520-XX",
    outstandingBalance: 0,
    lastActiveDate: "31 May 2026",
  },
  {
    id: "37",
    name: "Olayinka Dada",
    championId: "CHP-037",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 837 890 1234",
    location: "Agege",
    state: "Lagos",
    plateNumber: "LAG-621-YY",
    outstandingBalance: 205000,
    lastActiveDate: "16 May 2026",
  },
  {
    id: "38",
    name: "Promise Bassey",
    championId: "CHP-038",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 838 901 2345",
    location: "Wuse",
    state: "Abuja",
    plateNumber: "ABJ-722-ZZ",
    outstandingBalance: 0,
    lastActiveDate: "29 May 2026",
  },
  {
    id: "39",
    name: "Quadri Animashaun",
    championId: "CHP-039",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 839 012 3456",
    location: "Ikorodu",
    state: "Lagos",
    plateNumber: "LAG-823-AB",
    outstandingBalance: 73000,
    lastActiveDate: "24 May 2026",
  },
  {
    id: "40",
    name: "Rukayat Abiodun",
    championId: "CHP-040",
    avatarUrl: "/images/champvatar.png",
    contactNumber: "+234 840 123 4567",
    location: "Ajah",
    state: "Lagos",
    plateNumber: "LAG-924-CD",
    outstandingBalance: 0,
    lastActiveDate: "30 May 2026",
  },
]

const totalChampions = mockChampions.length
const activeChampionCount = mockChampions.filter((c) => {
  const lastActive = new Date(c.lastActiveDate)
  const sevenDaysAgo = new Date("2026-05-24")
  return lastActive > sevenDaysAgo
}).length
const inactiveChampionCount = totalChampions - activeChampionCount

const championStats = [
  {
    title: "Total Champions",
    value: totalChampions,
    subtitle: "Across all locations",
    trend: { value: 2.5, direction: "up" as const },
    indicatorColor: "var(--color-brand-primary)",
  },
  {
    title: "Active Champions",
    value: activeChampionCount,
    subtitle: `${Math.round((activeChampionCount / totalChampions) * 100)}% of champions`,
    trend: { value: 4.2, direction: "up" as const },
    indicatorColor: "var(--color-status-success)",
  },
  {
    title: "Inactive Champions",
    value: inactiveChampionCount,
    subtitle: `${Math.round((inactiveChampionCount / totalChampions) * 100)}% of champions`,
    trend: { value: 1.8, direction: "down" as const },
    indicatorColor: "var(--color-status-danger)",
  },
]

const uniqueLocations = [...new Set(mockChampions.map((c) => c.location))].sort()
const uniqueStates = [...new Set(mockChampions.map((c) => c.state))].sort()

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: uniqueLocations.map((loc) => ({ value: loc, label: loc })),
  },
  {
    id: "state",
    title: "State",
    options: uniqueStates.map((st) => ({ value: st, label: st })),
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
  state: [],
}

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

const columns: ColumnDef<Champion>[] = [
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
          <p className="font-medium text-table-text-primary text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.championId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.contactNumber}</span>
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
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.plateNumber}</span>
    ),
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding Balance",
    cell: ({ row }) => {
      const balance = row.original.outstandingBalance
      return (
        <span
          className={`font-medium text-sm ${balance > 0 ? "text-status-warning" : "text-status-success"}`}
        >
          {formatCurrency(balance)}
        </span>
      )
    },
  },
  {
    accessorKey: "lastActiveDate",
    header: "Last Active Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.lastActiveDate}</span>
    ),
  },
]

export default function Champion360Page() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const filteredChampions = useMemo(() => {
    setCurrentPage(1)
    return mockChampions.filter((champion) => {
      if (filters.location.length > 0 && !filters.location.includes(champion.location)) return false
      if (filters.state.length > 0 && !filters.state.includes(champion.state)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !champion.name.toLowerCase().includes(q) &&
          !champion.championId.toLowerCase().includes(q) &&
          !champion.contactNumber.includes(q) &&
          !champion.plateNumber.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [filters, searchQuery])

  const paginatedChampions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredChampions.slice(start, start + pageSize)
  }, [filteredChampions, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Champion 360" },
        ]}
      />
      <PageHeader
        title="Champion 360"
        subtitle="Comprehensive view of driver champion profiles and performance"
        className="shrink-0"
      />

      <div className="px-6 mb-4">
        <Banner
          variant="info"
          icon={<ArrowLeftRight className="h-5 w-5 text-status-info" />}
          title={`${mockMarkedTransfers.filter((r) => r.status === "Pending").length} pending approval(s) require your attention`}
          description="Review and process pending ownership transfers and time-off requests."
          action={
            <Button size="sm" onClick={() => navigate("/driver-experience/approvals")}>
              View Approvals
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
      <div className="px-6 grid grid-cols-3 gap-2 shrink-0 mb-4">
        {championStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            trend={stat.trend}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="px-6 flex flex-col">
        <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex items-center gap-2 px-2 py-2">
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

            {searchOpen ? (
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, ID, phone, or plate..."
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

          <div>
            <DataTable
              columns={columns}
              data={paginatedChampions}
              onRowClick={(row) => navigate(`/champion-360/${row.id}`)}
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredChampions.length / pageSize))}
            totalItems={filteredChampions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="champions"
          />
        </div>
      </div>
      </div>
    </>
  )
}
