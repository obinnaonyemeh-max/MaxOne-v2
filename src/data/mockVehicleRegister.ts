import { CITIES, CITY_COORDINATES } from "./cities"

export type TrackingStatus = "moving" | "stopped" | "offline" | "pending"
export type CheckStatus = "checked-out" | "checked-in"
export type VehicleCategory = "ev" | "ice"
export type VehicleType = "2 Wheeler" | "3 Wheeler" | "4 Wheeler"
export type Financier = "MAX Capital" | "Sterling Bank" | "LAPO MFB" | "Access Bank"
export type Brand = "TVS" | "Bajaj" | "Piaggio" | "Ekon" | "Jidi"
export type LifecycleStatus = "Exit" | "Active" | "Inbound" | "Operational Fleet" | "3PL Check-in" | "Yard Check-in"

export interface VehicleRegisterItem {
  id: string
  plateNumber: string
  category: VehicleCategory
  trackingStatus: TrackingStatus
  checkStatus: CheckStatus
  coordinates: { lat: number; lng: number }
  lastUpdate: string
  city: string
  vehicleType: VehicleType
  financier: Financier
  brand: Brand
  lifecycleStatus: LifecycleStatus
  vehicleModel: string
  assignedDriver?: string
  speed?: number
  batchNumber?: string
  driverSafetyScore: number
  signalStrength: number
  lastSeen: string
  batterySoC?: number
}

export interface TrackingStatusCount {
  status: TrackingStatus
  label: string
  count: number
  color: string
}

export { CITIES }
export const VEHICLE_TYPES: VehicleType[] = ["2 Wheeler", "3 Wheeler", "4 Wheeler"]
export const FINANCIERS: Financier[] = ["MAX Capital", "Sterling Bank", "LAPO MFB", "Access Bank"]
export const BRANDS: Brand[] = ["TVS", "Bajaj", "Piaggio", "Ekon", "Jidi"]
export const LIFECYCLE_STATUSES: LifecycleStatus[] = ["Exit", "Active", "Inbound", "Operational Fleet", "3PL Check-in", "Yard Check-in"]

function randomInRange(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance
}

function generatePlateNumber(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const randomLetters = () => letters[Math.floor(Math.random() * letters.length)]
  const randomDigits = () => Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `${randomLetters()}${randomLetters()}${randomDigits()}${randomLetters()}${randomLetters()}${randomLetters()}`
}

const evModels = [
  { brand: "Ekon" as Brand, model: "Ekon V2 Standard", type: "2 Wheeler" as VehicleType },
  { brand: "Ekon" as Brand, model: "Ekon V3 Pro", type: "2 Wheeler" as VehicleType },
  { brand: "Jidi" as Brand, model: "Jidi V1 Standard", type: "2 Wheeler" as VehicleType },
  { brand: "Jidi" as Brand, model: "Jidi V2 Cargo", type: "2 Wheeler" as VehicleType },
  { brand: "Ekon" as Brand, model: "Ekon Trike E3", type: "3 Wheeler" as VehicleType },
  { brand: "Jidi" as Brand, model: "Jidi EV Van", type: "4 Wheeler" as VehicleType },
]

const iceModels = [
  { brand: "TVS" as Brand, model: "TVS King Deluxe", type: "3 Wheeler" as VehicleType },
  { brand: "TVS" as Brand, model: "TVS Apache RTR", type: "2 Wheeler" as VehicleType },
  { brand: "Bajaj" as Brand, model: "Bajaj RE Compact", type: "3 Wheeler" as VehicleType },
  { brand: "Bajaj" as Brand, model: "Bajaj Pulsar NS", type: "2 Wheeler" as VehicleType },
  { brand: "Piaggio" as Brand, model: "Piaggio Ape City", type: "3 Wheeler" as VehicleType },
  { brand: "Piaggio" as Brand, model: "Piaggio Porter", type: "4 Wheeler" as VehicleType },
]

const driverNames = [
  "Chukwuemeka Obi", "Adebayo Adeyemi", "Ibrahim Musa", "Oluwaseun Ajayi",
  "Chidera Nwankwo", "Kayode Ogundimu", "Murtala Abdullahi", "Tunde Bakare",
  "Emeka Eze", "Yusuf Garba", "Bola Adeniyi", "Ahmed Suleiman",
  "Peter Okolie", "Femi Adewale", "Uche Okoro", "Hassan Bello",
]

