export type AgentDepartment = "Welfare" | "Operations"

export type AgentStatus = "Active" | "On Leave" | "Inactive"

/** Lifecycle state of a champion inside an agent's book. */
export type ChampionState =
  | "Default"
  | "Early Arrears"
  | "Inactive"
  | "Performing"
  | "Watchlist"

export interface AgentPortfolioRecord {
  id: string
  agent: string
  department: AgentDepartment
  /** Nigerian state the agent covers. */
  state: string
  /** Champions in good standing — state "Performing". */
  active: number
  /** States "Watchlist" and "Early Arrears". */
  atRisk: number
  /** State "Default". */
  delinquent: number
  /** State "Inactive" — still on the agent's book but off the road. */
  inactive: number
  /** Whole book: active + atRisk + delinquent + inactive. */
  total: number
  status: AgentStatus
}

export interface AgentChampionRecord {
  id: string
  agentId: string
  name: string
  championId: string
  avatarUrl: string
  phone: string
  plate: string
  state: ChampionState
}

// Champion counts per agent. `total` is derived below so the breakdown always
// adds up rather than drifting from the columns beside it.
const agentBooks: Omit<AgentPortfolioRecord, "total">[] = [
  { id: "1",  agent: "Fatima Bello",    department: "Welfare",    state: "Lagos",  active: 24, atRisk: 5, delinquent: 3, inactive: 2, status: "Active" },
  { id: "2",  agent: "Chidi Okafor",    department: "Welfare",    state: "Lagos",  active: 18, atRisk: 7, delinquent: 4, inactive: 1, status: "Active" },
  { id: "3",  agent: "Ngozi Eze",       department: "Operations", state: "Abuja",  active: 27, atRisk: 3, delinquent: 1, inactive: 3, status: "Active" },
  { id: "4",  agent: "Tunde Bakare",    department: "Welfare",    state: "Oyo",    active: 15, atRisk: 6, delinquent: 5, inactive: 2, status: "Active" },
  { id: "5",  agent: "Amara Nwachukwu", department: "Welfare",    state: "Lagos",  active: 22, atRisk: 4, delinquent: 2, inactive: 1, status: "Active" },
  { id: "6",  agent: "Bashir Lawal",    department: "Operations", state: "Kano",   active: 13, atRisk: 8, delinquent: 6, inactive: 2, status: "Active" },
  { id: "7",  agent: "Chinelo Umeh",    department: "Welfare",    state: "Rivers", active: 26, atRisk: 2, delinquent: 1, inactive: 1, status: "Active" },
  { id: "8",  agent: "Damilola Ajayi",  department: "Operations", state: "Abuja",  active: 12, atRisk: 5, delinquent: 3, inactive: 4, status: "On Leave" },
  { id: "9",  agent: "Efe Oghenekaro",  department: "Welfare",    state: "Enugu",  active: 20, atRisk: 4, delinquent: 3, inactive: 2, status: "Active" },
  { id: "10", agent: "Halima Sani",     department: "Operations", state: "Kano",   active: 17, atRisk: 6, delinquent: 4, inactive: 1, status: "Active" },
  { id: "11", agent: "Ifeanyi Obiora",  department: "Welfare",    state: "Lagos",  active: 9,  atRisk: 3, delinquent: 2, inactive: 2, status: "On Leave" },
  { id: "12", agent: "Kunle Adebayo",   department: "Operations", state: "Oyo",    active: 0,  atRisk: 0, delinquent: 0, inactive: 5, status: "Inactive" },
]

export const mockAgentPortfolioRecords: AgentPortfolioRecord[] = agentBooks.map((book) => ({
  ...book,
  total: book.active + book.atRisk + book.delinquent + book.inactive,
}))

export const agentStatusVariantMap: Record<AgentStatus, "success" | "warning" | "danger"> = {
  "Active":   "success",
  "On Leave": "warning",
  "Inactive": "danger",
}

export const championStateVariantMap: Record<
  ChampionState,
  "success" | "info" | "warning" | "danger" | "neutral"
> = {
  "Performing":    "success",
  "Watchlist":     "info",
  "Early Arrears": "warning",
  "Default":       "danger",
  "Inactive":      "neutral",
}

export const reassignmentReasons = [
  "Leave",
  "Resignation",
  "Performance balancing",
  "Other",
]

/** Dropdown order matches the design: alphabetical, under an "All states" option. */
export const championStates: ChampionState[] = [
  "Default",
  "Early Arrears",
  "Inactive",
  "Performing",
  "Watchlist",
]

