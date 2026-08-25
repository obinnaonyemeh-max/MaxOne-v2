import type {
  ChargeStop,
  ChargeSpotDay,
  ChargeSpotHeatMapData,
  ChargeSpotPoint,
  ChargeSpotTimeOfDay,
  HeatMapCell,
  HeatMapDayIndex,
} from "@/data/mockChargerData"
import type { AssignmentRecord } from "@/components/max"
import {
  mockVehicleRegisterItems,
  type TrackingStatus,
  type VehicleCategory,
  type VehicleRegisterItem,
  type VehicleType,
} from "@/data/mockVehicleRegister"
import { CITY_LIVE_ADDRESSES } from "./cities"

export type TripEventType =
  | "start"
  | "stop"
  | "harsh_brake"
  | "overspeed"
  | "geofence"
  | "charge"

export type ChargerActivityStatus = "charging" | "online" | "offline"

export interface TripPoint {
  lat: number
  lng: number
  speed: number
  distanceKm: number
  elapsedSeconds: number
}

export interface TripEvent {
  id: string
  type: TripEventType
  label: string
  pointIndex: number
  color: string
}

export interface DriverRadarMetric {
  metric: string
  value: number
}

export type EnforcementTrigger = "Automated" | "Manual"

export interface EnforcementEvent {
  id: string
  type: string
  timestamp: string
  triggeredType: EnforcementTrigger
  reason: string
  issuedBy?: string
  statusVariant: "success" | "warning" | "info" | "danger" | "default"
}

export interface BatterySwapRecord {
  id: string
  station: string
  timestamp: string
  batteryIn: { id: string; chargePercent: number }
  batteryOut: { id: string; chargePercent: number }
  feeNaira: number
  attendant: string
}

export interface VehicleTrip {
  id: string
  number: number
  date: string
  startTime: string
  endTime: string
  startSeconds: number
  distanceKm: number
  durationLabel: string
  maxSpeedKmph: number
  alertCount: number
  tripPoints: TripPoint[]
  tripEvents: TripEvent[]
}

export interface VehicleStop {
  id: string
  number: number
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  durationLabel: string
  lat: number
  lng: number
  startedAt: string
  placeTitle: string
}

export interface VehiclePrimeStop {
  id: string
  vehicleId: string
  title: string
  frequency: number
  averageStopDuration: string
  averageStopDurationMinutes: number
  location: { lat: number; lng: number }
  avgDistanceBetweenStop: string
  radiusMeters: number
  points: ChargeSpotPoint[]
  peakHour: number
  timeOfDay: ChargeSpotTimeOfDay
  activeDays: ChargeSpotDay[]
  activityDate: string
}

export interface VehicleActivity {
  vehicleId: string
  plateNumber: string
  category: VehicleCategory
  vehicleType: VehicleType
  trackingStatus: TrackingStatus
  odometerKm: number
  ignition: "ON" | "OFF"
  imei: string
  externalVoltage: number
  geofence: "inside" | "outside"
  contractStatus: "Active" | "Inactive"
  lastUpdatedBy: string
  lastPingedOn: string
  liveAddress: string
  immobilized: boolean
  assignments: AssignmentRecord[]
  tripPoints: TripPoint[]
  tripEvents: TripEvent[]
  battery?: {
    stateOfCharge: number
    batteryId: string
    stateOfHealth: number
    estimatedRangeKm: number
    chargeCycle: number
    swapHistory: BatterySwapRecord[]
  }
  charger?: {
    chargerId: string
    status: ChargerActivityStatus
    chargeSessions: number
    topChargingSpot: string
  }
  primeStops: ChargeStop[]
  driverScore: {
    score: number
    trendPercent: number
    trendDirection: "up" | "down"
    radar: DriverRadarMetric[]
  }
  enforcement: {
    count: number
    latest: { type: string; timestamp: string }[]
    history: EnforcementEvent[]
  }
  reports: {
    totalTrips: number
    totalDistanceKm: number
    averageSpeedKmph: number
    totalDurationHours: number
    totalStopDurationHours: number
    alertCount: number
  }
}