function generateVehicle(index: number): VehicleRegisterItem {
  const isEV = Math.random() < 0.35
  const models = isEV ? evModels : iceModels
  const selectedModel = models[Math.floor(Math.random() * models.length)]
  
  const cityName = CITIES[Math.floor(Math.random() * CITIES.length)]
  const cityCoord = CITY_COORDINATES[cityName]
  
  const trackingStatuses: TrackingStatus[] = ["moving", "stopped", "offline", "pending"]
  const trackingWeights = [0.43, 0.34, 0.15, 0.08]
  let rand = Math.random()
  let trackingStatus: TrackingStatus = "moving"
  let cumulative = 0
  for (let i = 0; i < trackingWeights.length; i++) {
    cumulative += trackingWeights[i]
    if (rand <= cumulative) {
      trackingStatus = trackingStatuses[i]
      break
    }
  }

  const checkStatus: CheckStatus = Math.random() < 0.54 ? "checked-out" : "checked-in"
  const lifecycleStatus = LIFECYCLE_STATUSES[Math.floor(Math.random() * LIFECYCLE_STATUSES.length)]
  const financier = FINANCIERS[Math.floor(Math.random() * FINANCIERS.length)]

  const day = Math.floor(Math.random() * 28) + 1
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  const second = Math.floor(Math.random() * 60)
  const lastUpdate = `${day} Aug 2026, ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")} WAT`

  const lastSeenMinutes = Math.floor(Math.random() * 120) + 1
  const lastSeenText = lastSeenMinutes < 60 
    ? `${lastSeenMinutes} min ago` 
    : `${Math.floor(lastSeenMinutes / 60)} hr ${lastSeenMinutes % 60} min ago`

  return {
    id: `VEH-${(1000000 + index).toString().slice(1)}`,
    plateNumber: generatePlateNumber(),
    category: isEV ? "ev" : "ice",
    trackingStatus,
    checkStatus,
    coordinates: {
      lat: randomInRange(cityCoord.lat, cityCoord.variance),
      lng: randomInRange(cityCoord.lng, cityCoord.variance),
    },
    lastUpdate,
    city: cityName,
    vehicleType: selectedModel.type,
    financier,
    brand: selectedModel.brand,
    lifecycleStatus,
    vehicleModel: selectedModel.model,
    assignedDriver: checkStatus === "checked-out" ? driverNames[Math.floor(Math.random() * driverNames.length)] : undefined,
    speed: trackingStatus === "moving" ? Math.floor(Math.random() * 60) + 10 : undefined,
    batchNumber: `BATCH-${Math.floor(Math.random() * 100) + 2024}`,
    driverSafetyScore: Math.floor(Math.random() * 50) + 50,
    signalStrength: Math.floor(Math.random() * 60) + 40,
    lastSeen: lastSeenText,
    batterySoC: isEV ? Math.floor(Math.random() * 80) + 20 : undefined,
  }
}

export const mockVehicleRegisterItems: VehicleRegisterItem[] = Array.from(
  { length: 50 },
  (_, i) => generateVehicle(i)
)

export const trackingStatusCounts: TrackingStatusCount[] = [
  { status: "moving", label: "Moving", count: mockVehicleRegisterItems.filter(v => v.trackingStatus === "moving").length, color: "#22C55E" },
  { status: "stopped", label: "Stopped", count: mockVehicleRegisterItems.filter(v => v.trackingStatus === "stopped").length, color: "#EAB308" },
  { status: "offline", label: "Offline", count: mockVehicleRegisterItems.filter(v => v.trackingStatus === "offline").length, color: "#EF4444" },
  { status: "pending", label: "Pending", count: mockVehicleRegisterItems.filter(v => v.trackingStatus === "pending").length, color: "#6B7280" },
]

export const checkedOutCount = mockVehicleRegisterItems.filter(v => v.checkStatus === "checked-out").length
export const checkedInCount = mockVehicleRegisterItems.filter(v => v.checkStatus === "checked-in").length
export const totalVehicles = mockVehicleRegisterItems.length

export function getVehicleById(id: string): VehicleRegisterItem | undefined {
  return mockVehicleRegisterItems.find((vehicle) => vehicle.id === id)
}
