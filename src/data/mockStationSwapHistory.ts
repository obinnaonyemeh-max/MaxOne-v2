import { mockSwapStations } from "./mockStationsData"

export interface StationSwapRecord {
  id: string
  stationId: string
  operator: string
  champion: string
  checkedInBatteryId: string
  checkedInAt: string
  checkedOutBatteryId: string
  checkedOutAt: string
}

const OPERATORS = [
  "Damian Dolapo",
  "Kemi Ajayi",
  "Samuel Okoro",
  "Blessing Adewale",
  "Ifeanyi Nwosu",
]

const CHAMPIONS = [
  "Adekunle Silva",
  "Chiamaka Obi",
  "Tunde Bakare",
  "Zainab Lawal",
  "Emeka Okafor",
  "Fatima Suleiman",
  "Gbenga Adeyemi",
  "Ngozi Chukwu",
]

const SWAP_COUNT_PER_STATION = 60
const SWAP_ID_BASE = 28839949400
const BATTERY_ID_BASE = 9880000
const FIRST_SWAP_MS = Date.parse("2024-02-22T13:25:43+01:00")
const SWAP_INTERVAL_MS = 3.5 * 60 * 60 * 1000

function padSwapId(value: number): string {
  return `SWAP-${value}`
}

function padBatteryId(value: number): string {
  return `BAT-${value}`
}

function formatSwapTimestamp(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso))
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""
  return `${value("day")} ${value("month")} ${value("year")}, ${value("hour")}:${value("minute")}:${value("second")} WAT`
}

function generateStationSwaps(stationId: string, stationIndex: number): StationSwapRecord[] {
  return Array.from({ length: SWAP_COUNT_PER_STATION }, (_, index) => {
    if (stationIndex === 0 && index === 0) {
      const at = new Date(FIRST_SWAP_MS).toISOString()
      return {
        id: padSwapId(SWAP_ID_BASE),
        stationId,
        operator: OPERATORS[0],
        champion: CHAMPIONS[0],
        checkedInBatteryId: "BAT-9883774",
        checkedInAt: at,
        checkedOutBatteryId: "BAT-9883733",
        checkedOutAt: at,
      }
    }

    const checkedInAt = new Date(FIRST_SWAP_MS - index * SWAP_INTERVAL_MS).toISOString()
    const checkedOutAt = new Date(
      FIRST_SWAP_MS - index * SWAP_INTERVAL_MS + 18 * 1000
    ).toISOString()
    const batteryOffset = stationIndex * SWAP_COUNT_PER_STATION * 2 + index * 2

    return {
      id: padSwapId(SWAP_ID_BASE + stationIndex * 1000 + index),
      stationId,
      operator: OPERATORS[(index + stationIndex) % OPERATORS.length],
      champion: CHAMPIONS[(index * 3 + stationIndex) % CHAMPIONS.length],
      checkedInBatteryId: padBatteryId(BATTERY_ID_BASE + batteryOffset),
      checkedInAt,
      checkedOutBatteryId: padBatteryId(BATTERY_ID_BASE + batteryOffset + 1),
      checkedOutAt,
    }
  })
}

const swapHistoryByStation = new Map(
  mockSwapStations.map((station, index) => [
    station.id,
    generateStationSwaps(station.id, index),
  ])
)

export function getSwapHistoryForStation(stationId: string): StationSwapRecord[] {
  return swapHistoryByStation.get(stationId) ?? []
}

export function getSwapHistoryOperators(stationId: string): string[] {
  return [...new Set(getSwapHistoryForStation(stationId).map((swap) => swap.operator))].sort()
}

export function formatSwapDate(iso: string): string {
  return formatSwapTimestamp(iso)
}