const EVENT_COLORS: Record<TripEventType, string> = {
  start: "#22C55E",
  stop: "#EAB308",
  harsh_brake: "#EF4444",
  overspeed: "#EF4444",
  geofence: "#F97316",
  charge: "#3B82F6",
}

const EVENT_LABELS: Record<TripEventType, string> = {
  start: "Trip start",
  stop: "Stop",
  harsh_brake: "Harsh braking",
  overspeed: "Overspeeding",
  geofence: "Geofence event",
  charge: "Charge event",
}

const SWAP_STATIONS = [
  "Ikeja Swap Hub",
  "Yaba Station 3",
  "Surulere Hub",
  "Lekki Phase 1",
  "Maryland Station",
]

const SWAP_ATTENDANTS = [
  "Chinedu Okafor",
  "Amina Bello",
  "Tunde Bakare",
  "Ngozi Eze",
  "Fatima Yusuf",
]

const SWAP_DATES = [
  "22 Feb 2026 • 08:12",
  "18 Feb 2026 • 19:44",
  "11 Feb 2026 • 07:05",
  "02 Feb 2026 • 14:28",
  "24 Jan 2026 • 09:51",
  "16 Jan 2026 • 18:03",
  "08 Jan 2026 • 06:40",
]

const PRIME_STOP_STREETS = [
  "12 Bello Osagie St",
  "45 Adeola Odeku St",
  "8 Admiralty Way",
  "21 Akin Adesola St",
  "3 Tiamiyu Savage St",
]

const STOP_PLACE_TEMPLATES: { title: (city: string) => string; dLat: number; dLng: number }[] = [
  { title: (city) => `12 Bello Osagie St, ${city}`, dLat: 0.018, dLng: -0.032 },
  { title: (city) => `45 Adeola Odeku St, ${city}`, dLat: -0.012, dLng: 0.028 },
  { title: (_city) => `8 Admiralty Way, Lekki Phase 1`, dLat: -0.02, dLng: 0.048 },
  { title: (_city) => `Ikeja GRA Junction`, dLat: 0.058, dLng: 0.008 },
  { title: (_city) => `Surulere Stadium Road`, dLat: 0.008, dLng: 0.018 },
  { title: (_city) => `Yaba College Roundabout`, dLat: 0.032, dLng: 0.014 },
  { title: (_city) => `Ajah Bus Stop, Lekki-Epe Expressway`, dLat: -0.034, dLng: 0.068 },
  { title: (_city) => `Maryland Mall Forecourt`, dLat: 0.044, dLng: 0.022 },
]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const WEEKDAY_KEYS: ChargeSpotDay[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
]

const ENFORCEMENT_ISSUERS = ["Darius Dolapo", "Samson Oluwaseun", "Ngozi Eze"]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i) | 0
  }
  return Math.abs(hash)
}

function mulberry32(seed: number) {
  return function next() {
    seed |= 0
    seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function ordinal(day: number): string {
  const remainder = day % 100
  if (remainder >= 11 && remainder <= 13) return `${day}th`
  switch (day % 10) {
    case 1: return `${day}st`
    case 2: return `${day}nd`
    case 3: return `${day}rd`
    default: return `${day}th`
  }
}

export function formatClock(totalSeconds: number): string {
  const seconds = ((totalSeconds % 86400) + 86400) % 86400
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = Math.floor(seconds % 60)
  const suffix = hours >= 12 ? "pm" : "am"
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")} ${suffix}`
}

function pad2(value: number): string {
  return value.toString().padStart(2, "0")
}

function formatStopDurationLabel(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  if (hours > 0) {
    return `${hours} hr${hours === 1 ? "" : "s"} ${pad2(minutes)} mins`
  }
  return `${minutes} mins ${pad2(remaining)} sec`
}

function formatAverageStopDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours > 0) return `${hours}hrs ${mins} mins`
  return `${mins} mins`
}

