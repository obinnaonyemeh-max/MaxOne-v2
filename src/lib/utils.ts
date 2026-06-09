import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function vehicleTypeLabel(type: string): string {
  if (type.includes("2")) return "2 Wheeler"
  if (type.includes("3")) return "3 Wheeler"
  if (type.includes("4")) return "4 Wheeler"
  return type
}
