import { CITIES, CITY_COORDINATES, type City } from "./cities"

export type StationProvider = "MAX" | "Siltech" | "Pash" | "Spiro"

export const STATION_PROVIDERS: StationProvider[] = ["MAX", "Siltech", "Pash", "Spiro"]

export interface SwapStation {
  id: string
  name: string
  city: City
  subCity?: string | null
  provider: StationProvider
  coordinates: { lat: number; lng: number }
  batteriesAvailable: number
  batteriesCapacity: number
  reservedBatteries?: number | null
  averageSoc: number
  totalCollections: number
  totalSwapsToday: number
  openHours?: string | null
  closeHours?: string | null
  forcedClosure?: boolean
  photoUrl?: string | null
  address?: string | null
  country?: string | null
  adminName?: string | null
}

export interface StationBattery {
  id: string
  stationId: string
  provider: StationProvider
  stateOfCharge: number
  isCharging: boolean
  isPluggedIn: boolean
  pendingTransferId?: string | null
}

const ADMIN_NAMES = [
  "Adewale Okonkwo",
  "Chioma Adebayo",
  "Tunde Balogun",
  "Ngozi Eze",
  "Ibrahim Lawal",
  "Funke Adeyemi",
  "Chinedu Okafor",
  "Aisha Bello",
  "Kehinde Salami",
  "Amaka Nwosu",
  "Yusuf Abdullahi",
  "Bukola Fashola",
]

export function pickStationAdminName(index = 0): string {
  return ADMIN_NAMES[index % ADMIN_NAMES.length]
}

const STATION_NAMES_BY_CITY: Record<City, string[]> = {
  Lagos: [
    "Ikeja Swap Station",
    "Lekki Phase 1",
    "Yaba Station",
    "Surulere Hub",
    "Maryland Station",
    "Victoria Island Swap Station",
    "Ajah Station",
    "Ikeja GRA",
    "Festac Station",
    "Agege Station",
    "Mushin Station",
    "Ikorodu Station",
    "Gbagada Station",
    "Ojota Station",
    "Alimosho Station",
    "Ikoyi Station",
    "Yaba Station 3",
    "Surulere Station",
    "Lekki Phase 2",
    "Ikeja Swap Hub",
  ],
  Sagamu: [
    "Sagamu Interchange",
    "Sagamu Hub",
    "Ogijo Station",
    "Isheri Station",
  ],
  Ibadan: [
    "Challenge Station",
    "Bodija Station",
    "Ring Road Hub",
    "Iwo Road Station",
    "Dugbe Station",
    "UI Station",
    "Mokola Station",
    "Ibadan Hub",
  ],
  Abeokuta: [
    "Ibara Station",
    "Sapon Station",
    "Abeokuta Hub",
    "Lafenwa Station",
    "Panseke Station",
  ],
  "Sango Ota": [
    "Sango Station",
    "Ota Hub",
    "Iyana Iyesi Station",
    "Sango Ota Swap Station",
  ],
  Osogbo: [
    "Oke Fia Station",
    "Osogbo Hub",
    "Gbongan Road Station",
    "Old Garage Station",
  ],
  Akure: [
    "Alagbaka Station",
    "Akure Hub",
    "Oba Adesida Station",
    "FUTA Station",
  ],
}

const CAPACITIES = [20, 24, 30, 32, 35, 40, 48, 60]

