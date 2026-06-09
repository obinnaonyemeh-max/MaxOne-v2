import { useMemo } from "react"
import {
  TopBar,
  PageHeader,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ticketCategories } from "@/data/mockTicketCategories"

const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_STATUS_SUCCESS = "var(--color-success)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_DANGER = "var(--color-status-danger)"

// --- Mock dataset ---
// Categories sourced from ticketCategories; resolvers from mockTicketRecords agents.

interface Ticket {
  id: number
  category: string
  resolver: string
  resolved: boolean
  reopened: boolean
}

const RESOLVERS = ["Fatima Bello", "Chidi Okafor", "Ngozi Eze", "Tunde Bakare"]

// Deterministic seed-based pseudo-random generator for stable mock data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const MOCK_TICKETS: Ticket[] = (() => {
  const tickets: Ticket[] = []
  let id = 1
  const categories = ticketCategories.map((c) => c.name)

  for (const category of categories) {
    // Each category gets 5–8 tickets based on a stable seed
    const count = 5 + Math.floor(seededRandom(id) * 4)
    for (let i = 0; i < count; i++) {
      const resolver = RESOLVERS[(id + i) % RESOLVERS.length]
      const resolved = seededRandom(id * 7 + i) > 0.12
      const reopened = resolved && seededRandom(id * 13 + i) > 0.6
      tickets.push({ id: id++, category, resolver, resolved, reopened })
    }
  }
  return tickets
})()

export default function PerformancePage() {
  const metrics = useMemo(() => {
    const total = MOCK_TICKETS.length
    const resolved = MOCK_TICKETS.filter((t) => t.resolved).length
    const reopened = MOCK_TICKETS.filter((t) => t.reopened).length
    const falseResolutionRate = resolved > 0 ? (reopened / resolved) * 100 : 0
    return { total, resolved, reopened, falseResolutionRate }
  }, [])

  const resolverStats = useMemo(() => {
    const map = new Map<string, { resolved: number; reopened: number }>()
    for (const t of MOCK_TICKETS) {
      if (!t.resolved) continue
      const entry = map.get(t.resolver) ?? { resolved: 0, reopened: 0 }
      entry.resolved++
      if (t.reopened) entry.reopened++
      map.set(t.resolver, entry)
    }
    return Array.from(map.entries())
      .map(([name, stats]) => ({
        name,
        resolved: stats.resolved,
        reopened: stats.reopened,
        falseRate: (stats.reopened / stats.resolved) * 100,
      }))
      .sort((a, b) => b.falseRate - a.falseRate)
  }, [])

  const categoryStats = useMemo(() => {
    const total = MOCK_TICKETS.length
    const map = new Map<string, { total: number; reopened: number }>()
    for (const t of MOCK_TICKETS) {
      const entry = map.get(t.category) ?? { total: 0, reopened: 0 }
      entry.total++
      if (t.reopened) entry.reopened++
      map.set(t.category, entry)
    }
    return Array.from(map.entries())
      .map(([category, stats]) => ({
        category,
        total: stats.total,
        reopened: stats.reopened,
        reopenRate: (stats.reopened / stats.total) * 100,
        distribution: (stats.total / total) * 100,
      }))
      .sort((a, b) => b.total - a.total)
  }, [])

  const maxResolverRate = useMemo(
    () => Math.max(...resolverStats.map((r) => r.falseRate), 1),
    [resolverStats]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Performance" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Performance"
          subtitle="Track driver performance indicators"
          className="px-0"
        />

        {/* Section 1 — High-Level Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            title="Total Tickets"
            value={metrics.total.toLocaleString()}
            indicatorColor={COLOR_BRAND_PRIMARY}
          />
          <StatCard
            title="Resolved"
            value={metrics.resolved.toLocaleString()}
            subtitle={`${((metrics.resolved / metrics.total) * 100).toFixed(1)}% of total`}
            indicatorColor={COLOR_STATUS_SUCCESS}
          />
          <StatCard
            title="Reopened"
            value={metrics.reopened.toLocaleString()}
            subtitle={`${((metrics.reopened / metrics.total) * 100).toFixed(1)}% of total`}
            indicatorColor={COLOR_STATUS_WARNING}
          />
          <StatCard
            title="False Resolution Rate"
            value={`${metrics.falseResolutionRate.toFixed(1)}%`}
            subtitle="Reopened / Resolved"
            indicatorColor={COLOR_STATUS_DANGER}
          />
        </div>

        {/* Section 2 — False Resolution Rate by Resolver */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-25">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-[13px] font-medium text-gray-600">
              False Resolution Rate by Resolver
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {resolverStats.map((resolver, idx) => (
              <div
                key={resolver.name}
                className="flex items-center gap-4 px-4 py-2.5"
              >
                <span className="w-5 text-[12px] font-medium text-gray-400 text-right">
                  {idx + 1}
                </span>
                <span className="w-36 truncate text-[13px] font-medium text-gray-950">
                  {resolver.name}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(resolver.falseRate / maxResolverRate) * 100}%`,
                        backgroundColor:
                          resolver.falseRate >= 50
                            ? COLOR_STATUS_DANGER
                            : resolver.falseRate >= 30
                              ? COLOR_STATUS_WARNING
                              : COLOR_STATUS_SUCCESS,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-[13px] font-medium text-gray-950">
                    {resolver.falseRate.toFixed(1)}%
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[11px] text-gray-500 font-normal"
                >
                  {resolver.reopened}/{resolver.resolved} reopened
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — Reopen Rate by Ticket Category */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-25">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-[13px] font-medium text-gray-600">
              Reopen Rate by Ticket Category
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[12px] text-gray-500 font-medium">
                  Category
                </TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">
                  Total
                </TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">
                  Reopened
                </TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium text-right">
                  Reopen Rate
                </TableHead>
                <TableHead className="text-[12px] text-gray-500 font-medium">
                  Distribution
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryStats.map((cat) => (
                <TableRow key={cat.category}>
                  <TableCell className="text-[13px] font-medium text-gray-950">
                    {cat.category}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-700 text-right">
                    {cat.total}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-700 text-right">
                    {cat.reopened}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-medium"
                      style={{
                        color:
                          cat.reopenRate >= 40
                            ? COLOR_STATUS_DANGER
                            : cat.reopenRate >= 25
                              ? COLOR_STATUS_WARNING
                              : COLOR_STATUS_SUCCESS,
                      }}
                    >
                      {cat.reopenRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${cat.distribution}%`,
                            backgroundColor: COLOR_BRAND_PRIMARY,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-[12px] text-gray-500">
                        {cat.distribution.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
