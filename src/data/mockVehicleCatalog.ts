// Vehicle taxonomy for the Pricing Batch creation cascade: Asset Class > Vehicle Type,
// and Manufacturer > Model > Trim.

export interface AssetClass {
  id: string
  name: string
}

export interface VehicleTypeOption {
  id: string
  assetClassId: string
  name: string
}

export interface Manufacturer {
  id: string
  name: string
}

export interface VehicleModel {
  id: string
  manufacturerId: string
  name: string
}

export interface VehicleTrim {
  id: string
  modelId: string
  name: string
}

export const mockAssetClasses: AssetClass[] = [
  { id: "two-wheeler", name: "Two-Wheeler" },
  { id: "three-wheeler", name: "Three-Wheeler" },
  { id: "four-wheeler", name: "Four-Wheeler" },
]

export const mockVehicleTypeOptions: VehicleTypeOption[] = [
  { id: "vt-motorcycle", assetClassId: "two-wheeler", name: "Standard Motorcycle" },
  { id: "vt-scooter", assetClassId: "two-wheeler", name: "Delivery Scooter" },
  { id: "vt-passenger-tricycle", assetClassId: "three-wheeler", name: "Passenger Tricycle" },
  { id: "vt-cargo-tricycle", assetClassId: "three-wheeler", name: "Cargo Tricycle" },
  { id: "vt-sedan", assetClassId: "four-wheeler", name: "Sedan" },
  { id: "vt-pickup", assetClassId: "four-wheeler", name: "Pickup Truck" },
]

export const mockManufacturers: Manufacturer[] = [
  { id: "bajaj", name: "Bajaj" },
  { id: "tvs", name: "TVS" },
  { id: "piaggio", name: "Piaggio" },
  { id: "ekon", name: "Ekon" },
  { id: "jidi", name: "Jidi" },
  { id: "toyota", name: "Toyota" },
]

export const mockVehicleModels: VehicleModel[] = [
  { id: "bajaj-boxer", manufacturerId: "bajaj", name: "Boxer" },
  { id: "bajaj-re-compact", manufacturerId: "bajaj", name: "RE Compact" },
  { id: "tvs-king-deluxe", manufacturerId: "tvs", name: "King Deluxe" },
  { id: "tvs-apache", manufacturerId: "tvs", name: "Apache" },
  { id: "piaggio-ape-city", manufacturerId: "piaggio", name: "Ape City" },
  { id: "piaggio-ape-xtra", manufacturerId: "piaggio", name: "Ape Xtra" },
  { id: "ekon-v2-standard", manufacturerId: "ekon", name: "Ekon V2 Standard" },
  { id: "ekon-v3-pro", manufacturerId: "ekon", name: "Ekon V3 Pro" },
  { id: "jidi-j1", manufacturerId: "jidi", name: "Jidi J1" },
  { id: "jidi-j2-cargo", manufacturerId: "jidi", name: "Jidi J2 Cargo" },
  { id: "toyota-hilux", manufacturerId: "toyota", name: "Hilux" },
  { id: "toyota-corolla", manufacturerId: "toyota", name: "Corolla" },
]

export const mockVehicleTrims: VehicleTrim[] = [
  { id: "bajaj-boxer-standard", modelId: "bajaj-boxer", name: "Standard" },
  { id: "bajaj-boxer-pro", modelId: "bajaj-boxer", name: "Pro" },
  { id: "bajaj-re-compact-standard", modelId: "bajaj-re-compact", name: "Standard" },
  { id: "tvs-king-deluxe-standard", modelId: "tvs-king-deluxe", name: "Standard" },
  { id: "tvs-apache-standard", modelId: "tvs-apache", name: "Standard" },
  { id: "tvs-apache-rtr", modelId: "tvs-apache", name: "RTR" },
  { id: "piaggio-ape-city-standard", modelId: "piaggio-ape-city", name: "Standard" },
  { id: "piaggio-ape-xtra-standard", modelId: "piaggio-ape-xtra", name: "Standard" },
  { id: "ekon-v2-standard-base", modelId: "ekon-v2-standard", name: "Base" },
  { id: "ekon-v3-pro-plus", modelId: "ekon-v3-pro", name: "Plus" },
  { id: "jidi-j1-standard", modelId: "jidi-j1", name: "Standard" },
  { id: "jidi-j2-cargo-standard", modelId: "jidi-j2-cargo", name: "Standard" },
  { id: "toyota-hilux-standard", modelId: "toyota-hilux", name: "Standard" },
  { id: "toyota-hilux-double-cab", modelId: "toyota-hilux", name: "Double Cab" },
  { id: "toyota-corolla-standard", modelId: "toyota-corolla", name: "Standard" },
]
