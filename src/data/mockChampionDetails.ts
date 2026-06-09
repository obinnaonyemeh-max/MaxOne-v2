import type { TimelineEntryData } from "@/components/max"
import type { TicketRecord } from "@/data/mockTicketRecords"

export interface WalletTransaction {
  id: string
  date: string
  referenceId: string
  transactionType: "Credit" | "Debit"
  amount: string
  status: "Successful" | "Pending" | "Failed"
}

export interface WelfareNote {
  id: string
  date: string
  loggedBy: string
  channel: "Phone Call" | "SMS" | "WhatsApp" | "In-Person"
  interactionType: "Routine Check-In" | "Incident Follow-up" | "Welfare Complaint"
  summary: string
  issuesRaised: string
  actionTaken: string
  followUpRequired: boolean
  incidentStatus: "Open" | "In-Progress" | "Resolved"
}

export interface ChampionDetails {
  id: string
  name: string
  championId: string
  avatarUrl?: string
  riskLevel: "High Risk" | "Medium Risk" | "Low Risk"
  phoneNumber: string
  location: string
  onboardedDate: string
  lastPingedOn: string
  contractStatus: "Active" | "Inactive"

  vehicle: {
    status: string
    statusVariant: "success" | "warning" | "info" | "danger" | "default"
    imageUrl: string
    assetType: string
    manufacturer: string
    contractStatus: "Active" | "Inactive"
    lastUpdatedBy: string
    lastPingedOn: string
  }

  maxIdCard: {
    variant: "active" | "inactive"
    dateGenerated?: string
    generatedBy?: string
  }

  biodata: {
    fullName: string
    dateOfBirth: string
    gender: string
    maritalStatus: string
    stateOfOrigin: string
    lga: string
    address: string
    email: string
    nextOfKin: string
    nextOfKinPhone: string
    bloodGroup: string
    genotype: string
  }

  contracts: {
    contractId: string
    startDate: string
    endDate: string
    vehicleAssigned: string
    dailyRemittance: string
    totalRemitted: string
    outstandingBalance: string
    status: string
    totalDays: number
    daysElapsed: number
    percentageElapsed: number
  }

  wallet: {
    walletId: string
    balance: string
    lastTransaction: string
    lastTransactionDate: string
    totalCredits: string
    totalDebits: string
    bvn: string
    bankAccounts: {
      bankName: string
      accountNumber: string
      iconUrl?: string
      isPrimary?: boolean
    }[]
    transactions: WalletTransaction[]
  }

  guarantors: {
    name: string
    relationship: string
    phone: string
    address: string
  }[]

  fieldOps: TimelineEntryData[]

  tickets: TicketRecord[]

  welfareNotes: WelfareNote[]

  timeOff: {
    leavesAvailable: number
    leavesEarned: number
    eligibleLeavesTaken: number
    emergencyLeavesTaken: number
    currentStatus: "none" | "on-leave" | "no-available"
    currentLeave?: { startDate: string; endDate: string }
    history: {
      id: string
      type: "Annual" | "Emergency" | "Sick"
      startDate: string
      endDate: string
      status: "Approved" | "Pending" | "Declined"
      approvedBy: string
    }[]
  }

  hmo: {
    provider: string
    planType: string
    enrollmentDate: string
    expiryDate: string
    hmoId: string
    status: string
  }
}

