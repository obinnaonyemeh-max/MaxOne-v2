import { ticketCategories } from "./mockTicketCategories"

// Ticket resolution quality, previously the standalone Performance page.
// Categories come from ticketCategories; resolvers are the agents in
// mockTicketRecords.

interface Ticket {
  id: number
  category: string
  resolver: string
  resolved: boolean
  reopened: boolean
}

const RESOLVERS = ["Fatima Bello", "Chidi Okafor", "Ngozi Eze", "Tunde Bakare"]

/** Deterministic seed-based pseudo-random generator for stable mock data. */
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

export interface ResolverPerformance {
  name: string
  resolved: number
  reopened: number
  falseRate: number
}

export interface CategoryPerformance {
  category: string
  total: number
  reopened: number
  reopenRate: number
  distribution: number
}

export const ticketPerformanceMetrics = (() => {
  const total = MOCK_TICKETS.length
  const resolved = MOCK_TICKETS.filter((t) => t.resolved).length
  const reopened = MOCK_TICKETS.filter((t) => t.reopened).length
  const falseResolutionRate = resolved > 0 ? (reopened / resolved) * 100 : 0
  return { total, resolved, reopened, falseResolutionRate }
})()

export const resolverPerformance: ResolverPerformance[] = (() => {
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
})()

export const categoryPerformance: CategoryPerformance[] = (() => {
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
})()

/** Longest bar in the resolver chart; floored at 1 so an all-zero set still renders. */
export const maxResolverFalseRate = Math.max(
  ...resolverPerformance.map((r) => r.falseRate),
  1
)