// --- Champion books ---------------------------------------------------------
// Each agent's champions are generated from the counts above so the detail page
// always reconciles with the row you clicked: one record per champion, and the
// state mix reproduces the Active / At Risk / Delinquent / Inactive split.

const FIRST_NAMES = [
  "Adewale", "Chiamaka", "Emeka", "Folake", "Gbenga", "Halima", "Ifeoma", "Jide",
  "Kelechi", "Lola", "Musa", "Nkechi", "Obinna", "Peter", "Rukayat", "Segun",
  "Tochukwu", "Uche", "Yusuf", "Zainab", "Amaka", "Bisi", "Chidera", "Dayo",
  "Ebere", "Femi", "Grace", "Hassan", "Ijeoma", "Kunle",
]

const LAST_NAMES = [
  "Ogunleye", "Okafor", "Balogun", "Adeyemi", "Nwachukwu", "Eze", "Bello",
  "Danladi", "Chukwu", "Adeleke", "Sani", "Obi", "Ajayi", "Umeh", "Lawal",
  "Oyelaran", "Nnamdi", "Abubakar", "Okonjo", "Ibrahim", "Onyeka", "Adesina",
  "Momoh", "Uzoma", "Salami",
]

const PLATE_PREFIXES = ["LAG", "ABJ", "KAN", "PHC", "IBD"]
const PLATE_SUFFIXES = ["XR", "QT", "ZK", "BN", "MV", "LP", "GD", "HW"]

/** Deterministic pseudo-random so the mock is stable across reloads. */
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function buildChampions(): AgentChampionRecord[] {
  const champions: AgentChampionRecord[] = []
  let serial = 1

  for (const agent of mockAgentPortfolioRecords) {
    // At-risk champions are split across the two at-risk states.
    const watchlist = Math.ceil(agent.atRisk / 2)
    const earlyArrears = agent.atRisk - watchlist

    const states: ChampionState[] = [
      ...Array<ChampionState>(agent.active).fill("Performing"),
      ...Array<ChampionState>(watchlist).fill("Watchlist"),
      ...Array<ChampionState>(earlyArrears).fill("Early Arrears"),
      ...Array<ChampionState>(agent.delinquent).fill("Default"),
      ...Array<ChampionState>(agent.inactive).fill("Inactive"),
    ]

    // Interleave so the table isn't grouped by state out of the box. Sorting on a
    // per-position key (not the value) keeps the comparator consistent.
    const shuffled = states
      .map((state, position) => ({ state, key: seededRandom(serial * 97 + position) }))
      .sort((a, b) => a.key - b.key)
      .map((entry) => entry.state)

    shuffled.forEach((state, index) => {
      const seed = serial * 31 + index
      const first = FIRST_NAMES[Math.floor(seededRandom(seed) * FIRST_NAMES.length)]
      const last = LAST_NAMES[Math.floor(seededRandom(seed + 7) * LAST_NAMES.length)]
      const prefix = PLATE_PREFIXES[Math.floor(seededRandom(seed + 13) * PLATE_PREFIXES.length)]
      const suffix = PLATE_SUFFIXES[Math.floor(seededRandom(seed + 17) * PLATE_SUFFIXES.length)]
      const plateDigits = 100 + Math.floor(seededRandom(seed + 23) * 900)
      const phoneMid = 100 + Math.floor(seededRandom(seed + 29) * 900)
      const phoneEnd = 1000 + Math.floor(seededRandom(seed + 37) * 9000)

      champions.push({
        id: `champ-${serial}`,
        agentId: agent.id,
        name: `${first} ${last}`,
        championId: `CHP-${String(serial).padStart(3, "0")}`,
        avatarUrl: "/images/champvatar.png",
        phone: `+234 80${Math.floor(seededRandom(seed + 41) * 10)} ${phoneMid} ${phoneEnd}`,
        plate: `${prefix}-${plateDigits}-${suffix}`,
        state,
      })
      serial += 1
    })
  }

  return champions
}

export const mockAgentChampions: AgentChampionRecord[] = buildChampions()

export function getAgentById(agentId: string): AgentPortfolioRecord | undefined {
  return mockAgentPortfolioRecords.find((agent) => agent.id === agentId)
}

export function getChampionsForAgent(agentId: string): AgentChampionRecord[] {
  return mockAgentChampions.filter((champion) => champion.agentId === agentId)
}
