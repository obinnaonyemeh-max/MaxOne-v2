import type { TicketRecord } from "./mockTicketRecords"

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

export interface TicketPerformanceMetrics {
  total: number
  resolved: number
  reopened: number
  falseResolutionRate: number
}

export function buildTicketPerformanceMetrics(
  tickets: readonly TicketRecord[]
): TicketPerformanceMetrics {
  const total = tickets.length
  const resolved = tickets.filter((ticket) => ticket.status === "Closed").length
  const reopened = tickets.filter((ticket) => ticket.reopened).length
  const falseResolutionRate = resolved > 0 ? (reopened / resolved) * 100 : 0
  return { total, resolved, reopened, falseResolutionRate }
}

export function buildResolverPerformance(
  tickets: readonly TicketRecord[]
): ResolverPerformance[] {
  const map = new Map<string, { resolved: number; reopened: number }>()
  for (const ticket of tickets) {
    if (ticket.status !== "Closed") continue
    const entry = map.get(ticket.assignedAgent) ?? { resolved: 0, reopened: 0 }
    entry.resolved++
    if (ticket.reopened) entry.reopened++
    map.set(ticket.assignedAgent, entry)
  }
  return Array.from(map.entries())
    .map(([name, stats]) => ({
      name,
      resolved: stats.resolved,
      reopened: stats.reopened,
      falseRate: stats.resolved > 0 ? (stats.reopened / stats.resolved) * 100 : 0,
    }))
    .sort((left, right) => right.falseRate - left.falseRate)
}

export function buildCategoryPerformance(
  tickets: readonly TicketRecord[]
): CategoryPerformance[] {
  const total = tickets.length
  const map = new Map<string, { total: number; reopened: number }>()
  for (const ticket of tickets) {
    const entry = map.get(ticket.category) ?? { total: 0, reopened: 0 }
    entry.total++
    if (ticket.reopened) entry.reopened++
    map.set(ticket.category, entry)
  }
  return Array.from(map.entries())
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      reopened: stats.reopened,
      reopenRate: stats.total > 0 ? (stats.reopened / stats.total) * 100 : 0,
      distribution: total > 0 ? (stats.total / total) * 100 : 0,
    }))
    .sort((left, right) => right.total - left.total)
}

export function maxResolverFalseRate(resolvers: readonly ResolverPerformance[]): number {
  return Math.max(...resolvers.map((resolver) => resolver.falseRate), 1)
}
