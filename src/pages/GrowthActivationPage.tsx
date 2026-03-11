import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, SlidersHorizontal } from "lucide-react"
import {
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

// ── Summary stat cards data ──

const COLOR_BADGE_ACTIVE = "#008356"
const COLOR_GRAY_500 = "#737373"

const summaryStats = [
  { title: "Total activations today", value: "6", indicatorColor: COLOR_BADGE_ACTIVE },
  { title: "Total activations this week", value: "42", indicatorColor: COLOR_GRAY_500 },
  { title: "Total activations this month", value: "187", indicatorColor: COLOR_GRAY_500 },
  { title: "Avg activations per day (7D)", value: "6", indicatorColor: COLOR_BADGE_ACTIVE },
]

// ── Channel cards data ──

type ChannelPeriod = "today" | "thisWeek" | "thisMonth"

interface ChannelData {
  name: string
  today: number
  thisWeek: number
  thisMonth: number
  avgPerDay: number
  trend: { value: number; direction: "up" | "down" }
}

const channels: ChannelData[] = [
  { name: "Retail", today: 12, thisWeek: 42, thisMonth: 187, avgPerDay: 1.7, trend: { value: 1.1, direction: "down" } },
  { name: "Enterprise", today: 17, thisWeek: 58, thisMonth: 210, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
  { name: "MCP", today: 8, thisWeek: 31, thisMonth: 120, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
  { name: "Outright Sales", today: 4, thisWeek: 14, thisMonth: 52, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
]

const channelPeriodLabels: { id: ChannelPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "thisWeek", label: "This Week" },
  { id: "thisMonth", label: "This Month" },
]

// ── Activation Trend (Line Chart) data ──

const CHANNEL_COLORS = {
  retail: "#1855FC",
  enterprise: "#16B04F",
  mcp: "#E88E15",
  outright: "#6F2191",
}

const trendData = [
  { date: "Feb 10", Retail: 21, Enterprise: 18, MCP: 14, "Outright Sale": 10 },
  { date: "Feb 12", Retail: 19, Enterprise: 22, MCP: 12, "Outright Sale": 8 },
  { date: "Feb 14", Retail: 24, Enterprise: 20, MCP: 16, "Outright Sale": 11 },
  { date: "Feb 16", Retail: 18, Enterprise: 15, MCP: 10, "Outright Sale": 7 },
  { date: "Feb 18", Retail: 22, Enterprise: 21, MCP: 18, "Outright Sale": 9 },
  { date: "Feb 20", Retail: 20, Enterprise: 19, MCP: 14, "Outright Sale": 12 },
  { date: "Feb 22", Retail: 16, Enterprise: 14, MCP: 11, "Outright Sale": 6 },
  { date: "Feb 25", Retail: 23, Enterprise: 20, MCP: 17, "Outright Sale": 10 },
  { date: "Feb 27", Retail: 21, Enterprise: 22, MCP: 15, "Outright Sale": 8 },
  { date: "Mar 1", Retail: 19, Enterprise: 17, MCP: 12, "Outright Sale": 9 },
  { date: "Mar 2", Retail: 25, Enterprise: 23, MCP: 19, "Outright Sale": 11 },
  { date: "Mar 4", Retail: 22, Enterprise: 18, MCP: 14, "Outright Sale": 7 },
  { date: "Mar 6", Retail: 17, Enterprise: 15, MCP: 10, "Outright Sale": 8 },
  { date: "Mar 7", Retail: 20, Enterprise: 21, MCP: 16, "Outright Sale": 10 },
]

// ── Activations by Location (Bar Chart) data ──

const locationData = [
  { name: "Riyadh", value: 245 },
  { name: "Jeddah", value: 198 },
  { name: "Dubai", value: 142 },
  { name: "Cairo", value: 105 },
  { name: "Dammam", value: 72 },
]

// ── Activation Activity table data ──

interface ActivationRecord {
  assetId: string
  vehicleModel: string
  plateNumber: string
  customerName: string
  channel: "Retail" | "Enterprise" | "MCP" | "Outright Sale"
  officer: string
  location: string
  activationTime: string
}

const activationData: ActivationRecord[] = [
  {
    assetId: "AST-4501",
    vehicleModel: "EV-S200",
    plateNumber: "RYD-1122",
    customerName: "Mohammed Ali",
    channel: "Retail",
    officer: "Ahmed Al-Rashid",
    location: "Riyadh",
    activationTime: "2026-03-10 09:15",
  },
  {
    assetId: "AST-4502",
    vehicleModel: "EV-X400",
    plateNumber: "JED-3344",
    customerName: "Khalid Enterprises",
    channel: "Enterprise",
    officer: "Sarah Khan",
    location: "Jeddah",
    activationTime: "2026-03-10 10:30",
  },
  {
    assetId: "AST-4503",
    vehicleModel: "EV-T300",
    plateNumber: "DXB-5566",
    customerName: "Fleet Corp MCP",
    channel: "MCP",
    officer: "Omar Hassan",
    location: "Dubai",
    activationTime: "2026-03-10 11:00",
  },
  {
    assetId: "AST-4504",
    vehicleModel: "EV-C100",
    plateNumber: "CAI-7788",
    customerName: "Nadia Saleh",
    channel: "Retail",
    officer: "Fatima Noor",
    location: "Cairo",
    activationTime: "2026-03-10 12:45",
  },
  {
    assetId: "AST-4505",
    vehicleModel: "EV-S200",
    plateNumber: "RYD-9900",
    customerName: "Hassan Trading Co",
    channel: "Enterprise",
    officer: "Ahmed Al-Rashid",
    location: "Riyadh",
    activationTime: "2026-03-10 13:20",
  },
  {
    assetId: "AST-4506",
    vehicleModel: "EV-X400",
    plateNumber: "DMM-1234",
    customerName: "Ali Transport",
    channel: "MCP",
    officer: "Yusuf Bakr",
    location: "Dammam",
    activationTime: "2026-03-10 14:00",
  },
  {
    assetId: "AST-4507",
    vehicleModel: "EV-T300",
    plateNumber: "JED-5678",
    customerName: "Fahad Motors",
    channel: "Outright Sale",
    officer: "Sarah Khan",
    location: "Jeddah",
    activationTime: "2026-03-10 14:30",
  },
  {
    assetId: "AST-4508",
    vehicleModel: "EV-C100",
    plateNumber: "DXB-2233",
    customerName: "Layla Ibrahim",
    channel: "Retail",
    officer: "Omar Hassan",
    location: "Dubai",
    activationTime: "2026-03-10 15:10",
  },
]

const channelBadgeVariant: Record<string, "info" | "success" | "warning" | "default"> = {
  Retail: "info",
  Enterprise: "success",
  MCP: "warning",
  "Outright Sale": "default",
}

const columns: ColumnDef<ActivationRecord>[] = [
  {
    accessorKey: "assetId",
    header: "Asset / ID",
    cell: ({ row }) => (
      <span className="text-table-text-primary font-medium" style={{ fontSize: "13px" }}>
        {row.original.assetId}
      </span>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle model",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.vehicleModel}
      </span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate number",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.plateNumber}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer name / ID",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.customerName}
      </span>
    ),
  },
  {
    accessorKey: "channel",
    header: "Activation channel",
    cell: ({ row }) => (
      <StatusBadge
        variant={channelBadgeVariant[row.original.channel]}
        size="sm"
      >
        {row.original.channel}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "officer",
    header: "Activation officer",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.officer}
      </span>
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
    accessorKey: "activationTime",
    header: "Activation time",
    cell: ({ row }) => (
      <span className="text-table-text" style={{ fontSize: "13px" }}>
        {row.original.activationTime}
      </span>
    ),
  },
]

// ── Activation Activity filter sections ──

const COLOR_CHANNEL_RETAIL = "#1855FC"
const COLOR_CHANNEL_ENTERPRISE = "#16B04F"
const COLOR_CHANNEL_MCP = "#E88E15"
const COLOR_CHANNEL_OUTRIGHT = "#737373"

const activationFilterSections: FilterSection[] = [
  {
    id: "channels",
    title: "Channels",
    defaultExpanded: true,
    options: [
      { value: "Retail", label: "Retail", color: COLOR_CHANNEL_RETAIL },
      { value: "Enterprise", label: "Enterprise", color: COLOR_CHANNEL_ENTERPRISE },
      { value: "MCP", label: "MCP", color: COLOR_CHANNEL_MCP },
      { value: "Outright Sale", label: "Outright Sale", color: COLOR_CHANNEL_OUTRIGHT },
    ],
  },
  {
    id: "locations",
    title: "Locations",
    options: [
      { value: "Riyadh", label: "Riyadh" },
      { value: "Jeddah", label: "Jeddah" },
      { value: "Dubai", label: "Dubai" },
      { value: "Cairo", label: "Cairo" },
      { value: "Dammam", label: "Dammam" },
    ],
  },
  {
    id: "officers",
    title: "Officers",
    options: [
      { value: "Ahmed Al-Rashid", label: "Ahmed Al-Rashid" },
      { value: "Sarah Khan", label: "Sarah Khan" },
      { value: "Omar Hassan", label: "Omar Hassan" },
      { value: "Fatima Noor", label: "Fatima Noor" },
      { value: "Yusuf Bakr", label: "Yusuf Bakr" },
    ],
  },
  {
    id: "models",
    title: "Models",
    options: [
      { value: "EV-S200", label: "EV-S200" },
      { value: "EV-X400", label: "EV-X400" },
      { value: "EV-T300", label: "EV-T300" },
      { value: "EV-C100", label: "EV-C100" },
    ],
  },
]

// ── Dark tooltip shared component ──

function DarkTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "#1E1E1E",
        borderRadius: "8px",
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <span style={{ color: "#A3A3A3", fontSize: "12px", fontWeight: 500 }}>
        {label}
      </span>
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
            {entry.name}: {Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Page component ──

export default function GrowthActivationPage() {
  const navigate = useNavigate()
  const [channelPeriod, setChannelPeriod] = useState<ChannelPeriod>("today")
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activationFilters, setActivationFilters] = useState<GenericFilterState>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const activeFilterCount = getActiveFilterCount(activationFilters)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredActivationData = useMemo(() => {
    let data = activationData.filter((record) => {
      const channels = activationFilters.channels || []
      if (channels.length > 0 && !channels.includes(record.channel)) return false

      const locations = activationFilters.locations || []
      if (locations.length > 0 && !locations.includes(record.location)) return false

      const officers = activationFilters.officers || []
      if (officers.length > 0 && !officers.includes(record.officer)) return false

      const models = activationFilters.models || []
      if (models.length > 0 && !models.includes(record.vehicleModel)) return false

      return true
    })

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      data = data.filter(
        (record) =>
          record.assetId.toLowerCase().includes(q) ||
          record.vehicleModel.toLowerCase().includes(q) ||
          record.plateNumber.toLowerCase().includes(q) ||
          record.customerName.toLowerCase().includes(q) ||
          record.channel.toLowerCase().includes(q) ||
          record.officer.toLowerCase().includes(q) ||
          record.location.toLowerCase().includes(q)
      )
    }

    return data
  }, [activationFilters, searchQuery])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredActivationData.slice(start, start + pageSize)
  }, [filteredActivationData, currentPage, pageSize])

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Growth & Activation" },
          { label: "Activation Dashboard" },
        ]}
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Growth & Activation"
          subtitle="Monitor activation activity across all channels and locations"
          className="px-0"
        />

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-4 gap-2">
          {summaryStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              indicatorColor={stat.indicatorColor}
            />
          ))}
        </div>

        {/* Activations by Channel */}
        <div className="bg-gray-25 border border-gray-200 rounded-lg mt-6">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h3
              className="text-gray-950"
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              Activation by Channel
            </h3>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
              {channelPeriodLabels.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setChannelPeriod(period.id)}
                  className={cn(
                    "px-4 py-2 transition-colors rounded-md",
                    channelPeriod === period.id
                      ? "bg-white text-gray-950 shadow-sm"
                      : "bg-transparent text-gray-950 hover:text-gray-700"
                  )}
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="grid grid-cols-4 gap-2">
              {channels.map((channel) => {
                const periodValue =
                  channelPeriod === "today"
                    ? channel.today
                    : channelPeriod === "thisWeek"
                      ? channel.thisWeek
                      : channel.thisMonth
                return (
                  <div
                    key={channel.name}
                    className="bg-white border border-gray-200 rounded-lg"
                    style={{ padding: "16px", minWidth: "160px" }}
                  >
                    <span
                      className="block h-2 w-2 rounded-full bg-badge-active-text mb-2"
                    />
                    <span
                      className="block text-gray-600 mb-2"
                      style={{ fontSize: "13px", fontWeight: 500 }}
                    >
                      {channel.name}
                    </span>
                    <div
                      className="text-gray-950 mb-2"
                      style={{ fontSize: "24px", fontWeight: 500 }}
                    >
                      {periodValue}
                    </div>
                    <div className="flex items-center" style={{ gap: "6px" }}>
                      <span
                        className="text-gray-500"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        Avg / day: {channel.avgPerDay}
                      </span>
                      <span
                        className="text-gray-400"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        •
                      </span>
                      <div className="flex items-center" style={{ gap: "4px" }}>
                        <img
                          src={
                            channel.trend.direction === "up"
                              ? "/images/trend_up1.svg"
                              : "/images/trend_down1.svg"
                          }
                          alt={channel.trend.direction}
                          className="h-3.5 w-3.5"
                        />
                        <span
                          className={cn(
                            channel.trend.direction === "up"
                              ? "text-status-success"
                              : "text-status-danger"
                          )}
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          {channel.trend.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          {/* Activation Trend Line Chart */}
          <div className="bg-gray-25 border border-gray-200 rounded-lg">
            <div className="px-5 pt-5 pb-2">
              <h3
                className="text-gray-950"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Activation Trend (Last 30 Days)
              </h3>
            </div>
            <div className="px-3 pb-4">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={trendData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    horizontal
                    vertical={false}
                    stroke="#EAEAEA"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#A3A3A3", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#A3A3A3", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<DarkTooltipContent />} />
                  <Legend
                    verticalAlign="bottom"
                    align="left"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#555556",
                      paddingTop: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Retail"
                    stroke={CHANNEL_COLORS.retail}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Enterprise"
                    stroke={CHANNEL_COLORS.enterprise}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="MCP"
                    stroke={CHANNEL_COLORS.mcp}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Outright Sale"
                    stroke={CHANNEL_COLORS.outright}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activations by Location Bar Chart */}
          <div className="bg-gray-25 border border-gray-200 rounded-lg">
            <div className="px-5 pt-5 pb-2">
              <h3
                className="text-gray-950"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Activations by Location
              </h3>
            </div>
            <div className="px-3 pb-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={locationData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    horizontal
                    vertical={false}
                    stroke="#EAEAEA"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#A3A3A3", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#A3A3A3", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    cursor={false}
                    content={<DarkTooltipContent />}
                  />
                  <Bar
                    dataKey="value"
                    name="Activations"
                    fill="var(--color-badge-active-text)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    onMouseEnter={(_: unknown, index: number) =>
                      setHoveredBarIndex(index)
                    }
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {locationData.map((_, index) => (
                      <Cell
                        key={index}
                        opacity={
                          hoveredBarIndex === null || hoveredBarIndex === index
                            ? 1
                            : 0.35
                        }
                        style={{ transition: "opacity 0.2s ease", cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activation Activity Table */}
        <div className="mt-6 flex flex-col">
          <h3
            className="text-gray-950 mb-3 shrink-0"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Activation Activity
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
                      sections={activationFilterSections}
                      filters={activationFilters}
                      onFiltersChange={setActivationFilters}
                    />
                  </PopoverContent>
                </Popover>

                {searchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search activations..."
                      className="h-9 w-48"
                      autoFocus
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
              <DataTable
                columns={columns}
                data={paginatedData}
                onRowClick={(row) => navigate(`/fleet-register/${row.assetId}`)}
              />
            </div>
          </div>
          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredActivationData.length / pageSize)}
              totalItems={filteredActivationData.length}
              pageSize={pageSize}
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              itemLabel="activations"
            />
          </div>
        </div>
      </div>
    </>
  )
}
