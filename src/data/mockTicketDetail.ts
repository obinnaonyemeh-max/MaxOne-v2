import type { TimelineEntryData } from "@/components/max/TimelineEntry"

export interface TicketDetail {
  // Identity
  id: string
  ticketId: string
  status: "Open" | "In Progress" | "Pending Feedback" | "Closed"
  priority: "High" | "Medium" | "Low"
  sla: "Within SLA" | "Breached" | "At Risk"
  category: string
  dateCreated: string

  // Section 1: Incident Details
  incident: {
    location: string
    reporter: string
    dateOfIncident: string
    timeOfIncident: string
    vehiclePlate: string
    ticketCreator: string
    creatorComment: string
    attachments: { name: string; type: string }[]
    comments: {
      id: string
      author: string
      text: string
      timestamp: string
    }[]
  }

  // Section 2: Call Recordings
  callRecordings: {
    id: string
    fileName: string
    duration: string
    recordedAt: string
  }[]

  // Section 3: Champion Details
  champion: { name: string; id: string }

  // Section 4: Assigned Agent
  agent: { name: string; department: string }

  // Section 5: Vehicle Details
  vehicle: {
    maxVehicleId: string
    plateNumber: string
    type: string
    model: string
    brand: string
    currentStatus: string
    lastKnownLocation: string
    utilization: string
  }

  // Section 6: Contract Details
  contract: {
    contractId: string
    type: string
    startDate: string
    endDate: string
    status: string
  }

  // Section 7: SLA Tracking (timeline entries)
  slaTimeline: TimelineEntryData[]
}