export const mockChampionDetails: Record<string, ChampionDetails> = {
  "1": {
    id: "1",
    name: "Adewale Ogunleye",
    championId: "CHP-001",
    riskLevel: "High Risk",
    phoneNumber: "+234 801 234 5678",
    location: "Ikeja",
    onboardedDate: "15 Mar 2024",
    lastPingedOn: "28 May 2026, 10:23 am",
    contractStatus: "Active",
    vehicle: {
      status: "Asset Checkout",
      statusVariant: "info",
      imageUrl: "/images/2wheeler_overview.svg",
      assetType: "2 wheeler",
      manufacturer: "MaxE",
      contractStatus: "Active",
      lastUpdatedBy: "Samson Oluwaseun",
      lastPingedOn: "28 May 2026, 10:23 am",
    },
    maxIdCard: {
      variant: "active",
      dateGenerated: "18 Mar 2024",
      generatedBy: "Samson Oluwaseun",
    },
    biodata: {
      fullName: "Adewale Ogunleye",
      dateOfBirth: "12 Jun 1990",
      gender: "Male",
      maritalStatus: "Married",
      stateOfOrigin: "Lagos",
      lga: "Ikeja",
      address: "15 Allen Avenue, Ikeja, Lagos",
      email: "adewale.ogunleye@email.com",
      nextOfKin: "Folake Ogunleye",
      nextOfKinPhone: "+234 801 111 2222",
      bloodGroup: "O+",
      genotype: "AA",
    },
    contracts: {
      contractId: "CNT-2024-001",
      startDate: "15 Mar 2024",
      endDate: "15 Mar 2026",
      vehicleAssigned: "MAX-IB-CH-203",
      dailyRemittance: "\u20A65,000",
      totalRemitted: "\u20A63,750,000",
      outstandingBalance: "\u20A6125,000",
      status: "Active",
      totalDays: 730,
      daysElapsed: 443,
      percentageElapsed: 61,
    },
    wallet: {
      walletId: "WLT-001-ADW",
      balance: "\u20A6234,500",
      lastTransaction: "Daily Remittance Payment",
      lastTransactionDate: "28 May 2026",
      totalCredits: "\u20A64,500,000",
      totalDebits: "\u20A64,265,500",
      bvn: "228****89008",
      bankAccounts: [
        { bankName: "Moniepoint Microfinance Bank", accountNumber: "0118**89098", iconUrl: "/images/moniepoint.svg", isPrimary: true },
        { bankName: "Guaranty Trust Bank", accountNumber: "0118**89098", iconUrl: "/images/guaranty_trust_bank 1.svg" },
      ],
      transactions: [
        { id: "t1", date: "28 May 2026", referenceId: "TXN-20260528-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t2", date: "27 May 2026", referenceId: "TXN-20260527-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t3", date: "26 May 2026", referenceId: "TXN-20260526-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t4", date: "25 May 2026", referenceId: "TXN-20260525-001", transactionType: "Credit", amount: "\u20A625,000", status: "Successful" },
        { id: "t5", date: "24 May 2026", referenceId: "TXN-20260524-001", transactionType: "Debit", amount: "\u20A65,000", status: "Failed" },
        { id: "t6", date: "23 May 2026", referenceId: "TXN-20260523-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t7", date: "22 May 2026", referenceId: "TXN-20260522-001", transactionType: "Credit", amount: "\u20A612,500", status: "Pending" },
        { id: "t8", date: "21 May 2026", referenceId: "TXN-20260521-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
      ],
    },
    tickets: [
      { id: "ct1", ticketId: "TKT-2026-00201", affectedChampion: "Adewale Ogunleye", category: "Vehicle Breakdown",  location: "Lagos – Ikeja",  assignedAgent: "Fatima Bello",  ticketCreator: "System",           priority: "High",   status: "Open",             sla: "Breached",    dateCreated: "27 May 2026" },
      { id: "ct2", ticketId: "TKT-2026-00202", affectedChampion: "Adewale Ogunleye", category: "Payment Dispute",    location: "Lagos – Ikeja",  assignedAgent: "Chidi Okafor",  ticketCreator: "Adewale Ogunleye", priority: "Medium", status: "In Progress",      sla: "Within SLA",  dateCreated: "25 May 2026" },
      { id: "ct3", ticketId: "TKT-2026-00203", affectedChampion: "Adewale Ogunleye", category: "App Issue",          location: "Lagos – Ikeja",  assignedAgent: "Ngozi Eze",     ticketCreator: "Adewale Ogunleye", priority: "Low",    status: "Closed",           sla: "Within SLA",  dateCreated: "20 May 2026" },
      { id: "ct4", ticketId: "TKT-2026-00204", affectedChampion: "Adewale Ogunleye", category: "Insurance Claim",    location: "Lagos – Ikeja",  assignedAgent: "Tunde Bakare",  ticketCreator: "System",           priority: "High",   status: "Pending Feedback", sla: "At Risk",     dateCreated: "22 May 2026" },
      { id: "ct5", ticketId: "TKT-2026-00205", affectedChampion: "Adewale Ogunleye", category: "Accident Report",    location: "Lagos – Ikeja",  assignedAgent: "Fatima Bello",  ticketCreator: "Adewale Ogunleye", priority: "Medium", status: "Open",             sla: "Within SLA",  dateCreated: "28 May 2026" },
    ],
    fieldOps: [
      {
        id: "fo1",
        date: "28 May 2026",
        status: "Vehicle Recovery",
        statusVariant: "danger",
        description: {
          template: "Recovered vehicle {vehicle} from champion at {location} due to repeated remittance defaults.",
          highlights: { vehicle: "MAX-IB-CH-203", location: "Ikeja Under-Bridge" },
        },
        actor: { action: "Carried out by", name: "Tunde Bakare" },
        duration: { range: "8:00 am – 10:30 am", total: "2h 30m" },
      },
      {
        id: "fo2",
        date: "28 May 2026",
        status: "Welfare Check",
        statusVariant: "success",
        description: {
          template: "Conducted a welfare check visit with {champion} at {location}. Champion is in good health and active.",
          highlights: { champion: "Adewale Ogunleye", location: "15 Allen Avenue, Ikeja" },
        },
        actor: { action: "Carried out by", name: "Ngozi Eze" },
        duration: { range: "1:00 pm – 1:45 pm", total: "45m" },
      },
      {
        id: "fo3",
        date: "20 May 2026",
        status: "Document Collection",
        statusVariant: "info",
        description: {
          template: "Collected and verified {document} from {champion} for contract renewal processing.",
          highlights: { document: "Utility Bill & ID Card", champion: "Adewale Ogunleye" },
        },
        actor: { action: "Carried out by", name: "Samson Oluwaseun" },
        duration: { range: "9:00 am – 9:40 am", total: "40m" },
      },
      {
        id: "fo4",
        date: "20 May 2026",
        status: "Vehicle Inspection",
        statusVariant: "warning",
        description: {
          template: "Inspected vehicle {vehicle} condition at {location}. Minor wear noted on brake pads, scheduled for maintenance.",
          highlights: { vehicle: "MAX-IB-CH-203", location: "Ikeja Service Centre" },
        },
        actor: { action: "Carried out by", name: "Femi Adeyemi" },
        duration: { range: "11:00 am – 12:15 pm", total: "1h 15m" },
      },
      {
        id: "fo5",
        date: "10 May 2026",
        status: "Welfare Check",
        statusVariant: "success",
        description: {
          template: "Routine welfare check with {champion} at {location}. No issues reported.",
          highlights: { champion: "Adewale Ogunleye", location: "Allen Avenue, Ikeja" },
        },
        actor: { action: "Carried out by", name: "Ngozi Eze" },
        duration: { range: "2:00 pm – 2:30 pm", total: "30m" },
      },
    ],
    guarantors: [
      {
        name: "Bola Ogunleye",
        relationship: "Brother",
        phone: "+234 801 333 4444",
        address: "23 Toyin Street, Ikeja, Lagos",
      },
      {
        name: "Kehinde Afolabi",
        relationship: "Friend",
        phone: "+234 802 555 6666",
        address: "8 Obafemi Awolowo Way, Ikeja, Lagos",
      },
    ],
    welfareNotes: [
      {
        id: "wn1",
        date: "7 Jun 2026",
        loggedBy: "Ngozi Eze",
        channel: "Phone Call",
        interactionType: "Routine Check-In",
        summary: "Spoke with Adewale about his general wellbeing and work conditions. He mentioned being satisfied with the current vehicle condition but expressed concern about rising fuel costs affecting his daily earnings.",
        issuesRaised: "Fuel cost increase impacting take-home earnings",
        actionTaken: "Advised on fuel-efficient routes and escalated fuel subsidy request to management",
        followUpRequired: true,
        incidentStatus: "Open",
      },
      {
        id: "wn2",
        date: "1 Jun 2026",
        loggedBy: "Fatima Bello",
        channel: "In-Person",
        interactionType: "Incident Follow-up",
        summary: "Followed up on the minor accident reported on 28 May. Adewale confirmed he has fully recovered and the vehicle has been repaired. No lingering health issues.",
        issuesRaised: "",
        actionTaken: "Confirmed recovery, closed incident follow-up. Updated health records.",
        followUpRequired: false,
        incidentStatus: "Resolved",
      },
      {
        id: "wn3",
        date: "25 May 2026",
        loggedBy: "Ngozi Eze",
        channel: "WhatsApp",
        interactionType: "Welfare Complaint",
        summary: "Adewale reported that he was involved in a minor road incident. No serious injuries but requested time off for medical check-up. Expressed frustration about road conditions in his assigned area.",
        issuesRaised: "Minor road incident, poor road conditions in Ikeja axis",
        actionTaken: "Approved 2-day medical leave. Logged road condition complaint for operations review.",
        followUpRequired: true,
        incidentStatus: "In-Progress",
      },
      {
        id: "wn4",
        date: "15 May 2026",
        loggedBy: "Chidi Okafor",
        channel: "Phone Call",
        interactionType: "Routine Check-In",
        summary: "Routine bi-weekly welfare check. Adewale reported no issues. Satisfied with support from the operations team. Mentioned interest in upgrading to a 3-wheeler vehicle.",
        issuesRaised: "",
        actionTaken: "Noted vehicle upgrade interest, forwarded to contracts team",
        followUpRequired: false,
        incidentStatus: "Resolved",
      },
      {
        id: "wn5",
        date: "2 May 2026",
        loggedBy: "Fatima Bello",
        channel: "SMS",
        interactionType: "Routine Check-In",
        summary: "Sent routine check-in message. Adewale responded confirming he is doing well and has no complaints at this time.",
        issuesRaised: "",
        actionTaken: "No action required. Logged for records.",
        followUpRequired: false,
        incidentStatus: "Resolved",
      },
    ],
    timeOff: {
      leavesAvailable: 26,
      leavesEarned: 30,
      eligibleLeavesTaken: 4,
      emergencyLeavesTaken: 1,
      currentStatus: "none",
      history: [
        { id: "to1", type: "Annual", startDate: "10 Mar 2026", endDate: "14 Mar 2026", status: "Approved", approvedBy: "Samson Oluwaseun" },
        { id: "to2", type: "Sick", startDate: "26 May 2026", endDate: "27 May 2026", status: "Approved", approvedBy: "Fatima Bello" },
        { id: "to3", type: "Emergency", startDate: "2 Jan 2026", endDate: "3 Jan 2026", status: "Approved", approvedBy: "Tunde Bakare" },
        { id: "to4", type: "Annual", startDate: "20 Jun 2026", endDate: "25 Jun 2026", status: "Pending", approvedBy: "—" },
        { id: "to5", type: "Sick", startDate: "15 Nov 2025", endDate: "15 Nov 2025", status: "Declined", approvedBy: "Ngozi Eze" },
      ],
    },
    hmo: {
      provider: "Hygeia HMO",
      planType: "Basic Plan",
      enrollmentDate: "1 Apr 2024",
      expiryDate: "1 Apr 2026",
      hmoId: "HYG-CHP-001",
      status: "Active",
    },
  },
  "2": {
    id: "2",
    name: "Chinedu Okafor",
    championId: "CHP-002",
    riskLevel: "Low Risk",
    phoneNumber: "+234 802 345 6789",
    location: "Lekki",
    onboardedDate: "22 Apr 2024",
    lastPingedOn: "30 May 2026, 2:15 pm",
    contractStatus: "Active",
    vehicle: {
      status: "Active",
      statusVariant: "success",
      imageUrl: "/images/2wheeler_overview.svg",
      assetType: "2 wheeler",
      manufacturer: "MaxE",
      contractStatus: "Active",
      lastUpdatedBy: "Femi Adeyemi",
      lastPingedOn: "30 May 2026, 2:15 pm",
    },
    maxIdCard: {
      variant: "inactive",
    },
    biodata: {
      fullName: "Chinedu Okafor",
      dateOfBirth: "5 Jan 1988",
      gender: "Male",
      maritalStatus: "Single",
      stateOfOrigin: "Anambra",
      lga: "Onitsha North",
      address: "42 Admiralty Way, Lekki Phase 1, Lagos",
      email: "chinedu.okafor@email.com",
      nextOfKin: "Nkechi Okafor",
      nextOfKinPhone: "+234 803 222 3333",
      bloodGroup: "A+",
      genotype: "AS",
    },
    contracts: {
      contractId: "CNT-2024-002",
      startDate: "22 Apr 2024",
      endDate: "22 Apr 2026",
      vehicleAssigned: "MAX-IN-CH-203",
      dailyRemittance: "\u20A65,000",
      totalRemitted: "\u20A63,850,000",
      outstandingBalance: "\u20A60",
      status: "Active",
      totalDays: 730,
      daysElapsed: 405,
      percentageElapsed: 55,
    },
    wallet: {
      walletId: "WLT-002-CHN",
      balance: "\u20A6412,300",
      lastTransaction: "Bonus Credit",
      lastTransactionDate: "30 May 2026",
      totalCredits: "\u20A65,100,000",
      totalDebits: "\u20A64,687,700",
      bvn: "331****72105",
      bankAccounts: [
        { bankName: "Moniepoint Microfinance Bank", accountNumber: "0224**45012", iconUrl: "/images/moniepoint.svg", isPrimary: true },
        { bankName: "Guaranty Trust Bank", accountNumber: "0335**67890", iconUrl: "/images/guaranty_trust_bank 1.svg" },
      ],
      transactions: [
        { id: "t1", date: "30 May 2026", referenceId: "TXN-20260530-001", transactionType: "Credit", amount: "\u20A610,000", status: "Successful" },
        { id: "t2", date: "29 May 2026", referenceId: "TXN-20260529-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t3", date: "28 May 2026", referenceId: "TXN-20260528-002", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t4", date: "27 May 2026", referenceId: "TXN-20260527-002", transactionType: "Credit", amount: "\u20A650,000", status: "Pending" },
        { id: "t5", date: "26 May 2026", referenceId: "TXN-20260526-002", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
      ],
    },
    tickets: [
      { id: "ct6", ticketId: "TKT-2026-00301", affectedChampion: "Chinedu Okafor", category: "Payment Dispute",    location: "Lagos – Lekki",  assignedAgent: "Chidi Okafor",  ticketCreator: "Chinedu Okafor", priority: "Medium", status: "Open",        sla: "Within SLA",  dateCreated: "29 May 2026" },
      { id: "ct7", ticketId: "TKT-2026-00302", affectedChampion: "Chinedu Okafor", category: "App Issue",          location: "Lagos – Lekki",  assignedAgent: "Ngozi Eze",     ticketCreator: "Chinedu Okafor", priority: "Low",    status: "Closed",      sla: "Within SLA",  dateCreated: "18 May 2026" },
      { id: "ct8", ticketId: "TKT-2026-00303", affectedChampion: "Chinedu Okafor", category: "Vehicle Breakdown",  location: "Lagos – Lekki",  assignedAgent: "Fatima Bello",  ticketCreator: "System",         priority: "High",   status: "In Progress", sla: "At Risk",     dateCreated: "26 May 2026" },
      { id: "ct9", ticketId: "TKT-2026-00304", affectedChampion: "Chinedu Okafor", category: "Insurance Claim",    location: "Lagos – Lekki",  assignedAgent: "Tunde Bakare",  ticketCreator: "System",         priority: "High",   status: "Closed",      sla: "Breached",    dateCreated: "15 May 2026" },
    ],
    fieldOps: [
      {
        id: "fo1",
        date: "30 May 2026",
        status: "Vehicle Inspection",
        statusVariant: "warning",
        description: {
          template: "Inspected vehicle {vehicle} at {location}. All components in good condition, passed inspection.",
          highlights: { vehicle: "MAX-IN-CH-203", location: "Lekki Service Centre" },
        },
        actor: { action: "Carried out by", name: "Emeka Nwankwo" },
        duration: { range: "10:00 am – 11:00 am", total: "1h" },
      },
      {
        id: "fo2",
        date: "30 May 2026",
        status: "Document Collection",
        statusVariant: "info",
        description: {
          template: "Collected updated {document} from {champion} for annual compliance review.",
          highlights: { document: "Driver's License", champion: "Chinedu Okafor" },
        },
        actor: { action: "Carried out by", name: "Femi Adeyemi" },
        duration: { range: "11:30 am – 12:00 pm", total: "30m" },
      },
      {
        id: "fo3",
        date: "22 May 2026",
        status: "Welfare Check",
        statusVariant: "success",
        description: {
          template: "Conducted a welfare check visit with {champion} at {location}. Champion in excellent standing.",
          highlights: { champion: "Chinedu Okafor", location: "42 Admiralty Way, Lekki" },
        },
        actor: { action: "Carried out by", name: "Ngozi Eze" },
        duration: { range: "3:00 pm – 3:30 pm", total: "30m" },
      },
      {
        id: "fo4",
        date: "15 May 2026",
        status: "Vehicle Recovery",
        statusVariant: "danger",
        description: {
          template: "Attempted recovery of vehicle {vehicle} at {location} due to flagged GPS anomaly. False alarm — vehicle confirmed with champion.",
          highlights: { vehicle: "MAX-IN-CH-203", location: "Lekki Phase 1" },
        },
        actor: { action: "Carried out by", name: "Tunde Bakare" },
        duration: { range: "7:30 am – 9:00 am", total: "1h 30m" },
      },
    ],
    guarantors: [
      {
        name: "Obinna Okafor",
        relationship: "Brother",
        phone: "+234 804 444 5555",
        address: "10 Akin Adesola Street, Victoria Island, Lagos",
      },
    ],
    welfareNotes: [
      {
        id: "wn1",
        date: "5 Jun 2026",
        loggedBy: "Emeka Nwankwo",
        channel: "Phone Call",
        interactionType: "Routine Check-In",
        summary: "Bi-weekly check-in call with Chinedu. He is doing well and has no complaints. Positive feedback about recent vehicle maintenance support.",
        issuesRaised: "",
        actionTaken: "No action required. Logged for records.",
        followUpRequired: false,
        incidentStatus: "Resolved",
      },
      {
        id: "wn2",
        date: "22 May 2026",
        loggedBy: "Ngozi Eze",
        channel: "In-Person",
        interactionType: "Routine Check-In",
        summary: "In-person welfare check at Chinedu's operating area. Champion is in good health and maintaining excellent vehicle condition. Discussed upcoming contract renewal.",
        issuesRaised: "Questions about contract renewal terms",
        actionTaken: "Provided preliminary contract renewal information, scheduled meeting with contracts team",
        followUpRequired: true,
        incidentStatus: "Open",
      },
      {
        id: "wn3",
        date: "10 May 2026",
        loggedBy: "Femi Adeyemi",
        channel: "WhatsApp",
        interactionType: "Incident Follow-up",
        summary: "Followed up on GPS anomaly false alarm from 15 May. Confirmed with Chinedu that there are no ongoing issues with the vehicle tracking system.",
        issuesRaised: "",
        actionTaken: "Closed GPS anomaly incident. System calibration confirmed by tech team.",
        followUpRequired: false,
        incidentStatus: "Resolved",
      },
    ],
    timeOff: {
      leavesAvailable: 18,
      leavesEarned: 20,
      eligibleLeavesTaken: 2,
      emergencyLeavesTaken: 0,
      currentStatus: "on-leave",
      currentLeave: { startDate: "7 Jun 2026", endDate: "12 Jun 2026" },
      history: [
        { id: "to1", type: "Annual", startDate: "7 Jun 2026", endDate: "12 Jun 2026", status: "Approved", approvedBy: "Emeka Nwankwo" },
        { id: "to2", type: "Annual", startDate: "10 Feb 2026", endDate: "12 Feb 2026", status: "Approved", approvedBy: "Femi Adeyemi" },
        { id: "to3", type: "Sick", startDate: "5 Dec 2025", endDate: "5 Dec 2025", status: "Approved", approvedBy: "Ngozi Eze" },
      ],
    },
    hmo: {
      provider: "Leadway Health",
      planType: "Standard Plan",
      enrollmentDate: "1 May 2024",
      expiryDate: "1 May 2026",
      hmoId: "LDW-CHP-002",
      status: "Active",
    },
  },
}

export function getChampionDetails(id: string): ChampionDetails {
  return mockChampionDetails[id] || mockChampionDetails["1"]
}
