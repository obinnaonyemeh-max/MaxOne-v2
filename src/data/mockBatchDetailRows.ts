export interface VehicleIdentifier {
  id: string
  chassisVin: string
  engineNo: string
  ignitionNo: string
  batterySn: string
  color: string
  receiver: string
}

export interface RegistrationRecord {
  id: string
  chassisNo: string
  engineNo: string
  status: "Not Started" | "Registration In Progress" | "Registration Completed"
  assignedOfficer: string
  dateAssigned: string
}

export interface BatchDocument {
  id: string
  document: string
  type: string
  uploaded: string
}

export const mockIdentifiers = [
  {
    id: "1",
    chassisVin: "WE3234777TYT",
    engineNo: "EV387465",
    ignitionNo: "TH19009",
    batterySn: "BAT90909",
    color: "YELLOW",
    receiver: "FLEETOPS",
  },
] satisfies VehicleIdentifier[]

export const mockRegistrationRecords = [
  {
    id: "1",
    chassisNo: "WE33344YHTUJ33",
    engineNo: "2657748HG",
    status: "Registration Completed",
    assignedOfficer: "Adebayo Ogunlesi",
    dateAssigned: "2026-03-10",
  },
  {
    id: "2",
    chassisNo: "KL78821MXNR45",
    engineNo: "EV449821",
    status: "Registration In Progress",
    assignedOfficer: "Chioma Nwosu",
    dateAssigned: "2026-03-15",
  },
  {
    id: "3",
    chassisNo: "TX90112BQWF67",
    engineNo: "EV552034",
    status: "Not Started",
    assignedOfficer: "",
    dateAssigned: "",
  },
  {
    id: "4",
    chassisNo: "AB44520RTJK89",
    engineNo: "EV661198",
    status: "Registration In Progress",
    assignedOfficer: "Fatima Abdullahi",
    dateAssigned: "2026-03-18",
  },
  {
    id: "5",
    chassisNo: "NG33019PLMZ12",
    engineNo: "EV773345",
    status: "Not Started",
    assignedOfficer: "",
    dateAssigned: "",
  },
] satisfies RegistrationRecord[]

export const mockDocuments = [
  { id: "1", document: "INV-2026-0034.pdf", type: "Supplier Invoice", uploaded: "10 Mar 2026" },
  { id: "2", document: "BOL-BATCH003-NG.pdf", type: "Bill of Lading", uploaded: "12 Mar 2026" },
  { id: "3", document: "CUSTOMS-DEC-003.pdf", type: "Customs Declaration", uploaded: "15 Mar 2026" },
  { id: "4", document: "INSURANCE-CERT-003.pdf", type: "Insurance Certificate", uploaded: "16 Mar 2026" },
] satisfies BatchDocument[]
