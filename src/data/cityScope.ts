import { CITIES } from "@/data/cities"

export type CityId = "Lagos"
export type CountryId = "Nigeria"

/** Neighborhoods / yards treated as Lagos sub-cities for city-scoped dashboards. */
export const LAGOS_SUBCITIES = [
  "Ikeja",
  "Lekki",
  "Victoria Island",
  "Surulere",
  "Yaba",
  "Ajah",
  "Ikorodu",
  "Oshodi",
  "Agege",
  "Gbagada",
] as const
export type LagosSubCity = (typeof LAGOS_SUBCITIES)[number]

const LAGOS_TOKENS = [
  "lagos",
  "lagos hub",
  "lagos, nigeria",
  "nigeria / lagos",
  "ikeja",
  "ikeja yard",
  "lekki",
  "victoria island",
  "surulere",
  "surulere yard",
  "yaba",
  "ajah",
  "ikorodu",
  "oshodi",
  "agege",
  "gbagada",
]

const CITY_TOKENS: Record<CityId, string[]> = {
  Lagos: LAGOS_TOKENS,
}

const NIGERIA_TOKENS = [
  ...LAGOS_TOKENS,
  ...CITIES.map((city) => city.toLowerCase()),
  "ogun",
  "osun",
  "ondo",
  "nigeria",
  "abuja",
  "fct",
  "port harcourt",
  "kano",
  "enugu",
  "aba",
  "abia",
  "rivers",
]

const COUNTRY_TOKENS: Record<CountryId, string[]> = {
  Nigeria: NIGERIA_TOKENS,
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function matchesTokens(value: string | null | undefined, tokens: string[]): boolean {
  if (!value) return false
  const normalized = normalize(value)
  return tokens.some((token) => normalized === token || normalized.includes(token))
}

/** True when a location / destination string belongs to the given city. */
export function isInCityScope(value: string | null | undefined, city: CityId): boolean {
  return matchesTokens(value, CITY_TOKENS[city])
}

/** True when a location belongs to the given country (Nigeria cities, states, and Lagos tokens). */
export function isInCountryScope(
  value: string | null | undefined,
  country: CountryId
): boolean {
  return matchesTokens(value, COUNTRY_TOKENS[country])
}

/** Map a Lagos location string to its sub-city, or null if it is not a known neighborhood. */
export function resolveLagosSubCity(value: string | null | undefined): LagosSubCity | null {
  if (!value) return null
  const normalized = normalize(value)
  if (normalized.includes("lekki")) return "Lekki"
  if (normalized.includes("victoria island")) return "Victoria Island"
  if (normalized.includes("surulere")) return "Surulere"
  if (normalized.includes("ikeja")) return "Ikeja"
  if (normalized.includes("yaba")) return "Yaba"
  if (normalized.includes("ajah")) return "Ajah"
  if (normalized.includes("ikorodu")) return "Ikorodu"
  if (normalized.includes("oshodi")) return "Oshodi"
  if (normalized.includes("agege")) return "Agege"
  if (normalized.includes("gbagada")) return "Gbagada"
  return null
}