function heatMapFromStops(spotId: string, stops: VehicleStop[]): ChargeSpotHeatMapData {
  const counts = new Map<string, number>()
  for (const stop of stops) {
    const date = new Date(stop.startedAt)
    const day = ((date.getDay() + 6) % 7) as HeatMapDayIndex
    const hour = date.getHours()
    const key = `${day}-${hour}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const cells: HeatMapCell[] = []
  const dayTotals = Array.from({ length: 7 }, () => 0)
  const hourTotals = Array.from({ length: 24 }, () => 0)
  let maxCount = 0

  for (let hour = 0; hour < 24; hour++) {
    for (let day = 0; day < 7; day++) {
      const count = counts.get(`${day}-${hour}`) ?? 0
      cells.push({ day: day as HeatMapDayIndex, hour, count })
      dayTotals[day] += count
      hourTotals[hour] += count
      if (count > maxCount) maxCount = count
    }
  }

  const peakDay = dayTotals.indexOf(Math.max(...dayTotals)) as HeatMapDayIndex
  const peakHour = hourTotals.indexOf(Math.max(...hourTotals))
  const hour12 = peakHour % 12 === 0 ? 12 : peakHour % 12
  const suffix = peakHour >= 12 ? "PM" : "AM"

  return {
    spotId,
    cells,
    peakDayLabel: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][peakDay],
    peakTimeLabel: `${hour12}:00${suffix}`,
    maxCount,
  }
}

interface VehicleStopCatalog {
  stops: VehicleStop[]
  primeStops: VehiclePrimeStop[]
  heatMaps: Record<string, ChargeSpotHeatMapData>
  cardStops: ChargeStop[]
}

function generateStopCatalog(vehicle: VehicleRegisterItem): VehicleStopCatalog {
  const rand = mulberry32(hashString(`${vehicle.id}-stops`))
  const placeCount = 5 + Math.floor(rand() * 4)
  const places = STOP_PLACE_TEMPLATES.slice(0, placeCount).map((place) => ({
    title: place.title(vehicle.city),
    lat: vehicle.coordinates.lat + place.dLat,
    lng: vehicle.coordinates.lng + place.dLng,
  }))

  const stopCount = 90 + Math.floor(rand() * 30)
  const rawStops: Omit<VehicleStop, "number">[] = []

  for (let i = 0; i < stopCount; i++) {
    const placeIndex = Math.min(
      places.length - 1,
      Math.floor(rand() * rand() * places.length)
    )
    const place = places[placeIndex]
    const roll = rand()
    const durationSeconds =
      roll < 0.4
        ? 180 + Math.floor(rand() * 540)
        : roll < 0.8
          ? 12 * 60 + Math.floor(rand() * 48 * 60)
          : 60 * 60 + Math.floor(rand() * 90 * 60)

    const month = 1 + Math.floor(rand() * 7)
    const day = 1 + Math.floor(rand() * 27)
    const startSeconds = 6 * 3600 + Math.floor(rand() * 14 * 3600)
    const startedAt = `2026-${pad2(month)}-${pad2(day)}T${pad2(Math.floor(startSeconds / 3600))}:${pad2(Math.floor((startSeconds % 3600) / 60))}:${pad2(startSeconds % 60)}`

    rawStops.push({
      id: `${vehicle.id}-stop-${i + 1}`,
      date: `${ordinal(day)} ${MONTH_NAMES[month - 1]}, 2026`,
      startTime: formatClock(startSeconds),
      endTime: formatClock(startSeconds + durationSeconds),
      durationMinutes: durationSeconds / 60,
      durationLabel: formatStopDurationLabel(durationSeconds),
      lat: place.lat + (rand() - 0.5) * 0.008,
      lng: place.lng + (rand() - 0.5) * 0.008,
      startedAt,
      placeTitle: place.title,
    })
  }

  rawStops.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
  const stops: VehicleStop[] = rawStops.map((stop, index) => ({
    ...stop,
    number: index + 1,
  }))

  const heatMaps: Record<string, ChargeSpotHeatMapData> = {}
  const primeStops: VehiclePrimeStop[] = places.map((place, index) => {
    const placeStops = stops.filter((stop) => stop.placeTitle === place.title)
    const frequency = placeStops.length
    const averageMinutes =
      frequency === 0
        ? 0
        : placeStops.reduce((sum, stop) => sum + stop.durationMinutes, 0) / frequency
    const hourCounts = Array.from({ length: 24 }, () => 0)
    const daySet = new Set<ChargeSpotDay>()
    for (const stop of placeStops) {
      const date = new Date(stop.startedAt)
      hourCounts[date.getHours()] += 1
      daySet.add(WEEKDAY_KEYS[(date.getDay() + 6) % 7])
    }
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts))
    let distanceSum = 0
    for (let i = 1; i < placeStops.length; i++) {
      distanceSum += haversineKm(
        { lat: placeStops[i - 1].lat, lng: placeStops[i - 1].lng },
        { lat: placeStops[i].lat, lng: placeStops[i].lng }
      )
    }
    const avgKm = placeStops.length > 1 ? distanceSum / (placeStops.length - 1) : 1.5
    const latest = placeStops[0]?.startedAt ?? "2026-06-20T08:00:00"
    const spotId = `${vehicle.id}-prime-${index + 1}`
    heatMaps[spotId] = heatMapFromStops(spotId, placeStops)

    return {
      id: spotId,
      vehicleId: vehicle.id,
      title: place.title,
      frequency,
      averageStopDuration: formatAverageStopDuration(averageMinutes),
      averageStopDurationMinutes: Math.round(averageMinutes),
      location: { lat: place.lat, lng: place.lng },
      avgDistanceBetweenStop: `${avgKm.toFixed(1)} km`,
      radiusMeters: 260 + frequency * 6,
      points: placeStops.slice(0, 12).map((stop) => ({ lat: stop.lat, lng: stop.lng })),
      peakHour,
      timeOfDay: (peakHour >= 6 && peakHour <= 18 ? "day" : "night") as ChargeSpotTimeOfDay,
      activeDays: WEEKDAY_KEYS.filter((day) => daySet.has(day)),
      activityDate: latest.slice(0, 10),
    }
  }).filter((spot) => spot.points.length > 0)

  const cardStops: ChargeStop[] = primeStops.slice(0, 4).map((spot, index) => ({
    id: spot.id,
    address: `${spot.title}, Nigeria`,
    coordinates: spot.location,
    timestamp: `${10 + index} Aug 2026, 0${8 + index}:15 WAT`,
  }))

  return { stops, primeStops, heatMaps, cardStops }
}

function generateTripPoints(
  start: { lat: number; lng: number },
  rand: () => number,
  trackingStatus: TrackingStatus
): TripPoint[] {
  const pointCount = 90
  const heading = rand() * Math.PI * 2
  const points: TripPoint[] = []
  let lat = start.lat
  let lng = start.lng
  let distanceKm = 0
  let elapsedSeconds = 0

  for (let i = 0; i < pointCount; i++) {
    const progress = i / (pointCount - 1)
    const turn = (rand() - 0.5) * 0.35
    const stepHeading = heading + turn + Math.sin(progress * 6) * 0.4
    const stepMeters = 45 + rand() * 40
    const stepDegLat = (stepMeters / 111320) * Math.cos(stepHeading)
    const stepDegLng = (stepMeters / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(stepHeading)

    if (i > 0) {
      lat += stepDegLat
      lng += stepDegLng
    }

    const isStoppedSegment =
      trackingStatus === "stopped"
        ? progress > 0.82
        : (progress > 0.28 && progress < 0.34) || (progress > 0.62 && progress < 0.66)

    const cruise = 48 + Math.sin(progress * Math.PI * 3) * 22 + (rand() - 0.5) * 8
    const speed =
      trackingStatus === "offline" || trackingStatus === "pending"
        ? 0
        : isStoppedSegment
          ? 0
          : Math.max(18, Math.min(92, cruise))

    if (i > 0) {
      const prev = points[i - 1]
      const segmentKm = haversineKm(prev, { lat, lng })
      distanceKm += segmentKm
      elapsedSeconds += speed > 0 ? (segmentKm / speed) * 3600 : 45 + rand() * 30
    }

    points.push({
      lat,
      lng,
      speed: Math.round(speed),
      distanceKm: Number(distanceKm.toFixed(3)),
      elapsedSeconds: Math.round(elapsedSeconds),
    })
  }

  return points
}

function generateEvents(
  vehicleId: string,
  pointCount: number,
  isEV: boolean,
  rand: () => number
): TripEvent[] {
  const types: TripEventType[] = ["stop", "harsh_brake", "overspeed", "geofence"]
  if (isEV) types.push("charge")

  const events: TripEvent[] = [
    {
      id: `${vehicleId}-start`,
      type: "start",
      label: EVENT_LABELS.start,
      pointIndex: 0,
      color: EVENT_COLORS.start,
    },
  ]

  const used = new Set<number>([0])
  const extraCount = 4 + Math.floor(rand() * 3)

  for (let i = 0; i < extraCount; i++) {
    let index = Math.floor(0.12 * pointCount + rand() * 0.8 * pointCount)
    while (used.has(index)) {
      index = Math.floor(0.12 * pointCount + rand() * 0.8 * pointCount)
    }
    used.add(index)
    const type = types[Math.floor(rand() * types.length)]
    events.push({
      id: `${vehicleId}-evt-${i}`,
      type,
      label: EVENT_LABELS[type],
      pointIndex: index,
      color: EVENT_COLORS[type],
    })
  }

  return events.sort((a, b) => a.pointIndex - b.pointIndex)
}

function generateSwapHistory(
  vehicleId: string,
  currentBatteryId: string,
  rand: () => number
): BatterySwapRecord[] {
  let nextInId = currentBatteryId

  return SWAP_DATES.map((timestamp, i) => {
    const outId = `BAT-${7000000 + Math.floor(rand() * 2999999)}`
    const record: BatterySwapRecord = {
      id: `${vehicleId}-swap-${i}`,
      station: SWAP_STATIONS[i % SWAP_STATIONS.length],
      timestamp,
      batteryIn: {
        id: nextInId,
        chargePercent: 88 + Math.floor(rand() * 12),
      },
      batteryOut: {
        id: outId,
        chargePercent: 6 + Math.floor(rand() * 18),
      },
      feeNaira: rand() > 0.7 ? 2000 : 1500,
      attendant: SWAP_ATTENDANTS[i % SWAP_ATTENDANTS.length],
    }
    nextInId = outId
    return record
  })
}

function generateEnforcementHistory(
  vehicleId: string,
  isEV: boolean
): EnforcementEvent[] {
  const evEvents: Omit<EnforcementEvent, "id">[] = [
    {
      type: "Swap Block Reversed",
      timestamp: "20 Jan 2026 10:45 PM",
      triggeredType: "Automated",
      reason: "Payment made on contract",
      statusVariant: "default",
    },
    {
      type: "Swap Block",
      timestamp: "18 Jan 2026 3:12 PM",
      triggeredType: "Automated",
      reason: "2 DPD",
      statusVariant: "info",
    },
    {
      type: "Vehicle Lock",
      timestamp: "12 Jan 2026 8:04 AM",
      triggeredType: "Automated",
      reason: "3 DPD",
      statusVariant: "warning",
    },
    {
      type: "Battery Charge & Discharge Lock Reversed",
      timestamp: "08 Jan 2026 4:22 PM",
      triggeredType: "Manual",
      issuedBy: ENFORCEMENT_ISSUERS[0],
      reason: "All issues have been sorted",
      statusVariant: "default",
    },
    {
      type: "Battery Charge & Discharge Lock",
      timestamp: "05 Jan 2026 11:18 AM",
      triggeredType: "Manual",
      issuedBy: ENFORCEMENT_ISSUERS[0],
      reason: "Vehicle tampered",
      statusVariant: "danger",
    },
  ]

  const iceEvents: Omit<EnforcementEvent, "id">[] = [
    {
      type: "Swap Block Reversed",
      timestamp: "20 Jan 2026 10:45 PM",
      triggeredType: "Automated",
      reason: "Payment made on contract",
      statusVariant: "default",
    },
    {
      type: "Swap Block",
      timestamp: "18 Jan 2026 3:12 PM",
      triggeredType: "Automated",
      reason: "2 DPD",
      statusVariant: "info",
    },
    {
      type: "Vehicle Lock",
      timestamp: "12 Jan 2026 8:04 AM",
      triggeredType: "Automated",
      reason: "3 DPD",
      statusVariant: "warning",
    },
    {
      type: "Vehicle Lock Reversed",
      timestamp: "08 Jan 2026 4:22 PM",
      triggeredType: "Manual",
      issuedBy: ENFORCEMENT_ISSUERS[0],
      reason: "All issues have been sorted",
      statusVariant: "default",
    },
    {
      type: "Vehicle Lock",
      timestamp: "05 Jan 2026 11:18 AM",
      triggeredType: "Manual",
      issuedBy: ENFORCEMENT_ISSUERS[0],
      reason: "Vehicle tampered",
      statusVariant: "danger",
    },
  ]

  return (isEV ? evEvents : iceEvents).map((event, index) => ({
    ...event,
    id: `${vehicleId}-enf-${index + 1}`,
  }))
}

function generateActivity(vehicle: VehicleRegisterItem): VehicleActivity {
  const rand = mulberry32(hashString(vehicle.id))
  const isEV = vehicle.category === "ev"
  const tripPoints = generateTripPoints(vehicle.coordinates, rand, vehicle.trackingStatus)
  const ignitionOn = vehicle.trackingStatus === "moving" || vehicle.trackingStatus === "stopped"

  const radarMetrics = [
    "Harsh Acceleration",
    "Harsh Braking",
    "Out of Zone",
    "Outside Work Hours",
    "Overspeeding",
    "Harsh Cornering",
  ]

  return {
    vehicleId: vehicle.id,
    plateNumber: vehicle.plateNumber,
    category: vehicle.category,
    vehicleType: vehicle.vehicleType,
    trackingStatus: vehicle.trackingStatus,
    odometerKm: 8000 + Math.floor(rand() * 42000),
    ignition: ignitionOn ? "ON" : "OFF",
    imei: String(350000000000000 + (hashString(vehicle.id) % 89999999999999)),
    externalVoltage: isEV ? 48 + Math.floor(rand() * 8) : 12 + Math.floor(rand() * 3),
    geofence: rand() > 0.22 ? "inside" : "outside",
    contractStatus:
      vehicle.lifecycleStatus === "Active" || vehicle.lifecycleStatus === "Operational Fleet"
        ? "Active"
        : "Inactive",
    lastUpdatedBy: vehicle.assignedDriver ?? "Samson Oluwaseun",
    lastPingedOn: vehicle.lastUpdate,
    liveAddress: CITY_LIVE_ADDRESSES[vehicle.city] ?? vehicle.city,
    immobilized: false,
    assignments: [
      {
        id: `${vehicle.id}-asg-1`,
        duration: vehicle.assignedDriver ? "3 Dec 2025 - Current" : "Unassigned",
        assigneeName: vehicle.assignedDriver ?? "Unassigned",
        assigneeAvatar: vehicle.assignedDriver ? "/images/champvatar.png" : undefined,
        status: vehicle.assignedDriver ? "Active" : "Inactive",
        isCurrent: true,
      },
      ...(vehicle.assignedDriver
        ? [
            {
              id: `${vehicle.id}-asg-2`,
              duration: "15 Aug 2025 - 2 Dec 2025",
              assigneeName: "Emeka Okafor",
              assigneeAvatar: "/images/champvatar.png",
              status: "Inactive" as const,
              isCurrent: false,
            },
          ]
        : []),
    ],
    tripPoints,
    tripEvents: generateEvents(vehicle.id, tripPoints.length, isEV, rand),
    battery: isEV
      ? (() => {
          const batteryId = `BAT-${9000000 + (hashString(vehicle.id) % 999999)}`
          return {
            stateOfCharge: vehicle.batterySoC ?? 40 + Math.floor(rand() * 50),
            batteryId,
            stateOfHealth: 78 + Math.floor(rand() * 20),
            estimatedRangeKm: 30 + Math.floor(rand() * 70),
            chargeCycle: 80 + Math.floor(rand() * 400),
            swapHistory: generateSwapHistory(vehicle.id, batteryId, rand),
          }
        })()
      : undefined,
    charger: isEV
      ? {
          chargerId: `CHG-${1000 + (hashString(vehicle.id) % 9000)}`,
          status: vehicle.trackingStatus === "stopped" && rand() > 0.5 ? "charging" : rand() > 0.2 ? "online" : "offline",
          chargeSessions: 40 + Math.floor(rand() * 180),
          topChargingSpot: `${PRIME_STOP_STREETS[Math.floor(rand() * PRIME_STOP_STREETS.length)]}, ${vehicle.city}, Nigeria`,
        }
      : undefined,
    primeStops: stopCatalogByVehicleId[vehicle.id]?.cardStops ?? [],
    driverScore: {
      score: vehicle.driverSafetyScore,
      trendPercent: 1 + Math.floor(rand() * 6),
      trendDirection: rand() > 0.25 ? "up" : "down",
      radar: radarMetrics.map((metric) => ({
        metric,
        value: 25 + Math.floor(rand() * 65),
      })),
    },
    enforcement: (() => {
      const history = generateEnforcementHistory(vehicle.id, isEV)
      return {
        count: history.length,
        latest: history.slice(0, 2).map((event) => ({
          type: event.type,
          timestamp: event.timestamp,
        })),
        history,
      }
    })(),
    reports: {
      totalTrips: 180 + Math.floor(rand() * 500),
      totalDistanceKm: 220 + Math.floor(rand() * 900),
      averageSpeedKmph: 35 + Math.floor(rand() * 50),
      totalDurationHours: 400 + Math.floor(rand() * 8000),
      totalStopDurationHours: 40 + Math.floor(rand() * 600),
      alertCount: 8 + Math.floor(rand() * 72),
    },
  }
}

const stopCatalogByVehicleId: Record<string, VehicleStopCatalog> = Object.fromEntries(
  mockVehicleRegisterItems.map((vehicle) => [vehicle.id, generateStopCatalog(vehicle)])
)

const activityByVehicleId: Record<string, VehicleActivity> = Object.fromEntries(
  mockVehicleRegisterItems.map((vehicle) => [vehicle.id, generateActivity(vehicle)])
)

function formatShortDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}m`
  return `${minutes}m ${remaining.toString().padStart(2, "0")}s`
}

function generateVehicleTrips(vehicle: VehicleRegisterItem): VehicleTrip[] {
  const rand = mulberry32(hashString(`${vehicle.id}-trips`))
  const isEV = vehicle.category === "ev"
  const tripCount = 10 + Math.floor(rand() * 3)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]

  return Array.from({ length: tripCount }, (_, index) => {
    const tripRand = mulberry32(hashString(`${vehicle.id}-trip-${index}`))
    const origin = {
      lat: vehicle.coordinates.lat + (tripRand() - 0.5) * 0.04,
      lng: vehicle.coordinates.lng + (tripRand() - 0.5) * 0.04,
    }
    const tripPoints = generateTripPoints(origin, tripRand, "moving")
    const tripEvents = generateEvents(`${vehicle.id}-trip-${index}`, tripPoints.length, isEV, tripRand)
    const last = tripPoints[tripPoints.length - 1]
    const startSeconds = 6 * 3600 + Math.floor(tripRand() * 12 * 3600)
    const day = 1 + Math.floor(tripRand() * 27)
    const month = months[Math.floor(tripRand() * months.length)]
    const alertCount = tripEvents.filter(
      (event) => event.type === "overspeed" || event.type === "harsh_brake" || event.type === "geofence"
    ).length

    return {
      id: `${vehicle.id}-trip-${index + 1}`,
      number: index + 1,
      date: `${ordinal(day)} ${month}, 2026`,
      startTime: formatClock(startSeconds),
      endTime: formatClock(startSeconds + last.elapsedSeconds),
      startSeconds,
      distanceKm: last.distanceKm,
      durationLabel: formatShortDuration(last.elapsedSeconds),
      maxSpeedKmph: Math.max(...tripPoints.map((point) => point.speed)),
      alertCount,
      tripPoints,
      tripEvents,
    }
  })
}

