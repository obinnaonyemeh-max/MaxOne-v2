type StatusBadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "neutral"

export type TechnicianStatus = "Available" | "On Job" | "Off Duty"

export interface Technician {
  id: string
  name: string
  specialty: string
  city: string
  status: TechnicianStatus
}

export const technicianStatusVariantMap: Record<TechnicianStatus, StatusBadgeVariant> = {
  Available: "success",
  "On Job": "warning",
  "Off Duty": "neutral",
}

export const mockTechnicians: Technician[] = [
  { id: "TECH-001", name: "Daniel Amokachi", specialty: "Tracker & Wiring", city: "Lagos", status: "Available" },
  { id: "TECH-002", name: "Sarah Johnson", specialty: "Battery Systems", city: "Lagos", status: "Available" },
  { id: "TECH-003", name: "Michael Chen", specialty: "Relay & Immobiliser", city: "Abuja", status: "On Job" },
  { id: "TECH-004", name: "Fatima Bello", specialty: "Tracker & Wiring", city: "Port Harcourt", status: "Available" },
  { id: "TECH-005", name: "Chidi Okafor", specialty: "Field Recovery", city: "Lagos", status: "Off Duty" },
  { id: "TECH-006", name: "Aisha Mohammed", specialty: "Battery Systems", city: "Kano", status: "Available" },
  { id: "TECH-007", name: "Emeka Nwosu", specialty: "Relay & Immobiliser", city: "Enugu", status: "On Job" },
  { id: "TECH-008", name: "Grace Okafor", specialty: "Field Recovery", city: "Abuja", status: "Available" },
  { id: "TECH-009", name: "Tunde Bakare", specialty: "Tracker & Wiring", city: "Lagos", status: "On Job" },
  { id: "TECH-010", name: "Ngozi Eze", specialty: "Field Recovery", city: "Aba", status: "Available" },
  { id: "TECH-011", name: "Ibrahim Yusuf", specialty: "Battery Systems", city: "Abuja", status: "Off Duty" },
  { id: "TECH-012", name: "Funmilayo Ade", specialty: "Relay & Immobiliser", city: "Lagos", status: "Available" },
]
