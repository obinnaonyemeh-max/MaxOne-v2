export interface VehicleIdentifier {
  id: string
  batchId: string
  subBatchId: string
  chassisVin: string
  engineNo: string
  ignitionNo: string
  batterySn: string
  color: string
  receiver: string
}

export type IdentifierInput = Omit<VehicleIdentifier, "id" | "batchId" | "subBatchId">

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

function identifier(
  id: string,
  batchId: string,
  subBatchId: string,
  chassisVin: string,
  engineNo: string,
  ignitionNo: string,
  batterySn: string,
  color: string,
  receiver = "FLEETOPS",
): VehicleIdentifier {
  return { id, batchId, subBatchId, chassisVin, engineNo, ignitionNo, batterySn, color, receiver }
}

export let mockIdentifiers: VehicleIdentifier[] = [
  identifier("1", "BATCH-12-3056", "SB-12-3056-A", "WE3234777TYT", "EV387465", "TH19009", "BAT90909", "YELLOW"),
  identifier("2", "BATCH-12-3056", "SB-12-3056-A", "WE3234778KLM", "EV387466", "TH19010", "BAT90910", "BLACK"),
  identifier("3", "BATCH-12-3056", "SB-12-3056-A", "WE3234779PQR", "EV387467", "TH19011", "BAT90911", "RED"),
  identifier("4", "BATCH-12-3056", "SB-12-3056-B", "WE3234801ABC", "EV388001", "TH19101", "BAT91001", "YELLOW"),
  identifier("5", "BATCH-12-3056", "SB-12-3056-B", "WE3234802DEF", "EV388002", "TH19102", "BAT91002", "WHITE"),
  identifier("6", "BATCH-12-3056", "SB-12-3056-B", "WE3234803GHI", "EV388003", "TH19103", "BAT91003", "BLACK"),
  identifier("7", "BATCH-12-3056", "SB-12-3056-C", "WE3234901JKL", "EV389001", "TH19201", "BAT92001", "YELLOW"),
  identifier("8", "BATCH-12-3056", "SB-12-3056-C", "WE3234902MNO", "EV389002", "TH19202", "BAT92002", "BLUE"),
  identifier("9", "BATCH-12-3056", "SB-12-3056-C", "WE3234903STU", "EV389003", "TH19203", "BAT92003", "RED"),
  identifier("10", "BATCH-12-3056", "SB-12-3056-D", "WE3235001VWX", "EV390001", "TH19301", "BAT93001", "YELLOW"),
  identifier("11", "BATCH-12-3056", "SB-12-3056-D", "WE3235002YZA", "EV390002", "TH19302", "BAT93002", "BLACK"),
  identifier("12", "BATCH-0990", "SB-0990-A", "SP0990001AAA", "SP387001", "IG09901", "BAT09901", "GREEN"),
  identifier("13", "BATCH-0990", "SB-0990-A", "SP0990002BBB", "SP387002", "IG09902", "BAT09902", "WHITE"),
  identifier("14", "BATCH-0990", "SB-0990-B", "SP0990101CCC", "SP388001", "IG09911", "BAT09911", "GREEN"),
]

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
