import type { TimelineEntryData, AssignmentRecord } from "@/components/max"
import type { TicketRecord } from "@/data/mockTicketRecords"
import type { MovementLogRecord } from "@/data/mockAssetMovement"
import {
  championLocationLabel,
  getChampionById,
  mockChampions,
  type Champion,
} from "@/data/mockChampions"

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
  city: string
  subcity: string
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

  vehicleDetails: {
    basicInfo: {
      vehicleType: string
      model: string
      trim: string
      platformType: string
    }
    identification: {
      chassisNumber: string
      engineNumber: string
      ignitionNumber: string
      plateNumber: string
    }
    vendor: {
      oemVendorName: string
      financialPartner: string
    }
    assignment: {
      location: string
      receiver: string
      deliveryDate: string
      licenseExpiration: string
    }
    telematics: {
      simSerialNumber: string
      deviceImei: string
      phoneNumber: string
      helmetNumber: string
    }
    assignmentHistory: AssignmentRecord[]
    statusHistory: TimelineEntryData[]
  }

  assetMovement: {
    movementLog: MovementLogRecord[]
  }

  maxIdCard: {
    variant: "active" | "inactive"
    dateGenerated?: string
    generatedBy?: string
  }

  biodata: {
    fullName: string
    age: string
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

const authoredChampionDetails: Record<string, Omit<ChampionDetails, "city" | "subcity"> & { city?: string; subcity?: string }> = {
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
    vehicleDetails: {
      basicInfo: {
        vehicleType: "eMotorcycle",
        model: "Max E Series",
        trim: "M2",
        platformType: "Enterprise",
      },
      identification: {
        chassisNumber: "358TF6EFD16D1379",
        engineNumber: "52DSH8313077",
        ignitionNumber: "85949342",
        plateNumber: "EN 234 LSG",
      },
      vendor: {
        oemVendorName: "GreenDrive Auto",
        financialPartner: "Yamaha",
      },
      assignment: {
        location: "Ikeja",
        receiver: "Adewale Ogunleye",
        deliveryDate: "15 Mar 2024",
        licenseExpiration: "15 Mar 2027",
      },
      telematics: {
        simSerialNumber: "317GJD7931J",
        deviceImei: "232RYK24224",
        phoneNumber: "07037645392",
        helmetNumber: "MAX-HEM553",
      },
      assignmentHistory: [
        {
          id: "1",
          duration: "15 Mar 2024 - Current",
          assigneeName: "Adewale Ogunleye",
          status: "Active",
          isCurrent: true,
        },
        {
          id: "2",
          duration: "10 Sep 2023 - 14 Mar 2024",
          assigneeName: "Emeka Okafor",
          status: "Inactive",
          isCurrent: false,
        },
      ],
      statusHistory: [
        {
          id: "sh1",
          date: "May 2026",
          status: "Asset Checkout",
          statusVariant: "info",
          description: {
            template: "Vehicle has been given to {champion} and {action} of the {location}",
            highlights: {
              champion: "Adewale Ogunleye",
              action: "checked out",
              location: "Ikeja office",
            },
          },
          actor: {
            action: "Checked out by",
            name: "Samson Oluwaseun",
          },
          duration: {
            range: "15 Mar - 16 Mar",
            total: "24 hrs",
          },
        },
        {
          id: "sh2",
          date: "Apr 2026",
          status: "3rd Party Check-In",
          statusVariant: "danger",
          description: {
            template: "{champion} takes the vehicle to an approved {location} for vehicle maintenance.",
            highlights: {
              champion: "Adewale Ogunleye",
              location: "3rd party",
            },
          },
          actor: {
            action: "Checked in by",
            name: "Tunde Bakare",
          },
          duration: {
            range: "10 Apr - 12 Apr",
            total: "2 days",
          },
        },
        {
          id: "sh3",
          date: "Mar 2024",
          status: "HP Completed",
          statusVariant: "success",
          description: {
            template: "Vehicle transfer to {champion} was {status}",
            highlights: {
              champion: "Adewale Ogunleye",
              status: "completed",
            },
          },
          actor: {
            action: "Initiated by",
            name: "Samson Oluwaseun",
          },
          duration: {
            range: "14 Mar - 15 Mar",
            total: "24 hrs",
          },
        },
      ],
    },
    assetMovement: {
      movementLog: [
        {
          id: "ml1",
          assetType: "2 Wheeler",
          assetId: "MAX-IB-CH-203",
          timestamp: "28 May 2026 10:23",
          plateNumber: "EN 234 LSG",
          movementType: "Check-Out",
          movementReason: "Active Vehicle",
          location: "Ikeja Yard",
          officer: "Samson Oluwaseun",
          referenceSource: "CO-201",
        },
        {
          id: "ml2",
          assetType: "2 Wheeler",
          assetId: "MAX-IB-CH-203",
          timestamp: "10 Apr 2026 09:00",
          plateNumber: "EN 234 LSG",
          movementType: "Check-In",
          movementReason: "Maintenance",
          location: "Ikeja Yard",
          officer: "Tunde Bakare",
          referenceSource: "CI-301",
        },
        {
          id: "ml3",
          assetType: "2 Wheeler",
          assetId: "MAX-IB-CH-203",
          timestamp: "15 Mar 2024 14:30",
          plateNumber: "EN 234 LSG",
          movementType: "Check-Out",
          movementReason: "Active Vehicle",
          location: "Ikeja Yard",
          officer: "Samson Oluwaseun",
          referenceSource: "CO-101",
        },
      ],
    },
    maxIdCard: {
      variant: "active",
      dateGenerated: "18 Mar 2024",
      generatedBy: "Samson Oluwaseun",
    },
    biodata: {
      fullName: "Adewale Ogunleye",
      age: "36 years",
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
        { id: "t1", date: "28 May 2026, 09:15 AM", referenceId: "TXN-20260528-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t2", date: "27 May 2026, 02:30 PM", referenceId: "TXN-20260527-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t3", date: "26 May 2026, 11:45 AM", referenceId: "TXN-20260526-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t4", date: "25 May 2026, 08:00 AM", referenceId: "TXN-20260525-001", transactionType: "Credit", amount: "\u20A625,000", status: "Successful" },
        { id: "t5", date: "24 May 2026, 04:20 PM", referenceId: "TXN-20260524-001", transactionType: "Debit", amount: "\u20A65,000", status: "Failed" },
        { id: "t6", date: "23 May 2026, 10:05 AM", referenceId: "TXN-20260523-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t7", date: "22 May 2026, 01:50 PM", referenceId: "TXN-20260522-001", transactionType: "Credit", amount: "\u20A612,500", status: "Pending" },
        { id: "t8", date: "21 May 2026, 03:35 PM", referenceId: "TXN-20260521-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
      ],
    },
    tickets: [],
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
    vehicleDetails: {
      basicInfo: {
        vehicleType: "eTricycle",
        model: "Max T Series",
        trim: "T3",
        platformType: "Enterprise",
      },
      identification: {
        chassisNumber: "458TF6EFD16D1380",
        engineNumber: "62DSH8313078",
        ignitionNumber: "95949343",
        plateNumber: "EN 235 LSG",
      },
      vendor: {
        oemVendorName: "GreenDrive Auto",
        financialPartner: "Yamaha",
      },
      assignment: {
        location: "Lekki",
        receiver: "Chinedu Okafor",
        deliveryDate: "22 Apr 2024",
        licenseExpiration: "22 Apr 2027",
      },
      telematics: {
        simSerialNumber: "418HKE8042K",
        deviceImei: "343SZL35335",
        phoneNumber: "08051234567",
        helmetNumber: "MAX-HEM554",
      },
      assignmentHistory: [
        {
          id: "1",
          duration: "22 Apr 2024 - Current",
          assigneeName: "Chinedu Okafor",
          status: "Active",
          isCurrent: true,
        },
      ],
      statusHistory: [
        {
          id: "sh1",
          date: "May 2026",
          status: "Asset Checkout",
          statusVariant: "info",
          description: {
            template: "Vehicle has been given to {champion} and {action} of the {location}",
            highlights: {
              champion: "Chinedu Okafor",
              action: "checked out",
              location: "Lekki office",
            },
          },
          actor: {
            action: "Checked out by",
            name: "Femi Adeyemi",
          },
          duration: {
            range: "22 Apr - 23 Apr",
            total: "24 hrs",
          },
        },
        {
          id: "sh2",
          date: "Apr 2024",
          status: "HP Completed",
          statusVariant: "success",
          description: {
            template: "Vehicle transfer to {champion} was {status}",
            highlights: {
              champion: "Chinedu Okafor",
              status: "completed",
            },
          },
          actor: {
            action: "Initiated by",
            name: "Femi Adeyemi",
          },
          duration: {
            range: "20 Apr - 22 Apr",
            total: "2 days",
          },
        },
      ],
    },
    assetMovement: {
      movementLog: [
        {
          id: "ml1",
          assetType: "3 Wheeler",
          assetId: "MAX-IN-CH-203",
          timestamp: "30 May 2026 14:15",
          plateNumber: "EN 235 LSG",
          movementType: "Check-Out",
          movementReason: "Active Vehicle",
          location: "Lekki Yard",
          officer: "Femi Adeyemi",
          referenceSource: "CO-301",
        },
        {
          id: "ml2",
          assetType: "3 Wheeler",
          assetId: "MAX-IN-CH-203",
          timestamp: "22 Apr 2024 11:00",
          plateNumber: "EN 235 LSG",
          movementType: "Check-Out",
          movementReason: "Active Vehicle",
          location: "Lekki Yard",
          officer: "Femi Adeyemi",
          referenceSource: "CO-201",
        },
      ],
    },
    maxIdCard: {
      variant: "inactive",
    },
    biodata: {
      fullName: "Chinedu Okafor",
      age: "38 years",
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
        { id: "t1", date: "30 May 2026, 10:30 AM", referenceId: "TXN-20260530-001", transactionType: "Credit", amount: "\u20A610,000", status: "Successful" },
        { id: "t2", date: "29 May 2026, 03:15 PM", referenceId: "TXN-20260529-001", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t3", date: "28 May 2026, 09:45 AM", referenceId: "TXN-20260528-002", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
        { id: "t4", date: "27 May 2026, 12:00 PM", referenceId: "TXN-20260527-002", transactionType: "Credit", amount: "\u20A650,000", status: "Pending" },
        { id: "t5", date: "26 May 2026, 05:20 PM", referenceId: "TXN-20260526-002", transactionType: "Debit", amount: "\u20A65,000", status: "Successful" },
      ],
    },
    tickets: [],
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

function applySeedIdentity(
  details: Omit<ChampionDetails, "city" | "subcity"> & { city?: string; subcity?: string },
  seed: Champion
): ChampionDetails {
  return {
    ...details,
    name: seed.name,
    championId: seed.championId,
    avatarUrl: seed.avatarUrl,
    phoneNumber: seed.contactNumber,
    location: championLocationLabel(seed),
    city: seed.city,
    subcity: seed.subcity,
    vehicleDetails: {
      ...details.vehicleDetails,
      identification: {
        ...details.vehicleDetails.identification,
        plateNumber: seed.plateNumber,
      },
      assignment: {
        ...details.vehicleDetails.assignment,
        location: seed.subcity,
        receiver: seed.name,
      },
    },
  }
}

function synthesizeChampionDetails(seed: Champion): ChampionDetails {
  const location = championLocationLabel(seed)
  const n = Number.parseInt(seed.id, 10) || 1
  const outstanding = seed.outstandingBalance
  const contractStatus = outstanding > 250000 ? "Inactive" : "Active"

  return {
    id: seed.id,
    name: seed.name,
    championId: seed.championId,
    avatarUrl: seed.avatarUrl,
    riskLevel: outstanding > 200000 ? "High Risk" : outstanding > 0 ? "Medium Risk" : "Low Risk",
    phoneNumber: seed.contactNumber,
    location,
    city: seed.city,
    subcity: seed.subcity,
    onboardedDate: "12 Jan 2025",
    lastPingedOn: `${seed.lastActiveDate}, 9:00 am`,
    contractStatus,
    vehicle: {
      status: contractStatus === "Active" ? "Active" : "Asset Checkout",
      statusVariant: contractStatus === "Active" ? "success" : "info",
      imageUrl: "/images/2wheeler_overview.svg",
      assetType: n % 3 === 0 ? "3 wheeler" : "2 wheeler",
      manufacturer: "MaxE",
      contractStatus,
      lastUpdatedBy: "Femi Adeyemi",
      lastPingedOn: `${seed.lastActiveDate}, 9:00 am`,
    },
    vehicleDetails: {
      basicInfo: {
        vehicleType: n % 3 === 0 ? "eTricycle" : "eMotorcycle",
        model: n % 3 === 0 ? "Max T Series" : "Max E Series",
        trim: n % 3 === 0 ? "T3" : "M2",
        platformType: "Enterprise",
      },
      identification: {
        chassisNumber: `358TF6EFD16D${String(1300 + n).padStart(4, "0")}`,
        engineNumber: `52DSH${String(8313000 + n)}`,
        ignitionNumber: String(85949000 + n),
        plateNumber: seed.plateNumber,
      },
      vendor: {
        oemVendorName: "GreenDrive Auto",
        financialPartner: "Yamaha",
      },
      assignment: {
        location: seed.subcity,
        receiver: seed.name,
        deliveryDate: "12 Jan 2025",
        licenseExpiration: "12 Jan 2028",
      },
      telematics: {
        simSerialNumber: `317GJD${String(7900 + n)}`,
        deviceImei: `232RYK${String(24000 + n)}`,
        phoneNumber: seed.contactNumber.replace(/\s/g, ""),
        helmetNumber: `MAX-HEM${String(550 + n)}`,
      },
      assignmentHistory: [
        {
          id: "1",
          duration: "12 Jan 2025 - Current",
          assigneeName: seed.name,
          status: "Active",
          isCurrent: true,
        },
      ],
      statusHistory: [
        {
          id: `sh-${seed.id}`,
          date: "Jan 2025",
          status: "Asset Checkout",
          statusVariant: "info",
          description: {
            template: "Vehicle has been given to {champion} and {action} of the {location}",
            highlights: {
              champion: seed.name,
              action: "checked out",
              location: `${seed.subcity} office`,
            },
          },
          actor: { action: "Checked out by", name: "Femi Adeyemi" },
          duration: { range: "12 Jan - 13 Jan", total: "24 hrs" },
        },
      ],
    },
    assetMovement: { movementLog: [] },
    maxIdCard: { variant: contractStatus === "Active" ? "active" : "inactive" },
    biodata: {
      fullName: seed.name,
      age: `${28 + (n % 15)} years`,
      dateOfBirth: "1 Jan 1994",
      gender: n % 4 === 0 ? "Female" : "Male",
      maritalStatus: n % 2 === 0 ? "Married" : "Single",
      stateOfOrigin: seed.city,
      lga: seed.subcity,
      address: `${n} Champion Street, ${seed.subcity}, ${seed.city}`,
      email: `${seed.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      nextOfKin: "Next of Kin",
      nextOfKinPhone: "+234 800 000 0000",
      bloodGroup: "O+",
      genotype: "AA",
    },
    contracts: {
      contractId: `CNT-2025-${String(n).padStart(3, "0")}`,
      startDate: "12 Jan 2025",
      endDate: "12 Jan 2027",
      vehicleAssigned: `MAX-${seed.city.slice(0, 2).toUpperCase()}-CH-${200 + n}`,
      dailyRemittance: "₦5,000",
      totalRemitted: "₦2,500,000",
      outstandingBalance: outstanding > 0 ? `₦${outstanding.toLocaleString()}` : "₦0",
      status: contractStatus,
      totalDays: 730,
      daysElapsed: 200,
      percentageElapsed: 27,
    },
    wallet: {
      walletId: `WLT-${String(n).padStart(3, "0")}`,
      balance: "₦50,000",
      lastTransaction: "Daily Remittance Payment",
      lastTransactionDate: seed.lastActiveDate,
      totalCredits: "₦2,800,000",
      totalDebits: "₦2,750,000",
      bvn: "228****89008",
      bankAccounts: [
        {
          bankName: "Moniepoint Microfinance Bank",
          accountNumber: "0118**89098",
          iconUrl: "/images/moniepoint.svg",
          isPrimary: true,
        },
      ],
      transactions: [],
    },
    guarantors: [],
    fieldOps: [],
    tickets: [],
    welfareNotes: [],
    timeOff: {
      leavesAvailable: 20,
      leavesEarned: 20,
      eligibleLeavesTaken: 0,
      emergencyLeavesTaken: 0,
      currentStatus: "none",
      history: [],
    },
    hmo: {
      provider: "Hygeia HMO",
      planType: "Basic Plan",
      enrollmentDate: "1 Feb 2025",
      expiryDate: "1 Feb 2027",
      hmoId: `HYG-${seed.championId}`,
      status: "Active",
    },
  }
}

export function getChampionDetails(id: string): ChampionDetails | undefined {
  const seed = getChampionById(id)
  if (!seed) return undefined
  const overlay = authoredChampionDetails[id]
  if (overlay) return applySeedIdentity(overlay, seed)
  return synthesizeChampionDetails(seed)
}

export function listChampionDetails(): ChampionDetails[] {
  return mockChampions
    .map((champion) => getChampionDetails(champion.id))
    .filter((details): details is ChampionDetails => details != null)
}

export const mockChampionDetails: Record<string, ChampionDetails> = Object.fromEntries(
  listChampionDetails().map((details) => [details.id, details])
)