const tripsByVehicleId: Record<string, VehicleTrip[]> = Object.fromEntries(
  mockVehicleRegisterItems.map((vehicle) => [vehicle.id, generateVehicleTrips(vehicle)])
)

export function getVehicleActivity(id: string): VehicleActivity | undefined {
  return activityByVehicleId[id]
}

export function addEnforcementEvent(
  vehicleId: string,
  event: Omit<EnforcementEvent, "id"> & { id?: string }
): EnforcementEvent | undefined {
  const activity = activityByVehicleId[vehicleId]
  if (!activity) return undefined

  const next: EnforcementEvent = {
    ...event,
    id: event.id ?? `${vehicleId}-enf-${Date.now()}`,
  }

  activity.enforcement.history.unshift(next)
  activity.enforcement.count = activity.enforcement.history.length
  activity.enforcement.latest = activity.enforcement.history.slice(0, 2).map((item) => ({
    type: item.type,
    timestamp: item.timestamp,
  }))

  return next
}

export function getVehicleTrips(id: string): VehicleTrip[] {
  return tripsByVehicleId[id] ?? []
}

export function getVehicleStops(id: string): VehicleStop[] {
  return stopCatalogByVehicleId[id]?.stops ?? []
}

export function getVehiclePrimeStops(id: string): VehiclePrimeStop[] {
  return stopCatalogByVehicleId[id]?.primeStops ?? []
}

