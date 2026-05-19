export interface ManufacturerRecord {
  id: string
  name: string
  brand: string
  country: string
  contact: string
  status: "active" | "inactive"
}

export interface VehicleTypeRecord {
  id: string
  model: string
  manufacturer: string
  trim: string
  category: string
  battery: string
  range: string
}

export interface ModelRecord {
  id: string
  manufacturer: string
  modelName: string
}

export interface TrimRecord {
  id: string
  model: string
  trimName: string
}

export const mockManufacturers = [
  { id: "1", name: "King", brand: "MAX M4", country: "China", contact: "Kay", status: "active" },
  { id: "2", name: "Spiro", brand: "Ekon", country: "China", contact: "John", status: "active" },
  { id: "3", name: "TailG", brand: "Jidi", country: "China", contact: "James", status: "active" },
] satisfies ManufacturerRecord[]

export const mockVehicleTypes = [
  { id: "1", model: "Ekon", manufacturer: "Spiro", trim: "Ekon V2", category: "Electric Vehicle", battery: "3.3kWh", range: "400km" },
  { id: "2", model: "Jidi", manufacturer: "TailG", trim: "V1", category: "Electric Vehicle", battery: "3.3kWh", range: "400km" },
  { id: "3", model: "MAX M4", manufacturer: "King", trim: "MM4", category: "Internal Combustion Engine", battery: "60kWh", range: "400km" },
] satisfies VehicleTypeRecord[]

export const mockModels = [
  { id: "1", manufacturer: "Spiro", modelName: "Ekon" },
  { id: "2", manufacturer: "TailG", modelName: "Jidi" },
  { id: "3", manufacturer: "King", modelName: "MAX M4" },
] satisfies ModelRecord[]

export const mockTrims = [
  { id: "1", model: "Ekon", trimName: "Ekon V2" },
  { id: "2", model: "Jidi", trimName: "V1" },
  { id: "3", model: "MAX M4", trimName: "MM4" },
] satisfies TrimRecord[]
