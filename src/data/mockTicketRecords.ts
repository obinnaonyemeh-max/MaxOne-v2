import { championLocationLabel, getChampionById } from "./mockChampions"

export interface TicketRecord {
  id: string
  ticketId: string
  championId: string
  affectedChampion: string
  category: string
  location: string
  city: string
  subcity: string
  assignedAgent: string
  ticketCreator: string
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Pending Feedback" | "Closed"
  sla: "Within SLA" | "Breached" | "At Risk"
  dateCreated: string
  reopened?: boolean
}

function ticketFor(
  id: string,
  ticketId: string,
  championRecordId: string,
  category: string,
  assignedAgent: string,
  ticketCreator: string,
  priority: TicketRecord["priority"],
  status: TicketRecord["status"],
  sla: TicketRecord["sla"],
  dateCreated: string,
  reopened?: boolean
): TicketRecord {
  const champion = getChampionById(championRecordId)
  if (!champion) {
    throw new Error(`Unknown champion id ${championRecordId}`)
  }
  return {
    id,
    ticketId,
    championId: champion.championId,
    affectedChampion: champion.name,
    category,
    location: championLocationLabel(champion),
    city: champion.city,
    subcity: champion.subcity,
    assignedAgent,
    ticketCreator,
    priority,
    status,
    sla,
    dateCreated,
    ...(reopened ? { reopened: true } : {}),
  }
}

export const mockTicketRecords: TicketRecord[] = [
  ticketFor("1",  "TKT-2026-00101", "1",  "Vehicle Breakdown", "Fatima Bello", "System",            "High",   "Open",             "Within SLA", "28 May 2026"),
  ticketFor("2",  "TKT-2026-00102", "2",  "Payment Dispute",   "Chidi Okafor", "Chinedu Okafor",    "Medium", "In Progress",      "Within SLA", "28 May 2026"),
  ticketFor("3",  "TKT-2026-00103", "3",  "App Issue",         "Ngozi Eze",    "Emeka Nwosu",       "Low",    "Pending Feedback", "Within SLA", "27 May 2026"),
  ticketFor("4",  "TKT-2026-00104", "4",  "Vehicle Breakdown", "Fatima Bello", "System",            "High",   "Open",             "Breached",   "25 May 2026"),
  ticketFor("5",  "TKT-2026-00105", "5",  "Insurance Claim",   "Tunde Bakare", "Gbenga Alabi",      "High",   "In Progress",      "Breached",   "24 May 2026"),
  ticketFor("6",  "TKT-2026-00106", "6",  "Payment Dispute",   "Chidi Okafor", "Hassan Musa",       "Medium", "Open",             "At Risk",    "27 May 2026"),
  ticketFor("7",  "TKT-2026-00107", "7",  "Accident Report",   "Fatima Bello", "System",            "High",   "Closed",           "Within SLA", "20 May 2026", true),
  ticketFor("8",  "TKT-2026-00108", "8",  "Vehicle Breakdown", "Ngozi Eze",    "Janet Eze",         "Medium", "Closed",           "Within SLA", "20 May 2026"),
  ticketFor("9",  "TKT-2026-00109", "9",  "App Issue",         "Tunde Bakare", "Kalu Nnamdi",       "Low",    "Closed",           "Within SLA", "22 May 2026", true),
  ticketFor("10", "TKT-2026-00110", "10", "Payment Dispute",   "Chidi Okafor", "Lateef Bakare",     "Medium", "Pending Feedback", "Within SLA", "28 May 2026"),
  ticketFor("11", "TKT-2026-00111", "14", "Insurance Claim",   "Ngozi Eze",    "System",            "High",   "Open",             "Breached",   "21 May 2026"),
  ticketFor("12", "TKT-2026-00112", "18", "Accident Report",   "Chidi Okafor", "Uche Onyekachi",    "Medium", "Closed",           "At Risk",    "26 May 2026"),
  ticketFor("13", "TKT-2026-00113", "19", "Vehicle Breakdown", "Fatima Bello", "Victor Ajayi",      "Low",    "Closed",           "Within SLA", "18 May 2026", true),
  ticketFor("14", "TKT-2026-00114", "26", "App Issue",         "Chidi Okafor", "Dele Ogundare",     "Medium", "In Progress",      "Within SLA", "28 May 2026"),
  ticketFor("15", "TKT-2026-00115", "15", "Payment Dispute",   "Tunde Bakare", "System",            "Low",    "Pending Feedback", "Within SLA", "27 May 2026"),
  ticketFor("16", "TKT-2026-00116", "17", "Vehicle Breakdown", "Tunde Bakare", "Tochukwu Ibe",      "High",   "Open",             "At Risk",    "26 May 2026"),
  ticketFor("17", "TKT-2026-00117", "21", "Insurance Claim",   "Fatima Bello", "Yinka Olawale",     "High",   "Closed",           "Breached",   "19 May 2026", true),
  ticketFor("18", "TKT-2026-00118", "25", "Accident Report",   "Ngozi Eze",    "System",            "High",   "In Progress",      "Within SLA", "27 May 2026"),
  ticketFor("19", "TKT-2026-00119", "31", "App Issue",         "Amara Nwachukwu", "Ifeoma Chukwu",   "Low",    "Closed",           "Within SLA", "22 May 2026"),
  ticketFor("20", "TKT-2026-00120", "34", "Payment Dispute",   "Chinelo Umeh", "Lukman Garba",      "Medium", "Open",             "Within SLA", "28 May 2026"),
]

export const statusVariantMap: Record<TicketRecord["status"], "warning" | "info" | "refurb" | "success"> = {
  "Open":             "warning",
  "In Progress":      "info",
  "Pending Feedback": "refurb",
  "Closed":           "success",
}

export const priorityVariantMap: Record<TicketRecord["priority"], "danger" | "warning" | "default"> = {
  "High":   "danger",
  "Medium": "warning",
  "Low":    "default",
}

export const slaVariantMap: Record<TicketRecord["sla"], "success" | "danger" | "warning"> = {
  "Within SLA": "success",
  "Breached":   "danger",
  "At Risk":    "warning",
}
