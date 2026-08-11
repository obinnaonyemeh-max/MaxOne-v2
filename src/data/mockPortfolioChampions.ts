export type RetrievalStatus =
  | "Good Standing"
  | "Retrieved"
  | "Prepaid"
  | "Due for Retrieval"
  | "Overdue"

export type ContractStatus =
  | "Active"
  | "Closed"
  | "Initiated"
  | "Marked for Closure"
  | "Paused"

export interface PortfolioChampion {
  id: string
  name: string
  maxId: string
  contact: string
  location: string
  daysOverdue: number | null
  amountOverdue: number | null
  lastRemittance: number
  dateOfLastRemittance: string
  retrievalStatus: RetrievalStatus
  contractStatus: ContractStatus
}

// Rows visible in the reference design
const seedChampions: PortfolioChampion[] = [
  { id: "1", name: "Musa Yeboah", maxId: "MAX-CH-JJ-7391", contact: "+234732152777", location: "Jinja", daysOverdue: null, amountOverdue: null, lastRemittance: 17899, dateOfLastRemittance: "25 Jul 2026", retrievalStatus: "Good Standing", contractStatus: "Active" },
  { id: "2", name: "Fatima Kanu", maxId: "MAX-CH-PH-4763", contact: "+234778203017", location: "Port Harcourt", daysOverdue: 30, amountOverdue: 29533, lastRemittance: 10339, dateOfLastRemittance: "16 Jul 2026", retrievalStatus: "Retrieved", contractStatus: "Closed" },
  { id: "3", name: "Ada Uche", maxId: "MAX-CH-MB-7855", contact: "+234728311042", location: "Mombasa", daysOverdue: null, amountOverdue: null, lastRemittance: 9938, dateOfLastRemittance: "25 Jul 2026", retrievalStatus: "Good Standing", contractStatus: "Closed" },
  { id: "4", name: "Chuka Njoku", maxId: "MAX-CH-BC-7949", contact: "+234745085733", location: "Benin City", daysOverdue: null, amountOverdue: null, lastRemittance: 4538, dateOfLastRemittance: "17 Jul 2026", retrievalStatus: "Prepaid", contractStatus: "Initiated" },
  { id: "5", name: "Ada Yeboah", maxId: "MAX-CH-TM-5042", contact: "+234728527091", location: "Tamale", daysOverdue: null, amountOverdue: null, lastRemittance: 9138, dateOfLastRemittance: "17 Jul 2026", retrievalStatus: "Good Standing", contractStatus: "Marked for Closure" },
  { id: "6", name: "Ada Okonkwo", maxId: "MAX-CH-KU-1571", contact: "+234797313956", location: "Kumasi", daysOverdue: 32, amountOverdue: 18909, lastRemittance: 14432, dateOfLastRemittance: "19 Jul 2026", retrievalStatus: "Due for Retrieval", contractStatus: "Initiated" },
  { id: "7", name: "Chinedu Eze", maxId: "MAX-CH-MB-1202", contact: "+234725257201", location: "Mombasa", daysOverdue: 43, amountOverdue: 74289, lastRemittance: 4712, dateOfLastRemittance: "15 Jul 2026", retrievalStatus: "Due for Retrieval", contractStatus: "Marked for Closure" },
  { id: "8", name: "Chinedu Balogun", maxId: "MAX-CH-KP-7045", contact: "+234728406206", location: "Kampala", daysOverdue: 13, amountOverdue: 16244, lastRemittance: 4050, dateOfLastRemittance: "21 Jul 2026", retrievalStatus: "Due for Retrieval", contractStatus: "Closed" },
  { id: "9", name: "Nia Kamau", maxId: "MAX-CH-MB-6638", contact: "+234772958675", location: "Mbarara", daysOverdue: null, amountOverdue: null, lastRemittance: 17816, dateOfLastRemittance: "21 Jul 2026", retrievalStatus: "Prepaid", contractStatus: "Initiated" },
  { id: "10", name: "Kwame Diallo", maxId: "MAX-CH-MB-3231", contact: "+234784177811", location: "Mbarara", daysOverdue: null, amountOverdue: null, lastRemittance: 11582, dateOfLastRemittance: "17 Jul 2026", retrievalStatus: "Good Standing", contractStatus: "Marked for Closure" },
  { id: "11", name: "Adaeze Owusu", maxId: "MAX-CH-KU-7732", contact: "+234737841220", location: "Kumasi", daysOverdue: 15, amountOverdue: 24411, lastRemittance: 12942, dateOfLastRemittance: "18 Jul 2026", retrievalStatus: "Overdue", contractStatus: "Closed" },
  { id: "12", name: "Fatima Adebayo", maxId: "MAX-CH-JJ-6158", contact: "+234713875171", location: "Jinja", daysOverdue: null, amountOverdue: null, lastRemittance: 6431, dateOfLastRemittance: "22 Jul 2026", retrievalStatus: "Good Standing", contractStatus: "Active" },
]

const firstNames = ["Emeka", "Amara", "Tunde", "Ngozi", "Yusuf", "Bola", "Kofi", "Zainab", "Femi", "Chidi", "Aisha", "Segun"]
const lastNames = ["Mensah", "Achebe", "Bello", "Okafor", "Adeyemi", "Nwosu", "Ofori", "Danjuma", "Ibrahim", "Eze", "Kamau", "Yeboah"]
const locationCodes: [string, string][] = [
  ["Jinja", "JJ"], ["Port Harcourt", "PH"], ["Mombasa", "MB"], ["Benin City", "BC"],
  ["Tamale", "TM"], ["Kumasi", "KU"], ["Kampala", "KP"], ["Mbarara", "MB"],
]
const retrievalPool: RetrievalStatus[] = ["Good Standing", "Retrieved", "Prepaid", "Due for Retrieval", "Overdue"]
const contractPool: ContractStatus[] = ["Active", "Closed", "Initiated", "Marked for Closure", "Paused"]

// Deterministically extend to 48 rows so pagination has multiple pages
const extraChampions: PortfolioChampion[] = Array.from({ length: 36 }, (_, i) => {
  const n = i + 13
  const [location, code] = locationCodes[i % locationCodes.length]
  const retrievalStatus = retrievalPool[i % retrievalPool.length]
  const contractStatus = contractPool[i % contractPool.length]
  const isOverdue =
    retrievalStatus === "Overdue" ||
    retrievalStatus === "Due for Retrieval" ||
    retrievalStatus === "Retrieved"
  return {
    id: String(n),
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`,
    maxId: `MAX-CH-${code}-${1000 + n * 7}`,
    contact: `+234${(7000000000 + n * 1357913).toString().slice(0, 10)}`,
    location,
    daysOverdue: isOverdue ? 8 + ((i * 7) % 55) : null,
    amountOverdue: isOverdue ? 5000 + ((i * 4321) % 80000) : null,
    lastRemittance: 3000 + ((i * 911) % 16000),
    dateOfLastRemittance: `${10 + (i % 18)} Jul 2026`,
    retrievalStatus,
    contractStatus,
  }
})

export const mockPortfolioChampions: PortfolioChampion[] = [...seedChampions, ...extraChampions]