export function getVehiclePrimeStopHeatMap(spotId: string): ChargeSpotHeatMapData | undefined {
  for (const catalog of Object.values(stopCatalogByVehicleId)) {
    if (catalog.heatMaps[spotId]) return catalog.heatMaps[spotId]
  }
  return undefined
}

export function compassLabel(degrees: number): string {
  const headings = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8
  return headings[index]
}

export function bearingDegrees(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const dLng = ((to.lng - from.lng) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

export function interpolateTrip(
  points: TripPoint[],
  playhead: number
): TripPoint {
  if (points.length === 0) {
    return { lat: 0, lng: 0, speed: 0, distanceKm: 0, elapsedSeconds: 0 }
  }
  if (points.length === 1 || playhead <= 0) return points[0]
  if (playhead >= 1) return points[points.length - 1]

  const scaled = playhead * (points.length - 1)
  const index = Math.floor(scaled)
  const t = scaled - index
  const a = points[index]
  const b = points[Math.min(index + 1, points.length - 1)]

  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
    speed: a.speed + (b.speed - a.speed) * t,
    distanceKm: a.distanceKm + (b.distanceKm - a.distanceKm) * t,
    elapsedSeconds: a.elapsedSeconds + (b.elapsedSeconds - a.elapsedSeconds) * t,
  }
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  return [hours, minutes, remaining]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":")
}

export function getVehicleOverviewImage(vehicleType: VehicleType, category: VehicleCategory): string {
  if (vehicleType === "2 Wheeler") return "/images/2wheeler_overview.svg"
  const typePrefix =
    vehicleType === "3 Wheeler" ? "3_wheeler" : "4_wheeler"
  const suffix = category === "ev" ? "_ev" : ""
  return `/images/${typePrefix}${suffix}.svg`
}

export function getVehicleMarkerIcon(vehicleType: VehicleType, category: VehicleCategory): string {
  const typePrefix =
    vehicleType === "2 Wheeler"
      ? "2_wheeler"
      : vehicleType === "3 Wheeler"
        ? "3_wheeler"
        : "4_wheeler"
  const suffix = category === "ev" ? "_ev" : ""
  return `/images/${typePrefix}${suffix}.svg`
}
