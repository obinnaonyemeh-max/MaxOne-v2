type StatusBadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "neutral"

export type GeofenceType = "city" | "station" | "office"

export interface LatLng {
  lat: number
  lng: number
}

export interface GeofenceZone {
  center: LatLng
  radius: number // metres
  color: "green" | "orange"
}

export type GeofenceShape =
  | { kind: "circle"; center: LatLng; radius: number }
  | { kind: "polygon"; points: LatLng[] }

export interface GeofenceMetrics {
  visitsPerPeriod: number
  activeVisits: number
  avgDuration: string
  vehicleCount: number
  unauthorizedExits: number
  activeAlerts: number
}

export interface Geofence {
  id: string
  name: string
  type: GeofenceType
  area: string
  shape: GeofenceShape
  zones: GeofenceZone[]
  metrics: GeofenceMetrics
}

export const geofenceTypeBadge: Record<GeofenceType, { label: string; variant: StatusBadgeVariant }> = {
  city: { label: "CITY", variant: "info" },
  station: { label: "SWAP STATION", variant: "success" },
  office: { label: "OFFICE", variant: "warning" },
}

export const totalGeofences = 280

// Centre helpers for common Lagos-area anchors.
const LAGOS: LatLng = { lat: 6.5244, lng: 3.3792 }
const IKEJA: LatLng = { lat: 6.6018, lng: 3.3515 }
const IBADAN: LatLng = { lat: 7.3775, lng: 3.947 }
const SAGAMU: LatLng = { lat: 6.8485, lng: 3.6461 }

const baseGeofences: Omit<Geofence, "metrics">[] = [
  {
    id: "gf-lagos",
    name: "Lagos Geofence",
    type: "city",
    area: "Lagos.",
    shape: { kind: "circle", center: LAGOS, radius: 20000 },
    zones: [
      { center: { lat: 6.535, lng: 3.37 }, radius: 1400, color: "green" },
      { center: { lat: 6.51, lng: 3.39 }, radius: 1500, color: "orange" },
    ],
  },
  {
    id: "gf-ibadan",
    name: "Ibadan Geofence",
    type: "city",
    area: "Ibadan.",
    shape: { kind: "circle", center: IBADAN, radius: 13000 },
    zones: [{ center: { lat: 7.38, lng: 3.95 }, radius: 1200, color: "green" }],
  },
  {
    id: "gf-ikeja-swap",
    name: "Ikeja Swap Station",
    type: "station",
    area: "Lagos.",
    shape: { kind: "circle", center: IKEJA, radius: 3500 },
    zones: [
      { center: { lat: 6.60, lng: 3.35 }, radius: 900, color: "green" },
      { center: { lat: 6.605, lng: 3.36 }, radius: 800, color: "orange" },
    ],
  },
  {
    id: "gf-ikeja-office",
    name: "Ikeja Office",
    type: "station",
    area: "Lagos",
    shape: { kind: "circle", center: { lat: 6.61, lng: 3.34 }, radius: 2200 },
    zones: [{ center: { lat: 6.61, lng: 3.34 }, radius: 700, color: "orange" }],
  },
  {
    id: "gf-max-hq",
    name: "Max Head Office",
    type: "office",
    area: "Lagos.",
    shape: { kind: "circle", center: { lat: 6.44, lng: 3.42 }, radius: 3000 },
    zones: [{ center: { lat: 6.44, lng: 3.42 }, radius: 900, color: "orange" }],
  },
  {
    id: "gf-sagamu-1",
    name: "Sagamu Geofence",
    type: "city",
    area: "Ogun.",
    shape: { kind: "circle", center: SAGAMU, radius: 7000 },
    zones: [
      { center: { lat: 6.85, lng: 3.64 }, radius: 1100, color: "green" },
      { center: { lat: 6.84, lng: 3.66 }, radius: 1000, color: "orange" },
    ],
  },
  {
    id: "gf-sagamu-2",
    name: "Sagamu Geofence",
    type: "city",
    area: "Ogun.",
    shape: { kind: "circle", center: { lat: 6.75, lng: 3.55 }, radius: 5000 },
    zones: [{ center: { lat: 6.75, lng: 3.55 }, radius: 900, color: "green" }],
  },
  {
    id: "gf-ilupeju-office",
    name: "Ilupeju Max Office",
    type: "office",
    area: "Lagos.",
    shape: { kind: "circle", center: { lat: 6.556, lng: 3.359 }, radius: 1800 },
    zones: [{ center: { lat: 6.556, lng: 3.359 }, radius: 600, color: "orange" }],
  },
  {
    id: "gf-lekki",
    name: "Lekki Geofence",
    type: "city",
    area: "Lagos.",
    shape: { kind: "circle", center: { lat: 6.4698, lng: 3.5852 }, radius: 6000 },
    zones: [{ center: { lat: 6.47, lng: 3.58 }, radius: 1200, color: "green" }],
  },
  {
    id: "gf-berger-swap",
    name: "Berger Swap Station",
    type: "station",
    area: "Lagos.",
    shape: { kind: "circle", center: { lat: 6.65, lng: 3.38 }, radius: 2000 },
    zones: [{ center: { lat: 6.65, lng: 3.38 }, radius: 700, color: "green" }],
  },
]

// Derive per-geofence activity metrics (shown in the expanded card + hover tooltip).
function deriveMetrics(index: number): GeofenceMetrics {
  return {
    visitsPerPeriod: 180 + index * 26,
    activeVisits: 12 + index * 3,
    avgDuration: "1 hr 30 min",
    vehicleCount: 120 + index * 60,
    unauthorizedExits: index % 4,
    activeAlerts: index % 3 === 0 ? 0 : index % 3,
  }
}

export const mockGeofences: Geofence[] = baseGeofences.map((g, i) => ({
  ...g,
  metrics: deriveMetrics(i),
}))

// Rough centre of every geofence for map-fitting and fly-to.
export function geofenceCenter(gf: Geofence): LatLng {
  if (gf.shape.kind === "circle") return gf.shape.center
  const pts = gf.shape.points
  const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length
  const lng = pts.reduce((s, p) => s + p.lng, 0) / pts.length
  return { lat, lng }
}

// Fallback: default map centre.
export { LAGOS as defaultGeofenceCenter }