const ticketDetails: Record<string, TicketDetail> = {
  "1": {
    id: "1",
    ticketId: "TKT-2026-00101",
    status: "Open",
    priority: "High",
    sla: "Within SLA",
    category: "Vehicle Breakdown",
    dateCreated: "28 May 2026",
    incident: {
      location: "Lagos \u2013 Ikeja, Allen Avenue",
      reporter: "Adaeze Okonkwo",
      dateOfIncident: "28 May 2026",
      timeOfIncident: "09:15 AM",
      vehiclePlate: "LG-412-KJA",
      ticketCreator: "System",
      creatorComment: "Vehicle stalled at intersection on Allen Avenue. Engine warning light on. Champion unable to restart. Requested tow assistance.",
      attachments: [
        { name: "engine_warning.jpg", type: "jpg" },
        { name: "vehicle_location.png", type: "png" },
        { name: "incident_report.pdf", type: "pdf" },
        { name: "mechanic_notes.docx", type: "docx" },
      ],
      comments: [
        {
          id: "c-1",
          author: "Fatima Bello",
          text: "Tow truck dispatched to Allen Avenue. ETA 30 minutes. Champion has been notified via WhatsApp.",
          timestamp: "28 May 2026, 09:25 AM",
        },
        {
          id: "c-2",
          author: "System",
          text: "Tow truck arrived at location. Vehicle pickup in progress.",
          timestamp: "28 May 2026, 09:52 AM",
        },
      ],
    },
    callRecordings: [
      {
        id: "cr-1",
        fileName: "inbound_call_adaeze_28may.wav",
        duration: "4:32",
        recordedAt: "28 May 2026, 09:16 AM",
      },
      {
        id: "cr-2",
        fileName: "outbound_follow_up_28may.wav",
        duration: "2:15",
        recordedAt: "28 May 2026, 09:48 AM",
      },
    ],
    champion: { name: "Adaeze Okonkwo", id: "CHP-10234" },
    agent: { name: "Fatima Bello", department: "Fleet Operations" },
    vehicle: {
      maxVehicleId: "MXV-00412",
      plateNumber: "LG-412-KJA",
      type: "Sedan",
      model: "Corolla 2023",
      brand: "Toyota",
      currentStatus: "Breakdown",
      lastKnownLocation: "Lagos \u2013 Ikeja, Allen Avenue",
      utilization: "85%",
    },
    contract: {
      contractId: "CON-2025-0087",
      type: "Hire Purchase",
      startDate: "15 Jan 2025",
      endDate: "15 Jan 2028",
      status: "Active",
    },
    slaTimeline: [
      {
        id: "tl-1",
        date: "28 May",
        status: "Open",
        statusVariant: "warning",
        description: {
          template: "Ticket created via {source}. Vehicle {plate} reported breakdown at {location}.",
          highlights: { source: "System", plate: "LG-412-KJA", location: "Allen Avenue, Ikeja" },
        },
        actor: { action: "Created by", name: "System" },
        duration: { range: "09:15 AM", total: "" },
      },
      {
        id: "tl-2",
        date: "28 May",
        status: "Assigned",
        statusVariant: "info",
        description: {
          template: "Ticket assigned to {agent} in {department}.",
          highlights: { agent: "Fatima Bello", department: "Fleet Operations" },
        },
        actor: { action: "Assigned by", name: "Auto-Router" },
        duration: { range: "09:18 AM", total: "3 min" },
      },
    ],
  },
  "2": {
    id: "2",
    ticketId: "TKT-2026-00102",
    status: "In Progress",
    priority: "Medium",
    sla: "Within SLA",
    category: "Payment Dispute",
    dateCreated: "28 May 2026",
    incident: {
      location: "Lagos \u2013 Lekki",
      reporter: "Emeka Nwosu",
      dateOfIncident: "27 May 2026",
      timeOfIncident: "02:30 PM",
      vehiclePlate: "LG-887-EPE",
      ticketCreator: "Emeka Nwosu",
      creatorComment: "Champion reports double charge on weekly payment. Bank statement shows two debits of \u20A645,000 on 27 May. Requesting reversal of duplicate.",
      attachments: [
        { name: "bank_statement.pdf", type: "pdf" },
        { name: "payment_receipt.jpg", type: "jpg" },
        { name: "transaction_log.xlsx", type: "xlsx" },
      ],
      comments: [
        {
          id: "c-1",
          author: "Chidi Okafor",
          text: "Verified bank statement. Duplicate debit confirmed — two entries of ₦45,000 on 27 May. Escalating to payment gateway team.",
          timestamp: "28 May 2026, 10:05 AM",
        },
      ],
    },
    callRecordings: [
      {
        id: "cr-1",
        fileName: "inbound_call_emeka_27may.wav",
        duration: "6:18",
        recordedAt: "27 May 2026, 02:32 PM",
      },
      {
        id: "cr-2",
        fileName: "outbound_update_emeka_28may.wav",
        duration: "3:45",
        recordedAt: "28 May 2026, 10:30 AM",
      },
      {
        id: "cr-3",
        fileName: "gateway_team_escalation_28may.wav",
        duration: "8:02",
        recordedAt: "28 May 2026, 11:15 AM",
      },
    ],
    champion: { name: "Emeka Nwosu", id: "CHP-10198" },
    agent: { name: "Chidi Okafor", department: "Finance & Billing" },
    vehicle: {
      maxVehicleId: "MXV-00887",
      plateNumber: "LG-887-EPE",
      type: "SUV",
      model: "RAV4 2022",
      brand: "Toyota",
      currentStatus: "Active",
      lastKnownLocation: "Lagos \u2013 Lekki Phase 1",
      utilization: "92%",
    },
    contract: {
      contractId: "CON-2024-0213",
      type: "Lease-to-Own",
      startDate: "01 Mar 2024",
      endDate: "01 Mar 2027",
      status: "Active",
    },
    slaTimeline: [
      {
        id: "tl-1",
        date: "27 May",
        status: "Open",
        statusVariant: "warning",
        description: {
          template: "Ticket created by {reporter}. Payment dispute for duplicate charge of {\u20A6amount}.",
          highlights: { reporter: "Emeka Nwosu", "\u20A6amount": "\u20A645,000" },
        },
        actor: { action: "Created by", name: "Emeka Nwosu" },
        duration: { range: "02:30 PM", total: "" },
      },
      {
        id: "tl-2",
        date: "27 May",
        status: "Assigned",
        statusVariant: "info",
        description: {
          template: "Ticket assigned to {agent} in {department}.",
          highlights: { agent: "Chidi Okafor", department: "Finance & Billing" },
        },
        actor: { action: "Assigned by", name: "Auto-Router" },
        duration: { range: "02:35 PM", total: "5 min" },
      },
      {
        id: "tl-3",
        date: "28 May",
        status: "In Progress",
        statusVariant: "info",
        description: {
          template: "Agent {agent} escalated to payment gateway team for transaction reversal. Reference: {ref}.",
          highlights: { agent: "Chidi Okafor", ref: "TXN-20260527-44891" },
        },
        actor: { action: "Updated by", name: "Chidi Okafor" },
        duration: { range: "10:00 AM", total: "19 hr 30 min" },
      },
    ],
  },
  "4": {
    id: "4",
    ticketId: "TKT-2026-00104",
    status: "Open",
    priority: "High",
    sla: "Breached",
    category: "Vehicle Breakdown",
    dateCreated: "25 May 2026",
    incident: {
      location: "Kano \u2013 Sabon Gari",
      reporter: "Ibrahim Yusuf",
      dateOfIncident: "25 May 2026",
      timeOfIncident: "11:45 AM",
      vehiclePlate: "KN-331-ABC",
      ticketCreator: "System",
      creatorComment: "Transmission failure reported. Vehicle unable to shift gears. Champion stranded on Bompai Road. Urgent tow required.",
      attachments: [
        { name: "dashboard_error.jpg", type: "jpg" },
        { name: "incident_report.pdf", type: "pdf" },
        { name: "road_photo.png", type: "png" },
      ],
      comments: [],
    },
    callRecordings: [
      {
        id: "cr-1",
        fileName: "inbound_call_ibrahim_25may.wav",
        duration: "5:10",
        recordedAt: "25 May 2026, 11:47 AM",
      },
    ],
    champion: { name: "Ibrahim Yusuf", id: "CHP-10301" },
    agent: { name: "Fatima Bello", department: "Fleet Operations" },
    vehicle: {
      maxVehicleId: "MXV-00331",
      plateNumber: "KN-331-ABC",
      type: "Sedan",
      model: "Camry 2022",
      brand: "Toyota",
      currentStatus: "Breakdown",
      lastKnownLocation: "Kano \u2013 Sabon Gari, Bompai Road",
      utilization: "78%",
    },
    contract: {
      contractId: "CON-2024-0156",
      type: "Hire Purchase",
      startDate: "10 Jun 2024",
      endDate: "10 Jun 2027",
      status: "Active",
    },
    slaTimeline: [
      {
        id: "tl-1",
        date: "25 May",
        status: "Open",
        statusVariant: "warning",
        description: {
          template: "Ticket created via {source}. Transmission failure on vehicle {plate} at {location}.",
          highlights: { source: "System", plate: "KN-331-ABC", location: "Bompai Road, Sabon Gari" },
        },
        actor: { action: "Created by", name: "System" },
        duration: { range: "11:45 AM", total: "" },
      },
      {
        id: "tl-2",
        date: "25 May",
        status: "Assigned",
        statusVariant: "info",
        description: {
          template: "Ticket assigned to {agent} in {department}.",
          highlights: { agent: "Fatima Bello", department: "Fleet Operations" },
        },
        actor: { action: "Assigned by", name: "Auto-Router" },
        duration: { range: "11:50 AM", total: "5 min" },
      },
      {
        id: "tl-3",
        date: "27 May",
        status: "SLA Breached",
        statusVariant: "danger",
        description: {
          template: "SLA breached. No resolution within {window} window. Ticket auto-escalated.",
          highlights: { window: "48-hour" },
        },
        actor: { action: "Escalated by", name: "System" },
        duration: { range: "11:45 AM", total: "48 hr" },
      },
    ],
  },
}

