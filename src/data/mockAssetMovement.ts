export interface CheckInRecord {
  id: string
  assetType: string
  assetId: string
  checkInType: "Yard Check-In" | "3PL Check-In" | "Inbound"
  reason: string
  location: string
  checkInDate: string
  days: number
  sla: number
  breachStatus: "Breached" | "Near SLA" | "Within SLA"
  nextAction: "Deactivate" | "Follow Up" | "Assessment Required" | "Monitor" | "Escalate"
}

export interface CheckoutRecord {
  id: string
  assetType: string
  assetId: string
  plateNumber: string
  checkInDate: string
  checkOutDate: string
  checkInReason: string
  checkOutStatus: "Active Vehicle" | "OEM Outbound" | "Outright Sale" | "Operational Vehicle"
  location: string
  officer: string
}

export interface MovementLogRecord {
  id: string
  assetType: string
  assetId: string
  timestamp: string
  plateNumber: string
  movementType: "Check-In" | "Check-Out"
  movementReason: string
  location: string
  officer: string
  referenceSource: string
}

export const mockCheckInRecords = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    checkInType: "Yard Check-In",
    reason: "Maintenance",
    location: "Ekiti",
    checkInDate: "12 Mar 2026",
    days: 5,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
  {
    id: "2",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-204",
    checkInType: "3PL Check-In",
    reason: "Accident",
    location: "Gbagba",
    checkInDate: "10 Mar 2026",
    days: 7,
    sla: 7,
    breachStatus: "Near SLA",
    nextAction: "Follow Up",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-205",
    checkInType: "Yard Check-In",
    reason: "Driver Churn",
    location: "Eleyele",
    checkInDate: "8 Mar 2026",
    days: 10,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Deactivate",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-206",
    checkInType: "Inbound",
    reason: "Inbound- Ready for Activation",
    location: "Karu",
    checkInDate: "11 Mar 2026",
    days: 2,
    sla: 5,
    breachStatus: "Within SLA",
    nextAction: "Assessment Required",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-207",
    checkInType: "Yard Check-In",
    reason: "Financial Default",
    location: "Bodija",
    checkInDate: "5 Mar 2026",
    days: 12,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Escalate",
  },
  {
    id: "6",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-208",
    checkInType: "3PL Check-In",
    reason: "3rd Party Maintenance",
    location: "Lekki",
    checkInDate: "9 Mar 2026",
    days: 6,
    sla: 7,
    breachStatus: "Near SLA",
    nextAction: "Follow Up",
  },
  {
    id: "7",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-209",
    checkInType: "Yard Check-In",
    reason: "Operational Vehicle",
    location: "Ekiti",
    checkInDate: "7 Mar 2026",
    days: 8,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Deactivate",
  },
  {
    id: "8",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-210",
    checkInType: "Yard Check-In",
    reason: "Time-Off",
    location: "Gbagba",
    checkInDate: "11 Mar 2026",
    days: 3,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
  {
    id: "9",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-211",
    checkInType: "Yard Check-In",
    reason: "Impoundment",
    location: "Eleyele",
    checkInDate: "6 Mar 2026",
    days: 9,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Escalate",
  },
  {
    id: "10",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-212",
    checkInType: "Inbound",
    reason: "Inbound- Ready for Activation",
    location: "Karu",
    checkInDate: "10 Mar 2026",
    days: 4,
    sla: 5,
    breachStatus: "Near SLA",
    nextAction: "Assessment Required",
  },
  {
    id: "11",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-213",
    checkInType: "Yard Check-In",
    reason: "Maintenance",
    location: "Bodija",
    checkInDate: "12 Mar 2026",
    days: 1,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
] satisfies CheckInRecord[]

export const mockCheckoutRecords = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-101",
    plateNumber: "LAG-101-AA",
    checkInDate: "2026-03-06",
    checkOutDate: "2026-03-11",
    checkInReason: "Maintenance",
    checkOutStatus: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
  },
  {
    id: "2",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-202",
    plateNumber: "LAG-202-BB",
    checkInDate: "2026-03-03",
    checkOutDate: "2026-03-11",
    checkInReason: "Financial Default",
    checkOutStatus: "OEM Outbound",
    location: "Surulere Yard",
    officer: "Funmi A.",
  },
  {
    id: "3",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-303",
    plateNumber: "ABJ-303-CC",
    checkInDate: "2026-02-25",
    checkOutDate: "2026-03-10",
    checkInReason: "Impoundment / Law Enforcement",
    checkOutStatus: "Outright Sale",
    location: "Abeokuta Yard",
    officer: "Emeka I.",
  },
  {
    id: "4",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-404",
    plateNumber: "LAG-404-DD",
    checkInDate: "2026-03-08",
    checkOutDate: "2026-03-11",
    checkInReason: "Operational Vehicle",
    checkOutStatus: "Operational Vehicle",
    location: "Ikeja Yard",
    officer: "Chidi N.",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-505",
    plateNumber: "LAG-505-EE",
    checkInDate: "2026-03-09",
    checkOutDate: "2026-03-11",
    checkInReason: "Inbound – Ready for Activation",
    checkOutStatus: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
  },
] satisfies CheckoutRecord[]

export const mockMovementLogRecords = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-202",
    timestamp: "11 Mar 2026 15:00",
    plateNumber: "LAG-202-BB",
    movementType: "Check-Out",
    movementReason: "OEM Outbound",
    location: "Surulere Yard",
    officer: "Funmi A.",
    referenceSource: "CO-102",
  },
  {
    id: "2",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-101",
    timestamp: "11 Mar 2026 14:45",
    plateNumber: "LAG-101-AA",
    movementType: "Check-Out",
    movementReason: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CO-101",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-404",
    timestamp: "11 Mar 2026 14:30",
    plateNumber: "LAG-404-DD",
    movementType: "Check-Out",
    movementReason: "Operational Vehicle",
    location: "Ikeja Yard",
    officer: "Chidi N.",
    referenceSource: "CO-104",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-505",
    timestamp: "11 Mar 2026 14:15",
    plateNumber: "LAG-505-EE",
    movementType: "Check-Out",
    movementReason: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CO-105",
  },
  {
    id: "5",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-303",
    timestamp: "11 Mar 2026 14:00",
    plateNumber: "ABJ-303-CC",
    movementType: "Check-Out",
    movementReason: "Outright Sale",
    location: "Abeokuta Yard",
    officer: "Emeka I.",
    referenceSource: "CO-103",
  },
  {
    id: "6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-201",
    timestamp: "11 Mar 2026 13:45",
    plateNumber: "GH-201-KL",
    movementType: "Check-Out",
    movementReason: "Inbound – Ready for Activation",
    location: "Ibadan 3PL",
    officer: "Kofi M.",
    referenceSource: "CO-107",
  },
  {
    id: "7",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-501",
    timestamp: "11 Mar 2026 13:30",
    plateNumber: "LAG-501-UV",
    movementType: "Check-In",
    movementReason: "Maintenance",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CI-111",
  },
] satisfies MovementLogRecord[]
