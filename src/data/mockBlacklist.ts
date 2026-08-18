// Mock data for the Portfolio > Champions > Blacklist page.
// Two independent lists: blacklisted champions and blacklisted guarantors.

export type BlacklistStatus = "Blacklisted"

export interface BlacklistedChampion {
  id: string
  name: string
  maxId: string
  status: BlacklistStatus
  country: string
  city: string
  phone: string
}

export type GuarantorType = "Individual" | "Corporate"

export interface BlacklistedGuarantor {
  id: string
  name: string
  guarantorId: string
  status: BlacklistStatus
  type: GuarantorType
  lga: string
  phone: string
}

export const mockBlacklistedChampions: BlacklistedChampion[] = [
  { id: "bc-1", name: "Adewale Ogunleye", maxId: "MAX-CHP-001", status: "Blacklisted", country: "Nigeria", city: "Lagos", phone: "+234 801 234 5678" },
  { id: "bc-2", name: "Chinedu Okafor", maxId: "MAX-CHP-014", status: "Blacklisted", country: "Nigeria", city: "Onitsha", phone: "+234 803 555 1290" },
  { id: "bc-3", name: "Ibrahim Musa", maxId: "MAX-CHP-027", status: "Blacklisted", country: "Nigeria", city: "Kano", phone: "+234 809 771 4432" },
  { id: "bc-4", name: "Tunde Bakare", maxId: "MAX-CHP-039", status: "Blacklisted", country: "Nigeria", city: "Ibadan", phone: "+234 806 220 9981" },
  { id: "bc-5", name: "Emeka Nwosu", maxId: "MAX-CHP-052", status: "Blacklisted", country: "Nigeria", city: "Enugu", phone: "+234 812 004 6677" },
  { id: "bc-6", name: "Yusuf Abdullahi", maxId: "MAX-CHP-061", status: "Blacklisted", country: "Nigeria", city: "Kaduna", phone: "+234 815 908 3321" },
  { id: "bc-7", name: "Segun Adeyemi", maxId: "MAX-CHP-078", status: "Blacklisted", country: "Nigeria", city: "Abeokuta", phone: "+234 807 442 1180" },
  { id: "bc-8", name: "Kelechi Eze", maxId: "MAX-CHP-090", status: "Blacklisted", country: "Nigeria", city: "Port Harcourt", phone: "+234 802 663 7754" },
]

export const mockBlacklistedGuarantors: BlacklistedGuarantor[] = [
  { id: "bg-1", name: "Folake Ogunleye", guarantorId: "GRT-001", status: "Blacklisted", type: "Individual", lga: "Ikeja", phone: "+234 801 111 2222" },
  { id: "bg-2", name: "Nkechi Okafor", guarantorId: "GRT-018", status: "Blacklisted", type: "Individual", lga: "Onitsha North", phone: "+234 803 908 5512" },
  { id: "bg-3", name: "Bright Ventures Ltd", guarantorId: "GRT-024", status: "Blacklisted", type: "Corporate", lga: "Kano Municipal", phone: "+234 809 220 7788" },
  { id: "bg-4", name: "Rasheed Bakare", guarantorId: "GRT-031", status: "Blacklisted", type: "Individual", lga: "Ibadan North", phone: "+234 806 771 3390" },
  { id: "bg-5", name: "Chioma Nwosu", guarantorId: "GRT-045", status: "Blacklisted", type: "Individual", lga: "Enugu East", phone: "+234 812 556 1044" },
  { id: "bg-6", name: "Sahara Logistics Ltd", guarantorId: "GRT-052", status: "Blacklisted", type: "Corporate", lga: "Kaduna South", phone: "+234 815 330 9982" },
  { id: "bg-7", name: "Adebola Adeyemi", guarantorId: "GRT-066", status: "Blacklisted", type: "Individual", lga: "Abeokuta South", phone: "+234 807 118 4402" },
]
