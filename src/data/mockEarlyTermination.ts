// Mock data for Portfolio > Products & Pricing > Early Termination Engine (Overview tab).
// A settlement calculator: for a selected contract, analyses component-level recovery
// from its pricing template, remittance breakdown, and amortisation schedule.

export type EarlyTerminationContractStatus = "Active" | "Paused" | "Completed"

export interface EarlyTerminationContract {
  id: string
  countryId: string
  countryName: string
  customerName: string
  contractNumber: string
  vehicleManufacturer: string
  vehicleModel: string
  vehicleTypeLabel: string
  vehiclePlate: string
  pricingTemplateName: string
  startDate: string
  tenorMonths: number
  dailyRemittance: number
  collectionDaysPerMonth: number
  actualCollections: number
  totalContractRevenue: number
  applicableCredits: number
  outstandingDPD: number
  status: EarlyTerminationContractStatus
}

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "yard"

export const earlyTerminationStatusVariantMap: Record<EarlyTerminationContractStatus, BadgeVariant> = {
  Active: "success",
  Paused: "warning",
  Completed: "default",
}

export const mockEarlyTerminationContracts: EarlyTerminationContract[] = [
  {
    id: "1",
    countryId: "ng",
    countryName: "Nigeria",
    customerName: "Kwame Mensah",
    contractNumber: "CTR-ET-20454",
    vehicleManufacturer: "Bajaj",
    vehicleModel: "Boxer",
    vehicleTypeLabel: "3-Wheeler · ICE",
    vehiclePlate: "LAG-304ER",
    pricingTemplateName: "ICE Tricycle · Keke Fleet",
    startDate: "15 Dec 2025",
    tenorMonths: 24,
    dailyRemittance: 9000,
    collectionDaysPerMonth: 26,
    actualCollections: 1274595,
    totalContractRevenue: 5616000,
    applicableCredits: 54699,
    outstandingDPD: 0,
    status: "Active",
  },
  {
    id: "2",
    countryId: "ng",
    countryName: "Nigeria",
    customerName: "Kwame Mensah",
    contractNumber: "CTR-ET-20461",
    vehicleManufacturer: "TVS",
    vehicleModel: "King Deluxe",
    vehicleTypeLabel: "3-Wheeler · ICE",
    vehiclePlate: "LAG-118KD",
    pricingTemplateName: "ICE Tricycle · Keke Fleet",
    startDate: "02 Feb 2026",
    tenorMonths: 20,
    dailyRemittance: 7800,
    collectionDaysPerMonth: 26,
    actualCollections: 486720,
    totalContractRevenue: 4056000,
    applicableCredits: 0,
    outstandingDPD: 4,
    status: "Active",
  },
  {
    id: "3",
    countryId: "ng",
    countryName: "Nigeria",
    customerName: "Fatima Bello",
    contractNumber: "CTR-ET-20488",
    vehicleManufacturer: "Ekon",
    vehicleModel: "V2 Standard",
    vehicleTypeLabel: "2-Wheeler · EV",
    vehiclePlate: "ABJ-772FB",
    pricingTemplateName: "Two-Wheeler — Standard",
    startDate: "20 Jan 2026",
    tenorMonths: 20,
    dailyRemittance: 5350,
    collectionDaysPerMonth: 26,
    actualCollections: 305900,
    totalContractRevenue: 2782000,
    applicableCredits: 12500,
    outstandingDPD: 0,
    status: "Active",
  },
  {
    id: "4",
    countryId: "ke",
    countryName: "Kenya",
    customerName: "Amina Otieno",
    contractNumber: "CTR-ET-20502",
    vehicleManufacturer: "Piaggio",
    vehicleModel: "Ape Xtra",
    vehicleTypeLabel: "3-Wheeler · ICE",
    vehiclePlate: "KE-441MB",
    pricingTemplateName: "Three-Wheeler — Standard",
    startDate: "10 Nov 2025",
    tenorMonths: 24,
    dailyRemittance: 10500,
    collectionDaysPerMonth: 26,
    actualCollections: 1890000,
    totalContractRevenue: 6552000,
    applicableCredits: 30000,
    outstandingDPD: 0,
    status: "Active",
  },
  {
    id: "5",
    countryId: "ug",
    countryName: "Uganda",
    customerName: "Grace Namuli",
    contractNumber: "CTR-ET-20519",
    vehicleManufacturer: "TVS",
    vehicleModel: "King Deluxe",
    vehicleTypeLabel: "2-Wheeler · ICE",
    vehiclePlate: "UG-903JN",
    pricingTemplateName: "Two-Wheeler — Standard",
    startDate: "05 Mar 2026",
    tenorMonths: 18,
    dailyRemittance: 4900,
    collectionDaysPerMonth: 26,
    actualCollections: 191100,
    totalContractRevenue: 2293200,
    applicableCredits: 0,
    outstandingDPD: 9,
    status: "Paused",
  },
  {
    id: "6",
    countryId: "gh",
    countryName: "Ghana",
    customerName: "Kojo Asante",
    contractNumber: "CTR-ET-20533",
    vehicleManufacturer: "Toyota",
    vehicleModel: "Hilux",
    vehicleTypeLabel: "4-Wheeler · ICE",
    vehiclePlate: "GH-227AK",
    pricingTemplateName: "Four-Wheeler — Standard",
    startDate: "18 Sep 2025",
    tenorMonths: 30,
    dailyRemittance: 19800,
    collectionDaysPerMonth: 26,
    actualCollections: 4980000,
    totalContractRevenue: 15444000,
    applicableCredits: 85000,
    outstandingDPD: 0,
    status: "Active",
  },
]