function randomInRange(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function generateAvailability(capacity: number): number {
  const roll = Math.random()
  if (roll < 0.28) return 0
  if (roll < 0.45) return Math.floor(capacity * 0.1)
  if (roll < 0.75) return Math.floor(Math.random() * (capacity * 0.5))
  return Math.floor(Math.random() * (capacity + 1))
}

function generateCollections(): number {
  const roll = Math.random()
  if (roll < 0.35) return 0
  if (roll < 0.7) return Math.floor(Math.random() * 250_000)
  return Math.floor(Math.random() * 5_000_000) + 250_000
}

function generateSwapsToday(): number {
  const roll = Math.random()
  if (roll < 0.3) return 0
  if (roll < 0.5) return Math.floor(Math.random() * 5) + 1
  return Math.floor(Math.random() * 60)
}

function generateStation(index: number): SwapStation {
  const city = CITIES[index % CITIES.length]
  const names = STATION_NAMES_BY_CITY[city]
  const name = names[Math.floor(index / CITIES.length) % names.length]
  const suffix = Math.floor(index / (CITIES.length * names.length))
  const cityCoord = CITY_COORDINATES[city]
  const capacity = pick(CAPACITIES)

  return {
    id: `STN-${(1000000 + index).toString().slice(1)}`,
    name: suffix > 0 ? `${name} ${suffix + 1}` : name,
    city,
    provider: STATION_PROVIDERS[index % STATION_PROVIDERS.length],
    coordinates: {
      lat: randomInRange(cityCoord.lat, cityCoord.variance),
      lng: randomInRange(cityCoord.lng, cityCoord.variance),
    },
    batteriesAvailable: generateAvailability(capacity),
    batteriesCapacity: capacity,
    averageSoc: Math.floor(Math.random() * 81) + 15,
    totalCollections: generateCollections(),
    totalSwapsToday: generateSwapsToday(),
    adminName: pickStationAdminName(index),
  }
}

function generateStationBattery(station: SwapStation, index: number): StationBattery {
  const roll = Math.random()
  let isCharging = false
  let isPluggedIn = false
  if (roll < 0.22) {
    isCharging = true
    isPluggedIn = true
  } else if (roll < 0.38) {
    isPluggedIn = true
  }

  return {
    id: `BAT-${station.id.replace("STN-", "")}-${String(index + 1).padStart(3, "0")}`,
    stationId: station.id,
    provider: STATION_PROVIDERS[(index + station.id.length) % STATION_PROVIDERS.length],
    stateOfCharge: Math.floor(Math.random() * 101),
    isCharging,
    isPluggedIn,
  }
}

export const mockSwapStations: SwapStation[] = Array.from(
  { length: 60 },
  (_, i) => generateStation(i)
)

export const totalSwapStations = mockSwapStations.length

const stationBatteries: StationBattery[] = mockSwapStations.flatMap((station) =>
  Array.from({ length: station.batteriesAvailable }, (_, index) =>
    generateStationBattery(station, index)
  )
)

export function getStationById(id: string): SwapStation | undefined {
  return mockSwapStations.find((station) => station.id === id)
}

export function getStationBatteries(stationId: string): StationBattery[] {
  return stationBatteries.filter((battery) => battery.stationId === stationId)
}

export function findStationBatteryById(id: string): StationBattery | undefined {
  return stationBatteries.find((battery) => battery.id === id)
}

export function addBatteriesToStation(
  stationId: string,
  count: number
): SwapStation | undefined {
  const station = getStationById(stationId)
  if (!station || count <= 0) return station

  const prefix = `BAT-${station.id.replace("STN-", "")}-`
  const maxIndex = stationBatteries.reduce((max, battery) => {
    if (!battery.id.startsWith(prefix)) return max
    const parsed = Number(battery.id.slice(prefix.length))
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max
  }, 0)

  for (let index = 0; index < count; index += 1) {
    stationBatteries.push(generateStationBattery(station, maxIndex + index))
  }

  return syncStationBatteryCount(stationId)
}

export function getTransferableBatteries(stationId: string): StationBattery[] {
  return getStationBatteries(stationId).filter((battery) => !battery.pendingTransferId)
}

export function markBatteriesPending(batteryIds: string[], transferId: string): void {
  for (const battery of stationBatteries) {
    if (batteryIds.includes(battery.id)) {
      battery.pendingTransferId = transferId
    }
  }
}

export function clearBatteriesPending(batteryIds: string[]): void {
  for (const battery of stationBatteries) {
    if (batteryIds.includes(battery.id)) {
      battery.pendingTransferId = null
    }
  }
}

export function moveBatteriesToStation(batteryIds: string[], destinationStationId: string): void {
  for (const battery of stationBatteries) {
    if (batteryIds.includes(battery.id)) {
      battery.stationId = destinationStationId
      battery.pendingTransferId = null
    }
  }
}

export function syncStationBatteryCount(stationId: string): SwapStation | undefined {
  const batteries = getStationBatteries(stationId)
  const averageSoc =
    batteries.length === 0
      ? 0
      : Math.round(
          batteries.reduce((sum, battery) => sum + battery.stateOfCharge, 0) / batteries.length
        )
  return updateStation(stationId, {
    batteriesAvailable: batteries.length,
    averageSoc,
  })
}

export function updateStation(
  id: string,
  patch: Partial<SwapStation>
): SwapStation | undefined {
  const index = mockSwapStations.findIndex((station) => station.id === id)
  if (index === -1) return undefined
  const next = { ...mockSwapStations[index], ...patch, id }
  mockSwapStations[index] = next
  return next
}

export function formatStationCollections(amount: number): string {
  if (amount === 0) return "NGN 0"
  return `NGN ${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