const defaultDetail: Omit<TicketDetail, "id" | "ticketId" | "status" | "priority" | "sla" | "category" | "dateCreated"> = {
  incident: {
    location: "Lagos \u2013 Ikeja",
    reporter: "Champion",
    dateOfIncident: "28 May 2026",
    timeOfIncident: "10:00 AM",
    vehiclePlate: "LG-000-XXX",
    ticketCreator: "System",
    creatorComment: "Issue reported by champion. Awaiting further details.",
    attachments: [],
    comments: [],
  },
  callRecordings: [],
  champion: { name: "Unknown Champion", id: "CHP-00000" },
  agent: { name: "Unassigned", department: "General Support" },
  vehicle: {
    maxVehicleId: "MXV-00000",
    plateNumber: "LG-000-XXX",
    type: "Sedan",
    model: "Corolla 2023",
    brand: "Toyota",
    currentStatus: "Active",
    lastKnownLocation: "Lagos \u2013 Ikeja",
    utilization: "0%",
  },
  contract: {
    contractId: "CON-0000-0000",
    type: "Hire Purchase",
    startDate: "-",
    endDate: "-",
    status: "Active",
  },
  slaTimeline: [
    {
      id: "tl-default-1",
      date: "28 May",
      status: "Open",
      statusVariant: "warning",
      description: {
        template: "Ticket created via {source}.",
        highlights: { source: "System" },
      },
      actor: { action: "Created by", name: "System" },
      duration: { range: "10:00 AM", total: "" },
    },
  ],
}

export function getTicketDetail(id: string): TicketDetail | undefined {
  if (ticketDetails[id]) return ticketDetails[id]

  // For records without a dedicated detail, build one from mockTicketRecords import
  // We avoid circular deps by using a dynamic fallback approach
  return undefined
}

/**
 * Builds a TicketDetail from a TicketRecord for records without pre-built details.
 */
export function buildTicketDetailFromRecord(record: {
  id: string
  ticketId: string
  status: "Open" | "In Progress" | "Pending Feedback" | "Closed"
  priority: "High" | "Medium" | "Low"
  sla: "Within SLA" | "Breached" | "At Risk"
  category: string
  dateCreated: string
  affectedChampion: string
  location: string
  assignedAgent: string
  ticketCreator: string
}): TicketDetail {
  return {
    id: record.id,
    ticketId: record.ticketId,
    status: record.status,
    priority: record.priority,
    sla: record.sla,
    category: record.category,
    dateCreated: record.dateCreated,
    incident: {
      ...defaultDetail.incident,
      location: record.location,
      reporter: record.affectedChampion,
      ticketCreator: record.ticketCreator,
    },
    callRecordings: [],
    champion: { name: record.affectedChampion, id: "CHP-00000" },
    agent: { name: record.assignedAgent, department: "General Support" },
    vehicle: { ...defaultDetail.vehicle },
    contract: { ...defaultDetail.contract },
    slaTimeline: [...defaultDetail.slaTimeline],
  }
}
