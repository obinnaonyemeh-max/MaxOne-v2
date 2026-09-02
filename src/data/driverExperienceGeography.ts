import type { RoleDataScope } from "./rolePermissions"

export type DriverExperienceGeographyLevel = "city" | "subcity"

export function geographyLevelForScope(
  scope: RoleDataScope | null
): DriverExperienceGeographyLevel {
  return scope?.type === "city" ? "subcity" : "city"
}

export function geographyLabel(
  level: DriverExperienceGeographyLevel
): "City" | "Subcity" {
  return level === "subcity" ? "Subcity" : "City"
}
