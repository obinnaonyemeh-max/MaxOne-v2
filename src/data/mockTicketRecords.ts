export interface TicketRecord {
  id: string
  ticketId: string
  affectedChampion: string
  category: string
  location: string
  assignedAgent: string
  ticketCreator: string
  priority: "High" | "Medium" | "Low"
  status: "Open" | "In Progress" | "Pending Feedback" | "Closed"
  sla: "Within SLA" | "Breached" | "At Risk"
  dateCreated: string
}

export const mockTicketRecords: TicketRecord[] = [
  { id: "1",  ticketId: "TKT-2026-00101", affectedChampion: "Adaeze Okonkwo",   category: "Vehicle Breakdown",   location: "Lagos – Ikeja",      assignedAgent: "Fatima Bello",    ticketCreator: "System",          priority: "High",   status: "Open",             sla: "Within SLA", dateCreated: "28 May 2026" },
  { id: "2",  ticketId: "TKT-2026-00102", affectedChampion: "Emeka Nwosu",       category: "Payment Dispute",     location: "Lagos – Lekki",      assignedAgent: "Chidi Okafor",    ticketCreator: "Emeka Nwosu",     priority: "Medium", status: "In Progress",      sla: "Within SLA", dateCreated: "28 May 2026" },
  { id: "3",  ticketId: "TKT-2026-00103", affectedChampion: "Oluwaseun Bello",   category: "App Issue",           location: "Abeokuta",            assignedAgent: "Ngozi Eze",       ticketCreator: "Oluwaseun Bello", priority: "Low",    status: "Pending Feedback",  sla: "Within SLA", dateCreated: "27 May 2026" },
  { id: "4",  ticketId: "TKT-2026-00104", affectedChampion: "Ibrahim Yusuf",     category: "Vehicle Breakdown",   location: "Osogbo",              assignedAgent: "Fatima Bello",    ticketCreator: "System",          priority: "High",   status: "Open",             sla: "Breached",   dateCreated: "25 May 2026" },
  { id: "5",  ticketId: "TKT-2026-00105", affectedChampion: "Funmilayo Ade",     category: "Insurance Claim",     location: "Lagos – Ikeja",      assignedAgent: "Tunde Bakare",    ticketCreator: "Funmilayo Ade",   priority: "High",   status: "In Progress",      sla: "Breached",   dateCreated: "24 May 2026" },
  { id: "6",  ticketId: "TKT-2026-00106", affectedChampion: "Tunde Bakare",      category: "Payment Dispute",     location: "Ibadan – Ring Road", assignedAgent: "Chidi Okafor",    ticketCreator: "Tunde Bakare",    priority: "Medium", status: "Open",             sla: "At Risk",    dateCreated: "27 May 2026" },
  { id: "7",  ticketId: "TKT-2026-00107", affectedChampion: "Chioma Obi",        category: "Accident Report",     location: "Lagos – Lekki",      assignedAgent: "Ngozi Eze",       ticketCreator: "System",          priority: "High",   status: "In Progress",      sla: "Within SLA", dateCreated: "28 May 2026" },
  { id: "8",  ticketId: "TKT-2026-00108", affectedChampion: "Yemi Adesanya",     category: "Vehicle Breakdown",   location: "Abeokuta",            assignedAgent: "Fatima Bello",    ticketCreator: "Yemi Adesanya",   priority: "Medium", status: "Closed",           sla: "Within SLA", dateCreated: "20 May 2026" },
  { id: "9",  ticketId: "TKT-2026-00109", affectedChampion: "Amaka Eze",         category: "App Issue",           location: "Lagos – Ikeja",      assignedAgent: "Tunde Bakare",    ticketCreator: "Amaka Eze",       priority: "Low",    status: "Closed",           sla: "Within SLA", dateCreated: "22 May 2026" },
  { id: "10", ticketId: "TKT-2026-00110", affectedChampion: "Ngozi Eze",         category: "Payment Dispute",     location: "Sango Ota",           assignedAgent: "Chidi Okafor",    ticketCreator: "Ngozi Eze",       priority: "Medium", status: "Open",             sla: "Within SLA", dateCreated: "28 May 2026" },
  { id: "11", ticketId: "TKT-2026-00111", affectedChampion: "Chukwuemeka Ibe",   category: "Insurance Claim",     location: "Osogbo",              assignedAgent: "Fatima Bello",    ticketCreator: "System",          priority: "High",   status: "In Progress",      sla: "Breached",   dateCreated: "21 May 2026" },
  { id: "12", ticketId: "TKT-2026-00112", affectedChampion: "Adaora Nwosu",      category: "Accident Report",     location: "Lagos – Lekki",      assignedAgent: "Ngozi Eze",       ticketCreator: "Adaora Nwosu",    priority: "Medium", status: "Pending Feedback",  sla: "At Risk",    dateCreated: "26 May 2026" },
  { id: "13", ticketId: "TKT-2026-00113", affectedChampion: "Segun Falowo",      category: "Vehicle Breakdown",   location: "Ibadan – Ring Road", assignedAgent: "Tunde Bakare",    ticketCreator: "Segun Falowo",    priority: "Low",    status: "Closed",           sla: "Within SLA", dateCreated: "18 May 2026" },
  { id: "14", ticketId: "TKT-2026-00114", affectedChampion: "Kemi Adeyemi",      category: "App Issue",           location: "Abeokuta",            assignedAgent: "Chidi Okafor",    ticketCreator: "Kemi Adeyemi",    priority: "Medium", status: "Open",             sla: "Within SLA", dateCreated: "28 May 2026" },
  { id: "15", ticketId: "TKT-2026-00115", affectedChampion: "Bola Okafor",       category: "Payment Dispute",     location: "Lagos – Ikeja",      assignedAgent: "Fatima Bello",    ticketCreator: "System",          priority: "Low",    status: "Pending Feedback",  sla: "Within SLA", dateCreated: "27 May 2026" },
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
