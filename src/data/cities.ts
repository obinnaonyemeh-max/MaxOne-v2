export const CITIES = [
  "Lagos",
  "Sagamu",
  "Ibadan",
  "Abeokuta",
  "Sango Ota",
  "Osogbo",
  "Akure",
] as const

export type City = (typeof CITIES)[number]

export const CITY_FILTER_OPTIONS = CITIES.map((city) => ({
  value: city,
  label: city,
}))

export const CITY_HUB_OPTIONS = CITIES.map((city) => ({
  value: `${city} Hub`,
  label: `${city} Hub`,
}))

export const CITY_DEPOT_OPTIONS = CITIES.map((city) => ({
  value: `${city} Depot`,
  label: `${city} Depot`,
}))

export const CITY_DESTINATION_OPTIONS = CITIES.map((city) => ({
  value: `Nigeria / ${city}`,
  label: `Nigeria / ${city}`,
}))

export const CITY_COORDINATES: Record<City, { lat: number; lng: number; variance: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792, variance: 0.15 },
  Sagamu: { lat: 6.8322, lng: 3.6319, variance: 0.08 },
  Ibadan: { lat: 7.3775, lng: 3.947, variance: 0.12 },
  Abeokuta: { lat: 7.1475, lng: 3.3619, variance: 0.08 },
  "Sango Ota": { lat: 6.6989, lng: 3.2309, variance: 0.08 },
  Osogbo: { lat: 7.7827, lng: 4.5418, variance: 0.08 },
  Akure: { lat: 7.2571, lng: 5.2058, variance: 0.08 },
}

export const CITY_LIVE_ADDRESSES: Record<string, string> = {
  Lagos: "Lekki—Epe Expressway, Ajah",
  Sagamu: "Abeokuta Expressway, Sagamu Interchange",
  Ibadan: "Ring Road, Challenge",
  Abeokuta: "Ibara, Oke-Ilewo",
  "Sango Ota": "Lagos-Abeokuta Expressway, Sango",
  Osogbo: "Oke Fia, Gbongan Road",
  Akure: "Oba Adesida Road, Alagbaka",
}
